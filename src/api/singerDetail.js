import axios from 'axios'
import { commonPrams, createError, getUrlParam } from './config'
// import * as Type from "../store/mutationTypes";

const request = axios.create()

const handleRquest = async (request) => {
  return new Promise((resolve, reject) => {
    request.then(resp => {
      if (resp.status !== 200) {
        reject(createError(400, 'not found'))
      } else {
        resolve(resp.data)
      }
    }).catch(err => {
      const resp = err.response
      reject(resp.status, resp.message)
    })
  })
}

export default {
  getSingerDetail(singermid) {
    // let url = '/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
    let url = '/api/singerDetail'
    const parms = Object.assign(commonPrams, {
      g_tk: 5381,
      loginUin: 0,
      hostUin: 0,
      format: 'json',
      inCharset: 'utf8',
      outCharset: 'utf-8',
      platform: 'yqq.json',
      needNewCode: 0,
      ct: 24,
      singermid: singermid,
      order: 'listen',
      begin: 0,
      num: 100,
      songstatus: 1
    })
    let pamas = ''
    for (let item in parms) {
      pamas += item ? '&' + item + '=' + parms[item] : ''
    }
    if (url.indexOf('?') < 0) {
      url += '?'
      if (pamas.charAt(0) === '&') {
        pamas = pamas.substr(1)
      }
    }
    url = url + pamas
    return handleRquest(request.get(url))
  },
  getSongUrl: async (songmid) => {
    // let url = '/songApi/cgi-bin/musicu.fcg'
    let url = '/api/songurl'
    const data = JSON.stringify({
      'req': {
        'module': 'CDN.SrfCdnDispatchServer',
        'method': 'GetCdnDispatch',
        'param': {
          'guid': '4910107230',
          'calltype': 0,
          'userip': ''
        }
      },
      'req_0': {
        'module': 'vkey.GetVkeyServer',
        'method': 'CgiGetVkey',
        'param': {
          'guid': '4910107230',
          'songmid': [songmid],
          'songtype': [0],
          'uin': '0',
          'loginflag': 1,
          'platform': '20'
        }
      },
      'comm': {
        'uin': 0,
        'format': 'json',
        'ct': 24,
        'cv': 0
      }
    })
    const parms = Object.assign(commonPrams, {
      g_tk: 5381,
      loginUin: 0,
      hostUin: 0,
      format: 'json',
      inCharset: 'utf8',
      outCharset: 'utf-8',
      platform: 'yqq.json',
      needNewCode: 0,
      '-': 'getplaysongvkey' + (Math.random() * 10000000000000000 - 1),
      data: data
    })
    let pamas = ''
    for (let item in parms) {
      pamas += item ? '&' + item + '=' + parms[item] : ''
    }
    if (url.indexOf('?') < 0) {
      url += '?'
      if (pamas.charAt(0) === '&') {
        pamas = pamas.substr(1)
      }
    }
    url = url + pamas
    const songUrl = await handleRquest(request.get(url)).then(res => {
      if (res && res.code === 0) {
        if (res.req_0.data.midurlinfo[0].purl === '') {
          return 'error'
        } else {
          return res.req_0.data.sip[1] + res.req_0.data.midurlinfo[0].purl
        }
      } else {
        return 'error'
      }
    })
    return songUrl
  },
  getLyric (mid) {
    //let url = '/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
    let url = '/api/lyric'
    const param = Object.assign(commonPrams, {
      songmid: mid,
      pcachetime: new Date().getTime(),
      g_tk: '5381',
      format: 'json',
      notice: 0,
      platform: 'yqq.json',
      needNewCode: 0
    })
    const newUrl = getUrlParam(url, param)
    return handleRquest(request.get(newUrl))
  }
}
