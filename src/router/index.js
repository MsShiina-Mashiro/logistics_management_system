import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../components/Login.vue')
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import(/* webpackChunkName: "home" */ '../components/Home.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
