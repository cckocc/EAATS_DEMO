import axios from 'axios'
// import router from '@/router'
import { MessageBox, Message, Loading } from 'element-ui'
import store from '@/store'
import { setToken, getToken } from '@/utils/auth'
import Cookies from 'js-cookie'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60 * 1000 // request timeout
})
let loadingInstance
// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    let lang = 'zh-CN'
    if (Cookies.get('language') === 'en') {
      lang = 'en-US'
    }
    config.headers['System-Language'] = lang
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      if (config.url !== '/message/new/num') {
        config.headers['X-Auth-Token'] = getToken()
      }
    }
    const timeoutUrls = [
      '/manage/menu/config/publish',
      '/image/mgt/carousel/all/select',
      '/acceptanceTest/fill',
      '/proc/flow/conf/save/market/menuNode/audit/model'
    ]
    if (config.url.indexOf('uploadFile') > -1 || config.url.indexOf('download') > -1 || config.url.indexOf('emergencyMeasure') > -1 || config.url.indexOf('export') > -1 || timeoutUrls.includes(config.url)) {
      config.timeout = 600 * 1000
    }
    if (config.isLoading) {
      const options = {
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      }
      loadingInstance = Loading.service(options)
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const { responseType } = response.config
    if (response.config.isLoading) {
      loadingInstance.close()
    }
    if (responseType === 'blob' || responseType === 'arraybuffer') {
      if (!response.config.isToJson || response.data.size > 1000) {
        return response
      }
      const reader = new FileReader()
      reader.readAsText(response.data, 'utf-8')
      console.log(reader)
      console.log(reader.result)
      return new Promise((resolve, reject) => {
        reader.onload = function() {
          try {
            const result = JSON.parse(reader.result)
            console.log(result)
            if (result.data && result.data.code !== 'ACK') {
              Message({
                message: result.data.message,
                type: 'error',
                duration: 5 * 1000
              })
              reject(new Error(result.data.message || 'Error'))
            } else {
              resolve(response)
            }
          } catch (e) {
            resolve(response)
          }
        }
      }).then(res => {
        return res
      })
    }

    if (!response) {
      return response
    }
    const { data } = response.data
    const res = data

    if (res.code !== 'ACK') {
      if (res.code === 'VALIDATION' || res.code === 'ACCEPTANCE_TEST_TIME_VERIFY_FAIL') {
        return res
      } else if (res.code === 'AGENCY-PERM-CHANGE' || res.code === 'GRIP-PERM-CHANGE') {
        Message({
          message: res.message,
          type: 'warning',
          duration: 5 * 1000
        })
        store.dispatch('user/logout')
      } else if (res.code === 'FORCE_LOGIN' || res.code === 'ISV_LOGIN') {
        return res
      } else if (res.code === 'FORCED_OFFLINE') {
        if (window.offline) return
        window.offline = true
        Message({
          message: res.message,
          type: 'error',
          duration: 5 * 1000
        })
        setTimeout(() => {
          store.dispatch('user/resetToken')
          window.location.reload()
        }, 500)
      } else {
        Message({
          message: res.message || 'Error',
          type: 'error',
          duration: 5 * 1000
        })
        return Promise.reject(new Error(res.message || 'Error'))
      }
    } else {
      const token = response.headers['x-auth-token']
      if (token) {
        res.token = token
      }
      return res
    }
  },
  async error => {
    console.log('err' + error) // for debug
    try {
      const { status } = error.response
      if (status && status === 401) {
        await store.dispatch('user/logout')
        Message({
          message: '登录信息已过期',
          type: 'error',
          duration: 5 * 1000
        })
      } else {
        Message({
          message: error.message,
          type: 'error',
          duration: 5 * 1000
        })
      }
    } catch (e) {
      Message({
        message: error,
        type: 'error',
        duration: 5 * 1000
      })
    }
    return Promise.reject(error)
  }
)

export default service
