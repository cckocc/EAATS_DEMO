<template>
  <div>
    <el-tabs v-model="institutionType" class="custom-main-tabs" @tab-click="tabClick">
      <el-tab-pane v-if="institutionTypeList.includes('00')" :label="$t('myService.marketMembers')" name="00" />
      <el-tab-pane v-if="institutionTypeList.includes('10')" :label="$t('myService.informationVendors')" name="10" />
    </el-tabs>
    <div class="main-body">
      <div class="main-body-top">
        <el-form
          ref="searchForm"
          :model="mainObj.searchForm"
          :label-width="$t('myService.labelWidth')"
          label-position="left"
          inline
        >
          <el-form-item :label="$t('myService.interfaceName')">
            <el-input
              v-model.trim="mainObj.searchForm.dimensionName"
              :placeholder="$t('common.placeholder.required')"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('myService.businessType')">
            <el-select
              v-model="mainObj.searchForm.procType"
              :placeholder="$t('myService.placeholder.all')"
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
          <el-form-item :label="$t('myService.serviceType')">
            <el-select
              v-model="mainObj.searchForm.serviceTypeList"
              :placeholder="$t('myService.placeholder.all')"
              multiple
              clearable
            >
              <el-option
                v-for="item in serveiceOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('myService.processStatus')">
            <el-select
              v-model="mainObj.searchForm.auditStatusList"
              :placeholder="$t('myService.placeholder.all')"
              multiple
              clearable
            >
              <el-option
                v-for="item in processOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('myService.serviceCode')">
            <el-input
              v-model.trim="mainObj.searchForm.id"
              :placeholder="$t('common.placeholder.required')"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('myService.submitter')">
            <el-input
              v-model.trim="mainObj.searchForm.submitUserName"
              :placeholder="$t('common.placeholder.required')"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('myService.submitTime')">
            <el-date-picker
              v-model="mainObj.searchForm.updateTime"
              type="daterange"
              :range-separator="$t('myService.placeholder.rangeSeparator')"
              :start-placeholder="$t('myService.placeholder.startTime')"
              :end-placeholder="$t('myService.placeholder.endTime')"
              value-format="yyyy-MM-dd"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">{{ $t('common.button.inquiry') }}</el-button>
            <el-button type="default" @click="onReset">{{ $t('common.button.reset') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="main-body-bottom">
        <div class="table">
          <el-table
            ref="mainTable"
            v-loading="mainObj.loading"
            :data="mainObj.list"
            :max-height="mainObj.height"
            :row-class-name="tableRowClassName"
            :cell-class-name="tableCellClassName"
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
              show-overflow-tooltip
              prop="serviceId"
              :label="$t('myService.serviceCode')"
              min-width="240"
              fixed="left"
            />
            <el-table-column
              show-overflow-tooltip
              prop="dimensionName"
              :label="$t('myService.interfaceName')"
              min-width="180"
            />
            <el-table-column
              show-overflow-tooltip
              prop="procType"
              :label="$t('myService.businessType')"
              min-width="120"
            >
              <template slot-scope="scope">{{ scope.row.procType | procTypeFilter }}</template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="serviceType"
              :label="$t('myService.serviceType')"
              min-width="120"
            >
              <template slot-scope="scope">{{ scope.row.serviceType | serviceTypeFilter }}</template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              :label="$t('myService.processStatus')"
              :min-width="$t('myService.statusMinWidth')"
            >
              <template slot-scope="scope">
                <svg-icon
                  v-if="scope.row.auditStatusEnum"
                  :icon-class="scope.row.auditStatusEnum | auditStatusEnumIconFilter"
                />
                {{ scope.row.auditStatusEnum | auditStatusEnumTextFilter }}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="submitUserName"
              :label="$t('myService.submitter')"
              min-width="100"
            >
              <template slot-scope="scope">
                <UserCard v-model="scope.row.submitUserNameId" :user-name="scope.row.submitUserName" />
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="submitTs"
              :label="$t('myService.submitTime')"
              min-width="160"
            />
            <el-table-column
              show-overflow-tooltip
              align="center"
              :label="$t('myService.processView')"
              :width="$t('myService.processWidth')"
              fixed="right"
            >
              <template slot-scope="scope">
                <span v-if="(scope.row.isMainOrder && scope.row.hasChildren) ||(scope.row.auditStatusEnum && scope.row.auditStatusEnum.name === 'WAIT_SUBMIT')">-</span>
                <el-button
                  v-else
                  v-preventReClick
                  type="text"
                  @click="onOperate('process', scope.row)"
                >{{ $t('myService.processView') }}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              align="left"
              :label="$t('myService.operation')"
              :width="$t('myService.operationWidth')"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  v-preventReClick
                  type="text"
                  @click="onOperate('detail', scope.row)"
                >
                  {{ $t('myService.button.view') }}
                </el-button>
                <el-button
                  v-preventReClick
                  :disabled="!(scope.row.auditStatusEnum && scope.row.editFlag)"
                  type="text"
                  @click="onOperate('edit', scope.row)"
                >
                  {{ $t('myService.button.edit') }}
                </el-button>
                <el-button
                  v-preventReClick
                  :disabled="!scope.row.auditStatusEnum || !(['00', '1000', '1005'].includes(scope.row.auditStatusEnum.code))"
                  type="text"
                  @click="onOperate('recall', scope.row)"
                >{{ $t('myService.button.withdraw') }}</el-button>
                <el-button
                  v-preventReClick
                  :disabled="!scope.row.auditStatusEnum || !(['20', '30', '1080'].includes(scope.row.auditStatusEnum.code))"
                  type="text"
                  @click="onOperate('delete', scope.row)"
                >{{ $t('myService.button.delete') }}</el-button>
                <el-button
                  v-if="scope.row.serviceType === '20'"
                  type="text"
                  @click="onOperate('print', scope.row)"
                >{{ $t('myService.button.print') }}</el-button>
                <el-button
                  v-if="scope.row.acceptanceTestFlag"
                  v-preventReClick
                  type="text"
                  @click="onOperate('toAcceptanceTest', scope.row)"
                >{{ $t('myService.button.acceptanceTest') }}</el-button>
                <el-button
                  v-if="scope.row.interfaceOnlineFlag && !isIsvUser"
                  v-preventReClick
                  type="text"
                  @click="onOperate('toInterfaceOnline', scope.row)"
                >{{ $t('myService.button.interfaceOnline') }}</el-button>
                <el-button
                  v-if="scope.row.testInformationFlag"
                  v-preventReClick
                  type="text"
                  @click="onOperate('testInfo', scope.row)"
                >{{ $t('myService.button.testInfo') }}</el-button>
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
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
        <div class="red-color text-right" style="padding: 0 30px 20px 0;">{{ $t('myService.tip') }}</div>
      </div>
    </div>
    <!-- 流程查看 -->
    <processViewDialog
      ref="processViewDialog"
      :modal-visible="processViewObj.visible"
      :process-view-obj="processViewObj.row"
      :operation-type="processViewObj.type"
      @close="processViewObj.visible = false"
    />
    <!-- 网络开通 -->
    <networkOpeningDialog
      :visible="networkOpeningObj.visible"
      :operation-type="networkOpeningObj.type"
      :row-obj="networkOpeningObj.row"
      @close="networkOpeningObj.visible = false"
    />
    <!-- 测试信息弹出框 -->
    <el-dialog
      :title="$t('myService.dialog.title')"
      width="800"
      :visible.sync="testInfoObj.visible"
    >
      <div class="rich-text">
        <div v-html="testInfoObj.form.testInformationContent" />
      </div>
      <!-- <el-form
        ref="testInfoForm"
        :model="testInfoObj.form"
      >
        <el-form-item label="">
          <el-input
            v-model="testInfoObj.form.testInformationContent"
            type="textarea"
            autosize
            readonly
          />
        </el-form-item>
      </el-form> -->
      <div slot="footer">
        <el-button @click="testInfoObj.visible = false">{{ $t('common.button.cancel') }}</el-button>
      </div>
    </el-dialog>
    <!-- 评分对话框 -->
    <el-dialog
      :show-close="false"
      center
      :title="$t('myService.dialog.title1')"
      :visible.sync="dialogVisible"
      :modal="false"
      append-to-body
      width="766px"
      class="satisfiedDialog"
    >
      <!-- <component :is="isComponent" ref="ScoreTempleteComponent" /> -->

      <el-form ref="scoreForm" :model="scoreForm" style="text-align: left;">
        <!-- 评分问题div -->
        <el-form-item
          v-for="(item,index) in scoreForm.satisfiedList"
          :key="item.index"
          label=""
          :prop="'satisfiedList.' + index + '.value'"
          :rules="(item.configType === '10' && item.publishStatus !== '30') || ((item.configType === '20' && item.publishStatus !== '30') && item.required === '1') ? [
            { required: true, message: $t('myService.dialog.placeholder'), trigger: ['blur', 'change'] },
          ] : [
            { },
          ]"
        >
          <div v-if="item.configType === '10' && item.publishStatus !== '30'" class="ViewQuestions">
            <div class="issureContent">
              <div>
                <el-divider direction="vertical" />
              </div>
              <div style="height:auto;">
                {{ item.content }}
                <span v-if="(item.configType === '10' && item.publishStatus !== '30') || ((item.configType === '20' && item.publishStatus !== '30') && item.required === '1')" style="color:red">*</span>
              </div>
            </div>

            <el-radio-group v-model="item.value" @change="remarkChange(item)">
              <el-card v-for="(option, indexOpt) in item.options" :key="indexOpt" :class="item.value !== option.optionsConfig ? 'issureOptions':'issureOptions select_card'">
                <el-radio :label="option.optionsConfig">{{ option.optionsConfig }}  </el-radio>
                <!-- 选中后出现的备注 -->
                <el-form-item
                  v-if="option.remark === '1' && item.value !== '' && item.value !== null && item.value !== undefined && item.value === option.optionsConfig"
                  :prop="`satisfiedList.${index}.options.${indexOpt}.issueRemark`"
                  :rules="[
                    { required: true, message: $t('myService.dialog.placeholder'), trigger: 'blur' },
                  ]"
                >
                  <el-input
                    v-model="option.issueRemark"
                    type="textarea"
                    maxlength="100"
                    show-word-limit
                    :autosize="{ minRows: 2, maxRows: 6}"
                    style="margin-top: 10px;"
                    :placeholder="$t('common.placeholder.required')"
                    resize="none"
                  />
                </el-form-item>
              </el-card>
            </el-radio-group>
          </div>
          <!-- 反馈问题div -->
          <div v-if="item.configType === '20' && item.publishStatus !== '30'" class="ViewQuestions">
            <div class="issureContent">
              <div>
                <el-divider direction="vertical" />
              </div>
              <div style="height:auto;">
                {{ item.content }}
              </div>
            </div>
            <el-input
              v-model="item.value"
              type="textarea"
              maxlength="250"
              :autosize="{ minRows: 2, maxRows: 6}"
              style="margin-top: 10px;width:566px"
              :placeholder="$t('common.placeholder.required')"
              resize="none"
            />
          </div>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="enterScore('scoreForm')">{{ $t('common.button.confirm2') }}</el-button>
        <el-button @click="cancelScore()">{{ $t('common.button.cancel') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import UserCard from '@/components/UserCard'
import { mapGetters } from 'vuex'
import globalOptions from '@/utils/globalOptionsValue'
import myServiceApi from '@/api/myServiceApi'
import processViewDialog from './components/processViewDialog'
import networkOpeningDialog from '@/views/service-manage/network-opening-list/components/index'
import { addScore, getBeScore } from '@/api/acceptance/resourceController'
import acceptanceTestApi from '@/api/interface-service/acceptanceTestApi'
const defaultSearchForm = {
  dimensionName: '',
  procType: [],
  serviceTypeList: [],
  auditStatusList: [],
  updateTime: null,
  id: null,
  submitUserName: ''
}
export default {
  name: 'MyService',
  components: {
    UserCard,
    processViewDialog,
    networkOpeningDialog
  },
  filters: {
    procTypeFilter(val) {
      return val ? globalOptions.procTypeOptions.find(e => e.type === val).title : null
    },
    serviceTypeFilter(val) {
      return val ? globalOptions.serveiceOptions.find(e => e.value === val).label : null
    },
    auditStatusEnumIconFilter(val) {
      return val ? globalOptions.myServiceAuditStatusList.find(e => e.value === val.code).icon : null
    },
    auditStatusEnumTextFilter(val) {
      return val ? globalOptions.myServiceAuditStatusList.find(e => e.value === val.code).label : '-'
    }
  },
  data() {
    return {
      dialogVisible: false,
      scoreForm: {
        satisfiedList: [],
        from: '',
        fileId: '',
        fileName: '',
        formId: '',
        index: ''
      },
      isFirst: true,
      isCurrentByMe: false,
      currentRow: null,
      institutionType: '',
      processOptions: globalOptions.myServiceAuditStatusList,
      procTypeOptions: globalOptions.procTypeOptions,
      serveiceOptions: globalOptions.serveiceOptions,
      mainObj: {
        loading: false,
        height: 200,
        currentPage: 1,
        pageSize: 20,
        pagesizes: [20, 50, 100],
        total: 0,
        list: [],
        searchForm: Object.assign({}, defaultSearchForm),
        maps: new Map()
      },
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
      // 测试信息
      testInfoObj: {
        visible: false,
        form: {
          testInformationContent: ''
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    institutionTypeList() {
      return this.$store.state.user.institutionTypeList
    },
    message() {
      return this.$store.state.app.message
    },
    isIsvUser() {
      return this.$store.getters.userInfo.instnIdentity.includes('15')
    },
    language() {
      return this.$store.getters.language
    }
  },
  watch: {
    message(val) {
      if (val !== '') {
        this.fetchData()
      }
    }
  },
  created() {
    console.log('我的服务列表')
    this.isCurrentByMe = !!this.$route.params.isCurrentByMe
    if (this.institutionTypeList.length > 0) {
      this.institutionType = this.$route.params.institutionType ? this.$route.params.institutionType : this.institutionTypeList[0]
      if (this.$route.params.searchObj) {
        Object.assign(this.mainObj.searchForm, this.$route.params.searchObj)
        // console.log(this.mainObj.searchForm, '222', this.$route.params.searchObj)
      }
    }
    this.fetchData()
  },
  activated() {
    if (!this.isFirst) {
      console.log('我的服务列表缓存回来')
      this.isCurrentByMe = !!this.$route.params.isCurrentByMe
      if (this.isCurrentByMe) {
        this.onReset()
      } else {
        this.fetchData()
        this.refreshSonList()
      }
    }
    this.isFirst = false
  },
  mounted() {
    this.$nextTick(() => {
      this.mainObj.height = this.$root.$el.clientHeight - 300
    })
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      return row.isCurrentByMe ? 'success-row' : ''
    },
    tableCellClassName({ row, column, rowIndex, columnIndex }) {
      return columnIndex === 8 ? 'operate-column' : ''
    },
    // 清楚满意度选项切换备注放啊
    remarkChange(item) {
      item.options.forEach(option => {
        if (option.issueRemark && item.value !== option.optionsConfig) {
          if (option.remark === '1') {
            option.issueRemark = null
          }
        }
      })
    },
    // 取消评分
    cancelScore() {
      this.dialogVisible = false
    },
    // 新增评分
    async enterScore(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          var addFlag = true
          this.scoreForm.satisfiedList.forEach(item => {
            item.gradeIssueConfigId = item.id
            item.issueTitle = item.content
            if (item.configType === '10' && item.publishStatus !== '30') {
              // 评分问题
              item.issueOptions = item.value
              item.options.forEach(itemIdx => {
                if (itemIdx.optionsConfig === item.issueOptions) {
                  item.scoreConfig = itemIdx.scoreConfig
                  if (itemIdx.remark === '1') {
                    if (itemIdx.issueRemark === '' || itemIdx.issueRemark === null || itemIdx.issueRemark === undefined) {
                      addFlag = false
                    } else {
                      item.issueRemark = itemIdx.issueRemark
                    }
                  }
                }
              })
            } else {
              // 反馈问题
              item.issueRemark = item.value
            }
          })
          var map = {
            applyNo: this.scoreForm.applyOrdNo,
            details: this.scoreForm.satisfiedList,
            testApplyNo: this.scoreForm.subApplyId
          }
          if (addFlag) {
            console.log('表单提交', map)
            addScore(map).then(async res => {
              this.dialogVisible = false
              this.openTestRouter(this.scoreForm.row, this.scoreForm.type)
              this.$message({
                message: this.$t('myService.message.addScore'),
                type: 'success'
              })
            })
          } else {
            this.$message({
              message: this.$t('myService.message.required'),
              type: 'warning'
            })
          }
        } else {
          this.$message({
            message: this.$t('myService.message.required1'),
            type: 'warning'
          })
        }
      })
    },
    // 关于评分的方法
    openSatisfiedDialog(item, type) {
      console.log('打开小单子评分', item)
      this.scoreForm.applyOrdNo = item.applyOrdNo
      this.scoreForm.subApplyId = item.subApplyId
      this.scoreForm.row = item
      this.scoreForm.type = type
      this.dialogVisible = true
      this.showScoreTemplete()
      console.log('打开评分对话框')
    },
    // 展示已发布的评分模板信息
    async showScoreTemplete() {
      const res = await acceptanceTestApi.reqShowScoreTempleteMsg()
      this.scoreForm.satisfiedList = res.data
      console.log('展示已发布的评分模板信息', res)
    },
    tabClick(tab, event) {
      console.log(tab, event)
      this.onReset()
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
    // 获取父单号列表
    fetchData() {
      this.mainObj.loading = true
      const params = {
        page: this.mainObj.currentPage,
        pageSize: this.mainObj.pageSize,
        beginSubmitTs: this.mainObj.searchForm.updateTime
          ? `${this.mainObj.searchForm.updateTime[0]} 00:00:00`
          : null,
        endSubmitTs: this.mainObj.searchForm.updateTime
          ? `${this.mainObj.searchForm.updateTime[1]} 23:59:59`
          : null,
        institutionType: this.institutionType,
        id: this.mainObj.searchForm.id,
        submitUserName: this.mainObj.searchForm.submitUserName,
        dimensionName: this.mainObj.searchForm.dimensionName,
        procType: this.mainObj.searchForm.procType,
        serviceTypeList: this.mainObj.searchForm.serviceTypeList,
        auditStatusList: this.mainObj.searchForm.auditStatusList
      }
      myServiceApi.getMyServiceList(params).then(res => {
        if (res.code === 'ACK') {
          let isFirstMe = true
          this.mainObj.list = res.data.list.map(e => {
            e.hasChildren = e.singleSubOrder ? e.singleSubOrder.name === 'NO' : false
            e.isMainOrder = true
            e.serviceIdOnly = e.applyOrdNo + 'parent'
            e.serviceId = e.applyOrdNo
            if (e.submitUserNameId === this.userInfo.id && isFirstMe && this.isCurrentByMe) {
              e.isCurrentByMe = true
              isFirstMe = false
            } else {
              e.isCurrentByMe = false
            }
            return e
          })
          this.mainObj.total = res.data.totalRecord
          this.isCurrentByMe = false
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
        applyOrdNo: tree.applyOrdNo,
        beginSubmitTs: this.mainObj.searchForm.updateTime
          ? `${this.mainObj.searchForm.updateTime[0]} 00:00:00`
          : null,
        endSubmitTs: this.mainObj.searchForm.updateTime
          ? `${this.mainObj.searchForm.updateTime[1]} 23:59:59`
          : null,
        institutionType: this.institutionType,
        id: this.mainObj.searchForm.id,
        submitUserName: this.mainObj.searchForm.submitUserName,
        dimensionName: this.mainObj.searchForm.dimensionName,
        procType: this.mainObj.searchForm.procType,
        serviceTypeList: this.mainObj.searchForm.serviceTypeList,
        auditStatusList: this.mainObj.searchForm.auditStatusList
      }
      myServiceApi.getMyServiceSonList(params).then(res => {
        if (res.code === 'ACK') {
          resolve(res.data.map(e => {
            e.isMainOrder = false
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
    /**
     * @method: 重置
     * @param {无}
     * @return {无}
     */
    onReset() {
      this.mainObj.searchForm = Object.assign({}, defaultSearchForm)
      this.onSearch()
    },
    // 打开验收测试页面
    openTestRouter(row, type) {
      const obj = {
        parentType: row.procType,
        sonType: row.serviceType,
        operationType: type,
        isMainOrder: row.isMainOrder,
        subApplyId: row.isMainOrder ? row.applyOrdNo : row.subApplyId
      }
      this.$router.push({
        name: 'AcceptanceTest',
        query: {
          isShowTitleBefore: true,
          params: encodeURIComponent(JSON.stringify(obj))
        }
      })
    },
    /**
     * @method: 操作
     * @param {type} 操作类型
     * @param {row} 当前行数据
     * @return {无}
     */
    onOperate(type, row) {
      console.log(111, type, row)
      this.currentRow = row
      if (type === 'process') {
        this.processViewObj.visible = true
        this.processViewObj.row = row
      } else if (type === 'edit') {
        if (row.oldVersionFlag) {
          this.$nextTick(() => {
            this.$alert(this.$t('myService.alert.title1'), this.$t('common.message.tips'), {
              confirmButtonText: this.$t('common.button.confirm2'),
              callback: action => {
                console.log(action)
              }
            })
          })
        }
        if (row.serviceType === '00') {
          // 服务开通
          const obj = {
            parentType: row.procType,
            sonType: row.serviceType,
            operationType: type,
            isMainOrder: row.isMainOrder,
            subApplyId: row.isMainOrder ? row.applyOrdNo : row.subApplyId
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
          const params = {
            applyOrdNo: row.subApplyId,
            bizProcId: row.procType,
            levelOneList: [],
            levelTwoNameList: [],
            menuInstiType: row.institutionType,
            subApplyNoList: [row.subApplyId]
          }
          myServiceApi.checkAcceptanceTest(params).then(res => {
            console.log(res)
            const obj = {
              parentType: row.procType,
              sonType: row.serviceType,
              operationType: type,
              isMainOrder: row.isMainOrder,
              subApplyId: row.isMainOrder ? row.applyOrdNo : row.subApplyId
            }
            this.$router.push({
              name: 'AcceptanceTest',
              query: {
                isShowTitleBefore: true,
                params: encodeURIComponent(JSON.stringify(obj))
              }
            })
          })
        } else if (row.serviceType === '20') {
          // 接口上线
          const params = {
            applyOrdNo: row.subApplyId,
            bizProcId: row.procType,
            levelOneList: [],
            levelTwoNameList: [],
            menuInstiType: row.institutionType,
            subApplyNoList: [row.subApplyId]
          }
          myServiceApi.checkInterfaceOnline(params).then(res => {
            console.log(res)
            const obj = {
              parentType: row.procType,
              sonType: row.serviceType,
              operationType: type,
              isMainOrder: row.isMainOrder,
              subApplyId: row.isMainOrder ? row.applyOrdNo : row.subApplyId
            }
            this.$router.push({
              name: 'ServiceOnline',
              query: {
                isShowTitleBefore: true,
                params: encodeURIComponent(JSON.stringify(obj))
              }
            })
          })
        } else if (row.serviceType === '40') {
          // 权限变更 编辑
          const obj = {
            parentType: row.procType,
            sonType: row.serviceType,
            operationType: type,
            isMainOrder: row.isMainOrder,
            subApplyId: row.isMainOrder ? row.applyOrdNo : row.subApplyId
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
      } else if (type === 'detail') {
        // 服务开通
        if (row.serviceType === '00') {
          const obj = {
            parentType: row.procType,
            sonType: row.serviceType,
            operationType: type,
            isMainOrder: row.isMainOrder,
            subApplyId: row.isMainOrder ? row.applyOrdNo : row.subApplyId
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
          const applyOrdNo = row.isMainOrder ? row.applyOrdNo : row.subApplyId
          // 查看前先判断是否需要评分
          getBeScore(applyOrdNo).then(res => {
            // console.log(res.data)
            // 新增二期需求 验收测试报告审核通过的点测试报告下载触发评分
            if (res.data) {
              this.openSatisfiedDialog(row, type)
            } else {
              this.openTestRouter(row, type)
            }
          })
          // const obj = {
          //   parentType: row.procType,
          //   sonType: row.serviceType,
          //   operationType: type,
          //   isMainOrder: row.isMainOrder,
          //   subApplyId: row.isMainOrder ? row.applyOrdNo : row.subApplyId
          // }
          // this.$router.push({
          //   name: 'AcceptanceTest',
          //   query: {
          //     isShowTitleBefore: true,
          //     params: encodeURIComponent(JSON.stringify(obj))
          //   }
          // })
        } else if (row.serviceType === '20') {
          // 接口上线
          const obj = {
            parentType: row.procType,
            sonType: row.serviceType,
            operationType: type,
            isMainOrder: row.isMainOrder,
            subApplyId: row.isMainOrder ? row.applyOrdNo : row.subApplyId
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
            subApplyId: row.isMainOrder ? row.applyOrdNo : row.subApplyId
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
      } else if (type === 'recall') {
        this.$confirm(this.$t('myService.alert.title2'), this.$t('common.message.tips'), {
          confirmButtonText: this.$t('common.button.confirm2'),
          cancelButtonText: this.$t('common.button.cancel'),
          type: 'warning'
        })
          .then(() => {
            const params = {
              id: row.subApplyId
            }
            myServiceApi.recallMyService(params).then(res => {
              if (res.code === 'ACK') {
                this.$message({
                  type: 'success',
                  message: this.$t('myService.message.msg1')
                })
                this.fetchData()
                this.refreshSonList()
              }
            })
          }).catch(() => {})
      } else if (type === 'delete') {
        this.$confirm(this.$t('myService.alert.title3'), this.$t('common.message.tips'), {
          confirmButtonText: this.$t('common.button.confirm2'),
          cancelButtonText: this.$t('common.button.cancel'),
          type: 'warning'
        })
          .then(() => {
            const params = {
              applyOrdNo: row.applyOrdNo,
              subApplyId: row.subApplyId
            }
            myServiceApi.deleteMyService(params).then(res => {
              if (res.code === 'ACK') {
                this.$message({
                  type: 'success',
                  message: this.$t('myService.message.msg2')
                })
                this.fetchData()
                this.refreshSonList()
              }
            })
          }).catch(() => {})
      } else if (type === 'print') {
        const routeData = this.$router.resolve({
          name: 'serviceOnlinePrint',
          query: {
            applyOrdNo: row.applyOrdNo,
            institutionType: row.institutionType,
            type: 'print'
          }
        })
        window.open(routeData.href, '_blank')
      } else if (type === 'toAcceptanceTest') {
        // 服务开通通过的单子可以去验收测试
        const params = {
          bizProcId: row.procType,
          levelOneList: [],
          levelTwoNameList: [],
          menuInstiType: row.institutionType,
          subApplyNoList: [row.subApplyId]
        }
        myServiceApi.checkAcceptanceTest(params).then(res => {
          console.log(res)
          const obj = {
            parentType: row.procType,
            operationType: 'add',
            institutionType: row.institutionType,
            subApplyNoList: [row.subApplyId]
          }
          this.$router.push({
            name: 'AcceptanceTest',
            query: {
              isShowTitleBefore: true,
              params: encodeURIComponent(JSON.stringify(obj))
            }
          })
        })
      } else if (type === 'toInterfaceOnline') {
        // 验收测试通过的单子可以去接口上线
        const params = {
          bizProcId: row.procType,
          levelOneList: [],
          levelTwoNameList: [],
          menuInstiType: row.institutionType,
          subApplyNoList: [row.subApplyId]
        }
        myServiceApi.checkInterfaceOnline(params).then(res => {
          console.log(res)
          const obj = {
            parentType: row.procType,
            operationType: 'add',
            institutionType: row.institutionType,
            subApplyNoList: [row.subApplyId]
          }
          this.$router.push({
            name: 'ServiceOnline',
            query: {
              isShowTitleBefore: true,
              params: encodeURIComponent(JSON.stringify(obj))
            }
          })
        })
      } else if (type === 'testInfo') {
        const params = {
          subApplyOrdNo: row.subApplyId
        }
        myServiceApi.getTestInfoDetail(params).then(res => {
          console.log(res.data)
          this.testInfoObj.visible = true
          this.testInfoObj.form.testInformationContent = res.data
        })
      }
    }
  }
}
</script>
<style lang="scss">
.satisfiedDialog {
  // width: 766px;

  .el-dialog{
    background-color: #F2F7FF;
    .el-form-item .el-form-item {
      margin-bottom: 13px;
    }
  }
  .el-dialog .el-dialog__header{
    border-bottom: none;
  background-color: #F2F7FF;
  }

  .el-dialog .el-dialog__header .el-dialog__title{
    width: 140px;
    height: 28px;
    font-size: 28px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    line-height: 48px;
    color: #303030;
    opacity: 1;
  }

  .el-divider--vertical{
    width: 3px;
    height: 15px;
    background: #2C76D1;
    opacity: 1;
  }

  .el-card__body {
    padding: 10px;
  }

  .el-card.is-always-shadow{
    margin: 5px 0px;
    width: 566px;
  }

   .issureContent{
      display: flex;
      flex:1;
      flex-direction: row;
      // width: 292px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 21px;
      color: #303030;
      opacity: 1;
      margin-top: 16px;

      .el-divider{
        margin-left: 0;
        width: 3px;
        // height: auto;
        background: #2C76D1;
        opacity: 1;
      }
    }
  .el-dialog .el-dialog__body{
    padding: 0px 100px;
  }

  .el-dialog .el-dialog__footer{
    background-color:#F2F7FF;
  }
}
</style>
<style lang="scss" scoped>
::v-deep.el-table {
  .success-row td {
    background: #f0f9eb!important;
  }
  .operate-column {
    .cell.el-tooltip {
      white-space: normal;
    }
  }
}
</style>
