<template>
  <div class="artist">
    <div class="artist-info">
      <div class="artist-img-wrap">
        <img :src="topInfo.picUrl" alt="">
      </div>
      <div class="artist-others">
        <div class="artist-name">{{topInfo.name}}</div>
        <div class="artsit-works">
          <div class="artist-works-count">单曲数：{{topInfo.musicSize}}</div>
          <div class="artist-works-count">专辑数：{{topInfo.albumSize}}</div>
          <div class="artist-works-count">MV数：{{mvData.length}}</div>
        </div>
      </div>
    </div>

    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="专辑" name="album">
        <ul class="albums">
          <li class="al-item" v-for="(item,index1) in albumData" :key="index1" @click="toAlbum(item.id)">
            <div class="al-img-wrap">
              <p class="iconfont icon-xiayige-1"></p>
              <img :src="item.picUrl" alt="">
            </div>
            <div class="al-name" :title="item.name">{{item.name}}</div>
            <div class="al-time"><span style="color: #13d4ed;">发行时间：</span>{{item.publishTime | dateFormatMax}}</div>
          </li>
        </ul>
      </el-tab-pane>
      <el-tab-pane label="MV" name="mv">
       <div class="mvs">
        <div class="items">
          <div class="item" v-for="(item, index) in mvData" :key="index" @click="toMvDetail(item.id)">
            <div class="img-wrap">
              <img :src="item.imgurl" alt="" />
              <span class="iconfont icon-24gl-play"></span>
              <div class="num-wrap">
                <div class=" el-icon-video-play"></div>
                <div class="num">{{ item.playCount }}</div>
              </div>
            </div>
            <div class="info-wrap">
              <div class="name">{{ item.name }}</div>
            </div>
          </div>
        </div>
      </div>
      </el-tab-pane>
      <el-tab-pane label="歌手详情" name="detail">

        <span class="detail-title">个人简介</span>
        <p class="detail-words" v-for="(y,index3) in briefDescList" :key="index3">{{y}}</p>

        <div v-for="(item,index4) in introduction" :key="index4+999">
          <span class="detail-title">{{item.ti}}</span>
          <p class="detail-words" v-for="(x,i) in item.strList" :key="i">{{x}}</p>
        </div>

      </el-tab-pane>
      <el-tab-pane label="相似歌手" name="similar">
        <ul class="simi">
          <li class="simi-item" v-for="(item,index) in simi" :key="index" @click="toArtist(item.id)">
            <div class="simi-img-wrap">
              <img :src="item.picUrl" alt="">
            </div>
            <div class="simi-name">{{item.name}}</div>
          </li>
          <span v-if="simi.length==0">暂无相似歌手</span>
        </ul>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { artistsAPI } from '@/utils/api'

