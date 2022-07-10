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
      component: () => import('@/views/layout/index.vue'),
      meta: {
        title: '底层layout'
      },
      children: []
    }]
    const asyncRouter = staticRoute
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

