import { login, setSelfInfo } from '@/api/user'
import { jsonInBlacklist } from '@/api/jwt'
import router from '@/router/index'
import { ElLoading, ElMessage } from 'element-plus'
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useRouterStore } from './router'

export const useUserStore = defineStore('user', () => {
  const loadingInstance = ref(null)

  const userInfo = ref({
    uuid: '',
    nickName: '',
    headerImg: '',
    authority: {},
    sideMode: 'dark',
    activeColor: '#4D70FF',
    baseColor: '#fff'
  })
  const token = ref(window.localStorage.getItem('token') || '')

  const setToken = (val) => {
    token.value = val
  }

  const NeedInit = () => {
    token.value = ''
    window.localStorage.removeItem('token')
    localStorage.clear()
    router.push({ name: 'Init', replace: true })
  }

  /* 登录*/
  const LoginIn = async(loginInfo) => {
    loadingInstance.value = ElLoading.service({
      fullscreen: true,
      text: '登录中，请稍候...',
    })
    console.log('await login(loginInfo)', await login(loginInfo))
    const [err, data] = await login(loginInfo)
    if (err) return
    setToken(data)
    const routerStore = useRouterStore()
    const asyncRouters = routerStore.asyncRouters
    asyncRouters.forEach(asyncRouter => {
      router.addRoute(asyncRouter)
    })
    router.push('/home')
    loadingInstance.value.close()
    return true
  }
  /* 登出*/
  const LoginOut = async() => {
    console.log('loginou')
    token.value = ''
    sessionStorage.clear()
    localStorage.clear()
    router.push('/login')
    window.location.reload()
  }
  /* 清理数据 */
  const ClearStorage = async() => {
    token.value = ''
    sessionStorage.clear()
    localStorage.clear()
  }
  /* 设置侧边栏模式*/
  const changeSideMode = async(data) => {
    const res = await setSelfInfo({ sideMode: data })
    if (res.code === 0) {
      ElMessage({
        type: 'success',
        message: '设置成功'
      })
    }
  }

  const mode = computed(() => userInfo.value.sideMode)
  const sideMode = computed(() => {
    if (userInfo.value.sideMode === 'dark') {
      return '#191a23'
    } else if (userInfo.value.sideMode === 'light') {
      return '#fff'
    } else {
      return userInfo.value.sideMode
    }
  })
  const baseColor = computed(() => {
    if (userInfo.value.sideMode === 'dark') {
      return '#fff'
    } else if (userInfo.value.sideMode === 'light') {
      return '#191a23'
    } else {
      return userInfo.value.baseColor
    }
  })
  const activeColor = computed(() => {
    if (userInfo.value.sideMode === 'dark' || userInfo.value.sideMode === 'light') {
      return '#4D70FF'
    }
    return userInfo.activeColor
  })

  watch(() => token.value, () => {
    window.localStorage.setItem('token', token.value)
  })

  return {
    userInfo,
    token,
    NeedInit,
    LoginIn,
    LoginOut,
    changeSideMode,
    mode,
    sideMode,
    setToken,
    baseColor,
    activeColor,
    loadingInstance,
    ClearStorage
  }
})
