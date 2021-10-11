<template>
  <!-- 场务端 ———— 机构收件人管理 -->
  <div class="contact_management">
    <el-card class="top_card">
      <el-form ref="form" :model="form" label-width="110px">
        <el-row>
          <el-col :span="8">
            <el-form-item
              v-if="userinfo.userInnerType.code !== '00'"
              label="机构名称"
            >
              <el-select
                v-model="form.instCnFullNm"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in instCnList"
                  :key="item.id"
                  :label="item.instnCnFullNm"
                  :value="item.instnCnFullNm"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="邮箱">
              <el-input v-model="form.email" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="姓名">
              <el-input v-model="form.userName" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="联系人类型">
              <el-select
                v-model="form.contactType"
                clearable
                placeholder="--请选择--"
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.label"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接口产品">
              <el-input v-model="form.interfaceName" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-button
              size="mini"
              type="primary"
              style="margin-left: 70px"
              @click="handleFilter()"
            >查询</el-button>
            <el-button size="mini" @click="onReset()">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card style="margin: 15px 0px">
      <div>
        <el-button size="mini" type="primary" @click="increaseClick()">
          <img
            src="~@/assets/style/plus_icon.svg"
            style="width: 16px; height: 16px; vertical-align: middle"
            alt=""
          >
          添加
        </el-button>
        <el-button size="mini" type="primary" @click="deleteClick()">
          <img
            src="~@/assets/style/delete_icon.svg"
            style="width: 16px; height: 16px; vertical-align: middle"
            alt=""
          >
          删除
        </el-button>

        <el-button
          size="mini"
          type="primary"
          :disabled="selectList.length !== 1"
          @click="editClick()"
        >
          <el-tooltip
            class="item"
            effect="dark"
            content="仅支持单条编辑"
            placement="right-end"
          >
            <div>
              <img
                src="~@/assets/style/edit_icon (2).svg"
                style="width: 16px; height: 16px; vertical-align: middle"
                alt=""
              >
              编辑
            </div>
          </el-tooltip>
        </el-button>
      </div>

      <el-table
        ref="multipleTable"
        v-loading="loading"
        element-loading-text="拼命加载中"
        :header-cell-style="{ background: '#F6F7FB', color: '#606266' }"
        :data="contactManageData"
        tooltip-effect="dark"
        style="width: 100%; margin-top: 15px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" />

        <el-table-column label="邮箱" prop="email" fixed width="300" />

        <el-table-column prop="phoneNo" label="手机" width="132" />

        <el-table-column prop="userName" label="姓名" width="132" />

        <el-table-column
          v-if="userinfo.userInnerType.code !== '00'"
          prop="instCnFullNm"
          label="机构名称"
          width="280"
        />

        <el-table-column prop="interfaceName" label="接口产品" width="182">
          <template slot-scope="scope">
            <el-popover placement="top-start" width="200" trigger="hover">
              <div
                v-for="(item, index) in scope.row.interfaceNameList"
                :key="index"
              >
                {{ item }}
              </div>
              <el-button slot="reference" type="text">{{
                scope.row.interfaceNameList &&
                  scope.row.interfaceNameList.length > 1
                  ? scope.row.interfaceNameList[0] + '...'
                  : scope.row.interfaceNameList[0]
              }}</el-button>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="contactType" label="联系人类型" width="112">
          <template slot-scope="scope">
            <span v-if="scope.row.contactType === '00'">服务开通</span>
            <span v-if="scope.row.contactType === '10'">验收测试</span>
            <span v-if="scope.row.contactType === '20'">接口上线</span>
            <span v-if="scope.row.contactType === '40'">权限变更</span>
            <span v-if="scope.row.contactType === '50'">补充用户</span>
            <span v-if="scope.row.contactType === '80'">注册用户</span>
          </template>
        </el-table-column>

        <el-table-column prop="upDateTime" label="更新时间" width="200" />

        <el-table-column prop="upName" label="更新人" width="120" />

        <el-table-column prop="upType" label="更新人类型" width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.upType === '00'">机构用户</span>
            <span v-if="scope.row.upType === '05'">场务用户</span>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        style="display: flex; justify-content: flex-end; margin-top: 17px"
        :current-page="pageQuery.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>

    <!-- 添加联系人 —— 编辑后弹出的对话框 -->
    <el-dialog
      v-if="dialogFormVisible"
      :title="title"
      :visible.sync="dialogFormVisible"
      :modal="true"
      append-to-body
      width="34%"
      class="add-dialog"
      @close="closeDialog()"
    >
      <el-form ref="formDialog" :model="formDialog" :rules="rules">
        <el-form-item
          v-if="userinfo.userInnerType.code !== '00'"
          label="机构名称"
          :label-width="formLabelWidth"
          prop="instCnFullNm"
        >
          <el-select
            v-model="formDialog.instCnFullNm"
            :disabled="isDisabled && title !== '添加联系人'"
            filterable
            placeholder="请选择机构名称"
            @change="changeOption()"
          >
            <el-option
              v-for="item in instCnList"
              :key="item.id"
              :label="item.instnCnFullNm"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="联系人姓名"
          :label-width="formLabelWidth"
          prop="userName"
        >
          <el-input
            v-model="formDialog.userName"
            clearable
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="联系人邮箱"
          :label-width="formLabelWidth"
          prop="email"
        >
          <el-input v-model="formDialog.email" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item label="验证码" :label-width="formLabelWidth" prop="code">
          <template slot="label"><span>验证码</span></template>
          <!-- <div style="display:flex"> -->
          <el-input
            v-model="formDialog.code"
            placeholder="请输入验证码"
            maxlength="6"
          >
            <el-button
              slot="append"
              :loading="phoneFlag"
              :disabled="disabledFlag"
              style="color: #fff"
              size="mini"
              type="primary"
              @click="getValidCode()"
            >{{ phoneText }}</el-button>
          </el-input>
          <!-- </div> -->
        </el-form-item>

        <el-form-item
          label="联系手机号"
          :label-width="formLabelWidth"
          prop="phoneNo"
        >
          <el-input v-model="formDialog.phoneNo" clearable autocomplete="off" />
        </el-form-item>
        <el-form-item
          label="联系人类型"
          :label-width="formLabelWidth"
          prop="contactType"
        >
          <el-select
            v-model="formDialog.contactType"
            disabled
            clearable
            placeholder="--请选择--"
          >
            <el-option
              v-for="item in typeListdialog"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="接口产品" :label-width="formLabelWidth" required>
          <el-button
            type="primary"
            :disabled="
              !(
                formDialog.instCnFullNm !== '' &&
                formDialog.instCnFullNm !== null
              ) && this.$store.getters.userInfo.userInnerType.code === '05'
            "
            size="mini"
            @click="ConfigureInterPro()"
          >配置接口产品</el-button>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitClick()">确 定</el-button>
        <el-button @click="cancelClick()">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 配置接口产品树 -->
    <el-dialog
      v-if="dialogConfigure"
      title="配置接口产品"
      :visible.sync="dialogConfigure"
      :modal="true"
      append-to-body
      width="80%"
    >
      <el-radio-group
        v-model="menuInstType"
        style="margin-bottom: 30px"
        @change="changeTabPage()"
      >
        <!-- v-if="showBtn.includes('00')" -->
        <el-radio-button
          :disabled="!menuNewType.includes('00')"
          label="00"
        >市场机构</el-radio-button>
        <!-- v-if="showBtn.includes('10')" -->
        <el-radio-button
          :disabled="!menuNewType.includes('10')"

          label="10"
        >信息商</el-radio-button>
      </el-radio-group>

      <table-tree
        v-show="menuInstType==='00'"
        ref="tableTreeMarket"
        v-loading="tableLoading"
        :origin-data="originDataMarket"
        :table-columns="tableColumnsMarket"
        :default-ids="tempTreeObj.marketIds"
        show-checkbox
        is-fold
      />
      <table-tree
        v-show="menuInstType==='10'"
        ref="tableTreeInsti"
        v-loading="tableLoading"
        :origin-data="originDataInsti"
        :table-columns="tableColumnsInsti"
        :default-ids="tempTreeObj.infoIds"
        show-checkbox
        is-fold
      />

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelConfigDailog()">取 消</el-button>
        <el-button
          type="primary"
          @click="submitConfigDialog()"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  reqQueryMsg,
  reqIncreaseMsg,
  reqDeleteMsg,
  reqGetProductTreeNew,
  reqGetEmailCode,
  reqRebackProductTree,
  initInstInfo,
  reqInstiName,
  reqEditReback,
  reqEditSave
} from '@/api/email/contact'
import { validEmail, validTel } from '@/utils/validate'

