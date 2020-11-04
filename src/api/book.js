import request from '@/utils/request'

// 添加
export function createBook(data) {
  return request({
    url: '/book/create',
    method: 'post',
    data
  })
}

// 获取详情
export function getBook(fileName) {
  return request({
    url: '/book/get',
    method: 'get',
    params: { fileName }
  })
}

// 更新
export function updateBook(data) {
  return request({
    url: '/book/update',
    method: 'post',
    data
  })
}

// 获取分类
export function getCategory() {
  return request({
    url: '/book/category',
    method: 'get'
  })
}

// 获取图书列表
export function listBook(params) {
  return request({
    url: '/book/list',
    method: 'get',
    params
  })
}

// 删除电子书
export function deleteBook(fileName) {
  return request({
    url: '/book/delete',
    method: 'get',
    params: { fileName }
  })
}
