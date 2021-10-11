<template>
  <!-- 新建手动邮件通知 -->
  <div class="new_emial_notice">
    <el-card>
      <el-form
        ref="ruleForm"
        :model="templateForm"
        :rules="templateFormRules"
        class="demo-ruleForm"
      >
        <div class="card_content">
          <div class="content_left">
            <div class="content_input">
              <div class="contontent_title">邮件模板名称</div>
              <el-form-item prop="emailName">
                <el-input
                  v-model="templateForm.emailName"
                  :disabled="isDisabled"
                />
              </el-form-item>
            </div>
            <div class="content_input">
              <div class="contontent_title">发送时间</div>
              <el-form-item prop="sendType">
                <div class="radio_time">
                  <el-radio-group
                    v-model="templateForm.sendType"
                    :disabled="isDisabled"
                    size="mini"
                  >
                    <el-radio label="1" border>即时发送</el-radio>
                    <el-radio label="2" border>定时发送</el-radio>
                  </el-radio-group>
                  <div v-if="templateForm.sendType === '2'" class="send_time">
                    <el-date-picker
                      v-model="templateForm.sendTime"
                      :disabled="isDisabled"
                      type="datetime"
                      :picker-options="pickerOptions"
                      placeholder="选择日期时间"
                      value-format="yyyy-MM-dd HH:mm:ss"
                    />
                  </div>
                </div>
              </el-form-item>
            </div>
            <div class="content_input">
              <div class="contontent_title">关联接口：</div>
              <el-form-item prop="linkInterface">
                <div class="radio_time">
                  <el-radio-group
                    v-model="templateForm.linkInterface"
                    size="mini"
                    :disabled="isDisabled || isGetAll"
                    @change="linkInterfaceChange"
                  >
                    <el-radio
                      label="1"
                      border
                      @click.native="interfaceContent(1)"
                    >无需关联</el-radio>
                    <el-radio
                      label="2"
                      border
                      @click.native="interfaceContent(2)"
                    >全部接口</el-radio>
                    <el-radio
                      label="3"
                      border
                      @click.native="interfaceContent(3)"
                    >部分接口</el-radio>
                  </el-radio-group>
                </div>
              </el-form-item>
            </div>
            <div class="content_input">
              <div class="contontent_title">订阅邮件类型</div>
              <el-select
                v-model="templateForm.emailType"
                clearable
                :disabled="isDisabled"
                placeholder="--请选择--"
              >
                <el-option label="无" value="" />
                <el-option
                  v-for="item in emailTypeList"
                  :key="item.templateId"
                  :label="item.templateName"
                  :value="item.templateId"
                />
              </el-select>
            </div>
          </div>
          <div class="content_right">
            <div class="content_send">发送目标</div>
            <div class="select_people">
              <tabs-organ
                v-model="templateForm.selectUser"
                :value="templateForm.selectUser"
                :tabs-list="tabsList"
                @input="tabClick"
              />
              <div class="select_usere">
                <el-input
                  v-model="templateForm.organName"
                  style="margin-right: 8px"
                  clearable
                  placeholder="请输入关键字进行查询"
                />
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-search"
                  @click="search"
                />
                <el-button
                  style="margin-left: 10px"
                  type="primary"
                  size="mini"
                  :disabled="isDisabled"
                  icon="el-icon-circle-plus-outline"
                  @click="openDialog"
                />
                <!-- <el-button type="primary" size="mini" icon="el-icon-search" /> -->
              </div>
              <div class="select_tree">
                <el-button
                  v-if="!isDisabled"
                  type="text"
                  icon="el-icon-delete"
                  @click="emptyTree"
                >清空发送目标</el-button>
                <!-- <el-button type="text"  icon="el-icon-plus" @click="getTreeUserId">11111</el-button> -->
                <el-button
                  type="text"
                  icon="el-icon-plus"
                  @click="getNoDYList()"
                >查看未订阅联系人列表</el-button>
                <div class="tree-container">
                  <el-tree
                    v-show="templateForm.selectUser !== '05'"
                    ref="tree"
                    v-loading="userTypeStatus"
                    :data="treeList"
                    default-expand-all
                    :props="defaultProps"
                    :indent="0"
                    node-key="selfId"
                    class="tree"
                    style="background-color: transparent important"
                    :filter-node-method="filterNode"
                    :render-content="renderContent"
                    @node-click="handleNodeClick"
                  >
                    <!-- <span slot-scope="{ node, data }" class="custom-tree-node">
                      <el-tooltip effect="dark" :content="node.label" placement="right">
                        <span>{{ node.label }}</span>
                      </el-tooltip>
                      <span class="custom_email_font">{{ data.email ? (data.email.length > 21 ? '(' + data.email.substring(0, 21) + '...' + ')' : data.email) : '' }}</span>
                      <span class="show_children">
                        <el-tooltip effect="dark" content="删除当前节点信息" placement="right">
                          <el-button
                            icon="el-icon-delete"
                            type="text"
                            @click="remove(node, data)"
                          />
                        </el-tooltip>
                      </span>
                    </span> -->
                  </el-tree>
                  <el-tree
                    v-show="templateForm.selectUser === '05'"
                    ref="treeManager"
                    v-loading="managerTypeStatus"
                    :data="treeListManager"
                    default-expand-all
                    :props="defaultProps"
                    :indent="0"
                    node-key="selfId"
                    class="tree"
                    style="background-color: transparent important"
                    :filter-node-method="filterNode"
                    :render-content="renderContent"
                    @node-click="handleNodeClick"
                  >
                    <!-- <span slot-scope="{ node, data }" class="custom-tree-node">
                      <span>{{ node.label }}</span><span class="custom_email_font">{{ data.email ? '(' + data.email + ')' : '' }}</span>
                      <span class="show_children">
                        <el-tooltip effect="dark" content="删除当前节点信息" placement="right">
                          <el-button
                            icon="el-icon-delete"
                            type="text"
                            @click="remove(node, data)"
                          />
                        </el-tooltip>
                      </span>
                    </span> -->
                  </el-tree>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-form>
    </el-card>
    <add-select-tree
      ref="selectTree"
      :select-node="selectNode"
      @getTree="getTreeFun"
    />
    <InsertDrawer
      ref="insertDrawer"
      @confirmForm="retConfirm"
      @drawerBackTo="drawerBackToFun"
    />
    <!-- 未订阅邮件联系人弹窗 -->
    <el-dialog title="未订阅邮件模板类型机构端联系人" :visible.sync="dialogVisibleNoDY" width="55%">
      <el-table :data="tableDataDY" style="width: 100%">
        <el-table-column prop="label" label="姓名" width="200" />
        <el-table-column prop="email" label="邮箱" width="250" />
        <el-table-column prop="phoneNo" label="联系方式" />
        <el-table-column prop="instCnFullNm" label="机构名称" width="200" />
        <el-table-column prop="contactType" label="联系人类型" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.contactType === '00'">服务开通联系人</span>
            <span v-if="scope.row.contactType === '10'">验收测试联系人</span>
            <span v-if="scope.row.contactType === '20'">接口上线联系人</span>
            <span v-if="scope.row.contactType === '30'">服务终止联系人</span>
            <span v-if="scope.row.contactType === '40'">权限变更联系人</span>
            <span v-if="scope.row.contactType === '50'">补充用户联系人</span>
            <span v-if="scope.row.contactType === '60'">用户管理联系人</span>
            <span v-if="scope.row.contactType === '70'">机构管理联系人</span>
            <span v-if="scope.row.contactType === '80'">注册用户联系人</span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="dialogVisibleNoDY = false"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 未订阅邮件联系人场务弹窗 -->
    <el-dialog title="未订阅邮件模板类型场务端联系人" :visible.sync="dialogVisibleNoDYManager" width="55%">
      <el-table :data="tableDataDYManager" style="width: 100%">
        <el-table-column prop="label" label="姓名" width="200" />
        <el-table-column prop="email" label="邮箱" width="250" />
        <el-table-column prop="phoneNo" label="联系方式" />
        <el-table-column prop="instCnFullNmOrDepartmentNameParent" label="部门名称" width="200" />
        <el-table-column prop="instCnFullNm" label="小组名称" width="150" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          @click="dialogVisibleNoDYManager = false"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const emailTypeList = [
  {
    label: '服务开通联系人',
    value: '1'
  },
  {
    label: '验收测试联系人',
    value: '2'
  },
  {
    label: '接口上线联系人',
    value: '3'
  },
  {
    label: '权限变更联系人',
    value: '4'
  },
  {
    label: '机构用户联系人',
    value: '5'
  },
  {
    label: '机构补充联系人',
    value: '6'
  }
]
const tabList = [
  {
    title: '机构用户',
    activeId: '00'
  },
  {
    title: '场务用户',
    activeId: '05'
  }
]
// import { getTree } from './getTree'
// import { treeFun } from './treeTrans'
import {
  getPeopleTree,
  getPeopleTreeNoInst,
  getEmailInfo,
  getTemplateList,
  addOrEditManualEmailManage,
  getSearchPeopleTree,
  delTreeNode,
  getNoDYPeopleList
} from '@/api/email/email_manage.js'
// import { getUserType } from './getUserType'
import treeData from './tree'
// import { ElStep } from 'element-ui/types/step'
export default {
  components: {
    tabsOrgan: () => import('../components/tabs-organization/index'),
    addSelectTree: () => import('./addSelectTree'),
    InsertDrawer: () => import('../components/insertDrawer')
  },
  props: {
    componentsInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 3600 * 1000
        }
      },
      dialogVisibleNoDY: false,
      dialogVisibleNoDYManager: false,
      isShow: false,
      isGetAll: false,
      isDisabled: false,
      lookNext: {},
      cacheList: [],
      tableDataDY: [],
      tableDataDYManager: [],
      selectNode: [], // 选中的值默认选中提供参数以selfId为准
      templateForm: {
        emailName: '',
        sendType: '1',
        sendTime: '',
        linkInterface: '',
        emailType: '',
        selectUser: '00',
        organName: '',
        userName: '',
        contactTypeId: ''
      },
      templateFormRules: {
        emailName: [
          { required: true, message: '请输入邮件模板名称', trigger: 'blur' },
          { max: 100, message: '输入长度小于100字符', trigger: 'blur' }
        ],
        sendType: [
          { required: true, message: '请选择发送方式', trigger: 'change' }
        ],
        linkInterface: [
          { required: true, message: '请选择关联接口', trigger: 'change' }
        ]
      },
      treeList: [],
      userTypeStatus: false,
      managerTypeStatus: false,
      treeListManager: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      tabsList: tabList,
      emailTypeList: emailTypeList,
      isDelete: true,
      // 记录每次从额外添加中选出来的key值
      keys: [],
      // 场务端选中的key
      manageKeys: [],
      // 删除节点后生成的新的keys值
      newKeys: [],
      ids: [],
      userIds: [],
      userIdsManager: [],
      // 是否选择的全部接口 ALL  为全部，普通为null
      interfaceNum: ''
    }
  },
  async activated() {
    await this.getTemplateTyep()
    await this.initPage()
  },
  methods: {
    // -------------------------初始化数据根据componentsInfo字段携带的信息区分新增、查看、编辑
    initPage() {
      const { data } = this.componentsInfo
      this.lookNext = data
      if (data && data.from && data.from === 'view') {
        this.checkEmailInfo(data)
        this.isDisabled = true
        this.isGetAll = true
      } else if (data && data.from && data.from === 'add') {
        this.isDisabled = false
        this.isGetAll = false
        if (data.data) this.checkEmailInfo(data)
      } else if (data && data.from && data.from === 'editor') {
        this.checkEmailInfo(data)
        this.isDisabled = false
        this.isGetAll = false
      }
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class='custom-tree-node'>
          {(node.label + data.email).length > 45 ? (
            <el-tooltip effect='dark' placement='right'>
              <div class='content_email' slot='content'>
                {node.label + data.email}
              </div>
              <span>
                <span>{node.label}</span>
                <span class='custom_email_font'>
                  {data.email
                    ? data.email.length > 21
                      ? '(' + data.email.substring(0, 21) + '...' + ')'
                      : data.email
                    : ''}
                </span>
              </span>
            </el-tooltip>
          ) : (
            <span>
              <span>
                <span>{node.label}</span>
                <span class='custom_email_font'>
                  {data.email ? '(' + data.email + ')' : ''}
                </span>
              </span>
            </span>
          )}
          <span
            class={this.isDisabled ? 'show_children_two' : 'show_children_one'}
          >
            <el-tooltip
              effect='dark'
              content='删除当前节点信息'
              placement='right'
            >
              <el-button
                icon='el-icon-delete'
                type='text'
                onclick={() => {
                  this.remove(node, data)
                }}
              />
            </el-tooltip>
          </span>
        </span>
      )
    },
    getTemplateTyep() {
      getTemplateList()
        .then((res) => {
          const { code, data } = res
          if (code === 'ACK') {
            this.emailTypeList = data
          }
        })
        .catch()
    },
    // -------------------------------------返回上一步-----------------------------------
    handNext() {
      this.$emit('newAddEmail', {
        id: 8,
        title: '查看下一步',
        from: this.lookNext.from,
        type: this.lookNext.type,
        data: this.lookNext.data
      })
    },
    // --------------------------------------查看邮件接口回显-----------------------------
    checkEmailInfo(str) {
      this.userTypeStatus = true
      this.managerTypeStatus = true
      getEmailInfo(str.data)
        .then((res) => {
          const { code, data } = res
          if (code === 'ACK') {
            this.templateForm.emailName = data.emailName
            this.templateForm.sendType = data.sendType
            this.templateForm.linkInterface = data.associatedInterfaceType
            this.templateForm.emailType = data.subscriptionId
              ? Number(data.subscriptionId)
              : ''
            this.templateForm.sendTime = data.sendTime
            this.treeListManager = data.manageList
            this.treeList = data.institutionList
            this.getAllKeys(data.manageList, '05')
            this.getAllKeys(data.institutionList, '00')
            this.userTypeStatus = false
            this.managerTypeStatus = false
          }
        })
        .catch((err) => {
          this.userTypeStatus = false
          this.managerTypeStatus = false
          console.log(err)
        })
    },
    // --------------------------------------查看邮件接口回显-----------------------------
    // -------------------------初始化数据根据componentsInfo字段携带的信息区分新增、查看、编辑
    // 场务机构用户切换
    tabClick(args) {
      this.templateForm.organName = ''
      this.templateForm.selectUser = args.activeId
    },
    handleNodeClick(data) {
      // console.log(data)
    },
    search() {
      // this.filterNode(this.templateForm.organName);
      // this.$refs.tree.filter(this.templateForm.organName)
      // 调用后台方法搜索
      this.userTypeStatus = true
      if (this.templateForm.selectUser === '00') {
        // 机构端树
        const map = {
          keys: this.keys,
          userType: this.templateForm.selectUser,
          search: this.templateForm.organName,
          isSearch: '1',
          InterfaceNum: this.interfaceNum,
          sizeWindow: '2',
          isInterface: '0'
        }
        getSearchPeopleTree(map).then((res) => {
          if (res.code === 'ACK') {
            this.treeList = res.data.concat([])
            this.userTypeStatus = false
          }
        })
      } else {
        const map = {
          keys: this.manageKeys,
          userType: this.templateForm.selectUser,
          search: this.templateForm.organName,
          isSearch: '1'
        }
        getSearchPeopleTree(map).then((res) => {
          if (res.code === 'ACK') {
            // 场务端树
            this.treeListManager = res.data.concat([])
            this.userTypeStatus = false
          }
        })
      }
    },
    retConfirm() {
      this.$refs.insertDrawer.drawer = true
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    openDialog() {
      this.$refs.selectTree.initPage(this.templateForm.selectUser)
    },
    emptyTree() {
      // 清空临时值
      if (this.templateForm.selectUser === '05') {
        this.manageKeys = []
        this.treeListManager = []
      } else {
        this.treeList = []
        this.keys = []
      }
      this.selectNode = []
      this.ids = []
    },
    // 查看未订阅联系人列表
    async getNoDYList() {
      await this.getTreeUserId()
      // 获取当前所有联系人
      // console.log('选中的机构端所有userID', this.userIds)
      // console.log('选中的场务端所有userID', this.userIdsManager)
      // console.log(this.templateForm.selectUser)
      if (!this.templateForm.emailType) {
        this.$message.warning('请选择订阅邮件类型后查看未订阅联系人')
        return false
      }
      if (this.templateForm.selectUser === '00') {
        if (this.userIds.length === 0) {
          this.$message.warning('当前未选中机构端人员')
          return false
        }
      } else {
        if (this.userIdsManager.length === 0) {
          this.$message.warning('当前未选中场务人员')
          return false
        }
      }
      var param = {
        userType: this.templateForm.selectUser,
        instUser: this.userIds,
        managerUser: this.userIdsManager,
        subscriptionId: this.templateForm.emailType
      }
      if (this.templateForm.selectUser === '00') {
        param.managerUser = []
      } else {
        param.instUser = []
      }
      getNoDYPeopleList(param).then((res) => {
        console.log(res)
        if (res.code === 'ACK') {
          if (res.data && res.data.length > 0) {
            if (this.templateForm.selectUser === '00') {
              this.tableDataDY = res.data
              this.dialogVisibleNoDY = true
            } else {
              this.tableDataDYManager = res.data
              this.dialogVisibleNoDYManager = true
            }
          } else {
            this.$message.warning('当前选中的联系人中没有未订阅该类型的用户')
          }
        }
      })
    },
    remove(node, data) {
      // console.log('node================>', node)
      // console.log('data================>', data)
      this.$confirm('确定要删除该节点吗？', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          // const parent = node.parent
          // const children = parent.data.children || parent.data
          // const index = children.findIndex(d => d.id === data.id)
          // children.splice(index, 1)
          // this.deleteNode(node, data, this.treeList)
          // console.log('==========>', parent)
          // 如果当前节点为父节点请删除所有子节点信息
          // this.detailNode(data.id)
          this.userTypeStatus = true
          this.newKeys = []
          var nodeId = data.id
          if (this.templateForm.selectUser === '00') {
            const map = {
              nodeId: nodeId,
              keys: this.keys,
              userType: this.templateForm.selectUser
            }
            const res = await delTreeNode(map)
            if (res.code === 'ACK') {
              this.treeList = res.data.concat([])
              await this.getKeys(res.data.concat([]))
              // console.log(this.newKeys)
              this.keys = this.newKeys.concat([])
              this.userTypeStatus = false
            }
          } else {
            const map = {
              nodeId: nodeId,
              keys: this.manageKeys,
              userType: this.templateForm.selectUser
            }
            const res = await delTreeNode(map)
            if (res.code === 'ACK') {
              this.treeListManager = res.data.concat([])
              await this.getKeys(res.data.concat([]))
              // console.log(this.newKeys)
              this.manageKeys = this.newKeys.concat([])
              this.userTypeStatus = false
            }
          }
        })
        .catch((err) => {
          console.log('删除出错', err)
        })
    },
    // 获取所有的key值（不加入总keys）
    getKeys(list) {
      list.forEach((item) => {
        this.newKeys.push(item.id)
        if (item.children) {
          this.getKeys(item.children)
        }
      })
    },
    deleteNode(node, data, treeList) {
      // console.log('测试信息======》', node, data)
      // console.log('树结构', treeList)
      for (let i = 0; i < treeList.length; i++) {
        // 找到当前的id对应的节点
        if (treeList[i].id === data.id) {
          // 删除节点信息环节
          // console.log('定点清除', treeList[i])
          // this.delete
        } else {
          this.deleteNode(node, data, treeList[i].children)
        }
      }
      // if (parent.data.children && parent.data.children.length > 0) {
      //   return false
      // } else {
      //   console.log('信息上-----------》', parent)
      //   delete parent.data
      //   if (parent.parent) this.deleteNode(parent.parent)
      // }
      // console.log('parent=========>', parent)
    },
    // 如果当前节点为父节点请删除所有子节点信息
    detailNode(nodeInfo) {
      treeData.newNode.forEach((item) => {
        if (item.id === nodeInfo) {
          if (item.usrtType !== 'user') {
            if (item.id) this.updateNode(item.id)
          }
          if (item.usrtType === 'user') {
            this.selectNode.splice(this.selectNode.indexOf(item.id), 1)
          }
        }
      })
    },
    updateNode(nodeId) {
      for (let i = 0; i < treeData.newNode.length; i++) {
        if (treeData.newNode[i].id === nodeId) {
          if (treeData.newNode[i].usrtType === 'user') {
            this.detailNode(treeData.newNode[i].id)
          } else {
            if (treeData.newNode[i].id) this.updateNode(treeData.newNode[i].id)
          }
        }
      }
    },
    // getTreeFun(args) {
    //   const selectList = getTree(args.nodeList, args.selectList)
    //   this.selectNode = selectList
    //   const newArr = []
    //   args.nodeList.forEach(item => {
    //     selectList.forEach(ele => {
    //       if (item.selfId === ele) {
    //         newArr.push(item)
    //       }
    //     })
    //     // if
    //   })
    //   this.cacheList = newArr // 暂存选中的数组对象树
    //   this.treeList = treeFun(newArr, 0)
    // },
    // 获取树上的所有userid传给下一个页面
    async getTreeUserId(tree) {
      this.userIds = []
      this.userIdsManager = []
      if (Array.isArray(this.treeList) && this.treeList.length > 0) { await this.getUserList(this.treeList, '00') }
      if (
        Array.isArray(this.treeListManager) &&
        this.treeListManager.length > 0
      ) { await this.getUserList(this.treeListManager, '05') }
      // console.log('选中的机构端所有userID', this.userIds)
      // console.log('选中的场务端所有userID', this.userIdsManager)
    },
    getUserList(tree, userType) {
      tree.forEach((item) => {
        if (item.isLeaf === 'leaf') {
          if (userType === '05') {
            this.userIdsManager.push(item)
          } else {
            this.userIds.push(item)
          }
        }
        if (item.children) {
          this.getUserList(item.children, userType)
        }
      })
    },
    // xzn 接口树处理
    async getTreeFun(args) {
      // 获取树中的keys
      // '页面收到的参数', args
      var keys = args.selectList
      // console.log('收到的', args, this.templateForm.selectUser)
      var list = []
      if (this.templateForm.selectUser === '05') {
        if (this.manageKeys.length > 0) {
          const addList = []
          keys.forEach((key) => {
            if (this.manageKeys.indexOf(key) === -1) {
              addList.push(key)
            }
          })
          this.manageKeys = this.manageKeys.concat(addList)
        } else {
          this.manageKeys = keys
        }
        list = await this.getTree(
          this.manageKeys,
          [],
          this.templateForm.selectUser,
          '0'
        )
      } else {
        if (this.keys.length > 0) {
          const addList = []
          keys.forEach((key) => {
            if (this.keys.indexOf(key) === -1) {
              addList.push(key)
            }
          })
          this.keys = this.keys.concat(addList)
        } else {
          this.keys = keys
        }
        //  '页面所有已有的key', this.keys
        list = await this.getTree(
          this.keys,
          [],
          this.templateForm.selectUser,
          '0'
        )
      }
      // 拼接所有选中的key值
      await this.getAllKeys(list, this.templateForm.selectUser)
      // 获取总树赋值到页面
      this.getAllTreeByKeys(this.templateForm.selectUser)
    },
    // 获取选中的树的key加入总key当中
    async getAllTreeByKeys(userType) {
      this.userTypeStatus = true
      this.managerTypeStatus = true
      try {
        if (userType === '05') {
          const allList = await this.getTree(this.manageKeys, [], userType, '0')
          this.treeListManager = allList
          this.managerTypeStatus = false
        } else {
          const allList = await this.getTree(this.keys, [], userType, '0')
          this.treeList = allList
          this.userTypeStatus = false
        }
      } catch (error) {
        this.userTypeStatus = false
        this.managerTypeStatus = false
        console.log(error)
      }
    },
    // 切换接口选项
    async linkInterfaceChange(val) {
      // 选择部分接口时触发抽屉展示树  选择发送目标不为场务用户
      if (
        this.templateForm.linkInterface === '3' &&
        this.templateForm.selectUser !== '05'
      ) {
        this.interfaceNum = 'part'
        // 打开抽屉
        this.$refs.insertDrawer.initPage()
      } else if (
        this.templateForm.linkInterface === '2' &&
        this.templateForm.selectUser !== '05'
      ) {
        this.interfaceNum = 'ALL'
        await this.getAllInterfaceTree(
          this.keys,
          [],
          this.templateForm.selectUser
        )
      } else {
        this.interfaceNum = ''
      }
    },
    interfaceContent(val) {
      if (this.componentsInfo.data.from === 'view') return false
      this.templateForm.linkInterface = val + ''
      this.linkInterfaceChange()
    },
    // 部分接口 抽屉回调传入接口list方法
    async drawerBackToFun(interfaceList) {
      // 加入选中的接口中
      console.log('收到的接口ids', interfaceList)
      var ids = interfaceList
      if (this.ids.length > 0) {
        var addList = []
        ids.forEach((id) => {
          if (this.ids.indexOf(id) === -1) {
            addList.push(id)
          }
        })
        this.ids = this.ids.concat(addList)
      } else {
        this.ids = ids
      }
      // 部分接口传入 部分接
      var list = await this.getTree([], ids, this.templateForm.selectUser, '1')
      // console.log(list)
      // 遍历接口查到的树，将其key值加入页面已选中的key中
      await this.getAllKeys(list, this.templateForm.selectUser)
      this.getAllTreeByKeys(this.templateForm.selectUser)
    },
    // 获取树上所有的key值
    getAllKeys(list, userType) {
      var keys = []
      list.forEach((item) => {
        keys.push(item.id)
        if (item.children) {
          this.getAllKeys(item.children, userType)
        }
      })
      if (userType === '05') {
        if (this.manageKeys.length > 0) {
          const addKeyList = []
          keys.forEach((key) => {
            if (this.manageKeys.indexOf(key) === -1) {
              addKeyList.push(key)
            }
          })
          this.manageKeys = this.manageKeys.concat(addKeyList)
        } else {
          this.manageKeys = keys
        }
      } else {
        if (this.keys.length > 0) {
          const addKeyList = []
          keys.forEach((key) => {
            if (this.keys.indexOf(key) === -1) {
              addKeyList.push(key)
            }
          })
          this.keys = this.keys.concat(addKeyList)
        } else {
          this.keys = keys
        }
      }
      // console.log(this.keys)
    },
    // 选择全部接口树 选择全部接口时传输 接口调用标志
    async getAllInterfaceTree(keys, ids, userType) {
      this.isGetAll = true
      try {
        // 机构端
        const res = await getPeopleTree({
          ids: ids,
          keys: keys,
          InterfaceNum: this.interfaceNum,
          sizeWindow: '2',
          isInterface: '1'
        })
        if (res.code === 'ACK') {
          const allList = res.data.concat([])
          this.treeList = allList
          this.getAllKeys(allList, this.templateForm.selectUser)
          this.isGetAll = false
        } else {
          return []
        }
      } catch (error) {
        this.isGetAll = false
        // console.log('error=======>', error)
      }
    },
    // 根据选中的key值，获取全量树
    async getTree(keys, ids, userType, isInterface) {
      try {
        if (userType === '05') {
          // 场务端
          const res = await getPeopleTreeNoInst({ ids: ids, keys: keys })
          if (res.code === 'ACK') {
            const list = res.data.concat([])
            return list
          }
        } else {
          // 机构端
          const res = await getPeopleTree({
            ids: ids,
            keys: keys,
            sizeWindow: '2',
            isInterface: isInterface
          })
          if (res.code === 'ACK') {
            const list = res.data.concat([])
            return list
          } else {
            return []
          }
        }
      } catch (error) {
        console.log('error=======>', error)
      }
    },
    // --------------------------------保存并下一步的操作部分----------------------------------------------------
    async save(str) {
      // templateForm.sendTime
      // new Date().setFullYear() + '-' +
      // new Date().setFullYear() + '-' +
      // new Date().getMonth() + 1 +
      // new Date().getUTCDate() + ' ' +
      // new Date().getHours()() + ':' +
      // new Date().getMinutes() + ':' +
      // new Date().getSeconds()
      // console.log("当前")
      // console.log(this.templateForm.sendTime)
      await this.getTreeUserId()
      await this.saveNextForm()
    },
    saveNextForm() {
      const param = {
        associatedInterfaceType: this.templateForm.linkInterface,
        createOpid: this.$store.getters.userInfo.id,
        emailId:
          this.lookNext.data && this.lookNext.data.emailId
            ? this.lookNext.data.emailId
            : '',
        emailName: this.templateForm.emailName,
        subscriptionId: this.templateForm.emailType,
        emailType: '1',
        manageList: this.userIdsManager,
        institutionList: this.userIds,
        sendTime: this.templateForm.sendTime,
        sendType: this.templateForm.sendType
      }
      var saveStatus = true
      if (this.userIdsManager.length > 0 || this.userIds.length > 0) {
        saveStatus = true
      } else {
        this.$message({
          message: '请选择收件人后再提交',
          type: 'warning'
        })
        saveStatus = false
      }
      this.$refs.ruleForm.validate((valid) => {
        if (valid && saveStatus) {
          this.$emit('loadingStatus', {
            type: 'hand',
            id: 101,
            loadStatus: true
          })
          addOrEditManualEmailManage(param)
            .then((res) => {
              const { code, data, message } = res
              if (code === 'ACK') {
                this.$emit('loadingStatus', {
                  type: 'hand',
                  id: 101,
                  loadStatus: false
                })
                this.$message({
                  message: message,
                  type: 'success'
                })
                this.$emit('newAddEmail', {
                  id: 8,
                  from: this.lookNext.from,
                  type: 'hand',
                  data: {
                    emailId: data,
                    emailType: this.templateForm.emailType
                  },
                  reason: '保存成功'
                })
              }
            })
            .catch((err) => {
              this.$emit('loadingStatus', {
                type: 'hand',
                id: 101,
                loadStatus: false
              })
              console.log('err===========>', err)
            })
        } else {
          return false
        }
      })
      // ---------------------------------保存成功后执行的回调--------------------------------------------------
      // 此代码应放入成功后的代码中
      // ---------------------------------保存成功后执行的回调--------------------------------------------------
    }
    // --------------------------------保存并下一步的操作部分----------------------------------------------------
  }
}
</script>

