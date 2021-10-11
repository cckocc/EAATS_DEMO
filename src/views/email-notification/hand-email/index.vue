<template>
  <div class="auto_email_page">
    <!-- 邮件通知 -->
    <el-form ref="peopleForm" :model="peopleForm" :rules="peopleRuls">
      <el-form-item prop="addEmial">
        <self-input
          v-model="peopleForm.addEmial"
          :disabled="isDisabled"
          title="补充收件人"
          label-width="100px"
        />
      </el-form-item>
      <el-form-item prop="copySend">
        <self-input
          v-model="peopleForm.copySend"
          :disabled="isDisabled"
          title="抄送"
          label-width="50px"
        />
      </el-form-item>
      <el-form-item prop="secretCopy">
        <self-input
          v-model="peopleForm.secretCopy"
          :disabled="isDisabled"
          title="密抄"
          label-width="50px"
        />
      </el-form-item>
      <el-form-item prop="primaryTitle">
        <self-input1
          v-model="peopleForm.primaryTitle"
          :disabled="isDisabled"
          title="主题"
          label-width="50px"
        />
      </el-form-item>
      <el-form-item label="附件" class="mt20">
        <UploadFiles
          ref="upload"
          v-model="peopleForm.fileIdList"
          :size="10"
        />
      </el-form-item>
      <el-form-item>
        <div class="page_editor">
          <Tinymce
            v-show="lookType.type === 'hand'"
            ref="updateTiny"
            v-model="peopleForm.templateContent"
            style="margin-top: 30px"
            :data-content="dataContent"
            @insertContent="test"
          />
        </div>
      </el-form-item>
    </el-form>
    <InsertDialog
      ref="insertDialog"
      v-model="selectElements"
      :insert-list="insertList"
      @confirmBut="confirmBut"
    />
  </div>
</template>

