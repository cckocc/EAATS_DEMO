<template>
  <div>
    <div class="main-body">
      <div class="main-body-top">
        <el-form
          ref="searchForm"
          :model="mainObj.searchForm"
          label-position="left"
          label-width="80px"
          inline
        >
          <el-form-item label="接口名称">
            <el-input
              v-model.trim="mainObj.searchForm.dimensionName"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
          <el-form-item label="业务类型">
            <el-select
              v-model="mainObj.searchForm.procType"
              placeholder="--全部--"
              multiple
              clearable
            >
              <el-option
                v-for="item in procTypeOptions"
                :key="item.type"
                :label="item.title"
                :value="item.type"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="服务类型">
            <el-select
              v-model="mainObj.searchForm.serviceType"
              placeholder="--全部--"
              multiple
              clearable
              @change="mainObj.searchForm.acceptorUser = ''"
            >
              <el-option
                v-for="item in serveiceOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="流程状态">
            <el-select
              v-model="mainObj.searchForm.subAuditStatus"
              placeholder="--全部--"
              multiple
              clearable
            >
              <el-option
                v-for="item in processOptions"
                :key="item.code"
                :label="item.text"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="服务编号">
            <el-input
              v-model.trim="mainObj.searchForm.subApplyId"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
          <template v-if="isShowMore">
            <el-form-item label="机构名称">
              <el-input
                v-model.trim="mainObj.searchForm.instnCnFullNm"
                placeholder="请输入"
                clearable
              />
            </el-form-item>
            <el-form-item label="提交人">
              <el-input
                v-model.trim="mainObj.searchForm.applyUserName"
                placeholder="请输入"
                clearable
              />
            </el-form-item>
            <el-form-item label="用户身份">
              <el-select
                v-model="mainObj.searchForm.applicantIdentity"
                placeholder="--全部--"
                multiple
                clearable
              >
                <el-option
                  v-for="item in allOrgTypeOptions"
                  :key="item.code"
                  :label="item.text"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="提交时间">
              <el-date-picker
                v-model="mainObj.searchForm.updateTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="--起始时间--"
                end-placeholder="--结束时间--"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              />
            </el-form-item>
            <el-form-item v-show="mainObj.searchForm.serviceType.includes('10')" label="验收人">
              <el-select
                v-model="mainObj.searchForm.acceptorUser"
                placeholder="请选择"
                clearable
                filterable
              >
                <el-option
                  v-for="item in acceptorUserOptions"
                  :key="item.userId"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="awaitFlag !== 'true'" label="审核人">
              <el-input
                v-model.trim="mainObj.searchForm.auditUserName"
                placeholder="请输入"
                clearable
              />
            </el-form-item>
            <el-form-item v-if="awaitFlag !== 'true'" label="审核时间">
              <el-date-picker
                v-model="mainObj.searchForm.auditTime"
                type="datetimerange"
                range-separator="至"
                start-placeholder="--起始时间--"
                end-placeholder="--结束时间--"
                value-format="yyyy-MM-dd HH:mm:ss"
                :default-time="['00:00:00', '23:59:59']"
              />
            </el-form-item>
          </template>
          <el-form-item>
            <el-button size="mini" type="primary" @click="onSearch">查询</el-button>
            <el-button size="mini" @click="onReset">重置</el-button>
            <el-button size="mini" type="text" @click="isShowMore = !isShowMore">
              {{ !isShowMore ? '展开' : '收起' }}<i :class="[ !isShowMore ? 'el-icon-arrow-down' : 'el-icon-arrow-up','el-icon--right']" />
            </el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="main-body-bottom">
        <div class="main-body-bottom-btn">
          <div class="main-body-bottom-btn-left">
            <el-button
              v-preventReClick
              type="primary"
              @click="onOperate('export')"
            >批量导出JSON</el-button>
          </div>
          <div class="main-body-bottom-btn-right">
            <el-dropdown trigger="click" :hide-on-click="false">
              <el-button type="text">
                <svg-icon class="button-icon" icon-class="config" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-checkbox-group v-model="mainObj.columnCheckedList">
                  <el-dropdown-item v-for="item in mainObj.columnAllList" :key="item.prop">
                    <el-checkbox :label="item.prop">{{ item.label }}</el-checkbox>
                  </el-dropdown-item>
                </el-checkbox-group>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="table">
          <el-table
            ref="mainTable"
            v-loading="mainObj.loading"
            :data="mainObj.list"
            :max-height="mainObj.height"
            :cell-class-name="cellClassName"
            fit
            stripe
            border
            highlight-current-row
            lazy
            row-key="serviceIdOnly"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
            :load="load"
          >
            <el-table-column
              v-for="item in checkedColumns"
              :key="item.prop"
              show-overflow-tooltip
              :prop="item.prop"
              :label="item.label"
              :fixed="item.fixed"
              :min-width="item.minWidth"
              :width="item.prop === 'operate' ? (awaitFlag === 'true' ? (userInfo.roleType.code === 'super-admin' ? item.widths[0] : item.widths[1]) : 120) : item.width"
            >
              <template slot-scope="scope">
                <template v-if="item.prop === 'procType'">{{ scope.row.procType | procTypeFilter }}</template>
                <template v-else-if="item.prop === 'subAuditStatus'">
                  <svg-icon
                    v-if="!scope.row.hasChildren && scope.row.subAuditStatus"
                    :icon-class="scope.row.subAuditStatus | auditStatusEnumFilter"
                  />
                  {{ !scope.row.hasChildren && scope.row.subAuditStatus ? scope.row.subAuditStatus.text: '-' }}
                </template>
                <template v-else-if="item.prop === 'applyUserName'">
                  <UserCard v-model="scope.row.applyUserId" :user-name="scope.row.applyUserName" />
                </template>
                <template v-else-if="item.prop === 'auditUserName'">
                  <span v-if="scope.row.hasChildren">-</span>
                  <template v-else>
                    <div
                      v-for="(user, userIndex) in scope.row.auditUserInfoList"
                      :key="`${scope.row.serviceIdOnly}-${user.auditUserId}-${userIndex}`"
                    >
                      <el-divider v-if="userIndex !== 0" />
                      <span>{{ user.auditUserName }}</span>
                    </div>
                  </template>
                </template>
                <template v-else-if="item.prop === 'auidtDateStr'">
                  <span v-if="scope.row.hasChildren">-</span>
                  <template v-else>
                    <div
                      v-for="(user, userIndex) in scope.row.auditUserInfoList"
                      :key="`${scope.row.serviceIdOnly}-${user.auditUserId}-${userIndex}`"
                    >
                      <el-divider v-if="userIndex !== 0" />
                      <span>{{ user.auidtDateStr }}</span>
                    </div>
                  </template>
                </template>
                <template v-else-if="item.prop === 'processView'">
                  <span v-if="scope.row.hasChildren">-</span>
                  <el-button
                    v-else
                    v-preventReClick
                    type="text"
                    @click="onOperate('processView', scope.row)"
                  >
                    流程查看
                  </el-button>
                </template>
                <template v-else-if="item.prop === 'operate'">
                  <el-button
                    v-preventReClick
                    type="text"
                    @click="onOperate('detail', scope.row)"
                  >
                    查看
                  </el-button>
                  <template v-if="awaitFlag === 'true'">
                    <el-button
                      v-if="!scope.row.hasChildren && (scope.row.serviceType === '20' || userInfo.roleType.code !== 'super-admin')"
                      v-preventReClick
                      type="text"
                      @click="onOperate('audit', scope.row)"
                    >
                      {{ scope.row.subAuditStatus.code === '1010' ? '测试反馈' : '审核' }}
                    </el-button>
                    <el-button
                      v-if="!scope.row.hasChildren && userInfo.roleType.code === 'super-admin'"
                      v-preventReClick
                      type="text"
                      @click="onOperate('processInter', scope.row)"
                    >
                      流程干预
                    </el-button>
                    <el-button
                      v-if="!scope.row.hasChildren && scope.row.serviceType === '10' && scope.row.freedButtonFlag"
                      v-preventReClick
                      type="text"
                      @click="onOperate('release', scope.row)"
                    >
                      释放
                    </el-button>
                  </template>
                  <template v-else>
                    <el-button
                      v-if="!scope.row.hasChildren && scope.row.serviceType === '10' && scope.row.freedButtonFlag"
                      v-preventReClick
                      type="text"
                      @click="onOperate('release', scope.row)"
                    >
                      释放
                    </el-button>
                    <el-button
                      v-if="!scope.row.hasChildren && scope.row.serviceType === '10' && scope.row.retraceButtonFlag && userInfo.roleType.code !== 'super-admin'"
                      v-preventReClick
                      type="text"
                      @click="onOperate('retrace', scope.row)"
                    >
                      回撤
                    </el-button>
                    <el-button
                      v-if="!scope.row.hasChildren && scope.row.testInfoButtonFlag"
                      v-preventReClick
                      type="text"
                      @click="onOperate('testInfo', scope.row)"
                    >
                      测试信息
                    </el-button>
                  </template>
                </template>
                <template v-else>{{ scope.row[item.prop] }}</template>
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
    <!-- 流程查看 -->
    <processViewDialog
      ref="processViewDialog"
      :modal-visible="processViewObj.visible"
      :process-view-obj="processViewObj.row"
      @close="processViewObj.visible = false"
    />
    <!-- 网络开通 -->
    <networkOpeningDialog
      :visible="networkOpeningObj.visible"
      :operation-type="networkOpeningObj.type"
      :row-obj="networkOpeningObj.row"
      @close="networkOpeningObj.visible = false"
    />
    <!-- 流程干预弹出框 -->
    <el-dialog
      title="流程干预"
      width="700"
      class="custom-dialog"
      :visible.sync="processInterObj.visible"
    >
      <div slot="footer">
        <el-button
          v-preventReClick
          type="success"
          :disabled="processInterObj.row.serviceType === '20'"
          @click="onOperate('processInterAudit', true)"
        >一键通过</el-button>
        <el-button
          v-if="serviceObj.goBackButtonFlag"
          v-preventReClick
          type="danger"
          @click="showRollback"
        >回退</el-button>
      </div>
    </el-dialog>
    <!-- 测试信息弹出框 -->
    <el-dialog
      title="测试账号反馈"
      width="800"
      :visible.sync="testInfoObj.visible"
    >
      <el-form
        ref="testInfoForm"
        :model="testInfoObj.form"
        :rules="testInfoObj.rules"
        :disabled="!testInfoObj.form.canEdit"
      >
        <el-form-item label="" prop="ifFeedback">
          <el-radio-group v-model="testInfoObj.form.ifFeedback">
            <el-radio :label="true">反馈测试账号</el-radio>
            <el-radio :label="false">不反馈测试账号</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="testInfoObj.form.ifFeedback" label="" prop="testInformationContent">
          <Tinymce ref="testInformationContent" v-model="testInfoObj.form.testInformationContent" />
          <!-- <el-input
            v-model="testInfoObj.form.testInformationContent"
            type="textarea"
            autosize
            clearable
          /> -->
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          v-if="testInfoObj.form.canEdit"
          v-preventReClick
          type="primary"
          @click="onOperate('testInfoSubmit')"
        >确定</el-button>
        <el-button @click="testInfoObj.visible = false">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="800px"
      :title="rollbackDialogObj.title"
      :visible.sync="rollbackDialogObj.visible"
    >
      <el-form
        ref="rollbackForm"
        :model="rollbackDialogObj.form"
        :rules="rollbackDialogObj.rules"
        label-width="100px"
        label-position="left"
      >
        <el-form-item :label="$t('permissionChange.backTo')" prop="targeTaskId">
          <el-radio-group v-model="rollbackDialogObj.form.targeTaskId">
            <div
              v-for="item in rollbackDialogObj.options"
              :key="item.id"
              class="mb10"
            >
              <el-radio :label="item.id">{{ item.name }}</el-radio>
            </div>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          type="primary"
          @click="onRollback"
        >{{ $t('common.button.confirm2') }}</el-button>
        <el-button
          @click="rollbackDialogObj.visible = false"
        >{{ $t('common.button.cancel') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import UserCard from '@/components/UserCard'
import Tinymce from '@/components/Tinymce'
import { mapGetters } from 'vuex'
import globalOptions from '@/utils/globalOptionsValue'
import processViewApi from '@/api/interface-service/processViewApi'
import { getOrgTypeList } from '@/api/register'
import processViewDialog from '@/views/interface-service/my-service/components/processViewDialog'
import networkOpeningDialog from '@/views/service-manage/network-opening-list/components/index'
import { downloadFile, parseTime } from '@/utils/index'

const defaultSearchForm = {
  dimensionName: '',
  procType: [],
  serviceType: [],
  subAuditStatus: [],
  subApplyId: '',
  instnCnFullNm: '',
  applyUserName: '',
  applicantIdentity: [],
  acceptorUser: '',
  updateTime: '',
  auditUserName: '',
  auditTime: ''
}
export default {
  components: {
    UserCard,
    Tinymce,
    processViewDialog,
    networkOpeningDialog
  },
  filters: {
    procTypeFilter(val) {
      return val ? globalOptions.procTypeOptions.find(e => e.type === val).title : null
    },
    auditStatusEnumFilter(val) {
      return val ? globalOptions.myServiceAuditStatusList.find(e => e.value === val.code).icon : null
    }
  },
  props: {
    awaitFlag: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      currentRow: null,
      isShowMore: false,
      processOptions: [],
      procTypeOptions: globalOptions.procTypeOptions,
      serveiceOptions: globalOptions.serveiceOptions,
      serveiceOptionsFilter: [],
      allOrgTypeOptions: [],
      acceptorUserOptions: [],
      mainObj: {
        loading: false,
        height: 200,
        list: [],
        pageSize: 20,
        currentPage: 1,
        total: 0,
        searchForm: Object.assign({}, defaultSearchForm),
        maps: new Map(),
        columnCheckedList: [],
        columnAllList: [
          {
            prop: 'serviceId',
            label: '服务编号',
            minWidth: '240',
            fixed: 'left'
          },
          {
            prop: 'instnCnFullNm',
            label: '机构名称',
            minWidth: '150'
          },
          {
            prop: 'dimensionName',
            label: '接口名称',
            minWidth: '180'
          },
          {
            prop: 'procType',
            label: '业务类型',
            minWidth: '120'
          },
          {
            prop: 'serviceTypeStr',
            label: '服务类型',
            minWidth: '80'
          },
          {
            prop: 'subAuditStatus',
            label: '流程状态',
            minWidth: '120'
          },
          {
            prop: 'applyUserName',
            label: '提交人',
            minWidth: '120'
          },
          {
            prop: 'applicantIdentityStr',
            label: '用户身份',
            minWidth: '150'
          },
          {
            prop: 'applyTime',
            label: '提交时间',
            minWidth: '160'
          },
          {
            prop: 'auditUserName',
            label: '审核人',
            minWidth: '120'
          },
          {
            prop: 'auidtDateStr',
            label: '审核时间',
            minWidth: '160'
          },
          {
            prop: 'processView',
            label: '流程查看',
            width: '80',
            fixed: 'right'
          },
          {
            prop: 'operate',
            label: '操作',
            widths: [240, 160],
            fixed: 'right'
          }
        ]
      },
      serviceObj: {},
      // 流程查看
      processViewObj: {
        row: {},
        visible: false,
        type: ''
      },
      // 网络开通
      networkOpeningObj: {
        visible: false,
        type: '',
        row: {}
      },
      // 流程干预
      processInterObj: {
        row: {},
        visible: false,
        type: ''
      },
      // 测试信息
      testInfoObj: {
        row: {},
        visible: false,
        form: {
          canEdit: true,
          ifFeedback: '',
          testInformationContent: ''
        },
        rules: {
          ifFeedback: [
            { required: true, message: '不能为空', trigger: 'change' }
          ],
          testInformationContent: [
            { required: true, message: '不能为空', trigger: 'blur' }
          ]
        }
      },
      // 回退
      rollbackDialogObj: {
        visible: false,
        title: this.$t('permissionChange.auditGoBack'),
        options: [],
        form: {
          targeTaskId: null
        },
        rules: {
          targeTaskId: [
            { required: true, message: this.$t('common.validate.required'), trigger: 'change' }
          ]
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    message() {
      return this.$store.state.app.message
    },
    checkedColumns() {
      return this.mainObj.columnAllList.filter(e => this.mainObj.columnCheckedList.includes(e.prop))
    }
  },
  created() {
    if (this.$route.params.searchObj && !this.$route.params.isUsed) {
      Object.assign(this.mainObj.searchForm, this.$route.params.searchObj)
      this.$router.push({
        params: Object.assign(this.$route.params, { isUsed: true })
      })
    }
    console.log('列表' + this.awaitFlag)
    // 场务管理员不显示网络开通申请
    if (this.userInfo.roleType.code === 'super-admin') {
      this.serveiceOptionsFilter = this.serveiceOptions
    } else {
      this.serveiceOptionsFilter = this.serveiceOptions.filter(e => e.value !== '50')
    }
    if (this.awaitFlag === 'true') {
      this.mainObj.columnAllList = this.mainObj.columnAllList.filter(e => {
        return e.prop !== 'auditUserName' && e.prop !== 'auidtDateStr'
      })
    }
    this.mainObj.columnCheckedList = JSON.parse(JSON.stringify(this.mainObj.columnAllList)).map(e => e.prop)
    this.getAuditStatus()
    this.getAccepterList()
    this.getOrgTypeList()
    this.onSearch()
  },
  mounted() {
    this.$nextTick(() => {
      this.mainObj.height = this.$root.$el.clientHeight - 300
    })
  },
  methods: {
    cellClassName({ row, column, rowIndex, columnIndex }) {
      return (row.applicantIdentityStr && row.applicantIdentityStr.includes('ISV') && column.property === 'applicantIdentityStr') ? 'isv-cell' : ''
    },
    // 获取验收人列表
    getAuditStatus() {
      processViewApi.getAuditStatus(this.awaitFlag).then(res => {
        this.processOptions = res.data
      })
    },
    // 获取验收人列表
    getAccepterList() {
      processViewApi.getAccepterList().then(res => {
        this.acceptorUserOptions = res.data
      })
    },
    // 获取系统所有机构身份
    getOrgTypeList() {
      getOrgTypeList().then(res => {
        this.allOrgTypeOptions = res.data
      })
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
    onSearch() {
      this.mainObj.currentPage = 1
      this.mainObj.list = []
      this.fetchData()
    },
    onReset() {
      this.mainObj.searchForm = Object.assign({}, defaultSearchForm)
      this.onSearch()
    },
    fetchData() {
      this.mainObj.loading = true
      const params = {
        page: this.mainObj.currentPage,
        pageSize: this.mainObj.pageSize,
        awaitFlag: this.awaitFlag,
        dimensionName: this.mainObj.searchForm.dimensionName,
        procType: this.mainObj.searchForm.procType.toString(),
        serviceType: this.mainObj.searchForm.serviceType.toString(),
        subAuditStatus: this.mainObj.searchForm.subAuditStatus.toString(),
        subApplyId: this.mainObj.searchForm.subApplyId,
        instnCnFullNm: this.mainObj.searchForm.instnCnFullNm,
        applyUserName: this.mainObj.searchForm.applyUserName,
        auditUserName: this.mainObj.searchForm.auditUserName,
        applicantIdentity: this.mainObj.searchForm.applicantIdentity.toString(),
        acceptorUser: this.mainObj.searchForm.acceptorUser,
        applyStartTime: this.mainObj.searchForm.updateTime
          ? `${this.mainObj.searchForm.updateTime[0]}`
          : null,
        applyEndTime: this.mainObj.searchForm.updateTime
          ? `${this.mainObj.searchForm.updateTime[1]}`
          : null,
        auditStartTime: this.mainObj.searchForm.auditTime
          ? `${this.mainObj.searchForm.auditTime[0]}`
          : null,
        auditEndTime: this.mainObj.searchForm.auditTime
          ? `${this.mainObj.searchForm.auditTime[1]}`
          : null
      }
      processViewApi.getProcessViewWaitList(params).then(res => {
        if (res.code === 'ACK') {
          this.mainObj.list = res.data.list.map(e => {
            e.hasChildren = e.applyId !== e.subApplyId
            e.isMainOrder = true
            e.serviceIdOnly = e.applyId + 'parent'
            e.serviceId = e.applyId
            return e
          })
          console.log(this.mainObj.list)
          this.mainObj.total = res.data.totalRecord
        }
      }).finally(() => {
        setTimeout(() => {
          this.mainObj.loading = false
        }, 500)
      })
    },
    // 获取子单号列表
    load(tree, treeNode, resolve) {
      console.log(tree, treeNode, resolve)
      this.mainObj.maps.set(tree.applyOrdNo, { tree, treeNode, resolve })
      const params = {
        currAuditUserId: this.userInfo.id,
        applyId: tree.applyId,
        awaitFlag: this.awaitFlag,
        dimensionName: this.mainObj.searchForm.dimensionName,
        procType: this.mainObj.searchForm.procType.toString(),
        serviceType: this.mainObj.searchForm.serviceType.toString(),
        subAuditStatus: this.mainObj.searchForm.subAuditStatus.toString(),
        subApplyId: this.mainObj.searchForm.subApplyId,
        instnCnFullNm: this.mainObj.searchForm.instnCnFullNm,
        applyUserName: this.mainObj.searchForm.applyUserName,
        auditUserName: this.mainObj.searchForm.auditUserName,
        applicantIdentity: this.mainObj.searchForm.applicantIdentity.toString(),
        acceptorUser: this.mainObj.searchForm.acceptorUser,
        applyStartTime: this.mainObj.searchForm.updateTime
          ? `${this.mainObj.searchForm.updateTime[0]}`
          : null,
        applyEndTime: this.mainObj.searchForm.updateTime
          ? `${this.mainObj.searchForm.updateTime[1]}`
          : null,
        auditStartTime: this.mainObj.searchForm.auditTime
          ? `${this.mainObj.searchForm.auditTime[0]}`
          : null,
        auditEndTime: this.mainObj.searchForm.auditTime
          ? `${this.mainObj.searchForm.auditTime[1]}`
          : null
      }
      processViewApi.getProcessViewWaitSonList(params).then(res => {
        if (res.code === 'ACK') {
          resolve(res.data.map(e => {
            e.isMainOrder = false
            e.hasChildren = false
            e.serviceIdOnly = e.subApplyId + 'son'
            e.serviceId = e.subApplyId
            return e
          }))
        }
      })
    },
    // 手动刷新子列表
    refreshSonList() {
      if (this.currentRow) {
        if (!this.currentRow.isMainOrder) {
          const { tree, treeNode, resolve } = this.mainObj.maps.get(this.currentRow.applyOrdNo)
          this.$set(this.$refs.mainTable.store.states.lazyTreeNodeMap, this.currentRow.applyOrdNo + 'parent', [])
          this.load(tree, treeNode, resolve)
        }
        this.currentRow = null
      }
    },
    onOperate(type, row) {
      console.log(type, row)
      if (type !== 'processInterAudit') {
        this.currentRow = row
      }
      if (type === 'processView') {
        this.processViewObj.visible = true
        this.processViewObj.row = row
      } else if (type === 'detail') {
        if (row.serviceType === '00') {
          // 服务开通
          const obj = {
            parentType: row.procType,
            sonType: row.serviceType,
            operationType: type,
            isMainOrder: row.isMainOrder,
            subApplyId: row.isMainOrder ? row.applyId : row.subApplyId
          }
          this.$router.push({
            name: 'ServiceOpening',
            query: {
              isShowTitleBefore: true,
              params: encodeURIComponent(JSON.stringify(obj))
            }
          })
        } else if (row.serviceType === '10') {
          // 验收测试
          const obj = {
            parentType: row.procType,
            sonType: row.serviceType,
            operationType: type,
            isMainOrder: row.isMainOrder,
            subApplyId: row.isMainOrder ? row.applyId : row.subApplyId
          }
          this.$router.push({
            name: 'AcceptanceTest',
            query: {
              isShowTitleBefore: true,
              params: encodeURIComponent(JSON.stringify(obj))
            }
          })
        } else if (row.serviceType === '20') {
          // 接口上线
          const obj = {
            parentType: row.procType,
            sonType: row.serviceType,
            operationType: type,
            isMainOrder: row.isMainOrder,
            subApplyId: row.isMainOrder ? row.applyId : row.subApplyId
          }
          this.$router.push({
            name: 'ServiceOnline',
            query: {
              isShowTitleBefore: true,
              params: encodeURIComponent(JSON.stringify(obj))
            }
          })
        } else if (row.serviceType === '40') {
          // 权限变更
          const obj = {
            parentType: row.procType,
            sonType: row.serviceType,
            operationType: type,
            isMainOrder: row.isMainOrder,
            subApplyId: row.isMainOrder ? row.applyId : row.subApplyId
          }
          this.$router.push({
            name: 'PermissionChange',
            query: {
              isShowTitleBefore: true,
              params: encodeURIComponent(JSON.stringify(obj))
            }
          })
        } else if (row.serviceType === '50') {
          // 网络开通
          this.networkOpeningObj.type = type
          this.networkOpeningObj.visible = true
          this.networkOpeningObj.row = row
        }
      } else if (type === 'audit') {
        if (row.serviceType === '00') {
          // 服务开通
          const obj = {
            parentType: row.procType,
            sonType: row.serviceType,
            operationType: type,
            isMainOrder: row.isMainOrder,
            subApplyId: row.isMainOrder ? row.applyId : row.subApplyId
          }
          this.$router.push({
            name: 'ServiceOpening',
            query: {
              isShowTitleBefore: true,
              params: encodeURIComponent(JSON.stringify(obj))
            }
          })
        } else if (row.serviceType === '10') {
          // 验收测试
          const obj = {
            parentType: row.procType,
            sonType: row.serviceType,
            operationType: type,
            isMainOrder: row.isMainOrder,
            subApplyId: row.isMainOrder ? row.applyId : row.subApplyId,
            // 场务端传入提交人id 以供审核时选择验收时间使用
            applyUserId: row.applyUserId
          }
          this.$router.push({
            name: 'AcceptanceTest',
            query: {
              isShowTitleBefore: true,
              params: encodeURIComponent(JSON.stringify(obj))
            }
          })
        } else if (row.serviceType === '20') {
          // 接口上线
          const obj = {
            parentType: row.procType,
            sonType: row.serviceType,
            operationType: type,
            isMainOrder: row.isMainOrder,
            subApplyId: row.isMainOrder ? row.applyId : row.subApplyId
          }
          this.$router.push({
            name: 'ServiceOnline',
            query: {
              isShowTitleBefore: true,
              params: encodeURIComponent(JSON.stringify(obj))
            }
          })
        } else if (row.serviceType === '40') {
          // 权限变更
          const obj = {
            parentType: row.procType,
            sonType: row.serviceType,
            operationType: type,
            isMainOrder: row.isMainOrder,
            subApplyId: row.isMainOrder ? row.applyId : row.subApplyId
          }
          this.$router.push({
            name: 'PermissionChange',
            query: {
              isShowTitleBefore: true,
              params: encodeURIComponent(JSON.stringify(obj))
            }
          })
        } else if (row.serviceType === '50') {
          // 网络开通
          this.networkOpeningObj.type = type
          this.networkOpeningObj.visible = true
          this.networkOpeningObj.row = row
        }
      } else if (type === 'processInter') {
        // 流程干预
        this.processInterObj.visible = true
        this.processInterObj.row = row
        const form = new FormData()
        form.append('awaitFlag', 'true')
        form.append('subApplyId', row.subApplyId)
        form.append('currAuditUserId', this.userInfo.id)
        processViewApi.getProcessViewDetail(form).then(res => {
          this.serviceObj = res.data
        })
      } else if (type === 'processInterAudit') {
        // 一键通过/拒绝
        const params = {
          pass: row,
          auditFeedback: null,
          remark: null,
          auidtUserId: this.userInfo.id,
          applyNo: this.processInterObj.row.subApplyId,
          auditId: this.processInterObj.row.flowAuditId,
          taskId: this.processInterObj.row.taskId
        }
        processViewApi.auditProcessViewInter(params, row).then(res => {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.processInterObj.visible = false
          this.fetchData()
          this.refreshSonList()
        })
      } else if (type === 'release') {
        this.$confirm('释放之后，该验收申请单占用的名额即时释放，场务端该子申请单的状态为“释放”。', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const params = {
              id: row.subApplyId
            }
            processViewApi.releaseProcessView(params).then(res => {
              if (res.code === 'ACK') {
                this.$message({
                  type: 'success',
                  message: res.message
                })
                this.fetchData()
                this.refreshSonList()
              }
            })
          }).catch(() => {})
      } else if (type === 'retrace') {
        this.$confirm('确定要回撤吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const params = {
              applyNo: row.subApplyId,
              auditId: row.flowAuditId,
              taskId: row.taskId
            }
            processViewApi.retraceProcessView(params).then(res => {
              if (res.code === 'ACK') {
                this.$message({
                  type: 'success',
                  message: res.message
                })
                this.fetchData()
                this.refreshSonList()
              }
            })
          }).catch(() => {})
      } else if (type === 'testInfo') {
        console.log('测试信息')
        const params = {
          subApplyNo: row.subApplyId
        }
        processViewApi.getTestInfoDetail(params).then(res => {
          console.log(res.data)
          this.testInfoObj.visible = true
          this.testInfoObj.row = row
          this.testInfoObj.form.canEdit = res.data.canEdit
          this.testInfoObj.form.ifFeedback = res.data.ifFeedback
          this.testInfoObj.form.testInformationContent = res.data.data
          this.$nextTick(() => {
            try {
              this.$refs.testInformationContent.setContent(res.data.data)
            } catch (e) {
              console.log(e)
            }
            this.$refs.testInfoForm.clearValidate()
          })
        })
      } else if (type === 'testInfoSubmit') {
        this.$refs.testInfoForm.validate((valid) => {
          if (valid) {
            const params = {
              subApplyOrdNo: this.testInfoObj.row.subApplyId,
              feedback: this.testInfoObj.form.ifFeedback
            }
            if (this.testInfoObj.form.ifFeedback) {
              params.testInformationContent = this.testInfoObj.form.testInformationContent
            }
            processViewApi.submitTestInfo(params).then(res => {
              console.log(res.data)
              this.$message({
                type: 'success',
                message: res.message
              })
              this.testInfoObj.visible = false
            })
          }
        })
      } else if (type === 'export') {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        const params = {
          page: this.mainObj.currentPage,
          pageSize: this.mainObj.pageSize,
          awaitFlag: this.awaitFlag,
          dimensionName: this.mainObj.searchForm.dimensionName,
          procType: this.mainObj.searchForm.procType.toString(),
          serviceType: this.mainObj.searchForm.serviceType.toString(),
          subAuditStatus: this.mainObj.searchForm.subAuditStatus.toString(),
          subApplyId: this.mainObj.searchForm.subApplyId,
          instnCnFullNm: this.mainObj.searchForm.instnCnFullNm,
          applyUserName: this.mainObj.searchForm.applyUserName,
          auditUserName: this.mainObj.searchForm.auditUserName,
          applicantIdentity: this.mainObj.searchForm.applicantIdentity.toString(),
          acceptorUser: this.mainObj.searchForm.acceptorUser,
          applyStartTime: this.mainObj.searchForm.updateTime
            ? `${this.mainObj.searchForm.updateTime[0]} 00:00:00`
            : null,
          applyEndTime: this.mainObj.searchForm.updateTime
            ? `${this.mainObj.searchForm.updateTime[1]} 23:59:59`
            : null,
          auditStartTime: this.mainObj.searchForm.auditTime
            ? `${this.mainObj.searchForm.auditTime[0]} 00:00:00`
            : null,
          auditEndTime: this.mainObj.searchForm.auditTime
            ? `${this.mainObj.searchForm.auditTime[1]} 23:59:59`
            : null
        }
        processViewApi.exportJson(params).then(res => {
          const time = parseTime(new Date(), '{yyyy}{mm}{dd}{hh}{ii}{ss}')
          console.log(time)
          downloadFile(res.data, `待测试申请单_${time}.json`, 'application/json')
          this.$message({
            type: 'success',
            message: '下载成功！'
          })
        }).finally(() => {
          loading.close()
        })
      }
    },
    showRollback() {
      this.rollbackDialogObj.form.targeTaskId = null
      const params = {
        auditId: this.processInterObj.row.flowAuditId,
        taskId: this.processInterObj.row.taskId
      }
      processViewApi.getRollbackNode(params).then(res => {
        this.rollbackDialogObj.visible = true
        this.rollbackDialogObj.options = res.data
        this.$nextTick(() => {
          this.$refs.rollbackForm.clearValidate()
        })
      })
    },
    onRollback() {
      this.$refs.rollbackForm.validate(valid => {
        if (valid) {
          const params = {
            targeTaskId: this.rollbackDialogObj.form.targeTaskId,
            auidtUserId: this.userInfo.id,
            auditId: this.processInterObj.row.flowAuditId,
            taskId: this.processInterObj.row.taskId
          }
          processViewApi.rollbackNode(params).then(res => {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.rollbackDialogObj.visible = false
            this.processInterObj.visible = false
            this.fetchData()
            this.refreshSonList()
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep.el-divider--horizontal {
  margin: 0;
}
::v-deep.el-table {
  td.isv-cell {
    background: #f0f9eb!important;
  }
}
</style>
