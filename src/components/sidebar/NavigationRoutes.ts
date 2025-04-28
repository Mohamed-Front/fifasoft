export interface INavigationRoute {
  name: string
  displayName: string
  meta: { icon: string }
  disabled?: boolean
  show?: string[]
  children?: INavigationRoute[]
}

export default {
  root: {
    name: '/',
    displayName: 'navigationRoutes.home',
  },
  routes: [
    {
      name: 'dashboard',
      displayName: 'dashboard',
      show: ['dashboard'],
      meta: {
        icon: 'vuestic-iconset-dashboard',
      },
    },
    {
      name: 'Service-management',
      displayName: 'services',
      show: ['services'],
      meta: {
        icon: 'list',
      },
    },
    {
      name: 'training-courses',
      displayName: 'courses',
      show: ['courses'],
      meta: {
        icon: 'school',
      },
      disabled: true,
      children: [
        {
          name: 'requests',
          displayName: 'Requests',
          meta: {
            icon: 'request_quote',
          },
        },
        {
          name: 'manage-courses',
          displayName: 'committee',
          meta: {
            icon: 'groups',
          },
        },
        {
          name: 'ministers-board',
          displayName: 'ministers',
          meta: {
            icon: 'account_balance',
          },
        },
        {
          name: 'training-reports',
          displayName: 'Reports',
          meta: {
            icon: 'assessment',
          },
        },
      ],
    },
    {
      name: 'management-meteorology',
      displayName: 'meteorology',
      show: ['meteorology'],
      meta: {
        icon: 'flight',
      },
      disabled: true,
      children: [
        {
          name: 'requests',
          displayName: 'Requests',
          meta: {
            icon: 'request_quote',
          },
        },
        {
          name: 'file-management',
          displayName: 'file',
          meta: {
            icon: 'folder',
          },
        },
        {
          name: 'reports',
          displayName: 'Reports',
          meta: {
            icon: 'assessment',
          },
        },
      ],
    },
    {
      name: 'weather-warning',
      displayName: 'weather',
      show: ['weather'],
      meta: {
        icon: 'cloud',
      },
      disabled: true,
      children: [
        {
          name: 'requests',
          displayName: 'Requests',
          meta: {
            icon: 'request_quote',
          },
        },
        {
          name: 'reports',
          displayName: 'Reports',
          meta: {
            icon: 'assessment',
          },
        },
      ],
    },
    {
      name: 'climate',
      displayName: 'climate',
      show: ['climate'],
      meta: {
        icon: 'thermostat',
      },
      disabled: true,
      children: [
        {
          name: 'ClimateRequests',
          displayName: 'Requests',
          meta: {
            icon: 'request_quote',
          },
        },
        {
          name: 'meteorology-requests',
          displayName: 'meteorologyrequests',
          meta: {
            icon: 'cloud',
          },
        },
        {
          name: 'directorate-requests',
          displayName: 'directoraterequests',
          meta: {
            icon: 'account_balance',
          },
        },
        {
          name: 'monitoring-requests',
          displayName: 'monitoringrequests',
          meta: {
            icon: 'monitor_heart',
          },
        },
        {
          name: 'climate-reports',
          displayName: 'Reports',
          meta: {
            icon: 'assessment',
          },
        },
      ],
    },
    {
      name: 'managing-registration',
      displayName: 'registration',
      show: ['registration'],
      meta: {
        icon: 'person_add',
      },
      disabled: true,
      children: [
        {
          name: 'registration-government',
          displayName: 'government',
          meta: {
            icon: 'account_balance',
          },
        },
        {
          name: 'individual-registration',
          displayName: 'individual',
          meta: {
            icon: 'person',
          },
        },
      ],
    },
    {
      name: 'users',
      displayName: 'users_management',
      show: ['users_management'],
      meta: {
        icon: 'people',
      },
    },
    {
      name: 'roles',
      displayName: 'roles',
      show:['roles'],
      meta: {
        icon: 'admin_panel_settings',
      },
    },
    {
      name: 'procedures-manage',
      displayName: 'procedures',
      show:['procedures'],
      meta: {
        icon: 'work',
      },
    },
    {
      name: 'system-management',
      displayName: 'management',
      show:['management'],
      meta: {
        icon: 'settings',
      },
    },
    {
      name: 'all-reports',
      displayName: 'reports',
      show:['reports'],
      meta: {
        icon: 'assessment',
      },
    },
  ] as INavigationRoute[],
}
