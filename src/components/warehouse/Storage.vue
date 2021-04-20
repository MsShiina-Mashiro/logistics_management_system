<template>
  <div>
    <!-- 面包屑管理区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>仓库管理</el-breadcrumb-item>
      <el-breadcrumb-item>库存管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getStorageList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getStorageList()"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="12">
          <el-button type="primary" @click="inDialogVisible = true"
            >入库</el-button
          >
          <el-button type="primary" @click="outDialogVisible = true"
            >出库</el-button
          >
          <el-button type="primary" @click="transDialogVisible = true"
            >越库</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <el-table :data="storageList" border stripe>
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
        <el-table-column label="数量" prop="number" sortable></el-table-column>
        <el-table-column label="单位" prop="unit" sortable></el-table-column>
        <el-table-column
          label="仓库号"
          prop="ware_id"
          sortable
        ></el-table-column>
        <el-table-column
          label="仓库名称"
          prop="ware_name"
          sortable
        ></el-table-column>
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
    <!-- 修改物品的对话框 -->
    <el-dialog
      title="修改物品"
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
          <el-input v-model="editForm.item_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="number" label-width="80px">
          <el-input v-model="editForm.number"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unit" label-width="80px">
          <el-input v-model="editForm.unit" disabled></el-input>
        </el-form-item>
        <el-form-item label="仓库号" prop="ware_id" label-width="80px">
          <el-input v-model="editForm.ware_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="仓库名称" prop="ware_name" label-width="80px">
          <el-input v-model="editForm.ware_name" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editItemInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 入库的对话框 -->
    <el-dialog
      title="入库"
      :visible.sync="inDialogVisible"
      width="50%"
      @close="inDialogClosed"
    >
      <el-tabs v-model="activeInTab" stretch>
        <el-tab-pane label="静态入库" name="staticIn">
          <el-form
            :model="staticInForm"
            :rules="staticInFormRules"
            ref="staticInFormRef"
            label-width="70px"
          >
            <el-form-item label="物品id" prop="item_id" label-width="80px">
              <!-- <el-input v-model="staticInForm.item_id"></el-input> -->
              <el-select
                v-model="staticInForm.item_id"
                placeholder="请选择"
                style="width:100%"
              >
                <el-option
                  v-for="item in allCateList"
                  :key="item.id"
                  :label="item.item_id"
                  :value="item.item_id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="物品名称" prop="item_name" label-width="80px">
              <el-input v-model="staticInForm.item_name" disabled></el-input>
            </el-form-item>
            <el-form-item label="数量" prop="number" label-width="80px">
              <el-input v-model="staticInForm.number"></el-input>
            </el-form-item>
            <el-form-item label="单位" prop="unit" label-width="80px">
              <el-input v-model="staticInForm.unit" disabled></el-input>
            </el-form-item>
            <el-form-item label="仓库号" prop="ware_id" label-width="80px">
              <el-select
                v-model="staticInForm.ware_id"
                placeholder="请选择"
                style="width:100%"
              >
                <el-option
                  v-for="item in allWareList"
                  :key="item.id"
                  :label="item.ware_id"
                  :value="item.ware_id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="仓库名称" prop="ware_name" label-width="80px">
              <el-input v-model="staticInForm.ware_name" disabled></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="动态入库" name="dynamicIn">
          <el-form
            :model="dynamicInForm"
            :rules="dynamicInFormRules"
            ref="dynamicInFormRef"
            label-width="70px"
          >
            <el-form-item label="自动入库时间" prop="dates" label-width="120px">
              <el-date-picker
                type="dates"
                v-model="dynamicInForm.dates"
                placeholder="选择一个或多个日期"
                style="width:100%"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="物品id" prop="item_id" label-width="80px">
              <el-select
                v-model="dynamicInForm.item_id"
                placeholder="请选择"
                style="width:100%"
              >
                <el-option
                  v-for="item in allCateList"
                  :key="item.id"
                  :label="item.item_id"
                  :value="item.item_id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="物品名称" prop="item_name" label-width="80px">
              <el-input v-model="dynamicInForm.item_name" disabled></el-input>
            </el-form-item>
            <el-form-item label="数量" prop="number" label-width="80px">
              <el-input v-model="dynamicInForm.number"></el-input>
            </el-form-item>
            <el-form-item label="单位" prop="unit" label-width="80px">
              <el-input v-model="dynamicInForm.unit" disabled></el-input>
            </el-form-item>
            <el-form-item label="仓库号" prop="ware_id" label-width="80px">
              <el-select
                v-model="dynamicInForm.ware_id"
                placeholder="请选择"
                style="width:100%"
              >
                <el-option
                  v-for="item in allWareList"
                  :key="item.id"
                  :label="item.ware_id"
                  :value="item.ware_id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="仓库名称" prop="ware_name" label-width="80px">
              <el-input v-model="dynamicInForm.ware_name" disabled></el-input>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
        <el-button @click="inDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="inItemInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 出库的对话框 -->
    <el-dialog
      title="出库"
      :visible.sync="outDialogVisible"
      width="50%"
      @close="outDialogClosed"
    >
      <el-form
        :model="outForm"
        :rules="outFormRules"
        ref="outFormRef"
        label-width="70px"
      >
        <el-form-item label="物品id" prop="item_id" label-width="80px">
          <!-- <el-input v-model="staticInForm.item_id"></el-input> -->
          <el-select
            v-model="outForm.item_id"
            placeholder="请选择"
            style="width:100%"
          >
            <el-option
              v-for="item in rmSomeStorageList"
              :key="item.id"
              :label="item.item_id"
              :value="item.item_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物品名称" prop="item_name" label-width="80px">
          <el-input v-model="outForm.item_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="number" label-width="80px">
          <el-input v-model="outForm.number"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unit" label-width="80px">
          <el-input v-model="outForm.unit" disabled></el-input>
        </el-form-item>
        <el-form-item label="仓库号" prop="ware_id" label-width="80px">
          <el-select
            v-model="outForm.ware_id"
            placeholder="请选择"
            style="width:100%"
            multiple
          >
            <el-option
              v-for="item in haveOutItemList"
              :key="item.id"
              :label="item.ware_id"
              :value="item.ware_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="仓库名称" prop="ware_name" label-width="80px">
          <el-input v-model="outForm.ware_name" disabled></el-input>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="outDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="outItemInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 越库的对话框 -->
    <el-dialog
      title="越库"
      :visible.sync="transDialogVisible"
      width="50%"
      @close="transDialogClosed"
    >
      <el-form
        :model="transForm"
        :rules="transFormRules"
        ref="transFormRef"
        label-width="70px"
      >
        <el-form-item label="物品id" prop="item_id" label-width="100px">
          <!-- <el-input v-model="staticInForm.item_id"></el-input> -->
          <el-select
            v-model="transForm.item_id"
            placeholder="请选择"
            style="width:100%"
          >
            <el-option
              v-for="item in rmSomeStorageList"
              :key="item.id"
              :label="item.item_id"
              :value="item.item_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物品名称" prop="item_name" label-width="100px">
          <el-input v-model="transForm.item_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="number" label-width="100px">
          <el-input v-model="transForm.number"></el-input>
        </el-form-item>
        <el-form-item label="单位" prop="unit" label-width="100px">
          <el-input v-model="transForm.unit" disabled></el-input>
        </el-form-item>
        <el-form-item
          label="调出仓库号"
          prop="from_ware_id"
          label-width="100px"
        >
          <el-select
            v-model="transForm.from_ware_id"
            placeholder="请选择"
            style="width:100%"
          >
            <el-option
              v-for="item in haveTransItemList"
              :key="item.id"
              :label="item.ware_id"
              :value="item.ware_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调入仓库号" prop="to_ware_id" label-width="100px">
          <el-select
            v-model="transForm.to_ware_id"
            placeholder="请选择"
            style="width:100%"
          >
            <el-option
              v-for="item in allWareList"
              :key="item.id"
              :label="item.ware_id"
              :value="item.ware_id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="仓库名称" prop="ware_name" label-width="80px">
          <el-input v-model="outForm.ware_name" disabled></el-input>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="transDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="transItemInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import StorageList from '../../../data.json'

