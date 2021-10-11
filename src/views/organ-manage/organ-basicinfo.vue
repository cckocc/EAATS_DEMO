<template>
  <div>
    <el-tabs v-model="activeName" class="custom-main-tabs">
      <el-tab-pane label="信息维护" name="first">
        <div class="info-wrap">
          <el-form
            ref="infoForm"
            :model="infoObj.form"
            :rules="infoObj.rules"
            label-position="left"
            size="mini"
            inline
          >
            <div class="info-wrap-header">
              <img class="user" src="@/assets/style/org/info-user.png" alt="user-image">
              <div class="content">
                <div class="content-title">{{ infoObj.form.instnCnFullNm }}</div>
                <div class="content-code">
                  <span v-if="!isEdit">统一社会信用代码：{{ infoObj.form.instnCd }}</span>
                  <el-form-item v-else label="统一社会信用代码：" prop="instnCd">
                    <el-input
                      v-model="infoObj.form.instnCd"
                      placeholder="请输入"
                      maxlength="18"
                      style="width: 300px;"
                      clearable
                    />
                  </el-form-item>
                </div>
              </div>
              <template v-if="!isEdit">
                <img v-if="infoObj.auditStatus.code === '00'" class="status" src="@/assets/style/org/info-audit.png" alt="info">
                <img v-if="infoObj.auditStatus.code === '05'" class="status" src="@/assets/style/org/info-auditing.png" alt="info">
                <img v-if="infoObj.auditStatus.code === '10'" class="status" src="@/assets/style/org/info-pass.png" alt="info">
                <img v-if="infoObj.auditStatus.code === '90'" class="status" src="@/assets/style/org/info-reject.png" alt="info">
                <img v-if="infoObj.auditStatus.code === '15'" class="status" src="@/assets/style/org/info-disabled.png" alt="info">
              </template>
            </div>
            <div class="info-wrap-container">
              <div class="title">审核反馈</div>
              <div v-if="infoObj.auditStatus.text ==='通过' || infoObj.auditStatus.text === '拒绝'" class="feedback">
                <div v-for="item in infoObj.auditRemarkList" :key="item">{{ item }}</div>
              </div>
              <template v-if="['00', '05'].includes(infoObj.auditStatus.code) && infoObj.waitInstType">
                <div class="title">审核中机构身份</div>
                <div class="feedback">
                  <div v-for="item in infoObj.waitInstType" :key="item">{{ item }}</div>
                </div>
              </template>
              <div class="title">{{ isEdit ? '机构身份' : '已生效机构身份' }}</div>
              <div class="org-wrap">
                <el-button
                  v-for="item in infoObj.instiTypeList"
                  :key="item.code"
                  :class="{ active: item.active }"
                  :disabled="item.active && !isMoreOrg"
                  type="text"
                  class="org-wrap-item"
                  @click="isEdit ? onClickOrg(item) : null"
                >
                  <img class="img" :src="item.active ? item.urlActive : item.url" alt="user-image">
                  <span class="text">{{ item.label }}</span>
                </el-button>
              </div>
              <div v-if="hasOrgSystem && isEdit" class="system-wrap">
                <div class="system-wrap-row">
                  <el-checkbox v-model="infoObj.hasRead">本机构已仔细阅读<span class="blue" @click.prevent="showDialog">《中国外汇交易中心系统接入开发机构管理办法》</span>，理解上述条款，并承诺遵守</el-checkbox>
                </div>
                <div class="system-wrap-row">
                  下载《中国外汇交易中心系统接入开发机构申请书》<span class="orange">附件盖章后上传</span>
                </div>
                <div class="system-wrap-row">
                  <el-upload
                    class="custom-upload-hide"
                    action="fakeaction"
                    :file-list="infoObj.systemFileList"
                    :on-preview="onPreviewLocal"
                    disabled
                  />
                </div>
              </div>
              <div v-if="hasOrgSystem" class="system-wrap-row">
                <el-form-item
                  label=""
                  prop="instiFileDtoList.length"
                  :rules="infoObj.rules.instiFileDtoList"
                >
                  <el-upload
                    v-if="isEdit"
                    action="fakeaction"
                    :accept="accept"
                    :file-list="infoObj.form.instiFileDtoList"
                    :http-request="param => uploadFile(param, infoObj.form, 'instiFileDtoList')"
                    :on-preview="onPreview"
                    :on-remove="(file, fileList) =>onRemoveFile(file, fileList, infoObj.form, 'instiFileDtoList')"
                    :on-error="onError"
                  >
                    <el-button slot="trigger" type="primary">上传附件</el-button>
                    <div slot="tip" class="gray mt10">
                      请阅读
                      <el-popover
                        placement="right"
                        width="400"
                        trigger="hover"
                      >
                        <div class="files-wrap">
                          <div class="files-wrap-title">上传文件列表</div>
                          <p>1、盖章《中国外汇交易中心系统接入开发机构申请书》</p>
                          <p>2、证明机构资质的材料，包括经年检的营业执照复印件，经交易中心同意后也可提交其他相关证明材料</p>
                          <p>3、证明技术业务能力的材料，如机构基本信息、近五年承担项目情况、项目实施主要人员、项目管理和售后服务、维护培训服务、资质及认证情况等</p>
                          <p>4、上述申请材料均应加盖机构公章或有效授权印鉴</p>
                        </div>
                        <span slot="reference" class="blue">上传文件列表</span>
                      </el-popover>
                      ，根据项目情况提供</div>
                  </el-upload>
                  <el-input v-model="infoObj.form.instiFileDtoList.length" style="display: none;" />
                  <el-upload
                    v-if="!isEdit"
                    class="custom-upload-hide"
                    action="fakeaction"
                    :file-list="infoObj.form.instiFileDtoList"
                    :on-preview="onPreview"
                    disabled
                  />
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
        <div v-if="userInfo.roleType.name === 'AGENCY_ADMIN'" class="btn-wrap">
          <template v-if="isEdit">
            <el-button
              v-preventReClick
              type="primary"
              class="button-primary"
              :disabled="(hasOrgSystem && !infoObj.hasRead) || ['00', '05'].includes(infoObj.auditStatus.code)"
              @click="onSubmit"
            >提交</el-button>
            <el-button
              class="button-default"
              @click="onCancel"
            >取消</el-button>
          </template>
          <template v-else>
            <el-button
              v-preventReClick
              type="primary"
              :disabled="['00', '05'].includes(infoObj.auditStatus.code)"
              @click="isEdit = true"
            >编辑</el-button>
          </template>
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label="接口信息" name="second">
        <div class="main-body">
          <div class="main-body-top">
            <el-form
              ref="searchForm"
              :model="mainObj.searchForm"
              size="mini"
              inline
            >
              <el-form-item label="产品类型/市场" prop="market">
                <el-select v-model="mainObj.searchForm.market" multiple placeholder="--全部--" clearable>
                  <el-option
                    v-for="item in marketOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="API账号" prop="APIAccount">
                <el-input v-model="mainObj.searchForm.APIAccount" />
              </el-form-item>
              <el-form-item label="服务状态" prop="serveiceStatus">
                <el-select v-model="mainObj.searchForm.serveiceStatus" multiple placeholder="--全部--" clearable>
                  <el-option
                    v-for="item in serveiceOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="流程状态" prop="processStatus">
                <el-select v-model="mainObj.searchForm.processStatus" multiple placeholder="--全部--" clearable>
                  <el-option
                    v-for="item in processInterOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="onSearch">筛选</el-button>
                <el-button size="mini" @click="onReset('searchForm')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="main-body-bottom">
            <div class="table">
              <el-table
                :data="mainObj.list"
                :cell-class-name="cellClassName"
                class="interface-table"
                style="width: 100%"
                fit
                stripe
                border
                highlight-current-row
              >
                <el-table-column show-overflow-tooltip prop="interfaceName" label="接口" min-width="300">
                  <template slot-scope="scope">
                    <template v-if="scope.row.deleteFlag">
                      <div class="cancel-flag">
                        <div class="cancel-flag-bg" />
                        <div class="cancel-flag-text" />
                      </div>
                      <span class="cancel-flag-interface">{{ scope.row.interfaceName }}</span>
                    </template>
                    <span v-else>{{ scope.row.interfaceName }}</span>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="interfaceState" label="接口状态" min-width="140" />
                <el-table-column show-overflow-tooltip prop="apiAccount" label="API账号信息" width="160" />
                <el-table-column label="业务联系人">
                  <el-table-column show-overflow-tooltip prop="businessName" label="姓名" width="80" />
                  <el-table-column show-overflow-tooltip prop="businessTel" label="手机号码" width="120" />
                </el-table-column>
                <el-table-column label="技术联系人">
                  <el-table-column show-overflow-tooltip prop="skillName" label="姓名" width="100" />
                  <el-table-column show-overflow-tooltip prop="skillTel" label="手机号码" width="120" />
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="applyNo" label="服务单号" width="160" />
              </el-table>
            </div>
            <div class="pagination">
              <el-pagination
                :current-page="mainObj.currentPage"
                :page-sizes="[20,50,100]"
                :page-size="mainObj.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="mainObj.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </div>
      </el-tab-pane> -->
    </el-tabs>
    <el-dialog
      title="《中国外汇交易中心系统接入开发机构管理办法》"
      :visible.sync="protocolDialogObj.visible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      destroy-on-close
      width="1200px"
    >
      <div class="content">
        <div v-html="protocolDialogObj.html" />
      </div>
      <div slot="footer">
        <el-button
          class="button-default"
          @click="protocolDialogObj.visible = false"
        >取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { validSocialCode } from '@/utils/validate'
