import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () =>
  import(/* webpackChunkName: "login_home_welcome" */ '../components/Login.vue')
const Home = () =>
  import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
const Welcome = () =>
  import(
    /* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue'
  )
const Storage = () =>
  import(
    /* webpackChunkName: "warehouse_management" */ '../components/warehouse/Storage.vue'
  )
const Category = () =>
  import(
    /* webpackChunkName: "warehouse_management" */ '../components/warehouse/Category.vue'
  )
const Waybill = () =>
  import(
    /* webpackChunkName: "logistics_management" */ '../components/logistics/Waybill.vue'
  )
const Transportation = () =>
  import(
    /* webpackChunkName: "logistics_management" */ '../components/logistics/Transportation.vue'
)
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', name: 'Welcome', component: Welcome },
      { path: '/storage', name: 'Storage', component: Storage },
      { path: '/category', name: 'Category', component: Category },
      { path: '/waybill', name: 'Waybill', component: Waybill },
      { path: '/transportation', name: 'Transportation', component: Transportation }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
