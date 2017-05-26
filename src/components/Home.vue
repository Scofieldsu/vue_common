<template>
  <el-row class="panel">
    <HeaderBar :myMessage="myMessage"></HeaderBar>
    <el-col :span="24" class="panel-center">
      <SideBar :items='$router.options.routes'></SideBar>
      <section class="panel-center-right" :class="centerRightObject" :style="{left:getCenterRightWidth + 'px'}">
        <el-col :span="24" class="table-content">
          <transition name="fade" mode="out-in">
            <router-view></router-view>
          </transition>
        </el-col>
      </section>
    </el-col>
  </el-row>
</template>

<script>
import HeaderBar from './common/HeaderBar/index'
import SideBar from './common/SideBar/index'
import { mapGetters } from 'vuex'
export default {
  name: 'Home',
  components: {
    HeaderBar,
    SideBar
  },
  computed: {
    ...mapGetters([
      'getCenterRightWidth'
    ])
  },
  data () {
    return {
      myMessage: '欢迎Vue管理员',
      msg: 'Welcome to Your Vue.js App',
      currentPathName: '',
      currentPathNameParent: '',
      centerRightObject: {
        'center-right-larger': false,
        'center-right-small': true
      },
      getCenter: this.getCenterRightWidth
    }
  },
  methods: {
  },
  watch: {
    '$route' (to, from) {
      this.currentPathName = to.name
      this.currentPathNameParent = to.matched[0].name
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a {
  color: #42b983;
}

.el-menu {
  border-radius: 0;
}

.panel {
  position: absolute;
  top: 0px;
  bottom: 0px;
  width: 100%;
}

.panel-center {
  position: absolute;
  top: 50px;
  bottom: 0px;
  overflow: hidden;
}

.panel-center-right {
  background: #f1f2f7;
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  overflow-y:scroll;
  padding: 20px;
  transition: left .2s;
  -moz-transition: left .2s;	/* Firefox 4 */
  -webkit-transition: left .2s;	/* Safari 和 Chrome */
  -o-transition: left .2s;
}

.bread-crumb {
  margin-bottom: 15px; 
}
.fade-enter-active{
  transition: opacity .2s
}
.fade-leave-active {
  transition: opacity .2s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
