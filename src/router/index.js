import Vue from 'vue'
import VueRouter from 'vue-router'
import Main from '@/components/Main.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'main',
    component: Main,
    redirect: '/discovery',
    children: [
      {
        path: '/discovery',
        name: 'discovery',
        component: () => import(/* webpackChunkName: "discovery" */ '@/components/Discovery.vue')
      },
      {
        path: '/playLists',
        name: 'playLists',
        component: () => import(/* webpackChunkName: "playLists" */ '@/components/PlayLists.vue')
      },
      {
        path: '/songs',
        name: 'songs',
        component: () => import(/* webpackChunkName: "songs" */ '@/components/Songs.vue')
      },
      {
        path: '/mvs',
        name: 'mvs',
        component: () => import(/* webpackChunkName: "mvs" */ '@/components/Mvs.vue')
      },
      {
        path: '/result',
        name: 'result',
        component: () => import(/* webpackChunkName: "result" */ '@/components/Result.vue')
      },
      {
        path: '/article',
        name: 'article',
        component: () => import(/* webpackChunkName: "article" */ '@/components/Article.vue')
      },
      {
        path: '/album',
        name: 'album',
        component: () => import(/* webpackChunkName: "album" */ '@/components/Album.vue')
      },
      {
        path: '/playListDetail',
        name: 'playListDetail',
        component: () => import(/* webpackChunkName: "playListDetail" */ '@/components/PlayListDetail.vue')
      },
      {
        path: '/mv',
        name: 'mv',
        component: () => import(/* webpackChunkName: "mv" */ '@/components/Mv.vue')
      }
    ]
  }

]

const router = new VueRouter({
  routes
})

export default router
