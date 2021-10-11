<template>
  <div class="jgIsv_manage">
    <div
      v-loading="tableLoading"
      class="outer"
    >
      <div class="top_card">
        <!-- <span class="item_name"> -->
        <img class="item_name" src="~@/assets/style/instiname.svg" style="vertical-align: middle;" alt="">
        <div class="content">{{ InstiObject.cnFullName }}</div>
        <!-- </span> -->
        <span class="exam_status" :v-model="InstiObject.audtStatus">
          <img v-if="InstiObject.audtStatus==='90'" src="~@/assets/style/jggl_refuse_icon.svg" alt="">
          <img v-if="InstiObject.audtStatus==='10'" src="~@/assets/style/jggl_pass_icon.svg" alt="">
          <img v-if="InstiObject.audtStatus==='00'" src="~@/assets/style/jggl_examine_icon.svg" alt="">
        </span>
      </div>

      <div class="basic_intro">
        <div class="form-body-content">
          <div class="text_info">
            <div class="text_info-left">基础介绍</div>
            <el-button type="text" @click="isShow = !isShow"> <a style="color:#6494FD;text-decoration:none">{{ !isShow ? '展开' : '折叠' }}<i :class="[ !isShow ? 'el-icon-arrow-down' : 'el-icon-arrow-up','el-icon--right']" /></a></el-button>
          </div>

          <div v-show="isShow" class="outer_fd">
            <div>

              <div v-if="InstiObject.remarkList&&InstiObject.remarkList.length>0" class="fd_box">
                <div class="fd_text">审核反馈</div>
                <div v-for="item in InstiObject.remarkList" :key="item.id" class="return_text">
                  {{ item.remark }}
                </div>
              </div>

              <el-form ref="InstiObject" :label-position="labelPosition" :model="InstiObject" :rules="rules">
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="社会信用代码" prop="cfetsInstnCd">
                      <el-input
                        v-model="InstiObject.cfetsInstnCd"
                        placeholder="请输入社会信用代码"
                        :disabled="!editFlag"
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="成立日期" prop="esDate">
                      <el-date-picker
                        v-model="InstiObject.esDate"
                        suffix-icon="el-icon-date"
                        type="date"
                        placeholder="请选择日期"
                        :disabled="!editFlag"
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="注册资本 单位：万" prop="registCaptial">
                      <div style="display:flex">
                        <el-input
                          v-model="InstiObject.registCaptial"
                          placeholder="请输入注册资本"
                          :disabled="!editFlag"
                          clearable
                        />
                        <el-select v-model="money" :disabled="!editFlag" style="margin-left:1px">
                          <el-option
                            v-for="item in moneyList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                          />
                        </el-select>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="人员规模 单位：人" prop="staffScale">
                      <el-input
                        v-model="InstiObject.staffScale"
                        placeholder="请输入人员规模"
                        :disabled="!editFlag"
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="联系人" prop="contact">
                      <el-input
                        v-model="InstiObject.contact"
                        placeholder="请输入联系人"
                        :disabled="!editFlag"
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="联系邮箱" prop="conEmail">
                      <el-input
                        v-model="InstiObject.conEmail"
                        placeholder="请输入有效邮箱"
                        :disabled="!editFlag"
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item label="联系电话" prop="conMobile">
                      <el-input
                        v-model="InstiObject.conMobile"
                        placeholder="请输入手机号或者座机号"
                        :disabled="!editFlag"
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="16">
                    <el-form-item label="公司地址" prop="comAddress">
                      <el-input
                        v-model="InstiObject.comAddress"
                        placeholder="请输入公司地址"
                        :disabled="!editFlag"
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row class="system-wrap-row" :gutter="20">
                  <el-form-item
                    label=""
                    prop="fileList.length"
                    :rules="rules.fileIds"
                  >
                    <el-upload
                      v-if="editFlag"
                      ref="upload"
                      action="fakeaction"
                      :file-list="InstiObject.fileList"
                      :http-request="uploadFile"
                      :on-preview="onPreview"
                      :on-remove="handleRemove"
                      :before-remove="beforeRemove"
                      multiple
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
                            <p>（一）证明机构资质的材料，包括经年检的营业执照复印件，经交易中心同意后也可提交其他相关证明材料；</p>
                            <p>（二）证明技术业务能力的材料，如机构基本信息、近五年承担项目情况、项目实施主要人员、项目管理和售后服务、维护培训服务、资质及认证情况等；</p>
                            <p>（三）文件格式要求为：word、excel、pdf、图片（jpg、png、jpeg等）；</p>
                            <p>上述申请材料均应加盖机构公章或有效授权印鉴。</p>
                          </div>
                          <span slot="reference" class="blue">上传文件列表</span>
                        </el-popover>
                        ，根据项目情况提供</div>
                    </el-upload>
                    <el-input v-if="editFlag" v-model="InstiObject.fileList.length" style="display: none;" />
                    <el-upload
                      v-if="!editFlag && InstiObject.fileList.length > 0"
                      ref="upload"
                      class="custom-upload-hide"
                      action="fakeaction"
                      :file-list="InstiObject.fileList"
                      :on-preview="onPreview"
                      disabled
                    />
                  </el-form-item>
                </el-row>

                <div class="btn-container">
                  <el-button v-if="!editFlag && InstiObject.audtStatus!=='00'" type="primary" @click="editInfo()">
                    <span class="text">
                      编辑
                    </span>
                  </el-button>
                  <!-- <el-button v-if="!editFlag" type="primary" @click="editInfo()">
                    <span class="text">
                      编辑
                    </span>
                  </el-button> -->
                  <el-button v-if="!editFlag && InstiObject.audtStatus==='00'" :disabled="true" type="info">
                    <span class="text">
                      编辑
                    </span>
                  </el-button>
                  <el-button v-if="editFlag" type="primary" @click="saveInfo('InstiObject')">
                    <span class="text">
                      保存
                    </span>
                  </el-button>
                  <el-button v-if="editFlag" @click="cancelInfo()">
                    <span class="text">
                      取消
                    </span>
                  </el-button>

                </div>
              </el-form>
            </div>
          </div>
        </div>
      </div>

      <div class="support_interface">
        <div class="form-body-content">
          <div class="text_info">
            <div class="text_info-left">支持接口</div>
            <el-button type="text" @click="isShowInterface = !isShowInterface"> <a style="color:#6494FD;text-decoration:none">{{ !isShowInterface ? '展开' : '折叠' }}<i :class="[ !isShowInterface ? 'el-icon-arrow-down' : 'el-icon-arrow-up','el-icon--right']" /></a></el-button>
          </div>

          <div v-show="isShowInterface" class="show_box">
            <el-tabs
              v-model="institutionType"
              :before-leave="handleTabLeave"
              @tab-click="handleTabClick('click')"
            >
              <el-tab-pane :disabled="loadingTree" label="市场机构" name="00" />
              <el-tab-pane :disabled="loadingTree" label="信息商" name="10" />
            </el-tabs>

            <IsvManageSlot
              ref="tableTree"
              v-loading="loadingTree"
              :origin-data="originData"
              :table-columns="tableColumns"
              is-fold
              :userinfo="userinfo"
              :compflag="isvManage"
              :edit-flag-interface="editFlagInterface"
            />

            <div class="btn-container">
              <el-button v-if="!editFlagInterface" type="primary" @click="editInterface()">
                <span class="text">
                  编辑
                </span>
              </el-button>
              <el-button v-if="editFlagInterface" type="primary" @click="saveInterface()">
                <span class="text">
                  保存
                </span>
              </el-button>
              <el-button v-if="editFlagInterface" @click="cancelInterface()">
                <span class="text">
                  取消
                </span>
              </el-button>
            </div>

          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { reqUploadFiles } from '@/api/isvManagement/isv_manage'