<script>
import UploadFiles from '@/components/UploadFiles'
import {
  saveOrReleaseEmail,
  getTemplateDetialInfo,
  getEmailTemplateInfoPage2
} from '@/api/email/email_manage.js'
const insertData = [
  {
    id: '1',
    title: '账号名称'
  },
  {
    id: '2',
    title: '待审核人姓名'
  },
  {
    id: '3',
    title: '机构名称'
  },
  {
    id: '4',
    title: '待审核人联系方式'
  },
  {
    id: '5',
    title: '服务单号'
  },
  {
    id: '6',
    title: '审核状态'
  },
  {
    id: '7',
    title: '子申请单申请权限'
  },
  {
    id: '8',
    title: '测试信息'
  },
  {
    id: '9',
    title: '审核人部门'
  },
  {
    id: '10',
    title: '指引名称'
  },
  {
    id: '11',
    title: '审核人姓名'
  },
  {
    id: '12',
    title: '指引修改历史'
  },
  {
    id: '13',
    title: '审核人联系方式'
  },
  {
    id: '14',
    title: '验收接口名称'
  },
  {
    id: '15',
    title: '待审核人部门'
  },
  {
    id: '16',
    title: '服务开通接口名称'
  },
  {
    id: '17',
    title: '接口上线接口名称'
  },
  {
    id: '18',
    title: '权限变更接口名称'
  }
]
// componentsInfo
export default {
  name: 'AutoEmail',
  components: {
    UploadFiles,
    Tinymce: () => import('@/components/Tinymce/index.vue'),
    SelfInput: () => import('@/components/SelfInput/index'),
    SelfInput1: () => import('@/components/SelfInput2/index'),
    InsertDialog: () => import('../components/insertElements/InsertDialog')
  },
  props: {
    componentsInfo: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    var selfTemplate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入邮件内容'))
      } else {
        callback()
      }
    }
    var validateAddEmail = (rule, value, callback) => {
      if (!value) {
        callback()
      } else if (Array.isArray(value) && value.length <= 0) {
        callback()
      } else {
        var newArr1 = value.map((ele) => ele.label)
        if (newArr1.toString().length > 30000) {
          callback(new Error('邮箱总长度小于30000字符'))
        } else if (
          value.every((item) => {
            var email = item.label
            // var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
            var reg = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/
            // /^[0-9a-z][a-z0-9\._-]{1,}@[a-z0-9-]{1,}[a-z0-9](\.[a-z]{1,})+$/

            if (reg.test(email)) {
              return true
            } else {
              return false
            }
          })
        ) {
          callback()
        } else {
          callback(new Error('邮箱格式不正确'))
        }
      }
    }
    var validateCopySend = (rule, value, callback) => {
      if (!value) {
        callback()
      } else if (Array.isArray(value) && value.length <= 0) {
        callback()
      } else {
        var newArr2 = value.map((ele) => ele.label)
        if (newArr2.toString().length > 30000) {
          callback(new Error('邮箱总长度小于30000字符'))
        } else if (
          value.every((item) => {
            var email = item.label
            var reg = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/
            if (reg.test(email)) {
              return true
            } else {
              return false
            }
          })
        ) {
          callback()
        } else {
          callback(new Error('邮箱格式不正确'))
        }
      }
    }
    var validateSecretCopy = (rule, value, callback) => {
      if (!value) {
        callback()
      } else if (Array.isArray(value) && value.length <= 0) {
        callback()
      } else {
        var newArr3 = value.map((ele) => ele.label)
        if (newArr3.toString().length > 30000) {
          callback(new Error('邮箱总长度小于30000字符'))
        } else if (
          value.every((item) => {
            var email = item.label
            var reg = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/
            if (reg.test(email)) {
              return true
            } else {
              return false
            }
          })
        ) {
          callback()
        } else {
          callback(new Error('邮箱格式不正确'))
        }
      }
    }
    return {
      emailType: '',
      emailId: '',
      isDisabled: false,
      lookType: {},
      peopleForm: {
        accectPeople: '',
        content: '',
        primaryTitle: '',
        templateContent: '',
        addEmial: [],
        copySend: [],
        secretCopy: [],
        fileIdList: []
      },
      peopleRuls: {
        addEmial: [{ validator: validateAddEmail, trigger: 'blur' }],
        copySend: [{ validator: validateCopySend, trigger: 'blur' }],
        secretCopy: [{ validator: validateSecretCopy, trigger: 'blur' }],
        primaryTitle: [
          { required: true, message: '请输入邮件主题', trigger: 'blur' },
          { max: 100, message: '输入长度小于100字符', trigger: 'blur' }
        ],
        fileIdList: [
          { required: true, message: '不能为空', trigger: 'change' }
        ],
        templateContent: [
          { required: true, validator: selfTemplate, trigger: 'blur' }
        ]
      },
      selectElements: '',
      insertList: insertData,
      dataContent: ''
    }
  },
  watch: {},
  activated() {
    this.initPage()
  },
  methods: {
    confirmBut() {
      const selectConst = `&nbsp;<em>
        <span
        contenteditable="false"
        tagName="true"
        title="12121"
        onselectstart="false"
        style='color: #2C76D1;
        background-color: #EDF4FF !important;
        user-select: none;
        padding:3px 7px;display:
        inline-block;'>${this.selectElements}
        </span>
        </em>&nbsp;`
      this.dataContent = selectConst
      this.$refs.insertDialog.visibleInsert = false
    },
    test() {
      this.$refs.insertDialog.initInsertOpen()
    },
    returnBack() {
      // 手动返回
      this.$emit('newAddEmail', {
        id: 4,
        title: '手动发送邮件查看',
        from: this.lookType.from,
        type: this.lookType.type,
        data: { ...this.lookType.data, emailId: this.emailId }
      })
    },
    save(str) {
      // if (this.peopleForm.templateContent.length > 50000) {
      //   this.$message.warning('模板内容过长，请修改后再试')
      //   return false
      // }
      var reg =
        /\uD83C\uDFF4\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73)\uDB40\uDC7F|\uD83D\uDC68(?:\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68\uD83C\uDFFB|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFE])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|[\u2695\u2696\u2708]\uFE0F|\uD83D[\uDC66\uDC67]|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|(?:\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708])\uFE0F|\uD83C\uDFFB\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C[\uDFFB-\uDFFF])|(?:\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)\uD83C\uDFFB|\uD83E\uDDD1(?:\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1)|(?:\uD83E\uDDD1\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFF\u200D\uD83E\uDD1D\u200D(?:\uD83D[\uDC68\uDC69]))(?:\uD83C[\uDFFB-\uDFFE])|(?:\uD83E\uDDD1\uD83C\uDFFC\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB\uDFFC])|\uD83D\uDC69(?:\uD83C\uDFFE\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB-\uDFFD\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFC\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFD-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFB\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFC-\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFD\u200D(?:\uD83E\uDD1D\u200D\uD83D\uDC68(?:\uD83C[\uDFFB\uDFFC\uDFFE\uDFFF])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD])|\uD83C\uDFFF\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDAF-\uDDB3\uDDBC\uDDBD]))|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|(?:\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83E\uDD1D\u200D\uD83E\uDDD1|\uD83D\uDC69\uD83C\uDFFE\u200D\uD83E\uDD1D\u200D\uD83D\uDC69)(?:\uD83C[\uDFFB-\uDFFD])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C\uDFFF\u200D[\u2695\u2696\u2708]|\uD83C\uDFFE\u200D[\u2695\u2696\u2708]|\uD83C\uDFFC\u200D[\u2695\u2696\u2708]|\uD83C\uDFFB\u200D[\u2695\u2696\u2708]|\uD83C\uDFFD\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83C\uDFF4\u200D\u2620)\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC15\u200D\uD83E\uDDBA|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83C\uDDF6\uD83C\uDDE6|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83E\uDDD1(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDCD-\uDDCF\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC6B-\uDC6D\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDBB\uDDD2-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDED5\uDEEB\uDEEC\uDEF4-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])|(?:[#\*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDED5\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEFA\uDFE0-\uDFEB]|\uD83E[\uDD0D-\uDD3A\uDD3C-\uDD45\uDD47-\uDD71\uDD73-\uDD76\uDD7A-\uDDA2\uDDA5-\uDDAA\uDDAE-\uDDCA\uDDCD-\uDDFF\uDE70-\uDE73\uDE78-\uDE7A\uDE80-\uDE82\uDE90-\uDE95])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDC8F\uDC91\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD0F\uDD18-\uDD1F\uDD26\uDD30-\uDD39\uDD3C-\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDBB\uDDCD-\uDDCF\uDDD1-\uDDDD]|[\u2660-\u2767]\u0020)/g
      var flag = reg.test(this.peopleForm.templateContent)
      if (flag) {
        this.$message.warning('模板内容不允许输入表情包，请修改后再试')
        return false
      }
      var newArr = []
      this.peopleForm.addEmial.forEach((item) => {
        newArr.push(item.label)
      })
      var newArr1 = []
      this.peopleForm.copySend.forEach((item) => {
        newArr1.push(item.label)
      })
      var newArr2 = []
      this.peopleForm.secretCopy.forEach((item) => {
        newArr2.push(item.label)
      })
      const param = {
        createOpid: this.$store.getters.userInfo.id, // 创建人
        templateBcc: newArr2.toString(), // 模板密件抄送邮箱，多个用英文逗号隔开
        templateCc: newArr1.toString(), // 模板抄送邮箱，多个用英文隔开
        emailId: this.emailId,
        saveType: str,
        templateContent: this.peopleForm.templateContent, // 模板内容(插入的关键字用$关键字id代替)
        templateSubject: this.peopleForm.primaryTitle, // 模板主题
        fileIdList: this.peopleForm.fileIdList, // 附件
        templateSupplement: newArr.toString(), // 模板补充收件人邮箱，多个用英文逗号隔开
        templateType: '1' // 邮件类型，1-手动，2-自动
      }
      if (str === 1) {
        // 保存
        if (newArr.toString().length > 30000) {
          this.$message({ type: 'error', message: '邮箱总长度应小于30000字符' })
          return false
        }

        if (newArr1.toString().length > 30000) {
          this.$message({ type: 'error', message: '邮箱总长度应小于30000字符' })
          return false
        }

        if (newArr2.toString().length > 30000) {
          this.$message({ type: 'error', message: '邮箱总长度应小于30000字符' })
          return false
        }

        if (this.peopleForm.primaryTitle.length > 100) {
          this.$message({ type: 'error', message: '主题长度应小于100字符' })
          return false
        }
        this.$emit('loadingStatus', {
          type: 'hand',
          id: str === 1 ? 102 : str === 2 ? 103 : '',
          loadStatus: true
        })
        saveOrReleaseEmail(param)
          .then((res) => {
            const { code, message } = res
            if (code === 'ACK') {
              this.$emit('loadingStatus', {
                type: 'hand',
                id: str === 1 ? 102 : str === 2 ? 103 : '',
                loadStatus: false
              })
              this.$message({
                message: message,
                type: 'success'
              })
              this.lookType.type && this.lookType.type === 'auto'
                ? this.$emit('newAddEmail', { id: 7 })
                : this.$emit('newAddEmail', { id: 5 })
            }
          })
          .catch((err) => {
            this.$emit('loadingStatus', {
              type: 'hand',
              id: str === 1 ? 102 : str === 2 ? 103 : '',
              loadStatus: false
            })
            console.log('err', err)
          })
      } else {
        if (
          this.peopleForm.templateContent === null ||
          this.peopleForm.templateContent === undefined ||
          this.peopleForm.templateContent === ''
        ) {
          this.$message.warning('模板内容不能为空')
          return false
        }
        var newSet = new Set(newArr)
        if (newSet.size < newArr.length) {
          this.$message.warning('补充收件人存在重复邮箱，请修改后再试')
          return false
        }
        var newSet1 = new Set(newArr1)
        if (newSet1.size < newArr1.length) {
          this.$message.warning('抄送存在重复邮箱，请修改后再试')
          return false
        }
        var newSet2 = new Set(newArr2)
        if (newSet2.size < newArr2.length) {
          this.$message.warning('密抄存在重复邮箱，请修改后再试')
          return false
        }
        this.$refs.peopleForm.validate((valid) => {
          if (valid) {
            this.$emit('loadingStatus', {
              type: 'hand',
              id: str === 1 ? 102 : str === 2 ? 103 : '',
              loadStatus: true
            })
            saveOrReleaseEmail(param)
              .then((res) => {
                const { code, message } = res
                if (code === 'ACK') {
                  this.$emit('loadingStatus', {
                    type: 'hand',
                    id: str === 1 ? 102 : str === 2 ? 103 : '',
                    loadStatus: false
                  })
                  this.$message({
                    message: message,
                    type: 'success'
                  })
                  this.lookType.type && this.lookType.type === 'auto'
                    ? this.$emit('newAddEmail', { id: 7 })
                    : this.$emit('newAddEmail', { id: 5 })
                }
              })
              .catch((err) => {
                this.$emit('loadingStatus', {
                  type: 'hand',
                  id: str === 1 ? 102 : str === 2 ? 103 : '',
                  loadStatus: false
                })
                console.log('err', err)
              })
          }
        })
      }
    },
    // 初始化信息系统
    initPage() {
      const { data } = this.componentsInfo
      this.lookType = data
      if (data.from && data.from === 'add') {
        this.emailId = data.data.emailId
        if (data.data.emailType) this.emailTemplateContent(data.data.emailType)
      } else if (data.from && data.from === 'view') {
        this.isDisabled = true
        this.emailId = data.data.emailId
        this.showPage(data.data.emailId) // 回显富文本内容
      } else if (data.from && data.from === 'editor') {
        this.isDisabled = false
        this.emailId = data.data.emailId
        this.showPage(data.data.emailId) // 回显富文本内容
      }
    },
    returnList() {
      if (this.lookType.type === 'hand') {
        // 自动返回
        this.$emit('newAddEmail', {
          id: 5,
          title: '手动发送邮件查看',
          from: this.lookType.from,
          type: this.lookType.type,
          data: { ...this.lookType.data, emailId: this.emailId }
        })
      }
    },
    showPage(str) {
      getEmailTemplateInfoPage2({ emailId: str }).then((res) => {
        const { code, data } = res
        if (code === 'ACK' && data) {
          this.$nextTick(() => {
            var date = new Date()
            var number1 = date.getTime()
            var str = number1 * Math.random()
            var str1 = str.toString().substring(0, 8)
            // this.peopleForm.addEmial =
            var oneObj = {}
            this.peopleForm.addEmial = data.templateSupplement
              ? data.templateSupplement.split(',').map((item) => {
                date = new Date()
                number1 = date.getTime()
                str = number1 * Math.random()
                str1 = str.toString().substring(0, 8)
                oneObj = {}
                oneObj.id = str1
                oneObj.label = item
                return oneObj
              })
              : []
            this.peopleForm.copySend = data.templateCc
              ? data.templateCc.split(',').map((item) => {
                date = new Date()
                number1 = date.getTime()
                str = number1 * Math.random()
                str1 = str.toString().substring(0, 8)
                oneObj = {}
                oneObj.id = str1
                oneObj.label = item
                return oneObj
              })
              : []
            this.peopleForm.secretCopy = data.templateBcc
              ? data.templateBcc.split(',').map((item) => {
                date = new Date()
                number1 = date.getTime()
                str = number1 * Math.random()
                str1 = str.toString().substring(0, 8)
                oneObj = {}
                oneObj.id = str1
                oneObj.label = item
                return oneObj
              })
              : []
            this.peopleForm.primaryTitle = data.templateSubject
            this.peopleForm.templateContent = data.templateContent
            this.peopleForm.fileIdList = data.fileIdList
            this.$refs.updateTiny.setContent(this.peopleForm.templateContent)
          })
          // this.emailId = data.emailId
        }
      })
    },
    // 获得模板信息
    emailTemplateContent(args) {
      getTemplateDetialInfo({ templateId: args })
        .then((res) => {
          const { code, data } = res
          if (code === 'ACK') {
            this.$nextTick(() => {
              var date = new Date()
              var number1 = date.getTime()
              var str = number1 * Math.random()
              var str1 = str.toString().substring(0, 8)
              var oneObj = {}
              this.peopleForm.primaryTitle = data.templateSubject // 模板主题
              this.peopleForm.fileIdList = data.fileIdList || []
              this.peopleForm.templateContent = data.templateContent
              this.$refs.updateTiny.setContent(this.peopleForm.templateContent)
              // this.$set(this.peopleForm, 'templateContent', data.templateContent)
              // this.peopleForm.templateContent = "<p>11【申请业务机构名称】：<span contenteditable="">申请业务机构名称</span></p>↵<p style="text-indent: 2em;">您好，贵机构的申请正在审核中。</p>↵<p style="text-indent: 2em;">【待审核注册用户】：<span contenteditable="">待审核注册用户</span></p>↵<p style="text-indent: 2em;">【服务单号】：<span contenteditable="">服务单号</span></p>↵<p style="text-indent: 2em;">【审核状态】：<span contenteditable="">审核状态</span></p>↵<p style="text-indent: 2em;">According to law concerning privacy，if you are not the addressee（or responsible for delivery of the message to such person）you are hereby notified that any disclosure、reproduction、distribute、strictly prohibited. if you have received this message in error，please destroy it and notify us by email.</p>↵<p style="text-indent: 2em;">鉴于隐私方面的法律规定，如果你不是指定的收件人，由此声明任何信息泄露、复制、散布，其他传播或使用此信息都被严格禁止，如果你错误收到了此邮件请销毁，并用邮件的方式通知我们。</p>"
              this.peopleForm.secretCopy = data.templateBcc
                ? data.templateBcc.split(',').map((item) => {
                  date = new Date()
                  number1 = date.getTime()
                  str = number1 * Math.random()
                  str1 = str.toString().substring(0, 8)
                  oneObj = {}
                  oneObj.id = str1
                  oneObj.label = item
                  return oneObj
                })
                : []
              this.peopleForm.copySend = data.templateCc
                ? data.templateCc.split(',').map((item) => {
                  date = new Date()
                  number1 = date.getTime()
                  str = number1 * Math.random()
                  str1 = str.toString().substring(0, 8)
                  oneObj = {}
                  oneObj.id = str1
                  oneObj.label = item
                  return oneObj
                })
                : []
            })
          }
        })
        .catch()
    }
  }
}
</script>

<style lang="scss" scoped>
.auto_email_page {
  width: 100%;
  background-color: white;
  // box-shadow: 1px 2px 3px #DFDFDF;
  border: 1px solid #dfdfdf;
  box-sizing: border-box;
  padding: 50px 60px;
  .email_border_bottom {
    border-bottom: 1px solid #e6e6e6;
    width: 100%;
    padding: 8px 0px;
  }
  .page_editor {
    width: 100%;
    min-height: 300px;
  }
  .add_people_style {
    position: absolute;
    left: 10px;
    top: 10px;
    background-color: red;
    // content: "抄送人";
  }
}
.auto_email_page ::v-deep .el-form-item {
  margin-bottom: 10px;
}
</style>
