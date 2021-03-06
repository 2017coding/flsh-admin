import { createApp } from 'vue'
import 'element-plus/dist/index.css'
import './style/element_visiable.scss'
import ElementPlus from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 引入gin-vue-admin前端初始化相关内容
import './core/icon'
// 引入封装的router
import router from '@/router/index'
import dirctives from '@/dirctives' // dirctives
import '@/permission'
import run from '@/core/icon.js'
import auth from '@/dirctives/auth'
import { store } from '@/pinia'
import App from './App.vue'

const app = createApp(App)
app.config.productionTip = false

Object.keys(dirctives).forEach(key => {
  app.use(dirctives[key])
})

app
  .use(run)
  .use(store)
  .use(auth)
  .use(router)
  .use(ElementPlus, { locale: zhCn })
  .mount('#app')

export default app
