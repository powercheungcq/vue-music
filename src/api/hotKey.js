import jsonp from 'common/js/jsonp'
import { commonParamsJsonp, options, commonPrams, request, getUrlParam } from './config'

export default {
  getHotKey () {
    const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
    const param = Object.assign({}, commonParamsJsonp, {
      g_tk: 5381,
      format: 'json',
      platform: 'h5',
      needNewCode: 1,
      _: new Date().getTime()
    })
    const newUrl = url
    return jsonp(newUrl, param, options)
  },
  searchSongandSinger ({ word, zd, perpage, page }) {
    // const url = '/soso/fcgi-bin/search_for_qq_cp'
    const url = '/api/search'
    const param = Object.assign({}, commonPrams, {
      g_tk: 5381,
      format: 'json',
      platform: 'h5',
      w: word,
      needNewCode: 1,
      zhidaqu: zd ? 1 : 0,
      catZhida: zd ? 1 : 0,
      t: 0,
      flag: 1,
      ie: 'utf-8',
      sem: 1,
      aggr: 0,
      perpage: perpage,
      n: perpage,
      p: page,
      remoteplace: 'txt.mqq.all',
      _: new Date().getTime()
    })
    const newUrl = getUrlParam(url, param)
    return request(newUrl)
  }
}
