const Koa = require('koa');
const Router = require('koa-router');
const axios = require('axios');
const app = new Koa();
const router = new Router();
const {createVideo} = require('./common/video')


router.get('/', (ctx, next) => {
  ctx.body = '全民pk接口转发服务器启动成功！'
});

router.get('/list', async (ctx, next) => {
  let data = []
  try {
    data = await axios.get('https://comp-sync.webapp.163.com/xyqvideo/sync_paged_list',{
    params: {
      callback:'jQuery111307512338619122214_1567257922676',
      page:1,
      per_page:10,
      category:5,
      _: 1567257922684
    }
  })
  // console.log(data.data)
  if (typeof data.data === 'string') {
    let reg = /^\w+\(({[^()]+})\)$/
    let matches = await data.data.match(reg)
    // console.log(matches[1])
    // if (matches) {
    //   ret = JSON.parse(matches[1])
    // }
    const ret = JSON.parse(matches[1])
    const datas = []

    ret.data.forEach(video=>{
      datas.push(createVideo(video))
    })

    // console.log(ret.status)
    if(ret.status){
      ctx.body = await {
        status:true,
        data:datas
      }
    }else{
      ctx.body = await {
        status:-1,
        code:'请求目标接口超时！'
      }
    }
  }else {
    ctx.body = {
      status:-1,
      code:'请求目标接口失败！'
    }
  }
  } catch (error) {
    ctx.body = {
      status:-1,
      code:'目标接口调用失败',
      error:error
    }
  }
});

app
  .use(router.routes())
  .use(router.allowedMethods());


app.listen(3000,()=>{
  console.log('全民pk接口转发服务器启动成功！')
});