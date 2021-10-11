<template>
  <div>
    <div v-if="operationType === 'upload'" class="file-td">
      <!-- <div v-for="item in uploadTdObj.val" :key="item.fileId" class="file-td-row">
        <div class="file-td-row-name" @click="downloadLastVersionFile(item)">{{ item.name }}</div>
        <div class="file-td-row-operate">
          <span class="mr5" @click="showUploadDialog('edit', item)">更新</span>
          <span @click="showVersionRecord(item)">版本记录</span>
        </div>
        <el-dropdown>
          <span class="file-td-row-link">
            操作<i class="el-icon-arrow-down" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <div @click="showUploadDialog('edit', item)">更新</div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div @click="showVersionRecord(item)">版本记录</div>
            </el-dropdown-item>
            <el-dropdown-item>
              <div @click="deleteFile">删除</div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div> -->
      <el-dropdown v-if="uploadTdObj.val.length > 0">
        <el-button type="primary" size="mini" class="file-td-download">
          下载<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="item in uploadTdObj.val"
            :key="item.fileId"
            class="file-td-row"
          >
            <div
              class="file-td-row-name"
              @click="downloadLastVersionFile(item)"
            >
              {{ item.name }}
            </div>
            <div class="file-td-row-operate">
              <span class="mr5" @click="showUploadDialog('edit', item)"
                >更新</span
              >
              <span @click="showVersionRecord(item)">版本记录</span>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button type="primary" size="mini" @click="showUploadDialog('add')"
        >上传</el-button
      >
      <!-- <el-button class="file-td-btn" type="primary" size="mini" @click="showUploadDialog('add')">上传</el-button> -->
    </div>
    <div v-if="operationType === 'download'" class="file-td">
      <el-dropdown v-if="uploadTdObj.val.length > 0">
        <el-button type="primary" size="mini" class="file-td-download">
          下载<i class="el-icon-arrow-down el-icon--right" />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="item in uploadTdObj.val"
            :key="item.fileId"
            class="file-td-row"
          >
            <div class="file-td-row-name" @click="downloadFile(item)">
              {{ item.name }}
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <div v-for="item in uploadTdObj.val" :key="item.fileId" class="file-td-row">
        <div class="file-td-row-name" @click="downloadFile(item)">{{ item.name }}</div>
      </div> -->
    </div>
    <!-- 上传/更新 -->
    <el-dialog
      :title="uploadDialogObj.title"
      width="658px"
      :visible.sync="uploadDialogObj.visible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      destroy-on-close
      @close="closeUploadDialog"
    >
      <el-upload
        ref="upload"
        action="fakeaction"
        :accept="accept"
        :file-list="fileList"
        :auto-upload="false"
        :on-change="onChangeFile"
        :on-remove="onRemoveFile"
      >
        <el-button slot="trigger" size="small" type="primary"
          >选取文件</el-button
        >
        <div slot="tip" class="el-upload__tip">只能上传{{ accept }}文件</div>
      </el-upload>
      <div slot="footer" class="text-center">
        <span slot="footer">
          <el-button type="primary" class="button-primary" @click="uploadFile">
            确定
          </el-button>
          <el-button class="button-default" @click="closeUploadDialog">
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
        header-row-class-name="header-row-th"
        :header-row-style="{ height: '42px' }"
        :header-cell-style="{ padding: 0 }"
        :row-style="{ height: '42px' }"
        :cell-style="{ padding: 0 }"
      >
        <el-table-column prop="type" label="文件分类" width="120" />
        <el-table-column
          show-overflow-tooltip
          prop="name"
          label="文件名称"
          min-width="150"
        />
        <el-table-column prop="createTs" label="更新时间" width="155" />
        <el-table-column prop="versionCt" label="版本号" width="70">
          <template slot-scope="scope">
            <span>{{ scope.row.versionCt | versionCtFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="80">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="onOperateVersionRecord('download', scope.row)"
            >
              <i class="el-icon-download" />
            </el-button>
            <el-button
              type="text"
              @click="onOperateVersionRecord('delete', scope.row)"
            >
              <i class="el-icon-delete" />
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import uploadResourceApi from '@/api/uploadResourceApi'
import { downloadAuthen } from '@/api/file'
import { downloadFile } from '@/utils/index'
export default {
  name: 'FileTd',
  filters: {
    versionCtFilter(val) {
      return (val / 10).toFixed(1)
    },
  },
  props: {
    uploadTdObj: {
      type: Object,
      default: () => {},
    },
    operationType: {
      type: String,
      default: '',
    },
    columnTitle: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      uploadDialogObj: {
        visible: false,
        title: '',
        type: '',
        row: {},
      },
      fileList: [],
      versionRecordDialogObj: {
        visible: false,
        title: '版本记录',
        row: {},
        list: [],
      },
    }
  },
  computed: {
    accept() {
      const acceptArr = [
        {
          key: '业务指引',
          value: '.PDF,.ZIP,.RAR',
        },
        {
          key: '开发指引',
          value: '.PDF,.ZIP,.RAR',
        },
        {
          key: '接口开发包',
          value: '.ZIP,.RAR',
        },
        {
          key: '协议条款',
          value: '.PDF,.ZIP,.RAR',
        },
      ]
      return acceptArr.find((e) => e.key === this.columnTitle).value
    },
  },
  created() {
    console.log(this.uploadTdObj)
  },
  methods: {
    closeUploadDialog() {
      this.$refs.upload.clearFiles()
      this.uploadDialogObj.visible = false
      this.fileList = []
    },
    showUploadDialog(type, row) {
      console.log(type, row)
      this.uploadDialogObj.visible = true
      this.uploadDialogObj.type = type
      if (type === 'add') {
        this.uploadDialogObj.title = `上传-${this.columnTitle}`
      } else if (type === 'edit') {
        this.uploadDialogObj.row = row
        this.uploadDialogObj.title = `更新-${this.columnTitle}-${row.name}`
      }
    },
    showVersionRecord(item) {
      this.versionRecordDialogObj.visible = true
      this.versionRecordDialogObj.row = item
      this.keyHistoryInfo()
    },
    keyHistoryInfo() {
      const params = {
        id: this.versionRecordDialogObj.row.id,
      }
      uploadResourceApi.keyHistoryInfo(params).then((res) => {
        if (res.code === 'ACK') {
          this.versionRecordDialogObj.list = res.data
        } else {
          this.$message({
            message: res.message,
            type: 'error',
          })
        }
      })
    },
    onOperateVersionRecord(type, row) {
      console.log(type, row)
      if (type === 'download') {
        console.log(type, row)
        const fileObj = {
          name: row.name,
          fileId: row.fileId,
        }
        this.downloadFile(fileObj)
      } else if (type === 'delete') {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            const params = {
              id: row.id,
            }
            uploadResourceApi.deleteResourcesFile(params).then((res) => {
              if (res.code === 'ACK') {
                this.$message({
                  message: `文件删除成功`,
                  type: 'success',
                })
                this.$parent.getResourcesKeyList()
                this.versionRecordDialogObj.list = res.data
                if (res.data.length === 0) {
                  this.versionRecordDialogObj.visible = false
                }
              } else {
                this.$message({
                  message: res.message,
                  type: 'error',
                })
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除',
            })
          })
      }
    },
    downloadLastVersionFile(item) {
      const fileObj = {
        name: item.name,
        fileId: item.fileId,
      }
      this.downloadFile(fileObj)
    },
    downloadFile(fileObj) {
      console.log(fileObj)
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      downloadAuthen(fileObj.fileId)
        .then((res) => {
          loading.close()
          downloadFile(res.data, fileObj.name)
          this.$message({
            type: 'success',
            message: '下载成功!',
          })
        })
        .catch(() => {
          loading.close()
          this.$message({
            type: 'error',
            message: '下载失败!',
          })
        })
    },
    deleteFile() {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    onChangeFile(file, fileList) {
      console.log(file, fileList)
      // this.fileList = fileList
      // 当多余一个的时候替换文件
      if (fileList.length > 1) {
        fileList.splice(0, 1)
      }
      this.fileList = fileList
    },
    onRemoveFile(file, fileList) {
      console.log(file, fileList)
      this.fileList = []
    },
    uploadFile() {
      console.log(this.fileList)
      if (this.fileList.length === 0) {
        this.$message({
          message: `请选择一个文件`,
          type: 'info',
        })
        return
      }
      const isLt100M = this.fileList[0].size / 1024 / 1024 <= 100
      if (!isLt100M) {
        this.$message({
          message: `上传失败，文件大小超过100MB`,
          type: 'info',
        })
        return
      }
      const file = this.fileList[0]
      const form = new FormData()
      form.append('file', file.raw)

      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      if (this.uploadDialogObj.type === 'add') {
        const params = {
          data: form,
          params: {
            key: this.uploadTdObj.key,
          },
        }
        uploadResourceApi
          .uploadResourcesFile(params)
          .then((res) => {
            if (res.code === 'ACK') {
              this.$message({
                message: `文件上传成功`,
                type: 'success',
              })
              this.$parent.getResourcesKeyList()
              this.closeUploadDialog()
            } else {
              this.$message({
                message: res.message,
                type: 'error',
              })
            }
            loading.close()
          })
          .catch(() => {
            loading.close()
          })
      } else if (this.uploadDialogObj.type === 'edit') {
        const params = {
          data: form,
          params: {
            id: this.uploadDialogObj.row.id,
          },
        }
        uploadResourceApi
          .updateResourcesFile(params)
          .then((res) => {
            if (res.code === 'ACK') {
              this.$message({
                message: `文件更新成功`,
                type: 'success',
              })
              this.$parent.getResourcesKeyList()
              this.closeUploadDialog()
            } else {
              this.$message({
                message: res.message,
                type: 'error',
              })
            }
            loading.close()
          })
          .catch(() => {
            loading.close()
          })
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.file-td {
  // padding-bottom: 40px;
  display: flex;
  flex-direction: column;
  &-download {
    width: 100%;
    margin-bottom: 10px;
  }
  &-row {
    display: flex;
    justify-content: space-between;
    line-height: 40px;
    &-name {
      cursor: pointer;
      color: #409eff;
      text-decoration: underline;
    }
    &-operate {
      cursor: pointer;
      color: #409eff;
      margin-left: 20px;
    }
    &-link {
      cursor: pointer;
      color: #409eff;
      i {
        font-size: 12px;
        padding-left: 5px;
      }
    }
  }
  &-btn {
    position: absolute;
    right: 5px;
    bottom: 5px;
  }
}
</style>
