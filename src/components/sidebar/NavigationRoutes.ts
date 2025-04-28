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
      displayName: 'Services',
      meta: {
        icon: 'settings',
      },
    },
    {
      name: 'training-courses',
      displayName: 'courses',
      meta: {
        icon: 'school',
      },
      disabled: true,
      children: [
        {
          name: 'training-requests',
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
      meta: {
        icon: 'warning',
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
      meta: {
        icon: 'wb_sunny',
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
      meta: {
        icon: 'how_to_reg',
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
      meta: {
        icon: 'people',
      },
    },
    {
      name: 'roles',
      displayName: 'roles',
      meta: {
        icon: 'admin_panel_settings',
      },
    },
    {
      name: 'procedures-manage',
      displayName: 'procedures',
      meta: {
        icon: 'list_alt',
      },
    },
    {
      name: 'all-reports',
      displayName: 'Reports',
      meta: {
        icon: 'assessment',
      },
    },
  ] as INavigationRoute[],
}
