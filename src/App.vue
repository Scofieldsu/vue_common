<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  components: {
  }
}
</script>

<style>
  @import "../node_modules/font-awesome/css/font-awesome.min.css";

  body {
    margin: 0px;
    padding: 0px;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
  .el-submenu__title{
    height: 40px;
    line-height: 40px;
  }
  .el-button,.el-input__inner {
    border-radius: 0;
  }
</style>
