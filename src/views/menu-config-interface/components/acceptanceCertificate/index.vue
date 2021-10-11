<!-- 验收单配置 -->
<template>
  <div class="interface-menu-config-container">
    <el-tabs
      v-model="mainObj.activeTabName"
      type="card"
      class="custom-tabs"
      @tab-click="tabClick"
    >
      <el-tab-pane label="市场机构" name="00" />
      <el-tab-pane label="信息商" name="10" />
    </el-tabs>
    <el-upload
      ref="uploadComponent"
      action="/cass/mgt/acceptance/form/config/upload/testScope/rule"
      :show-file-list="false"
      :file-list="mainObj.uploadList"
      :on-change="onChangeFile"
      accept=".json"
      :data="{id:receiptDialog.id}"
      :on-success="onUploadSuccess"
      :headers="mainObj.headers"
      style="display:none"
    >
      <el-button ref="uploadInput" type="primary" />
    </el-upload>
    <el-table
      :data="mainObj.list"
      :header-row-class-name="tableRowClassName"
      :header-row-style="{height: '42px'}"
      :header-cell-style="{padding: 0}"
      :row-style="{height: '42px'}"
      :cell-style="{padding: 0}"
      fit
      stripe
      highlight-current-row
    >
      <el-table-column show-overflow-tooltip prop="formVersion" label="版本" />
      <el-table-column show-overflow-tooltip prop="versionType" label="类型" />
      <el-table-column show-overflow-tooltip prop="versionStatus" label="状态" />
      <el-table-column show-overflow-tooltip prop="createTs" label="创建日期">
        <template slot-scope="scope">
          <span>{{ scope.row.createTs | dateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="publishTs" label="发布日期">
        <template slot-scope="scope">
          <span>{{ scope.row.publishTs | dateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="createUser" label="创建人" />
      <el-table-column show-overflow-tooltip prop="publishUser" label="发布人" />
      <el-table-column label="操作" width="290px">
        <template #default="{row}">
          <el-button v-if="row.versionType.code == '20'" :disabled="!row.upgradeFlag" type="text" @click="onOperate('upgrade', row)">
            升级
          </el-button>
          <el-button v-if="row.versionType.code == '10'" type="text" @click="onOperate('edit', row)">
            编辑
          </el-button>
          <el-divider direction="vertical" />
          <el-button type="text" @click="onOperate('view', row)">
            查看
          </el-button>
          <el-divider v-if="row.versionType.code == '10'" direction="vertical" />
          <el-button v-if="row.versionType.code == '10'" :disabled="!row.publishFlag" type="text" @click="onOperate('publish', row)">
            发布
          </el-button>
          <el-divider direction="vertical" />
          <el-tooltip content="下载验收菜单规则文件" placement="bottom-start">
            <el-button type="text" @click="onOperate('download', row)">
              下载
            </el-button>
          </el-tooltip>
          <el-divider v-if="row.versionType.code == '10'" direction="vertical" />
          <el-tooltip v-if="row.versionType.code == '10'" content="上传验收菜单规则文件" placement="bottom-start">
            <el-button v-if="row.versionType.code == '10'" type="text" @click="onOperate('upload', row)">
              上传
            </el-button>
          </el-tooltip>
          <el-divider v-if="row.versionType.code == '10'" direction="vertical" />
          <el-button v-if="row.versionType.code == '10'" type="text" @click="onOperate('delete', row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        :current-page="mainObj.page"
        :page-size="mainObj.pageSize"
        :page-sizes="mainObj.pagesizes"
        :total="mainObj.total"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <!--查看验收单草稿-->
    <el-dialog
      :title="receiptDialog.title"
      class="receipt-dialog"
      :visible.sync="receiptDialog.visible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      width="1100px"
      @close="receuptDialogClose"
    >
      <el-button
        v-if="receiptDialog.type === 'edit'"
        type="primary"
        icon="el-icon-circle-plus el-icon--right"
        class="btn"
        @click="onSubOperate('add')"
      >新增</el-button>
      <el-table
        :data="receiptDialog.list"
        class="mt10"
        :header-row-class-name="tableRowClassName"
        :header-row-style="{height: '42px'}"
        :header-cell-style="{padding: 0}"
        :row-style="{height: '42px'}"
        :cell-style="{padding: 0}"
        stripe
        border
        highlight-current-row
      >
        <el-table-column prop="id" show-overflow-tooltip label="验收申请单ID" min-width="120" fixed />
        <el-table-column prop="name" label="验收申请单名称" min-width="350" fixed />
        <el-table-column prop="formAbbr" show-overflow-tooltip label="接口简称" min-width="120" />
        <el-table-column prop="lastMntTs" show-overflow-tooltip label="更新时间" min-width="130" />
        <el-table-column prop="updateUser" show-overflow-tooltip label="更新人" min-width="100" />
        <el-table-column label="编辑完成" min-width="90">
          <template #default="{row}">
            {{ row.updateCompleteFlag?"是":"否" }}
          </template>
        </el-table-column>
        <el-table-column label="操作" :width="receiptDialog.type === 'edit'?'320':'230'">
          <template #default="{row}">
            <el-button
              v-if="receiptDialog.type === 'edit'"
              type="text"
              @click="onSubOperate('edit',row)"
            >编辑</el-button>
            <el-divider v-if="receiptDialog.type === 'edit'" direction="vertical" />
            <el-button type="text" @click="onSubOperate('view', row)">查看</el-button>
            <el-divider direction="vertical" />
            <el-button type="text" @click="onSubOperate('downloadRule', row)">下载自查清单</el-button>
            <el-divider direction="vertical" />
            <el-button type="text" @click="onSubOperate('downloadKey', row)">下载key</el-button>
            <el-divider
              v-if="receiptDialog.type === 'edit'"
              direction="vertical"
            />
            <el-button
              v-if="receiptDialog.type === 'edit'"
              type="text"
              @click="deleteReceiptVersion(row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <!--新增验收单-->
    <el-dialog
      :title="receiptStepsDialog.title"
      :visible.sync="receiptStepsDialog.visible"
      class="recepit-steps-dialog"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      width="1200px"
      @close="receiptStepDialogClose"
    >
      <div class="steps-container">
        <Steps
          class="steps-container-steps"
          :steps-list="receiptStepsDialog.stepsList"
          :active-index="receiptStepsDialog.activeIndex"
          @toggleSteps="toggleSteps"
        />
      </div>
      <!--步骤条开始-->
      <step-one
        v-if="receiptStepsDialog.activeIndex === 1"
        ref="stepOne"
        :receipt-basic-data="{id:receiptStepsDialog.id, formType: receiptDialog.formType,formVersion: receiptDialog.formVersion}"
        :type="receiptStepsDialog.type"
        @nextStep="savedName"
        @cancel="receiptStepsDialog.visible = false"
      />
      <step-two
        v-if="receiptStepsDialog.activeIndex === 2"
        :type="receiptStepsDialog.type"
        :receipt-basic-data="{id:receiptStepsDialog.id, formType: receiptDialog.formType,formVersion: receiptDialog.formVersion}"
        @nextStep="changeSteps(3)"
        @previousStep="changeSteps(1)"
        @cancel="receiptStepsDialog.visible = false"
      />
      <step-three
        v-if="receiptStepsDialog.activeIndex === 3"
        :type="receiptStepsDialog.type"
        :receipt-basic-data="{id:receiptStepsDialog.id, formType: receiptDialog.formType,formVersion: receiptDialog.formVersion}"
        @nextStep="changeSteps(4)"
        @previousStep="changeSteps(2)"
        @cancel="receiptStepsDialog.visible = false"
      />
      <step-four
        v-if="receiptStepsDialog.activeIndex === 4"
        :type="receiptStepsDialog.type"
        :receipt-basic-data="{id:receiptStepsDialog.id, formType: receiptDialog.formType,formVersion: receiptDialog.formVersion}"
        @receiptSaved="receiptSaved"
        @previousStep="changeSteps(3)"
        @cancel="receiptStepsDialog.visible = false"
      />
    </el-dialog>

  </div>
</template>

<script>
import menuConfigApi from '@/api/grip-manage/menuConfigApi.js'
import { getToken } from '@/utils/auth'
import { downloadFile } from '@/utils'
import Steps from '@/components/Steps'
import StepOne from './stepOne'
import StepTwo from './stepTwo'
import StepThree from './stepThree'
import StepFour from './stepFour'
export default {
  filters: {
    dateFilter(val) {
      return val ? val.substr(0, 10) : val
    }
  },
  components: {
    Steps,
    StepOne,
    StepTwo,
    StepThree,
    StepFour
  },
  data() {
    return {
      mainObj: {
        list: [],
        activeTabName: '00',
        page: 1,
        pageSize: 20,
        pagesizes: [20, 50, 100],
        total: 0,
        uploadList: [],
        headers: { 'X-Auth-Token': '' }
      },
      receiptDialog: {
        id: 0,
        visible: false,
        title: '',
        type: '', // view查看，edit编辑
        formType: '', // 验收单类型 00-市场机构 10-信息商
        formVersion: '',
        list: []
      },
      receiptStepsDialog: {
        type: '', // add, view or edit
        title: '',
        id: '0',
        visible: false,
        activeIndex: 0,
        stepsList: [],
        stepsListAll: ['输入名称', '接口菜单', '验收菜单', '编辑自查清单']
      }
    }
  },
  created() {
    this.fetchData()
    this.mainObj.headers['X-Auth-Token'] = getToken()
  },
  methods: {
    tableRowClassName({ rowIndex }) {
      if (rowIndex === 0) {
        return 'header-row-th'
      }
    },
    tabClick() {
      this.fetchData()
    },
    receuptDialogClose() {
      if (this.receiptDialog.type === 'edit') {
        this.fetchData()
      }
    },
    receiptStepDialogClose() {
      if (this.receiptStepsDialog.type === 'edit' || this.receiptStepsDialog.type === 'add') {
        this.loadAcceptanceVersionList(this.receiptDialog.id)
      }

      this.receiptStepsDialog.activeIndex = 0
    },
    async fetchData() {
      const params = { formType: this.mainObj.activeTabName,
        page: this.mainObj.page,
        pageSize: this.mainObj.pageSize }
      const result = await menuConfigApi.getAcceptanceCertificateList(params)
      const { code, data } = result
      if (code === 'ACK') {
        this.mainObj.list = data.list
        this.mainObj.total = data.totalRecord
      }
    },
    async onOperate(action, row) {
      if (action === 'view' || action === 'edit') {
        this.receiptDialog.id = row.id
        this.receiptDialog.type = action
        this.receiptDialog.title = action === 'view' ? '查看' : '编辑'
        this.receiptDialog.formType = this.mainObj.activeTabName
        this.receiptDialog.formVersion = row.formVersion

        const result = await menuConfigApi.getAcceptanceVersionList({ id: row.id })
        if (result.code === 'ACK') {
          this.receiptDialog.list = result.data
          this.receiptDialog.visible = true
        }
      } else if (action === 'upgrade') {
        const result = await this.$confirm('确定升级吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(() => {
        })
        if (result === 'confirm') {
          const result = await menuConfigApi.acceptanceUpgrade({ id: row.id })
          const { code, message } = result
          if (code === 'ACK') {
            this.$message.success(message)
            this.fetchData()
          } else {
            this.$message.error(message)
          }
        }
      } else if (action === 'delete') {
        const result = await this.$confirm('确定删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(() => {
        })
        if (result === 'confirm') {
          const result = await menuConfigApi.deleteAcceptance({ id: row.id })
          const { code, message } = result
          if (code === 'ACK') {
            this.$message.success(message)
            this.fetchData()
          } else {
            this.$message.error(message)
          }
        }
      } else if (action === 'download') {
        const result = await menuConfigApi.downloadTestScopeRuls({ id: row.id })
        console.log(result)
        if (result.status === 200 && result.data.type && result.data.type.indexOf('application/octet-stream') > -1) {
          const name = window.decodeURI(result.headers['content-disposition'].split('=')[1], 'UTF-8')
          downloadFile(result.data, name, 'application/json')
        } else {
          this.$message.error('下载失败')
        }
      } else if (action === 'upload') {
        this.receiptDialog.id = row.id
        this.$refs.uploadInput.$el.click()
      } else if (action === 'publish') {
        const result = await this.$confirm('确定发布吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(() => {
        })
        if (result === 'confirm') {
          const loading = this.$loading({
            lock: true,
            text: '发布中',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          try {
            const result = await menuConfigApi.publishAcceptance({ id: row.id })
            if (result.code === 'ACK') {
              this.$message.success('发布成功')
              this.fetchData()
            } else {
              this.$message.error(result.message)
            }
          } catch (error) {
            console.log(error)
          } finally {
            loading.close()
          }
        }
      }
    },
    async onSubOperate(action, row) {
      if (action === 'edit') {
        this.receiptStepsDialog.title = '修改验收单'
        this.receiptStepsDialog.type = action
        this.receiptStepsDialog.id = row.id
        this.changeSteps(1)
        this.receiptStepsDialog.stepsList = this.receiptStepsDialog.stepsListAll
        this.receiptStepsDialog.visible = true
      } else if (action === 'add') {
        this.receiptStepsDialog.type = action
        this.receiptStepsDialog.title = '新增验收单'
        this.receiptStepsDialog.id = '0'
        this.changeSteps(1)
        this.receiptStepsDialog.stepsList = this.receiptStepsDialog.stepsListAll
        this.receiptStepsDialog.visible = true
      } else if (action === 'view') {
        this.receiptStepsDialog.id = row.id
        this.receiptStepsDialog.type = action
        this.receiptStepsDialog.title = '查看验收单'
        this.changeSteps(1)
        this.receiptStepsDialog.stepsList = this.receiptStepsDialog.stepsListAll
        this.receiptStepsDialog.visible = true
      } else if (action === 'downloadKey') {
        const params = {
          formId: row.id,
          version: this.receiptDialog.formVersion
        }
        try {
          const result = await menuConfigApi.downloadSelfCheckKey(params)
          if (
            result.status === 200 &&
          result.data.type && result.data.type.indexOf('application/octet-stream') > -1
          ) {
            const name = window.decodeURI(
              result.headers['content-disposition'].split('=')[1],
              'UTF-8'
            )
            downloadFile(result.data, name, 'application/json')
          } else {
            const reader = new FileReader()
            reader.readAsText(result.data, 'utf-8')
            const that = this
            reader.onload = function() {
              const result = JSON.parse(reader.result)
              that.$message.error(result.data.message)
            }
          }
        } catch (error) {
          console.log(error)
        }
      } else if (action === 'downloadRule') {
        const params = {
          formId: row.id,
          version: this.receiptDialog.formVersion
        }
        try {
          const result = await menuConfigApi.downloadSelfCheckData(params)
          if (
            result.status === 200 &&
          result.data.type && result.data.type.indexOf('application/octet-stream') > -1
          ) {
            let name = ''
            const blob = new Blob([result.data], { type: 'application/json' })

            name = window.decodeURI(
              result.headers['content-disposition'].split('=')[1],
              'UTF-8'
            )

            if (window.navigator && window.navigator.msSaveOrOpenBlob) {
              window.navigator.msSaveOrOpenBlob(blob, name)
            } else {
              const link = document.createElement('a')
              link.href = window.URL.createObjectURL(blob)
              link.download = name
              document.body.appendChild(link)
              link.click()
            }
          } else {
            const reader = new FileReader()
            reader.readAsText(result.data, 'utf-8')
            const that = this
            reader.onload = function() {
              const result = JSON.parse(reader.result)
              that.$message.error(result.data.message)
            }
          }
        } catch (error) {
          console.log(error)
        }
      }
    },
    async deleteReceiptVersion(row) {
      const result = await this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(() => {
      })
      if (result === 'confirm') {
        const result = await menuConfigApi.deleteAcceptanceVersion({ formId: row.id, version: this.receiptDialog.formVersion })
        const { code, message } = result
        if (code === 'ACK') {
          this.$message.success(message)
          this.loadAcceptanceVersionList(this.receiptDialog.id)
        } else {
          this.$message.error(message)
        }
      }
    },
    savedName(data) {
      if (data) {
        // 没有id不能跳步骤，名称必填
        this.receiptStepsDialog.id = data.id
      }
      this.changeSteps(2)
    },
    changeSteps(index) {
      this.receiptStepsDialog.activeIndex = index
    },
    receiptSaved() {
      this.$message.success('保存成功！')
      this.receiptStepsDialog.visible = false
    },
    async loadAcceptanceVersionList(id) {
      const result = await menuConfigApi.getAcceptanceVersionList({ id })
      if (result.code === 'ACK') {
        this.receiptDialog.list = result.data
      }
    },
    toggleSteps(index) {
      // 当前页不可点击
      if (this.receiptStepsDialog.activeIndex === index || this.receiptStepsDialog.id === '0') {
        return
      }
      this.receiptStepsDialog.activeIndex = index
    },
    handleSizeChange(val) {
      this.mainObj.pageSize = val
      this.mainObj.page = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.mainObj.page = val
      this.fetchData()
    },
    onChangeFile(file, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1)
      }
      this.mainObj.uploadList = fileList
    },
    onUploadSuccess(response, file, fileList) {
      if (response.data.code === 'ACK') {
        this.$message.success('上传成功！')
      } else {
        this.$message.error(response.data.message)
      }
      this.$refs.uploadComponent.clearFiles()
    }
  }
}
</script>

<style lang="scss" scoped>
.interface-menu-config-container {
  position: relative;
  ::v-deep.el-tabs__header{
      height:auto;
      line-height: normal;
      background-color: #fff;
    }
}
.des-style {
  line-height: 30px;
  font-size: 14px;
}
.receipt-dialog{
::v-deep.el-table th {
    background-color: #f6f7fb;
  }
}
</style>
