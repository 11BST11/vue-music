<template>
  <div>
    <!-- 轮播图 -->
    <el-carousel type="card" height="230px">
      <el-carousel-item v-for="(item,index) in bannersData" :key="index">
        <img :src="item.imageUrl" alt="">
      </el-carousel-item>
    </el-carousel>
    <!-- 推荐歌单 -->
    <div class="recommend">
      <h3 class="title">推荐歌单</h3>
        <div class="items">
        <div class="item" v-for="(item,index) in musicListData" :key="index" @click="toPlayListDetail(item.id)">
            <div class="img-wrap">
            <div class="desc-wrap">
              播放量:<span class="desc">{{item.playCount}}</span>
            </div>
            <img :src="item.picUrl" alt="" />
            <span class="iconfont icon-xiayige-1"></span>
          </div>
          <p class="name">{{item.name}}</p>
        </div>
      </div>
    </div>
     <!-- 最新音乐 -->
    <div class="news">
      <h3 class="title">最新音乐</h3>
      <div class="items" >
        <div class="item" v-for="(item,index) in newestMusicData" :key="index">
          <div class="img-wrap">
            <img :src="item.picUrl" alt="" />
            <span @click="playMusic(item)" class="iconfont icon-24gl-play"></span>
          </div>
          <div class="song-wrap">
            <div class="song-name">{{item.name}}</div>
            <div class="singer">{{item.song.artists[0].name}}</div>
          </div>
        </div>
      </div>
    </div>
     <!-- 推荐MV -->
    <div class="mvs">
      <h3 class="title">推荐MV</h3>
      <div class="items">
        <div class="item" v-for="(item,index) in recommendedMv" :key="index" @click="toPlayMv(item.id)">
          <div class="img-wrap">
            <img :src="item.picUrl" alt="" />
            <span class="iconfont icon-24gl-play"></span>
            <div class="num-wrap">
               <span class="el-icon-video-play"></span>
              <div class="num">{{item.playCount}}</div>
            </div>
          </div>
          <div class="info-wrap">
            <div class="name">{{item.name}}</div>
            <div class="singer">{{item.artistName}}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { bannerAPI, recommendSonglistAPI, recommendSongAPI, recommendMVAPI, playMusicAPI, lyricAPI } from '@/utils/api'

export default {
  /* eslint-disable */
  name: 'discovery',
  data() {
    return {
      bannersData: [],
      musicListData: [],
      newestMusicData:[],
      recommendedMv:[]

    }
  },
  created() {
    this.getData1()
    this.getData2()
    this.getData3()
    this.getData4()
  },
  methods: {
    // 轮播图
    async getData1() {
      // 获取轮播图
        
      const { data: res } = await bannerAPI()
      if(res.code !== 200){
        return this.$message.error('轮播图获取失败！')
      }
      this.bannersData = res.banners
    },
    // 推荐歌单
    async getData2() {
      const { data: res } = await recommendSonglistAPI({limit:10})
      this.musicListData = res.result
      for (let j = 0; j < this.musicListData.length; j++) {
          this.musicListData[j].playCount = this.handlePlayCount(this.musicListData[j].playCount)
        }
    },
    // 最新音乐
    async getData3() {
      const { data: res } = await recommendSongAPI()
      this.newestMusicData = res.result
    },
    //播放音乐
    async playMusic(item){
       const { data: res1 } = await playMusicAPI({id:item.id})
        const { data: res2 } = await lyricAPI({id:item.id})
       const result = {}
          // id 是用来区分音频的唯一标识
          result.id = item.id
          // 音乐地址
          result.url = res1.data[0].url  || false
          // 音乐标题
          result.name = item.name || false
          // 艺术家
          result.artist = item.song.artists[0].name || false
          // 封面
          result.cover = item.picUrl || false
          // 歌词
          result.lrc = res2.lrc ? res2.lrc.lyric : null
          // 主题
          result.theme = '#f56c6c'
      //给父组件传递音乐
      this.$store.commit('updateData', result)
    },  
    // 推荐MV
    async getData4() {
      const { data: res } = await recommendMVAPI()
      this.recommendedMv = res.result
      for (let j = 0; j < this.recommendedMv.length; j++) {
          this.recommendedMv[j].playCount = this.handlePlayCount(this.recommendedMv[j].playCount)
        }
    },
    //去歌单详情页
    toPlayListDetail(id){
       this.$router.push('/playListDetail?p='+id)
    },
    //去Mv详情页
    toPlayMv(id){
       this.$router.push(`/mv?p=${id}`)
    },
     //处理播放次数
    handlePlayCount(playCount){
         if (playCount > 100000) {
          return parseInt(playCount / 10000) + '万'
        }
        return playCount
    }
  }
}
</script>

