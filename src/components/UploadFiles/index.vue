<template>
  <div>
    <template v-if="!readonly">
      <el-upload
        action="fakeaction"
        :file-list="fileList"
        :http-request="uploadFile"
        :before-upload="beforeUpload"
        :on-remove="onRemove"
        :on-preview="onPreview"
        :accept="accept"
        :limit="limit"
      >
        <el-button size="small" type="primary">
          <!-- <img src="@/assets/icon/add.png" alt=""> -->
          <span class="text">{{ $t('upload.choseFile') }}</span>
        </el-button>
        <div slot="tip" class="el-upload__tip" v-html="tips" />
      </el-upload>
    </template>
    <div v-else class="view-wrap">
      <div v-for="(item, index) in fileList" :key="index" class="el-upload-list__item is-success" style="margin: 0;">
        <a class="el-upload-list__item-name" @click="onPreview(item)">
          <i class="el-icon-document" />
          {{ item.fileName }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import {
  upload,
  uploadLogin,
  getFileNames,
  downloadAuthen,
  downloadTourist
} from '@/api/file'
import Emitter from 'element-ui/lib/mixins/emitter'
import { downloadFile } from '@/utils/index'
export default {
  name: 'UploadFiles',
  mixins: [Emitter],
  props: {
    value: {
      type: Array,
      default: () => { [] }
    },
    tips: {
      type: String,
      default: ''
    },
    accept: {
      type: String,
      default: ''
    },
    limit: {
      type: Number,
      default: 10
    },
    size: {
      type: Number,
      default: 1
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fileList: []
    }
  },
  computed: {
    isLogin() {
      const { token } = this.$store.getters
      return !!token
    }
  },
  watch: {
    value: {
      handler(newVal, oldVal) {
        console.log(newVal, oldVal)
        const ids = this.fileList.reduce((prev, curr) => {
          prev.push(curr.fileId)
          return prev
        }, [])
        if (newVal.toString() !== ids.toString()) {
          this.addFileIds(newVal)
        }
      },
      immediate: true
    }
  },
  methods: {
    updateIds() {
      const ids = this.fileList.reduce((prev, curr) => {
        prev.push(curr.fileId)
        return prev
      }, [])
      this.$emit('input', ids)
    },
    addFileIds(ids) {
      if (ids.length > 0) {
        getFileNames(ids).then(res => {
          this.fileList = res.data.map(e => {
            e.name = e.fileName
            return e
          })
        })
      } else {
        this.fileList = []
      }
    },
    beforeUpload(file) {
      console.log(file)
      const fileSize = file.size
      const fileName = file.name
      const fileType = fileName.substring(fileName.lastIndexOf('.')).toLowerCase()
      const isFileType = this.accept ? this.accept.split(',').includes(fileType) : true
      const isFileSize = fileSize / 1024 / 1024 <= this.size
      if (!isFileType) {
        this.$message({
          message: this.$t('upload.message.errorFileTypeTips'),
          type: 'info'
        })
      }
      if (!isFileSize) {
        this.$message({
          message: this.$t('upload.message.errorFileSizeTips') + `${this.size}MB`,
          type: 'info'
        })
      }
      return isFileType && isFileSize
    },
    onRemove(file, fileList) {
      this.fileList = fileList
      this.updateIds()
    },
    async uploadFile(param) {
      const file = param.file
      const fileName = file.name
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        // 根据后台需求数据格式
        const form = new FormData()
        // 文件对象
        form.append('file', file)
        let r
        if (this.isLogin) {
          r = await uploadLogin(form)
        } else {
          r = await upload(form)
        }
        const option = {
          fileId: r.data.id,
          name: r.data.fileName,
          fileName: r.data.fileName
        }
        this.fileList.push(option)
        // this.ids.push(r.data.id)
        this.updateIds()
        loading.close()
        this.$message({
          message: `${fileName} ` + this.$t('upload.message.uploadSuccess'),
          type: 'success'
        })
      } catch (e) {
        loading.close()
        param.onError()
        // this.$message({
        //   message: `${fileName} ` + this.$t('upload.message.uploadFail'),
        //   type: 'error'
        // })
      }
    },
    onPreview(file) {
      console.log('preview:' + file)
      const fileObj = {
        fileId: file.fileId,
        name: file.name
      }
      this.downloadFile(fileObj)
    },
    downloadFile(fileObj) {
      console.log(fileObj)
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if (this.isLogin) {
        downloadAuthen(fileObj.fileId).then(res => {
          loading.close()
          downloadFile(res.data, fileObj.name, fileObj.type)
          this.$message({
            type: 'success',
            message: this.$t('upload.message.downloadSuccess')
          })
        }).catch(() => {
          loading.close()
          this.$message({
            type: 'error',
            message: this.$t('upload.message.downloadFail')
          })
        })
      } else {
        downloadTourist(fileObj.fileId).then(res => {
          loading.close()
          downloadFile(res.data, fileObj.name, fileObj.type)
          this.$message({
            type: 'success',
            message: this.$t('upload.message.downloadSuccess')
          })
        }).catch(() => {
          loading.close()
          this.$message({
            type: 'error',
            message: this.$t('upload.message.downloadFail')
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