export default {
  /* eslint-disable */
  name: 'articleDetail',
  data() {
    return {
      artistId: '',
      activeName: 'album',
      topInfo: {},
      albumData: [],
      mvData: [],
      briefDescList: [],
      introduction: [],
      simi: []
    }
  },
  created() {
    this.artistId = this.$route.query.q
    this.getAlbumData()
    this.getMVData()
  },
  methods: {
    handleClick(tab) {
      if (tab.label == '相似歌手') this.getSimi()
      else if (tab.label == '歌手详情') this.getArtistInfo()
    },
    getAlbumData() {
      const params = {
        id: this.artistId,
        limit: 50,
        offset: 0
      }
      artistsAPI(params, 'album')
        .then(res => {
          console.log(res)
          this.topInfo = {
            albumSize: res.data.artist.albumSize,
            musicSize: res.data.artist.musicSize,
            name: res.data.artist.name,
            picUrl: res.data.artist.picUrl
          }
          this.albumData = res.data.hotAlbums
        })
    },
    getMVData() {
      const params = {
        id: this.artistId,
        limit: 50,
        offset: 0
      }
      artistsAPI(params, 'mv').then(res => {
        this.mvData = res.data.mvs
         for (let i = 0; i < this.mvData.length; i++) {
        if (this.mvData[i].playCount > 100000) {
          this.mvData[i].playCount = parseInt(this.mvData[i].playCount / 10000) + '万'
          }
         }
      })
    },
    getArtistInfo() {
      artistsAPI({ id: this.artistId }, 'desc').then(res => {
        const briefDesc = res.data.briefDesc.split(/[\n]/)
        this.briefDescList = briefDesc

        this.introduction = res.data.introduction
        let strList = []
        for (const item of this.introduction) {
          strList = item.txt.split(/[\n]/)
          item.strList = strList
        }
      })
    },
    getSimi() {
      artistsAPI({ id: this.artistId }, 'simi').then(res => {
        this.simi = res.data.artists
      })
    },
    toMvDetail(id) {
      this.$router.push(`/mv?p=${id}`)
    },
    toAlbum(id) {
      this.$router.push(`/album?id=${id}`)
    },
    toArtist(id){
      this.$router.push('/article?q=' + id)
    }
  },
  watch: {
    $route(newVal) {
      this.artistId = newVal.query.q
      this.getAlbumData()
      this.getMVData()
      this.activeName = 'album'

    }
  }
}
</script>

<style scoped>
.artist {
  margin: 0 auto;
  padding: 20px;
}

.artist .el-tabs__item {
  font-size: 14px;
}

.artist-info {
  display: flex;
  font-size: 14px;
  margin-bottom: 20px;
}

.artist-img-wrap {
  width: 200px;
  height: 200px;
  margin-right: 50px;
}

.artist-img-wrap img {
  width: 100%;
  height: 100%;
}

.artist-name {
  font-weight: bold;
  font-size: 22px;
}

.artsit-works {
  margin-top: 20px;
  display: flex;
}

.artist-works-count:nth-of-type(2) {
  margin: 0 20px;
}

/* tabs部分 */
/* 专辑 */
.albums {
   display: flex;
  flex-wrap: wrap;
  justify-content:space-between;
}

.al-item {
  font-size: 14px;
  width: 200px;
  margin: 15px 0;
}

.al-img-wrap {
  width: 100%;
  position: relative;
}

.al-img-wrap img {
  width: 100%;
  border-radius: 10px;
}

.al-img-wrap .iconfont::before {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50px;
  height: 50px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #2b87c0;
  font-size: 20px;
  cursor: pointer;
  opacity: 0;
  transition: 0.5s;
}

.al-img-wrap:hover .iconfont::before {
  opacity: 1;
}

.al-name {
  margin: 5px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.al-time {
  color: grey;
}

/* MV */
 .mvs .items {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}

 .mvs .items .item {
  width: 230px;
  cursor: pointer;
  margin-right: 25px;
  margin-bottom: 30px;
}

 .mvs .items .item .img-wrap {
  width: 100%;
  position: relative;
}

 .mvs .items .item .img-wrap img {
  width: 100%;
  height: 100%;
  border-radius: 5px;
}

 .mvs .items .item .img-wrap .num-wrap {
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

 .mvs .items .item .info-wrap .name {
  font-size: 15px;
}

 .mvs .items .item .info-wrap .singer {
  font-size: 14px;
  color: #c5c5c5;
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
/* 歌手详情 */
.detail-title {
  font-weight: bold;
  font-size: 20px;
  display: inline-block;
  margin: 10px 0;
}

.detail-words {
  line-height: 2.5rem;
  text-indent: 2rem;
  margin: 1rem 0;
  /* white-space: pre-line;  */
}

/* 相似歌手 */
.simi {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.simi-item {
  width: 80%;
}

.simi-img-wrap {
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  position: relative;
  cursor: pointer;
}

.simi-img-wrap img {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 10px;
}

.simi-name {
  font-size: 14px;
  color: grey;
  text-align: center;
  margin: 10px 0;
}
</style>
