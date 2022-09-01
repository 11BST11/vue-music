<template>
  <div class="result-container">
    <div class="title-wrap">
      <h2 class="title">{{keywords}}</h2>
      <span class="sub-title">找到{{count}}个结果</span>
    </div>
    <el-tabs v-model="activeIndex"  @tab-click="handleClick">
      <el-tab-pane label="歌曲" name="songs">
         <el-table :data="songList"  stripe @row-dblclick="handdle">
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column prop="" label="">
          <template slot-scope="scoped">
            <div class="img-wrap-song">
              <img :src="scoped.row.al.picUrl" alt="" />
              <!-- 播放按钮 -->
              <span @click="playMusic(scoped.row)" class="iconfont icon-24gl-play"></span>
            </div>
          </template>
        </el-table-column>
          <el-table-column prop="" label="音乐标题" >
               <template slot-scope="scoped">
               <div class="song-wrap">
                <span>{{ scoped.row.name }}</span>
                <!-- mv标签  -->
                <span  v-if="scoped.row.mv !== 0" class="iconfont icon-MV" @click="toPlayMv(scoped.row.mv)"></span>
                <!-- 二级标题 -->
              <p v-if="scoped.row.alia.length !== 0">{{scoped.row.alia[0]}}</p>
            </div>
          </template>
          </el-table-column>
          <el-table-column prop="" label="歌手">
            <template slot-scope="scoped">
              <span>{{scoped.row.ar[0].name}}</span>
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
      </el-tab-pane>
      <el-tab-pane label="歌单" name="lists">
        <div class="items">
          <div class="item" v-for="(item,index) in playList" :key="index" @click="toPlayListDetail(item.id)">
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:{{item.playCount}}
              </div>
              <img :src="item.coverImgUrl" alt="" />
              <span class="iconfont icon-xiayige-1"></span>
            </div>
            <p class="name">{{item.name}}</p>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="MV" name="mv">
        <div class="items mv">
          <div class="item" v-for="(item,index) in mvList" :key="index" @click="toPlayMv(item.id)">
            <div class="img-wrap">
              <!-- 封面 -->
              <img :src="item.cover" alt="" />
              <span class="iconfont icon-24gl-play"></span>
            <div class="num-wrap">
              <!-- 播放次数 -->
               <span class="el-icon-video-play"></span>
              <div class="num">{{item.playCount}}</div>
            </div>
            <!-- 持续时间 -->
              <span class="time">{{item.duration}}</span>
            </div>
            <div class="info-wrap">
              <!-- 详细信息 -->
              <div class="name">{{item.name}}</div>
              <div class="singer">{{item.artistName}}</div>
            </div>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 分页器 -->
    <Pagination :total="count" :pageSize="pageSize" :nowPage="page" @changePage="handleCurrentChange"/>

  </div>
</template>

