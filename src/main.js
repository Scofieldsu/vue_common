// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import router from './router/router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import store from './vuex/store'
import App from './App'
// import './util/mock.js'

Vue.use(Vuex)
Vue.use(ElementUI)
let vjax = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 5000
  // headers: {'post': {'Content-Type': 'application/x-www-form-urlencoded'}}
})
Vue.use(VueAxios, vjax)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  router,
  store,
  components: { App }
}).$mount('#app')

