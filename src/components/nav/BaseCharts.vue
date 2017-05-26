<template>
    <div>
        <div class='crumbs'>
            <el-breadcrumb separator='/'>
                <el-breadcrumb-item><i class='el-icon-date'></i> 图表</el-breadcrumb-item>
                <el-breadcrumb-item>基础图表</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class='content-title'>基础图表</div>
        <div class='echarts'>
            <IEcharts :option='line' ></IEcharts>
        </div>
        <div class='echarts'>
            <IEcharts :option='bar' ></IEcharts>
        </div>
        <div class='echarts'>
            <IEcharts :option='pie' ></IEcharts>
        </div>
        <div class='echarts'>
            <IEcharts :option='pie_radius' ></IEcharts>
        </div>
        <div class='content-title'>混合图表</div>
        <div class='mix-echarts'>
            <IEcharts :option='mix' ></IEcharts>
        </div>
    </div>
</template>

<script>
    // import IEcharts from 'vue-echarts-v3';
    import IEcharts from 'vue-echarts-v3/src/lite.vue'
    import 'echarts/lib/chart/bar'
    import 'echarts/lib/chart/line'
    import 'echarts/lib/chart/pie'
    import 'echarts/lib/component/legend'
    import 'echarts/lib/component/tooltip'
    import 'echarts/lib/component/title'
    export default {
      components: {
        IEcharts
      },
      data: () => ({
        line: {
          color: ['#20a0ff', '#13CE66', '#F7BA2A', '#FF4949'],
          title: {
            text: '曲线图'
          },
          xAxis: {
            data: ['类别1', '类别2', '类别3', '类别4', '类别5', '类别6']
          },
          yAxis: {},
          series: [
            {
              name: '数量',
              type: 'line',
              data: [5, 20, 36, 10, 10, 20]
            }
          ]
        },
        bar: {
          color: ['#20a0ff', '#13CE66', '#F7BA2A', '#FF4949'],
          title: {
            text: '柱状图'
          },
          xAxis: {
            data: ['类别1', '类别2', '类别3', '类别4', '类别5', '类别6']
          },
          yAxis: {},
          series: [
            {
              name: '数量',
              type: 'bar',
              data: [5, 20, 36, 10, 10, 20]
            }
          ]
        },
        pie: {
          color: ['#20a0ff', '#13CE66', '#F7BA2A', '#FF4949', '#61a0a8'],
          title: {
            text: '饼状图',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['类别1', '类别2', '类别3', '类别4', '类别5']
          },
          series: [
            {
              name: '数量',
              type: 'pie',
              radius: '55%',
              center: ['50%', '50%'],
              data: [
                {value: 335, name: '类别1'},
                {value: 310, name: '类别2'},
                {value: 234, name: '类别3'},
                {value: 135, name: '类别4'},
                {value: 548, name: '类别5'}
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        },
        pie_radius: {
          color: ['#20a0ff', '#13CE66', '#F7BA2A', '#FF4949', '#61a0a8'],
          title: {
            text: '环形图',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: ['类别1', '类别2', '类别3', '类别4', '类别5']
          },
          series: [
            {
              name: '数量',
              type: 'pie',
              radius: ['40%', '60%'],
              data: [
                {value: 335, name: '类别1'},
                {value: 310, name: '类别2'},
                {value: 234, name: '类别3'},
                {value: 135, name: '类别4'},
                {value: 548, name: '类别5'}
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        },
        mix: {
          color: ['#20a0ff', '#13CE66', '#F7BA2A', '#FF4949', '#61a0a8'],
          legend: {
            data: ['品1', '品2', '品3']
          },
          xAxis: {
            data: ['周一', '周二', '周三', '周四', '周五', '周末']
          },
          yAxis: {},
          series: [
            {
              name: '品1',
              type: 'line',
              data: [15, 20, 26, 30, 40, 27]
            },
            {
              name: '品2',
              type: 'bar',
              data: [5, 30, 36, 10, 34, 20]
            },
            {
              name: '品3',
              type: 'bar',
              data: [35, 40, 30, 50, 60, 40]
            }
          ]
        }
      })
}
</script>

<style scoped>
    .echarts {
        float: left;
        width: 500px;
        height: 400px;
    }
    .content-title{
        clear: both;
        font-weight: 400;
        line-height: 50px;
        margin: 10px 0;
        font-size: 22px;
        color: #1f2f3d;
    }
    .mix-echarts{
        width:900px;
        height:600px;
    }
</style>