<style lang="scss">
.custom-tree-node .show_children_one {
  display: none;
}

.custom-tree-node .show_children_two {
  display: none;
}

.custom-tree-node:hover .show_children_one {
  display: inline;
}
.content_email {
  max-width: 1000px;
  word-wrap: break-word;
}
.custom_email_font {
  color: #b1b3b8;
}
</style>

<style lang="scss" scoped>
.new_emial_notice {
  width: 100%;
  .card_content {
    display: flex;
    justify-content: space-between;
    .content_left {
      display: flex;
      width: 530px;
      min-width: 330px;
      padding-right: 10px;
      flex-direction: column;
      .content_input {
        width: 100%;
        display: flex;
        flex-direction: column;
        margin-bottom: 20px;
        .contontent_title {
          margin-bottom: 8px;
          color: #303030;
          font-weight: 400;
          font-size: 14px;
        }
        .radio_time {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          .send_time {
            display: flex;
            flex: 1;
            padding: 0px 0px 0px 10px;
          }
        }
      }
    }
    .content_right {
      width: 647.78px;
      display: flex;
      flex: 1;
      padding-left: 10px;
      flex-direction: column;
      .content_send {
        padding-left: 8px;
        border-left-width: 4px;
        border-left-color: #2494fe;
        border-left-style: solid;
        font-size: 20px;
        font-weight: bold;
        color: #333333;
      }
      .select_people {
        margin-top: 23px;
        border: 1px solid #dfdfdf;
        background: #fcfcfc;
        .select_usere {
          display: flex;
          flex-direction: row;
          padding: 6px 24px;
          border-bottom: 1px solid #dfdfdf;
          box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
          background-color: #ffffff;
        }
        .select_tree {
          height: 586px;
          padding: 16px 0px;
          padding-left: 10px;
          overflow-y: auto;
          ::v-deep .el-tree {
            background-color: transparent !important;
          }
        }
      }
    }
  }
}

