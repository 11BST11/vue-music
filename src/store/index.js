import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    musicData: {} // 播放音乐数据
  },
  mutations: {
    updateData (state, data) {
      state.musicData = data
    }
  }
})
