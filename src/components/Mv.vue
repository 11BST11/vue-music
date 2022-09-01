<template>
  <div class="mv-container">
    <div class="mv-wrap">
      <h3 class="title">mv详情</h3>
      <!-- mv -->
      <div class="video-wrap">
        <video controls :src="url"></video>
      </div>
      <!-- mv信息 -->
      <div class="info-wrap">
        <div class="singer-info">
          <div class="avatar-wrap" @click="goToArticl(artistId)">
            <img :src="avatarUrl" alt="" />
          </div>
          <span class="name">{{detailMv.artistName}}</span>
        </div>
        <div class="mv-info">
          <h2 class="title">{{detailMv.name}}</h2>
          <span class="date">发布：{{detailMv.publishTime}}</span>
          <span class="number">播放：{{detailMv.playCount}}</span>
          <p class="desc">{{detailMv.desc}}</p>
        </div>
      </div>
      <!-- 精彩评论 -->
      <div class="comment-wrap">
        <p class="title">精彩评论<span class="number">({{hotCount}})</span></p>
        <div class="comments-wrap">
          <!-- 评论 -->
          <div class="item" v-for="(item,index) in hotCommentList" :key="index">
            <div class="icon-wrap">
              <!-- 头像 -->
              <img :src="item.user.avatarUrl" alt="" />
            </div>
            <div class="content-wrap">
              <div class="content">
                <!-- 昵称 -->
                <span class="name" v-if="item.user">{{item.user.nickname}}：</span>
                <!-- 评论内容 -->
                <span class="comment">{{item.content}}</span>
              </div>
              <!-- 评论回复 -->
              <div class="re-content" v-if="item.beReplied.length !== 0">
                <span class="name" v-if="item.beReplied">{{item.beReplied[0].user.nickname}}：</span>
                <span class="comment" v-if="item.beReplied">{{item.beReplied[0].content}}</span>
              </div>
              <div class="date">{{item.time | dateFormat}}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 最新评论 -->
      <div class="comment-wrap">
        <p class="title">最新评论<span class="number">({{total}})</span></p>
        <div class="comments-wrap">
          <div class="item" v-for="(item,index) in newCommentList" :key="index">
            <div class="icon-wrap">
              <!-- 头像 -->
              <img :src="item.user.avatarUrl" alt="" />
            </div>
            <div class="content-wrap">
              <div class="content">
                <!-- 昵称 -->
                <span class="name" v-if="item.user">{{item.user.nickname}}：</span>
                <!-- 评论内容 -->
                <span class="comment">{{item.content}}</span>
              </div>
              <!-- 评论回复 -->
              <div class="re-content" v-if="item.beReplied.length !== 0">
                <span class="name" v-if="item.beReplied">{{item.beReplied[0].user.nickname}}：</span>
                <span class="comment" v-if="item.beReplied">{{item.beReplied[0].content}}</span>
              </div>
              <div class="date">{{item.time | dateFormat}}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 分页器 -->
      <Pagination :total="total" :pageSize="pageSize" :nowPage="page" @changePage="handleCurrentChange"/>

    </div>
    <div class="mv-recommend">
      <h3 class="title">相关推荐</h3>
      <div class="mvs">
        <div class="items">
          <div class="item" v-for="(item,index) in simiMvs" :key="index" @click="toPlayMv(item.id)">
            <div class="img-wrap">
              <img :src="item.cover" alt="" />
              <span class="iconfont icon-24gl-play"></span>
            <div class="num-wrap">
               <span class="el-icon-video-play num"></span>
                <div >{{item.playCount}}</div>
              </div>
              <span class="time">{{item.duration | dateFormatmini}}</span>
            </div>
            <div class="info-wrap">
              <div class="name">{{item.name}}</div>
              <div class="singer">{{item.artistName}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { commentsAPI, playMVAPI, simiMVAPI, mvDetailAPI, hotComment, artistsAPI } from '@/utils/api'
import Pagination from '@/components/Pagination.vue'
export default {
  /* eslint-disable */
  name: 'mv',
  data() {
    return {
      // 总条数
      total: 0,
      // 页码
      page: 1,
      pageSize:20,
      // 页容量
      limit: 10,
      url: '',
      // 相关MV数据
      simiMvs: [],
      //mv详细信息
      detailMv: [],
      //歌手封面
       avatarUrl:'',
      //热门评论列表
      hotCommentList: [],
      // 热门评论个数
      hotCount: 0,
      //最新评论
      newCommentList: [],
      //歌手id
      artistId:''
    }
  },
  created() {
    this.getMvData()
    this.getSimiMvData()
    this.getDetailMvData()
   this.getHotCommentDate()
    this.getNewCommentDate()
    this.open()
  },
  components: {
        Pagination
    }, 
  methods: {
    //获取mv播放
    async getMvData() {
      const { data: res } = await playMVAPI({id: this.$route.query.p})
      this.url = res.data.url
    },
    open(){
      this.$notify({
        type: 'success',
        dangerouslyUseHTMLString: true,
        message: '点击歌手头像查看更多信息',
        offset: 100
      })
    },
    //获取相似mv
    async getSimiMvData() {
      const { data: res } = await simiMVAPI({ mvid: this.$route.query.p})
      this.simiMvs = res.mvs
      for (let i = 0; i < this.simiMvs.length; i++) {
        if (this.simiMvs[i].playCount > 100000) {
          this.simiMvs[i].playCount = parseInt(this.simiMvs[i].playCount / 10000) + '万'
        }
      }
    },
    //获取mv详细信息
    async getDetailMvData() {
      const { data: res } = await mvDetailAPI({mvid: this.$route.query.p})
      this.detailMv = res.data
      this.artistId = res.data.artistId
        if (this.detailMv.playCount > 100000) {
          this.detailMv.playCount = parseInt(this.detailMv.playCount / 10000) + '万'
        }
       artistsAPI({id:this.artistId}).then(res=>{
                    this.avatarUrl = res.data.artist.img1v1Url
                })  
    },
    //获取评论
   async getHotCommentDate() {
       let  params= {
          id: this.$route.query.p,
          type: 1
        }
      const { data: res } = await hotComment(params)

      this.hotCommentList = res.hotComments
      this.hotCount = res.total
    },
    async getNewCommentDate() {
      let params= {
          id: this.$route.query.p,
          limit : 10,
           offset: (this.page - 1) * 10,
        }
      const { data: res } = await commentsAPI(params,'mv')
      this.newCommentList = res.comments
      this.total = res.total
    },
     //去Mv详情页
    toPlayMv(id){
       this.$router.push(`/mv?p=${id}`)
        this.$router.go(0)
        
    },
    handleCurrentChange(val) {
      this.page = val
      this.getNewCommentDate()
    },
    goToArticl(id){
      this.$router.push('/article?q=' + id)
    }
  }

}
</script>

<style lang="less" scope="scoped">
.mv-container {
  margin-top: 20px;
  display: flex;
}

.mv-container .title {
  margin-bottom: 20px;
  font-size: 25px;
}

.mv-container .mv-wrap {
  width: 700px;
  margin-right: 35px;
}

.mv-container .mv-wrap .date {
  margin-right: 25px;
}

.mv-container .mv-wrap .date,
.mv-container .mv-wrap .number {
  color: #bebebe;
  font-size: 14px;
}

.mv-container .mv-wrap .video-wrap {
  width: 100%;
  height: 390px;
  margin-bottom: 20px;
}

.mv-container .mv-wrap .video-wrap video {
  border-radius: 5px;
  height: 100%;
  width: 100%;
  outline: none;
}

.mv-container .mv-wrap .info-wrap {
  margin-bottom: 50px;
}

.mv-container .mv-wrap .info-wrap .singer-info {
  display: flex;
  align-items: center;
  margin-bottom: 35px;
}

.mv-container .mv-wrap .info-wrap .singer-info .avatar-wrap {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  margin-right: 10px;
  overflow: hidden;
}

.mv-container .mv-wrap .info-wrap .singer-info .avatar-wrap img {
  height: 100%;
}

.mv-container .mv-wrap .info-wrap .mv-info .title {
  font-size: 25px;
}

.mv-container .mv-wrap .info-wrap .mv-info .desc {
  font-size: 15px;
  margin-top: 20px;
}

.mv-container .mv-wrap .comment-wrap .title {
  font-size: 25px;
}

.mv-container .mv-wrap .comment-wrap .title .number {
  color: black;
  font-size: 20px;
}

.mv-container .mv-wrap .comment-wrap .item {
  display: flex;
  padding-top: 20px;
}

.mv-container .mv-wrap .comment-wrap .item .icon-wrap {
  margin-right: 15px;
}

.mv-container .mv-wrap .comment-wrap .item .icon-wrap img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.mv-container .mv-wrap .comment-wrap .item:not(:last-child) .content-wrap {
  border-bottom: 1px solid #f2f2f1;
}

.mv-container .mv-wrap .comment-wrap .item .content-wrap {
  padding-bottom: 20px;
  flex: 1;
}

.mv-container .mv-wrap .comment-wrap .item .content-wrap .name {
  color: #517eaf;
  font-size: 14px;
}

.mv-container .mv-wrap .comment-wrap .item .content-wrap .comment {
  font-size: 14px;
}

.mv-container .mv-wrap .comment-wrap .item .content-wrap .content,
.mv-container .mv-wrap .comment-wrap .item .content-wrap .re-content {
  margin-bottom: 10px;
}

.mv-container .mv-wrap .comment-wrap .item .content-wrap .re-content {
  padding: 10px;
  background-color: #e6e5e6;
  border-radius: 5px;
}

.mv-container .mv-recommend {
  flex: 1;
}

.mv-container .mv-recommend .mvs .items {
  display: flex;
  flex-wrap: wrap;
}

.mv-container .mv-recommend .mvs .items .item {
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 10px;
}

.mv-container .mv-recommend .mvs .items .item:hover {
  background-color: #f5f5f5;
}

.mv-container .mv-recommend .mvs .items .item .img-wrap {
  width: 180px;
  position: relative;
  margin-right: 10px;

}

.mv-container .mv-recommend .mvs .items .item .img-wrap > .iconfont {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  font-size: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  opacity: 0;
}

.mv-container .mv-recommend .mvs .items .item .img-wrap > .iconfont::before {
  transform: translateX(2px);
}

.mv-container .mv-recommend .mvs .items .item .img-wrap:hover > .iconfont {
  opacity: 1;
}

.mv-container .mv-recommend .mvs .items .item .img-wrap img {
  width: 100%;
  border-radius: 5px;
}

.mv-container .mv-recommend .mvs .items .item .img-wrap .num-wrap {
  position: absolute;
  color: white;
  top: 0;
  right: 0;
  display: flex;
  font-size: 15px;
  padding-right: 5px;
  padding-top: 2px;
}
.mv-container .mv-recommend .mvs .items .item .img-wrap .num-wrap .num {
  margin-top: 3px;
}
.mv-container .mv-recommend .mvs .items .item .img-wrap .time {
  position: absolute;
  bottom: 5px;
  right: 5px;
  color: white;
  font-size: 15px;
}

.mv-container .mv-recommend .mvs .items .item .info-wrap {
  flex: 1;
}

.mv-container .mv-recommend .mvs .items .item .info-wrap .name {
  font-size: 15px;
}

.mv-container .mv-recommend .mvs .items .item .info-wrap .singer {
  font-size: 14px;
  color: #c5c5c5;
}

</style>
