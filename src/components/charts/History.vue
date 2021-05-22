<template>
  <div>
    <!-- 面包屑管理区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>信息统计</el-breadcrumb-item>
      <el-breadcrumb-item>历史记录</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 表格区域 -->
      <el-table :data="historyList" border stripe :default-sort = "{prop: 'date', order: 'descending'}">
        <el-table-column
          label="类型"
          prop="type"
          sortable
        ></el-table-column>
        <el-table-column
          label="物品id"
          prop="item_id"
          sortable
        ></el-table-column>
        <el-table-column
          label="物品名称"
          prop="item_name"
          sortable
          width="160px"
        ></el-table-column>
        <el-table-column
          label="数量"
          prop="number"
          sortable
        ></el-table-column>
        <el-table-column
          label="单位"
          prop="unit"
          sortable
        ></el-table-column>
        <el-table-column
          label="调入仓库"
          prop="in_ware_id"
          sortable
        ></el-table-column>
        <el-table-column
          label="调出仓库"
          prop="out_ware_id"
          sortable
        ></el-table-column>
        <el-table-column
          label="操作时间"
          prop="date"
          width="180px"
          sortable
        ></el-table-column>
        <el-table-column label="操作" width="70px">
          <template slot-scope="scope">
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeItemById(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>

export default {
  data() {
    return {
      historyList: [],
      allHistoryList: [],
      total: 0,
      queryInfo: {
        pagesize: 10,
        pagenum: 1,
      }
    }
  },
  created() {
    this.getHistoryList()
  },
  methods: {
    // 获取类别信息
    async getHistoryList() {
      const {data:res} = await this.$http.get('history', {
        params: this.queryInfo
      })
      if(res.meta.status != 200) {
        return this.$message.error('获取历史记录列表失败！')
      }
      this.allHistoryList = res.all
      this.historyList = res.data
      // let tempAddList = []
      this.total = this.allHistoryList.length    
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getHistoryList()
    },
    // 监听 pagenum 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getHistoryList()
    },
    // 根据 Id 删除相应的类别信息
    async removeItemById(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该信息, 是否继续？',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      // 若确认删除 返回值为字符串confirm
      // 若删除取消 返回值为字符串cancel
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除！')
      }
      const { data: res } = await this.$http.delete("history/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除信息失败！");
      }
      // let index = this.categoryList.findIndex(x => {
      //   return x.id == id
      // })
      // this.categoryList.splice(index, 1)
      this.$message.success('删除信息成功！')
      this.getHistoryList();
    },
  }
}
</script>

<style lang="less" scoped></style>
