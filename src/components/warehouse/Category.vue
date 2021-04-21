<template>
  <div>
    <!-- 面包屑管理区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>仓库管理</el-breadcrumb-item>
      <el-breadcrumb-item>类别管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getCategoryList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getCategoryList()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" @click="addDialogVisible = true"
            >新增类别</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="categoryList" border stripe>
        <el-table-column
          label="物品id"
          prop="item_id"
          sortable
        ></el-table-column>
        <el-table-column
          label="物品名称"
          prop="item_name"
          sortable
        ></el-table-column>
        <el-table-column label="单位" prop="unit" sortable></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.state"
              @change="categoryStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
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
    <!-- 修改类别的对话框 -->
    <el-dialog
      title="修改类别"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="物品id" prop="item_id" label-width="80px">
          <el-input v-model="editForm.item_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="物品名称" prop="item_name" label-width="80px">
          <el-input v-model="editForm.item_name"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unit" label-width="80px">
          <el-input v-model="editForm.unit"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editItemInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增类别的对话框 -->
    <el-dialog
      title="新增类别"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="物品id" prop="item_id" label-width="80px">
          <el-input v-model="addForm.item_id"></el-input>
        </el-form-item>
        <el-form-item label="物品名称" prop="item_name" label-width="80px">
          <el-input v-model="addForm.item_name"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unit" label-width="80px">
          <el-input v-model="addForm.unit"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state" label-width="80px">
          <el-switch v-model="addForm.state"></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addItemInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import CategoryList from '../../../data.json'

export default {
  data() {
    const isUnique = (rule, value, callback) => {
      let idList = []
      let cate = this.allCategoryList
      cate.forEach(item => {
        idList.push(item.item_id)
      })
      if (idList.indexOf(value) != -1) {
        callback(new Error('该id已存在！'))
      } else {
        callback()
      }
    }
    return {
      // 所有类别信息
      allCategoryList: [],
      // 总数
      total: 0,
      // 类别信息
      categoryList: [],
      // 查询与页面信息
      queryInfo: {
        query: '',
        pagesize: 5,
        pagenum: 1
      },
      // 编辑类别对话框
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        item_id: [
          { required: true, message: '请输入物品id', trigger: 'blur' },
          {
            min: 7,
            max: 7,
            message: '名称长度为7个字符',
            trigger: 'blur'
          }
        ],
        item_name: [
          { required: true, message: '请输入物品名称', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '名称长度在2～20个字符之间',
            trigger: 'blur'
          }
        ],
        unit: [
          { required: true, message: '请输入单位', trigger: 'blur' },
          {
            min: 1,
            max: 6,
            message: '名称长度在1～6个字符之间',
            trigger: 'blur'
          }
        ]
      },
      // 新增类别对话框
      addDialogVisible: false,
      // 新增类别表单
      addForm: {},
      // 新增类别表单规则
      addFormRules: {
        item_id: [
          { required: true, message: '请输入物品id', trigger: 'blur' },
          {
            min: 7,
            max: 7,
            message: '名称长度为7个字符',
            trigger: 'blur'
          },
          {
            validator: isUnique,
            trigger: 'blur'
          }
        ],
        item_name: [
          { required: true, message: '请输入物品名称', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '名称长度在2～20个字符之间',
            trigger: 'blur'
          }
        ],
        unit: [
          { required: true, message: '请输入单位', trigger: 'blur' },
          {
            min: 1,
            max: 6,
            message: '名称长度在1～6个字符之间',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getCategoryList()
  },
  methods: {
    // 生成uuid
    guid() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(
        c
      ) {
        var r = (Math.random() * 16) | 0,
          v = c == 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
      })
    },
    // 获取类别信息
    async getCategoryList() {
      // let categorylist = CategoryList.category.categoryList
      // this.allCategoryList = categorylist
      // let pagesize = this.queryInfo.pagesize
      // let pagenum = this.queryInfo.pagenum
      const {data:res} = await this.$http.get('category', {
        params: this.queryInfo
      })
      if(res.meta.status != 200) {
        return this.$message.error('获取物品信息列表失败！')
      }
      this.allCategoryList = res.all
      this.categoryList = res.data
      // let tempAddList = []
      this.total = this.allCategoryList.length
      // // 伪造数据逻辑
      // for (let i = 0; i < pagesize; i++) {
      //   let current = (pagenum - 1) * pagesize
      //   if (current + i >= categorylist.length) break
      //   tempAddList.push(categorylist[current + i])
      // }
      // this.categoryList = tempAddList
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getCategoryList()
    },
    // 监听 pagenum 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getCategoryList()
    },
    // 监听 switch 开关状态的变化
    async categoryStateChanged(cateinfo) {
      // console.log(userinfo);
      const { data: res } = await this.$http.put(
        `category/${cateinfo.id}/state/${cateinfo.state}`
      );
      // console.log(res);
      if (res.meta.status !== 200) {
        userinfo.state = !userinfo.state;
        return this.$message.error("更新类别状态失败！");
      }
      this.$message.success('更新类别状态成功！')
    },
    // 根据 Id 删除相应的类别信息
    async removeItemById(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该类别, 是否继续？',
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
      const { data: res } = await this.$http.delete("category/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除类别失败！");
      }
      // let index = this.categoryList.findIndex(x => {
      //   return x.id == id
      // })
      // this.categoryList.splice(index, 1)
      this.$message.success('删除类别成功！')
      this.getCategoryList();
    },
    // 展示编辑类别的对话框
    showEditDialog(id) {
      // const { data: res } = await this.$http.get("users/" + id);
      // if (res.meta.status !== 200) {
      //   return this.$message.error("查询用户数据失败！");
      // }
      // this.editForm = res.data;
      // console.log(id);
      let index = this.categoryList.findIndex(x => {
        return x.id == id
      })
      this.editForm = this.categoryList[index]
      this.editDialogVisible = true
    },
    // 监听修改类别对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改类别信息并提交
    async editItemInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        // 发起修改类别信息的数据请求
        const { data: res } = await this.$http.put(
          "category/" + this.editForm.id,
          {
            item_id: this.editForm.item_id,
            item_name: this.editForm.item_name,
            unit: this.editForm.unit
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("更新类别数据失败！");
        }
        // let index = this.categoryList.findIndex(x => {
        //   return x.id == this.editForm.id
        // })
        // this.categoryList[index].item_name = this.editForm.item_name
        // this.categoryList[index].unit = this.editForm.unit
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getCategoryList();
        // 提示修改成功
        this.$message.success('更新用户数据成功！')
      })
    },
    // 监听新增类别对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加类别
    async addItemInfo() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('category/add', {
          id: this.guid(),
          item_id: this.addForm.item_id,
          item_name: this.addForm.item_name,
          unit: this.addForm.unit,
          state: this.addForm.state
        })
        if (res.meta.status !== 201) {
          return this.$message.error('新增条目失败！')
        }
        // this.categoryList.push(this.addForm)
        // 关闭对话框
        this.addDialogVisible = false
        // 刷新数据列表
        this.getCategoryList();
        // 提示修改成功
        this.$message.success('新增条目成功！')
        // this.addForm = {}
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
