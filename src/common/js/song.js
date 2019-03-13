import { Base64 } from 'js-base64'
import Model from 'api/singerDetail'
import { SUCCESS_CODE } from 'api/config'
export default class Song {
  constructor ({ albummid, albumname, interval, singer, songmid, songname, image, url }) {
    this.albummid = albummid
    this.albumname = albumname
    this.interval = interval
    this.singer = singer
    this.songmid = songmid
    this.songname = songname
    this.image = image
    this.url = url
    this.getLyric = function () {
      return Model.getLyric(this.songmid).then(res => {
        return new Promise((resolve, reject) => {
          if (res.code === SUCCESS_CODE) {
            this.lyric = Base64.decode(res.lyric)
            resolve(this.lyric)
          } else {
            reject(new Error('no lyric'))
          }
        })
      })
    }
  }
}
export function createSong ({ musicData }) {
  return new Song({
    albummid: musicData.albummid,
    albumname: musicData.albumname,
    interval: musicData.interval,
    singer: filterSinger(musicData.singer),
    songmid: musicData.songmid,
    songname: musicData.songname,
    image: `//y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`
  })
}

function filterSinger (singers) {
  if (typeof singers === 'string') {
    return singers
  }
  let tmp = []
  singers.forEach(singer => {
    tmp.push(singer.name)
  })
  return tmp.join('/')
}

export async function getSongUrl (mid) {
  const res = await Model.getSongUrl(mid)
  let url = ''
  if (res.code === 0) {
    url = res.req_0.data.sip[1] + res.req_0.data.midurlinfo[0].purl
  }
  return url
}
