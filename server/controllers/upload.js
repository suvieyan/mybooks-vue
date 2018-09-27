const { uploader } = require('../qcloud')

module.exports = async (ctx) => {
    // 获取上传之后的结果
    // 具体可以查看：
    // const data = await uploader(ctx.req)
  let ret = ctx.request
  console.log('上传之后的结果', ret)

    // ctx.state.data = data
}
