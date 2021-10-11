import Vue from 'vue'
import Concat from './index.vue'

const ConcatBox = Vue.extend(Concat)

Concat.install = function (data) {
  let instance = new ConcatBox({
    data
  }).$mount()

  document.body.appendChild(instance.$el)

  Vue.nextTick(() => {
    instance.show = true
    // show和弹窗组件里的show对应，用于控制显隐
  })
}

export default Concat