<template>
  <div>
    <!-- 面包屑管理区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>物流管理</el-breadcrumb-item>
      <el-breadcrumb-item>运单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getWaybillList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getWaybillList()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加订单</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="waybillList" border stripe>
        <el-table-column
          label="运单号"
          prop="bill_id"
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
        ></el-table-column>
        <el-table-column label="起点" prop="from" sortable></el-table-column>
        <el-table-column label="终点" prop="to" sortable></el-table-column>
        <el-table-column label="配送员id" prop="delivery_id"></el-table-column>
        <el-table-column label="配送员" prop="delivery"></el-table-column>
        <el-table-column label="联系电话" prop="phone"></el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 查看按钮 -->
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="showSearchDialog(scope.row.id)"
            ></el-button>
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
    <!-- 新增订单的对话框 -->
    <el-dialog
      title="新增订单"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="订单id" prop="bill_id" label-width="100px">
          <el-input v-model="addForm.bill_id"></el-input>
        </el-form-item>
        <el-form-item label="物品id" prop="item_id" label-width="100px">
          <!-- <el-input v-model="staticInForm.item_id"></el-input> -->
          <el-select
            v-model="addForm.item_id"
            placeholder="请选择"
            style="width:100%"
          >
            <el-option
              v-for="item in allCategoryList"
              :key="item.id"
              :label="item.item_id"
              :value="item.item_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物品名称" prop="item_name" label-width="100px">
          <el-input v-model="addForm.item_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="起点" prop="from" label-width="100px">
          <el-input v-model="addForm.from"></el-input>
        </el-form-item>
        <el-form-item label="终点" prop="to" label-width="100px">
          <el-input v-model="addForm.to"></el-input>
        </el-form-item>
        <el-form-item label="配送员id" prop="delivery_id" label-width="100px">
          <!-- <el-input v-model="addForm.delivery_id"></el-input> -->
          <el-select
            v-model="addForm.delivery_id"
            placeholder="请选择"
            style="width:100%"
          >
            <el-option
              v-for="item in allDeliveryList"
              :key="item.id"
              :label="item.delivery_id"
              :value="item.delivery_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配送员" prop="delivery" label-width="100px">
          <el-input v-model="addForm.delivery" disabled></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone" label-width="100px">
          <el-input v-model="addForm.phone" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addItemInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改类别的对话框 -->
    <el-dialog
      title="修改运单"
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
        <el-form-item label="订单id" prop="bill_id" label-width="100px">
          <el-input v-model="editForm.bill_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="物品id" prop="item_id" label-width="100px">
          <!-- <el-input v-model="staticInForm.item_id"></el-input> -->
          <el-select
            v-model="editForm.item_id"
            placeholder="请选择"
            style="width:100%"
          >
            <el-option
              v-for="item in allCategoryList"
              :key="item.id"
              :label="item.item_id"
              :value="item.item_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物品名称" prop="item_name" label-width="100px">
          <el-input v-model="editForm.item_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="起点" prop="from" label-width="100px">
          <el-input v-model="editForm.from"></el-input>
        </el-form-item>
        <el-form-item label="终点" prop="to" label-width="100px">
          <el-input v-model="editForm.to"></el-input>
        </el-form-item>
        <el-form-item label="配送员id" prop="delivery_id" label-width="100px">
          <!-- <el-input v-model="addForm.delivery_id"></el-input> -->
          <el-select
            v-model="editForm.delivery_id"
            placeholder="请选择"
            style="width:100%"
          >
            <el-option
              v-for="item in allDeliveryList"
              :key="item.id"
              :label="item.delivery_id"
              :value="item.delivery_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="配送员" prop="delivery" label-width="100px">
          <el-input v-model="editForm.delivery" disabled></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone" label-width="100px">
          <el-input v-model="editForm.phone" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editItemInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看信息的对话框 -->
    <el-dialog
      title="运单信息"
      :visible.sync="searchDialogVisible"
      width="60%"
      @close="searchDialogClosed"
    >
      <div style="height: 300px;">
        <el-steps direction="vertical" :active="searchForm.active_step">
          <el-step
            :title="item.title"
            :description="item.description"
            :status="item.status"
            :icon="item.icon"
            v-for="item in searchForm.steps"
            :key="item.id"
          ></el-step>
        </el-steps>
        <el-rate show-text v-if="searchForm.active_step == 4" v-model="searchForm.rate"></el-rate>
      </div>
      <!-- 内嵌物流地图对话框 -->
      <el-dialog
        width="50%"
        title="物流地图"
        :visible.sync="innerVisible"
        append-to-body
      >
        <div class="map-container" style="width: 100%; height: 400px;">
          <amap :zoom="6" :center="[117, 36]">
            <amap-marker :position="[117, 36]" />
            <amap-polyline
              :path="[[117, 36],[120,40]]"/>
            <amap-marker :position="[120, 40]" />
          </amap>
        </div>
        <!-- <div id='container'></div> -->
      </el-dialog>
      <span slot="footer" class="dialog-footer">
        <el-button @click="searchDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="innerVisible = true"
          >查看地图</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import WaybillData from '../../../data.json'
