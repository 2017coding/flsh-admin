import './loading.scss'

/**
 * v-loading
 * @param {Boolean} value 默认参数 true false 控制显示隐藏
 * @param {String} attributes loading-text 设置加载文字
 * @param {String} attributes loading-spinner 设置加载图形
 * @param {String} attributes loading-background 设置加载背景颜色
 */
export default {
  bind(el, binding) {
    loading(el, binding)
  },
  update(el, binding) {
    loading(el, binding)
  },
}

function loading(el, binding) {
  el.style.position = 'relative'
  const attributes = el.attributes
  // 支持的扩展属性 (暂未对loading图形做扩展)
  const attrs = {
    'loading-text': undefined,
    'loading-spinner': 'ant-spin-spinning',
    'loading-background': undefined,
  }
  for (const key in attrs) {
    if (attributes[key]) {
      attrs[key] = attributes[key].value
    }
  }
  const text = attrs['loading-text'] ? `<p>${attrs['loading-text']}</p>` : ''
  const background = attrs['loading-background'] ? `background: ${attrs['loading-background']};` : ''
  // 指令传入的数据
  const value = binding.value
  const loading = document.createElement('div')
  loading.className = `v-loading`
  loading.innerHTML = `
    <div class="loading-mask" style="${background}"></div>
    <div class="loading-content">
      <div class="ant-spin ${attrs['loading-spinner']}">
        <span class="ant-spin-dot ant-spin-dot-spin">
          <i></i>
          <i></i>
          <i></i>
          <i></i>
        </span>
        ${text}
      </div>
    </div>
  `
  // 判断值做dom的显示内容
  if (value) {
    // 当前元素的子元素中没有loading, 则添加一个loading
    const node = Array.from(el.childNodes).find(item => item.className === 'v-loading')
    if (!node) {
      el.appendChild(loading)
    }
  }
  if (!value) {
    const node = Array.from(el.childNodes).find(item => item.className === 'v-loading')
    if (!node) return
    node.parentNode && node.parentNode.removeChild(node)
  }
}
