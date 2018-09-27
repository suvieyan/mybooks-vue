<template>
  <div class="container">
    <CommentList v-if='userinfo.openid'
                 type='user'
                 :comments="comments"></CommentList>
    <div v-if='userinfo.openid'>
      <div class="page-title">我的图书</div>
      <Card
        v-for='book in books'
        :key='book.id'
        :book='book'></Card>
      <div v-if='!books.length'>暂时还没添加过书，快去添加几本把</div>
    </div>
  </div>
</template>
<script>
  import CommentList from '@/components/CommentList'
  import Card from '@/components/Card'
  import config from '../../config'
export default {
    data () {
      return {
        comments: [],
        books: [],
        userinfo: {}
      }
    },
    components: {
      CommentList,
      Card
    },
    methods: {
      init () {
        wx.showNavigationBarLoading()
        this.getComments()
        this.getBooks()
        wx.hideNavigationBarLoading()
      },
      getBooks () {
        let data = {
          openid: this.userinfo.openid
        }
        let _that = this
        wx.request({
          // 发送post请求为了方便传递到后台数据
          url: config.host + '/mybooks',
          method: 'get',
          data: data,
          success: function (res) {
            _that.books = res.data.data
          }
        })
      },
      getComments () {
        let data = {
          openid: this.userinfo.openid
        }
        let _that = this
        wx.request({
          // 发送post请求为了方便传递到后台数据
          url: config.host + '/mycomments',
          method: 'get',
          data: data,
          success: function (res) {
            _that.comments = res.data.data
          }
        })
      }
    },
    onPullDownRefresh () {
      this.init()
      wx.stopPullDownRefresh()
    },
    onShow () {
      // 分享的生命周期
      wx.showShareMenu()
      if (!this.userinfo.openid) {
        let userinfo = wx.getStorageSync('userinfo')
        if (userinfo) {
          this.userinfo = userinfo
          this.init()
        }
      }
    }
  }
</script>
<style>


</style>