export default {
  data() {
    // 是否是数字验证器
    const isNum = (rule, value, callback) => {
      const num = /^[0-9]*$/
      if (!num.test(value)) {
        callback(new Error('只能为数字'))
      } else {
        callback()
      }
    }
    return {
      // 所有仓库库存信息
      allStorageList: [],
      // 去重后仓库库存信息
      rmSomeStorageList: [],
      // 所有物品种类
      allCateList: [],
      // 所有仓库种类
      allWareList: [],
      // 仓库库存信息
      storageList: [],
      // 查询与表格信息
      queryInfo: {
        query: '',
        pagesize: 10,
        pagenum: 1
      },
      // 表格总共数据数量
      total: 0,
      // 编辑仓库物品对话框
      editDialogVisible: false,
      // 编辑仓库物品表单
      editForm: {},
      // 修改表单的验证规则对象
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
        number: [
          { required: true, message: '请输入数量', trigger: 'blur' },
          { validator: isNum, trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '请输入单位', trigger: 'blur' },
          {
            min: 1,
            max: 6,
            message: '名称长度在1～6个字符之间',
            trigger: 'blur'
          }
        ],
        ware_id: [
          { required: true, message: '请输入仓库id', trigger: 'blur' },
          {
            min: 5,
            max: 5,
            message: '名称长度为5个字符',
            trigger: 'blur'
          }
        ],
        ware_name: [
          { required: true, message: '请输入仓库名称', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '名称长度在2～20个字符之间',
            trigger: 'blur'
          }
        ]
      },
      // 入库对话框
      inDialogVisible: false,
      // 激活的入库tab名
      activeInTab: 'staticIn',
      // 静态入库表单
      staticInForm: {},
      // 静态入库验证规则
      staticInFormRules: {
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
        number: [
          { required: true, message: '请输入数量', trigger: 'blur' },
          { validator: isNum, trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '请输入单位', trigger: 'blur' },
          {
            min: 1,
            max: 6,
            message: '名称长度在1～6个字符之间',
            trigger: 'blur'
          }
        ],
        ware_id: [
          { required: true, message: '请输入仓库id', trigger: 'blur' },
          {
            min: 5,
            max: 5,
            message: '名称长度为5个字符',
            trigger: 'blur'
          }
        ],
        ware_name: [
          { required: true, message: '请输入仓库名称', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '名称长度在2～20个字符之间',
            trigger: 'blur'
          }
        ]
      },
      // 动态入库表单
      dynamicInForm: {},
      // 动态入库验证规则
      dynamicInFormRules: {
        dates: [
          { required: true, message: '请输入自动入库时间', trigger: 'blur' }
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
        number: [
          { required: true, message: '请输入数量', trigger: 'blur' },
          { validator: isNum, trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '请输入单位', trigger: 'blur' },
          {
            min: 1,
            max: 6,
            message: '名称长度在1～6个字符之间',
            trigger: 'blur'
          }
        ],
        ware_id: [
          { required: true, message: '请输入仓库id', trigger: 'blur' },
          {
            min: 5,
            max: 5,
            message: '名称长度为5个字符',
            trigger: 'blur'
          }
        ],
        ware_name: [
          { required: true, message: '请输入仓库名称', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '名称长度在2～20个字符之间',
            trigger: 'blur'
          }
        ]
      },
      // 出库对话框
      outDialogVisible: false,
      // 出库表单
      outForm: {},
      // 出库表单规则
      outFormRules: {
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
        number: [
          { required: true, message: '请输入数量', trigger: 'blur' },
          { validator: isNum, trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '请输入单位', trigger: 'blur' },
          {
            min: 1,
            max: 6,
            message: '名称长度在1～6个字符之间',
            trigger: 'blur'
          }
        ],
        ware_id: [{ required: true, message: '请输入仓库id', trigger: 'blur' }],
        ware_name: [
          { required: true, message: '请输入仓库名称', trigger: 'blur' },
          {
            min: 2,
            max: 20,
            message: '名称长度在2～20个字符之间',
            trigger: 'blur'
          }
        ]
      },
      // 拥有所选item的仓库列表
      haveOutItemList: [],
      // 越库对话框
      transDialogVisible: false,
      // 越库表单
      transForm: {},
      // 越库表单规则
      transFormRules: {
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
        number: [
          { required: true, message: '请输入数量', trigger: 'blur' },
          { validator: isNum, trigger: 'blur' }
        ],
        unit: [
          { required: true, message: '请输入单位', trigger: 'blur' },
          {
            min: 1,
            max: 6,
            message: '名称长度在1～6个字符之间',
            trigger: 'blur'
          }
        ],
        from_ware_id: [
          { required: true, message: '请输入调出仓库id', trigger: 'blur' }
        ],
        to_ware_id: [
          { required: true, message: '请输入调入仓库id', trigger: 'blur' }
        ]
      },
      // 拥有所选item的仓库列表
      haveTransItemList: []
    }
  },
  created() {
    this.getStorageList()
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
    // 去重功能函数
    rmSome(arr, key) {
      let tempObj = {}
      arr.forEach(item => {
        if (tempObj[item[key]]) {
          return
        } else {
          tempObj[item[key]] = item
        }
      })
      return Object.values(tempObj)
    },
    // // 获取仓库库存信息
    // getStorageList() {
    //   let storagelist = StorageList.storage.storageList
    //   this.allStorageList = storagelist
    //   this.rmSomeStorageList = this.rmSome(storagelist, 'item_id')
    //   this.rmSomeStorageList = this.rmSome(this.rmSomeStorageList, 'ware_id')
    //   let pagesize = this.queryInfo.pagesize
    //   let pagenum = this.queryInfo.pagenum
    //   let addList = []
    //   this.total = storagelist.length
    //   // 伪造数据逻辑
    //   for (let i = 0; i < pagesize; i++) {
    //     let current = (pagenum - 1) * pagesize
    //     if (current + i >= storagelist.length) break
    //     addList.push(storagelist[current + i])
    //   }
    //   this.storageList = addList
    // },
    // 获取仓库库存信息
    async getStorageList() {
      // let storagelist = StorageList.storage.storageList
      const { data: res } = await this.$http.get('storage', {
        params: this.queryInfo
      })
      const { data: res2 } = await this.$http.get('category/storage', {})
      const { data: res3 } = await this.$http.get('warehouse/storage', {})
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error('获取仓库信息列表失败！')
      if (res2.meta.status !== 200)
        return this.$message.error('获取类别信息列表失败！')
      // 所有在列表中的物品
      let allstoragelist = res.all
      this.allStorageList = allstoragelist
      // 所有物品种类
      let allcate = res2.data
      this.allCateList = allcate
      // 所有仓库列表
      let allware = res3.data
      this.allWareList = allware
      // console.log(allstoragelist);
      this.rmSomeStorageList = this.rmSome(allstoragelist, 'item_id')
      this.rmSomeStorageList = this.rmSome(this.rmSomeStorageList, 'ware_id')
      this.storageList = res.data
      this.total = allstoragelist.length
    },
    // 监听 pagesize 改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getStorageList()
    },
    // 监听 pagenum 改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getStorageList()
    },
    // 根据 Id 删除相应的物品信息
    async removeItemById(id) {
      // 弹框询问用户是否删除数据
      const confirmResult = await this.$confirm(
        '此操作将永久删除该物品, 是否继续？',
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
      const { data: res } = await this.$http.delete('storage/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除物品失败！')
      }
      // let index = this.storageList.findIndex(x => {
      //   return x.id == id
      // })
      // this.storageList.splice(index, 1)
      this.$message.success('删除物品成功！')
      this.getStorageList()
    },
    // 展示编辑物品的对话框
    async showEditDialog(id) {
      // const { data: res } = await this.$http.get("users/" + id);
      // if (res.meta.status !== 200) {
      //   return this.$message.error("查询用户数据失败！");
      // }
      // this.editForm = res.data;
      let index = this.storageList.findIndex(x => {
        return x.id == id
      })
      this.editForm = this.storageList[index]
      this.editDialogVisible = true
    },
    // 监听修改物品对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 修改物品信息并提交
    editItemInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        // 发起修改物品信息的数据请求
        const { data: res } = await this.$http.put(
          'storage/' + this.editForm.id,
          {
            number: this.editForm.number
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('更新物品数据失败！')
        }
        // let index = this.storageList.findIndex(x => {
        //   return x.id == this.editForm.id
        // })
        // this.storageList[index].item_name = this.editForm.item_name
        // this.storageList[index].number = this.editForm.number
        // this.storageList[index].unit = this.editForm.unit
        // 关闭对话框
        this.editDialogVisible = false
        // 刷新数据列表
        this.getStorageList()
        // 提示修改成功
        this.$message.success('更新物品数据成功！')
      })
    },
    // 入库对象框关闭
    inDialogClosed() {
      // if (this.activeInTab == 'staticIn') {
      //   this.$refs.staticInFormRef.resetFields()
      // } else {
      //   this.$refs.dynamicInFormRef.resetFields()
      // }
      this.$refs.staticInFormRef.resetFields()
      this.$refs.dynamicInFormRef.resetFields()
    },
    // 入库提交
    inItemInfo() {
      if (this.activeInTab == 'staticIn') {
        this.$refs.staticInFormRef.validate(async valid => {
          if (!valid) {
            return
          }
          // this.storageList.push(this.staticInForm)
          const { data: res } = await this.$http.post('storage/in', {
            id: this.guid(),
            item_id: this.staticInForm.item_id,
            item_name: this.staticInForm.item_name,
            number: this.staticInForm.number,
            unit: this.staticInForm.unit,
            ware_id: this.staticInForm.ware_id,
            ware_name: this.staticInForm.ware_name,
            dynamic: false
          })
          if (res.meta.status !== 201) {
            return this.$message.error('入库失败！')
          }
          // 关闭对话框
          this.inDialogVisible = false
          // 刷新数据列表
          this.getStorageList()
          // 提示修改成功
          this.$message.success('入库成功！')
          // this.staticInForm = {}
          // this.dynamicInForm = {}
        })
      } else {
        this.$refs.dynamicInFormRef.validate(async valid => {
          if (!valid) {
            return
          }
          const { data: res } = await this.$http.post('storage/in', {
            id: this.guid(),
            item_id: this.dynamicInForm.item_id,
            item_name: this.dynamicInForm.item_name,
            number: this.dynamicInForm.number,
            unit: this.dynamicInForm.unit,
            ware_id: this.dynamicInForm.ware_id,
            ware_name: this.dynamicInForm.ware_name,
            dynamic: this.dynamicInForm.dates
          })
          if (res.meta.status !== 201) {
            return this.$message.error('入库失败！')
          }
          // 关闭对话框
          this.inDialogVisible = false
          // 刷新数据列表
          this.getStorageList()
          // 提示修改成功
          this.$message.success('入库成功！')
          // this.staticInForm = {}
          // this.dynamicInForm = {}
        })
      }
    },
    // 监听出库对话框关闭
    outDialogClosed() {
      this.$refs.outFormRef.resetFields()
    },
    // 出库提交
    outItemInfo() {
      this.$refs.outFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('storage/out', {
          item_id: this.outForm.item_id,
          item_name: this.outForm.item_name,
          number: this.outForm.number,
          unit: this.outForm.unit,
          ware_id: this.outForm.ware_id
        })
        if (res.meta.status !== 200) {
          return this.$message.error('出库失败，请检查出库数量！')
        }
        // 关闭对话框
        this.outDialogVisible = false
        // 刷新数据列表
        this.getStorageList()
        // 提示修改成功
        this.$message.success('出库成功！')
        // this.outForm = {}
      })
    },
    // 越库对话框关闭
    transDialogClosed() {
      this.$refs.transFormRef.resetFields()
    },
    // 越库提交
    transItemInfo() {
      this.$refs.transFormRef.validate(async valid => {
        if (!valid) {
          return
        }
        const { data: res } = await this.$http.post('storage/trans', {
          id: this.guid(),
          item_id: this.transForm.item_id,
          item_name: this.transForm.item_name,
          number: this.transForm.number,
          unit: this.transForm.unit,
          from_ware_id: this.transForm.from_ware_id,
          to_ware_id: this.transForm.to_ware_id
        })
        if (res.meta.status !== 200) {
          return this.$message.error('越库失败，请检查越库数量！')
        }
        // 关闭对话框
        this.transDialogVisible = false
        // 刷新数据列表
        this.getStorageList()
        // 提示修改成功
        this.$message.success('越库成功！')
        // this.transForm = {}
      })
    }
  },
  computed: {},
  watch: {
    'staticInForm.item_id'(newVal, oldVal) {
      this.allCateList.forEach(item => {
        if (item.item_id == newVal) {
          this.staticInForm.item_name = item.item_name
          this.staticInForm.unit = item.unit
        }
      })
    },
    'staticInForm.ware_id'(newVal, oldVal) {
      this.allWareList.forEach(item => {
        if (item.ware_id == newVal) {
          this.staticInForm.ware_name = item.ware_name
        }
      })
    },
    'dynamicInForm.item_id'(newVal, oldVal) {
      this.allCateList.forEach(item => {
        if (item.item_id == newVal) {
          this.dynamicInForm.item_name = item.item_name
          this.dynamicInForm.unit = item.unit
        }
      })
    },
    'dynamicInForm.ware_id'(newVal, oldVal) {
      this.allWareList.forEach(item => {
        if (item.ware_id == newVal) {
          this.dynamicInForm.ware_name = item.ware_name
        }
      })
    },
    'outForm.item_id'(newVal, oldVal) {
      let tempArr = []
      this.allStorageList.forEach(item => {
        if (item.item_id == newVal) {
          this.outForm.item_name = item.item_name
          this.outForm.unit = item.unit
          tempArr.push(item)
        }
      })
      this.outForm.ware_id = ''
      this.haveOutItemList = tempArr
    },
    // 'outForm.ware_id'(newVal, oldVal) {
    //   this.allStorageList.forEach(item => {
    //     if (item.ware_id == newVal) {
    //       this.outForm.ware_name = item.ware_name
    //     }
    //   })
    // },
    'transForm.item_id'(newVal, oldVal) {
      let tempArr = []
      this.allStorageList.forEach(item => {
        if (item.item_id == newVal) {
          this.transForm.item_name = item.item_name
          this.transForm.unit = item.unit
          tempArr.push(item)
        }
      })
      this.haveTransItemList = tempArr
    },
    'transForm.to_ware_id'(newVal, oldVal) {
      this.allWareList.forEach(item => {
        if (item.ware_id == newVal) {
          this.transForm.to_ware_name = item.ware_name
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
