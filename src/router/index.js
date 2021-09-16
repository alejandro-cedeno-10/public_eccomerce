import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '../store'
import routes from './routes'
import axios from 'axios'

Vue.use(VueRouter)

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as they are and change in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  /**
   *
   * const guardMyroute = (to, from, next) => {
  var isAuthenticated = false
  if (localStorage.getItem('LoggedUser')) {
    isAuthenticated = true
  } else {
    isAuthenticated = false
  }
  if (isAuthenticated) {
    next()
  } else {
    next('/login')
  }
}
   */
  Router.beforeEach(async (to, from, next) => {
    // console.log(axios)
    // console.log(store)
    if (store.getters['auth/isLoggedIn']) {
      // console.log(store.getters['auth/getUsuario'])
      if (!store.getters['auth/getUsuario']) {
        await store._actions['auth/getUsuario'][0](axios)
      }
    }
    if (store.getters['auth/isLoggedIn']) {
      if (to.path === '/login' || to.path === '/registrar') {
        next('/index')
      } else if (to.matched.some(record => record.meta.requiresAuth)) {
        next()
      }
    } else {
      if (to.path === '/login' || to.path === '/registrar') {
        next()
      } else if (to.matched.some(record => record.meta.requiresAuth)) {
        next('/login')
      }
    }
  })

  return Router
}
