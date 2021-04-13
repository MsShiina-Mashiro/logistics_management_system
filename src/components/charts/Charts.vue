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
        <el-card header="库存信息">
          <div id="main" style="width: 500px; height: 400px;"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card header="订单评价信息">
          <div id="main" style="width: 500px; height: 400px;"></div>
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
            name: '访问来源',
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
            },
            data: [
              { value: 1048, name: '搜索引擎' },
              { value: 735, name: '直接访问' },
              { value: 580, name: '邮件营销' },
              { value: 484, name: '联盟广告' },
              { value: 300, name: '视频广告' }
            ]
          }
        ]
      }
    }
  },
  created() {},
  mounted() {
    var myChart = echarts.init(document.getElementById("main"));
    // 此处获取后端data后使用loadash的merge函数结合option
    /**
     * 待开发
     * 
     * 
     * 
     * 
     * 
     * 
     * 待开发
     */
    myChart.setOption(this.warehouseOption);
  },
  methods: {}
}
</script>

<style lang="less" scoped></style>
