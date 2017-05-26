import VueRouter from 'vue-router'
import Vue from 'vue'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import commonJs from '../util/common'

import Home from '../components/Home'
import Node2 from '../components/nav/Node2'
import Node1 from '../components/nav/Node1'
import addForm from '../components/nav/addForm'
import homepage from '../components/nav/homepage'
import basechart from '../components/nav/BaseCharts'
import LogIn from '../components/common/LogInAndSignUp/LogIn'
import SignUp from '../components/common/LogInAndSignUp/SignUp'

Vue.use(VueRouter)
NProgress.configure({
  showSpinner: false
})

const routes = [
  { path: '/node',
    name: '导航',
    show: true,
    component: Home,
    icon: 'fa fa-navicon',
    children: [
      { path: '/node/page', name: '首页', icon: 'fa fa-server', component: homepage, show: true },
      { path: '/node/NodeManager', name: '子菜单1', icon: 'fa fa-server', component: Node1, show: true },
      { path: '/node/ServerManager', name: '子菜单2', icon: 'fa fa-server', component: Node2, show: true },
      { path: '/node/basechart', name: '图表', icon: 'fa fa-server', component: basechart, show: true },
      { path: '/node/addForm', name: 'addForm', component: addForm, show: false }
    ]
  },
  {
    path: '/LogIn',
    component: LogIn,
    name: 'LogIn'
  },
  {
    path: '/SignUp',
    component: SignUp,
    name: 'SignUp'
  },
  {
    path: '/',
    component: Home,
    name: '',
    children: [
      { path: '/', name: '', component: homepage }
    ]
  }

]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  NProgress.start()
  let cookieMaker = commonJs.cookieMaker
  if (!cookieMaker.get('name') && !cookieMaker.get('password')) {
    if (to.name === 'LogIn' || to.name === 'SignUp') {
      next()
    } else {
      next(false)
    }
  } else {
    next()
  }
  next()
})

router.afterEach(transition => {
  NProgress.done()
})

let cookieMaker = commonJs.cookieMaker
if (!cookieMaker.get('name') || !cookieMaker.get('password')) {
  router.push('/LogIn')
}

module.exports = router
