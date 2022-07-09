import { defineStore } from 'pinia'
import { ref } from 'vue'
import staticRoute from '@/router/route'

const routerListArr = []
const keepAliveRoutersArr = []

export const useRouterStore = defineStore('router', () => {
  const asyncRouters = ref([])
  const routerList = ref(routerListArr)
  const keepAliveRouters = ref(keepAliveRoutersArr)
  const routeMap = ({})
  // 从后台获取动态路由
  const SetAsyncRouter = async() => {
    const baseRouter = [{
      path: '/layout',
      name: 'layout',
      component: 'view/layout/index.vue',
      meta: {
        title: '底层layout'
      },
      children: []
    }]
    const asyncRouter = [
      ...staticRoute,
      {
        path: '404',
        name: '404',
        hidden: true,
        meta: {
          title: '迷路了*。*',
          closeTab: true,
        },
        component: 'view/error/index.vue'
      }, {
        path: 'reload',
        name: 'Reload',
        hidden: true,
        meta: {
          title: '',
          closeTab: true,
        },
        component: 'view/error/reload.vue'
      }
    ]
    baseRouter[0].children = asyncRouter
    baseRouter.push({
      path: '/:catchAll(.*)',
      redirect: '/layout/404'

    })
    asyncRouters.value = baseRouter
    routerList.value = routerListArr
    keepAliveRouters.value = keepAliveRoutersArr
    return true
  }

  return {
    asyncRouters,
    routerList,
    keepAliveRouters,
    SetAsyncRouter,
    routeMap
  }
})

