<template>
  <div>
    <!-- 面包屑管理区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>信息统计</el-breadcrumb-item>
      <el-breadcrumb-item>信息报表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-row :gutter="12">
      <el-col :span="12">
        <el-card header="库存空间">
          <div id="storageInfo" style="width: 500px; height: 400px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="订单评价信息">
          <div id="score" style="width: 500px; height: 400px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="年内趋势">
          <div id="year" style="width: 500px; height: 400px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="开销概况">
          <div id="cost" style="width: 500px; height: 400px;"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import _ from 'lodash'

export default {
  data() {
    return {
      // 仓库空间图表
      warehouseOption: {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          left: 'center'
        },
        series: [
          {
            name: '库存空间',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            }
          }
        ]
      },
      // 订单评价
      scoreOption: {
        series: [
          {
            type: 'gauge',
            startAngle: 180,
            endAngle: 0,
            min: 0,
            max: 1,
            splitNumber: 8,
            axisLine: {
              lineStyle: {
                width: 6,
                color: [
                  [0.25, '#FF6E76'],
                  [0.5, '#FDDD60'],
                  [0.75, '#58D9F9'],
                  [1, '#7CFFB2']
                ]
              }
            },
            pointer: {
              icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
              length: '12%',
              width: 20,
              offsetCenter: [0, '-60%'],
              itemStyle: {
                color: 'auto'
              }
            },
            axisTick: {
              length: 12,
              lineStyle: {
                color: 'auto',
                width: 2
              }
            },
            splitLine: {
              length: 20,
              lineStyle: {
                color: 'auto',
                width: 5
              }
            },
            axisLabel: {
              color: '#464646',
              fontSize: 20,
              distance: -60,
              formatter: function(value) {
                if (value === 0.875) {
                  return '优'
                } else if (value === 0.625) {
                  return '中'
                } else if (value === 0.375) {
                  return '良'
                } else if (value === 0.125) {
                  return '差'
                }
              }
            },
            title: {
              offsetCenter: [0, '-20%'],
              fontSize: 20
            },
            detail: {
              fontSize: 30,
              offsetCenter: [0, '0%'],
              valueAnimation: true,
              formatter: function(value) {
                return Math.round(value * 100) + '分'
              },
              color: 'auto'
            },
            data: [
              {
                value: 0.74,
                name: '订单评价'
              }
            ]
          }
        ]
      },
      // 订单量趋势
      yearOption: {
        title: {
          text: '年内利润'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['b2b利润', 'b2c利润', '其他利润']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: [
            '2020-5',
            '2020-6',
            '2020-7',
            '2020-8',
            '2020-9',
            '2020-10',
            '2020-11',
            '2020-12',
            '2021-1',
            '2021-2',
            '2021-3',
            '2021-4',
            '2021-5'
          ]
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'b2b利润',
            type: 'line',
            stack: '总量',
            data: [
              220,
              182,
              191,
              234,
              290,
              330,
              310,
              330,
              320,
              290,
              280,
              310,
              330,
              340
            ]
          },
          {
            name: 'b2c利润',
            type: 'line',
            stack: '总量',
            data: [
              150,
              232,
              201,
              154,
              190,
              330,
              410,
              420,
              420,
              423,
              429,
              433,
              435
            ]
          },
          {
            name: '其他利润',
            type: 'line',
            stack: '总量',
            data: [
              120,
              132,
              101,
              134,
              90,
              230,
              210,
              220,
              190,
              212,
              220,
              230,
              250
            ]
          }
        ]
      },
      costOption: {
        title: {
          text: '开销雷达图'
        },
        legend: {
          data: ['预算分配', '实际开销']
        },
        radar: {
          // shape: 'circle',
          indicator: [
            { name: '仓储', max: 65000 },
            { name: '管理', max: 16000 },
            { name: '信息技术', max: 30000 },
            { name: '运输', max: 58000 },
            { name: '研发', max: 12000 },
            { name: '人事', max: 50000 }
          ]
        },
        series: [
          {
            name: '预算 vs 开销',
            type: 'radar',
            data: [
              {
                value: [60000, 13000, 20000, 55000, 12000, 48000],
                name: '预算分配'
              },
              {
                value: [50000, 14000, 28000, 46000, 12000, 50000],
                name: '实际开销'
              }
            ]
          }
        ]
      }
    }
  },
  created() {},
  async mounted() {
    // 仓库空间图表
    var wareHouseChart = echarts.init(document.getElementById('storageInfo'))
    const { data: res } = await this.$http.get('charts/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('获取库存空间图表数据失败！')
    }
    // console.log(res.data)
    this.warehouseOption.series[0].data = res.data
    wareHouseChart.setOption(this.warehouseOption)
    // 订单评价
    var scoreChart = echarts.init(document.getElementById('score'))
    // const { data: res } = await this.$http.get('charts/type/1')
    // if (res.meta.status !== 200) {
    //   return this.$message.error('获取库存空间图表数据失败！')
    // }
    // console.log(res.data)
    // this.warehouseOption.series[0].data = res.data
    scoreChart.setOption(this.scoreOption)
    // 趋势图
    var yearChart = echarts.init(document.getElementById('year'))
    // const { data: res } = await this.$http.get('charts/type/1')
    // if (res.meta.status !== 200) {
    //   return this.$message.error('获取库存空间图表数据失败！')
    // }
    // console.log(res.data)
    // this.warehouseOption.series[0].data = res.data
    yearChart.setOption(this.yearOption)
    // 开销概况
    var costChart = echarts.init(document.getElementById('cost'))
    costChart.setOption(this.costOption)
  },
  methods: {}
}
</script>

<style lang="less" scoped>
.el-card {
  margin-bottom: 13px;
}
</style>
