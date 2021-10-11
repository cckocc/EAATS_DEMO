<template>
  <div class="interface-menu-config-container">
    <div class="interface-menu-config-container-btn">
      <el-button v-preventReClick type="primary" @click="downloadFile">导出现有接口菜单</el-button>
      <el-button v-preventReClick type="primary" @click="showUploadDialog">导入编辑后接口菜单</el-button>
      <el-button v-preventReClick class="operate-des" icon="el-icon-question" @click="showDesDialog">操作说明</el-button>
    </div>
    <el-tabs v-model="institutionType" type="card" class="custom-tabs" @tab-click="tabClick">
      <el-tab-pane label="市场机构" name="00" />
      <el-tab-pane label="信息商" name="10" />
    </el-tabs>
    <el-table
      :data="mainObj.list"
      style="width: 100%"
      fit
      stripe
      border
      highlight-current-row
    >
      <el-table-column
        show-overflow-tooltip
        prop="menuName"
        label="文件名称"
        min-width="300"
      />
      <el-table-column
        show-overflow-tooltip
        prop="menuVersion"
        label="版本"
        width="100"
      />
      <el-table-column
        show-overflow-tooltip
        prop="menuStatusName"
        label="状态"
        width="80"
      />
      <el-table-column
        show-overflow-tooltip
        prop="createTs"
        label="创建日期"
        width="100"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTs | dateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="lastMntTs"
        label="发布日期"
        width="100"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.lastMntTs | dateFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="createOpId"
        label="创建人"
        min-width="120"
      />
      <el-table-column label="操作" width="200px" fixed="right">
        <template slot-scope="scope">
          <el-button v-if="scope.row.menuStatusName === '已生效'" type="text" @click="onOperate('upgrade', scope.row)">
            编辑
          </el-button>
          <el-button v-else type="text" :disabled="!scope.row.clickedEdit" @click="onOperate('edit', scope.row)">
            编辑
          </el-button>
          <el-button type="text" @click="onOperate('detail', scope.row)">
            查看
          </el-button>
          <el-button type="text" :disabled="!scope.row.clickedPublish" @click="onOperate('publish', scope.row)">
            发布
          </el-button>
          <el-button type="text" :disabled="!scope.row.deleteAvailable" @click="onOperate('delete', scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑/查看接口菜单 -->
    <el-dialog
      width="1220px"
      class="custom-dialog"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :title="operateDialogObj.title"
      :visible="operateDialogObj.visible"
      @close="closeEditDialog"
    >
      <div class="steps-container">
        <Steps
          class="steps-container-steps"
          :steps-list="operateDialogObj.stepsList"
          :active-index="operateDialogObj.activeIndex"
          @toggleSteps="toggleSteps"
        />
      </div>
      <div v-if="institutionType === '00'">
        <StepOne
          v-if="operateDialogObj.activeIndex === 1"
          :operation-type="operateDialogObj.type"
          :current-row="operateDialogObj.row"
          :institution-type="institutionType"
          @changeSteps="changeSteps"
          @close="closeEditDialog"
        />
        <StepTwo
          v-if="operateDialogObj.activeIndex === 2"
          :operation-type="operateDialogObj.type"
          :current-row="operateDialogObj.row"
          :institution-type="institutionType"
          @changeSteps="changeSteps"
          @close="closeEditDialog"
          @onSearch="onSearch"
        />
        <StepThree
          v-if="operateDialogObj.activeIndex === 3"
          :operation-type="operateDialogObj.type"
          :current-row="operateDialogObj.row"
          :institution-type="institutionType"
          @changeSteps="changeSteps"
          @close="closeEditDialog"
          @onSearch="onSearch"
        />
        <StepFour
          v-if="operateDialogObj.activeIndex === 4"
          :operation-type="operateDialogObj.type"
          :current-row="operateDialogObj.row"
          :institution-type="institutionType"
          @changeSteps="changeSteps"
          @close="closeEditDialog"
          @onSearch="onSearch"
        />
        <StepFive
          v-if="operateDialogObj.activeIndex === 5"
          :operation-type="operateDialogObj.type"
          :current-row="operateDialogObj.row"
          :institution-type="institutionType"
          @changeSteps="changeSteps"
          @close="closeEditDialog"
        />
        <StepSix
          v-if="operateDialogObj.activeIndex === 6"
          :operation-type="operateDialogObj.type"
          :current-row="operateDialogObj.row"
          :institution-type="institutionType"
          @changeSteps="changeSteps"
          @close="closeEditDialog"
        />
        <StepSeven
          v-if="operateDialogObj.activeIndex === 7"
          :operation-type="operateDialogObj.type"
          :current-row="operateDialogObj.row"
          :institution-type="institutionType"
          @changeSteps="changeSteps"
          @close="closeEditDialog"
          @onSearch="onSearch"
        />
      </div>
      <div v-if="institutionType === '10'">
        <StepOne
          v-if="operateDialogObj.activeIndex === 1"
          :operation-type="operateDialogObj.type"
          :current-row="operateDialogObj.row"
          :institution-type="institutionType"
          @changeSteps="changeSteps"
          @close="closeEditDialog"
        />
        <StepTwo
          v-if="operateDialogObj.activeIndex === 2"
          :operation-type="operateDialogObj.type"
          :current-row="operateDialogObj.row"
          :institution-type="institutionType"
          @changeSteps="changeSteps"
          @close="closeEditDialog"
          @onSearch="onSearch"
        />
        <StepFive
          v-if="operateDialogObj.activeIndex === 3"
          :operation-type="operateDialogObj.type"
          :current-row="operateDialogObj.row"
          :institution-type="institutionType"
          @changeSteps="changeSteps"
          @close="closeEditDialog"
        />
        <StepSix
          v-if="operateDialogObj.activeIndex === 4"
          :operation-type="operateDialogObj.type"
          :current-row="operateDialogObj.row"
          :institution-type="institutionType"
          @changeSteps="changeSteps"
          @close="closeEditDialog"
        />
        <StepSeven
          v-if="operateDialogObj.activeIndex === 5"
          :operation-type="operateDialogObj.type"
          :current-row="operateDialogObj.row"
          :institution-type="institutionType"
          @changeSteps="changeSteps"
          @close="closeEditDialog"
          @onSearch="onSearch"
        />
      </div>
    </el-dialog>
    <!-- 导入 -->
    <el-dialog
      width="658px"
      :title="uploadDialogObj.title"
      :visible.sync="uploadDialogObj.visible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      destroy-on-close
      @close="closeUploadDialog"
    >
      <div>
        <el-upload
          ref="upload"
          action="fakeaction"
          :accept="uploadDialogObj.accept"
          :file-list="uploadDialogObj.fileList"
          :auto-upload="false"
          :on-change="onChangeFile"
          :on-remove="onRemoveFile"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <div slot="tip" class="el-upload__tip">只能上传{{ uploadDialogObj.accept }}文件</div>
        </el-upload>
      </div>
      <div slot="footer" class="text-center">
        <span slot="footer">
          <el-button
            type="primary"
            class="button-primary"
            @click="uploadFile"
          >
            确定
          </el-button>
          <el-button
            class="button-default"
            @click="closeUploadDialog"
          >
            取消
          </el-button>
        </span>
      </div>
    </el-dialog>
    <!-- 操作说明 -->
    <el-dialog
      width="658px"
      :title="desDialogObj.title"
      :visible.sync="desDialogObj.visible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      destroy-on-close
    >
      <div>
        <p class="des-style">
          1、	在配置接口菜单之前需先在协议条款页面上传所有的协议条款。<br>
          2、	导出现有接口菜单，在此基础上进行线下修改。<br>
          3、	可以任意增加或删除行，列的增加或删除仅限于第三列到机构身份前一列之间。<br>
          4、	接口的名称可修改，审核部门的枚举值包括：市场一部、市场二部、信息统计部、清算部、技术开发部、工程运行部、中汇公司；机构身份的枚举值包括：本币市场成员,外汇市场成员，信息商，系统接入开发机构。<br>
          5、	线下编辑之后导入系统，导入成功后进行编辑接口对应的协议条款、展示维度、CASS和指引平台的接口显示和隐藏。<br>
          6、	编辑结束后点击编辑完成才可进行发布。<br>
          7、	发布成功后，机构端在服务申请、验收测试、接口上线、权限变更看到最新的接口菜单，但对应变更的验收单需线下提供对给开发，技术开发上线后变更的接口才可进行验收申请。<br>
          8、	已生效的接口菜单可再次编辑协议条款、展示维度、CASS和指引平台的显示和隐藏，编辑完成之后点击发布即时生效。
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Steps from '@/components/Steps'
import StepOne from './stepOne.vue'
import StepTwo from './stepTwo.vue'
import StepThree from './stepThree.vue'
import StepFour from './stepFour.vue'
import StepFive from './stepFive.vue'
import StepSix from './stepSix.vue'
import StepSeven from './stepSeven.vue'
import { downloadFile } from '@/utils/index'
import menuConfigApi from '@/api/grip-manage/menuConfigApi'
export default {
  name: 'InterfaceMenuConfig',
  components: {
    Steps,
    StepOne,
    StepTwo,
    StepThree,
    StepFour,
    StepFive,
    StepSix,
    StepSeven
  },
  filters: {
    dateFilter(val) {
      return val ? val.substr(0, 10) : val
    }
  },
  data() {
    return {
      institutionType: '00',
      mainObj: {
        currentPage: 1,
        pageSize: 20,
        pagesizes: [20, 50, 100],
        total: 0,
        list: [],
        searchForm: {}
      },
      operateDialogObj: {
        visible: false,
        title: '',
        type: '',
        stepsList: [],
        stepsListAll: ['接口菜单', '协议条款', '展示维度配置', '验收测试指向列配置', '菜单展示(CASS)', '菜单展示(指引平台-下载)', '菜单展示(指引平台-查看)'],
        activeIndex: 0,
        row: {},
        originData: [],
        tableColumns: []
      },
      uploadDialogObj: {
        visible: false,
        title: '',
        fileList: [],
        accept: '.xlsx'
      },
      desDialogObj: {
        visible: false,
        title: ''
      }
    }
  },
  created() {
    this.onSearch()
  },
  methods: {
    tabClick(tab) {
      console.log(tab)
      this.onSearch()
    },
    onSearch() {
      const params = {
        institutionType: this.institutionType
      }
      menuConfigApi.getInterfaceMenuConfigList(params).then(res => {
        if (res.code === 'ACK') {
          this.mainObj.list = res.data
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    toggleSteps(index) {
      // 当前页不可点击
      if (this.operateDialogObj.activeIndex === index) {
        return
      }
      this.operateDialogObj.activeIndex = index
    },
    onOperate(type, row) {
      if (type === 'edit') {
        this.operateDialogObj.visible = true
        this.operateDialogObj.title = '编辑'
        this.operateDialogObj.type = type
        this.operateDialogObj.row = row
        this.operateDialogObj.activeIndex = 1
        if (this.institutionType === '00') {
          const stepsListAll = JSON.parse(JSON.stringify(this.operateDialogObj.stepsListAll))
          this.operateDialogObj.stepsList = stepsListAll
        } else if (this.institutionType === '10') {
          const stepsListAll = JSON.parse(JSON.stringify(this.operateDialogObj.stepsListAll))
          stepsListAll.splice(2, 2)
          this.operateDialogObj.stepsList = stepsListAll
        }
      } else if (type === 'detail') {
        this.operateDialogObj.visible = true
        this.operateDialogObj.title = '查看'
        this.operateDialogObj.type = type
        this.operateDialogObj.row = row
        this.operateDialogObj.activeIndex = 1
        if (this.institutionType === '00') {
          const stepsListAll = JSON.parse(JSON.stringify(this.operateDialogObj.stepsListAll))
          this.operateDialogObj.stepsList = stepsListAll
        } else if (this.institutionType === '10') {
          const stepsListAll = JSON.parse(JSON.stringify(this.operateDialogObj.stepsListAll))
          stepsListAll.splice(2, 2)
          this.operateDialogObj.stepsList = stepsListAll
        }
      } else if (type === 'publish') {
        this.$confirm('发布之后接口菜单立即生效，需要变更的验收单需线下开发完成之后才可生效，确认发布？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          const params = {
            id: row.id
          }
          menuConfigApi.publishInterfaceMenuConfig(params).then(res => {
            if (res.code === 'ACK') {
              this.$message({
                type: 'success',
                message: res.message
              })
              loading.close()
              this.onSearch()
            }
          })
        }).catch(error => {
          console.log(error)
        })
      } else if (type === 'delete') {
        this.$confirm('删除之后该条记录的配置内容将同步删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = {
            id: row.id
          }
          menuConfigApi.deleteInterfaceMenuConfig(params).then(res => {
            if (res.code === 'ACK') {
              this.$message({
                type: 'success',
                message: res.message
              })
              this.onSearch()
            }
          })
        }).catch(error => {
          console.log(error)
        })
      } else if (type === 'upgrade') {
        this.$confirm('编辑已生效的菜单需在列表上方新增的一条记录中编辑，确认编辑？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = {
            id: row.id
          }
          menuConfigApi.upgradeMenuConfig(params).then(res => {
            if (res.code === 'ACK') {
              this.$message({
                type: 'success',
                message: res.message
              })
              this.onSearch()
              this.onOperate('edit', { id: res.data })
            }
          })
        }).catch(error => {
          console.log(error)
        })
      }
    },
    getInterfaceMenuConfigTree(type) {
      const params = {
        instiType: type
      }
      menuConfigApi.getInterfaceMenuConfigTree(params).then(res => {
        if (res.code === 'ACK') {
          this.operateDialogObj.originData = res.data.nodeList
          this.operateDialogObj.tableColumns = res.data.headList
        }
      })
    },
    closeEditDialog() {
      this.operateDialogObj.visible = false
      this.operateDialogObj.activeIndex = 0
    },
    changeSteps(index) {
      this.operateDialogObj.activeIndex = index
    },
    downloadFile() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const params = {
        instiType: this.institutionType
      }
      menuConfigApi.exportInterfaceMenuConfig(params).then(res => {
        loading.close()
        // downloadFile(res.data, res.data.name, 'application/octet-stream')
        if (params.instiType === '00') {
          downloadFile(res.data, '接口菜单配置-市场机构.xlsx')
        } else if (params.instiType === '10') {
          downloadFile(res.data, '接口菜单配置-信息商.xlsx')
        } else {
          downloadFile(res.data, '接口菜单配置.xlsx')
        }
        this.$message({
          type: 'success',
          message: '下载成功!'
        })
      }).catch(() => {
        loading.close()
        this.$message({
          type: 'error',
          message: '下载失败!'
        })
      })
    },
    showUploadDialog(type, row) {
      this.uploadDialogObj.visible = true
      this.uploadDialogObj.title = '导入编辑后接口菜单'
    },
    closeUploadDialog() {
      this.$refs.upload.clearFiles()
      this.uploadDialogObj.visible = false
      this.uploadDialogObj.fileList = []
    },
    showDesDialog() {
      this.desDialogObj.visible = true
      this.desDialogObj.title = '操作说明'
    },
    onChangeFile(file, fileList) {
      console.log(file, fileList)
      if (fileList.length > 1) {
        fileList.splice(0, 1)
      }
      this.uploadDialogObj.fileList = fileList
    },
    onRemoveFile(file, fileList) {
      console.log(file, fileList)
      this.uploadDialogObj.fileList = []
    },
    uploadFile() {
      console.log(this.uploadDialogObj.fileList)
      if (this.uploadDialogObj.fileList.length === 0) {
        this.$message({
          message: `请选择文件`,
          type: 'info'
        })
        return
      }
      const isLtSize = this.uploadDialogObj.fileList[0].size / 1024 / 1024 <= 100
      if (!isLtSize) {
        this.$message({
          message: `上传失败，文件大小超过100MB`,
          type: 'info'
        })
        return
      }
      const file = this.uploadDialogObj.fileList[0]
      const form = new FormData()
      form.append('file', file.raw)

      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const params = {
        data: form,
        type: this.institutionType
      }
      menuConfigApi.importInterfaceMenuConfig(params).then(res => {
        if (res.code === 'ACK') {
          this.$message({
            message: `文件上传成功`,
            type: 'success'
          })
          this.closeUploadDialog()
          this.onSearch()
          this.onOperate('edit', { id: res.data })
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
        loading.close()
      }).catch(() => {
        loading.close()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .interface-menu-config-container {
    padding: 20px;
    position: relative;
    &-btn {
      position: absolute;
      right: 20px;
      top: 20px;
      z-index: 1;
    }
    .operate-des {
      border: none;
      padding: 0;
      &:hover {
        background: none;
      }
    }
  }
  .des-style {
    line-height: 30px;
    font-size: 14px;
  }
</style>
