import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import AuthLayout from '../layouts/AuthLayout.vue'
import AppLayout from '../layouts/AppLayout.vue'
import Page404Layout from '../layouts/Page404Layout.vue'

import RouteViewComponent from '../layouts/RouterBypass.vue'
import UIRoute from '../pages/admin/ui/route'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:catchAll(.*)',
    redirect: { name: 'dashboard' },
  },

  // {
  //   name: 'invioce',
  //   path: '/invioce/:id',
  //   component: () => import('../pages/admin/settings/order/invioce.vue'),
  // },
  // {
  //   name: 'home',
  //   path: '/',
  //   component: () => import('../pages/admin/frontend/pages/home.vue'),
  // },
  {
    name: 'admin',
    path: '/admin',
    component: AppLayout,
    beforeEnter: auth,
    children: [

      {
        name: 'dashboard',
        path: 'dashboard',
        component: () => import('../pages/admin/dashboard/Dashboard.vue'),
      },


      {
        name: 'roles',
        path: 'roles',
        component: () => import('../pages/admin/roles/index.vue'),
      },
      {
        name: 'roles-update',
        path: 'roles-update/:id',
        component: () => import('../pages/admin/roles/update.vue'),
      },
      {
        name: 'roles-create',
        path: 'roles-create',
        component: () => import('../pages/admin/roles/create.vue'),
      },
      {
        name: 'Permission',
        path: 'Permission',
        component: () => import('../pages/admin/Permissions/index.vue'),
      },
      {
        name: 'statistics',
        path: 'users_management',
        // component: RouteViewComponent,
        children: [
          {
            name: 'users',
            path: 'users',
            component: () => import('../pages/admin/users/users.vue'),
          },
          {
            name: 'user-edite',
            path: 'user-edite/:id',
            component: () => import('../pages/admin/users/edite.vue'),
          },
          {
            name: 'user-create',
            path: 'user-create',
            component: () => import('../pages/admin/users/create.vue'),
          },

          {
            name: 'tourist',
            path: 'tourist',
            component: () => import('../pages/admin/torist/index.vue'),
          },
          {
            name: 'tourist-show',
            path: 'tourist-show/:id',
            component: () => import('../pages/admin/torist/show.vue'),
          },
        ],
      },
      {
        name: 'tourism-management',
        path: 'product',
        // component: RouteViewComponent,
        children: [
          {
            path: '/product/:id?', // optional id parameter
            name: 'product',       // this name must match what you're using
            component: () => import('../pages/admin/torist/show.vue')
          }


        ],
      },
      {
        name: 'Service-managements',
        path: 'Service-managements',
        // component: RouteViewComponent,
        children: [
          {
            name: 'Service-management',
            path: 'Service-management',
            component: () => import('../pages/admin/Service-management/index.vue')
          },
          {
            name: 'Service-edit',
            path: 'Service-edit/:id',
            component: () => import('../pages/admin/Service-management/edit.vue')
          },

        ],
      },
      {
        name: 'products-management',
        path: 'products',
        // component: RouteViewComponent,
        children: [
          {
            name: 'brand',
            path: 'brand',
            component: () => import('../pages/admin/products/brand/index.vue'),
          },
          {
            name: 'brand-create',
            path: 'brand-create',
            component: () => import('../pages/admin/products/brand/create.vue'),
          },
          {
            name: 'brand-edit',
            path: 'brand-edit/:id',
            component: () => import('../pages/admin/products/brand/edite.vue'),
          },

          {
            name: 'model',
            path: 'model',
            component: () => import('../pages/admin/products/model/index.vue'),
          },
          {
            name: 'model-create',
            path: 'model-create',
            component: () => import('../pages/admin/products/model/create.vue'),
          },
          {
            name: 'model-edit',
            path: 'model-edit/:id',
            component: () => import('../pages/admin/products/model/edit.vue'),
          },

        ],
      },
      {
        name: 'training-courses',
        path: 'training-courses',
        // component: RouteViewComponent,
        children: [
          {
            name: 'training-reports',
            path: 'training-reports',
            component: () => import('../pages/admin/training-courses/reports.vue'),
          },
          {
            name: 'training-requests',
            path: 'training-requests',
            component: () => import('../pages/admin/training-courses/requests-board.vue'),
          },
          {
            name: 'ministers-board',
            path: 'ministers-board',
            component: () => import('../pages/admin/training-courses/ministers-board.vue'),
          },
          {
            name: 'manage-courses',
            path: 'manage-courses',
            component: () => import('../pages/admin/training-courses/manage-courses.vue'),
          },


        ],
      },
      {
        name: 'managing-registration',
        path: 'managing-registration',
        // component: RouteViewComponent,
        children: [
          {
            name: 'registration-government',
            path: 'registration-government',
            component: () => import('../pages/admin/managing-registration/registration-government.vue'),
          },
          {
            name: 'individual-registration',
            path: 'individual-registration',
            component: () => import('../pages/admin/managing-registration/individual-registration.vue'),
          },



        ],
      },

      {
        name: 'weather-warning',
        path: 'weather-warning',
        // component: RouteViewComponent,
        children: [
          {
            name: 'reports',
            path: 'reports',
            component: () => import('../pages/admin/weather-warning/reports.vue'),
          },

          {
            name: 'requests',
            path: 'requests',
            component: () => import('../pages/admin/weather-warning/requests.vue'),
          },



        ],
      },

      {
        name: 'management-meteorology',
        path: 'management-meteorology',
        // component: RouteViewComponent,
        children: [
          {
            name: 'reports',
            path: 'reports',
            component: () => import('../pages/admin/management-meteorology/reports.vue'),
          },
          {
            name: 'file-management',
            path: 'file-management',
            component: () => import('../pages/admin/management-meteorology/file-management.vue'),
          },
          {
            name: 'requests',
            path: 'requests',
            component: () => import('../pages/admin/management-meteorology/requests-board.vue'),
          },



        ],
      },
      {
        name: 'climate',
        path: 'climate',
        // component: RouteViewComponent,
        children: [
          {
            name: 'ClimateRequests',
            path: 'ClimateRequests',
            component: () => import('../pages/admin/Climate/ClimateRequests.vue'),
          },
          {
            name: 'directorate-requests',
            path: 'directorate-requests',
            component: () => import('../pages/admin/Climate/climate-directorate-requests.vue'),
          },
          {
            name: 'meteorology-requests',
            path: 'meteorology-requests',
            component: () => import('../pages/admin/Climate/climate-meteorology-requests.vue'),
          },
          {
            name: 'monitoring-requests',
            path: 'monitoring-requests',
            component: () => import('../pages/admin/Climate/climate-monitoring-requests.vue'),
          },
          {
            name: 'climate-reports',
            path: 'climate-reports',
            component: () => import('../pages/admin/Climate/climate-reports.vue'),
          },

        ],
      },
      {
        name: 'settings',
        path: 'settings',
        // component: RouteViewComponent,
        children: [
          {
            name: 'all-reports',
            path: 'all-reports',
            component: () => import('../pages/admin/settings/reports/index.vue'),
          },
          {
            name: 'procedures-manage',
            path: 'procedures-manage',
            component: () => import('../pages/admin/settings/procedures-mange/index.vue'),
          },

        ],
      },

      UIRoute,
    ],
  },

  {
    path: '/auth',
    component: AuthLayout,
    children: [
      {
        name: 'login',
        path: 'login',
        component: () => import('../pages/auth/login/Login.vue'),
      },
      {
        name: 'signup',
        path: 'signup',
        component: () => import('../pages/auth/signup/Signup.vue'),
      },
      {
        name: 'recover-password',
        path: 'recover-password',
        component: () => import('../pages/auth/recover-password/RecoverPassword.vue'),
      },
      {
        path: '',
        redirect: { name: 'login' },
      },
    ],
  },
  {
    path: '/404',
    component: Page404Layout,
    children: [
      {
        name: 'not-found-advanced',
        path: 'not-found-advanced',
        component: () => import('../pages/404-pages/VaPageNotFoundSearch.vue'),
      },
      {
        name: 'not-found-simple',
        path: 'not-found-simple',
        component: () => import('../pages/404-pages/VaPageNotFoundSimple.vue'),
      },
      {
        name: 'not-found-custom',
        path: 'not-found-custom',
        component: () => import('../pages/404-pages/VaPageNotFoundCustom.vue'),
      },
      {
        name: 'not-found-large-text',
        path: '/pages/not-found-large-text',
        component: () => import('../pages/404-pages/VaPageNotFoundLargeText.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }
    // For some reason using documentation example doesn't scroll on page navigation.
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' }
    } else {
      document.querySelector('.app-layout__page')?.scrollTo(0, 0)
    }
  },
  routes,
})

function auth(to: any, from: any, next: any) {
  if (!localStorage.getItem('token')) {
    return next({ name: 'login' })
  }

  next()
}

export default router
