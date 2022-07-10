export default [
  {
    path: 'home',
    name: 'home',
    meta: {
      title: '首页',
      closeTab: true,
    },
    component: () => import('@/views/home/index.vue'),
  },
  {
    path: 'operatingManage',
    name: '运营管理',
    meta: {
      title: '运营管理',
      closeTab: true,
    },
    component: () => import('@/views/operatingManage/index.vue'),
    children: [
      {
        path: 'bannerManage',
        name: 'bannerManage',
        meta: {
          title: 'banner管理',
          closeTab: true,
        },
        component: () => import('@/views/operatingManage/bannerManage/index.vue'),
      },
      {
        path: 'baikeManage',
        name: 'baikeManage',
        meta: {
          title: '百科',
          closeTab: true,
        },
        component: () => import('@/views/operatingManage/baikeManage/index.vue'),
      },
    ],
  },
  {
    path: 'sysManage',
    name: 'sysManage',
    meta: {
      title: '系统管理',
      closeTab: true,
    },
    component: () => import('@/views/sysManage/index.vue'),
    children: [
      {
        path: 'userManage',
        name: 'userManage',
        meta: {
          title: '用户管理',
          closeTab: true,
        },
        component: () => import('@/views/sysManage/userManage/index.vue'),
      },
      {
        path: 'roleManage',
        name: 'roleManage',
        meta: {
          title: '角色管理',
          closeTab: true,
        },
        component: () => import('@/views/sysManage/roleManage/index.vue'),
      },
      {
        path: 'dictManage',
        name: 'dictManage',
        meta: {
          title: '字典管理',
          closeTab: true,
        },
        component: () => import('@/views/sysManage/dictManage/index.vue'),
      },
    ],
  },
]