import {
  reqQueryInstiInfo,
  reqEditInstiInfo,
  reqEditProductTree,
  reqDownLoadFiles
} from '@/api/isvManagement/isv_manage.js'
import {
  validEmail,
  validSocialCode,
  // validTelephoneAndPhone,
  // validatePositiveInt,
  validateInt
} from '@/utils/validate'
import { downloadFile } from '@/utils/index'
import IsvManageSlot from '../components-slot/isv_manage_slot.vue'

export default {
  name: 'JgIsvManage',

  components: {
    IsvManageSlot
  },

  data() {
    const validateIds = (rule, value, callback) => {
      if (value === 0) {
        callback(new Error('不能为空'))
      } else {
        callback()
      }
    }
    const validateSocial = (rule, value, callback) => {
      // if (value === '') {
      //   callback(new Error('请输入统一社会信用代码'))
      // } else
      if (value && !validSocialCode(value)) {
        callback(new Error('统一社会信用代码格式不正确'))
      } else {
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      // if (value === '') {
      //   callback(new Error('请输入邮箱'))
      // } else
      if (value && !validEmail(value)) {
        callback(new Error('邮箱格式不正确'))
      } else {
        callback()
      }
    }
    // const validatecontactMobile = (rule, value, callback) => {
    //   // if (value === '') {
    //   //   callback(new Error('请输入联系电话'))
    //   // } else
    //   if (value && !validTelephoneAndPhone(value)) {
    //     callback(new Error('联系电话格式不正确'))
    //   } else {
    //     callback()
    //   }
    // }
    // const validatestaffScale = (rule, value, callback) => {
    //   // if (value === '') {
    //   //   callback(new Error('请输入人员规模'))
    //   // } else
    //   if (value && !validatePositiveInt(value)) {
    //     callback(new Error('人员规模格式不正确'))
    //   } else {
    //     callback()
    //   }
    // }
    const validateregistCaptial = (rule, value, callback) => {
      // if (value === '') {
      //   callback(new Error('请输入注册资本'))
      // } else
      if (value && !validateInt(value)) {
        callback(new Error('注册资本格式不正确'))
      } else {
        callback()
      }
    }

    return {
      accept: '.jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,,.xlsx',
      rules: {
        cfetsInstnCd: [
          { validator: validateSocial, trigger: ['blur'] },
          { required: true, message: '请输入社会信用代码', trigger: ['blur'] },
          { max: 350, message: '长度不超过350个字符', trigger: ['blur', 'change'] }
        ], // 社会信用代码
        esDate: [
          { required: true, message: '请选择成立日期', trigger: 'blur' }
        ], // 成立日期
        registCaptial: [
          { validator: validateregistCaptial, trigger: ['blur'] },
          { required: true, message: '请输入社会信用代码', trigger: ['blur'] },
          { max: 50, message: '长度不超过50个字符', trigger: ['blur', 'change'] }
        ], // 注册资本 /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/
        staffScale: [
          // { validator: validatestaffScale, trigger: 'blur' },
          { required: true, message: '请输入人员规模', trigger: ['blur'] },
          { max: 50, message: '长度不超过50个字符', trigger: ['blur', 'change'] }
        ], // 人员规模 /^[+]{0,1}(\d+)$/
        contact: [
          { required: true, message: '请输入联系人', trigger: 'blur' },
          { max: 300, message: '长度不超过300个字符', trigger: ['blur', 'change'] }
        ], // 联系人
        conEmail: [
          { validator: validateEmail, trigger: ['blur'] },
          { required: true, message: '请输入联系邮箱', trigger: ['blur'] },
          { max: 500, message: '长度不超过500个字符', trigger: ['blur', 'change'] }
        ], // 联系邮箱
        conMobile: [
          // { validator: validatecontactMobile, trigger: ['blur'] },
          { required: true, message: '请输入联系电话', trigger: ['blur'] },
          { max: 50, message: '长度不超过50个字符', trigger: ['blur', 'change'] }
        ], // 联系电话
        comAddress: [
          { required: true, message: '请输入公司地址', trigger: 'blur' },
          { max: 500, message: '长度不超过500个字符', trigger: ['blur', 'change'] }
        ],
        fileIds: [
          { required: true, validator: validateIds, trigger: 'change' }
        ]
      },
      // 机构信息
      InstiObject: {
        cfetsInstnCd: '',
        esDate: '',
        registCaptial: '',
        staffScale: '',
        contact: '',
        conEmail: '',
        conMobile: '',
        comAddress: '',
        filed: [],
        remarkList: [],
        audtStatus: '',
        fileList: []
      },
      // audtStatus: '',

      SelfObject: {},
      content: '',
      labelPosition: 'top',
      money: '01',
      moneyList: [
        {
          value: '01',
          label: '人民币'
        }
      ],

      isShow: true,
      isShowInterface: true,
      editFlag: false,
      delFileList: [],
      institutionType: '00',
      userinfo: null,
      isvManage: 'isv_manage',
      tableLoading: false,
      loadingTree: false,
      originData: [],
      tableColumns: [],
      editFlagInterface: false,
      oldData: []
    }
  },

  created() {
    this.getInitInstiInfo()
    this.getUserRoles()
  },

  methods: {
    getUserRoles() {
      this.userinfo = this.$store.getters.userInfo
      // console.log('jigouisv', this.userinfo)
    },
    handleClick() {
      this.getMenu()
    },

    async handleRemove(file, fileList) {
      this.delFileList.push(file.fileId)
      this.InstiObject.fileList = fileList
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },

    onPreview(file) {
      // console.log('preview:' + file)
      const filed = {
        fileId: file.fileId,
        name: file.name
      }
      this.downloadFile(filed)
    },
    downloadFile(filed) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      reqDownLoadFiles(filed.fileId)
        .then((res) => {
          // console.log(res)
          loading.close()
          downloadFile(res.data, filed.name, res.data.type)
          this.$message({
            type: 'success',
            message: '下载成功!'
          })
        })
        .catch(() => {
          loading.close()
          this.$message({
            type: 'error',
            message: '下载失败!'
          })
        })
    },
    uploadFile(param) {
      const file = param.file
      const fileNameArr = file.name.split('.')
      const fileType = fileNameArr[fileNameArr.length - 1]
      // 兼容ie，因为el-upload的accept不支持ie
      if (this.accept.indexOf(fileType) < 0) {
        this.$message.error(`上传失败，文件类型不支持`)
        param.onError()
        return
      }
      const isLt50M = file.size / 1024 / 1024 <= 50
      if (!isLt50M) {
        this.$message.error(`上传失败，文件大小超过50MB`)
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
      reqUploadFiles(form)
        .then((res) => {
          loading.close()
          if (res.code === 'ACK') {
            this.$message({
              message: `${res.data.fileName}上传成功`,
              type: 'success'
            })
            this.InstiObject.fileList.push({
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
        })
        .catch(() => {
          loading.close()
          param.onError()
        })
    },

    // 初始化机构信息
    async getInitInstiInfo() {
      this.tableLoading = true
      const res = await reqQueryInstiInfo()
      if (res.code === 'ACK') {
        if (this.institutionType === '10') {
          this.originData = res.data.xtree.nodeList
          this.tableColumns = res.data.xtree.headList
        } else {
          this.originData = res.data.stree.nodeList
          this.tableColumns = res.data.stree.headList
        }
        this.InstiObject = Object.assign({}, this.InstiObject, res.data)
        // 上传文件刷新列表前先清空原文件数组再push
        this.InstiObject.fileList = []
        this.InstiObject.filed.forEach((item) => {
          this.InstiObject.fileList.push({
            name: item.fileName,
            fileName: item.fileName,
            fileId: item.id
          })
        })
        this.tableLoading = false
      } else {
        this.tableLoading = false
      }
      // console.log('机构端isv管理获取机构信息', res)
    },

    async handleTabLeave(activeName) {
      // console.log(activeName, this.institutionType  )
      if (this.editFlagInterface && activeName !== this.institutionType) {
        this.$confirm('数据未保存，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.handleTabClick('leave')
            return true
          })
          .catch(() => {
            this.$nextTick(() => {
              if (activeName === '10') {
                this.institutionType = '00'
              } else {
                this.institutionType = '10'
              }
            })
            return false
          })
      }
    },
    handleTabClick(tabName) {
      if (
        (tabName === 'click' && !this.editFlagInterface) ||
        tabName === 'leave'
      ) {
        this.getMenu()
      }
    },

    editInfo() {
      this.SelfObject = JSON.parse(JSON.stringify(this.InstiObject))
      this.editFlag = true
      this.$refs['InstiObject'].clearValidate()
    },

    isEmpty(value) {
      if (value == null || value === '' || value === undefined) {
        return true
      } else {
        value = value.replace(/\s/g, '')
        if (value === '') {
          return true
        }
        return false
      }
    },

    isEmptyEsDate(value) {
      if (value == null || value === '' || value === undefined) {
        return true
      }
    },
    saveInfo(formName) {
      this.$refs[formName].validate(async(valid) => {
        if (valid) {
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          })
          this.InstiObject.filed = JSON.parse(JSON.stringify(this.InstiObject.fileList)).map(e => {
            e.id = e.fileId
            return e
          })
          const params = {
            ...this.InstiObject,
            delFileList: this.delFileList
          }
          reqEditInstiInfo(params).then(res => {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.editFlag = false
            this.getInitInstiInfo()
          }).finally(() => {
            loading.close()
          })
        }
      })
    },

    cancelInfo() {
      this.editFlag = false
      this.$refs['InstiObject'].clearValidate()
      this.InstiObject = this.SelfObject
      this.delFileList = []
    },

    // // 获取树节点的方法
    getMenu() {
      this.loadingTree = true
      reqQueryInstiInfo({})
        .then((res) => {
          if (this.institutionType === '10') {
            this.originData = res.data.xtree.nodeList
            this.tableColumns = res.data.xtree.headList
          } else {
            this.originData = res.data.stree.nodeList
            this.tableColumns = res.data.stree.headList
          }
          this.loadingTree = false
        })
        .catch((err) => {
          console.log(err)
          this.loadingTree = false
        })
    },

    editInterface() {
      this.editFlagInterface = true
      this.oldData = JSON.parse(JSON.stringify(this.originData))
      this.$forceUpdate()
    },

    async saveInterface() {
      this.editFlagInterface = false
      // var list = []
      // this.originData.forEach((item)=>{
      //   var objReturn = {nodeId:item.finID,status:'',nodeType:item.nodeType}
      //   if(item.nodeType==0){
      //     map.status=item.isSupport
      //   }else if(item.nodeType==1){
      //     map.status=item.cfetsCheckStatus
      //   }
      //   list.push(objReturn)
      // })
      // console.log('list',list);
      var tree = this.$refs.tableTree.getTrListCopy()
      console.log(tree)
      try {
        const res = await reqEditProductTree({
          saveTree: tree,
          institutionType: this.institutionType
        })
        if (res.code === 'ACK') {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
        }
        // console.log('保存编辑后的接口产品树', res)
      } catch (error) {
        // console.log(error);
      }
      this.getInitInstiInfo()
      // {[ { } ]}
      // finID  isSupport  cfetsCheckStatus  nodeType
    },

    cancelInterface() {
      this.editFlagInterface = false
      this.originData = JSON.parse(JSON.stringify(this.oldData))
    }
  }
}
</script>

<style lang='scss' scoped>
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
$mainWidth: 1220px;

.outer {
  width: $mainWidth;
  margin: 0px auto;
}

.text_info {
  margin-bottom: 10px;
  padding-left: 20px;
  border-left: 6px solid #2494fe;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &-left {
    white-space: nowrap;
  }
}

