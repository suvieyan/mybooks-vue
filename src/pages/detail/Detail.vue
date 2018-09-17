<template>
<div>
  <!-- <BookInfo :info='info'></BookInfo> -->
  <!-- <CommentList :comments="comments"></CommentList> -->
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
import {get, post, showModal} from '@/util'
// import BookInfo from '@/components/BookInfo'
// import CommentList from '@/components/CommentList'
export default {
  components: {
    // BookInfo,
    // CommentList
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
      if (!this.userinfo.openId) {
        return false
      }
      // 评论页面里查到有自己的openid
      if (this.comments.filter(v => v.openid === this.userinfo.openId).length) {
        return false
      }
      return true
    }
  },
    methods:{
    async getDetail () {
      const info = await get('/weapp/bookdetail', {id: this.bookid})
      wx.setNavigationBarTitle({
        title: info.title
      })
      this.info = info
    },
    },
    mounted(){
        // onLoad 的时候获取option，mpvue的文档有
        this.bookid = this.$root.$mp.query.id
        this.getDetail()
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
