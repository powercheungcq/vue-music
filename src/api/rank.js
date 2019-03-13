import { commonPrams, request, getUrlParam } from 'api/config'

export default {
  getRankList () {
    // const url = '/v8/fcg-bin/fcg_myqq_toplist.fcg'
    const url = '/api/rank'
    const param = Object.assign(commonPrams, {
      g_tk: '5381',
      uin: 0,
      platform: 'h5',
      needNewCode: '1',
      _: new Date().getTime()
    })
    const newUrl = getUrlParam(url, param)
    return request(newUrl, 'rank list error')
  },
  getRankSongList (topid) {
    // const url = '/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
    const url = '/api/rankSongs'
    const param = Object.assign(commonPrams, {
      topid,
      tpl: 3,
      page: 'detail',
      type: 'top',
      g_tk: '5381',
      uin: 0,
      platform: 'h5',
      needNewCode: '1',
      _: new Date().getTime()
    })
    const newUrl = getUrlParam(url, param)
    return request(newUrl, 'top song list not found')
  }
}
