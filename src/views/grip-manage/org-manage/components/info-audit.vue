<template>
  <div>
    <div class="main-body">
      <div class="main-body-top">
        <el-form
          ref="searchForm"
          :model="mainObj.searchForm"
          label-width="80px"
          label-position="left"
          inline
        >
          <el-form-item label="机构名称" prop="cnFullName">
            <el-input v-model.trim="mainObj.searchForm.cnFullName" clearable />
          </el-form-item>
          <el-form-item label="机构身份" prop="instiType">
            <el-select
              v-model="mainObj.searchForm.instiType"
              placeholder="--全部--"
              clearable
            >
              <el-option
                v-for="item in instiTypeList"
                :key="item.code"
                :label="item.text"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="提交时间" prop="submitDate">
            <el-date-picker
              v-model="mainObj.searchForm.submitDate"
              type="datetimerange"
              range-separator="至"
              start-placeholder="--起始时间--"
              end-placeholder="--结束时间--"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
          </el-form-item>
          <el-form-item label="审核人" prop="auditUserName">
            <el-input
              v-model.trim="mainObj.searchForm.auditUserName"
              clearable
            />
          </el-form-item>
          <el-form-item label="审核状态" prop="instiAuditStatus">
            <el-select
              v-model="mainObj.searchForm.instiAuditStatus"
              placeholder="--全部--"
              clearable
            >
              <el-option
                v-for="item in auditStatusOptions"
                :key="item.code"
                :label="item.label"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="审核时间" prop="auditDate">
            <el-date-picker
              v-model="mainObj.searchForm.auditDate"
              type="datetimerange"
              range-separator="至"
              start-placeholder="--起始时间--"
              end-placeholder="--结束时间--"
              value-format="yyyy-MM-dd HH:mm:ss"
            />
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
              prop="typeList"
              label="机构身份"
              min-width="150"
            >
              <template slot-scope="scope">
                <span> {{ scope.row.typeList | typeListFilter }}</span>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="sName"
              label="提交人"
              min-width="150"
            />
            <el-table-column
              show-overflow-tooltip
              prop="businessId"
              label="服务单号"
              min-width="160"
            />
            <el-table-column
              show-overflow-tooltip
              prop="commitTime"
              label="提交时间"
              width="160"
            />
            <el-table-column
              show-overflow-tooltip
              prop="auditStatus"
              label="审核状态"
              align="center"
              min-width="100"
            >
              <template slot-scope="scope">
                <span
                  v-if="scope.row.auditStatus.name === 'PASS'"
                  style="color: #0abc6f"
                >通过</span>
                <span
                  v-else-if="scope.row.auditStatus.name === 'REFUSE'"
                  style="color: #f66c6c"
                >拒绝</span>
                <span
                  v-else-if="scope.row.auditStatus.name === 'CANCEL'"
                >已取消</span>
                <span
                  v-else-if="scope.row.auditStatus.name === 'AUDIT_PROCESS'"
                >审核中</span>
                <span
                  v-else-if="scope.row.auditStatus.name === 'WAIT_PROCESS'"
                >待审核</span>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="auditUser"
              label="审核人"
              align="center"
              min-width="150"
            />
            <el-table-column
              show-overflow-tooltip
              prop="lastMntTs"
              label="审核时间"
              width="160"
            />
            <el-table-column
              label="操作"
              align="center"
              :width="isAdmin ? 120 : 100"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  v-preventReClick
                  type="text"
                  @click="onOperate('view', scope.row)"
                >查看</el-button>
                <el-button
                  v-if="!isAdmin"
                  v-preventReClick
                  type="text"
                  :disabled="scope.row.auditFlag === '1'"
                  @click="onOperate('audit', scope.row)"
                >审核</el-button>
                <el-button
                  v-if="isAdmin"
                  v-preventReClick
                  type="text"
                  :disabled="
                    scope.row.auditStatus.name !== 'WAIT_PROCESS' &&
                      scope.row.auditStatus.name !== 'AUDIT_PROCESS'
                  "
                  @click="onOperate('process', scope.row)"
                >流程干预</el-button>
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
    <!-- 流程干预 -->
    <el-dialog
      title="流程干预"
      width="700"
      class="custom-dialog"
      :visible.sync="processVisible"
    >
      <div slot="footer">
        <el-button
          type="success"
          @click="onOperate('pass')"
        >一键通过</el-button>
        <el-button
          type="danger"
          :disabled="processRow.auditStatus.name !== 'AUDIT_PROCESS'"
          @click="onOperate('refuse')"
        >一键回退</el-button>
      </div>
    </el-dialog>
    <!-- 查看/审核弹窗 -->
    <el-dialog
      class="audit-dialog audit-footer"
      width="900px"
      :title="auditDialogObj.title"
      :visible.sync="auditDialogObj.visible"
      :modal-append-to-body="false"
      :close-on-click-modal="false"
      destroy-on-close
    >
      <div class="audit-dialog-top">
        <img src="@/assets/style/org/head-photo.png" alt="head-photo">
        <span>{{ auditDialogObj.row.cnFullName }}</span>
      </div>
      <div class="audit-dialog-content">
        <section class="left">
          <div class="left-first">
            <div class="icon delete" />
            <div class="text">删除</div>
            <div class="icon edit" />
            <div class="text">修改</div>
            <div class="icon add" />
            <div class="text">新增</div>
          </div>
          <div class="left-title">4位码</div>
          <div class="left-title">6位码</div>
          <div class="left-title">18位码</div>
          <div class="left-title">机构身份</div>
        </section>
        <section class="right before">
          <div class="right-title">原始信息</div>
          <div>{{ auditDialogObj.old.fourCode }}</div>
          <div>{{ auditDialogObj.old.sixCode }}</div>
          <div>{{ auditDialogObj.old.cfetsInstnCdNew }}</div>
          <div>
            <div
              v-for="item in calculateOrgList('before')"
              :key="item.name"
              :class="item.type"
            >
              {{ item.name }}
            </div>
          </div>
        </section>
        <section class="right after">
          <div class="right-title">修改后信息</div>
          <div>{{ auditDialogObj.new.fourCode }}</div>
          <div>{{ auditDialogObj.new.sixCode }}</div>
          <div
            :style="{
              color:
                auditDialogObj.new.cfetsInstnCdNew ===
                auditDialogObj.old.cfetsInstnCdNew
                  ? ''
                  : '#f56c6c',
            }"
          >
            {{ auditDialogObj.new.cfetsInstnCdNew }}
          </div>
          <div>
            <div
              v-for="item in calculateOrgList('after')"
              :key="item.name"
              class="right-org"
              :class="item.type"
            >
              {{ item.name }}
            </div>
          </div>
        </section>
      </div>
      <div class="audit-dialog-file">
        <div class="audit-dialog-file-title">附件内容</div>
        <div class="audit-dialog-file-wrap">
          <el-button
            v-for="(item, index) in auditDialogObj.file"
            :key="index"
            type="text"
            @click="downloadFile(item.fileName, item.fileId)"
          >{{ item.fileName }}</el-button>
        </div>
      </div>
      <div v-if="auditDialogObj.type === 'audit'" slot="footer">
        <el-form ref="form" :model="auditDialogObj.form" label-position="top">
          <el-form-item label="备注">
            <el-input
              v-model="auditDialogObj.form.auditRemark"
              type="textarea"
            />
          </el-form-item>
        </el-form>
        <el-button
          v-preventReClick
          type="success"
          @click="onOperate('submitPass')"
        >通过</el-button>
        <el-button
          v-preventReClick
          type="danger"
          @click="onOperate('submitRefuse')"
        >拒绝</el-button>
      </div>
      <div v-if="auditDialogObj.type === 'view'" class="remark">
        <p class="remark-title">备注</p>
        <el-card v-for="(item, index) in auditDialogObj.auditDetail" :key="index">
          <p>{{ item }}</p>
        </el-card>
      </div>
    </el-dialog>
    <!-- 查看弹窗 -->
    <el-dialog
      class="view-dialog"
      width="1000px"
      :title="viewDialogObj.title"
      :visible.sync="viewDialogObj.visible"
      :modal-append-to-body="false"
    >
      <el-form
        ref="viewDialogForm"
        :model="viewDialogObj.form"
        :rules="viewDialogObj.rules"
        label-width="155px"
        label-position="left"
      >
        <p class="view-dialog-title">账户信息</p>
        <table>
          <tr>
            <td>用户名</td>
            <td>{{ viewDialogObj.form.sName }}</td>
            <td>电子邮箱</td>
            <td>{{ viewDialogObj.form.email }}</td>
          </tr>
          <tr>
            <td>手机号码</td>
            <td>{{ viewDialogObj.form.phoneNo }}</td>
          </tr>
        </table>
        <p class="view-dialog-title">机构信息</p>
        <table>
          <tr>
            <td>机构名称</td>
            <td>{{ viewDialogObj.form.cnFullName }}</td>
            <td>机构身份</td>
            <td>
              {{ viewDialogObj.form.typeList }}
            </td>
          </tr>
          <tr>
            <td>统一社会信用代码</td>
            <td colspan="3">{{ viewDialogObj.form.instnCd }}</td>
          </tr>
          <tr>
            <td>附件</td>
            <td colspan="3">
              <el-button
                v-for="(item, index) in viewDialogObj.form.cassInstiFileDtoList"
                :key="index"
                type="text"
                @click="downloadFile(item.fileName, item.fileId)"
              >{{ item.fileName }}</el-button>
            </td>
          </tr>
          <tr>
            <td>审核状态</td>
            <td colspan="3">{{ viewDialogObj.form.auditStatus }}</td>
          </tr>
        </table>
        <p class="view-dialog-title margin30">审核反馈</p>
        <table>
          <tr>
            <td>审核反馈</td>
            <td colspan="3" style="width: 80%">
              <div
                v-for="(item, index) in viewDialogObj.form.auditRemarkList"
                :key="index"
              >
                {{ item ? item : '-' }}<br>
              </div>
            </td>
          </tr>
        </table>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import gripManageApi from '@/api/gripManageApi'
