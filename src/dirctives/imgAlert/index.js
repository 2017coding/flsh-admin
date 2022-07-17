import imgAlert from './alert'

export default {
  install(Vue) {
    Vue.directive('img-alert', imgAlert)
  },
}
