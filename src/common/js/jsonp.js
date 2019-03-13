import OriginJsonp from 'jsonp'

export default function jsonp (url, data, options) {
  url = url + (url.indexOf('?') < 0 ? '?' : '&') + createUrl(data)
  return new Promise((resolve, reject) => {
    OriginJsonp(url, options, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

function createUrl (data) {
  let url = ''
  for (let k in data) {
    const v = data[k] !== undefined ? data[k] : ''
    url += `&${k}=${encodeURIComponent(v)}`
  }

  return url ? url.substring(1) : ''
}