import globalOptions from '@/utils/globalOptionsValue'
import orgInfoApi from '@/api/orgInfoApi'
import { downloadTourist, uploadLogin } from '@/api/file'
import { downloadFile } from '@/utils/index.js'
import axios from 'axios'
export default {
  data() {
    const validateIds = (rule, value, callback) => {
      if (value === 0) {
        callback(new Error('不能为空'))
      } else {
        callback()
      }
    }
    const validateSocial = (rule, value, callback) => {
      if (!validSocialCode(value)) {
        callback(new Error('统一社会信用代码格式不正确'))
      } else {
        callback()
      }
    }
    return {
      activeName: 'first',
      isEdit: false,
      infoObj: {
        id: null,
        form: {
          instnCnFullNm: '',
          instnCd: '',
          instiFileDtoList: []
        },
        rules: {
          instnCd: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { required: true, validator: validateSocial, trigger: 'blur' }
          ],
          instiFileDtoList: [
            { required: true, validator: validateIds, trigger: 'change' }
          ]
        },
        instiTypeList: [
          {
            code: '00',
            label: '本币市场成员',
            active: false,
            url: require('@/assets/style/org/info-org-market.png'),
            urlActive: require('@/assets/style/org/info-org-market-active.png')
          },
          {
            code: '05',
            label: '外汇市场成员',
            active: false,
            url: require('@/assets/style/org/info-org-market.png'),
            urlActive: require('@/assets/style/org/info-org-market-active.png')
          },
          {
            code: '10',
            label: '信息商',
            active: false,
            url: require('@/assets/style/org/info-org-info.png'),
            urlActive: require('@/assets/style/org/info-org-info-active.png')
          },
          {
            code: '15',
            label: '系统接入开发机构',
            active: false,
            url: require('@/assets/style/org/info-org-system.png'),
            urlActive: require('@/assets/style/org/info-org-system-active.png')
          }
        ],
        hasRead: false,
        auditStatus: {},
        auditRemarkList: [],
        systemFileList: [
          {
            fileName: '中国外汇交易中心系统接入开发机构申请书.docx',
            name: '中国外汇交易中心系统接入开发机构申请书.docx',
            url: ''
          }
        ]
      },
      accept: '.jpg,.jpeg,.png,.pdf',
      serveiceOptions: globalOptions.serveiceOptions,
      processInterOptions: globalOptions.processInterOptions,
      marketOptions: [],
      mainObj: {
        list: [],
        searchForm: {
          APIAccount: '',
          processStatus: [],
          market: [],
          serveiceStatus: []
        },
        currentPage: 1,
        pageSize: 20,
        total: 0
      },
      protocolDialogObj: {
        visible: false,
        title: '',
        html: ''
      }
    }
  },
  computed: {
    hasOrgSystem() {
      return this.infoObj.instiTypeList.find(e => e.code === '15').active
    },
    isMoreOrg() {
      return this.infoObj.instiTypeList.filter(e => e.active).length > 1
    },
    userInfo() {
      return this.$store.getters.userInfo
    }
  },
  created() {
    // this.getProductMarket()
    this.fetchData()
    // this.fetchInterface()
  },
  methods: {
    onClickOrg(item) {
      if (item.active) {
        const orgActiveList = this.infoObj.instiTypeList.filter(e => e.active)
        if (orgActiveList.length > 1) {
          this.$confirm('取消该机构身份后，本机构将不再能申请该机构身份下的所有业务，如果某个用户仅拥有这一个身份，则该用户将不再能登录本系统，确定取消勾选？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            item.active = !item.active
          })
        }
      } else {
        item.active = !item.active
      }
    },
    onSubmit() {
      this.$refs.infoForm.validate(valid => {
        if (valid) {
          const instiTypeList = []
          this.infoObj.instiTypeList.forEach(e => {
            if (e.active) {
              instiTypeList.push(e.code)
            }
          })
          const fileIdList = []
          this.infoObj.form.instiFileDtoList.forEach(e => {
            fileIdList.push(e.fileId)
          })
          const params = {
            id: this.infoObj.id,
            instiType: instiTypeList.toString(),
            instnCd: this.infoObj.form.instnCd,
            fileIdList: fileIdList
          }
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          orgInfoApi.updateInfo(params).then(res => {
            this.isEdit = false
            this.$message({
              message: '机构信息提交成功',
              type: 'success'
            })
            this.fetchData()
          }).finally(() => {
            loading.close()
          })
        }
      })
    },
    onCancel() {
      this.isEdit = false
      this.fetchData()
    },
    onRemoveFile(file, fileList, item, key) {
      console.log('remove:' + file, fileList)
      item[key] = fileList
    },
    onError(err, file, fileList) {
      console.log('error:' + err, file, fileList)
    },
    uploadFile(param, item, key) {
      const file = param.file
      console.log(file)
      const fileNameArr = file.name.split('.')
      const fileType = fileNameArr[fileNameArr.length - 1]
      // 兼容ie，因为el-upload的accept不支持ie
      if (this.accept.indexOf(fileType) < 0) {
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
            message: `${res.data.fileName}上传成功`,
            type: 'success'
          })
          item[key].push({
            name: res.data.fileName,
            fileName: res.data.fileName,
            fileId: res.data.id
          })
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      }).catch(() => {
        loading.close()
        param.onError()
      })
    },
    onPreview(file) {
      console.log('preview:' + file)
      const fileObj = {
        fileId: file.fileId,
        fileName: file.name || file.fileName
      }
      this.downloadFile(fileObj)
    },
    onPreviewLocal(file) {
      console.log('preview:' + file)
      axios.get(file.name, {
        responseType: 'blob'
      }).then(res => {
        console.log(res)
        downloadFile(res.data, file.name)
      })
    },
    downloadFile(fileObj) {
      console.log(fileObj)
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      downloadTourist(fileObj.fileId).then(res => {
        loading.close()
        downloadFile(res.data, fileObj.fileName, fileObj.type)
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
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0 && row.deleteFlag) {
        return 'cancel-flag-box'
      }
      return ''
    },
    getProductMarket() {
      orgInfoApi.getProductMarket().then(res => {
        if (res.code === 'ACK') {
          this.marketOptions = []
          res.data.forEach(e => {
            const item = {}
            item.label = e
            item.value = e
            this.marketOptions.push(item)
          })
        }
      })
    },
    onSearch() {
      this.mainObj.currentPage = 1
      this.fetchInterface()
    },
    onReset(formName) {
      this.$refs[formName].resetFields()
      this.fetchInterface()
    },
    handleSizeChange(val) {
      this.mainObj.pageSize = val
      this.mainObj.currentPage = 1
      this.fetchInterface()
    },
    handleCurrentChange(val) {
      this.mainObj.currentPage = val
      this.fetchInterface()
    },
    handleDownloadFile(url, name) {
      const a = document.createElement('a')
      a.setAttribute('href', url)
      const fileName = name
      a.setAttribute('download', fileName)
      a.setAttribute('target', '_blank')
      const clickEvent = document.createEvent('MouseEvents')
      clickEvent.initEvent('click', true, true)
      a.dispatchEvent(clickEvent)
    },
    fetchInterface() {
      const params = {
        apiAccount: this.mainObj.searchForm.APIAccount,
        auditStatus: this.mainObj.searchForm.processStatus,
        levelOneName: this.mainObj.searchForm.market,
        serviceType: this.mainObj.searchForm.serveiceStatus,
        page: this.mainObj.currentPage,
        pageSize: this.mainObj.pageSize
      }
      orgInfoApi.interfaceInfo(params).then(res => {
        if (res.data.list !== null) {
          this.mainObj.list = res.data.list
          this.mainObj.total = res.data.totalRecord
        }
      })
    },
    fetchData() {
      const params = {
        userId: this.$store.getters.userId
      }
      orgInfoApi.fetchInfo(params).then(res => {
        const data = res.data
        this.infoObj.id = data.id
        this.infoObj.form.instnCnFullNm = data.instnCnFullNm
        this.infoObj.form.instnCd = data.instnCd
        this.infoObj.auditStatus = data.auditStatus
        this.infoObj.auditRemarkList = data.auditRemarkList
        this.infoObj.waitInstType = data.waitInstType
        this.infoObj.instiTypeList.map(e => {
          if (data.instiTypeList.includes(e.code)) {
            e.active = true
          } else {
            e.active = false
          }
          return e
        })
        this.infoObj.form.instiFileDtoList = data.instiFileDtoList ? data.instiFileDtoList.map(e => {
          e.name = e.fileName
          return e
        }) : []
        this.infoObj.hasRead = false
      })
    },
    showDialog() {
      console.log(123)
      orgInfoApi.getCluseContent().then(res => {
        this.protocolDialogObj.html = res.data.body
        this.protocolDialogObj.visible = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.info-wrap {
  max-width: 1220px;
  margin: 0 auto;
  border: 1px solid #DFDFDF;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
  &-header {
    position: relative;
    width: 100%;
    height: 121px;
    background: url('~@/assets/style/org/info_user_bg.png');
    background-size: 100%;
    display: flex;
    align-items: center;
    .user {
      margin-left: 57px;
    }
    .content {
      margin-left: 19px;
      color: #fff;
      &-title {
        font-size: 24px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        margin-bottom: 14px;
      }
      &-code {
        font-size: 14px;
        font-family: Microsoft YaHei;
        &::v-deep .el-form-item__label {
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #FFFFFF;
        }
      }
    }
    .status {
      position: absolute;
      top: 21px;
      right: 72px;
    }
  }
  &-container {
    background: #fff;
    padding: 40px 72px;
    .title {
      margin-bottom: 10px;
      border-left: 4px solid #2494FE;
      padding-left: 8px;
      font-size: 20px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #333333;
    }
    .feedback {
      margin: 17px 0 40px;
      font-size: 14px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      line-height: 26px;
      color: #333333;
      word-break: break-all;
    }
    .org-wrap {
      margin: 25px 0 48px;
      display: flex;
      justify-content: space-between;
      &-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 251px;
        height: 212px;
        background: #fff;
        border: 1px solid #D9E3F2;
        border-radius: 4px;
        ::v-deep >span {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .text {
          margin-top: 16px;
          font-size: 16px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: #333333;
        }
        &.active {
          border: 1px solid #1581FF;
          box-shadow: 0px 0px 20px rgba(24, 115, 238, 0.3);
          .text {
            color: #0050B3;
          }
        }
      }
    }
    .system-wrap {
      &-row {
        font-size: 14px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #303030;
        margin-bottom: 10px;
        & .blue {
          color: #2C76D1;
        }
        & .orange {
          color: #F56C6C;
        }
        & .gray {
          color: #8C8C8C;
        }
      }
    }
  }
}
.content {
  width: 100%;
  word-break: break-word;
  word-wrap: break-word;
}
.files-wrap {
  padding: 12px;
  color: #333333;
  &-title {
    font-size: 16px;
    font-family: Source Han Sans CN;
    font-weight: bold;
  }
  p {
    line-height: 24px;
  }
}
.btn-wrap {
  text-align: center;
  margin: 50px 0;
}
.el-table {
  ::v-deep .cancel-flag {
    position: absolute;
    top: 0;
    right: 0;
    &-box {
      &>div {
        padding-right: 50px;
      }
    }
    &-bg {
      width: 0;
      height: 0;
      border-top: 36px solid #cccccc;
      border-left: 80px solid transparent;
    }
    &-text {
      position: absolute;
      top: 0;
      right: 2px;
      color: #fff;
      font-size: 12px;
      &:after {
        content: '已下线';
      }
    }
    &-interface {
      color: #cccccc;
    }
  }
}
</style>
