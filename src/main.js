import 'babel-polyfill'
import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
Element.Dialog.props.closeOnClickModal.default = false // 修改 el-dialog 默认点击遮照不关闭

import './styles/element-variables.scss'
// import enLang from 'element-ui/lib/locale/lang/en'// 如果使用中文语言包请默认支持，无需额外引入，请删除该依赖

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import i18n from './lang' // internationalization

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

import '@/utils/directives'
import JsonViewer from 'vue-json-viewer'
// Import JsonViewer as a Vue.js plugin
Vue.use(JsonViewer)

// import i18n from '@/lang/index'

import TableTree from '@/components/TableTree/index.vue'
Vue.component('TableTree', TableTree)

import Breadcrumb from '@/components/Breadcrumb/index.vue'
Vue.component('Breadcrumb', Breadcrumb)

import htmlToPdf from '@/utils/htmlToPdf'
Vue.use(htmlToPdf)
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
/* if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}*/
import Concat from './components/OnlineConcat/index.js'
Vue.prototype.$concat = Concat.install
import xss from 'xss'
Vue.prototype.xss = xss

Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
  // locale: enLang // 如果使用中文，无需设置，请删除
})

// 确认框设置全局默认值
Vue.prototype.$confirm = function() {
  const params1to2 = [].slice.call(arguments, 0, 2)
  const params3 = [].slice.call(arguments, 2).map(e => {
    e.closeOnClickModal = e.closeOnClickModal ? e.closeOnClickModal : false
    return e
  })
  return Element.MessageBox.confirm(...params1to2, ...params3)
}

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

const vm = new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})

export default vm