var myOntimeVar = null
export default {
  name: 'ContactManagement',
  data() {
    var checkphone = (rule, value, callback) => {
      // let phoneReg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/;

      // 校验规则 支出数字、— ,且长度控制在30位以内
      if (value === '') {
        callback(new Error('不能为空'))
      } else {
        if (validTel(value)) {
          callback()
        } else {
          callback(new Error('电话格式不正确'))
        }
      }
      // if (value === '') {
      //   callback(new Error('请输入手机号'))
      // } else if (!validPhone(value)) { // 引入methods中封装的检查手机格式的方法
      //   callback(new Error('请输入正确的手机号!'))
      // } else {
      //   callback()
      // }
    }
    const validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('不能为空'))
      } else {
        if (!validEmail(value)) {
          callback(new Error('邮箱格式不正确'))
        }
        callback()
      }
    }

    return {
      dialogId: '',
      // 获取验证码倒计时
      phoneFlag: false,
      tableLoading: false,
      phoneText: '获取验证码',
      disabledFlag: false,
      editorData: {}, // 选中当前行进行编辑时使用
      // 添加联系人表单校验
      rules: {
        instCnFullNm: [
          {
            required: true,
            message: '请选择机构名称',
            trigger: ['blur', 'change']
          }
        ],
        userName: [
          {
            required: true,
            message: '请填写联系人姓名',
            trigger: ['blur', 'change']
          }
        ],
        email: [
          {
            required: true,
            message: '请填写联系人邮箱',
            trigger: ['blur', 'change']
          },
          { validator: validateEmail, trigger: ['blur', 'change'] }
        ],
        phoneNo: [
          {
            required: true,
            validator: checkphone,
            trigger: ['blur', 'change']
          }
        ],
        code: [
          {
            required: true,
            message: '请输入邮箱验证码',
            trigger: ['blur', 'change']
          }
        ],
        contactType: [
          {
            required: true,
            message: '请选择联系人类型',
            trigger: ['blur', 'change']
          }
        ]
      },
      selectInterfaceList: [],
      selectInterfaceListInst: [],
      // 回显接口产品数据
      cacheCurrentIdMar: '',
      cacheCurrentIdInst: '',
      // 获取机构身份
      menuType: [
        { label: '场务端', value: '20' },
        { label: '机构端', value: '10' }
      ],
      userInfo: {},
      // originData: [],
      // tableColumns: [],
      menuInstType: '00',
      menuNewType: [], // 00-市场机构 10-信息商
      originDataMarket: [],
      tableColumnsMarket: [],
      originDataInsti: [],
      tableColumnsInsti: [],
      marketObj: {},
      instiObj: {},
      // 表单
      form: {
        instCnFullNm: '',
        email: '',
        userName: '',
        contactType: '',
        interfaceName: ''
        // instId: ''
      },
      searchForm: {
        instCnFullNm: '',
        email: '',
        userName: '',
        contactType: '',
        interfaceName: ''
        // instId: ''
      },
      // 编辑按钮是否显示
      isShow: false,
      // 对话框中的表单数据
      formDialog: {
        instCnFullNm: '',
        userName: '',
        email: '',
        code: '',
        phoneNo: '',
        contactType: '50',
        emailCode: '',
        mailCode: ''
      },
      codeRes: '',
      formLabelWidth: '120px',
      // 联系人类型列表
      typeList: [
        { label: '全部', value: '' },
        { label: '服务开通', value: '00' },
        { label: '验收测试', value: '10' },
        { label: '接口上线', value: '20' },
        { label: '权限变更', value: '40' },
        { label: '补充用户', value: '50' },
        { label: '注册用户', value: '80' }
      ],
      typeListdialog: [
        { label: '全部', value: '' },
        { label: '服务开通', value: '00' },
        { label: '验收测试', value: '10' },
        { label: '接口上线', value: '20' },
        { label: '权限变更', value: '40' },
        { label: '补充用户', value: '50' },
        { label: '注册用户', value: '80' }
      ],
      // 机构名称列表
      instCnList: [],
      // 联系人管理表格数据
      contactManageData: [],
      // 编辑后弹出的对话框是否显示
      dialogFormVisible: false,
      // 配置接口产品
      dialogConfigure: false,
      total: 0,
      currentPage: 1,
      pageQuery: {
        page: 1,
        pageSize: 10
      },
      // 点多选框选中的数据
      selectList: [],
      // 添加/编辑 title
      title: '',
      // 添加/编辑对话框机构联系人是否置灰
      isDisabled: true,
      // 查询加载loading
      loading: false,
      treeList: [],
      tempTreeObj: {
        marketIds: [],
        infoIds: []
      },
      showBtn: []
    }
  },

  watch: {
    originData: {
      handler: function(newVal, oldVal) {
        console.log(newVal)
      }
    },
    dialogFormVisible(val) {
      if (!val) {
        this.$refs['formDialog'].resetFields()
        this.formDialog.contactType = '50'
        this.phoneText = '获取验证码'
        this.phoneFlag = false
        clearInterval(myOntimeVar)
      }
    },
    deep: true
  },

  created() {
    this.routerLinkCreated()
  },
  // activated() {
  //   this.routerLinkCreated()
  // },
  methods: {
    initMethods() {
      setTimeout(() => {
        this.routerLinkCreated()
      })
    },
    // tabs切换
    routerLinkCreated() {
      this.handleFilter()
      this.getUserInfo()
      this.GetInitInstInfo()
    },

    // 配置接口产品按钮
    ConfigureInterPro() {
      this.dialogConfigure = true
      const instiId = this.formDialog.instCnFullNm
      const usertype = this.$store.getters.userInfo.userInnerType.code

      if (this.title === '添加联系人') {
        // 场务端
        if (usertype === '05') {
          const param = { instId: instiId, menuType: '20' }
          reqInstiName(param).then(res => {
            if (res.code === 'ACK') {
              this.menuNewType = res.data
              this.dialogInfo(this.menuNewType)
            }
          })
        } else if (usertype === '00') { // 机构端
          reqInstiName({ menuType: '10' }).then(res => {
            if (res.code === 'ACK') {
              this.menuNewType = res.data
              this.dialogInfo(this.menuNewType)
            }
          })
        }
      } else if (this.title === '编辑联系人') {
        // 场务端
        if (usertype === '05') {
          if (this.treeList && this.treeList.length > 0) {
            this.reback()
          } else {
            if (this.treeList.some(e => e.interfaceIds.length > 0)) {
              reqEditReback(this.formDialog.interfaceId).then(res => {
                if (res.code === 'ACK') {
                  this.menuInstType = null
                  this.menuNewType = []
                  for (const key in res.data) {
                    this.menuNewType.push(key)
                    if (key === '00') {
                      this.originDataMarket = res.data['00'].nodeList
                      this.tableColumnsMarket = res.data['00'].headList
                    }
                    if (key === '10') {
                      this.originDataInsti = res.data['10'].nodeList
                      this.tableColumnsInsti = res.data['10'].headList
                    }
                  }
                  this.menuNewType.sort()
                  this.menuInstType = this.menuNewType.length === 0 ? null : this.menuNewType[0]
                }
              })
            } else {
              const params = { instId: instiId, menuType: '20' }
              reqInstiName(params).then(res => {
                if (res.code === 'ACK') {
                  this.menuNewType = res.data
                  this.getMenu(this.menuNewType)
                }
              })
            }
          }
        } else if (usertype === '00') { // 机构端
          if (this.treeList && this.treeList.length > 0) {
            this.reback()
          } else {
            if (this.treeList.some(e => e.interfaceIds.length > 0)) {
              reqEditReback(this.formDialog.interfaceId).then(res => {
                if (res.code === 'ACK') {
                  this.menuInstType = null
                  this.menuNewType = []
                  for (const key in res.data) {
                    this.menuInstType = this.menuInstType || key
                    this.menuNewType.push(key)
                    if (key === '00') {
                      this.originDataMarket = res.data['00'].nodeList
                      this.tableColumnsMarket = res.data['00'].headList
                    }
                    if (key === '10') {
                      this.originDataInsti = res.data['10'].nodeList
                      this.tableColumnsInsti = res.data['10'].headList
                    }
                  }
                }
              })
            } else {
              const params = { menuType: '10' }
              reqInstiName(params).then(res => {
                if (res.code === 'ACK') {
                  this.menuNewType = res.data
                  this.getMenu(this.menuNewType)
                }
              })
            }
          }
        }
      }
    },

    // 获取树节点
    async getMenu(str) {
      this.menuInstType = str[0]
      this.tableLoading = true
      const param = {
        menuInstType: str
      }
      const res = await reqGetProductTreeNew(param)
      if (res.code === 'ACK') {
        const result = res.data
        // this.marketObj = res.data['00']
        // this.instiObj = res.data['10']
        for (var key in result) {
          if (key === '00' && str.indexOf('00') >= 0) {
            this.originDataMarket = result['00'].nodeList
            this.tableColumnsMarket = result['00'].headList
          }
          if (key === '10' && str.indexOf('10') >= 0) {
            this.originDataInsti = result['10'].nodeList
            this.tableColumnsInsti = result['10'].headList
          }
          this.tableLoading = false
        }
      } else {
        this.tableLoading = false
      }
    },

    changeTabPage() {

    },

    // 回显的数据及展示的数据进行选择
    async getMenuEdit(str, args) {
      console.log('当前机构类型', args, '当前选中的需要回显的节点', str)
      // this.menuInstType = args[0]
      this.tableLoading = true
      const res = await reqEditReback(str, args)

      if (res.code === 'ACK') {
        const result = res.data
        if (JSON.stringify(result) === '{}') {
          console.log('this.menuNewType', this.menuNewType)
          this.getMenu(this.menuNewType)
        } else {
          var num = 0
          for (var key in result) {
            if (key === '00') {
              this.originDataMarket = result['00'].nodeList
              this.tableColumnsMarket = result['00'].headList
              this.tableLoading = false
              num++
            }
            if (key === '10') {
              this.tableLoading = false
              this.originDataInsti = result['10'].nodeList
              this.tableColumnsInsti = result['10'].headList
              num++
            }
          }
          // 当传参只有一组值时args.length为1，此时返回也只有对应的一组值，因此需要调获取树的初始化方法 获取另一组值
          if (num === 1 && result['00']) {
            // await this.getMenu(['10'])
          }
          if (num === 1 && result['10']) {
            // await this.getMenu(['00'])
          }
        }
      } else {
        this.tableLoading = false
      }
    },

    dialogInfo(str) {
      if (str) {
        var flag = false
        this.treeList.forEach((item) => {
          if (item.interfaceIds && item.interfaceIds.length > 0) {
            flag = true
          }
        })
        if (flag && this.title === '编辑联系人') {
          this.reback()
        } else {
          this.getMenu(str)
        }
      }
    },

    // 取消
    cancelConfigDailog() {
      this.dialogConfigure = false
    },

    // 确定
    async submitConfigDialog() {
      this.treeList = []
      const checkedListMarket = this.$refs.tableTreeMarket.getCheckedNodeList()
      const checkedListInsti = this.$refs.tableTreeInsti.getCheckedNodeList()

      if (checkedListMarket.length === 0 && checkedListInsti.length === 0) {
        this.$message({
          type: 'info',
          message: `请至少勾选一个接口`
        })
        return
      }
      this.tempTreeObj = {
        marketIds: checkedListMarket.map((e) => e.id) || [],
        infoIds: checkedListInsti.map((e) => e.id) || []
      }
      const checkedLeafListMar = checkedListMarket.filter(
        (e) => e.isLeafFlg.name === 'YES'
      )
      const checkedLeafListInst = checkedListInsti.filter(
        (e) => e.isLeafFlg.name === 'YES'
      )

      const checkedMenuConfigNodeListMar = checkedLeafListMar.map((e) => e.id)
      const checkedMenuConfigNodeListInst = checkedLeafListInst.map((e) => e.id)

      const marketObj = {
        interfaceIds: checkedMenuConfigNodeListMar,
        menuInstType: '00'
      }

      const instiObj = {
        interfaceIds: checkedMenuConfigNodeListInst,
        menuInstType: '10'
      }
      if (marketObj.interfaceIds && marketObj.interfaceIds.length === 0) {
        this.treeList.push(instiObj)
      }
      if (instiObj.interfaceIds && instiObj.interfaceIds.length === 0) {
        this.treeList.push(marketObj)
      }
      if (marketObj.interfaceIds && marketObj.interfaceIds.length > 0 && instiObj.interfaceIds && instiObj.interfaceIds.length > 0) {
        this.treeList.push(marketObj)
        this.treeList.push(instiObj)
      }
      this.dialogConfigure = false
    },

    reback() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.treeList = this.treeList.filter(e => this.formDialog.institutionTypeList.includes(e.menuInstType))
      // 回显保存状态——调接口
      reqRebackProductTree(this.treeList).then(res => {
        if (res.code === 'ACK') {
          this.menuInstType = null
          this.menuNewType = []
          for (const key in res.data) {
            this.menuNewType.push(key)
            if (key === '00') {
              this.originDataMarket = res.data['00'].nodeList
              this.tableColumnsMarket = res.data['00'].headList
            }
            if (key === '10') {
              this.originDataInsti = res.data['10'].nodeList
              this.tableColumnsInsti = res.data['10'].headList
            }
          }
          this.menuNewType.sort()
          this.menuInstType = this.menuNewType.length === 0 ? null : this.menuNewType[0]
        }
      }).finally(() => {
        loading.close()
      })
    },

    // 查询按钮
    handleFilter() {
      this.pageQuery.page = 1
      this.searchForm = JSON.parse(JSON.stringify(this.form))
      this.onQuery(this.searchForm)
    },
    async onQuery(form) {
      this.loading = true
      reqQueryMsg({ ...this.searchForm, ...this.pageQuery })
        .then((res) => {
          if (res.code === 'ACK') {
            this.contactManageData = res.data.list
            this.total = res.data.totalRecord
            this.loading = false
          }
        })
        .catch((err) => {
          this.contactManageData = []
          this.total = 0
          this.loading = false
          console.log(err)
        })
    },

    // 分页方法
    handleSizeChange(val) {
      this.pageQuery.pageSize = val
      if (JSON.stringify(this.searchForm) === JSON.stringify(this.form)) {
        this.onQuery(this.form)
      } else {
        this.form = JSON.parse(JSON.stringify(this.searchForm))
        this.onQuery(this.searchForm)
      }
    },
    handleCurrentChange(val) {
      this.pageQuery.page = val
      if (JSON.stringify(this.searchForm) === JSON.stringify(this.form)) {
        this.onQuery(this.form)
      } else {
        this.form = JSON.parse(JSON.stringify(this.searchForm))
        this.onQuery(this.searchForm)
      }
    },

    // 重置
    onReset() {
      Object.keys(this.form).forEach((item) => {
        this.form[item] = ''
      })
      this.handleFilter()
    },

    // 多选框点击事件
    handleSelectionChange(val) {
      if (val.length === 1) {
        this.editorData = val[0]
      }
      this.selectList = val
    },

    // 切换机构名称 ———— 清空上一次选中的树节点
    changeOption() {
      // this.selectInterfaceList = []
      this.originDataMarket = []
      this.originDataInsti = []
      this.treeList = []
      this.tempTreeObj = {
        marketIds: [],
        infoIds: []
      }
    },
    // 添加
    increaseClick() {
      if (myOntimeVar) {
        clearInterval(myOntimeVar)
      }
      this.disabledFlag = false
      this.title = '添加联系人'
      this.isDisabled = false
      this.dialogFormVisible = true

      // 获取验证码窗口 Id 赋值
      this.dialogId = new Date().getTime()

      this.formDialog = {
        instCnFullNm: '',
        userName: '',
        email: '',
        code: '',
        phoneNo: '',
        contactType: '50',
        emailCode: '',
        mailCode: ''
      }
      this.originDataMarket = []
      this.originDataInsti = []
      this.treeList = []
      this.tempTreeObj = {
        marketIds: [],
        infoIds: []
      }
    },

    // 删除
    deleteClick(row) {
      var delIdList = []
      this.selectList.forEach((item) => {
        delIdList = delIdList.concat(item.idList)
      })

      try {
        this.$confirm('是否确定删除选中的联系人?', '删除联系人', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(async() => {
            if (delIdList.length > 0) {
              const res = await reqDeleteMsg(delIdList)
              console.log('删除联系人', res)
              this.$message({
                type: 'success',
                message: '删除成功!'
              })

              this.handleFilter()
            } else {
              this.$message({
                type: 'warning',
                message: '请选择删除项'
              })
            }
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      } catch (error) {
        console.log(error)
      }
    },

    // 点击编辑后弹出的对话框相关的方法
    // 编辑
    editClick() {
      if (myOntimeVar) {
        clearInterval(myOntimeVar)
      }
      this.title = '编辑联系人'
      this.isDisabled = true
      this.dialogFormVisible = true
      this.disabledFlag = false

      // 获取验证码窗口 Id 赋值
      this.dialogId = new Date().getTime()

      this.formDialog = JSON.parse(JSON.stringify(this.editorData))
      console.log('this.editorData', this.editorData)
      this.formDialog.instCnFullNm = this.editorData.instId
      this.formDialog.interfaceId = this.editorData.idList
      console.log('当前行是否有选中节点', this.formDialog.interfaceId)
      this.treeList = this.editorData.treeList
      this.tempTreeObj = {
        marketIds: [],
        infoIds: []
      }
      // interfaceIdList
      this.cacheCurrentId = ''
      // this.ConfigureInterPro()
      // this.selectList.forEach(item => {
      //   var form = JSON.parse(JSON.stringify(item))
      //   this.formDialog = form
      //   // this.formDialog.instCnFullNm = form.instId
      //   this.cacheCurrentId = ''
      //   this.typeList.forEach(items => {
      //     // this.formDialog.contactType = item.contactType === items.value ? items.label : ''
      //     console.log(this.formDialog.contactType)
      //   })
      //   // this.formDialog.contactType = item.contactType
      //   console.log('编辑联系人====>', item)
      // })

      // console.log('this.editorData', this.editorData)
    },
    closeDialog() {
      this.$refs['formDialog'].resetFields()
      this.formDialog.contactType = '50'
    },

    // 获取验证码
    async getValidCode() {
      this.phoneFlag = true
      this.disabledFlag = false
      if (this.formDialog.email.length === 0) {
        this.$message({
          type: 'warning',
          message: `请填写正确的邮箱格式`
        })
        this.phoneFlag = false
        this.disabledFlag = false
        return
      }
      try {
        const res = await reqGetEmailCode({
          dialogId: this.dialogId,
          email: this.formDialog.email
        })
        if (res.code === 'ACK') {
          this.$message({
            type: 'success',
            message: '发送成功'
          })
          this.codeRes = res.data.emailCode
          if (res.data.dialogId !== this.dialogId) {
            this.countDown()
          }
        }
      } catch (error) {
        this.phoneFlag = false
        this.disabledFlag = false
        console.log(error)
      }
    },

    countDown(val) {
      this.disabledFlag = true
      var num = 60
      myOntimeVar = setInterval(() => {
        num--
        this.phoneText = num + 's'
        if (num < 0) {
          this.phoneText = '获取验证码'
          this.disabledFlag = false
          clearInterval(myOntimeVar)
        }
      }, 1000)
      setTimeout(() => {
        this.phoneFlag = false
      }, 1000)
    },

    // 初始化机构信息
    async GetInitInstInfo() {
      const res = await initInstInfo()
      this.instCnList = res.data
      this.instCnList.forEach((e) => {
        this.id = e.id
      })
      // console.log('this.instCnList', this.instCnList)
    },

    // 获取当前机构信息
    /*
     * @method: 获取用户信息
     * @param{ userInfo } Object 参数类型为object,内有属性用户id
     */
    async getUserInfo() {
      this.userinfo = this.$store.getters.userInfo
    },

    // 添加联系人 ———— 取消按钮
    cancelClick() {
      this.dialogFormVisible = false
      // this.$refs['formDialog'].resetFields()
    },
    // 添加联系人 ———— 确定按钮
    submitClick(formDialog) {
      this.$refs.formDialog.validate(async(valid) => {
        if (valid) {
          let allInterfaceIds = []
          this.treeList.forEach(e => {
            allInterfaceIds = allInterfaceIds.concat(e.interfaceIds)
          })
          if (this.treeList.length === 0 || allInterfaceIds.length === 0) {
            this.$message({
              type: 'warning',
              message: `请至少选择一个接口`
            })
            return
          }
          const newArr = this.instCnList
          const newTwo = newArr.filter((item) => {
            if (item.id === this.formDialog.instCnFullNm) {
              return item
            }
          })
          if (this.formDialog.code) {
            this.formDialog.emailCode = this.codeRes + this.formDialog.code
            this.formDialog.mailCode = this.formDialog.code
          }
          if (this.title === '添加联系人') {
            const params = {
              ...this.formDialog,
              instCnFullNm: newTwo && newTwo.length > 0 ? newTwo[0].instnCnFullNm : '',
              id: newTwo && newTwo.length > 0 ? newTwo[0].id : '',
              treeList: this.treeList
            }
            await reqIncreaseMsg(params)
            this.$message.success('保存成功')
          } else if (this.title === '编辑联系人') {
            const params = {
              ...this.formDialog,
              ids: this.formDialog.idList,
              treeList: this.treeList,
              menuInstType: this.menuNewType,
              instCnFullNm: newTwo && newTwo.length > 0 ? newTwo[0].instnCnFullNm : ''
            }
            await reqEditSave(params)
            this.$message.success('保存成功')
          }
          this.dialogFormVisible = false
          this.handleFilter()
        } else {
          console.log('校验错误')
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
.el-card.top_card ::v-deep .el-card__body {
  padding: 20px 20px 0px 20px;
}

.add-dialog ::v-deep .el-dialog__body {
  padding: 20px 70px;
}

.add-dialog ::v-deep .el-select {
  width: 100%;
}
</style>