<style lang="less" scoped>
.el-carousel {
  margin-top: 20px;
}
 .el-carousel__item img {
  width: 100%;
  height: 100%;
  border-radius: 10px;
}

 .title {
  font-weight: bold;
  margin: 20px 0;
  font-size: 26px;
}

 .recommend {
  margin-bottom: 40px;
}

 .recommend .items {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

 .recommend .items .item {
   
  width: 200px;
  position: relative;
  overflow: hidden;
  margin: 16px 0;
}

 .recommend .items .item img {
  width: 200px;
  height: 200px;
  border-radius: 5px;
}

 .recommend .items .item .desc-wrap {
  position: absolute;
  width: 100%;
  font-size: 16px;
  color: white;
  background: rgba(0, 0, 0, 0.5);
  max-height: 50px;
  padding: 5px;
    /* -webkit-line-clamp 用来限制在一个块元素显示的文本的行数。 为了实现该效果，它需要组合其他的WebKit属性
2-1.display: -webkit-box; 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示 。
2-2.-webkit-box-orient 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 。
2-3.text-overflow: ellipsis; ，可以用来多行文本的情况下，用省略号“…”隐藏超出范围的文本  */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  //动画
  top: -60px;
}

 .recommend .items .item:hover .desc-wrap {
  //  结合上面的top: -50px
  top: 0;
}

 .recommend .items .item .img-wrap {
  position: relative;
}

 .recommend .items .item .img-wrap .iconfont {
  position: absolute;
  right: 10px;
  bottom: 13px;
  width: 40px;
  height: 40px;
  font-size: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  opacity: 0;
}

 .recommend .items .item .img-wrap:hover .iconfont {
  opacity: 1;
}
.recommend .items .item .img-wrap .iconfont::before {
  transform: translateX(1px);
}
 .recommend .items .item .name {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: 14px;
}

 .news {
  margin-bottom: 40px;
}

 .news .items {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

}

 .news .items .item {
  height: 100px;
  width: 50%;
  display: flex;
  align-items: center;
}

 .news .items .item:hover {
  background-color: #f5f5f5;
}

 .news .items .item .img-wrap {
  position: relative;
  cursor: pointer;
}

 .news .items .item .img-wrap img {
  width: 80px;
  height: 80px;
}

 .news .items .item .img-wrap .iconfont {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  text-align: center;
  line-height: 30px;
  border-radius: 50%;
  font-size: 14px;
  background: rgba(255, 255, 255, 0.8);
  opacity: 0;
  font-size: 20px;
}

 .news .items .item .img-wrap:hover .iconfont {
  opacity: 1;
}

 .news .items .item .song-wrap {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 100%;
  padding: 10px;
  font-size: 16px;
}

 .news .items .item .song-wrap .singer {
  font-size: 14px;
  color: gray;
}

 .mvs .items {
  display: flex;
  justify-content: space-between;
}

 .mvs .items .item {
  width: 220px;
  cursor: pointer;
}

 .mvs .items .item .img-wrap {
  width: 100%;
  position: relative;
}

 .mvs .items .item .img-wrap  .iconfont {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  font-size: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  opacity: 0;
}
  .mvs .items .item .img-wrap > .iconfont::before {
  transform: translateX(2px);
}
 .mvs .items .item .img-wrap:hover  .iconfont {
  opacity: 1;
}

 .mvs .items .item .img-wrap img {
  width: 100%;
  height: 160px;
  border-radius: 5px;
}

 .mvs .items .item .img-wrap .num-wrap {
  position: absolute;
  color: white;
  top: 0;
  right: 0;
  display: flex;
  align-content: center;
  font-size: 15px;
  padding-right: 5px;
  padding-top: 2px;
}

 .mvs .items .item .info-wrap .name {
  font-size: 15px;
  margin-bottom: 5px;
    overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

 .mvs .items .item .info-wrap .singer {
  font-size: 14px;
  color: #c5c5c5;
}
</style>