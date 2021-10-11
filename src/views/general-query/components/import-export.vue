<template>
  <div>
    <div class="main-body-content mt20">
      <div class="btn-wrap">
        <el-upload
          action="fakeaction"
          :accept="acceptIsv"
          :show-file-list="false"
          :http-request="isvUploadFile"
        >
          <el-button
            v-preventReClick
            size="small"
            type="primary"
          >导入ISV看板</el-button>
        </el-upload>
        <el-upload
          class="ml10"
          action="fakeaction"
          :accept="acceptOrg"
          :show-file-list="false"
          :http-request="orgUploadFile"
        >
          <el-button
            v-preventReClick
            size="small"
            type="primary"
          >导入机构信息</el-button>
        </el-upload>
        <el-upload
          class="ml10"
          action="fakeaction"
          :accept="acceptFlow"
          :show-file-list="false"
          :http-request="flowUploadFile"
        >
          <el-button
            v-preventReClick
            size="small"
            type="primary"
          >导入流程图</el-button>
        </el-upload>
        <el-button
          v-preventReClick
          size="small"
          type="primary"
          class="ml10"
          @click="exportAllFlowChart"
        >导出流程图</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { importIsv, importOrg, importFlowChart, exportAllFlowChart } from '@/api/gripManageApi'
import { downloadFile } from '@/utils/index'
export default {
  data() {
    return {
      acceptFlow: '.zip',
      acceptIsv: '.xlsx,.xls',
      acceptOrg: '.xlsx,.xls'
    }
  },
  created() {
  },
  methods: {
    exportAllFlowChart() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      exportAllFlowChart().then(res => {
        loading.close()
        const fileName = window.decodeURI(res.headers['content-disposition'].split('fileName=')[1], 'UTF-8')
        downloadFile(res.data, fileName)
        this.$message({
          type: 'success',
          message: '导出成功!'
        })
      }).catch(() => {
        loading.close()
        this.$message({
          type: 'error',
          message: '导出失败!'
        })
      })
    },
    async flowUploadFile(params) {
      const file = params.file
      const fileName = file.name
      const isLt = file.size / 1024 / 1024 <= 100
      if (!isLt) {
        this.$message.error(`上传失败，文件大小超过100MB`)
        return
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const form = new FormData()
        form.append('file', file)
        await importFlowChart(form)
        this.$message({
          message: `${fileName}上传成功`,
          type: 'success'
        })
        loading.close()
      } catch (e) {
        this.$alert(e, '提示', {
          confirmButtonText: '确定',
          customClass: 'err-tip-alert',
          showClose: false
        })
        loading.close()
      }
    },
    async isvUploadFile(params) {
      const file = params.file
      const fileName = file.name
      const isLt = file.size / 1024 / 1024 <= 100
      if (!isLt) {
        this.$message.error(`上传失败，文件大小超过100MB`)
        return
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const form = new FormData()
        form.append('file', file)
        await importIsv(form)
        this.$message({
          message: `${fileName}上传成功`,
          type: 'success'
        })
        loading.close()
      } catch (e) {
        this.$alert(e, '提示', {
          confirmButtonText: '确定',
          customClass: 'err-tip-alert',
          showClose: false
        })
        loading.close()
      }
    },
    async orgUploadFile(params) {
      const file = params.file
      const fileName = file.name
      const isLt = file.size / 1024 / 1024 <= 100
      if (!isLt) {
        this.$message.error(`上传失败，文件大小超过100MB`)
        return
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const form = new FormData()
        form.append('file', file)
        await importOrg(form)
        this.$message({
          message: `${fileName}上传成功`,
          type: 'success'
        })
        loading.close()
      } catch (e) {
        this.$alert(e, '提示', {
          confirmButtonText: '确定',
          customClass: 'err-tip-alert',
          showClose: false
        })
        loading.close()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-wrap {
  display: flex;
  padding: 10px;
}
</style>
