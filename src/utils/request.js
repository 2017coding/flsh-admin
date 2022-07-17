import axios from 'axios' // 引入axios
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/pinia/modules/user'
import { emitter } from '@/utils/bus.js'
import router from '@/router/index'
import { SERVICE_API } from '../config'

function dataTrim(data) {
  if (Array.isArray(data)) {
    for (let item of data) {
      if (typeof item === 'object') {
        dataTrim(item)
      } else if (typeof item === 'string') {
        item = item.trim() // bug ?
      }
    }
  } else if (typeof data === 'object') {
    for (const key in data) {
      if (typeof data[key] === 'object') {
        dataTrim(data[key])
      } else if (typeof data[key] === 'string') {
        data[key] = data[key].trim()
      }
    }
  }
}

const service = axios.create({
  baseURL: SERVICE_API,
  timeout: 99999
})
let acitveAxios = 0
let timer
const showLoading = () => {
  acitveAxios++
  if (timer) {
    clearTimeout(timer)
  }
  timer = setTimeout(() => {
    if (acitveAxios > 0) {
      emitter.emit('showLoading')
    }
  }, 400)
}

const closeLoading = () => {
  acitveAxios--
  if (acitveAxios <= 0) {
    clearTimeout(timer)
    emitter.emit('closeLoading')
  }
}
// http request 拦截器
service.interceptors.request.use(
  config => {
    if (!config.donNotShowLoading) {
      showLoading()
    }
    const userStore = useUserStore()
    config.headers = {
      'Content-Type': 'application/json',
      'token': userStore.token,
      'x-user-id': userStore.userInfo.ID,
      ...config.headers
    }
    // 全局去前后空格
    try {
      dataTrim(config.data)
      dataTrim(config.params)
    } catch (e) {
      console.log(e)
    }
    return config
  },
  error => {
    closeLoading()
    ElMessage({
      showClose: true,
      message: error,
      type: 'error'
    })
    return error
  }
)

/**
 * 解析 axios response.
 * 返回 `msg` `code` `data` 字段
 */
function resolveData(response) {
  if (response.data instanceof Blob || typeof response.data === 'string') {
    return {
      code: response.status,
      msg: response.statusText,
      data: response.data,
    }
  }

  // hack: 兼容不规范的状态码
  if (typeof response.data.code === 'string') {
    response.data.code = Number(response.data.code)
    console.error('后端接口返回状态码不规范！code 是字符串' + `'${response.data.code}'`)
  }

  return response.data
}

/**
 * 转换响应值为 `error first` 的形式
 */
function transformResponse(response) {
  const { code, msg, data } = resolveData(response)
  const error = (code < 200 || code >= 300) ? msg : null
  return [error, data, code]
}

// http response 拦截器
service.interceptors.response.use(
  response => {
    const userStore = useUserStore()
    closeLoading()
    if (response.headers['new-token']) {
      userStore.setToken(response.headers['new-token'])
    }
    if (response.data.code === 200 || response.headers.success === 'true') {
      if (response.headers.msg) {
        response.data.msg = decodeURI(response.headers.msg)
      }
      return transformResponse(response)
    } else {
      ElMessage({
        showClose: true,
        message: response.data.msg || decodeURI(response.headers.msg),
        type: 'error'
      })
      if (response.data.data && response.data.data.reload) {
        userStore.token = ''
        localStorage.clear()
        router.push({ name: 'Login', replace: true })
      }
      return transformResponse(response)
    }
  },
  error => {
    closeLoading()

    if (!error.response) {
      ElMessageBox.confirm(`
        <p>检测到请求错误</p>
        <p>${error}</p>
        `, '请求报错', {
        dangerouslyUseHTMLString: true,
        distinguishCancelAndClose: true,
        confirmButtonText: '稍后重试',
        cancelButtonText: '取消'
      })
      return
    }

    switch (error.response.status) {
      case 500:
        ElMessageBox.confirm(`
        <p>检测到接口错误${error}</p>
        <p>错误码<span style="color:red"> 500 </span>：此类错误内容常见于后台panic，请先查看后台日志，如果影响您正常使用可强制登出清理缓存</p>
        `, '接口报错', {
          dangerouslyUseHTMLString: true,
          distinguishCancelAndClose: true,
          confirmButtonText: '清理缓存',
          cancelButtonText: '取消'
        })
          .then(() => {
            const userStore = useUserStore()
            userStore.token = ''
            localStorage.clear()
            router.push({ name: 'Login', replace: true })
          })
        break
      case 404:
        ElMessageBox.confirm(`
          <p>检测到接口错误${error}</p>
          <p>错误码<span style="color:red"> 404 </span>：此类错误多为接口未注册（或未重启）或者请求路径（方法）与api路径（方法）不符--如果为自动化代码请检查是否存在空格</p>
          `, '接口报错', {
          dangerouslyUseHTMLString: true,
          distinguishCancelAndClose: true,
          confirmButtonText: '我知道了',
          cancelButtonText: '取消'
        })
        break
    }

    return error
  }
)
export default service
