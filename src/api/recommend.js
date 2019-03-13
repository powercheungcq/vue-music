import axios from 'axios'
import jsonp from 'common/js/jsonp'
import { createError, commonPrams, commonParamsJsonp, options } from './config'

const request = axios.create()

const handleRquest = (request) => {
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
  getRecommend: () => {
    //let url = '/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
    let url = '/api/recommend'
    let customPrams = Object.assign(commonPrams, {
      uin: 0,
      platform: 'h5',
      needNewCode: 1,
      _: (new Date()).getTime()
    })
    for (let item in customPrams) {
      if (url.indexOf('?') < 0) {
        url += '?'
      }
      url += item ? '&' + item + '=' + customPrams[item] : ''
    }
    return handleRquest(request.get(url))
  },
  getDiscList: (sin, ein) => {
    // let url = '/apiDiscList/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
    let url = '/api/apiDiscList'
    let customParams = Object.assign(commonParamsJsonp, {
      uin: 0,
      picmid: 1,
      sin: sin,
      ein: ein,
      platform: 'yqq',
      needNewCode: 1,
      sortId: 5,
      categoryId: 10000000,
      rnd: Math.random()
    })
    return jsonp(url, customParams, options)
  }
}
