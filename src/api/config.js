import axios from 'axios'
const ax = axios.create()

const createError = (code, msg) => {
  const err = new Error(msg)
  err.code = code
  err.message = msg
  return err
}
const commonPrams = {
  g_tk: 1214637644,
  format: 'json',
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0
}
const commonParamsJsonp = {
  g_tk: 5381,
  format: 'jsonp',
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0
}
const options = {
  param: 'jsonpCallback'
}
const SUCCESS_CODE = 0

function getUrlParam(url, Obj) {
  if (url.indexOf('?') === -1) {
    url = url + '?'
  } else {
    url = url + '&'
  }
  for (let k in Obj) {
    url += k + '=' + Obj[k] + '&'
  }
  return url
}

function request (url, errMsg) {
  return new Promise((resolve, reject) => {
    ax(url).then(res => {
      if (res.data && res.status === 200 && res.data.code === SUCCESS_CODE) {
        resolve(res)
      } else {
        reject(createError('401', errMsg))
      }
    })
  })
}
export { createError, commonPrams, SUCCESS_CODE, commonParamsJsonp, options, getUrlParam, request }
