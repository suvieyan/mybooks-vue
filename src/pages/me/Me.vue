
<template>

  <div class="container">
    <div class="userinfo" >
      <img :src="userinfo.avatarUrl" alt="">
      <p>{{userinfo.nickName}}</p>
    </div>
    <YearProgress></YearProgress>
    <button v-if='userinfo.openid' @click='scanBook' class='btn'>添加图书</button>
    <button v-else open-type="getUserInfo" lang="zh_CN" class='btn' @getuserinfo="login">点击登录</button>

  </div>

</template>
<script>
import YearProgress from '@/components/YearProgress'
import { showSuccess, showModal } from '@/util'
import config from '@/config'
export default {
  components: {
    YearProgress
  },
  data () {
    return {
      userinfo: {
        avatarUrl: '../../static/other/unlogin.png',
        nickName: ''
      }
    }
  },
  methods: {
    addBook (isbn) {
      wx.request({
        // 发送post请求为了方便传递到后台数据
        url: config.host + '/addbook',
        method: 'post',
        data: {
          isbn: isbn,
          openid: this.userinfo.openid
        },
        success: function (res) {
          console.log('res', res)
          if (res.data.code === -1) {
            showModal('添加失败', `${res.data.msg}`)
          } else {
            console.log('添加图书成功', res.data)
            showModal('添加成功', `${res.data.data.title}添加成功`)
          }
        }
      })
    },
    scanBook () {
      // 允许从相机和相册扫码
      wx.scanCode({
        success: res => {
          if (res.result) {
            console.log('isbn', res.result) // isbn
            this.addBook(res.result)
          }
        }
      })
    },
    loginSuccess (res) {
      showSuccess('登录成功')
      wx.setStorageSync('userinfo', res)
      this.userinfo = res
      console.log('userinfo', res)
    },
    login (e) {
      // e:getUserInfo触发的事件
      if (!e.target.userInfo) {
        // 没有获取到userinfo
        return
      }
      // 获取到userinfo之后，利用request方法发送ajax请求
      let data = e.target.userInfo
      let _that = this
      // 微信登录的流程；先获取用户的code，在通过code获取用户的唯一标识（openid） 及本次登录的 会话密钥（session_key）等
      wx.login({
        success: function (res) {
          if (!res.code) {
            return
          }
          data['code'] = res.code
          wx.request({
            // 发送post请求为了方便传递到后台数据
            url: config.loginUrl,
            method: 'post',
            data: JSON.stringify(data),
            success: function (res) {
              console.log('登录成功', res.data.data)
              _that.loginSuccess(res.data.data)
            }
          })
        }
      })
    }
  },
  onShow () {
    wx.showShareMenu()
    let userinfo = wx.getStorageSync('userinfo')
    if (userinfo) {
      this.userinfo = userinfo
    }
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
