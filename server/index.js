const Koa = require('koa');
const Router = require('koa-router');
const axios = require('axios');
const app = new Koa();
const router = new Router();
const {
  createVideo
} = require('./common/video')
const normalJSON = require('./common/jsonp')


router.get('/', (ctx, next) => {
  ctx.body = '全民pk接口转发服务器启动成功！'
});

router.get('/list', async (ctx, next) => {
  const query = Object.assign({}, {
    callback: 'jQuery111307512338619122214_1567257922676',
    page: 1,
    per_page: 10,
    category: 5,
    _: 1567257922684
  }, ctx.query)
  // console.log(query)
  if(query.team === 'undefined'){
    delete query.team
  }
  let data = []
  try {
    data = await axios.get('https://comp-sync.webapp.163.com/xyqvideo/sync_paged_list', {
      params: {
        ...query
      }
    })

    let newData = normalJSON(data.data)
    let datas = []
    newData.data.forEach(video => {
      datas.push(createVideo(video))
    })

    if (newData.status) {
      ctx.body = await {
        status: true,
        data: datas,
        newData:newData
      }
    } else {
      ctx.body = await {
        status: -1,
        code: '请求目标接口超时！'
      }
    }
  } catch (error) {
    ctx.body = {
      status: -1,
      code: '目标接口调用失败',
      error: error
    }
  }
});

router.get('/rank', async (ctx) => {
  // console.log(ctx.query)
  const query = Object.assign({}, {
    callback: 'jQuery111306742324507357198_1567502000549',
    pk_type: 1,
    pk_region: '浙江赛区',
    page_no: 1,
    num_per_page: 18,
    period: 2019,
    _: 1567502000550
  }, ctx.query)
  // console.log(query)
  let data = []
  try {
    data = await axios.get('https://xyqpk-2019.webapp.163.com/score', {
      params: {
        ...query
      }
    })
    data = normalJSON(data.data.replace('/**/', ''))
    // console.log(data)
    if (data.success) {
      ctx.body = await {
        status: true,
        data: data.data,
        page_no: data.page_no,
        total_page: data.total_page
      }
    } else {
      ctx.body = await {
        status: -1,
        code: '请求目标接口超时！'
      }
    }
  } catch (error) {
    ctx.body = {
      status: -1,
      code: '目标接口调用失败',
      error: error
    }
  }
})

app
  .use(router.routes())
  .use(router.allowedMethods());


app.listen(3000, () => {
  console.log('全民pk接口转发服务器启动成功！')
});