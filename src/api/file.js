import request from '@/utils/request'

export function upload(data) {
  return request({
    url: '/system/file/uploadFile/upload/tourist',
    method: 'post',
    data
  })
}

// 登陆后上传
export function uploadLogin(data) {
  return request({
    url: '/system/file/uploadFile/upload',
    method: 'post',
    data
  })
}

// 获取单个文件
export function getFileName(id) {
  return request({
    url: '/system/file/name',
    method: 'get',
    params: {
      id
    }
  })
}

// 获取多个文件
export function getFileNames(data) {
  return request({
    url: '/system/file/name/list',
    method: 'post',
    data
  })
}

// 登录后下载
export function downloadAuthen(fileId) {
  return request({
    url: '/system/file/download/authen',
    method: 'get',
    responseType: 'blob',
    isToJson: true,
    params: {
      fileId
    }
  })
}

// 游客下载
export function downloadTourist(fileId) {
  return request({
    url: '/system/file/download/tourist',
    method: 'get',
    responseType: 'blob',
    isToJson: true,
    params: {
      fileId
    }
  })
}
