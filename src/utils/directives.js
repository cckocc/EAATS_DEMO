import Vue from 'vue'
// 防止按钮重复点击
Vue.directive('preventReClick', {
  bind(el, binding, vnode, oldVnode) {
    el.addEventListener('click', () => {
      if (!el.disabled) {
        el.disabled = true
        setTimeout(() => {
          el.disabled = false
        }, binding.value || 3000)
      }
    })
  }
})

Vue.directive('limitBytes', {
  bind(el, binding, vnode, oldVnode) {
    let input = null
    const isInput = el.querySelector('.el-input__inner')
    const isTextarea = el.querySelector('.el-textarea__inner')
    const num = binding.value || 300
    if (isInput) {
      input = isInput
    }
    if (isTextarea) {
      input = isTextarea
    }
    input.onkeyup = function(e) {
      if (utf8_strlen(input.value) > num) {
        let arr = input.value.split('')
        for (let i = arr.length - 1; i >= 0; i--) {
          arr = arr.slice(0, i)
          input.value = arr.join('')
          if (utf8_strlen(input.value) <= num) {
            break
          }
        }
      }
      trigger(input, 'input')
    }

    function utf8_strlen(str) {
      var cnt = 0
      for (let i = 0; i < str.length; i++) {
        var value = str.charCodeAt(i)
        if (value < 0x080) {
          cnt += 1
        } else if (value < 0x0800) {
          cnt += 2
        } else {
          cnt += 3
        }
      }
      return cnt
    }

    function trigger(el, type) {
      var e = document.createEvent('HTMLEvents')
      e.initEvent(type, true, true)
      el.dispatchEvent(e)
    }
  }
})
