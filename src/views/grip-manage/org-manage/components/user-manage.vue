<template>
  <div>
    <div class="main-body">
      <div class="main-body-top">
        <el-form
          ref="searchForm"
          :model="mainObj.searchForm"
          inline
        >
          <el-form-item label="机构名称">
            <el-input
              v-model.trim="mainObj.searchForm.cnFullName"
              v-limitBytes="300"
              clearable
            />
          </el-form-item>
          <el-form-item label="用户名">
            <el-input
              v-model.trim="mainObj.searchForm.loginName"
              v-limitBytes="300"
              clearable
            />
          </el-form-item>
          <el-form-item label="姓名">
            <el-input
              v-model.trim="mainObj.searchForm.sName"
              v-limitBytes="300"
              clearable
            />
          </el-form-item>
          <el-form-item label="用户状态">
            <el-select
              v-model="mainObj.searchForm.userStatus"
              placeholder="--全部--"
              clearable
            >
              <el-option
                v-for="item in userStatusOptions"
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
            <el-button
              size="mini"
              @click="onReset"
            >重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="main-body-bottom">
        <div class="main-body-bottom-btn">
          <div class="main-body-bottom-btn-left">
            <el-button
              type="primary"
              icon="el-icon-circle-plus el-icon--right"
              @click="onOperate('add')"
            >新增用户</el-button>
          </div>
        </div>
        <div class="table">
          <el-table
            v-loading="mainObj.loading"
            :data="mainObj.list"
            fit
            stripe
            border
            highlight-current-row
          >
            <el-table-column
              show-overflow-tooltip
              prop="cnFullName"
              label="机构名称"
              min-width="150"
            />
            <el-table-column
              show-overflow-tooltip
              prop="loginName"
              label="用户名"
              min-width="150"
            />
            <el-table-column
              show-overflow-tooltip
              prop="sName"
              label="姓名"
              min-width="100"
            />
            <el-table-column
              show-overflow-tooltip
              prop="roleType"
              label="用户角色"
              min-width="120"
            >
              <template slot-scope="scope">
                {{ scope.row.roleType ? scope.row.roleType.text : null }}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              label="用户身份"
              min-width="150"
            >
              <template slot-scope="scope">
                <span>{{ orgTypeFilter(scope.row.instnIdentity) }}</span>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="userStatus"
              label="用户状态"
              min-width="80"
            >
              <template slot-scope="scope">
                <span :style="{color: colorFilter(scope.row.userStatus)}">{{ scope.row.userStatus ? scope.row.userStatus.text : null }}</span>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="phoneNo"
              label="手机号码"
              min-width="120"
            />
            <el-table-column
              show-overflow-tooltip
              prop="lastMntTs"
              label="更新时间"
              width="160"
            />
            <el-table-column
              show-overflow-tooltip
              prop="auditLoginName"
              label="审核人"
              min-width="150"
            />
            <el-table-column
              show-overflow-tooltip
              prop="auditLastMntTs"
              label="审核时间"
              width="160"
            />
            <el-table-column
              label="操作"
              align="center"
              width="240"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  v-preventReClick
                  type="text"
                  :disabled="['15', '16'].includes(scope.row.userStatus.code)"
                  @click="onOperate('detail', scope.row)"
                >查看</el-button>
                <el-button
                  v-preventReClick
                  type="text"
                  :disabled="['00', '01', '10', '15', '16'].includes(scope.row.userStatus.code)"
                  @click="onOperate('edit', scope.row)"
                >修改</el-button>
                <el-button
                  type="text"
                  :disabled="['00', '01', '10', '15'].includes(scope.row.userStatus.code)"
                  @click="onOperate('resetPass', scope.row)"
                >密码重置</el-button>
                <el-button
                  v-preventReClick
                  type="text"
                  :disabled="['00', '01', '10', '16'].includes(scope.row.userStatus.code)"
                  @click="onOperate('disable', scope.row)"
                >{{ scope.row.userStatus && scope.row.userStatus.text === '禁用' ? '激活' : '禁用' }}</el-button>
                <el-button
                  v-preventReClick
                  type="text"
                  :disabled="scope.row.auditFlag === '1'"
                  @click="onOperate('audit', scope.row)"
                >审核</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
            :current-page="mainObj.currentPage"
            :page-sizes="[20, 50, 100]"
            :page-size="mainObj.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="mainObj.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <!-- 新增/编辑弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="userDialogObj.title"
      :visible.sync="userDialogObj.visible"
      :modal-append-to-body="false"
      width="678px"
      @close="userDialogObj.visible = false"
    >
      <el-form
        ref="userForm"
        :model="userDialogObj.form"
        :rules="userDialogObj.rules"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="用户机构" prop="agencyId">
          <el-select
            v-if="userDialogObj.type === 'add'"
            v-model="userDialogObj.form.agencyId"
            style="width: 100%;"
            filterable
            placeholder="请输入关键词"
            :disabled="userDialogObj.type !== 'add'"
            @change="onChangeOrg"
          >
            <el-option
              v-for="item in orgOptions"
              :key="item.id"
              :label="item.instnCnFullNm"
              :value="item.id"
            />
          </el-select>
          <el-input
            v-else
            v-model="userDialogObj.form.instnCnFullNm"
            disabled
          />
        </el-form-item>
        <el-form-item label="用户名" prop="loginName">
          <el-input
            v-model="userDialogObj.form.loginName"
            v-limitBytes="20"
            :disabled="userDialogObj.type !== 'add'"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="姓名" prop="sName">
          <el-input
            v-model="userDialogObj.form.sName"
            v-limitBytes="20"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="座机号码" required>
          <el-row>
            <el-col :span="6">
              <el-form-item prop="telNoAreaCode">
                <el-input
                  v-model="userDialogObj.form.telNoAreaCode"
                  placeholder="区号"
                  maxlength="4"
                />
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item prop="telNo" class="ml10">
                <el-input
                  v-model="userDialogObj.form.telNo"
                  placeholder="请输入地方号码"
                  clearable
                  maxlength="20"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="手机号码" required>
          <el-row>
            <el-col :span="6">
              <el-form-item>
                <el-select
                  v-model="userDialogObj.form.phoneNoAreaCode"
                  placeholder="+86"
                >
                  <el-option
                    v-for="(item, index) in phoneCodeOptions"
                    :key="index"
                    :label="'+'+item.prefix"
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
        <el-form-item label="电子邮箱" prop="email">
          <el-input
            v-model="userDialogObj.form.email"
            v-limitBytes="500"
            placeholder="请输入邮箱"
            clearable
          />
        </el-form-item>
        <el-form-item label="所在部门" prop="instnDepartment">
          <el-input
            v-model="userDialogObj.form.instnDepartment"
            v-limitBytes="300"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item v-if="!isNull(userDialogObj.form.agencyId)" label="用户角色" prop="roleType">
          <el-select
            v-if="userDialogObj.type !== 'edit'"
            v-model="userDialogObj.form.roleType"
            placeholder="请选择"
            @change="onChangeRoleType"
          >
            <el-option
              v-for="item in needRoleTypeOptions"
              :key="item.name"
              :label="item.text"
              :value="item.name"
            />
          </el-select>
          <el-input
            v-else
            v-model="userDialogObj.form.roleTypeObj.text"
            disabled
          />
        </el-form-item>
        <el-form-item v-if="!isNull(userDialogObj.form.agencyId) && !isNull(userDialogObj.form.roleType)" prop="instnIdentity">
          <template slot="label">
            <el-tooltip placement="bottom-start">
              <div slot="content">
                <p>系统接入开发机构与其他三个互斥</p>
              </div>
              <span>用户身份<i class="el-icon-question" /></span>
            </el-tooltip>
          </template>
          <el-checkbox-group
            v-model="userDialogObj.form.instnIdentity"
            @change="orgTypeChange"
          >
            <el-checkbox
              v-for="item in needOrgTypeOptions"
              :key="item.code"
              :label="item.code"
              :disabled="item.disabled"
            >{{ item.text }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          v-preventReClick
          type="primary"
          class="button-primary"
          @click="onOperate('submit')"
        >确定</el-button>
        <el-button
          class="button-default"
          @click="userDialogObj.visible = false"
        >取消</el-button>
      </div>
    </el-dialog>
    <!-- 查看/审核弹窗 -->
    <el-dialog
      class="view-dialog"
      :title="viewDialogObj.title"
      :visible.sync="viewDialogObj.visible"
      width="1000px"
      @close="viewDialogObj.visible = false"
    >
      <div class="org-wrap">
        <img src="@/assets/icon/market1.png" alt="market.png">
        <span>{{ viewDialogObj.form.instnCnFullNm || viewDialogObj.form.cnFullName }}</span>
      </div>
      <table>
        <tr>
          <td>用户名</td>
          <td>{{ viewDialogObj.form.loginName }}</td>
          <td>姓名</td>
          <td>{{ viewDialogObj.form.sName }}</td>
        </tr>
        <tr>
          <td>座机号码</td>
          <td>{{ `${viewDialogObj.form.telNoAreaCode || ''}-${viewDialogObj.form.telNo || ''}` }}</td>
          <td>电子邮箱</td>
          <td>{{ viewDialogObj.form.email }}</td>
        </tr>
        <tr>
          <td>手机号码</td>
          <td>{{ `${viewDialogObj.form.phoneNoAreaCode}-${viewDialogObj.form.phoneNo}` }}</td>
          <td>所在部门</td>
          <td>{{ viewDialogObj.form.instnDepartment }}</td>
        </tr>
        <tr>
          <td>用户角色</td>
          <td colspan="3">{{ viewDialogObj.form.roleType ? viewDialogObj.form.roleType.text : null }}</td>
        </tr>
        <tr>
          <td>用户身份</td>
          <td colspan="3">{{ orgTypeFilter(viewDialogObj.form.instnIdentity) }}</td>
        </tr>
        <tr>
          <td>附件内容</td>
          <td colspan="3">
            <UploadFiles
              v-if="viewDialogObj.form.fileIds"
              v-model="viewDialogObj.form.fileIds"
              readonly
            />
          </td>
        </tr>
        <tr v-if="viewDialogObj.type === 'detail'">
          <td>审核反馈</td>
          <td colspan="3">{{ viewDialogObj.form.resuseCause }}</td>
        </tr>
      </table>
      <div slot="footer">
        <template v-if="viewDialogObj.type === 'audit'">
          <el-form
            ref="auditForm"
            :model="viewDialogObj.auditForm"
            :rules="viewDialogObj.rules"
          >
            <el-form-item label="审核反馈" prop="resuseCause">
              <el-input
                v-model="viewDialogObj.auditForm.resuseCause"
                type="textarea"
                maxlength="500"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </el-form-item>
          </el-form>
          <el-button
            v-preventReClick
            type="primary"
            class="button-primary"
            @click="onOperate('auditSubmit', '05')"
          >通过</el-button>
          <el-button
            v-preventReClick
            type="primary"
            class="button-primary"
            @click="onOperate('auditSubmit', '10')"
          >拒绝</el-button>
        </template>
        <el-button
          v-else
          class="button-default"
          @click="viewDialogObj.visible = false"
        >取消</el-button>
      </div>
    </el-dialog>
    <!-- 重置密码 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="rePassdialogObj.title"
      :visible.sync="rePassdialogObj.visible"
      :modal-append-to-body="false"
      width="600px"
      destroy-on-close
    >
      <el-form
        :model="rePassdialogObj.form"
        label-width="60px"
        label-position="left"
        inline
      >
        <div>
          <div class="reset-pass">
            <img
              src="@/assets/icon/reset-pass-icon.png"
              alt=""
            >
            <div style="height: 36px; line-height: 36px; margin-left: 10px">
              确定将
              <span style="color: #2C76D1">{{ rePassdialogObj.form.loginName }}</span>
              用户的密码重置为
              <span style="color: #2C76D1">88888888</span>
              吗？
            </div>
          </div>
        </div>
      </el-form>
      <div slot="footer">
        <el-button
          v-preventReClick
          type="primary"
          class="button-primary"
          @click="onOperate('submitResetPass')"
        >确定</el-button>
        <el-button
          class="button-default"
          @click="rePassdialogObj.visible = false"
        >取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import orgTypeMixin from '@/mixins/orgTypeMixin'
import gripManageApi from '@/api/gripManageApi'
import { getUserStatus } from '@/api/common'
import { validSname } from '@/utils/validate'
import {
  isNull,
  validEmail,
  validPhone,
  validUsername,
  validTelephoneArea,
  validSingleTel
} from '@/utils/validate'
import { prefixDefault } from '@/utils/prefix'
import globalOptions from '@/utils/globalOptionsValue'
import UploadFiles from '@/components/UploadFiles'

const defaultSearchForm = {
  userStatus: null,
  cnFullName: '',
  sName: '',
  loginName: ''
}
const defaultUserForm = {
  agencyId: null,
  loginName: '',
  sName: '',
  telNoAreaCode: '',
  telNo: '',
  email: '',
  phoneNoAreaCode: '86',
  phoneNo: '',
  instnDepartment: '',
  roleType: '',
  roleTypeObj: null,
  instnIdentity: []
}
export default {
  components: {
    UploadFiles
  },
  mixins: [orgTypeMixin],
  data() {
    const that = this
    const validateAuditFeedback = (rule, value, callback) => {
      if (that.viewDialogObj.auditForm.userStatus === '10' && isNull(value)) {
        callback(new Error('不能为空'))
      } else {
        callback()
      }
    }
    const validateSname = (rule, value, callback) => {
      if (!validSname(value)) {
        callback(new Error('仅支持中英文、数字和特殊字符'))
      } else {
        callback()
      }
    }
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('仅支持数字和大小写字母'))
      } else {
        callback()
      }
    }
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
    const validateTelNo = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('不能为空'))
      } else {
        if (!validSingleTel(value)) {
          callback(new Error('电话格式不正确'))
        }
        callback()
      }
    }
    const validateTelNoAreaCode = (rule, value, callback) => {
      if (!validTelephoneArea(value)) {
        callback(new Error('区号格式不正确'))
      } else {
        callback()
      }
    }
    return {
      mainObj: {
        loading: false,
        list: [],
        pageSize: 20,
        currentPage: 1,
        total: 0,
        searchForm: Object.assign({}, defaultSearchForm)
      },
      phoneCodeOptions: prefixDefault,
      userStatusOptions: [],
      rePassdialogObj: {
        visible: false,
        form: {
          loginName: ''
        }
      },
      userDialogObj: {
        visible: false,
        title: '',
        type: '',
        form: Object.assign({}, defaultUserForm),
        rules: {
          agencyId: [
            { required: true, message: '不能为空', trigger: 'change' }
          ],
          loginName: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { required: true, validator: validateUsername, trigger: 'blur' }
          ],
          sName: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { required: true, validator: validateSname, trigger: 'blur' }
          ],
          telNo: [
            { required: true, validator: validateTelNo, trigger: 'blur' },
            { required: true, message: '不能为空', trigger: 'blur' }
          ],
          telNoAreaCode: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { required: true, validator: validateTelNoAreaCode, trigger: 'blur' }
          ],
          phoneNo: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { required: true, validator: validatePhone, trigger: 'blur' }
          ],
          email: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { required: true, validator: validateEmail, trigger: 'blur' }
          ],
          roleType: [
            { required: true, message: '不能为空', trigger: 'change' }
          ],
          instnIdentity: [
            { required: true, message: '不能为空', trigger: 'change' }
          ]
        }
      },
      viewDialogObj: {
        visible: false,
        title: '',
        type: '',
        form: Object.assign({}, defaultUserForm),
        auditForm: {
          resuseCause: '',
          userStatus: ''
        },
        rules: {
          resuseCause: [
            { validator: validateAuditFeedback, trigger: 'blur' }
          ]
        }
      }
    }
  },
  created() {
    console.log('机构用户管理')
    this.getUserStatus()
    this.onSearch()
  },
  methods: {
    isNull,
    orgTypeFilter(typeStr) {
      return typeStr ? this.allOrgTypeOptions.filter(e => typeStr.includes(e.code)).map(e => e.text).join('、') : null
    },
    colorFilter(userStatus) {
      const findColor = userStatus ? globalOptions.colorOptions.find(e => e.code === userStatus.code) : null
      return findColor ? findColor.color : ''
    },
    // 机构变动时联动的角色和身份处理
    handleRoleTypeAndOrgType() {
      this.userDialogObj.form.roleType = ''
      this.userDialogObj.form.instnIdentity = []
    },
    // 用户角色变动时联动的身份处理
    handleOrgType() {
      const instnIdentityArr = []
      this.needOrgTypeOptions.forEach(e => {
        instnIdentityArr.push(e.code)
      })
      this.userDialogObj.form.instnIdentity = this.userDialogObj.form.instnIdentity.filter(e => instnIdentityArr.includes(e))
      this.orgTypeChange(this.userDialogObj.form.instnIdentity)
    },
    // 获取全部用户状态枚举值
    getUserStatus() {
      getUserStatus().then(res => {
        // 过滤拒绝状态
        this.userStatusOptions = res.data
      })
    },
    onOperate(type, row) {
      console.log(type, row)
      if (type === 'add') {
        this.userDialogObj.visible = true
        this.userDialogObj.type = type
        this.userDialogObj.title = '新增用户'
        this.userDialogObj.form = Object.assign({}, defaultUserForm)
        this.$nextTick(() => {
          this.$refs.userForm.clearValidate()
        })
      } else if (type === 'edit') {
        this.userDialogObj.visible = true
        this.userDialogObj.type = type
        this.userDialogObj.title = '修改用户'
        const params = {
          userId: row.id
        }
        gripManageApi.agencyUserInfo(params).then(res => {
          this.userDialogObj.form = Object.assign({}, defaultUserForm, res.data)
          this.userDialogObj.form.instnIdentity = this.userDialogObj.form.instnIdentity ? this.userDialogObj.form.instnIdentity.split(',') : []
          this.userDialogObj.form.roleTypeObj = this.userDialogObj.form.roleType
          this.userDialogObj.form.roleType = this.userDialogObj.form.roleType ? this.userDialogObj.form.roleType.name : null
          this.onChangeOrg(this.userDialogObj.form.agencyId, false).then(() => {
            this.$nextTick(() => {
              this.$refs.userForm.clearValidate()
            })
          })
        })
      } else if (type === 'detail') {
        this.viewDialogObj.visible = true
        this.viewDialogObj.type = type
        this.viewDialogObj.title = '查看'
        const params = {
          userId: row.id
        }
        gripManageApi.agencyUserInfo(params).then(res => {
          this.viewDialogObj.form = Object.assign({}, defaultUserForm, res.data)
          this.viewDialogObj.form.instnIdentity = this.viewDialogObj.form.instnIdentity || []
          this.viewDialogObj.form.fileIds = this.viewDialogObj.form.fileIds || []
        })
      } else if (type === 'audit') {
        this.viewDialogObj.visible = true
        this.viewDialogObj.type = type
        this.viewDialogObj.title = '审核'
        const params = {
          userId: row.id
        }
        gripManageApi.agencyUserInfo(params).then(res => {
          this.viewDialogObj.form = Object.assign({}, defaultUserForm, res.data)
          this.viewDialogObj.form.instnIdentity = this.viewDialogObj.form.instnIdentity || []
          this.viewDialogObj.form.fileIds = this.viewDialogObj.form.fileIds || []
          this.viewDialogObj.auditForm = {
            resuseCause: '',
            userStatus: ''
          }
          this.$nextTick(() => {
            this.$refs.auditForm.clearValidate()
          })
        })
      } else if (type === 'submit') {
        this.$refs.userForm.validate(valid => {
          if (valid) {
            const params = {
              sName: this.userDialogObj.form.sName,
              telNoAreaCode: this.userDialogObj.form.telNoAreaCode,
              telNo: this.userDialogObj.form.telNo,
              email: this.userDialogObj.form.email,
              phoneNoAreaCode: this.userDialogObj.form.phoneNoAreaCode,
              phoneNo: this.userDialogObj.form.phoneNo,
              instnDepartment: this.userDialogObj.form.instnDepartment,
              roleType: this.userDialogObj.form.roleType,
              instnIdentity: this.userDialogObj.form.instnIdentity.join(',')
            }
            if (this.userDialogObj.type === 'add') {
              params.loginName = this.userDialogObj.form.loginName
              params.agencyId = this.userDialogObj.form.agencyId
              params.source = 'CASS'
            } else if (this.userDialogObj.type === 'edit') {
              params.id = this.userDialogObj.form.id
              params.source = this.userDialogObj.form.source
            }
            gripManageApi.agencyUserSave(params, this.userDialogObj.type).then(res => {
              if (res.code === 'ACK') {
                this.$message({
                  type: 'success',
                  message: res.message
                })
                this.fetchData()
                this.userDialogObj.visible = false
              }
            })
          }
        })
      } else if (type === 'auditSubmit') {
        this.viewDialogObj.auditForm.userStatus = row
        this.$refs.auditForm.validate(valid => {
          if (valid) {
            const params = {
              resuseCause: this.viewDialogObj.auditForm.resuseCause,
              userStatus: this.viewDialogObj.auditForm.userStatus,
              userId: this.viewDialogObj.form.id
            }
            gripManageApi.gripAuditOrgUser(params).then(res => {
              if (res.code === 'ACK') {
                this.$message({
                  type: 'success',
                  message: res.message
                })
                this.fetchData()
                this.viewDialogObj.visible = false
              }
            })
          }
        })
      } else if (type === 'resetPass') {
        this.rePassdialogObj.visible = true
        this.rePassdialogObj.title = '重置密码'
        this.rePassdialogObj.type = type
        this.rePassdialogObj.form = JSON.parse(JSON.stringify(row))
      } else if (type === 'submitResetPass') {
        const params = {
          userId: this.rePassdialogObj.form.id
        }
        gripManageApi.agencyResetPass(params).then(res => {
          if (res.code === 'ACK') {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.fetchData()
            this.rePassdialogObj.visible = false
          }
        })
      } else if (type === 'disable') {
        const params = {
          userId: row.id
        }
        if (row.userStatus.text === '禁用') {
          gripManageApi.agencyEnableUser(params).then(res => {
            if (res.code === 'ACK') {
              this.$message({
                type: 'success',
                message: res.message
              })
              this.fetchData()
            }
          })
        } else {
          gripManageApi.agencyDisableUser(params).then(res => {
            if (res.code === 'ACK') {
              this.$message({
                type: 'success',
                message: res.message
              })
              this.fetchData()
            }
          })
        }
      }
    },
    onSearch() {
      this.mainObj.currentPage = 1
      this.fetchData()
    },
    onReset() {
      this.mainObj.searchForm = Object.assign({}, defaultSearchForm)
      this.onSearch()
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
      this.mainObj.loading = true
      const params = {
        page: this.mainObj.currentPage,
        pageSize: this.mainObj.pageSize,
        userStatus: this.mainObj.searchForm.userStatus,
        sName: this.mainObj.searchForm.sName,
        loginName: this.mainObj.searchForm.loginName,
        cnFullName: this.mainObj.searchForm.cnFullName
      }
      gripManageApi.agencySearch(params).then(res => {
        this.mainObj.list = res.data.list
        this.mainObj.total = res.data.totalRecord
      }).finally(() => {
        setTimeout(() => {
          this.mainObj.loading = false
        }, 500)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.reset-pass {
  display: flex;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: rgba(48, 48, 48, 1);
  margin: 35px 0;
}
</style>