.select_usere ::v-deep .el-button--mini {
  // width: 30px;
  height: 30px;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  padding-left: 10px;
  padding-right: 8px;
}

/* 树形结构节点添加连线 */
.tree ::v-deep .el-tree-node {
  position: relative;
  padding-left: 16px;
}

.tree ::v-deep .el-tree-node__children {
  padding-left: 16px;
}

.tree ::v-deep .el-tree-node :last-child:before {
  height: 38px;
}

.tree ::v-deep .el-tree > .el-tree-node:before {
  border-left: none;
}

.tree-container ::v-deep .el-tree > .el-tree-node:after {
  border-top: none;
}

.tree-container ::v-deep .el-tree > .el-tree-node:before {
  border-left: none;
}

.tree ::v-deep .el-tree-node:before {
  content: '';
  left: -4px;
  position: absolute;
  right: auto;
  border-width: 1px;
}

.tree ::v-deep.el-tree-node:after {
  content: '';
  left: -4px;
  position: absolute;
  right: auto;
  border-width: 1px;
}
.tree ::v-deep .el-tree-node__expand-icon.is-leaf {
  display: none;
}

.tree ::v-deep .el-tree-node:before {
  border-left: 1px dashed #b8b9bb;
  // overflow: auto !important;
  bottom: 0px;
  height: 100%;
  top: -26px;
  width: 1px;
}

.tree ::v-deep .el-tree-node:after {
  border-top: 1px dashed #b8b9bb;
  height: 20px;
  top: 12px;
  width: 24px;
}
.tree ::v-deep .el-tree {
  background-color: transparent;
}

.content_input ::v-deep .el-radio {
  margin-right: 0px;
}
.content_input ::v-deep .el-date-editor {
  display: flex;
  flex: 1;
}

.custom-tree-dark:hover span {
  display: none;
}

.new_emial_notice ::v-deep .el-form-item {
  margin-bottom: 0px;
}

// .tree ::v-deep .el-icon-caret-right:before{
//   background-color: #2C76D1;
//   content: "\e791"
// }
// .tree ::v-deep .el-icon-minus:before{
//   background-color: #2C76D1
// }
// .tree ::v-deep .el-icon-plus:before{
//   background-color: #2C76D1
// }

// el-icon-minus
</style>
