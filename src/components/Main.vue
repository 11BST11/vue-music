<template>
  <div class="index">
    <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" router>
      <div class="title">
        <img src="../assets/logo.png" alt="" width="50px">
        <span>音乐盒</span>
      </div>
      <el-menu-item index="/discovery">发现音乐</el-menu-item>
      <el-menu-item index="/playLists">推荐歌单</el-menu-item>
      <el-menu-item index="/Songs">最新音乐</el-menu-item>
      <el-menu-item index="/mvs">最新MV</el-menu-item>
      <div class="search-hot" v-show="showHot" ref="hot" @mousedown.stop="prevent(event)">
        <el-scrollbar style="height:100%">
          <div class="history" v-if="history.length">
            <span class="hot-title" style="display: inline-block;margin-right: 5px;">搜索历史</span>
            <span class="iconfont " style="cursor:pointer;font-size: 18px;" title="清空搜索历史" @mousedown="deleteHistory(0,true)"><i class="el-icon-delete"></i></span>
            <div class="history-wrap">
              <div class="history-item" v-for="(item,index) in history" :key="index" @mousedown="toHot(item)">
                {{item}}
                <span class="delete-btn" title="删除" @mousedown.stop="deleteHistory(index,false)">×</span>
              </div>
            </div>
          </div>

          <div class="hot-title">热搜榜</div>
          <ul>
            <li class="hot-item" v-for="(item,index) in hotData" :key="index" @mousedown.prevent="toHot(item.searchWord)">
              <div class="hot-index">{{index+1}}</div>
              <div class="hot-info">
                <div class="hot-top">
                  <div class="hot-name">{{item.searchWord}}</div>
                  <div class="hot-score">{{item.score}}</div>
                  <img class="hot-icon" v-show="item.iconUrl && item.iconType!=5" :src="item.iconUrl" />
                </div>
                <div class="hot-content">{{item.content}}</div>
              </div>
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </el-menu>
     <div class="input-box">
       <el-input placeholder="搜索" v-model="searchValue" prefix-icon="el-icon-edit"
        clearable @keyup.enter.native="search" @focus="getSearchHot" @blur="showHot = false">
        </el-input>
      </div>
    <div class="main">
      <router-view></router-view>
    </div>
    <div class="box">
      <PlayMusic></PlayMusic>
    </div>
  </div>
</template>

<script>
import { hotSearchAPI } from '@/utils/api'
import PlayMusic from '@/components/PlayMusic.vue'
export default {
  /* eslint-disable */
  name: 'home',

  data() {
    return {
      input:'',
      musicUrl: '',
      activeIndex: '/discovery',
      searchValue: '',
      showHot: false,
      hotData: [],
      history: []
    }
  },
    components: {
    PlayMusic
  },
  mounted() {
    // 解决elementUI中导航菜单（el-menu）页面刷新后的菜单选中问题
    this.activeIndex = this.$route.path
  },
  methods: {
    search() {
      if (this.isNull(this.searchValue)) this.showError()
      else {
        this.$router.push('/result?q=' + this.searchValue)
        if (!this.history.includes(this.searchValue)) this.history.push(this.searchValue)
      }
    },
    showError() {
      this.$message({
        showClose: true,
        message: '请输入内容',
        type: 'error'
      })
    },
    isNull(str) {
      if (str == '') return true
      var regu = '^[ ]+$'
      var re = new RegExp(regu)
      return re.test(str)
    },
    getSearchHot() {
      this.showHot = true
      if (this.hotData.length == 0) {
        hotSearchAPI().then(res => {
          this.hotData = res.data.data
        })
      }
    },
    toHot(value) {
      this.searchValue = value
      this.search()
    },
    deleteHistory(index, all) {
      if (all) this.history = []
      else
        for (let i = 0; i < this.history.length; i++) {
          if (i == index) this.history.splice(i, 1)
        }
    },
    prevent(event) {
      event.preventDefault()
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  position: absolute;
  left: 100px;
  display: flex;
  font-size: 30px;
  font-weight: bold;
  align-items: center;
  letter-spacing: 5px;
}
.el-menu {
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-menu-item {
  margin: 0 10px !important;
}

.main {
  margin: 0 100px;
}
.player {
  opacity: 0.4;
  background: #f1f3f4;
  height: 60px;
  // position: fixed;
  // bottom: 0;
  // left: 0;
  width: 100%;
}

audio {
  width: 100%;
  border-radius: none;
  outline: none;
}
.music_hide {
  transform: rotateX(90deg);
  width: 0px !important;
}
.player {
  position: fixed;
  transition: all 0.3s;
  z-index: 999;
  bottom: 30px;
  width: 100%;
}
.box {
  height: 90px;
  width: 100%;
}

.input-box  {
  position: absolute;
  top:10px;
  right: 20px;
  border-radius: 20px;
  border: none;
  outline: none;
  font-size: 12px;
  color: #fff;
  position: absolute;
  right: 80px;
  .el-input {
    width: 260px;
  }
}

.search-hot {
  width: 400px;
  height: 300px;
  /* border: 1px solid #333; */
  box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  background-color: #fff;
  position: absolute;
  top: 55px;
  right: 30px;
  z-index: 999;
  padding: 10px 10px;
  box-sizing: border-box;
}

.hot-title {
  margin: 10px 0;
  font-weight: bold;
  font-size: 20px;
}

.hot-item {
  display: flex;
  align-items: center;
  padding: 5px;
  cursor: default;
}

.hot-item:hover {
  background-color: rgb(163, 231, 248);
}

.hot-index {
  font-size: 18px;
  color: rgb(236, 65, 65);
  margin-right: 15px;
}

.hot-info {
  flex: 1;
  font-size: 12px;
  color: slategray;
}

.hot-top {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.hot-name {
  font-size: 16px;
  margin-right: 15px;
  color: #000;
}

.hot-icon {
  width: 30px;
  /* height: 15px; */
  margin-left: 5px;
}
.hot-score {
  line-height:100% ;
  font-size: 14px;
}

.history-wrap {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.history-item {
  border: 1px solid #ddd;
  padding: 5px 10px;
  border-radius: 10px;
  font-size: 13px;
  display: inline-block;
  cursor: pointer;
  margin: 5px;
}

.history-item:hover {
  background-color: #f5f7fa;
}

.history-item:hover .delete-btn {
  opacity: 1;
}

.delete-btn {
  cursor: pointer;
  opacity: 0;
}
</style>