
<template>

  <div class="container">
    <p>测试新功能</p>
    <button type="primary" @click="upload" class='btn'> 上传文件 </button>
    <button type="primary" @click="recordStart" class='btn'> 开始录音 </button>
    <button type="primary" @click="recordStop" class='btn'> 结束录音 </button>
    <button type="primary" @click="recordPlay" class='btn'> 播放录音 </button>
  </div>

</template>
<script>
import config from '@/config'
import { showSuccess } from '@/util'
export default {
  data () {
    return {
      innerAudioContext: null,
      src: ''
    }
  },
  methods: {
    upload () {
      console.log('上传文件')
      wx.chooseImage({
        success (res) {
          const tempFilePaths = res.tempFilePaths
          wx.uploadFile({
            url: config.uploadUrl, // 仅为示例，非真实的接口地址
            method: 'post',
            filePath: tempFilePaths[0],
            name: 'file',
            header: {
              'Content-Type': 'multipart/form-data'
            },
            formData: {
              'user': 'test'
            },
            success (res) {
              const data = res.data
              // do something
              showSuccess('上传成功')
              console.log('上传成功返回数据', data)
            }
          })
        }
      })
    },
    recordStart () {
      this.recorderManager.start({
        // format: 'mp3'
        format: 'aac'
      })
    },
    recordStop () {
      this.recorderManager.stop()
    },
    recordPlay () {
      let src = this.src
      console.log('src', src)
      if (src === '') {
        // this.tip("请先录音！")
        console.log('请先录音！')
        return
      }
      if (this.innerAudioContext.paused) {
        this.innerAudioContext.src = src
        this.innerAudioContext.play()
      }
    }
  },
  mounted () {
    let _that = this
    this.recorderManager = wx.getRecorderManager()
    this.recorderManager.onError(function () {
      console.log('录音失败！')
    })
    this.recorderManager.onStop(function (res) {
      // _that.setData({
      //   src: res.tempFilePath
      // })
      _that.src = res.tempFilePath
      console.log(res.tempFilePath)
      console.log('录音完成')
    })
    // 创建音频
    this.innerAudioContext = wx.createInnerAudioContext()
    this.innerAudioContext.onError((res) => {
      console.log('res', res)
      console.log('播放录音失败！')
    })
  }
}
</script>

<style lang='scss'>
.container {
  padding: 0 30rpx;
}
.userinfo {
  margin-top: 100rpx;
  text-align: center;
  img {
    width: 150rpx;
    height: 150rpx;
    margin: 20rpx;
    border-radius: 50%;
  }
}
</style>
