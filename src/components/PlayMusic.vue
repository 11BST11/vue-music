<template>
  <div class="playmusic">
    <aplayer ref="aplayer" :audio="audio" :lrcType="1" listFolded  mutex :volume=".5" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'PlayMusic',
  computed: {
    ...mapState(['musicData'])
  },
  data () {
    return {
      audio: [
        {
          id: 37860126, // 音频 id
          name: 'Lemon（翻自 米津玄師） ',
          artist: 'Lemon',
          theme: '#f1f324',
          url: require('../assets/mp3/Akie秋绘 - Lemon（翻自 米津玄師）.mp3'),
          cover: 'https://p1.music.126.net/EEKfs6vrZFaY_owE2fgRwA==/109951163175701373.jpg',
          lrc: `"[00:00.000] 作词 : 米津玄師
                 [00:01.000] 作曲 : 米津玄師
                 [00:02.53]夢ならばどれほどよかったでしょう
                 [00:08.67]未だにあなたのことを夢にみる
                 [00:14.96]忘れた物を取りに帰るように
                 [00:21.10]古びた思い出の埃を払う
                 [00:28.99]戻らない幸せがあることを
                 [00:34.97]最後にあなたが教えてくれた
                 [00:40.79]言えずに隠してた昏い過去も
                 [00:47.22]あなたがいなきゃ永遠に昏いまま
                 [00:55.52]きっともうこれ以上傷つくことなど
                 [01:01.48]ありはしないとわかっている
                 [01:06.82]あの日の悲しみさえ
                 [01:09.76]あの日の苦しみさえ
                 [01:12.93]そのすべてを愛してたあなたとともに
                 [01:19.20]胸に残り離れない
                 [01:22.46]苦いレモンの匂い
                 [01:25.76]雨が降り止むまでは帰れない
                 [01:31.75]今でもあなたはわたしの光
                 [02:02.19]あの日の悲しみさえ
                 [02:05.28]あの日の苦しみさえ
                 [02:08.28]そのすべてを愛してたあなたとともに
                 [02:14.58]胸に残り離れない
                 [02:17.94]苦いレモンの匂い
                 [02:21.50]雨が降り止むまでは帰れない
                 [02:27.23]切り分けた果実の片方の様に
                 [02:33.32]今でもあなたはわたしの光
                 "`
        }
      ]
    }
  },
  mounted () {
    this.initCreateElement()
  },
  methods: {
    getMusicValue (n) {
      const music = n
      // 过滤
      const obj = this.audio.find(item => item.id === music.id)
      if (obj) {
        return this.close(music.name)
      } else {
        this.audio.unshift(music)
        this.open(music.name)
        this.$refs.aplayer.switch(0)
        setTimeout(() => {
          this.$refs.aplayer.play()
        }, 300)
      }
    },
    initCreateElement () {
      const parent = document.querySelector('.aplayer-time')
      const clearSpan = document.createElement('i')
      const BackEL = document.createElement('i')
      const NextEL = document.createElement('i')
      const SongEL = document.createElement('i')
      // 创建清空列表按钮
      clearSpan.title = '清空播放列表'
      clearSpan.className = 'clearMusic  el-icon-delete'
      parent.appendChild(clearSpan)
      clearSpan.addEventListener('click', this.clearMusic)
      // 上一首
      BackEL.title = '播放上一首'
      BackEL.className = 'backMusic  el-icon-d-arrow-left'
      parent.appendChild(BackEL)
      BackEL.addEventListener('click', this.backMusic)
      // 播放下一首
      NextEL.title = '播放下一首'
      NextEL.className = 'nextMusic el-icon-d-arrow-right '
      parent.appendChild(NextEL)
      NextEL.addEventListener('click', this.NextMusic)
      // 显示/隐藏歌词
      SongEL.title = '显示/隐藏歌词'
      SongEL.className = 'songMusic el-icon-view '
      parent.appendChild(SongEL)
      SongEL.addEventListener('click', this.SongMusic)
      // 鼠标放置显示文字提示
      const volume = document.querySelector('.aplayer-volume-wrap')
      volume.title = '音乐播放音量'
      const order = document.querySelector('.aplayer-icon-order')
      order.title = '播放顺序：列表或随机'
      const loop = document.querySelector('.aplayer-icon-loop')
      loop.title = '循环设置：列表循环、单曲循环、禁止循环'
      const menu = document.querySelector('.aplayer-icon-menu')
      menu.title = '播放列表显示'
    },
    SongMusic () {
      console.log('显示/隐藏歌词')
      this.$refs.aplayer.toggleLrc()
    },
    // 播放下一首
    NextMusic () {
      console.log('播放下一首')
      this.$refs.aplayer.skipForward()
    },
    // 清空播放列表
    clearMusic () {
      console.log('清空播放列表')
      if (this.audio.length > 0) {
        this.audio = []
        this.$refs.aplayer.pause()
        return this.$message.success('列表清空成功!')
      } else {
        return this.$message.error('列表已经清空!')
      }
    },
    // 播放上一首
    backMusic () {
      console.log('播放上一首')
      this.$refs.aplayer.skipBack()
    },
    // 停止播放
    StopMusic () {
      console.log('播放/暂停音乐')
      this.$refs.aplayer.toggle()
    },
    open (name) {
      this.$notify({
        title: `歌曲: ${name}`,
        type: 'success',
        dangerouslyUseHTMLString: true,
        message: '<strong>已添加到播放列表且播放</strong>',
        offset: 100
      })
    },
    close (name) {
      this.$notify({
        title: `${name}`,
        type: 'error',
        dangerouslyUseHTMLString: true,
        message: '<strong>歌曲已在播放列表中</strong>',
        offset: 100
      })
    }
  },
  watch: {
    musicData: {
      handler (n) {
        this.getMusicValue(n)
      },
      deep: true
    }
  }
}
</script>

<style scoped lang="less">
.playmusic {
  position: fixed;
  width: 100%;
  bottom: -5px;
  z-index: 9;
  transition: all 0.3s;
  .aplayer {
    transition: all 0.3s;
    width: 100%;
    //z-index: 999999;
  }
}
</style>