.top_card {
  display: flex;
  // flex-direction: row;
  // width: 1218px;
  max-width: 1220px;
  height: 122px;
  background: url('~@/assets/style/rygpz_user_bg.svg') no-repeat center;
  background-size: 100%;
  margin-bottom: 20px;
  position: relative;
  align-items: center;

  .item_name {
    margin-left: 60px;
    // font-size: 24px;
    // font-family: Source Han Sans CN;
    // font-weight: bold;
    // line-height: 41px;
    // color: #ffffff;
    // opacity: 1;
  }
  .content{
    font-size: 24px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    line-height: 41px;
    color: #ffffff;
    opacity: 1;
  }

  .exam_status {
    // margin-top: 20px;
    // margin-left: 650px;
     position: absolute;
      top: 21px;
      right: 72px;
  }
}

.basic_intro {
  margin-bottom: 20px;

  .outer_fd {
    // height: 430px;

    .fd_box {
      // width: 1120px;
      margin-top: 10px;
      padding: 10px;
      background: #edf4ff;
      border: 1px solid #94b4eb;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
      opacity: 1;
      margin-bottom: 10px;
      // margin-left: 20px;

      .fd_text {
        display: inline-block;
        // flex: 1;
        // width: 48px;
        // height: 16px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        // line-height: 16px;
        color: #2c76d1;
        opacity: 1;
        padding-left: 20px;
        vertical-align: top;
      }

      .return_text {
        display: inline-block;
        width: 1066px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 16px;
        color: #333333;
        opacity: 1;
        padding-left: 20px;
        word-wrap: break-word;
        word-break: break-all;
        overflow: hidden;
        vertical-align: top;
      }

      .express {
        height: 16px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 24px;
        color: #8c8c8c;
        opacity: 1;
        cursor: pointer;
      }
    }
  }
}

// .filedText {
//   display: flex;
//   margin: 10px 0px;
//   .read {
//     // width: 216px;
//     height: 16px;
//     font-size: 12px;
//     font-family: Microsoft YaHei;
//     font-weight: 400;
//     line-height: 24px;
//     color: #8c8c8c;
//     opacity: 1;
//   }

//   .filedlist {
//     color: #2c76d1;
//     font-size: 12px;
//     line-height: 24px;
//     cursor: pointer;
//   }
// }

::v-deep .el-form-item__label {
  // width: 84px;
  height: 19px;
  font-size: 14px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 19px;
  margin-bottom: 10px;
  color: #667baa;
  opacity: 1;
}

.support_interface {
  margin-bottom: 20px;

  .btn_bt {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}

::v-deep .el-upload__tip {
  color: #000;
}

.upload-demo-preview ::v-deep .el-upload-list__item .el-icon-upload-success {
  display: none;
}
.upload-demo-preview ::v-deep .el-upload-list__item .el-icon-close {
  display: none;
}

.upload-demo-preview ::v-deep .el-upload-list__item .el-icon-close-tip {
  display: none;
}
</style>
