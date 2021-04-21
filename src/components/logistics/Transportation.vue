<template>
  <div>
    <!-- 面包屑管理区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>物流管理</el-breadcrumb-item>
      <el-breadcrumb-item>配送管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getDeliveryList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getDeliveryList()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" @click="addDialogVisible = true"
            >新增配送员</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="deliveryList" border stripe>
        <el-table-column
          label="配送员id"
          prop="delivery_id"
          sortable
        ></el-table-column>
        <el-table-column
          label="配送员姓名"
          prop="delivery"
          sortable
        ></el-table-column>
        <el-table-column label="联系电话" prop="phone"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.state"
              @change="deliveryStateChanged(scope.row)"
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
    <!-- 修改配送员的对话框 -->
    <el-dialog
      title="修改信息"
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
        <el-form-item label="配送员id" prop="delivery_id" label-width="80px">
          <el-input v-model="editForm.delivery_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="配送员姓名" prop="delivery" label-width="80px">
          <el-input v-model="editForm.delivery"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone" label-width="80px">
          <el-input v-model="editForm.phone"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editItemInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增配送员的对话框 -->
    <el-dialog
      title="新增配送员"
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
        <el-form-item label="配送员id" prop="delivery_id" label-width="80px">
          <el-input v-model="addForm.delivery_id"></el-input>
        </el-form-item>
        <el-form-item label="配送员姓名" prop="delivery" label-width="80px">
          <el-input v-model="addForm.delivery"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone" label-width="80px">
          <el-input v-model="addForm.phone"></el-input>
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
import DeliveryList from '../../../data.json'

export default {
  data() {
    const idIsUnique = (rule, value, callback) => {
      let idList = []
      let delivery = this.allDeliveryList
      delivery.forEach(item => {
        idList.push(item.delivery_id)
      })
      if (idList.indexOf(value) != -1) {
        callback(new Error('该id已存在！'))
      } else {
        callback()
      }
    }
    const phoneIsUnique = (rule, value, callback) => {
      let idList = []
      let delivery = this.allDeliveryList
      delivery.forEach(item => {
        idList.push(item.phone)
      })
      if (idList.indexOf(value) != -1) {
        callback(new Error('该手机号已存在！'))
      } else {
        callback()
      }
    }
    // 验证手机号的校验规则
    const checkMobile = (rule, value, cb) => {
      // 验证手机号的正则表达式
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[3678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return cb()
      }

      cb(new Error('请输入合法的手机号'))
    }
    return {
      // 所有配送员信息
      allDeliveryList: [],
      // 信息总数
      total: 0,
      // 配送员信息
      deliveryList: [],
      // 查询与表格表单
      queryInfo: {
        query: '',
        pagesize: 5,
        pagenum: 1
      },
      // 修改配送员对话框
      editDialogVisible: false,
      // 修改表单
      editForm: {},
      // 修改表单规则
      editFormRules: {
        delivery_id: [
          { required: true, message: '请输入配送员id', trigger: 'blur' },
          {
            min: 3,
            max: 3,
            message: '名称长度为3个字符',
            trigger: 'blur'
          }
        ],
        delivery: [
          { required: true, message: '请输入配送员姓名', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '姓名长度在2～20个字符之间',
            trigger: 'blur'
          }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      // 新增配送员对话框
      addDialogVisible: false,
      addForm:{},
      addFormRules:{
        delivery_id: [
          { required: true, message: '请输入配送员id', trigger: 'blur' },
          {
            min: 3,
            max: 3,
            message: '名称长度为3个字符',
            trigger: 'blur'
          },
          {
            validator: idIsUnique,
            trigger: 'blur'
          }
        ],
        delivery: [
          { required: true, message: '请输入配送员姓名', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '姓名长度在2～20个字符之间',
            trigger: 'blur'
          }
        ],
        phone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getDeliveryList()
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
    // 获取配送员信息
    async getDeliveryList() {
      // let deliverylist = DeliveryList.transportation.delivery
      // this.allDeliveryList = deliverylist
      // let pagesize = this.queryInfo.pagesize
      // let pagenum = this.queryInfo.pagenum
      // let tempAddList = []
      // this.total = deliverylist.length
      // 伪造数据逻辑
      // for (let i = 0; i < pagesize; i++) {
      //   let current = (pagenum - 1) * pagesize
      //   if (current + i >= deliverylist.length) break
      //   tempAddList.push(deliverylist[current + i])
      // }
      // this.deliveryList = tempAddList
      const {data:res} = await this.$http.get('transportation', {
        params: this.queryInfo
      })
      if(res.meta.status != 200) {
        return this.$message.error('获取配送员信息列表失败！')
      }
      this.allDeliveryList = res.all
      this.deliveryList = res.data
      this.total = this.allDeliveryList.length
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getDeliveryList()
    },
    // 监听 pagenum 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getDeliveryList()
    },
    // 监听 switch 开关状态的变化
    async deliveryStateChanged(transinfo) {
      const { data: res } = await this.$http.put(
        `transportation/${transinfo.id}/state/${transinfo.state}`
      );
      // console.log(res);
      if (res.meta.status !== 200) {
        transinfo.state = !transinfo.state;
        return this.$message.error("更新配送员状态失败！");
      }
      this.$message.success('更新配送员状态成功！')
    },
    // 根据 Id 删除相应的配送员信息
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
      const { data: res } = await this.$http.delete("transportation/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除配送员信息失败！");
      }
      // let index = this.deliveryList.findIndex(x => {
      //   return x.id == id
      // })
      // this.deliveryList.splice(index, 1)
      this.$message.success('删除配送员信息成功！')
      this.getDeliveryList();
    },
    // 展示编辑配送员的对话框
    showEditDialog(id) {
      // const { data: res } = await this.$http.get("users/" + id);
      // if (res.meta.status !== 200) {
      //   return this.$message.error("查询用户数据失败！");
      // }
      // this.editForm = res.data;
      // console.log(id);
      let index = this.deliveryList.findIndex(x => {
        return x.id == id
      })
      this.editForm = this.deliveryList[index]
      this.editDialogVisible = true
    },
    // 监听修改配送员对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改配送员信息并提交
    editItemInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        // 发起修改配送员信息的数据请求
        const { data: res } = await this.$http.put(
          "transportation/" + this.editForm.id,
          {
            delivery_id: this.editForm.delivery_id,
            delivery: this.editForm.delivery,
            phone: this.editForm.phone
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("更新配送员数据失败！");
        }
        // let index = this.deliveryList.findIndex(x => {
        //   return x.id == this.editForm.id
        // })
        // this.deliveryList[index].delivery = this.editForm.delivery
        // this.deliveryList[index].phone = this.editForm.phone
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getDeliveryList();
        // 提示修改成功
        this.$message.success('更新配送员数据成功！')
      })
    },
    // 监听新增配送员对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加配送员
    addItemInfo() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('transportation/add', {
          id: this.guid(),
          delivery_id: this.addForm.delivery_id,
          delivery: this.addForm.delivery,
          phone: this.addForm.phone,
          state: this.addForm.state
        })
        if (res.meta.status !== 201) {
          return this.$message.error('新增条目失败！')
        }
        // this.deliveryList.push(this.addForm)
        // 关闭对话框
        this.addDialogVisible = false
        // 刷新数据列表
        this.getDeliveryList();
        // 提示修改成功
        this.$message.success('添加成功！')
        // this.addForm = {}
      })
    }
  }
}
</script>

<style lang="less" scoped>

</style>
