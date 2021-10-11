import request from '@/utils/request'

// 首页
export function pageInit() {
  return request({
    url: '/home/page/notice/source/data',
    method: 'post'
  })
}
