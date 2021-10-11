<template>
  <div>
    <el-tabs
      v-model="tabActiveName"
      class="custom-main-tabs"
      @tab-click="tabClick"
    >
      <el-tab-pane
        v-if="checkPermission(gripUserPermission)"
        label="场务用户管理"
        name="gripMgt"
      >
        <div class="main-body">
          <div class="main-body-top">
            <el-form
              ref="searchForm"
              :model="mainObj.searchForm"
              label-width="75px"
              label-position="left"
              inline
            >
              <el-form-item label="用户名" prop="loginName">
                <el-input
                  v-model.trim="mainObj.searchForm.loginName"
                  v-limitBytes="20"
                  clearable
                />
              </el-form-item>
              <el-form-item label="用户角色" label-width="75px" prop="type">
                <el-select
                  v-model="mainObj.searchForm.commonRoleType"
                  placeholder="请选择"
                  clearable
                >
                  <el-option
                    v-for="item in roleTypeList"
                    :key="item.code"
                    :label="item.text"
                    :value="item.name"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="部门" prop="userDepartment">
                <el-select
                  v-model="mainObj.searchForm.userDepartment"
                  placeholder
                  clearable
                  @change="changeDepartment"
                >
                  <el-option
                    v-for="item in userDepartmentList"
                    :key="item.code"
                    :label="item.text"
                    :value="item.code"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="小组" prop="group">
                <el-select
                  v-model="mainObj.searchForm.userTeam"
                  placeholder
                  filterable
                  clearable
                  @change="changeGroupOption"
                >
                  <el-option
                    v-for="item in groupOptionList"
                    :key="item.code"
                    :label="item.text"
                    :value="item.code"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="用户状态" label-width="75px" prop="status">
                <el-select
                  v-model="mainObj.searchForm.userStatus"
                  placeholder="--全部--"
                  clearable
                >
                  <el-option
                    v-for="item in userStatusList"
                    :key="item.name"
                    :label="item.text"
                    :value="item.name"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  size="mini"
                  @click="onSearch"
                >筛选</el-button>
                <el-button size="mini" @click="onReset">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="main-body-bottom">
            <div v-if="showAdd" class="main-body-bottom-btn">
              <div class="main-body-bottom-btn-left">
                <el-button
                  type="primary"
                  icon="el-icon-circle-plus el-icon--right"
                  @click="onOperate('add')"
                >新增</el-button>
                <el-button
                  type="primary"
                  icon="el-icon-setting el-icon--right"
                  @click="onOperate('batchControl')"
                >批量权限配置</el-button>
              </div>
            </div>
            <div class="table">
              <el-table
                :data="mainObj.list"
                fit
                stripe
                border
                highlight-current-row
              >
                <el-table-column
                  show-overflow-tooltip
                  prop="loginName"
                  label="用户名"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="roleType.text"
                  label="用户角色"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="userStatus.text"
                  label="用户状态"
                >
                  <template slot-scope="scope">
                    <span
                      v-if="scope.row.userStatus.text === '锁定'"
                      style="color: #f66c6c"
                    >锁定</span>
                    <span
                      v-else-if="scope.row.userStatus.text === '禁用'"
                      style="color: #a5a4a1"
                    >禁用</span>
                    <span v-else style="color: #0abc6f">正常</span>
                  </template>
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="userDepartment"
                  label="部门"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="userTeam"
                  label="小组"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="userSupervisor"
                  label="上属主管"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="phoneNo"
                  label="手机"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="lastMntTs"
                  label="更新时间"
                />
                <el-table-column label="操作" width="300">
                  <template slot-scope="scope">
                    <el-button
                      v-preventReClick
                      type="text"
                      :disabled="
                        scope.row.userStatus.text === '禁用' ||
                          scope.row.userStatus.text === '锁定' ||
                          scope.row.loginName === name
                          ? true
                          : false
                      "
                      @click="onOperate('modify', scope.row)"
                    >修改</el-button>
                    <el-divider direction="vertical" />
                    <el-button
                      type="text"
                      @click="onOperate('view', scope.row)"
                    >查看</el-button>
                    <el-divider direction="vertical" />
                    <el-button
                      v-preventReClick
                      type="text"
                      :disabled="
                        scope.row.userStatus.text === '禁用' ||
                          scope.row.loginName === name
                      "
                      @click="onOperate('resetPass', scope.row)"
                    >密码重置</el-button>
                    <el-divider direction="vertical" />
                    <el-button
                      v-preventReClick
                      type="text"
                      :disabled="
                        scope.row.userStatus.text === '禁用' ||
                          scope.row.userStatus.text === '锁定' ||
                          scope.row.loginName === name
                          ? true
                          : false
                      "
                      @click="onOperate('control', scope.row)"
                    >权限配置</el-button>
                    <el-divider direction="vertical" />
                    <el-button
                      v-preventReClick
                      type="text"
                      :disabled="
                        scope.row.userStatus.text === '锁定' ||
                          scope.row.loginName === name
                      "
                      @click="onOperate('disabled', scope.row)"
                    >{{
                      scope.row.userStatus.text === '禁用' ? '激活' : '禁用'
                    }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="pagination">
              <el-pagination
                :current-page="mainObj.currentPage"
                :page-size="mainObj.pageSize"
                :page-sizes="mainObj.pagesizes"
                :total="mainObj.total"
                layout="total, sizes, prev, pager, next, jumper"
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane
        v-if="checkPermission(departmentPermission)"
        label="部门管理"
        name="departmentMgt"
      >
        <Department ref="departmentComponent" />
      </el-tab-pane>
      <el-tab-pane
        v-if="checkPermission(groupPermission)"
        label="小组管理"
        name="groupMgt"
      >
        <Group ref="groupComponent" />
      </el-tab-pane>
    </el-tabs>
    <!-- 用户新增/编辑弹窗 -->
    <el-dialog
      :title="userDialogObj.title"
      :visible.sync="userDialogObj.visible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      destroy-on-close
      width="678px"
      @close="userDialogObj.visible = false"
    >
      <el-form
        ref="userForm"
        class="user-dialog"
        :model="userDialogObj.form"
        :rules="userDialogObj.type === 'view' ? null : userDialogObj.rules"
        :disabled="userDialogObj.type === 'view'"
        label-width="160px"
        label-position="left"
      >
        <el-form-item label="用户名" prop="loginName">
          <el-input
            v-model="userDialogObj.form.loginName"
            v-limitBytes="20"
            placeholder="请输入用户名"
            :disabled="userDialogObj.type !== 'add'"
            clearable
          />
        </el-form-item>
        <el-form-item label="姓名" prop="sName">
          <el-input
            v-model="userDialogObj.form.sName"
            v-limitBytes="90"
            placeholder="请输入姓名"
            clearable
          />
        </el-form-item>
        <el-form-item label="座机" :required="userDialogObj.type !== 'view'">
          <el-row>
            <el-col :span="6">
              <el-form-item>
                <el-input
                  v-model="userDialogObj.form.telNoAreaCode"
                  v-limitBytes="50"
                  placeholder="区号"
                />
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item prop="telNo" class="ml10">
                <el-input
                  v-model="userDialogObj.form.telNo"
                  v-limitBytes="200"
                  placeholder="请输入地方号码"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="手机号码" :required="userDialogObj.type !== 'view'">
          <el-row>
            <el-col :span="6">
              <el-form-item>
                <el-select
                  v-model="userDialogObj.form.phoneNoAreaCode"
                  placeholder="+86"
                >
                  <el-option
                    v-for="(item, index) in phoneCode"
                    :key="index"
                    :label="'+' + item.prefix"
                    :value="item.prefix"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item prop="phoneNo" class="ml10">
                <el-input
                  v-model="userDialogObj.form.phoneNo"
                  placeholder="请输入手机号码"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input
            v-model="userDialogObj.form.email"
            v-limitBytes="500"
            placeholder="请输入邮箱"
            clearable
          />
        </el-form-item>
        <el-form-item label="用户角色" prop="roleType">
          <el-select
            v-model="userDialogObj.form.roleType"
            placeholder="请选择用户角色"
            :disabled="userDialogObj.type !== 'add'"
            @change="selectRoleType"
          >
            <el-option
              v-for="item in roleTypeList"
              :key="item.name"
              :label="item.text"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否设为审核联系人" prop="auditContactFlag">
          <!-- <el-radio-group v-model="userDialogObj.form.auditContactFlag">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group> -->
          <el-select
            v-model="userDialogObj.form.auditContactFlag"
            placeholder="请选择"
          >
            <el-option label="是" :value="true" />
            <el-option label="否" :value="false" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="userDepartment">
          <el-select
            v-model="userDialogObj.form.userDepartment"
            placeholder="请选择部门"
            :disabled="userInfo.roleType.name === 'GRIP_ADMINISTRATOR'"
            @change="selectDepartment"
          >
            <el-option
              v-for="item in userDepartmentList"
              :key="item.code"
              :label="item.text"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="小组" prop="userTeam">
          <el-select
            v-model="userDialogObj.form.userTeam"
            placeholder="请选择小组"
            multiple
            @change="$forceUpdate()"
          >
            <el-option
              v-for="item in userDialogObj.userGroupList"
              :key="item.code"
              :label="item.text"
              :value="item.code"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="userDialogObj.type !== 'add'"
          label="用户状态"
          prop="userStatus.text"
        >
          <el-select
            v-model="userDialogObj.form.userStatus.text"
            placeholder="暂无"
            disabled
          >
            <el-option
              v-for="item in userStatusList"
              :key="item.name"
              :label="item.text"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="上属主管" prop="userSupervisor">
          <el-select
            v-model="userDialogObj.form.userSupervisor"
            placeholder="请选择上属主管"
            @change="selectSupervisor"
          >
            <el-option
              v-for="item in userSupervisor"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div
        v-if="userDialogObj.type !== 'view'"
        slot="footer"
        class="dialog-footer"
      >
        <span slot="footer">
          <el-button
            v-preventReClick
            type="primary"
            class="button-primary"
            @click="onOperate('submit')"
          >确定</el-button>
          <el-button
            class="button-default"
            @click="onOperate('closeUserDialog')"
          >取消</el-button>
        </span>
      </div>
    </el-dialog>
    <!-- 权限选择弹窗 -->
    <el-dialog
      class="autho-dialog"
      :close-on-click-modal="false"
      :title="authoDialogObj.title"
      :visible.sync="authoDialogObj.visible"
      :modal-append-to-body="false"
      width="700px"
      destroy-on-close
      @close="closeAuthoDialog"
    >
      <div class="autho-descri">
        <span
          class="autho-descrip"
        >权限说明:
          勾选某个权限或多个权限之后，该场务端登录用户在场务管理菜单下可以看到所勾选的权限子功能，未勾选的功能无法看到;</span>
      </div>
      <div class="autho-tree">
        <div class="tree-container">
          <el-tree
            ref="tree"
            class="tree"
            node-key="id"
            :indent="0"
            default-expand-all
            show-checkbox
            :data="authoDialogObj.tree"
            :default-expanded-keys="authoDialogObj.expandedKeys"
            :default-checked-keys="authoDialogObj.checkedKeys"
            :props="authoDialogObj.defaultProps"
          />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <span slot="footer">
          <el-button
            v-preventReClick
            type="primary"
            class="button-primary"
            @click="onOperate('submitAutho')"
          >保存</el-button>
          <el-button
            class="button-default"
            @click="onOperate('cancleSubmitAutho')"
          >取消</el-button>
        </span>
      </div>
    </el-dialog>
    <!-- 重置密码弹窗 -->
    <el-dialog
      class="reset-pass-dailog"
      :close-on-click-modal="false"
      :title="passDialogObj.title"
      :visible.sync="passDialogObj.visible"
      :modal-append-to-body="false"
      width="600px"
      destroy-on-close
    >
      <el-form
        ref="dialogForm"
        :model="passDialogObj.form"
        label-width="60px"
        label-position="left"
        inline
      >
        <div>
          <div class="reset-pass">
            <img src="@/assets/icon/reset-pass-icon.png" alt="">
            <div style="height: 36px; line-height: 36px; margin-left: 10px">
              确定将
              <span style="color: #2c76d1">{{
                passDialogObj.form.loginName
              }}</span>
              用户的密码重置为
              <span style="color: #2c76d1">88888888</span>
              吗？
            </div>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <span slot="footer">
          <el-button
            v-preventReClick
            type="primary"
            class="button-primary"
            @click="onOperate('submitResetPass')"
          >确定</el-button>
          <el-button
            class="button-default"
            @click="passDialogObj.visible = false"
          >取消</el-button>
        </span>
      </div>
    </el-dialog>

    <!--批量权限配置-->
    <el-dialog
      class="reset-pass-dailog"
      :close-on-click-modal="false"
      title="批量权限配置"
      :visible.sync="permissionBatchMgtDialog.visible"
      :modal-append-to-body="false"
      width="800px"
      destroy-on-close
    >
      <div class="grid-user-group">
        <el-col>
          <h3>选择场务用户</h3>
        </el-col>
        <el-row :gutter="5">
          <el-col :span="16" class="search-input-col">
            <el-input
              v-model="permissionBatchMgtDialog.searchKey"
              placeholder="可搜索部门、小组、人员"
            />
          </el-col>
          <el-col :span="8">
            <el-button
              type="primary"
              size="mini"
              @click="loadGripUserTreeData"
            >搜索</el-button>
          </el-col>
        </el-row>
        <div class="tree-container">
          <el-tree
            ref="gridUserTreeRef"
            :data="permissionBatchMgtDialog.gridUserTreeData"
            :props="permissionBatchMgtDialog.gridProps"
            :indent="0"
            show-checkbox
            node-key="id"
            highlight-current
            class="tree"
          >
            <span slot-scope="{node}" class="span-ellipsis">
              <span :title="node.label">{{ node.label }}</span>
            </span>
          </el-tree>
        </div>
      </div>
      <div class="grid-permission-group">
        <h3>权限勾选</h3>
        <div class="tree-container">
          <el-tree
            ref="auditTreeRef"
            :data="permissionBatchMgtDialog.auditTreeData"
            :props="permissionBatchMgtDialog.auditProps"
            :indent="0"
            show-checkbox
            default-expand-all
            node-key="id"
            highlight-current
            class="tree"
          />
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <span slot="footer">
          <el-button
            v-preventReClick
            type="primary"
            class="button-primary"
            @click="savePermissionBatchData"
          >确定</el-button>
          <el-button
            class="button-default"
            @click="permissionBatchMgtDialog.visible = false"
          >取消</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import gripManageApi from '@/api/gripManageApi'
import { getUserStatus } from '@/api/common'
import Department from './department-manage'
import Group from './group-manage'
import { mapGetters } from 'vuex'
import { isNull } from '@/utils/index.js'
import { prefixDefault } from '@/utils/prefix'
import { validSname } from '@/utils/validate'
import {
  // validPassword,
  validEmail,
  validTelephoneArea,
  validPhone,
  validUsername
  // validSingleTel
} from '@/utils/validate'
import checkPermission from '@/utils/permission'

const defaultUserForm = {
  loginName: '',
  loginPwd: '',
  phoneNo: '',
  roleType: '',
  auditContactFlag: false,
  userStatus: '',
  phoneNoAreaCode: '86',
  telNoAreaCode: '',
  userType: '',
  sName: '',
  telNo: '',
  email: '',
  userDepartment: '',
  userSupervisor: '',
  userTeam: []
}
export default {
  name: 'MemberManage',
  components: {
    Department,
    Group
  },
  data() {
    const validateSname = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('姓名不能为空'))
      } else if (!validSname(value)) {
        callback(new Error('仅支持中英文、数字和特殊字符'))
      } else {
        callback()
      }
    }
    const validateUsername = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else {
        if (!validUsername(value)) {
          callback(new Error('仅支持数字和大小写字母'))
        }
        callback()
      }
    }
    // const validatePass = (rule, value, callback) => {
    //   if (isNull(value)) {
    //     callback(new Error('请输入密码'))
    //   } else {
    //     if (!validPassword(value)) {
    //       callback(new Error('8-16位密码，同时要有大小写字母，数字，符号'))
    //     }
    //     callback()
    //   }
    // }
    const validatePhone = (rule, value, callback) => {
      if (isNull(value)) {
        callback(new Error('请输入手机号'))
      } else if (!validPhone(value)) {
        callback(new Error('手机号码格式不正确'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (isNull(value)) {
        callback(new Error('请输入邮箱'))
      } else if (!validEmail(value)) {
        callback(new Error('邮箱格式不正确'))
      } else {
        callback()
      }
    }
    // const validateTelNo = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('不能为空'))
    //   } else {
    //     if (!validSingleTel(value)) {
    //       callback(new Error('电话格式不正确'))
    //     }
    //     callback()
    //   }
    // }
    const validateTelNoAreaCode = (rule, value, callback) => {
      if (isNull(value)) {
        callback(new Error('请输入区号'))
      } else if (!validTelephoneArea(value)) {
        callback(new Error('区号格式不正确'))
      } else {
        callback()
      }
    }
    return {
      gripUserPermission: ['GRIP_gripMgtUser'],
      departmentPermission: ['GRIP_departmentMgt'],
      groupPermission: ['GRIP_teamMgt'],
      showAdd: false,
      showAuditBtn: true,
      showDetailBtn: true,
      disableUserId: '',
      tabActiveName: 'gripMgt',
      mainObj: {
        list: [],
        pageSize: 20,
        pagesizes: [20, 50, 100],
        currentPage: 1,
        total: 0,
        searchForm: {
          userStatus: null,
          commonRoleType: '',
          userDepartment: '',
          userTeam: '',
          loginName: ''
        },
        userDepartmentCode: '' // 用于列表修改按钮权限判断
      },
      userDialogObj: {
        visible: false,
        tile: '',
        type: '',
        userDepartment: '',
        form: Object.assign({}, defaultUserForm),
        rules: {
          loginName: [
            { required: true, validator: validateUsername, trigger: 'blur' }
          ],
          roleType: [
            { required: true, message: '不能为空！', trigger: 'blur' }
          ],
          auditContactFlag: [
            { required: true, message: '不能为空！', trigger: 'blur' }
          ],
          userDepartment: [
            { required: true, message: '不能为空！', trigger: 'blur' }
          ],
          userSupervisor: [
            { required: true, message: '不能为空！', trigger: 'blur' }
          ],
          sName: [
            // { required: true, message: '不能为空！', trigger: 'blur' }
            { required: true, validator: validateSname, trigger: 'blur' }
          ],
          userType: [
            { required: true, message: '不能为空！', trigger: 'blur' }
          ],
          telNo: [
            // { required: true, validator: validateTelNo, trigger: 'blur' },
            { required: true, message: '不能为空！', trigger: 'blur' }
          ],
          telNoAreaCode: [
            {
              required: true,
              validator: validateTelNoAreaCode,
              trigger: 'blur'
            }
          ],
          phoneNo: [
            { required: true, validator: validatePhone, trigger: 'blur' },
            { required: true, message: '不能为空！', trigger: 'blur' }
          ],
          email: [
            { required: true, validator: validateEmail, trigger: 'blur' },
            { required: true, message: '不能为空！', trigger: 'blur' }
          ]
        },
        userGroupList: []
      },
      authoDialogObj: {
        visible: false,
        expandedKeys: [],
        checkedKeys: [],
        initPermList: '',
        permList: [],
        form: {},
        defaultProps: {
          children: 'subPermDetailDtoList',
          label: 'permName'
        }
      },
      passDialogObj: {
        visible: false,
        form: {
          id: '',
          newPass: ''
        }
      },
      permissionBatchMgtDialog: {
        visible: false,
        searchKey: '',
        gridUserTreeData: [],
        gridProps: {
          children: 'childrenList',
          label: 'name'
        },
        auditTreeData: [],
        auditProps: {
          children: 'subPermDetailDtoList',
          label: 'permName'
        }
      },
      userStatusList: [],
      roleTypeList: [],
      userDepartmentList: [],
      groupOptionList: [],
      phoneCode: prefixDefault,
      userAuthority: '',
      userSupervisor: '',
      dialogObj: {
        visible: false,
        modifyVisible: false,
        viewVisible: false,
        resetPassVisible: false,
        title: '',
        form: {
          userStatus: '',
          phoneNo: '',
          email: ''
        },
        errorData: {
          phoneNo: '',
          email: ''
        }
      }
    }
  },
  computed: {
    ...mapGetters(['name', 'userInfo'])
  },
  created() {
    this.getActiveTabNameAndInit()
    this.getLoginUser()
    this.getUserStatus()
    this.getRoleType()
  },
  methods: {
    checkPermission,
    getActiveTabNameAndInit() {
      if (this.checkPermission(this.gripUserPermission)) {
        this.tabActiveName = 'gripMgt'
        this.loadDepartmentOptions()
        this.loadGroupOptionsInMain(' ')
        this.fetchData()
      } else if (this.checkPermission(this.departmentPermission)) {
        this.tabActiveName = 'departmentMgt'
      } else if (this.checkPermission(this.groupPermission)) {
        this.tabActiveName = 'groupMgt'
      }
    },
    getLoginUser() {
      gripManageApi.getLoginUser().then((res) => {
        if (res.code === 'ACK') {
          if (
            res.data.roleType.text === '超级管理员' ||
            res.data.roleType.text === '场务端管理员'
          ) {
            this.showAdd = true
          }
        }
      })
    },
    resetForm(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
      })
    },
    validTelArea(str) {
      var reg = /\b0\d{2,3}\b/
      return reg.test(str)
    },
    getUserStatus() {
      getUserStatus().then((res) => {
        this.userStatusList = res.data.filter(e => !['00', '01', '10'].includes(e.code))
      })
    },
    selectRoleType(val) {
      this.userDialogObj.form.userSupervisor = ''
      const params = {
        department: this.userDialogObj.form.userDepartment,
        roleCode: val
      }
      gripManageApi.gripUserSupervisor(params).then((res) => {
        this.userSupervisor = res.data
      })
    },
    // 新增用户窗口 改变部门下拉框
    selectDepartment(val) {
      this.userDialogObj.form.userSupervisor = ''
      this.userDialogObj.form.userDepartment = val
      const params = {
        department: val,
        roleCode: this.userDialogObj.form.roleType.name
      }
      gripManageApi.gripUserSupervisor(params).then((res) => {
        this.userSupervisor = res.data
      })

      // 清空已选的小组
      this.userDialogObj.form.userTeam = []
      this.loadGroupOptions(val)
    },
    // 在筛选区域 改变部门下拉框
    async changeDepartment(val) {
      this.mainObj.searchForm.userTeam = ''
      this.groupOptionList = []
      if (val) {
        this.loadGroupOptionsInMain(val)
      } else {
        this.loadGroupOptionsInMain(' ')
      }
    },
    changeGroupOption(val) {
      if (val) {
        const group = this.groupOptionList.find(o => o.code === val)
        const department = this.userDepartmentList.find(o => o.code === group.name)
        if (department) {
          this.mainObj.searchForm.userDepartment = department.code
        }
      }
    },
    selectUserStatus(val) {
      this.userDialogObj.form.userStatus = val
    },
    selectSupervisor(val) {
      this.userDialogObj.form.userSupervisor = val
    },
    onSearch() {
      this.mainObj.currentPage = 1
      this.fetchData()
    },
    getRoleType() {
      if (this.userInfo.roleType.name === 'GRIP_ADMINISTRATOR') {
        gripManageApi.getCurrentDepart().then((res) => {
          if (res.code === 'ACK') {
            this.userDialogObj.userDepartment = res.data.code
            this.mainObj.userDepartmentCode = res.data.code
          }
        })
      }
      gripManageApi.gripUserRole().then((res) => {
        if (res.code === 'ACK') {
          this.roleTypeList = res.data
        }
      })
    },
    /** 递归tree全展开
     */
    expandAll(data) {
      data.forEach((e) => {
        if (
          e.subPermDetailDtoList &&
          e.subPermDetailDtoList.length > 0 &&
          e.subPermDetailDtoList[0].subPermDetailDtoList
        ) {
          this.authoDialogObj.expandedKeys.push(e.id)
          this.expandAll(e.subPermDetailDtoList)
        }
      })
    },
    // 获取用户已经选中的权限
    async getUserAuthority(params) {
      await gripManageApi.getUserAuthority(params).then((res) => {
        if (res.code === 'ACK') {
          this.initPermList = res.data
        }
      })
    },
    /** 递归tree获取已选列表
     */
    getCheckedKeys(data) {
      data.forEach((e) => {
        if (e.subPermDetailDtoList && e.subPermDetailDtoList.length > 0) {
          this.getCheckedKeys(e.subPermDetailDtoList)
        } else {
          this.initPermList.forEach((item) => {
            if (item === e.id) {
              this.authoDialogObj.checkedKeys.push(e.id)
            }
          })
        }
      })
    },
    /** 递归删除叶子节点
     */
    removeLeafNodes(data) {
      const newData = data.filter((e) => {
        return e.leafFlag.name === 'NO'
      })
      newData.forEach((e) => {
        e.subPermDetailDtoList &&
          (e.subPermDetailDtoList = this.removeLeafNodes(
            e.subPermDetailDtoList
          ))
      })
      return newData
    },
    async onOperate(type, row) {
      if (type === 'add') {
        this.userDialogObj.visible = true
        this.userDialogObj.type = type
        this.userDialogObj.title = '新增用户'
        this.userDialogObj.form = Object.assign({}, defaultUserForm, {
          userDepartment: this.userDialogObj.userDepartment
        })
        this.userDialogObj.userGroupList = []
        // 超级管理员userDepartment没有初始值，不需要初始化小组下拉列表
        if (this.userDialogObj.userDepartment) {
          this.loadGroupOptions(this.userDialogObj.userDepartment)
        }
        this.$nextTick(() => {
          this.$refs.userForm.clearValidate()
        })
        // this.resetForm('userForm')
      } else if (type === 'modify') {
        this.userDialogObj.title = '修改'
        this.userDialogObj.type = type
        const params = {
          userId: row.id
        }
        gripManageApi.getUserInfoById(params).then((res) => {
          if (res.code === 'ACK') {
            this.userDialogObj.form = JSON.parse(JSON.stringify(res.data))
            this.userDialogObj.form.userTeam = this.userDialogObj.form.userTeamList
            this.userSupervisor = res.data.userSupervisorList
            if (
              this.userInfo.roleType.code.indexOf('grip') > -1 ||
              this.userInfo.roleType.code === 'super-admin'
            ) {
              this.userDialogObj.form.roleType = this.userDialogObj.form.roleType.text
            }
            this.loadGroupOptions(this.userDialogObj.form.userDepartment)
            this.userDialogObj.visible = true
          }
        })
      } else if (type === 'view') {
        this.userDialogObj.title = '查看'
        this.userDialogObj.type = type
        const params = {
          userId: row.id
        }
        gripManageApi.getUserInfoById(params).then((res) => {
          if (res.code === 'ACK') {
            this.userDialogObj.form = JSON.parse(JSON.stringify(res.data))
            this.userDialogObj.form.userTeam = this.userDialogObj.form.userTeamList
            this.userSupervisor = res.data.userSupervisorList
            if (
              this.userInfo.roleType.code.indexOf('grip') > -1 ||
              this.userInfo.roleType.code === 'super-admin'
            ) {
              this.userDialogObj.form.roleType = this.userDialogObj.form.roleType.text
            }
            this.loadGroupOptions(this.userDialogObj.form.userDepartment)
            this.userDialogObj.visible = true
          }
        })
      } else if (type === 'submit') {
        this.$refs.userForm.validate((valid) => {
          if (valid) {
            const params = {
              email: this.userDialogObj.form.email,
              loginName: this.userDialogObj.form.loginName,
              phoneNo: this.userDialogObj.form.phoneNo,
              phoneNoAreaCode: this.userDialogObj.form.phoneNoAreaCode,
              auditContactFlag: this.userDialogObj.form.auditContactFlag,
              roleIdList: this.userDialogObj.form.roleIdList,
              roleType: this.userDialogObj.form.roleType,
              sName: this.userDialogObj.form.sName,
              telNo: this.userDialogObj.form.telNo,
              telNoAreaCode: this.userDialogObj.form.telNoAreaCode,
              userDepartment: this.userDialogObj.form.userDepartment,
              userSupervisor: this.userDialogObj.form.userSupervisor,
              userTeam: this.userDialogObj.form.userTeam.join(',')
            }
            if (this.userDialogObj.type === 'modify') {
              params.id = this.userDialogObj.form.id
              params.userInnerType = this.userDialogObj.form.userInnerType.name
              params.userStatus = this.userDialogObj.form.userStatus.name
            }
            gripManageApi
              .gripUserSave(params, this.userDialogObj.type)
              .then((res) => {
                if (res.code === 'ACK') {
                  this.$message({
                    type: 'success',
                    message: res.message
                  })
                  this.fetchData()
                  this.userDialogObj.visible = false
                } else if (res.code === 'VALIDATION') {
                  // 后端验证
                  if ('loginName' in res.data) {
                    this.$refs['userForm'].fields.find(
                      (item) => item.prop === 'loginName'
                    ).validateState = 'error'
                    this.$refs['userForm'].fields.find(
                      (item) => item.prop === 'loginName'
                    ).validateMessage = res.data.loginName
                  }
                  if ('sName' in res.data) {
                    this.$refs['userForm'].fields.find(
                      (item) => item.prop === 'sName'
                    ).validateState = 'error'
                    this.$refs['userForm'].fields.find(
                      (item) => item.prop === 'sName'
                    ).validateMessage = res.data.sName
                  }
                  if ('telNoAreaCode' in res.data) {
                    this.$refs['userForm'].fields.find(
                      (item) => item.prop === 'telNoAreaCode'
                    ).validateState = 'error'
                    this.$refs['userForm'].fields.find(
                      (item) => item.prop === 'telNoAreaCode'
                    ).validateMessage = res.data.telNoAreaCode
                  }
                  if ('telNo' in res.data) {
                    this.$refs['userForm'].fields.find(
                      (item) => item.prop === 'telNo'
                    ).validateState = 'error'
                    this.$refs['userForm'].fields.find(
                      (item) => item.prop === 'telNo'
                    ).validateMessage = res.data.telNo
                  }
                  if ('phoneNo' in res.data) {
                    this.$refs['userForm'].fields.find(
                      (item) => item.prop === 'phoneNo'
                    ).validateState = 'error'
                    this.$refs['userForm'].fields.find(
                      (item) => item.prop === 'phoneNo'
                    ).validateMessage = res.data.phoneNo
                  }
                  if ('email' in res.data) {
                    this.$refs['userForm'].fields.find(
                      (item) => item.prop === 'email'
                    ).validateState = 'error'
                    this.$refs['userForm'].fields.find(
                      (item) => item.prop === 'email'
                    ).validateMessage = res.data.email
                  }
                  if ('roleType' in res.data) {
                    this.$refs['userForm'].fields.find(
                      (item) => item.prop === 'roleType'
                    ).validateState = 'error'
                    this.$refs['userForm'].fields.find(
                      (item) => item.prop === 'roleType'
                    ).validateMessage = res.data.roleType
                  }
                  if ('userDepartment' in res.data) {
                    this.$refs['userForm'].fields.find(
                      (item) => item.prop === 'userDepartment'
                    ).validateState = 'error'
                    this.$refs['userForm'].fields.find(
                      (item) => item.prop === 'userDepartment'
                    ).validateMessage = res.data.userDepartment
                  }
                  if ('userSupervisor' in res.data) {
                    this.$refs['userForm'].fields.find(
                      (item) => item.prop === 'userSupervisor'
                    ).validateState = 'error'
                    this.$refs['userForm'].fields.find(
                      (item) => item.prop === 'userSupervisor'
                    ).validateMessage = res.data.userSupervisor
                  }
                }
              })
          }
        })
      } else if (type === 'closeUserDialog') {
        this.userDialogObj.visible = false
      } else if (type === 'control') {
        const params = {
          userId: row.id
        }
        await this.getUserAuthority(params)
        await gripManageApi.getInitPermByUser(params).then((res) => {
          if (res.code === 'ACK') {
            this.authoDialogObj.permList = res.data
            this.authoDialogObj.tree = res.data
            this.removeLeafNodes(res.data)
            this.expandAll(this.authoDialogObj.tree)
            this.getCheckedKeys(this.authoDialogObj.tree)
          }
        })
        this.authoDialogObj.visible = true
        this.authoDialogObj.title = '权限配置'
        this.authoDialogObj.type = type
        this.authoDialogObj.form.id = row.id
      } else if (type === 'submitAutho') {
        const checkedKeys = this.$refs.tree.getCheckedKeys()
        // const halfCheckedKeys = this.$refs.tree.getHalfCheckedKeys()
        // checkedKeys.push(...halfCheckedKeys)
        const params = {
          userId: this.authoDialogObj.form.id,
          permIdList: checkedKeys
        }
        gripManageApi.saveUserAuthority(params).then((res) => {
          if (res.code === 'ACK') {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.authoDialogObj.visible = false
            this.initPermList = []
            this.authoDialogObj.checkedKeys = []
            this.$refs.tree.setCheckedKeys([])
            this.fetchData()
          }
        })
      } else if (type === 'cancleSubmitAutho') {
        this.authoDialogObj.visible = false
        this.initPermList = []
        this.authoDialogObj.checkedKeys = []
        this.$refs.tree.setCheckedKeys([])
      } else if (type === 'resetPass') {
        this.passDialogObj.form.id = row.id
        this.passDialogObj.visible = true
        this.passDialogObj.title = '重置密码'
        this.passDialogObj.type = type
        this.passDialogObj.form = JSON.parse(JSON.stringify(row))
      } else if (type === 'submitResetPass') {
        const params = {
          userId: this.passDialogObj.form.id,
          password: this.passDialogObj.form.newPass
        }
        gripManageApi.gripResetPwd(params).then((res) => {
          if (res.code === 'ACK') {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.fetchData()
            this.passDialogObj.visible = false
          }
        })
      } else if (type === 'disabled') {
        const params = {
          userId: row.id
        }
        if (row.userStatus.text === '禁用') {
          gripManageApi.gripEnableUser(params).then((res) => {
            if (res.code === 'ACK') {
              this.$message({
                type: 'success',
                message: res.message
              })
              this.fetchData()
            }
          })
        } else {
          this.$confirm('确定禁用该用户吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              gripManageApi.gripDisableUser(params).then((res) => {
                if (res.code === 'ACK') {
                  this.$message({
                    type: 'success',
                    message: res.message
                  })
                  this.fetchData()
                }
              })
            })
            .catch(() => {})
        }
      } else if (type === 'batchControl') {
        this.loadGripUserTreeData()
        const result = await gripManageApi.getInitPermByUser({ userId: '' })
        this.permissionBatchMgtDialog.auditTreeData = result.data
        console.log(result)
        this.permissionBatchMgtDialog.visible = true
      }
    },
    closeAuthoDialog() {
      this.authoDialogObj.visible = false
      this.initPermList = []
      this.authoDialogObj.checkedKeys = []
      this.$refs.tree.setCheckedKeys([])
    },
    onReset() {
      if (this.$refs['searchForm']) {
        this.$refs['searchForm'].resetFields()
      }
      this.mainObj.searchForm.commonRoleType = ''
      this.mainObj.searchForm.userStatus = ''
      this.mainObj.searchForm.userTeam = ''
      this.fetchData()
    },
    handleSizeChange(val) {
      this.mainObj.pageSize = val
      this.mainObj.currentPage = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.mainObj.currentPage = val
      this.fetchData()
    },
    fetchData() {
      const params = {
        roleType: this.mainObj.searchForm.commonRoleType || null,
        userStatus: this.mainObj.searchForm.userStatus,
        loginName: this.mainObj.searchForm.loginName,
        userDepartment: this.mainObj.searchForm.userDepartment,
        userTeam: this.mainObj.searchForm.userTeam,
        page: this.mainObj.currentPage,
        pageSize: this.mainObj.pageSize
      }
      gripManageApi.gripUserInfo(params).then((res) => {
        if (res.code === 'ACK') {
          this.mainObj.list = res.data.list
          this.mainObj.total = res.data.totalRecord
        }
      })
    },
    async loadDepartmentOptions() {
      const result = await gripManageApi.getAllDepartmentFromUser()
      this.userDepartmentList = result.data
    },
    // 新增dialog中获取小组数据
    async loadGroupOptions(id) {
      const result = await gripManageApi.getGroupListByDepartmentId({
        departmentId: id
      })
      this.userDialogObj.userGroupList = result.data
    },
    async loadGroupOptionsInMain(id) {
      const result = await gripManageApi.getGroupListByDepartmentId({
        departmentId: id
      })
      this.groupOptionList = result.data
    },
    async loadGripUserTreeData() {
      const result = await gripManageApi.getGripUserTree({
        seachKey: this.permissionBatchMgtDialog.searchKey
      })
      if (result.code === 'ACK') {
        this.permissionBatchMgtDialog.gridUserTreeData = result.data
      }
    },
    async savePermissionBatchData() {
      const data = {
        permIdList: this.$refs.auditTreeRef.getCheckedKeys(),
        userIdList: this.$refs.gridUserTreeRef
          .getCheckedNodes(true)
          .filter((item) => item.departGroupType.name === 'USER')
          .map((item) => item.id)
      }
      const result = await gripManageApi.savePermissionBatchData(data)
      if (result.code === 'ACK') {
        this.$message.success(result.message)
        this.permissionBatchMgtDialog.visible = false
      }
    },
    tabClick(tab) {
      if (tab.name === 'gripMgt') {
        this.fetchData()
        this.loadDepartmentOptions()
        this.loadGroupOptionsInMain(' ')
      } else if (tab.name === 'groupMgt') {
        this.$refs.groupComponent.loadDepartmentOptions()
        this.$refs.groupComponent.fetchData()
      } else if (tab.name === 'departmentMgt') {
        this.$refs.departmentComponent.fetchData()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.user-dialog {
  padding: 0 60px;
  ::v-deep.el-select__tags-text{
    max-width:120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    float: left;
  }
}
.reset-pass-dailog {
  .reset-pass {
    display: flex;
    justify-content: center;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #303030;
    margin: 35px 0;
  }
  ::v-deep .el-dialog__footer {
    background-color: #fff;
    padding: 10px 20px 30px;
    text-align: center;
  }
}

.autho-descri {
  padding: 4px;
  width: 644px;
  height: 52px;
  background: rgb(246, 247, 251);
  border: 1px solid rgb(209, 213, 222);
  .autho-descrip {
    font-size: 14px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    line-height: 22px;
    color: rgb(48, 48, 48);
  }
}
.autho-tree {
  margin-top: 10px;
  width: 644px;
  // height: 477px;
  // overflow: auto;
  background: rgb(255, 255, 255);
  border: 1px solid rgb(223, 223, 223);
  .tree-container {
    margin-top: 20px;
    // height: 100%;
    ::v-deep .el-icon-caret-right:before {
      content: '';
    }
    ::v-deep .el-tree-node__expand-icon {
      padding: 0;
    }
  }
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

.grid-user-group {
  width: 340px;
  min-height: 400px;
  float: left;
  border: 1px #e7edf5 solid;
  padding-left: 10px;
  .tree-container {
    margin-top: 15px;
    ::v-deep .el-icon-caret-right:before {
      content: '';
    }
    ::v-deep .el-tree-node__expand-icon {
      padding: 0;
    }
  }
}
.grid-permission-group {
  width: 340px;
  min-height: 400px;
  float: right;
  border: 1px #e7edf5 solid;
  padding-left: 10px;
}
.tree-container {
  ::v-deep .el-icon-caret-right:before {
    content: '';
  }
  ::v-deep .el-tree-node__expand-icon {
    padding: 0;
  }
  .span-ellipsis{
    width:280px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: block;
    height: 19px;
  }
}
</style>
