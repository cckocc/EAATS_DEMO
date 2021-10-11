<template>
  <div class="main-body">
    <div class="main-body-bottom">
      <div class="main-body-bottom-btn">
        <div class="main-body-bottom-btn-left">
          <el-button type="primary" size="small" @click="showUploadDialog('add')">新增协议条款</el-button>
        </div>
      </div>
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
          prop="fileName"
          label="文件名称"
          min-width="400"
        />
        <el-table-column
          show-overflow-tooltip
          prop="fileUpdateDt"
          label="更新日期"
          width="100"
        />
        <el-table-column
          show-overflow-tooltip
          prop="loginName"
          label="创建人"
          min-width="120"
        />
        <el-table-column label="操作" width="140px" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" :disabled="scope.row.status" @click="onOperate('edit', scope.row)">
              更新
            </el-button>
            <el-button type="text" :disabled="scope.row.status" @click="onOperate('versionRecord', scope.row)">
              版本记录
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
    </div>
    <!-- 协议条款新增/更新 -->
    <el-dialog
      width="658px"
      :title="uploadDialogObj.title"
      :visible.sync="uploadDialogObj.visible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      destroy-on-close
      @close="uploadDialogObj.visible = false"
    >
      <div class="p20">
        <el-upload
          ref="upload"
          action="fakeaction"
          :accept="uploadDialogObj.accept"
          :file-list="uploadDialogObj.fileList"
          :http-request="uploadFile"
          :on-remove="onRemoveFile"
        >
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <div slot="tip" class="el-upload__tip">只能上传.pdf文件</div>
        </el-upload>

      </div>
      <div slot="footer" class="text-center">
        <span slot="footer">
          <el-button
            type="primary"
            class="button-primary"
            @click="onOperate('submit')"
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
    <!-- 版本记录 -->
    <el-dialog
      :title="versionRecordDialogObj.title"
      width="800px"
      :visible.sync="versionRecordDialogObj.visible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      destroy-on-close
      @close="versionRecordDialogObj.visible = false"
    >
      <el-table
        :data="versionRecordDialogObj.list"
        style="width: 100%"
        fit
        stripe
        border
        highlight-current-row
      >
        <el-table-column
          prop="fileName"
          label="文件名称"
          min-width="300"
        />
        <el-table-column
          show-overflow-tooltip
          prop="fileVersion"
          label="版本号"
          width="80"
        />
        <el-table-column
          prop="fileUpdateDt"
          label="更新日期"
          width="100"
        />
        <el-table-column
          prop="lastUpdatePerson"
          label="更新人"
          min-width="80"
        />
        <el-table-column
          align="center"
          label="操作"
          width="80"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="onOperateVersionRecord('download', scope.row)">
              <i class="el-icon-download" />
            </el-button>
            <el-button :disabled="scope.row.disabled" type="text" @click="onOperateVersionRecord('delete', scope.row)">
              <i class="el-icon-delete" />
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          :current-page="versionRecordDialogObj.currentPage"
          :page-size="versionRecordDialogObj.pageSize"
          :page-sizes="versionRecordDialogObj.pagesizes"
          :total="versionRecordDialogObj.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChangeRecord"
          @current-change="handleCurrentChangeRecord"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { downloadFile } from '@/utils/index'
