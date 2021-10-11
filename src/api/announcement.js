import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/notice/list',
    method: 'post',
    data
  })
}
export function fetchAnnouncement(id) {
  return request({
    url: '/notice/details',
    method: 'get',
    params: { noticeid: id }
  })
}
export function fileDownload(id) { // 下载文件
  return request({
    url: '/system/file/download/tourist',
    method: 'get',
    params: {
      fileId: id
    },
    responseType: 'blob'
  })
}
// export function search(data) { // 根据名字分页查询文章
//   return request({
//     url: '',
//     method: 'post',
//     data
//   })
// }
export default {
  fetchList,
  fetchAnnouncement
}

