<template>
<div>
    <TopSwiper :tops='tops'></TopSwiper>
    <Card v-for="book in books" :key="book.id" :book="book"></Card>
    <p class="text-footer" v-if="!more">
        没有更多数据
    </p>
</div>
</template>
<script>
// 35条数据
// 每次加载10条
// 0页   0-10
// 1     10-20
// 2     20-30（5）
// page 当前第几页

// 没有更多数据
// 1. page=0 不能显示这条提醒
// 2. page>0 数据长度<10 停止触底加载
// import { get } from '@/util'
import Card from '@/components/Card'
import TopSwiper from '@/components/TopSwiper'
import config from '../../config'
export default {
  components: {
    Card,
    TopSwiper
  },
  data () {
    return {
      books: [],
      page: 0,
      more: true,
      tops: []
    }
  },
  methods: {
    getList (init) {
      if (init) {
        this.page = 0
        this.more = true
      }
      // 显示navbar的loading
      wx.showNavigationBarLoading()
      let _that = this
      wx.request({
        // 发送post请求为了方便传递到后台数据
        url: config.host + '/booklist',
        method: 'get',
        data: {
          page: this.page
        },
        success: function (res) {
          // _that.books = res.data.data
          if (_that.books.length < 10 && _that.page > 0) {
            _that.more = false
          }
          console.log('init', init)
          if (init) {
            _that.books = res.data.data
            // 停止当前下拉页面刷新
            wx.stopPullDownRefresh()
          } else {
            // 下拉刷新，不能直接覆盖books 而是累加
            _that.books = _that.books.concat(res.data.data)
          }
          // 停止显示navbar的loading
          wx.hideNavigationBarLoading()
        }
      })
    },
    getTop () {
      let _that = this
      wx.request({
        // 发送post请求为了方便传递到后台数据
        url: config.host + '/top',
        method: 'get',
        success: function (res) {
          console.log('top', res.data.data)
          _that.tops = res.data.data
        }
      })
    }
  },
  onPullDownRefresh () {
    // 下拉刷新触发的函数
    this.getList(true)
    console.log('下拉')
  },
  onReachBottom () {
    // 触底的函数
    if (!this.more) {
      // 没有更多了
      return false
    }
    this.page = this.page + 1
    this.getList()
    this.getTop()
  },
  mounted () {
    this.getList(true)
    this.getTop()
  }
}
</script>
<style>
</style>
