<template>
  <div>
    <div class="header">
      <el-form
        ref="searchForm"
        class="top-form"
        :model="mainObj.searchForm"
        label-width="80px"
        label-position="left"
        inline
      >
        <div class="top-main">
          <div class="top-main-left">
            <el-row>
              <el-col :span="8">
                <el-form-item
                  label="机构名称"
                  prop="cnFullName"
                >
                  <el-input
                    v-model.trim="mainObj.searchForm.cnFullName"
                    v-limitBytes="300"
                    clearable
                  />
                </el-form-item>
                <el-form-item
                  label="审核时间"
                  class="date-input"
                  prop="auditDate"
                >
                  <el-date-picker
                    v-model="mainObj.searchForm.auditDate"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="--起始时间--"
                    end-placeholder="--结束时间--"
                    value-format="yyyy-MM-dd"
                  />
                </el-form-item>
                <el-form-item
                  label="统一社会信用代码"
                  prop="instnCd"
                  class="init-input"
                  label-width="130px"
                >
                  <el-input v-model.trim="mainObj.searchForm.instnCd" clearable />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="机构身份"
                  prop="instiType"
                >
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
                <el-form-item
                  label="机构状态"
                  prop="instiStatus"
                >
                  <el-select
                    v-model="mainObj.searchForm.instiStatus"
                    placeholder="--全部--"
                    clearable
                  >
                    <el-option
                      v-for="item in instiStatus"
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
              </el-col>
              <el-col :span="8">
                <el-form-item
                  label="提交时间"
                  class="date-input"
                  prop="submitDate"
                >
                  <el-date-picker
                    v-model="mainObj.searchForm.submitDate"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="--起始时间--"
                    end-placeholder="--结束时间--"
                    value-format="yyyy-MM-dd"
                  />
                </el-form-item>
                <el-form-item
                  label="审核人"
                  prop="auditUser"
                >
                  <el-input v-model.trim="mainObj.searchForm.auditUser" clearable />
                </el-form-item>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-form>
    </div>
    <div class="body">
      <div class="add-btn-panel">
        <el-button
          type="primary"
          icon="el-icon-circle-plus el-icon--right"
          class="add-btn"
          @click="onOperate('add')"
        >新增</el-button>
      </div>
      <el-table
        :data="mainObj.list"
        fit
        stripe
        border
        highlight-current-row
        :header-row-class-name="tableRowClassName"
        :header-row-style="{height: '42px'}"
        :header-cell-style="{padding: 0}"
        :row-style="{height: '42px'}"
        :cell-style="{padding: 0}"
      >
        <el-table-column
          show-overflow-tooltip
          prop="cnFullName"
          label="机构名称"
          min-width="150"
        />
        <el-table-column
          show-overflow-tooltip
          prop="labelType"
          label="是否为VIP机构"
          min-width="150"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.labelType == '20'">是</span>
            <span v-else>否</span>
          </template>
        </el-table-column>
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
          prop="instnCd"
          label="统一社会信用代码"
          min-width="150"
        />
        <el-table-column
          show-overflow-tooltip
          prop="cassInstiFileDtoList"
          label="附件内容"
          min-width="150"
        >
          <template slot-scope="scope">
            <span> {{ scope.row.cassInstiFileDtoList | fileNameFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="commitTime"
          label="提交时间"
          min-width="150"
        />
        <el-table-column
          show-overflow-tooltip
          prop="instiStatus"
          label="机构状态"
          align="center"
          min-width="100"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.instiStatus.name === 'ENABLE'"
              style="color: #0ABC6F"
            >通过</span>
            <span
              v-else-if="scope.row.instiStatus.name === 'REFUSE'"
              style="color: #F66C6C"
            >拒绝</span>
            <span v-else-if="scope.row.instiStatus.name === 'WAITING'">审核中</span>
            <span v-else-if="scope.row.instiStatus.name === 'WAIT_PROCESS'">待审核</span>
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="auditUser"
          label="审核人"
          align="center"
          min-width="130"
        />
        <el-table-column
          show-overflow-tooltip
          prop="lastMntTs"
          label="审核时间"
          min-width="150"
        />
        <el-table-column
          label="操作"
          align="center"
          width="140"
          fixed="right"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="onOperate('view', scope.row)"
            >查看</el-button>
            <el-button
              v-preventReClick
              type="text"
              :disabled="scope.row.flag === false"
              @click="onOperate('modify', scope.row)"
            >修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block">
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
    <!-- 新增/编辑/查看弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      class="add-dialog"
      :title="userDialogObj.title"
      :visible.sync="userDialogObj.visible"
      :modal-append-to-body="false"
      width="650px"
      @close="userDialogObj.visible = false"
    >
      <el-form
        ref="userForm"
        :model="userDialogObj.form"
        :rules="userDialogObj.type === 'view' ? null : userDialogObj.rules"
        :disabled="userDialogObj.type === 'view'"
        label-width="144px"
        label-position="left"
        inline
      >
        <el-form-item label="机构名称" prop="cnFullName">
          <el-input
            v-model="userDialogObj.form.cnFullName"
            v-limitBytes="300"
            placeholder="请输入机构名称"
            clearable
          />
        </el-form-item>
        <el-form-item label="机构身份" prop="instiType">
          <template slot="label">
            <el-tooltip placement="bottom-start">
              <div slot="content">
                <p>1.请根据实际业务勾选机构身份，可选类别包括：①本币/外汇/系统接入开发机构：可勾选一个或多个；②信息商：如果勾选信息商，则其他三个不能勾选；</p>
                <p>2.当选中上述两种类别中任意一类，另一类置灰不可选，如需选择另一类别，请先取消勾选当前选中项后操作；</p>
              </div>
              <span>机构身份<i class="el-icon-question" /></span>
            </el-tooltip>
          </template>
          <el-checkbox-group
            v-model="userDialogObj.form.instiType"
            @change="instiTypeChange"
          >
            <el-checkbox
              v-for="item in instiTypeList"
              :key="item.code"
              :label="item.code"
              :disabled="item.disabled"
              style="width: 130px"
            >{{ item.text }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 追加的VIP选项 -->
        <el-form-item label="是否VIP" prop="isVIP">
          <!-- <el-input
            v-model="userDialogObj.form.isVIP"
            :disabled="userDialogObj.type !== 'add'"
            placeholder="请输入统一社会信用代码"
            clearable
          /> -->
          <el-radio-group v-model="userDialogObj.form.isVIP">
            <el-radio label="20">是</el-radio>
            <el-radio label="10">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="统一社会信用代码" prop="instnCd">
          <el-input
            v-model="userDialogObj.form.instnCd"
            :disabled="userDialogObj.type !== 'add'"
            placeholder="请输入统一社会信用代码"
            clearable
          />
        </el-form-item>
        <el-form-item label="附件">
          <UploadFiles
            v-if="userDialogObj.type !== 'view'"
            v-model="userDialogObj.form.fileIdList"
            :tips="tips"
            :accept="accept"
            @uploaded="uploadedId"
          />
          <span
            v-for="item in userDialogObj.viewForm.cassInstiFileDtoList"
            v-else
            :key="item.fileId"
            class="file-text"
            @click="downloadFile(item.fileName, item.fileId)"
          >{{ item.fileName }}</span>
        </el-form-item>
        <el-form-item v-if="userDialogObj.type === 'view'" label="机构状态">
          <el-input
            v-model="userDialogObj.viewForm.instiStatus"
            placeholder=""
            disabled
            clearable
          />
        </el-form-item>
        <el-form-item v-if="userDialogObj.type === 'view'" label="审核反馈">
          <el-input
            v-model="userDialogObj.viewForm.auditRemark"
            type="textarea"
            class="audit-textarea"
            placeholder=""
            disabled
            clearable
          />
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <span slot="footer">
          <el-button
            v-if="userDialogObj.type !== 'view'"
            v-preventReClick
            type="primary"
            class="button-primary"
            @click="onOperate('submit')"
          >确定</el-button>
          <el-button
            class="button-default"
            @click="userDialogObj.visible = false"
          >取消</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  validSocialCode
} from '@/utils/validate'
import gripManageApi from '@/api/gripManageApi'
import { getOrgTypeList } from '@/api/register'
import { fileDownload } from '@/api/announcement'
import UploadFiles from '@/components/UploadFiles'
const defaultSearchForm = {
  instiStatus: '',
  instiType: '',
  cnFullName: '',
  isVIP: '',
  instnCd: '',
  auditUser: '',
  auditDate: '',
  submitDate: '',
  radio: 10
}
const defaultUserForm = {
  cnFullName: '',
  instiType: [],
  instnCd: '',
  isVIP: '',
  fileIdList: []
}
export default {
  name: 'Audit',
  filters: {
    typeListFilter(val) {
      return val.join('，')
    },
    fileNameFilter(val) {
      return val ? val.map(e => e.fileName).join('，') : ''
    }
  },
  components: {
    UploadFiles
  },
  data() {
    const validateSocial = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入统一社会信用代码'))
      } else if (!validSocialCode(value)) {
        callback(new Error('统一社会信用代码格式不正确'))
      } else {
        callback()
      }
    }
    const validateFile = (rule, value, callback) => {
      if (this.userDialogObj.fileIdList.length === 0) {
        callback(new Error('请上传附件'))
      } else {
        callback()
      }
    }
    return {
      accept: '.jpg,.jpeg,.png,.pdf',
      tips: '请提供1.营业执照2.组织机构代码证3.金融业务许可证4.身份证或工作证的原件照片或彩色扫描件（正副本均可），文字/盖章清晰可辨认，格式要求jpg、jpeg、png、pdf，不超过10MB',
      mainObj: {
        list: [],
        pageSize: 20,
        currentPage: 1,
        total: 0,
        searchForm: Object.assign({}, defaultSearchForm)
      },
      instiTypeList: [],
      instiStatus: '',
      userDialogObj: {
        visible: false,
        tile: '',
        type: '',
        fileIdList: [],
        form: Object.assign({}, defaultUserForm),
        viewForm: {
          instnId: '',
          cassInstiFileDtoList: [],
          instiStatus: '',
          auditRemark: ''
        },
        rules: {
          cnFullName: [
            { required: true, message: '机构名称不能为空', trigger: 'blur' }
          ],
          instiType: [
            {
              type: 'array',
              required: true,
              message: '请选择机构身份',
              trigger: 'change'
            }
          ],
          isVIP: [
            { required: true, message: '是否为VIP不能为空', trigger: 'blur' }
          ],
          instnCd: [
            { required: true, validator: validateSocial, trigger: 'blur' }
          ],
          fileIdList: [
            { required: true, validator: validateFile, trigger: 'change' }
          ]
        }
      }
    }
  },
  created() {
    this.fetchData()
    this.getInstiStatus()
    this.getCheckboxlist()
    // this.onSearch()
  },
  methods: {
    async getCheckboxlist() {
      try {
        const { data } = await getOrgTypeList()
        data.forEach(item => {
          item.disabled = false
        })
        this.instiTypeList = data
      } catch (e) {
        console.log(e)
      }
    },
    downloadFile(name, id) {
      fileDownload(id).then(res => {
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
    instiTypeChange(value) {
      if (value.length === 0) {
        this.instiTypeList.forEach(item => {
          item.disabled = false
        })
      } else {
        if (value.includes('10')) {
          this.instiTypeList.map(e => {
            if (e.code !== '10') {
              e.disabled = true
            }
            return e
          })
        } else {
          this.instiTypeList.map(e => {
            if (e.code === '10') {
              e.disabled = true
            }
            return e
          })
        }
      }
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return 'header-row-th'
      }
    },
    onSearch() {
      this.mainObj.currentPage = 1
      this.fetchData()
    },
    onReset() {
      if (this.$refs['searchForm']) {
        this.$refs['searchForm'].resetFields()
        this.mainObj.searchForm.auditDate = null
        this.mainObj.searchForm.submitDate = null
      }
      this.onSearch()
    },
    getInstiStatus() {
      gripManageApi.getInstiStatus().then(res => {
        if (res.code === 'ACK') {
          this.instiStatus = res.data
        }
      })
    },
    uploadedId(data) {
      this.userDialogObj.form.fileIdList = data
    },
    resetForm(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
      })
    },
    onOperate(type, row) {
      if (type === 'add') {
        this.userDialogObj.visible = true
        this.userDialogObj.type = type
        this.userDialogObj.title = '机构新增'
        this.instiTypeList.map(item => {
          item.disabled = false
          return item
        })
        this.userDialogObj.form = Object.assign({}, defaultUserForm)
        this.$nextTick(() => {
          this.$refs.userForm.clearValidate()
        })
        // this.resetForm('userForm')
      } else if (type === 'modify') {
        this.userDialogObj.visible = true
        this.userDialogObj.type = type
        this.userDialogObj.title = '机构修改'
        this.instiTypeList.map(item => {
          item.disabled = false
          return item
        })
        this.$nextTick(() => {
          this.$refs.userForm.clearValidate()
        })
        const params = {
          id: row.instiId,
          userId: row.userId
        }
        gripManageApi.getInstiDetail(params).then(res => {
          if (res.code === 'ACK') {
            console.log('getInstiDetail', res)
            this.userDialogObj.form.cnFullName = res.data.cnFullName
            this.userDialogObj.form.instnCd = res.data.instnCd
            this.userDialogObj.form.instiType = res.data.typeList
            if (res.data.labelType !== null) {
              this.userDialogObj.form.isVIP = res.data.labelType
            } else {
              this.userDialogObj.form.isVIP = '10'
            }

            this.userDialogObj.form.fileIdList = []
            res.data.cassInstiFileDtoList.forEach(item => {
              this.userDialogObj.form.fileIdList.push(item.fileId)
            })
            if (this.userDialogObj.form.instiType) {
              this.instiTypeChange(this.userDialogObj.form.instiType)
            }
            this.userDialogObj.viewForm.instnId = res.data.instiId
            this.userDialogObj.visible = true
          }
        })
      } else if (type === 'view') {
        this.userDialogObj.visible = true
        this.userDialogObj.type = type
        this.userDialogObj.title = '查看'
        this.$nextTick(() => {
          this.$refs.userForm.clearValidate()
        })
        const params = {
          id: row.instiId,
          userId: row.userId
        }
        gripManageApi.getInstiDetail(params).then(res => {
          if (res.code === 'ACK') {
            this.userDialogObj.form.cnFullName = res.data.cnFullName
            this.userDialogObj.form.instnCd = res.data.instnCd
            this.userDialogObj.form.instiType = res.data.typeList
            this.userDialogObj.form.isVIP = res.data.labelType
            this.userDialogObj.viewForm.instnId = res.data.instiId
            this.userDialogObj.viewForm.cassInstiFileDtoList = res.data.cassInstiFileDtoList
            this.userDialogObj.viewForm.instiStatus = res.data.instiStatus.text
            this.userDialogObj.viewForm.auditRemark = res.data.auditRemark.join(';')
          }
        })
      } else if (type === 'submit') {
        this.$refs.userForm.validate(valid => {
          if (valid) {
            const params = {
              instnCnFullNm: this.userDialogObj.form.cnFullName,
              instiType: this.userDialogObj.form.instiType.join(','),
              fileIdList: this.userDialogObj.form.fileIdList,
              labelType: this.userDialogObj.form.isVIP
            }
            if (this.userDialogObj.type === 'add') {
              params.instnCd = this.userDialogObj.form.instnCd
            } else if (this.userDialogObj.type === 'modify') {
              params.instnId = this.userDialogObj.viewForm.instnId
            }
            gripManageApi.insitiSave(params, this.userDialogObj.type).then(res => {
              if (res.code === 'ACK') {
                this.$message({
                  type: 'success',
                  message: res.message
                })
                this.fetchData()
                this.userDialogObj.visible = false
              } else if (res.code === 'VALIDATION') {
                // 后端验证
                if ('instnCnFullNm' in res.data) {
                  this.$refs.userForm.fields.find(
                    item => item.prop === 'cnFullName'
                  ).validateState = 'error'
                  this.$refs.userForm.fields.find(
                    item => item.prop === 'cnFullName'
                  ).validateMessage = res.data.instnCnFullNm
                }
                if ('typeList' in res.data) {
                  this.$refs.userForm.fields.find(
                    item => item.prop === 'typeList'
                  ).validateState = 'error'
                  this.$refs.userForm.fields.find(
                    item => item.prop === 'typeList'
                  ).validateMessage = res.data.typeList
                }
                if ('sName' in res.data) {
                  this.$refs.userForm.fields.find(
                    item => item.prop === 'sName'
                  ).validateState = 'error'
                  this.$refs.userForm.fields.find(
                    item => item.prop === 'sName'
                  ).validateMessage = res.data.sName
                }
                if ('isVIP' in res.data) {
                  this.$refs.userForm.fields.find(
                    item => item.prop === 'isVIP'
                  ).validateState = 'error'
                  this.$refs.userForm.fields.find(
                    item => item.prop === 'isVIP'
                  ).validateMessage = res.data.isVIP
                }
                if ('instnCd' in res.data) {
                  this.$refs.userForm.fields.find(
                    item => item.prop === 'instnCd'
                  ).validateState = 'error'
                  this.$refs.userForm.fields.find(
                    item => item.prop === 'instnCd'
                  ).validateMessage = res.data.instnCd
                }
                if ('fileIdList' in res.data) {
                  this.$refs.userForm.fields.find(
                    item => item.prop === 'fileIdList'
                  ).validateState = 'error'
                  this.$refs.userForm.fields.find(
                    item => item.prop === 'fileIdList'
                  ).validateMessage = res.data.fileIdList
                }
              }
            })
          }
        })
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
    fetchData() {
      const params = {
        page: this.mainObj.currentPage,
        pageSize: this.mainObj.pageSize,
        cnFullName: this.mainObj.searchForm.cnFullName,
        labelType: this.mainObj.searchForm.isVIP,
        instiStatus: this.mainObj.searchForm.instiStatus,
        instiType: this.mainObj.searchForm.instiType,
        instnCd: this.mainObj.searchForm.instnCd,
        auditStartTime: this.mainObj.searchForm.auditDate
          ? `${this.mainObj.searchForm.auditDate[0]} 00:00:00`
          : null,
        auditEndTime: this.mainObj.searchForm.auditDate
          ? `${this.mainObj.searchForm.auditDate[1]} 23:59:59`
          : null,
        commitStartTime: this.mainObj.searchForm.submitDate
          ? `${this.mainObj.searchForm.submitDate[0]} 00:00:00`
          : null,
        commitEndTime: this.mainObj.searchForm.submitDate
          ? `${this.mainObj.searchForm.submitDate[1]} 23:59:59`
          : null,
        auditUserName: this.mainObj.searchForm.auditUser
      }
      gripManageApi.institutionSearch(params).then(res => {
        if (res.code === 'ACK') {
          this.mainObj.list = res.data.list
          this.mainObj.total = res.data.totalRecord
        } else if (res.code === 'NACK') {
          this.$message({
            type: 'warning',
            message: res.message
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$mainWidth: 1220px;
.main {
  display: flex;
  background-color: #e7edf5;
  flex-direction: column;
  width: $mainWidth;
  margin: 28px auto;
  height: 100%;
  .header {
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(223, 223, 223, 1);
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
    border-bottom: none;
    padding: 15px 10px 15px 10px;
    .el-form-item {
      .first-input {
        width: 200px;
      }
    }
  }
}

.body {
  margin-top: 10px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(223, 223, 223, 1);
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  .add-btn-panel {
    .add-btn {
      height: 30px;
      padding: 0 15px;
      margin: 16px;
    }
  }
  ::v-deep.el-table th {
    background-color: #f6f7fb;
  }
}

.block {
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(223, 223, 223, 1);
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
  border-top: none;
  padding: 15px 10px 15px 10px;
  display: flex;
  justify-content: flex-end;
}
.el-dialog {
  .el-form-item {
    margin-bottom: 0;
  }
  .group-title {
    font-weight: 700;
    border-left: 4px solid #2c76d1;
    padding-left: 6px;
    font-size: 18px;
    font-family: Microsoft YaHei;
    line-height: 24px;
    color: rgb(48, 48, 48);
  }
  .margin30 {
    margin-top: 40px;
  }
}

.info-audit {
  .audit-footer {
    margin: 20px 0;
    display: block;
    text-align: center;
    .el-button {
      border-radius: 0;
    }
  }
  ::v-deep .el-dialog__footer {
    background-color: #fff;
    margin-top: 0;
  }
}

.info-audit-dialog {
  .el-form-item {
    height: 42px;
    ::v-deep .el-form-item__label {
      height: 42px;
      padding-left: 12px;
      line-height: 42px;
      background-color: rgba(246, 247, 251, 1);
      border: 1px solid #dcdfe6;
      font-size: 15px;
      font-weight: 400;
      font-family: Microsoft YaHei;
      color: rgba(48, 48, 48, 1);
    }
    ::v-deep .el-input__inner {
      height: 42px;
      border-left: 0;
    }
  }
  .bottom0 {
    ::v-deep .el-input__inner {
      border-bottom: 0;
    }
    ::v-deep .el-form-item__label {
      border-bottom: 0;
    }
  }
  .left0 {
    ::v-deep .el-form-item__label {
      border-left: 0;
    }
  }
  ::v-deep .el-textarea__inner {
    height: 150px;
  }
  ::v-deep .el-input__inner {
    background-color: #fff;
    color: #303030;
  }
}

.view-dialog {
  ::v-deep .el-dialog__body {
    padding-bottom: 40px;
  }
  ::v-deep .el-input__inner {
    background-color: #fff;
    color: #303030;
  }
}

.el-tabs--top {
  ::v-deep.el-tabs__item.is-top {
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: 700;
  }
  ::v-deep.el-tabs__active-bar {
    height: 4px;
  }
}
.el-table {
  ::v-deep .header-row-th {
    th {
      font-size: 15px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 20px;
      color: rgba(48, 48, 48, 1);
    }
  }
  ::v-deep .el-table__fixed-right {
    height: 100% !important;
  }
}
::v-deep .el-button--mini {
  border-radius: 2px;
}
::v-deep .el-pager {
  li.active {
    color: #fff;
    width: 30px;
    background: rgba(44, 118, 209, 1);
    border-radius: 2px;
  }
}
.file-div {
  height: auto;
  border: 1px solid #dcdfe6;
  border-left: 0;
}
.file-input {
  ::v-deep .el-input__inner {
    border: 0;
    color: #2c76d1;
    cursor: pointer;
    background: #fff;
  }
}
.top-main-left {
  .el-form-item {
    ::v-deep .el-form-item__label {
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(48, 48, 48, 1);
    }
    ::v-deep .el-input__inner {
      width: 300px;
    }
  }
  .init-input {
    ::v-deep .el-input__inner {
      width: 238px;
    }
  }
  .date-input {
    .el-date-editor {
      width: 300px;
      height: 30px;
      border-radius: 0;
      ::v-deep .el-range__icon {
        line-height: 23px;
      }
      ::v-deep .el-range-separator {
        line-height: 23px;
      }
      ::v-deep .el-range__close-icon {
        line-height: 23px;
      }
    }
  }
}
.info-audit-dialog {
  .file-form {
    display: flex;
    height: auto;
    ::v-deep .el-form-item__label {
      height: auto;
    }
    ::v-deep .el-form-item__content {
      width: 82%;
      margin-left: 0 !important;
    }
  }
}
.add-dialog {
  .el-form-item {
    margin-bottom: 26px;
    ::v-deep .el-form-item__label {
      font-size: 15px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: #303030ff;
    }
  }
  .file-text {
    display: block;
    color: #1890ff;
    cursor: pointer;
  }
  .el-form-item,
  .el-select {
    width: 100%;
  }
  .dialog-footer {
    text-align: center;
  }
  .phone-code {
    width: 30%;
  }
  // .phone-line {
  //   display: inline-block;
  //   width: 3%;
  //   margin: 0 2%;
  //   border: 1px solid #e6e6e6;
  // }
  .phone {
    width: 67%;
    ::v-deep .el-input__inner {
      margin-left: 10px;
    }
  }
  ::v-deep.el-form-item.is-required:not(.is-no-asterisk)
    > .el-form-item__label:before {
    content: none;
  }
  ::v-deep.el-dialog__body {
    padding: 20px 80px;
  }
  ::v-deep.el-dialog__footer {
    background-color: #fff;
    padding: 0px 20px 40px;
  }
  ::v-deep.el-form-item__content {
    width: 68%;
  }
}
::v-deep .el-tabs__active-bar {
  background-color: #2c76d1;
}
::v-deep .el-tabs__item.is-active {
  color: #2c76d1;
}
.update-file {
  ::v-deep .el-upload-list__item-name {
    color: #2c76d1;
    &:hover {
      color: blue;
      text-decoration: underline;
    }
  }
}
.audit-textarea {
  /deep/.el-textarea__inner{
    min-height: 120px!important;
  }
}
</style>