// import AMap from AMap

export default {
  data() {
    const isUnique = (rule, value, callback) => {
      let idList = []
      let waybill = this.allwaybillList
      waybill.forEach(item => {
        idList.push(item.bill_id)
      })
      if (idList.indexOf(value) != -1) {
        callback(new Error('该id已存在！'))
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
      // 查询与表格信息
      queryInfo: {
        query: '',
        pagesize: 5,
        pagenum: 1
      },
      // 表格总共数据数量
      total: 0,
      // 运单数据
      waybillList: [],
      // 全部运单数据
      allwaybillList: [],
      // 全部类别数据
      allCategoryList: [],
      // 全部配送员数据
      allDeliveryList: [],
      // 添加订单对话框
      addDialogVisible: false,
      addForm: {},
      addFormRules: {
        bill_id: [
          { required: true, message: '请输入运单id', trigger: 'blur' },
          {
            min: 6,
            max: 6,
            message: '名称长度为6个字符',
            trigger: 'blur'
          },
          {
            validator: isUnique,
            trigger: 'blur'
          }
        ],
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
        from: [{ required: true, message: '请输入起点', trigger: 'blur' }],
        to: [{ required: true, message: '请输入终点', trigger: 'blur' }],
        delivery_id: [
          { required: true, message: '请输入配送员id', trigger: 'blur' }
        ],
        delivery: [
          { required: true, message: '请输入配送员姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入配送员联系方式', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 编辑运单对话框
      editDialogVisible: false,
      editForm: {},
      editFormRules: {
        bill_id: [
          { required: true, message: '请输入运单id', trigger: 'blur' },
          {
            min: 6,
            max: 6,
            message: '名称长度为6个字符',
            trigger: 'blur'
          }
        ],
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
        from: [{ required: true, message: '请输入起点', trigger: 'blur' }],
        to: [{ required: true, message: '请输入终点', trigger: 'blur' }],
        delivery_id: [
          { required: true, message: '请输入配送员id', trigger: 'blur' }
        ],
        delivery: [
          { required: true, message: '请输入配送员姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '请输入配送员联系方式', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 查看运单对话框
      searchDialogVisible: false,
      // 运单对话框内嵌查看地图
      innerVisible: false,
      searchForm: {}
    }
  },
  mounted() {
    // this.initMap()
  },
  created() {
    this.getWaybillList()
  },
  methods: {
    // initMap() {
    //   this.map = new AMap.Map('container', {
    //   content: [117,36], //中心点
    //   zooms: [6] // 地图缩放级别(做了限制),若不做限制则是 zoom: num
    //   })
    //   AMap.plugin('AMap.Driving', function() {
    //   var driving = new AMap.Driving({
    //     // 驾车路线规划策略，AMap.DrivingPolicy.LEAST_TIME是最快捷模式
    //     policy: AMap.DrivingPolicy.LEAST_TIME
    //   })
      
    //   var startLngLat = [116.379028, 39.865042]
    //   var endLngLat = [116.427281, 39.903719]
      
    //   driving.search(startLngLat, endLngLat, function (status, result) {
    //     // 未出错时，result即是对应的路线规划方案
    //   })
    // })
    // },
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
    // 获取订单信息
    async getWaybillList() {
      // let waybilllist = WaybillData.waybill.waybillList
      // let categorylist = WaybillData.category.categoryList
      // let deliverylist = WaybillData.transportation.delivery
      // this.allCategoryList = categorylist
      // this.allwaybillList = waybilllist
      // this.allDeliveryList = deliverylist
      // let pagesize = this.queryInfo.pagesize
      // let pagenum = this.queryInfo.pagenum
      // let addList = []
      // this.total = waybilllist.length
      // 伪造数据逻辑
      // for (let i = 0; i < pagesize; i++) {
      //   let current = (pagenum - 1) * pagesize
      //   if (current + i >= waybilllist.length) break
      //   addList.push(waybilllist[current + i])
      // }
      // this.waybillList = addList
      const { data: res } = await this.$http.get('waybill', {
        params: this.queryInfo
      })
      const { data: res2 } = await this.$http.get('category/waybill', {})
      const { data: res3 } = await this.$http.get('transportation/waybill', {})
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error('获取运单信息列表失败！')
      if (res2.meta.status !== 200)
        return this.$message.error('获取类别信息列表失败！')
      if (res3.meta.status !== 200)
        return this.$message.error('获取运送信息列表失败！')
      this.waybillList = res.data
      this.allwaybillList = res.all
      this.allCategoryList = res2.data
      this.allDeliveryList = res3.data
      this.total = this.allwaybillList.length
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getWaybillList()
    },
    // 监听 pagenum 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getWaybillList()
    },
    // 监听新增订单对话框关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加订单
    async addItemInfo() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('waybill/add', {
          id: this.guid(),
          bill_id: this.addForm.bill_id,
          item_id: this.addForm.item_id,
          item_name: this.addForm.item_name,
          from: this.addForm.from,
          to: this.addForm.to,
          delivery_id: this.addForm.delivery_id,
          delivery: this.addForm.delivery,
          phone: this.addForm.phone
        })
        if (res.meta.status !== 201) {
          return this.$message.error('添加失败！')
        }
        // this.waybillList.push(this.addForm)
        // 关闭对话框
        this.addDialogVisible = false
        // 刷新数据列表
        this.getWaybillList();
        // 提示修改成功
        this.$message.success('添加成功！')
        // this.addForm = {}
      })
    },
    // 根据 Id 删除相应的运单信息
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
      const { data: res } = await this.$http.delete("waybill/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("删除用户失败！");
      }
      // let index = this.waybillList.findIndex(x => {
      //   return x.id == id
      // })
      // this.waybillList.splice(index, 1)
      this.$message.success('删除运单成功！')
      this.getWaybillList();
    },
    // 展示编辑运单的对话框
    async showEditDialog(id) {
      // const { data: res } = await this.$http.get("users/" + id);
      // if (res.meta.status !== 200) {
      //   return this.$message.error("查询用户数据失败！");
      // }
      // this.editForm = res.data;
      // console.log(id);
      let index = this.waybillList.findIndex(x => {
        return x.id == id
      })
      this.editForm = this.waybillList[index]
      this.editDialogVisible = true
    },
    // 监听修改运单对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改运单信息
    async editItemInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        // 发起修改用户信息的数据请求
        const { data: res } = await this.$http.put(
          "waybill/" + this.editForm.id,
          {
            bill_id: this.editForm.bill_id,
            item_id: this.editForm.item_id,
            item_name: this.editForm.item_name,
            from: this.editForm.from,
            to: this.editForm.to,
            delivery_id: this.editForm.delivery_id,
            delivery: this.editForm.delivery,
            phone: this.editForm.phone
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("更新用户数据失败！");
        }
        // let index = this.waybillList.findIndex(x => {
        //   return x.id == this.editForm.id
        // })
        // this.waybillList[index].item_id = this.editForm.item_id
        // this.waybillList[index].item_name = this.editForm.item_name
        // this.waybillList[index].from = this.editForm.from
        // this.waybillList[index].to = this.editForm.to
        // this.waybillList[index].delivery_id = this.editForm.delivery_id
        // this.waybillList[index].delivery = this.editForm.delivery
        // this.waybillList[index].phone = this.editForm.phone
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getWaybillList();
        // 提示修改成功
        this.$message.success('更新用户数据成功！')
      })
    },
    // 显示查看详细信息对话框
    async showSearchDialog(id) {
      // const { data: res } = await this.$http.get("users/" + id);
      // if (res.meta.status !== 200) {
      //   return this.$message.error("查询用户数据失败！");
      // }
      // this.editForm = res.data;
      // console.log(id);
      let index = this.waybillList.findIndex(x => {
        return x.id == id
      })
      this.searchForm = this.waybillList[index]
      this.searchDialogVisible = true
    },
    // 监听查看运单对话框的关闭事件
    searchDialogClosed() {
      // this.$refs.editFormRef.resetFields();
    }
  },
  watch: {
    'addForm.item_id'(newVal, oldVal) {
      this.allCategoryList.forEach(item => {
        if (item.item_id == newVal) {
          this.addForm.item_name = item.item_name
        }
      })
    },
    'addForm.delivery_id'(newVal, oldVal) {
      this.allDeliveryList.forEach(item => {
        if (item.delivery_id == newVal) {
          this.addForm.delivery = item.delivery
          this.addForm.phone = item.phone
        }
      })
    },
    'editForm.item_id'(newVal, oldVal) {
      this.allCategoryList.forEach(item => {
        if (item.item_id == newVal) {
          this.editForm.item_name = item.item_name
        }
      })
    },
    'editForm.delivery_id'(newVal, oldVal) {
      this.allDeliveryList.forEach(item => {
        if (item.delivery_id == newVal) {
          this.editForm.delivery = item.delivery
          this.editForm.phone = item.phone
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
//  #container {
//    width:100%; 
//    height:400px;
//  }
</style>