import { getOrgTypeList } from '@/api/register'
import { fileDownload } from '@/api/announcement'
import globalOptions from '@/utils/globalOptionsValue'
import { mapGetters } from 'vuex'

const defaultObj = {
  cnFullName: '',
  fourCode: '',
  sixCode: '',
  instnCd: '',
  instnType: ''
}
export default {
  name: 'InfoAudit',
  filters: {
    typeListFilter(val) {
      return val.join('、')
    }
  },
  data() {
    return {
      isAdmin: false,
      instiTypeList: [],
      auditStatusOptions: globalOptions.auditStatus,
      processRow: {
        auditStatus: {}
      },
      mainObj: {
        loading: false,
        list: [],
        pageSize: 20,
        currentPage: 1,
        total: 0,
        searchForm: {
          cnFullName: '',
          instiType: '',
          instiAuditStatus: '',
          auditDate: null,
          submitDate: null,
          auditUserName: ''
        }
      },
      auditDialogObj: {
        visible: false,
        row: {},
        form: {
          auditRemark: ''
        },
        new: Object.assign({}, defaultObj),
        old: Object.assign({}, defaultObj),
        file: [],
        allList: [
          {
            code: '00',
            name: '本币市场成员',
            type: 'normal'
          },
          {
            code: '05',
            name: '外汇市场成员',
            type: 'normal'
          },
          {
            code: '10',
            name: '信息商',
            type: 'normal'
          },
          {
            code: '15',
            name: '系统接入开发机构',
            type: 'normal'
          }
        ],
        auditDetail: []
      },
      viewDialogObj: {
        visible: false,
        form: {
          auditRemarkList: ''
        }
      },
      processVisible: false
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  created() {
    console.log('机构信息审核')
    this.isAdmin = this.userInfo.roleType.code === 'super-admin'
    this.getOrgTypeList()
    this.fetchData()
  },
  methods: {
    async getOrgTypeList() {
      try {
        const { data } = await getOrgTypeList()
        this.instiTypeList = data
      } catch (e) {
        console.log(e)
      }
    },
    calculateOrgList(type) {
      const allList = JSON.parse(JSON.stringify(this.auditDialogObj.allList))
      const oldList = this.auditDialogObj.old.instnType.split(',')
      const newList = this.auditDialogObj.new.instnType.split(',')
      if (type === 'before') {
        return allList.filter((e) => oldList.includes(e.code))
      } else if (type === 'after') {
        return allList
          .filter((e) => oldList.includes(e.code) || newList.includes(e.code))
          .map((e) => {
            if (!oldList.includes(e.code) && newList.includes(e.code)) {
              e.type = 'add'
            } else if (oldList.includes(e.code) && !newList.includes(e.code)) {
              e.type = 'delete'
            }
            return e
          })
      } else {
        return []
      }
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
      this.fetchData()
    },
    onReset() {
      this.$refs.searchForm.resetFields()
      this.fetchData()
    },
    fetchData() {
      this.mainObj.loading = true
      const params = {
        page: this.mainObj.currentPage,
        pageSize: this.mainObj.pageSize,
        instiAuditStatus: this.mainObj.searchForm.instiAuditStatus,
        cnFullName: this.mainObj.searchForm.cnFullName,
        instiType: this.mainObj.searchForm.instiType,
        auditUserName: this.mainObj.searchForm.auditUserName,
        auditStartTime: this.mainObj.searchForm.auditDate ? this.mainObj.searchForm.auditDate[0] : '',
        auditEndTime: this.mainObj.searchForm.auditDate ? this.mainObj.searchForm.auditDate[1] : '',
        commitStartTime: this.mainObj.searchForm.submitDate ? this.mainObj.searchForm.submitDate[0] : '',
        commitEndTime: this.mainObj.searchForm.submitDate ? this.mainObj.searchForm.submitDate[1] : ''
      }
      gripManageApi
        .auditAgencySearch(params)
        .then((res) => {
          if (res.code === 'ACK') {
            this.mainObj.list = res.data.list
            this.mainObj.total = res.data.totalRecord
          }
        })
        .finally(() => {
          setTimeout(() => {
            this.mainObj.loading = false
          }, 500)
        })
    },
    onOperate(type, row) {
      if (type === 'audit') {
        this.auditDialogObj.visible = true
        this.auditDialogObj.title = '机构信息审核'
        this.auditDialogObj.type = type
        this.auditDialogObj.row = row
        this.auditDialogObj.form.auditRemark = ''
        const params = {
          instiId: row.instiId,
          businessId: row.businessId
        }
        gripManageApi.auditAgencyDetail(params).then((res) => {
          if (res.code === 'ACK') {
            this.auditDialogObj.new =
              res.data.new || Object.assign({}, defaultObj)
            this.auditDialogObj.old =
              res.data.old || Object.assign({}, defaultObj)
            this.auditDialogObj.new.cfetsInstnCdNew =
              this.auditDialogObj.new.cfetsInstnCdNew ||
              this.auditDialogObj.new.cfetsInstnCd
            this.auditDialogObj.old.cfetsInstnCdNew =
              this.auditDialogObj.old.cfetsInstnCdNew ||
              this.auditDialogObj.old.cfetsInstnCd
            this.auditDialogObj.file = res.data.file || []
          }
        })
      } else if (type === 'view') {
        this.auditDialogObj.visible = true
        this.auditDialogObj.title = '查看'
        this.auditDialogObj.type = type
        this.auditDialogObj.row = row
        const params = {
          instiId: row.instiId,
          businessId: row.businessId
        }
        gripManageApi.auditAgencyDetail(params).then((res) => {
          if (res.code === 'ACK') {
            this.auditDialogObj.new =
              res.data.new || Object.assign({}, defaultObj)
            this.auditDialogObj.old =
              res.data.old || Object.assign({}, defaultObj)
            this.auditDialogObj.new.cfetsInstnCdNew =
              this.auditDialogObj.new.cfetsInstnCdNew ||
              this.auditDialogObj.new.cfetsInstnCd
            this.auditDialogObj.old.cfetsInstnCdNew =
              this.auditDialogObj.old.cfetsInstnCdNew ||
              this.auditDialogObj.old.cfetsInstnCd
            this.auditDialogObj.file = res.data.file || []
            this.auditDialogObj.auditDetail = res.data.auditDetail || []
          }
        })
      } else if (type === 'submitPass' || type === 'submitRefuse') {
        const params = {
          businessId: this.auditDialogObj.row.businessId,
          auditRemark: this.auditDialogObj.form.auditRemark,
          instiAuditStatus: type === 'submitPass' ? 'PASS' : 'REFUSE',
          instiId: this.auditDialogObj.row.instiId
        }
        gripManageApi.auditAgency(params).then((res) => {
          if (res.code === 'ACK') {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.fetchData()
            this.auditDialogObj.visible = false
          }
        })
      } else if (type === 'process') {
        this.processVisible = true
        this.processRow = row
      } else if (type === 'pass') {
        const params = {
          businessId: this.processRow.businessId,
          instiId: this.processRow.instiId,
          instiAuditStatus: 'PASS'
        }
        gripManageApi.auditAgency(params).then((res) => {
          if (res.code === 'ACK') {
            this.fetchData()
            this.processVisible = false
          }
        })
      } else if (type === 'refuse') {
        const params = {
          businessId: this.processRow.businessId,
          instiId: this.processRow.instiId,
          instiAuditStatus: 'REFUSE'
        }
        gripManageApi.auditAgency(params).then((res) => {
          if (res.code === 'ACK') {
            this.fetchData()
            this.processVisible = false
          }
        })
      }
    },
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$nextTick(() => {
          this.$refs[formName].resetFields()
        })
      }
    },
    downloadFile(name, id) {
      fileDownload(id).then((res) => {
        this.download(res.data, name)
      })
    },
    download(data, filename) {
      if (!data) {
        return
      }
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', filename)

      document.body.appendChild(link)
      link.click()
    },
    showTooltip(text, num) {
      return !(text && text.length > num)
    }
  }
}
</script>

