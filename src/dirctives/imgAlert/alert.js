export default {
  bind(el, binding) {
    el.addEventListener(
      'click',
      e => {
        const src = e.target.currentSrc
        const imageType = e.target.width > e.target.height ? 'width-image' : 'height-image'
        const body = document.querySelector('body')
        const imgAlart = document.createElement('div')
        imgAlart.className = 'g-img-alert'
        imgAlart.innerHTML = `
          <div class="g-img-alert-mask"></div>
          <div class="g-img-alert-content">
            <img class="g-img-alert-img ${imageType}" src="${src}">
          </div>
        `
        body.appendChild(imgAlart)

        // 监听到遮罩层点击
        imgAlart.addEventListener('click', e => {
          if (e.target.className === 'g-img-alert-mask') {
            body.removeChild(imgAlart)
          }
        }, false)
      },
      false,
    )
  },
}