import menuConfigApi from '@/api/grip-manage/menuConfigApi'
import { uploadLogin, downloadAuthen } from '@/api/file'
export default {
  name: 'InterfaceMenuConfig',
  data() {
    return {
      institutionType: '00',
      mainObj: {
        currentPage: 1,
        pageSize: 20,
        pagesizes: [20, 50, 100],
        total: 0,
        list: []
      },
      versionRecordDialogObj: {
        visible: false,
        title: '版本记录',
        row: {},
        currentPage: 1,
        pageSize: 20,
        pagesizes: [20, 50, 100],
        total: 0,
        list: []
      },
      uploadDialogObj: {
        visible: false,
        title: '',
        type: '',
        row: {},
        fileId: null,
        fileList: [],
        accept: '.pdf,.PDF'
      }
    }
  },
  created() {
    this.onSearch()
  },
  methods: {
    handleSizeChange(val) {
      this.mainObj.pageSize = val
      this.mainObj.currentPage = 1
      this.onSearch()
    },
    handleCurrentChange(val) {
      this.mainObj.currentPage = val
      this.onSearch()
    },
    onSearch() {
      const params = {
        page: this.mainObj.currentPage,
        pageSize: this.mainObj.pageSize
      }
      menuConfigApi.getProtocolClauseConfigList(params).then(res => {
        if (res.code === 'ACK') {
          this.mainObj.list = res.data.list
          this.mainObj.total = res.data.totalRecord
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    onOperate(type, row) {
      console.log(type, row)
      if (type === 'edit') {
        this.showUploadDialog('edit', row)
      } else if (type === 'versionRecord') {
        this.versionRecordDialogObj.visible = true
        this.versionRecordDialogObj.row = row
        this.initGetVersionRecordList()
      } else if (type === 'submit') {
        console.log(this.uploadDialogObj)
        if (this.uploadDialogObj.type === 'add') {
          console.log(this.uploadDialogObj)
          const form = new FormData()
          form.append('fileId', this.uploadDialogObj.fileId)
          menuConfigApi.addProtocolClauseConfig(form).then(res => {
            if (res.code === 'ACK') {
              this.$message({
                message: `协议条款新增成功`,
                type: 'success'
              })
              this.closeUploadDialog()
              this.onSearch()
            } else {
              this.$message({
                message: res.message,
                type: 'error'
              })
            }
          })
        } else if (this.uploadDialogObj.type === 'edit') {
          const form = new FormData()
          form.append('fileId', this.uploadDialogObj.fileId)
          form.append('id', this.uploadDialogObj.row.id)
          menuConfigApi.updateProtocolClauseConfig(form).then(res => {
            if (res.code === 'ACK') {
              this.$message({
                message: `协议条款更新成功`,
                type: 'success'
              })
              this.closeUploadDialog()
              this.onSearch()
            } else {
              this.$message({
                message: res.message,
                type: 'error'
              })
            }
          })
        }
      }
    },
    handleSizeChangeRecord(val) {
      this.versionRecordDialogObj.pageSize = val
      this.versionRecordDialogObj.currentPage = 1
      this.getVersionRecordList()
    },
    handleCurrentChangeRecord(val) {
      this.versionRecordDialogObj.currentPage = val
      this.getVersionRecordList()
    },
    initGetVersionRecordList() {
      this.versionRecordDialogObj.currentPage = 1
      this.getVersionRecordList()
    },
    getVersionRecordList() {
      const params = {
        id: this.versionRecordDialogObj.row.id,
        page: this.versionRecordDialogObj.currentPage,
        pageSize: this.versionRecordDialogObj.pageSize
      }
      menuConfigApi.getProtocolClauseConfigHistory(params).then(res => {
        if (res.code === 'ACK') {
          this.versionRecordDialogObj.list = res.data.list.map((e, i, arr) => {
            // 版本记录中只有一个文件时，不可删除
            if (arr.length === 1 && this.versionRecordDialogObj.currentPage === 1) {
              e.disabled = true
            } else {
              e.disabled = false
            }
            // e.disabled = (i + 1) === arr.length
            return e
          })
          this.versionRecordDialogObj.total = res.data.totalRecord
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    onOperateVersionRecord(type, row) {
      console.log(type, row)
      if (type === 'download') {
        console.log(type, row)
        const fileObj = {
          name: row.fileName,
          fileId: row.fileId
        }
        this.downloadFile(fileObj)
      } else if (type === 'delete') {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = {
            id: row.id,
            fileId: row.fileId
          }
          menuConfigApi.deleteProtocolClauseConfig(params).then(res => {
            if (res.code === 'ACK') {
              this.$message({
                message: `文件删除成功`,
                type: 'success'
              })
              if (this.versionRecordDialogObj.list.length === 1) {
                this.versionRecordDialogObj.currentPage = 1
              }
              this.getVersionRecordList()
            } else {
              this.$message({
                message: res.message,
                type: 'error'
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    downloadFile(fileObj) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      downloadAuthen(fileObj.fileId).then(res => {
        loading.close()
        downloadFile(res.data, fileObj.name)
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
      console.log(type, row)
      this.uploadDialogObj.visible = true
      this.uploadDialogObj.type = type
      this.uploadDialogObj.fileId = null
      if (type === 'add') {
        this.uploadDialogObj.title = `新增协议条款`
      } else if (type === 'edit') {
        this.uploadDialogObj.row = row
        this.uploadDialogObj.title = `更新协议条款-${row.fileName}`
      }
    },
    closeUploadDialog() {
      this.$refs.upload.clearFiles()
      this.uploadDialogObj.visible = false
      this.uploadDialogObj.fileList = []
    },
    onChangeFile(file, fileList) {
      console.log(file, fileList)
      const fileNameArr = file.name.split('.')
      const fileType = fileNameArr[fileNameArr.length - 1]
      // 兼容ie，因为el-upload的accept不支持ie
      if (this.uploadDialogObj.accept.indexOf(fileType) < 0) {
        this.$message.error(`上传失败，文件类型不支持`)
        return
      }
      const isLtSize = file.size / 1024 / 1024 <= 100
      if (!isLtSize) {
        this.$message({
          message: `上传失败，文件大小超过100MB`,
          type: 'info'
        })
        return
      }
      if (fileList.length > 1) {
        fileList.splice(0, 1)
      }
      this.uploadDialogObj.fileList = fileList
      this.uploadFile()
    },
    onRemoveFile(file, fileList) {
      console.log(file, fileList)
      this.uploadDialogObj.fileList = []
      this.uploadDialogObj.fileId = null
    },
    uploadFile(param) {
      const file = param.file
      console.log(file)
      const fileNameArr = file.name.split('.')
      const fileType = fileNameArr[fileNameArr.length - 1]
      // 兼容ie，因为el-upload的accept不支持ie
      if (this.uploadDialogObj.accept.indexOf(fileType) < 0) {
        this.$message.error(`上传失败，文件类型不支持`)
        param.onError()
        return
      }
      const isLt50M = file.size / 1024 / 1024 <= 100
      if (!isLt50M) {
        this.$message.error(`上传失败，文件大小超过100MB`)
        param.onError()
        return
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const form = new FormData()
      form.append('file', file)
      uploadLogin(form).then(res => {
        console.log(res)
        loading.close()
        if (res.code === 'ACK') {
          this.$message({
            message: `文件上传成功`,
            type: 'success'
          })
          this.uploadDialogObj.fileId = res.data.id
          this.uploadDialogObj.fileList = [
            {
              name: res.data.fileName,
              fileName: res.data.fileName,
              fileId: res.data.id
            }
          ]
          // this.closeUploadDialog()
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
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
  }
</style>
