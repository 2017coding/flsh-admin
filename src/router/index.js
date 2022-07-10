import { createRouter, createWebHashHistory } from 'vue-router'
import staticRoute from '@/router/route'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/init',
    name: 'Init',
    component: () => import('@/views/init/index.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue')
  },
  {
    path: '',
    name: 'layout',
    component: () => import('@/views/layout/index.vue'),
    meta: {
      title: 'layout'
    },
    children: staticRoute
  }
]

console.log('routes', routes)

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
