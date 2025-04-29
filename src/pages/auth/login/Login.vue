<template>
  <Navbar :page="page" />
  <div class="flex justify-center items-center h-[87vh] gap-[1.5%]">
    <div class="bg-[var(--bgColor)] h-[70vh] w-[28%] p-14 rounded-xl text-white login flex justify-center flex-col">
      <img src="../../../assets/logo.webp" alt="" width="90%" class="xl:hidden">
      <h1 class="text-[clamp(1rem,3vw,3rem)] text-[var(--textColor)]">{{ t('pages.welcome_message') }}</h1>

      <!-- Login Form -->
      <form class="text-[#1976d2] font-bold flex flex-col gap-2 mt-3 text-xs space-y-10">
        <div v-if="authStore.authErrors.length" class="alert alert-danger text-red-500 mb-5">
          {{ authStore.authErrors }}
        </div>

        <div>
          <p>username</p>
          <input id="username" type="text"
            class="w-full h-14 border-[#1976d2] border-1 text-black font-normal px-[10px]" v-model="form.username"
            @input="clearErrors" required autofocus>
            <p v-if="req" class="text-red-600 text-end mt-1">required *</p>
        </div>

        <div>
          <p>password</p>
          <input id="password" type="password"
            class="w-full h-14 border-[#1976d2] border-1 text-black font-normal px-[10px]" v-model="form.password"
            @input="clearErrors" required>
            <p v-if="req" class="text-red-600 text-end mt-1">required *</p>
        </div>

        <div class="mt-11">
          <p class="text-xs text-end mb-1">
            <a href="#">forgot password</a>
          </p>
          <button type="submit" class="bg-[#1976d2] text-white py-2.5 w-full rounded-lg cursor-pointer"
            :disabled="!formReady" @click.prevent="onsubmit">
             login
          </button>
        </div>
      </form>
    </div>

    <div class="mainPhoto">
      <img src="../../../assets/logo.webp" alt="" class="absolute right-4 top-6 z-40 w-48">
    </div>
  </div>
  <footer class="text-center text-white mb-[6px] text-sm">
    {{ t('pages.all_rights_reserved') }}
  </footer>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../../stores/Auth'
import Navbar from '../../../components/navbar/Navbar.vue'
const { t } = useI18n()
const page = ref('login')
const req = ref(false)
const form = ref({
  username: '',
  password: '',
})

const authStore = useAuthStore()
const router = useRouter()
const emailErrors = ref<string[]>([])
const passwordErrors = ref<string[]>([])

const formReady = computed(() => !emailErrors.value.length && !passwordErrors.value.length)

function clearErrors() {
  emailErrors.value = []
  passwordErrors.value = []
}

function onsubmit() {
  if (!formReady.value) return
  req.value = true;
  if (formReady.value) {
    authStore.handleLogin(form.value)
      .then(() => router.push({ name: 'dashboard' }))
      .catch(error => console.error(error))
  }
}
</script>

<style>
.mainPhoto {
  background-image: url('@/assets/login-bg.jpg');
  position: relative;
  height: 70vh;
  width: 63%;
  background-size: cover;
}

.mainPhoto::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #008cff4b;
  pointer-events: none;
}

@media (max-width:1281px) {
  .mainPhoto {
    display: none;
  }

  .login {
    width: 40%;
  }
}

@media (max-width:881px) {
  .login {
    min-width: 70%;
    height: auto;
  }
}
</style>
