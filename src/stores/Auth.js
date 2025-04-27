import { defineStore } from 'pinia';
import axios from 'axios';
import { useStorage } from '@vueuse/core';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import * as PusherPushNotifications from '@pusher/push-notifications-web';

export const useAuthStore = defineStore('Auth', {
  state: () => ({
    authUser: useStorage('authUser', {}),
    authenticated: useStorage('authenticated', false),
    userPermissions: useStorage('userPermissions', []),
    authErrors: [],
    role: '',
    token: useStorage('token', null),
    msg: '',
    loading: ref(false),
    router: useRouter(),
  }),
  getters: {
    user: (state) => state.authUser,
    permissions: (state) => state.userPermissions,
    errors: (state) => state.authErrors,
    successMsg: (state) => state.msg,
  },
  actions: {
    async getUser() {
      if (this.authenticated && this.authUser) {
        try {
          const response = await axios.get('api/get-user');
          this.authUser = response.data.data.user;
          this.userPermissions = response.data.data.permissions;
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    },
    async handleLogin(data) {
      this.authErrors = [];
      this.loading = true;
      this.resetAuthStore();

      try {
        const response = await axios.post('/api/Auth/Login', {
          username: data.username,
          password: data.password,
        });

        // Check if the login was successful
        if (response.data.status && response.data.data?.token) {
          this.authenticated = true;
          this.token = response.data.data.token;
          this.authUser = {
            fullName: response.data.data.fullName,
            username: response.data.data.username,
            roleId: response.data.data.roleId,
            roleName: response.data.data.roleName,
          };
          this.userPermissions = Object.keys(response.data.data).filter(
            (key) => key.startsWith('page:') && response.data.data[key] === 'true'
          );

          // Initialize Pusher Beams
          const beamsTokenProvider = new PusherPushNotifications.TokenProvider({
            url: `${import.meta.env.VITE_API}/pusher/beams-auth`,
            queryParams: {
              user_id: `${response.data.data.roleId}`,
            },
            headers: {
              Authorization: `Bearer ${response.data.data.token}`,
              Accept: 'application/json',
              'Access-Control-Allow-Origin': '*',
              Origin: import.meta.env.VITE_URI,
            },
          });

          const beamsClient = new PusherPushNotifications.Client({
            instanceId: '140343aa-f173-4a2d-940a-7724c7c12be1',
          });

          beamsClient
            .start()
            .then(() => {
              beamsClient.setUserId(`"${response.data.data.roleId}"`, beamsTokenProvider);
            })
            .catch((error) => {
              console.error('Pusher Beams error:', error);
            });

          this.router.push({ name: 'dashboard' });
        } else {
          this.authErrors = ['Invalid credentials. Please try again.'];
        }
      } catch (error) {
        if (error.response) {
          // Handle server validation errors
          if (error.response.status === 422) {
            this.authErrors = error.response.data.errors
              ? Object.values(error.response.data.errors).flat()
              : ['Validation failed. Please check your inputs.'];
          } else if (error.response.status === 401) {
            this.authErrors = ['Invalid email or password.'];
          } else {
            this.authErrors = [error.response.data.message || 'An error occurred during login.'];
          }
        } else if (error.request) {
          // The request was made but no response was received
          this.authErrors = ['Network error. Please check your connection.'];
        } else {
          // Something happened in setting up the request
          this.authErrors = ['An unexpected error occurred. Please try again.'];
        }
      } finally {
        this.loading = false;
      }
    },
    async handleRegister(data) {
      if (this.loading) return;
      this.resetAuthStore();
      this.loading = true;

      try {
        const response = await axios.post('/api/register', {
          name: data.name,
          email: data.email,
          password: data.password,
          password_confirmation: data.password_confirmation,
        });

        this.authenticated = true;
        this.token = response.data.token;
        this.authUser = response.data.user;
        this.router.push({ name: 'Home' });
      } catch (error) {
        if (error.response?.status === 422) {
          this.authErrors = error.response.data.errors
            ? Object.values(error.response.data.errors).flat()
            : ['Validation failed. Please check your inputs.'];
        } else {
          this.authErrors = [error.response?.data?.message || 'Registration failed. Please try again.'];
        }
      } finally {
        this.loading = false;
      }
    },
    async handleLogout() {
      try {
        await axios.post('/api/logout');
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        this.resetAuthStore();
        this.router.push({ name: 'Login' });
      }
    },
    async forgotPassword(data) {
      try {
        this.resetAuthStore();
        const response = await axios.post('/api/forgot-password', {
          email: data.email,
        });
        this.msg = response.data.status;
        this.router.push({ name: 'ResetPassword' });
      } catch (error) {
        if (error.response?.status === 422) {
          this.authErrors = Object.values(error.response.data.errors).flat();
        } else {
          this.authErrors = [error.response?.data?.message || 'Password reset request failed.'];
        }
      }
    },
    async resetPassword(data) {
      try {
        await axios.post('/api/reset-password', data);
        this.router.push({ name: 'Login' });
      } catch (error) {
        if (error.response?.status === 422) {
          this.authErrors = Object.values(error.response.data.errors).flat();
        } else {
          this.authErrors = [error.response?.data?.message || 'Password reset failed.'];
        }
      }
    },
    resetAuthStore() {
      this.authUser = {};
      this.token = null;
      this.authenticated = false;
      this.userPermissions = [];
      this.authErrors = [];
      this.msg = '';
      this.loading = false;
    },
  },
});