<style lang="scss" scoped>
.text-bold {
  font-size: 18px;
  font-family: Source Han Sans CN;
  font-weight: bold;
  color: #333333;
}
.el-date-editor {
  width: 390px !important;
}
.audit-dialog {
  &-top {
    display: flex;
    align-items: center;
    & > span {
      margin-left: 8px;
      font-size: 20px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #333333;
    }
  }
  &-content {
    display: flex;
    & > section {
      & > div {
        min-height: 48px;
        line-height: 48px;
        &:nth-child(even) {
          background-color: #f3f6fe;
        }
      }
    }
    .left {
      width: 374px;
      &-first {
        display: flex;
        align-items: center;
        .icon {
          width: 8px;
          height: 8px;
          margin: 0 6px 0 12px;
          &.delete {
            background-color: #b7b7b7;
            position: relative;
            &:before {
              content: '';
              width: 16px;
              height: 2px;
              position: absolute;
              top: 50%;
              left: 50%;
              background: #b7b7b7;
              transform: translate(-8px, -1px);
            }
          }
          &.edit {
            background-color: #f56c6c;
          }
          &.add {
            background-color: #67c23a;
          }
        }
        .text {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #b7b7b7;
        }
      }
      &-title {
        @extend .text-bold;
        padding-left: 14px;
      }
    }
    .right {
      text-align: center;
      background: #fff;
      box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
      border-radius: 8px;
      &.before {
        width: 374px;
        border: 1px solid #d1d5de;
        .right-title:before {
          background: #d1d5de;
        }
      }
      &.after {
        margin-left: 24px;
        width: 374px;
        border: 1px solid #2c76d1;
        .right-title:before {
          background: #2c76d1;
        }
      }
      &-title {
        @extend .text-bold;
        position: relative;
        width: 200px;
        margin: 0 auto;
        &:before {
          content: '';
          width: 200px;
          height: 6px;
          border-radius: 8px;
          position: absolute;
          left: 50%;
          transform: translateX(-100px);
        }
      }
      &-org {
        &.add {
          color: #67c23a;
        }
        &.delete {
          color: #b7b7b7;
          text-decoration: line-through;
        }
      }
    }
  }
  &-file {
    margin: 16px 0;
    min-height: 48px;
    background: #f3f6fe;
    display: flex;
    align-items: center;
    &-title {
      @extend .text-bold;
      width: 200px;
      padding-left: 14px;
    }
    &-wrap {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
  }
  .remark{
    .remark-title {
        font-size:16px;
    }
    .el-card{
      margin-bottom: 10px;
    }
  }
}
.audit-footer {
  ::v-deep .el-dialog__footer {
    border: 1px solid #d1d5de;
    background: #fbfcff;
    .el-form-item {
      text-align: initial;
    }
  }
}
</style>
