<template>
  <el-carousel :interval="4000" type="card" height="320px">
    <el-carousel-item v-for="item in 3" :key="item">
      <h3>{{ item }}</h3>
    </el-carousel-item>
  </el-carousel>
</template>

<script>
    export default {
      data: function () {
        return {}
      }
    }
</script>

<style scoped>
    .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 200px;
    margin: 0;
  }

  .el-carousel__item:nth-child(3n) {
    background-image: url(../bg_img/bg1.jpg);
    background-size:100% 100%;
  }

  .el-carousel__item:nth-child(3n+1) {
    background-image: url(../bg_img/bg2.jpg);
    background-size:100% 100%;
  }

  .el-carousel__item:nth-child(3n+2) {
    background-image: url(../bg_img/bg3.jpg);
    background-size:100% 100%;
  }


</style>
