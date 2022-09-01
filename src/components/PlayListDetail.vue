<template>
  <div class="playlist-container">
    <div class="top-wrap">
      <!-- 封面 -->
      <div class="img-wrap">
        <img :src="playList.coverImgUrl" alt="" />
      </div>
      <!-- 作者相关信息 -->
      <div class="info-wrap">
        <p class="title">{{playList.name}}</p>
        <div class="author-wrap">
          <!-- 头像 -->
          <!-- vue在使用初始数组中没有的对象数据时，要加个判断，不然会报警告 -->
          <img class="avatar" :src="playList.creator.avatarUrl" alt="" v-if="playList.creator" />
          <span class="name" v-if="playList.creator">{{playList.creator.nickname}}</span>
          <span class="time">{{playList.createTime | dateFormat}} 创建</span>
          <span class="total">共{{trackIdsLength}}首</span>
        </div>
        <div class="play-wrap">
          <span class="iconfont icon-bofang"></span>
          <span class="text">播放全部</span>
        </div>
        <div class="tag-wrap">
          <span class="title">标签:</span>
          <!-- 分类标签 -->
          <ul>
            <li v-for="(item,index) in playList.tags" :key="index">{{item}}</li>
          </ul>
        </div>
        <div class="desc-wrap">
          <span class="title">简介:</span>
          <span class="desc">{{playList.description}}</span>
        </div>
      </div>
    </div>
    <el-tabs v-model="activeIndex">
      <el-tab-pane label="歌曲列表" name="1">
        <div class="songList">
          <el-table :data="songList" stripe>
            <el-table-column type="index" width="50" label="序号"></el-table-column>
            <el-table-column prop="" label="">
              <template slot-scope="scoped">
                <div class="img-wrap">
                  <img :src="scoped.row.al.picUrl" alt="" />
                  <!-- 播放按钮 -->
                  <span @click="playMusic(scoped.row)" class="iconfont icon-24gl-play"></span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="" label="音乐标题">
              <template slot-scope="scoped">
                <div class="song-wrap">
                  <span>{{ scoped.row.name }}</span>
                  <span v-if="scoped.row.mv !== 0" class="iconfont icon-MV" @click="toPlayMv(scoped.row.mv)"></span>
                  <!-- 二级标题 -->
                  <p v-if="scoped.row.alia.length !== 0">{{scoped.row.alia[0]}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="" label="歌手">
              <template slot-scope="scoped">
                <span>{{scoped.row.ar['0'].name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="" label="专辑">
              <template slot-scope="scoped">
                <span>{{scoped.row.al.name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="dt" label="时长">
            </el-table-column>
          </el-table>
        </div>
      </el-tab-pane>
      <el-tab-pane label="评论" name="2">
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
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { playlistDetailAPI, lyricAPI, playMusicAPI, commentsAPI, hotComment, songInfoAPI } from '@/utils/api'
import Pagination from '@/components/Pagination.vue'
export default {
  /* eslint-disable */
  name: 'playListDetail',
  data() {
    return {
      activeIndex: '1',
      //歌单详情数据
      playList: [],
      //歌曲列表
      songList: [],
      //热门评论列表
      hotCommentList: [],
      // 热门评论个数
      hotCount: 0,
      //最新评论
      newCommentList: [],
      //评论总数
      total: 0,
      //页码
      page:1,
      pageSize:20,
      trackIdsLength:0
    }
  },
  components: {
        Pagination
    },
  created() {
    this.getDetailData()
    this.getHotCommentDate()
    this.getNewCommentDate()
  },
  methods: {
    async getDetailData() {
      const { data: res } = await playlistDetailAPI({id: this.$route.query.p})
      this.playList = res.playlist
      
      let idsArray = []
       for(let item of this.playList.trackIds){
                    idsArray.push(item.id)
                }
                this.trackIdsLength =this.playList.trackIds.length
                let idsStr = idsArray.join(",")
         const { data: res2 } = await  songInfoAPI({ids:idsStr})
         this.songList = res2.songs
       // 处理时长 毫秒 转为 分秒
          for (let i = 0; i < this.songList.length; i++) {           
            const time = this.songList[i].dt
            this.songList[i].dt = this.handleTime(time)
          }
    },
    async getHotCommentDate() {
      let  params= {
          id: this.$route.query.p,
          type: 2
        }
      const { data: res } = await hotComment(params)
      this.hotCommentList = res.hotComments
      this.hotCount = res.total
    },
    //处理时间
    handleTime(time){
       // 假定 	350750 毫秒
            // 秒 350750/1000  350秒
            // 分 350 /60
            // 秒 350 % 60
            let min = parseInt(time / 1000 / 60)
            if (min < 10) {
              min = '0' + min
            }
            let sec = parseInt((time / 1000) % 60)
            if (sec < 10) {
              sec = '0' + sec
            }
            // console.log(min + '|' + sec)
            return `${min}:${sec}`
    },
     // 播放音乐
    async playMusic (item) {
      const { data: res2 } = await lyricAPI({ id: item.id })

      const { data: res1 } = await playMusicAPI({ id: item.id })
          const result = {}
          // id 是用来区分音频的唯一标识
          result.id = item.id
          // 音乐地址
          result.url = res1.data[0].url || false
          // 音乐标题
          result.name = item.name || false
          // 艺术家
          result.artist = item.ar['0'].name || false
          // 封面
          result.cover = item.al.picUrl || false
          // 歌词
          result.lrc = res2.lrc ? res2.lrc.lyric : null
          // 主题
          result.theme = '#f56c6c'
          // 给父组件传递音乐
          this.$store.commit('updateData', result)
        },
    async getNewCommentDate() {
      let params= {
          id: this.$route.query.p,
          limit : 10,
           offset: (this.page - 1) * 10,
        }
      const { data: res } = await commentsAPI(params,'playlist')
      this.newCommentList = res.comments
      this.total = res.total
    },
    handleCurrentChange(val){
        this.page = val
        this.getNewCommentDate()
    },
     //去Mv详情页
    toPlayMv(id){
       this.$router.push(`/mv?p=${id}`)
    },
  }
}
</script>

<style lang="less" scoped>
.playlist-container {
  margin: auto;
  padding-top: 20px;
}

.playlist-container .top-wrap {
  display: flex;
}

.playlist-container .top-wrap .img-wrap {
  margin-right: 30px;
}

.playlist-container .top-wrap .img-wrap img {
  width: 230px;
  height: 230px;
}

.playlist-container .top-wrap .info-wrap .title {
  font-size: 26px;
  margin-bottom: 20px;
}

.playlist-container .top-wrap .info-wrap .author-wrap {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  font-size: 20px;
}

.playlist-container .top-wrap .info-wrap .author-wrap img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  margin-right: 10px;
}

.playlist-container .top-wrap .info-wrap .author-wrap .name {
  margin-right: 10px;
}

.playlist-container .top-wrap .info-wrap .author-wrap .time {
  font-size: 14px;
}

.playlist-container .top-wrap .info-wrap .author-wrap .total {
  color: #4daae8;
  margin-left: 10px;
  font-size: 16px;
}

.playlist-container .top-wrap .info-wrap .play-wrap {
  width: 120px;
  height: 35px;
  border-radius: 4px;
  background: linear-gradient(to right, #4daae8, #1798d8);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  color: white;
}

.playlist-container .top-wrap .info-wrap .play-wrap .iconfont {
  font-size: 20px;
}

.playlist-container .top-wrap .info-wrap .play-wrap span.text {
  font-size: 16px;
}

.playlist-container .top-wrap .info-wrap .tag-wrap {
  display: flex;
  margin-bottom: 15px;
}

.playlist-container .top-wrap .info-wrap .tag-wrap span {
  margin: 0;
}

.playlist-container .top-wrap .info-wrap .tag-wrap ul {
  display: flex;
  align-items: center;
}

.playlist-container .top-wrap .info-wrap .tag-wrap li:not(:last-child)::after {
  content: '/';
  margin: 0 4px;
}

.playlist-container .top-wrap .info-wrap .title {
  margin-right: 10px !important;
}

.songList .img-wrap {
  position: relative;
  width: 70px;
  height: 70px;
}

.songList .img-wrap img {
  width: 70px;
  height: 70px;
  border-radius: 5px;
}

.songList .img-wrap .iconfont {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  font-size: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  opacity: 0;
}
.songList .img-wrap:hover .iconfont {
  opacity: 1;
}
.songList .img-wrap .iconfont::before {
  transform: translateX(1px);
}
.songList .song-wrap > span {
  font-size: 16px;
}

.songList .song-wrap p {
  color: #c5c5c5;
  font-size: 12px;
}

.songList .song-wrap .iconfont {
  padding-left: 5px;
  color: #dd6d60;
}

.playlist-container .comment-wrap .title {
  font-size: 20px;
}

.playlist-container .comment-wrap .title .number {
  color: black;
  font-size: 18px;
}

.playlist-container .comment-wrap .item {
  display: flex;
  padding-top: 20px;
}

.playlist-container .comment-wrap .item .icon-wrap {
  margin-right: 15px;
}

.playlist-container .comment-wrap .item .icon-wrap img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

.playlist-container .comment-wrap .item:not(:last-child) .content-wrap {
  border-bottom: 1px solid #f2f2f1;
}

.playlist-container .comment-wrap .item .date {
  color: #bebebe;
  font-size: 14px;
}

.playlist-container .comment-wrap .item .content-wrap {
  padding-bottom: 20px;
  flex: 1;
  font-size: 14px;
}

.playlist-container .comment-wrap .item .content-wrap .name {
  color: #517eaf;
}

.playlist-container .comment-wrap .item .content-wrap .content,
.playlist-container .comment-wrap .item .content-wrap .re-content {
  margin-bottom: 10px;
}

.playlist-container .comment-wrap .item .content-wrap .re-content {
  padding: 10px;
  background-color: #e6e5e6;
  border-radius: 5px;
}
</style>