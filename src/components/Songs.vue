<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="(item,index) in tabsName" :key="index" :label="item.label" :name="item.name">
        <el-table :data="tableData"   stripe>
          <el-table-column type="index" width="50" label="序号"></el-table-column>
           <el-table-column prop="" label="">
          <template slot-scope="scoped">
            <div class="img-wrap">
              <img :src="scoped.row.album.picUrl" alt="" />
              <!-- 播放按钮 -->
              <span @click="playMusic(scoped.row)" class="iconfont icon-24gl-play"></span>
            </div>
          </template>
        </el-table-column>
          <el-table-column prop="" label="音乐标题" >
               <template slot-scope="scoped">
               <div class="song-wrap">
                <span>{{ scoped.row.name }}</span>
                 <span  v-if="scoped.row.mvid !== 0" class="iconfont icon-MV" @click="toPlayMv(scoped.row.mvid)"></span>
              <!-- 二级标题 -->
              <p v-if="scoped.row.alias.length !== 0">{{scoped.row.alias[0]}}</p>
            </div>
          </template>
          </el-table-column>
          <el-table-column prop="" label="歌手">
            <template slot-scope="scoped">
              <span>{{scoped.row.album.artists['0'].name}}</span>
          </template>
          </el-table-column>
          <el-table-column prop="" label="专辑">
             <template slot-scope="scoped">
              <span>{{scoped.row.album.name}}</span>
          </template>
          </el-table-column>
          <el-table-column prop="" label="时长">
            <template slot-scope="scoped">
              <span>{{scoped.row.duration | dateFormatmini}}</span>
          </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
    <Pagination :total="total" :pageSize="pageSize" :nowPage="page" @changePage="handleCurrentChange"/>
  </div>
</template>

<script>
import { getNewSongsAPI, lyricAPI, playMusicAPI } from '@/utils/api'
import Pagination from '@/components/Pagination.vue'

export default {
  // eslint-disable-next-line
  name: 'songs',
  components: {
    Pagination
  },
  data () {
    return {
      activeName: '0',
      tag: '0',
      tabsName: [
        {
          label: '全部',
          name: '0'
        },
        {
          label: '华语',
          name: '7'
        },
        {
          label: '欧美',
          name: '96'
        },
        {
          label: '日本',
          name: '8'
        },
        {
          label: '韩国',
          name: '16'
        }
      ],
      tableData: [],
      tableDataTotal: [],
      // 评论总数
      total: 0,
      // 页码
      page: 1,
      pageSize: 10
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 获取列表数据
    async getList () {
      const params = {
        type: this.tag
      }
      const { data: res } = await getNewSongsAPI(params)
      this.tableDataTotal = res.data
      this.total = this.tableDataTotal.length
      this.tableData = this.tableDataTotal.slice(0, 10)
    },
    handleClick (tab) {
      this.tag = tab._props.name
      this.getList()
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
      result.artist = item.album.artists['0'].name || false
      // 封面
      result.cover = item.album.picUrl || false
      // 歌词
      result.lrc = res2.lrc ? res2.lrc.lyric : null
      // 主题
      result.theme = '#f56c6c'
      // 给父组件传递音乐
      this.$store.commit('updateData', result)
    },
    // 去Mv详情页
    toPlayMv (id) {
      this.$router.push(`/mv?p=${id}`)
    },
    handleCurrentChange (val) {
      this.page = val
      const offset = (this.page - 1) * 10
      this.tableData = this.tableDataTotal.slice(offset, offset + 10)
    }
  }
}
</script>

<style lang="less" scoped>
 .img-wrap {
  position: relative;
  width: 70px;
  height: 70px;
}

 .img-wrap img {
  width: 70px;
  height: 70px;
  border-radius: 5px;
}

 .img-wrap .iconfont {
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
 .img-wrap:hover .iconfont {
   opacity: 1;
 }
 .img-wrap .iconfont::before {
  transform: translateX(1px);
}
 .song-wrap > span {
   font-size: 16px;
}

.song-wrap p {
  color: #c5c5c5;
  font-size: 12px;
}

 .song-wrap .iconfont {
  padding-left: 5px;
  color: #dd6d60;
}
</style>
