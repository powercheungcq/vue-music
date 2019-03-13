const path = require('path')
function resolve (dir) {
  console.log(path.join(__dirname, dir))
  return path.join(__dirname, dir)
}
module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
        'common': resolve('src/common'),
        'components': resolve('src/components'),
        'api': resolve('src/api'),
        'base': resolve('src/base')
      }
    },
    devServer: {
      proxy: {
        '/musichall/fcgi-bin': {
          target: 'https://c.y.qq.com', // 设置你调用的接口域名和端口号 别忘了加http
          changeOrigin: true,
          ws: true,
          pathRewrite: {
            '^/musichall/fcgi-bin': '/musichall/fcgi-bin' // 这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我要调用'http://40.00.100.100:3002/user/add'，直接写‘/api/user/add’即可
          }
        },
        '/apiDiscList': {
          target: 'https://c.y.qq.com',
          bypass: function (req, res, proxyOptions) {
            req.headers.referer = 'https://y.qq.com/portal/playlist.html'
          },
          pathRewrite: {
            '^/apiDiscList': ''
          }
        },
        '/apiSinger': {
          target: 'https://u.y.qq.com',
          bypass: function (req, res, proxyOptions) {
            req.headers.referer = 'https://y.qq.com/portal/singer_list.html'
          },
          pathRewrite: {
            '^/apiSinger': ''
          }
        },
        '/v8/fcg-bin/': {
          target: 'https://c.y.qq.com',
          changeOrigin: true,
          ws: true,
          pathRewrite: {
            '^/v8/fcg-bin/': '/v8/fcg-bin/'
          }
        },
        '/songApi/cgi-bin/': {
          target: 'https://u.y.qq.com',
          changeOrigin: true,
          ws: true,
          pathRewrite: {
            '^/songApi/cgi-bin/': '/cgi-bin/'
          }
        },
        '/lyric/fcgi-bin/': {
          target: 'https://c.y.qq.com',
          changeOrigin: true,
          ws: true,
          bypass: function (req, res, proxyOptions) {
            req.headers.referer = 'https://y.qq.com/portal/player.html'
          },
          pathRewrite: {
            '^/lyric/fcgi-bin/': '/lyric/fcgi-bin/'
          }
        },
        '/qzone/fcg-bin/': {
          target: 'https://c.y.qq.com',
          changeOrigin: true,
          ws: true,
          bypass: function (req, res, proxyOptions) {
            req.headers.referer = 'https://y.qq.com/n/yqq/playsquare/4946811643.html'
          },
          pathRewrite: {
            '^/qzone/fcg-bin/': '/qzone/fcg-bin/'
          }
        },
        '/soso/fcgi-bin/': {
          target: 'https://c.y.qq.com',
          changeOrigin: true,
          ws: true,
          bypass: function (req, res, proxyOptions) {
            req.headers.referer = 'https://y.qq.com/m/index.html'
          },
          pathRewrite: {
            '^/soso/fcgi-bin/': '/soso/fcgi-bin/'
          }
        },
      }
    }
  }
}
