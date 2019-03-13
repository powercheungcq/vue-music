import jsonp from 'common/js/jsonp'
import { commonParamsJsonp, options } from './config'

export default {
  getSingerList: (props) => {
    let url = '/api/apiSinger'
    let data = JSON.stringify({ 'comm': { 'ct': 24, 'cv': 10000 }, 'singerList': { 'module': 'Music.SingerListServer', 'method': 'get_singer_list', 'param': Object.assign({ 'area': -100, 'sex': -100, 'genre': -100, 'index': -100, 'sin': 0, 'cur_page': 1 }, props) } })
    let customParams = Object.assign(commonParamsJsonp, {
      loginUin: 0,
      hostUin: 0,
      platform: 'yqq',
      needNewCode: 0,
      data: data
    })
    let customOptions = Object.assign({}, options, {
      param: 'callback'
    })
    return jsonp(url, customParams, customOptions)
  }
}
