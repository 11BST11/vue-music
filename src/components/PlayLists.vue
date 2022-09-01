<template>
  <div>
    <!-- 同步 -->
    <div class="top-card">
      <div class="icon-wrap">
        <!-- 封面 -->
        <img :src="topLists.coverImgUrl" alt="" />
      </div>
      <div class="content-wrap">
        <div class="tag">精品歌单</div>
        <!-- 标题 -->
        <div class="title">
          {{topLists.name}}
        </div>
        <!-- 介绍 -->
        <div class="info">
          {{topLists.description}}
        </div>
      </div>
      <!-- 背景 -->
      <img :src="topLists.coverImgUrl" alt="" class="bg" />
      <div class="bg-mask"></div>
    </div>
    <!-- tab栏 顶部 -->
    <div class="tab-container">
      <!-- tab栏 顶部 -->
      <div class="tab-bar">
        <span class="item" :class="{ active: tag == '全部' }" @click="tag = '全部'">全部</span>
        <span class="item" :class="{ active: tag == '欧美' }" @click="tag = '欧美'">欧美</span>
        <span class="item" :class="{ active: tag == '华语' }" @click="tag = '华语'">华语</span>
        <span class="item" :class="{ active: tag == '流行' }" @click="tag = '流行'">流行</span>
        <span class="item" :class="{ active: tag == '说唱' }" @click="tag = '说唱'">说唱</span>
        <span class="item" :class="{ active: tag == '摇滚' }" @click="tag = '摇滚'">摇滚</span>
        <span class="item" :class="{ active: tag == '民谣' }" @click="tag = '民谣'">民谣</span>
        <span class="item" :class="{ active: tag == '电子' }" @click="tag = '电子'">电子</span>
        <span class="item" :class="{ active: tag == '轻音乐' }" @click="tag = '轻音乐'">轻音乐</span>
        <span class="item" :class="{ active: tag == '影视原声' }" @click="tag = '影视原声'">影视原声</span>
        <span class="item" :class="{ active: tag == 'ACG' }" @click="tag = 'ACG'">ACG</span>
        <span class="item" :class="{ active: tag == '怀旧' }" @click="tag = '怀旧'">怀旧</span>
        <span class="item" :class="{ active: tag == '治愈' }" @click="tag = '治愈'">治愈</span>
        <span class="item" :class="{ active: tag == '旅行' }" @click="tag = '旅行'">旅行</span>
      </div>

      <!-- tab的内容区域 -->
      <div class="tab-content">
        <div class="items">
          <div class="item" v-for="(item,index) in lists" :key="index" @click="toPlayListDetail(item.id)">
            <div class="img-wrap">
              <div class="num-wrap">
                播放量:<span class="num">{{item.playCount}}</span>
              </div>
              <img :src="item.coverImgUrl" alt="" />
              <span class="iconfont  icon-xiayige-1"></span>
            </div>
            <p class="name">{{item.name}}</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 分页器
      total 总条数
      current-page 当前页
      page-size 每页多少条数据
      current-change 页码改变事件
     -->
   <!-- 分页器 -->
     <Pagination :total="total" :pageSize="pageSize" :nowPage="page" @changePage="handleCurrentChange"/>
    <div></div>
  </div>
</template>

<script>
import { highQualityAPI, songListAPI } from '@/utils/api'
import Pagination from '@/components/Pagination.vue'
export default {
  name: 'plagLists',
  data () {
    return {
      // 总条数
      total: 0,
      // 页码
      page: 1,
      pageSize: 10,
      // 顶部的精品歌单
      topLists: {},
      // 歌单列表
      lists: [],
      // 当前选择的数据
      tag: '全部'
    }
  },
  // 侦听器
  watch: {
    tag () {
      // 顶部的 精品歌单
      this.topData()
      // 歌单列表
      this.listData()
      // 修改页码为1
      this.page = 1
    }
  },
  components: {
    Pagination
  },
  created () {
    // 顶部的 精品歌单
    this.topData()
    // 歌单列表
    this.listData()
  },
  methods: {
    // 精品歌单
    async topData () {
      const params1 = {
        limit: 1,
        cat: this.tag
      }
      const { data: res } = await highQualityAPI(params1)
      this.topLists = res.playlists[0]
    },
    // 歌单列表
    async listData () {
      const params2 = {
        limit: 10,
        // 起始的值 （页码-1）*每页多少条数据
        offset: (this.page - 1) * 10,
        cat: this.tag
      }
      const { data: res } = await songListAPI(params2)
      // 保存总条数
      this.total = res.total
      this.lists = res.playlists
      for (let j = 0; j < this.lists.length; j++) {
        this.lists[j].playCount = this.handlePlayCount(this.lists[j].playCount)
      }
    },
    // 页码改变事件
    handleCurrentChange (val) {
      // 保存页码
      this.page = val
      // 重新获取数据
      this.listData()
    },
    // 去歌单详情页
    toPlayListDetail (id) {
      this.$router.push('/playListDetail?p=' + id)
    },
    // 处理播放次数
    handlePlayCount (playCount) {
      if (playCount > 100000) {
        return parseInt(playCount / 10000) + '万'
      }
      return playCount
    }
  }
}
</script>

<style lang="less" scoped>
.top-card {
  padding: 20px;
  height: 200px;
  display: flex;
  position: relative;
  overflow: hidden;
  border-radius: 5px;
  margin: 10px 0 20px 0;
}

.top-card .icon-wrap {
  margin-right: 20px;
  z-index: 1;
}

.top-card .icon-wrap img {
  width: 160px;
  height: 160px;
}

.top-card .content-wrap {
  z-index: 1;
}

.top-card .content-wrap .tag {
  color: #dfac67;
  border: 1px solid #dfac67;
  width: 100px;
  height: 30px;
  text-align: center;
  border-radius: 5px;
  font-size: 16px;
  line-height: 30px;
  cursor: pointer;
}

.top-card .content-wrap .title {
  color: white;
  padding-top: 10px;
}

.top-card .content-wrap .info {
  color: #888482;
  font-size: 14px;
  padding-top: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
}

.top-card .bg {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  // 修改所有图片的颜色为黑白 (x% 灰度)
  filter: blur(20px);
}

.top-card .bg-mask {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.tab-container .tab-bar {
  display: flex;
  justify-content: flex-end;
}

.tab-container .tab-bar .item {
  font-size: 15px;
  color: gray;
  margin-right: 20px;
  cursor: pointer;
}

.tab-container .tab-bar .item.active {
  color: #13d4ed;
}

.tab-container .tab-content {
  margin-top: 15px;
}

.tab-container .tab-content .items {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.tab-container .tab-content .items .item {
  width: 200px;
  margin: 10px 0;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.tab-container .tab-content .items .item img {
  width: 200px;
  height: 200px;
  border-radius: 5px;
}

.tab-container .tab-content .items .item .num-wrap {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 14px;
  color: white;
  line-height: 30px;
  background: rgba(0, 0, 0, 0.5);
  height: 30px;
  width: 100%;
  padding-left: 5px;
  top: -30px;
  overflow: hidden;
}

.tab-container .tab-content .items .item:hover .num-wrap {
  top: 0;
}

.tab-container .tab-content .items .item .img-wrap {
  position: relative;
}

.tab-container .tab-content .items .item .img-wrap .iconfont {
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

.tab-container .tab-content .items .item .img-wrap .iconfont::before {
  transform: translateX(3px);
}

.tab-container .tab-content .items .item .img-wrap:hover .iconfont {
  opacity: 1;
}

.tab-container .tab-content .items .item .name {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: 14px;
}

</style>
