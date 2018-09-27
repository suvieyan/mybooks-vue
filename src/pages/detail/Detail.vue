<template>
<div>
   <BookInfo :info='info'></BookInfo>
   <CommentList :comments="comments"></CommentList>
  <div class="comment" v-if="showAdd">
    <textarea v-model='comment'
              class='textarea'
              :maxlength='100'
              placeholder='请输入图书短评'></textarea>
    <div class='location'>
      地理位置：
      <switch color='#EA5A49' :checked='location' @change='getGeo'></switch>
      <span class='text-primary'>{{location}}</span>
    </div>
    <div class='phone'>
      手机型号：
      <switch color='#EA5A49' :checked='phone' @change='getPhone'></switch>
      <span class='text-primary'>{{phone}}</span>
    </div>
    <button class="btn" @click='addComment'>
      评论
    </button>
  </div>
  <div v-else class='text-footer'>
    未登录或者已经评论过啦
  </div>
  <button open-type='share' class="btn">转发给好友</button>
</div>

</template>
<script>
import {showModal} from '@/util'
import BookInfo from '@/components/BookInfo'
import CommentList from '@/components/CommentList'
import config from '../../config'
export default {
  components: {
    BookInfo,
    CommentList
  },
  data () {
    return {
      comments: [],
      userinfo: {},
      bookid: '',
      info: {},
      comment: '',
      location: '',
      phone: ''
    }
  },
  computed: {
    showAdd () {
      // 没登录
      if (!this.userinfo.openid) {
        return false
      }
      // 评论页面里查到有自己的openid
      if (this.comments.filter(v => v.openid === this.userinfo.openid).length) {
        return false
      }
      return true
    }
  },
  methods: {
    getDetail () {
      let _that = this
      wx.request({
        // 发送post请求为了方便传递到后台数据
        url: config.host + '/bookdetail',
        method: 'get',
        data: {id: this.bookid},
        success: function (res) {
          console.log('bookdetail', res.data.data)
          let info = res.data.data
          wx.setNavigationBarTitle({
            title: info.title
          })
          _that.info = info
        }
      })
    },
    addComment () {
      if (!this.comment) {
        return
      }
      // 评论内容 手机型号  地理位置 图书id 用户的openid
      const data = {
        openid: this.userinfo.openid,
        bookid: this.bookid,
        comment: this.comment,
        phone: this.phone,
        location: this.location
      }
      let _that = this
      try {
        wx.request({
          // 发送post请求为了方便传递到后台数据
          url: config.host + '/addcomment',
          method: 'get',
          data: data,
          success: function (res) {
            _that.comment = ''
            _that.getComments()
          }
        })
      } catch (e) {
        showModal('失败', e.msg)
      }
    },
    getComments () {
      let _that = this
      wx.request({
        // 发送post请求为了方便传递到后台数据
        url: config.host + '/commentlist',
        method: 'get',
        data: {bookid: this.bookid},
        success: function (res) {
          let comments = res.data.data
          console.log('comments', res.data.data)
          _that.comments = comments || []
        }
      })
    },
    getGeo (e) {
      // RmKXCpjKlwyFUVVXSCXcLF4KUsOimuuy
      const ak = '3sogQCGO0xUls4bbzNa1GknxNfREcH5Z'
      let url = 'http://api.map.baidu.com/geocoder/v2/'

      if (e.target.value) {
        wx.getLocation({
          success: geo => {
            wx.request({
              url,
              data: {
                ak,
                location: `${geo.latitude},${geo.longitude}`,
                output: 'json'
              },
              success: res => {
                console.log(res)
                if (res.data.status === 0) {
                  this.location = res.data.result.addressComponent.city
                } else {
                  this.location = '未知地点'
                }
              }
            })
          }
        })
      } else {
        this.location = ''
      }
    },
    getPhone (e) {
      if (e.target.value) {
        const phoneInfo = wx.getSystemInfoSync()
        this.phone = phoneInfo.model
      } else {
        // 没选中
        this.phone = ''
      }
    }
  },
  mounted () {
    // onLoad 的时候获取option，mpvue的文档有
    this.bookid = this.$root.$mp.query.id
    this.getDetail()
    this.getComments()
    const userinfo = wx.getStorageSync('userinfo')
    if (userinfo) {
      this.userinfo = userinfo
    }
  }
}
</script>
<style lang='scss'>
.comment{
  margin-top:10px;
  .textarea{
    width:730rpx;
    height:200rpx;
    background:#eee;
    padding:10rpx;
  }
  .location{
    margin-top:10px;
    padding:5px 10px;
  }
  .phone{
    margin-top:10px;
    padding:5px 10px;

  }
}

</style>
