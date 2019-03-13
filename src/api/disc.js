import { commonPrams, getUrlParam, request } from './config'

export function getDiscList (dissId) {
  // const url = '/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  const url = '/api/qzone'
  const param = Object.assign(commonPrams, {
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    disstid: dissId,
    g_tk: '5381',
    loginUin: 0,
    hostUin: 0,
    format: 'json',
    inCharset: 'utf8',
    outCharset: 'utf-8',
    notice: 0,
    platform: 'yqq.json',
    needNewCode: 0
  })
  const newUrl = getUrlParam(url, param)
  return request(newUrl, 'disc not found.')
}