<script>
import { playMusicAPI, searchAPI, lyricAPI } from '@/utils/api'
import Pagination from '@/components/Pagination.vue'
export default {
  /* eslint-disable */
  name: 'result',
  data() {
    return {
      activeIndex: 'songs',
      type:1,
      //保存查询的歌曲
      songList: [],
      //保存查询的歌单
      playList:[],
      //保存查询到的MV
      mvList:[],
      count:0,
      page:1,
      pageSize:20,
      keywords:''
    }
  },
  components: {
        Pagination
    },
  watch:{
     activeIndex(){
        switch (this.activeIndex) {
          case 'songs': this.type = 1 
            break;
          case 'lists': this.type = 1000 
            break;
            case 'mv': this.type = 1004 
            break;
          default:
            break;
        }
        this.getData(this.type)
     },
     //解决在搜索解决页面搜索的问题
      $route(newVal){
            this.keywords = newVal.query.q
            this.total = 0
            this.page = 1                
            this.getData(1)
            this.activeIndex='songs'
        }
  },
  created(){
        this.keywords = this.$route.query.q        
        this.getData(1)
    },
  methods: {
    async getData(type) {
      // 获取数据
      let params= {
          keywords: this.$route.query.q,
          type: type,
          // 数量
          limit: 20,
          // // 偏移值 分页 (页码-1)*数量
          offset: (this.page - 1) * 10,
        }
      const { data: res } = await searchAPI(params)
      if(type===1){
        this.songList = res.result.songs
          // 点击最后几页返回的songCount为10会出现bug
          if(this.count === 0)
              this.count = res.result.songCount
       // 处理时长 毫秒 转为 分秒
          for (let i = 0; i < this.songList.length; i++) {           
            const time = this.songList[i].dt
            this.songList[i].dt = this.handleTime(time)
          }
          console.log(this.songList);
      }else if(type === 1000){
         this.playList = res.result.playlists
         this.count = res.result.playlistCount
         // 处理次数
      for (let j = 0; j < this.playList.length; j++) {
          this.playList[j].playCount = this.handlePlayCount(this.playList[j].playCount)
        }
      }else{
        this.mvList = res.result.mvs
        this.count = res.result.mvCount
          // 处理次数,时间
      for (let j = 0; j < this.mvList.length; j++) {
          this.mvList[j].playCount = this.handlePlayCount(this.mvList[j].playCount)
           const time = this.mvList[j].duration
            this.mvList[j].duration = this.handleTime(time)
        }
      }
    },
    //处理表格行双点击事件
    async handdle(row){
      this.playMusic(row)
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
    //处理播放次数
    handlePlayCount(playCount){
         if (playCount > 100000) {
          return parseInt(playCount / 10000) + '万'
        }
        return playCount
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
          result.artist = item.ar[0].name || false
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
    //去歌单详情页
    toPlayListDetail(id){
       this.$router.push('/playListDetail?p='+id)
    },
    //去Mv详情页
    toPlayMv(id){
       this.$router.push(`/mv?p=${id}`)
    },
     handleCurrentChange(val){
        this.page = val
        this.getData(this.type)
    },
    handleClick() {
        this.page=1
      },
  }
}
</script>

<style lang="less" scoped>
 .song-wrap .iconfont {
  padding-left: 5px;
  color: #dd6d60;
}
.result-container .title-wrap {
  display: flex;
  align-items: flex-end;
  margin-bottom: 20px;
}

.result-container .title-wrap .title {
  margin-right: 10px;
}

.result-container .title-wrap .sub-title {
  font-size: 15px;
  color: #bebebe;
}

.song-wrap p {
  color: #c5c5c5;
  font-size: 12px;
}
.result-container .items {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.result-container .items .item {
   width: 200px;
  margin: 10px 0;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.result-container .items .item .img-wrap {
  width: 100%;
  position: relative;
}

.result-container .items .item .img-wrap > .iconfont {
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
.img-wrap-song {
  position: relative;
  width: 70px;
  height: 70px;
}

 .img-wrap-song img {
  width: 70px;
  height: 70px;
  border-radius: 5px;
}

 .img-wrap-song .iconfont {
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
 .img-wrap-song:hover .iconfont {
   opacity: 1;
 }
 .img-wrap-song .iconfont::before {
  transform: translateX(1px);
}
.result-container .items .item .img-wrap > .iconfont::before {
  transform: translateX(1px);
}

.result-container .items .item .img-wrap:hover > .iconfont {
  opacity: 1;
}

.result-container .items .item .img-wrap img {
  width: 100%;
  border-radius: 5px;
}

.result-container .items .item .name {
  font-size: 15px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.result-container .items.mv .item {
  width: 250px;
}

.result-container .items .item .img-wrap .num-wrap {
  position: absolute;
  color: white;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  font-size: 15px;
  padding-right: 5px;
  padding-top: 2px;
}

.result-container .items .item .img-wrap .time {
  position: absolute;
  bottom: 5px;
  right: 5px;
  color: white;
  font-size: 15px;
}

.result-container .items .item .singer {
  font-size: 14px;
  color: #c5c5c5;
}
.el-pagination {
  margin-top: 30px;
  text-align: center;
}
</style>