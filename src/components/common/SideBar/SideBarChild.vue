<!--递归生成树-->
<template>
  <div>
    <template class="collapse-transition" v-for="(item,index) in items" v-if="item.show">
      <el-menu-item v-if="!item.children" :index="item.path"><i :class="item.icon"></i>{{ item.name }}</el-menu-item>
      <el-submenu v-else="item.children.length > 0" :index="index+''">
        <template slot="title"><i :class="item.icon"></i>{{ item.name }}</template>
        <SideBarChild :items="item.children"></SideBarChild>
      </el-submenu>
    </template>
  </div>
</template>

<script>
  export default {
    name: 'SideBarChild',
    props: ['items']
  }
</script>

<style scoped>
  .fa {
    margin-right: 20px;
  }
  .el-icon-message {
    margin-right: 20px;
  }
  .panel-center-left {
    width: 230px;
    height: 100%;
    overflow: auto;
  }
  .el-menu-item {
    height: 40px;
    line-height: 40px;
  }
  ::-webkit-scrollbar{width: 0;}
</style>