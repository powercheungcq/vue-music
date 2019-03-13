const Koa = require('koa')
const path = require('path')
const apiRouter = require('koa-router')()
const axios = require('axios')
const staticFiles = require('koa-static')
const app = new Koa()

apiRouter.get('/api/recommend', async (ctx) => {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  await axios.get(url, {
    params: ctx.request.query
  }).then((response) => {
    ctx.body = response.data
  }).catch(e => {
    console.log(e)
  })
})
apiRouter.get('/api/apiDiscList', async (ctx) => {
  const url = 'http://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  await axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/portal/playlist.html',
      host: 'c.y.qq.com'
    },
    params: ctx.request.query
  }).then((response) => {
    ctx.body = response.data
  }).catch(e => {
    console.log(e)
  })
})

apiRouter.get('/api/qzone', async (ctx) => {
  const url = 'http://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  await axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/n/yqq/playsquare/4946811643.html',
      host: 'c.y.qq.com'
    },
    params: ctx.request.query
  }).then((response) => {
    ctx.body = response.data
  }).catch(e => {
    console.log(e)
  })
})

apiRouter.get('/api/apiSinger', async (ctx) => {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  await axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/portal/singer_list.html',
      host: 'u.y.qq.com'
    },
    params: ctx.request.query
  }).then((response) => {
    ctx.body = response.data
  }).catch(e => {
    console.log(e)
  })
})
apiRouter.get('/api/singerDetail', async (ctx) => {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
  await axios.get(url, {
    params: ctx.request.query
  }).then((response) => {
    ctx.body = response.data
  }).catch(e => {
    console.log(e)
  })
})

apiRouter.get('/api/rank', async (ctx) => {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
  await axios.get(url, {
    params: ctx.request.query
  }).then((response) => {
    ctx.body = response.data
  }).catch(e => {
    console.log(e)
  })
})

apiRouter.get('/api/rankSongs', async (ctx) => {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
  await axios.get(url, {
    params: ctx.request.query
  }).then((response) => {
    ctx.body = response.data
  }).catch(e => {
    console.log(e)
  })
})
apiRouter.get('/api/songurl', async (ctx) => {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  await axios.get(url, {
    params: ctx.request.query
  }).then((response) => {
    ctx.body = response.data
  }).catch(e => {
    console.log(e)
  })
})
apiRouter.get('/api/lyric', async (ctx) => {
  const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  await axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/portal/player.html',
      host: 'c.y.qq.com'
    },
    params: ctx.request.query
  }).then((response) => {
    ctx.body = response.data
  }).catch(e => {
    console.log(e)
  })
})
apiRouter.get('/api/search', async (ctx) => {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  await axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/m/index.html',
      host: 'c.y.qq.com'
    },
    params: ctx.request.query
  }).then((response) => {
    ctx.body = response.data
  }).catch(e => {
    console.log(e)
  })
})
app.use(staticFiles(path.join(__dirname, './dist')))
app.use(apiRouter.routes())
app.use(apiRouter.allowedMethods())

app.listen(3000)
