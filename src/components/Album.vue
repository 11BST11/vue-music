<template>
  <div class="playlist">
    <div class="playlist-top-card">
      <div class="playlist-img-wrap">
        <img :src="albumInfo.picUrl" alt="">
      </div>
      <div class="playlist-info">
        <div class="playlist-name">
          <div class="tag1">专辑</div>{{albumInfo.name}}
        </div>
        <div class="playlist-user-info">
          <div class="playlist-user-name">歌手：{{artistName}}</div>
          <div class="playlist-user-name">时间：{{albumInfo.publishTime | dateFormatMax}}</div>
          <div class="playlist-user-name">共{{albumInfo.size}}首</div>
        </div>
        <div class="play-wrap">
          <span class="iconfont icon-bofang"></span>
          <span class="text">播放全部</span>
        </div>
      </div>
    </div>

    <div class="playlist-tabs-wrap">
      <el-tabs v-model="activeName" >
        <el-tab-pane label="歌曲列表" name="first">
          <div class="songs-table">
            <el-table :data="tableData" stripe @row-dblclick="play">

              <el-table-column type="index" width="50"></el-table-column>

              <el-table-column prop="name" label="音乐标题" width=""></el-table-column>

              <el-table-column prop="artistInfo" label="歌手" width="">
                <template slot-scope="scope">
                  <div v-for="(singer,i) in scope.row.ar" :key="i" style="display:inline-block" >{{singer.name}}<span style="color:#606266;margin:0 5px" v-show="scope.row.ar.length != 1 && i!=scope.row.ar.length-1">/</span></div>
                </template>
              </el-table-column>

              <el-table-column prop="al.name" label="专辑">
                <template slot-scope="scope">
                  <span >{{scope.row.al.name}}</span>
                </template>
              </el-table-column>

              <el-table-column prop="dt" label="时长" width="100"></el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="`评论(${commentCount})`" name="second">
          <!-- 精彩评论 -->
        <div class="comment-wrap" v-if="hotComments.length!=0">
          <p class="title">精彩评论<span class="number">({{hotComments.length}})</span></p>
          <div class="comments-wrap">
            <!-- 评论 -->
            <div class="item" v-for="(item,index) in hotComments" :key="index">
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
          <p class="title">最新评论<span class="number">({{commentCount-hotComments.length}})</span></p>
          <div class="comments-wrap">
            <div class="item" v-for="(item,index) in comments" :key="index">
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
         <Pagination :total="total" :pageSize="pageSize" :nowPage="page" @changePage="handleCurrentChange"/>
        </el-tab-pane>
        <el-tab-pane label="专辑详情" name="third">
          <span class="tt">专辑介绍</span>
          <p v-for="(item,index) in albumDescList" :key="index" class="dd">{{item}}</p>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { albumAPI, playMusicAPI, commentsAPI, lyricAPI } from '@/utils/api'
import Pagination from '@/components/Pagination.vue'
export default {
  /* eslint-disable */
  name: 'album',
  data() {
    return {
      activeName: 'first',
      albumId: '',
      albumInfo: {},
      artistName: '',
      commentCount: 0,
      albumDescList: '',
      tableData: [],
      comments: [],
      hotComments: [],
     //评论总数
      total: 0,
      //页码
      page:1,
      pageSize:20,
      showAddBall: false
    }
  },
  components: {
    Pagination
  },
  created() {
    this.albumId = this.$route.query.id

    this.getTableData()
    this.getComments(true)
  },
  methods: {
    handleCurrentChange(page) {
      this.page = page
      this.getComments()
    },

    getTableData() {
      albumAPI({ id: this.albumId })
        .then(res => {
          console.log(res)
          this.albumInfo = res.data.album
          this.commentCount = this.albumInfo.info.commentCount
          this.artistName = res.data.album.artist.name
          for (const item of res.data.songs) {
            const duration = item.dt
            const min = parseInt(duration / 60000)
              .toString()
              .padStart(2, '0')
            const second = parseInt((duration - min * 60000) / 1000)
              .toString()
              .padStart(2, '0')
            item.dt = `${min}:${second}`
          }
          this.tableData = res.data.songs

          const albumDesc = this.albumInfo.description
          this.albumDescList = albumDesc.split(/[\n]/)
        })
    },
     // 播放音乐
    async play (item) {
      console.log(item);
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
    getComments(isFirst = false) {
      const params = {
        id: this.albumId,
        limit: this.pageSize,
        offset: (this.page - 1) * this.pageSize
      }
      commentsAPI(params, 'album').then(res => {
        console.log(res)

        if (isFirst) {
          if (Object.prototype.hasOwnProperty.call(res.data, 'hotComments')) {
            this.hotComments = res.data.hotComments
          }
        }

        this.total = this.commentCount - this.hotComments.length
        this.comments = res.data.comments
      })
    },
  },
  watch: {
    $route(newVal) {
      this.albumId = newVal.query.id
      this.getTableData()
      this.getComments(true)

      setTimeout(() => {
        this.activeName = 'first'
      }, 100)
    }
  }
}
</script>

<style scoped>

.playlist-top-card {
  display: flex;
  /* height: 300px; */
}

.playlist-img-wrap {
  width: 200px;
  height: 200px;
}

.playlist-img-wrap img {
  width: 100%;
  height: 100%;
}

.playlist-info {
  /* font-size: 16px; */
  padding: 0 20px;
  flex: 1;
}

.playlist-info .tag1 {
  color: rgb(53, 146, 208);
  border: 1px solid rgb(53, 159, 208);
  display: inline-block;
  font-size: 20px;
  margin-right: 10px;
  border-radius: 5px;
  padding: 0px 7px;
  cursor: default;
}

.playlist-name {
  font-size: 25px;
  font-weight: 600;
  display: flex;
  align-items: center;
}

.playlist-user-info {
  /* display: flex; */
  align-items: center;
  font-size: 14px;
}

.playlist-user-avatar img {
  height: 30px;
  width: 30px;
  border-radius: 50%;
}

.playlist-user-name {
  margin: 20px 10px;
}

 .play-wrap {
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

 .play-wrap .iconfont {
  font-size: 20px;
}

 .play-wrap span.text {
  font-size: 16px;
}

.playlist-tabs-wrap {
  margin-top: 20px;
}

 .comment-wrap .title {
  font-size: 20px;
}

 .comment-wrap .title .number {
  color: black;
  font-size: 18px;
}

 .comment-wrap .item {
  display: flex;
  padding-top: 20px;
}

 .comment-wrap .item .icon-wrap {
  margin-right: 15px;
}

 .comment-wrap .item .icon-wrap img {
  width: 50px;
  height: 50px;
  border-radius: 50%;
}

 .comment-wrap .item:not(:last-child) .content-wrap {
  border-bottom: 1px solid #f2f2f1;
}

 .comment-wrap .item .date {
  color: #bebebe;
  font-size: 14px;
}

 .comment-wrap .item .content-wrap {
  padding-bottom: 20px;
  flex: 1;
  font-size: 14px;
}

 .comment-wrap .item .content-wrap .name {
  color: #517eaf;
}

 .comment-wrap .item .content-wrap .content,
 .comment-wrap .item .content-wrap .re-content {
  margin-bottom: 10px;
}

 .comment-wrap .item .content-wrap .re-content {
  padding: 10px;
  background-color: #e6e5e6;
  border-radius: 5px;
}
.dd {
  line-height: 2.5rem;
  text-indent: 2rem;
  margin: 1rem 0;
}

.tt {
  font-weight: bold;
  font-size: 20px;
  display: inline-block;
  margin: 10px 0;
}
</style>
