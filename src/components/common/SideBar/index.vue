<template>
  <!--递归生成树-->
    <el-menu :default-openeds="['/lead1']" class="panel-center-left el-menu-vertical-demo collapse-transition" theme="dark" @open="handleOpen" @close="handleClose" unique-opened router>
      <template v-for="(item,index) in items" v-if="item.show">
        <el-menu-item v-if="!item.children || item.leaf" :index="item.children[0].path"><i :class="item.icon"></i>{{ item.children[0].name }}</el-menu-item>
        <el-submenu v-else="item.children.length > 0" :index="item.path">
          <template slot="title"><i :class="item.icon"></i>{{ item.name }}</template>
          <SideBarChild :items="item.children"></SideBarChild>
        </el-submenu>
      </template>
    </el-menu>
</template>

<script>
  import SideBarChild from './SideBarChild.vue'
  export default {
    name: 'SideBar',
    props: ['items'],
    components: {
      SideBarChild
    },
    methods: {
      handleOpen (key, keyPath) {
        console.log(key, keyPath)
      },
      handleClose (key, keyPath) {
      }
    }
  }
</script>

<style scoped>
  .fa {
    margin-right: 20px; 
  }
  .panel-center-left {
    border-radius: 0;
    width: 230px;
    height: 100%;
    overflow: auto;
  }

  ::-webkit-scrollbar{width: 0;}
</style>