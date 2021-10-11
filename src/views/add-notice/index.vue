<template>
  <div>
    <el-tabs v-model="tabActiveName" class="custom-main-tabs">
      <el-tab-pane label="发布通知公告" name="notice">
        <div class="main-body">
          <div class="main-body-top">
            <el-form
              ref="searchForm"
              :model="mainObj.searchForm"
              label-position="left"
              inline
            >
              <el-form-item>
                <el-select v-model="mainObj.searchForm.noticeType" placeholder="--全部类型--" style="width:240px;padding:0 18px 0 0;">
                  <el-option v-for="item in allNoticeType" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model.trim="mainObj.searchForm.keyWords"
                  v-limitBytes="300"
                  placeholder="请输入关键词"
                  style="width:421px; margin-right: 25px"
                  clearable
                  @focus="blurSearchFor()"
                  @blur="blurSear()"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" size="mini" @click="onSearch">筛选</el-button>
                <el-button size="mini" @click="onReset">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="main-body-bottom">
            <div class="main-body-bottom-btn">
              <div class="main-body-bottom-btn-left">
                <el-button
                  type="primary"
                  icon="el-icon-circle-plus el-icon--right"
                  class="btn"
                  @click="onOperate('addNotice')"
                >新增</el-button>
              </div>
            </div>
            <div class="table">
              <el-table
                :data="mainObj.list"
                fit
                stripe
                border
                highlight-current-row
              >
                <el-table-column show-overflow-tooltip prop="noticeTitle" label="标题" min-width="300" />
                <el-table-column show-overflow-tooltip prop="noticeType.text" label="公告类型" min-width="100" />
                <el-table-column show-overflow-tooltip prop="publishUserName" label="发布人" min-width="100" />
                <el-table-column show-overflow-tooltip prop="publishTs" label="发布时间" min-width="150" />
                <el-table-column label="操作" align="center" width="200" fixed="right">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      @click="onOperate('view', scope.row)"
                    >查看</el-button>
                    <el-button
                      type="text"
                      @click="onOperate('update', scope.row)"
                    >修改</el-button>
                    <el-button
                      v-preventReClick
                      type="text"
                      @click="onOperate('delete', scope.row)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="pagination">
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
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="发布跑马灯" name="marquee">
        <ReleaseMarquee />
      </el-tab-pane>
      <el-tab-pane label="编辑服务条款" name="protocol">
        <div class="protocol-panel">
          <el-form ref="protocolObjForm" :model="protocolObj" :rules="protocolRules" :validate-on-rule-change="false" label-position="left">
            <el-form-item class="label-after" label="标题" :label-width="formLabelWidth" prop="noticeTitle">
              <el-input v-model="protocolObj.noticeTitle" v-limitBytes="300" placeholder="请输入标题" style="width:309px;" />
            </el-form-item>
            <el-form-item label="内容" :label-width="formLabelWidth" prop="body" required>
              <tinymce ref="protocolObjTiny" v-model="protocolObj.body" :height="400" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <!-- <el-button @click="onOperate('updateView')">预 览</el-button> -->
            <el-button v-preventReClick type="primary" @click="onOperate('protocolSubmit')">确 定</el-button>
            <el-button @click="protocolReset">重 置</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="编辑隐私政策" name="privacy">
        <div class="protocol-panel">
          <el-form ref="privacyObjForm" :model="privacyObj" :rules="protocolRules" :validate-on-rule-change="false" label-position="left">
            <el-form-item class="label-after" label="标题" :label-width="formLabelWidth" prop="noticeTitle">
              <el-input v-model="privacyObj.noticeTitle" v-limitBytes="300" placeholder="请输入标题" style="width:309px;" />
            </el-form-item>
            <el-form-item label="内容" :label-width="formLabelWidth" prop="body" required>
              <tinymce ref="privacyObjTiny" v-model="privacyObj.body" :height="400" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <!-- <el-button @click="onOperate('updateView')">预 览</el-button> -->
            <el-button v-preventReClick type="primary" @click="onOperate('privacySubmit')">确 定</el-button>
            <el-button @click="privacyReset">重 置</el-button>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="编辑业务概览" name="business">
        <div class="protocol-panel">
          <el-form ref="businessObjForm" :model="businessObj" :rules="protocolRules" :validate-on-rule-change="false" label-position="left">
            <el-form-item class="label-after" label="标题" :label-width="formLabelWidth" prop="noticeTitle">
              <el-input v-model="businessObj.noticeTitle" v-limitBytes="300" placeholder="请输入标题" style="width:309px;" />
            </el-form-item>
            <el-form-item label="内容" :label-width="formLabelWidth" prop="body" required>
              <tinymce ref="businessObjTiny" v-model="businessObj.body" :height="400" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button v-preventReClick type="primary" @click="onOperate('businessSubmit')">确 定</el-button>
            <el-button @click="businessReset">重 置</el-button>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>
    <!-- 新增弹窗 -->
    <el-dialog :close-on-click-modal="false" :visible.sync="addDialogObj.visible" :modal-append-to-body="false" class="dialog">
      <label slot="title" class="notice-title">通知公告新增</label>
      <!-- <div v-loading="updateLoading" element-loading-text="文件上传中，请稍后……"> -->
      <el-form ref="addDialogObjForm" :model="addDialogObjForm" :rules="rules" label-position="left">
        <el-form-item :label-width="formLabelWidth" prop="noticeType">
          <label slot="label">类型</label>
          <el-select v-model="addDialogObjForm.noticeType" placeholder="请选择通知类型" style="width:309px;">
            <el-option v-for="(item,index) in noticeType" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" prop="noticeTitle">
          <label slot="label">标题</label>
          <el-input v-model="addDialogObjForm.noticeTitle" v-limitBytes="300" placeholder="请输入标题" style="width:309px;" />
        </el-form-item>
        <el-form-item label="上传附件" :label-width="formLabelWidth" prop="addFileList">
          <UploadFiles
            v-model="addDialogObjForm.fileIdList"
            :size="50"
            :tips="tips"
            :accept="accept"
          />
        </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth" prop="body">
          <tinymce ref="tiny" v-model="addDialogObjForm.body" :height="300" />
          <el-input v-model="addDialogObjForm.body" style="display: none;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onOperate('addView')">预 览</el-button>
        <el-button v-preventReClick type="primary" @click="onOperate('add')">发 布</el-button>
        <el-button @click="cancleDialog('addCancle')">取 消</el-button>
      </div>
      <!-- </div> -->
    </el-dialog>
    <!-- 修改弹窗 -->
    <el-dialog :close-on-click-modal="false" :visible.sync="updateDialogObj.visible" :modal-append-to-body="false" class="dialog">
      <label slot="title" class="notice-title">通知公告修改</label>
      <!-- <div v-loading="updateLoading" element-loading-text="文件上传中，请稍后"> -->
      <el-form ref="updateDialogObj" :model="updateDialogObj.form" :rules="updateDialogObj.rules" :validate-on-rule-change="false" label-position="left">
        <el-form-item :label-width="formLabelWidth" prop="noticeType">
          <label slot="label">类型</label>
          <el-select v-model="updateDialogObj.form.noticeType" placeholder="请选择通知类型" style="width:309px;" @change="updateSelectChange">
            <el-option v-for="(item,index) in noticeType" :key="index" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item class="label-after" label="标题" :label-width="formLabelWidth" prop="noticeTitle">
          <!-- <label slot="label">标题</label> -->
          <el-input v-model="updateDialogObj.form.noticeTitle" v-limitBytes="300" placeholder="请输入标题" style="width:309px;" />
        </el-form-item>
        <el-form-item label="上传附件" :label-width="formLabelWidth">
          <UploadFiles
            v-model="updateDialogObj.fileIdList"
            :size="50"
            :tips="tips"
            :accept="accept"
          />
        </el-form-item>
        <el-form-item label="内容" :label-width="formLabelWidth" prop="body">
          <tinymce ref="updateTiny" v-model="updateDialogObj.form.body" :height="300" />
          <el-input v-model="updateDialogObj.form.body" style="display: none;" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="onOperate('updateView')">预 览</el-button>
        <el-button v-preventReClick type="primary" @click="onOperate('updateAdd')">确 定</el-button>
        <el-button @click="cancleDialog('updateCancle')">取 消</el-button>
      </div>
      <!-- </div> -->
    </el-dialog>
    <el-dialog :close-on-click-modal="false" :visible.sync="previewModal" :modal-append-to-body="false" class="dialog">
      <label slot="title" class="notice-title">预览</label>
      <div v-if="previewType === 'updateView'" class="body">
        <div class="html-title">{{ updateDialogObj.form.noticeTitle }}</div>
        <div v-html="updateDialogObj.form.body" />
      </div>
      <div v-else class="body">
        <div class="html-title">{{ addDialogObjForm.noticeTitle }}</div>
        <div v-html="addDialogObjForm.body" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import ReleaseMarquee from './release-marquee'
// import RegisterProtocol from './register-protocol'
import Tinymce from '@/components/Tinymce'
import gripManageApi from '@/api/gripManageApi'
import globalOptions from '@/utils/globalOptionsValue'
import UploadFiles from '@/components/UploadFiles'
const defaultForm = {
  noticeType: '',
  noticeTitle: '',
  body: '',
  fileIdList: []
}
export default {
  name: 'MemberManage',
  components: {
    Tinymce,
    UploadFiles,
    ReleaseMarquee
    // RegisterProtocol
  },
  data() {
    return {
      placeholder: '请输入关键词',
      addDialogObjForm: Object.assign({}, defaultForm),
      tabActiveName: 'notice',
      updateLoading: false,
      showFileDialog: false,
      accept: '.jpg,.jpeg,.png,.gif,.bmp,.pdf,.doc,.docx,.xls,.xlsx,.txt,.mp4,.avi,.rmvb,.flv',
      tips: '支持上传jpg、jpeg、png、gif、bmp、pdf、doc、docx、xls、xlsx、txt、mp4、AVI、rmvb、flv',
      addFileIdList: [],
      addFileList: [],
      modifyFileIdList: [],
      mainObj: {
        list: [],
        currentPage: 1,
        pageSize: 20,
        total: 0,
        searchForm: {
          noticeType: '',
          keyWords: ''
        }
      },
      rules: {
        noticeType: [
          { required: true, message: '类型不能为空！', trigger: 'change' }
        ],
        noticeTitle: [
          { required: true, message: '标题不能为空！', trigger: 'change' }
        ],
        body: [
          { required: true, message: '内容不能为空！', trigger: 'change' }
        ]
      },
      addDialogObj: {
        visible: false,
        fileIdList: [],
        form: {
          noticeType: '',
          noticeTitle: '',
          body: '',
          noticeFileDtoList: []
        }
      },
      updateDialogObj: {
        visible: false,
        fileIdList: [],
        form: {
          noticeType: '',
          noticeTitle: '',
          body: '',
          noticeFileDtoList: []
        },
        rules: {
          noticeType: [
            { required: true, message: '类型不能为空！', trigger: 'change' }
          ],
          noticeTitle: [
            { required: true, message: '标题不能为空！', trigger: 'change' }
          ],
          body: [
            { required: true, message: '内容不能为空！', trigger: 'change' }
          ]
        }
      },
      protocolObj: {
        noticeTitle: '',
        body: ''
      },
      protocolRules: {
        noticeTitle: [
          { required: true, message: '不能为空！', trigger: 'blur' }
        ],
        body: [{ required: true, message: '不能为空！', trigger: 'blur' }]
      },
      privacyObj: {
        noticeTitle: '',
        body: ''
      },
      businessObj: {
        noticeTitle: '',
        body: ''
      },
      formLabelWidth: '100px',
      noticeType: globalOptions.noticeType,
      allNoticeType: globalOptions.allNoticeType,
      previewModal: false,
      previewType: ''
    }
  },
  created() {
    this.fetchData()
    this.getUserProtocol()
    this.getUserPrivacy()
    this.getBusiness()
  },
  methods: {
    // 获取焦点时触发
    blurSearchFor() {
      console.log(this.placeholder)
      if (this.placeholder == '请输入关键词') {
        this.placeholder = ''
      }
    },
    // 失去焦点时触发
    blurSear() {
      this.placeholder = '请输入关键词'
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return 'header-row-th'
      }
    },
    addSelectChange(type) {
      this.addDialogObj.form.noticeType = type
    },
    updateSelectChange(type) {
      this.updateDialogObj.form.noticeType = type
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
    resetForm(formName) {
      this.$nextTick(() => {
        this.$refs[formName].resetFields()
      })
    },
    clearValidate(formName) {
      if (this.$refs[formName]) {
        this.$nextTick(() => {
          this.$refs[formName].clearValidate()
        })
      }
    },
    cancleDialog(type) {
      if (type === 'addCancle') {
        this.addDialogObj.visible = false
        this.addFileIdList = []
        this.addFileList = []
      } else if (type === 'updateCancle') {
        this.showFileDialog = false
        this.updateDialogObj.visible = false
        this.modifyFileIdList = []
      }
    },
    onOperate(type, row) {
      if (type === 'view') {
        this.$router.push({
          name: 'singleArticle',
          query: {
            id: row.id,
            title: row.noticeTitle
          }
        })
      } else if (type === 'update') {
        this.clearValidate('updateDialogObj')
        this.updateDialogObj.fileIdList = []
        this.updateDialogObj.form.noticeType = ''
        this.updateDialogObj.form.noticeTitle = ''
        const params = {
          noticeId: row.id
        }
        gripManageApi.noticeSearchById(params).then((res) => {
          if (res.code === 'ACK') {
            this.updateDialogObj.form = JSON.parse(JSON.stringify(res.data))
            const html = this.updateDialogObj.form.body
            // html = html.replace(/&lt;/g, '<')
            // html = html.replace(/&gt;/g, '>')
            try {
              this.$refs.updateTiny.setContent(html)
            } catch (e) {
              console.log(e)
            }
            if (this.updateDialogObj.form.noticeType !== null) {
              this.updateDialogObj.form.noticeType =
                this.updateDialogObj.form.noticeType.text
            }
            if (this.updateDialogObj.form.noticeFileDtoList !== null) {
              this.updateDialogObj.form.noticeFileDtoList.forEach((item) => {
                item.name = item.fileName
                this.updateDialogObj.fileIdList.push(item.fileId)
              })
            }
            this.updateDialogObj.visible = true
            this.showFileDialog = true
          }
        })
      } else if (type === 'updateView') {
        this.previewType = 'updateView'
        this.previewModal = true
      } else if (type === 'addView') {
        this.previewType = 'addView'
        this.previewModal = true
      } else if (type === 'protocolSubmit') {
        this.$refs['protocolObjForm'].validate((valid) => {
          if (valid) {
            const params = {
              id: this.protocolObj.id,
              title: this.protocolObj.noticeTitle,
              body: this.protocolObj.body
            }
            gripManageApi.modifyUserProtocol(params).then((res) => {
              if (res.code === 'ACK') {
                this.$message({
                  type: 'success',
                  message: res.message
                })
                this.getUserProtocol()
              } else if (res.code === 'VALIDATION') {
                // 后端验证
                if ('noticeTitle' in res.data) {
                  this.$refs['protocolObjForm'].fields.find(
                    (item) => item.prop === 'noticeTitle'
                  ).validateState = 'error'
                  this.$refs['protocolObjForm'].fields.find(
                    (item) => item.prop === 'noticeTitle'
                  ).validateMessage = res.data.noticeTitle
                }
                if ('body' in res.data) {
                  this.$refs['protocolObjForm'].fields.find(
                    (item) => item.prop === 'body'
                  ).validateState = 'error'
                  this.$refs['protocolObjForm'].fields.find(
                    (item) => item.prop === 'body'
                  ).validateMessage = res.data.body
                }
              }
            })
          }
        })
      } else if (type === 'privacySubmit') {
        this.$refs['privacyObjForm'].validate((valid) => {
          if (valid) {
            const params = {
              id: this.privacyObj.id,
              title: this.privacyObj.noticeTitle,
              body: this.privacyObj.body
            }
            gripManageApi.modifyUserPrivacy(params).then((res) => {
              if (res.code === 'ACK') {
                this.$message({
                  type: 'success',
                  message: res.message
                })
                this.getUserPrivacy()
              } else if (res.code === 'VALIDATION') {
                // 后端验证
                if ('noticeTitle' in res.data) {
                  this.$refs['privacyObjForm'].fields.find(
                    (item) => item.prop === 'noticeTitle'
                  ).validateState = 'error'
                  this.$refs['privacyObjForm'].fields.find(
                    (item) => item.prop === 'noticeTitle'
                  ).validateMessage = res.data.noticeTitle
                }
                if ('body' in res.data) {
                  this.$refs['privacyObjForm'].fields.find(
                    (item) => item.prop === 'body'
                  ).validateState = 'error'
                  this.$refs['privacyObjForm'].fields.find(
                    (item) => item.prop === 'body'
                  ).validateMessage = res.data.body
                }
              }
            })
          }
        })
      } else if (type === 'businessSubmit') {
        this.$refs['businessObjForm'].validate((valid) => {
          if (valid) {
            const params = {
              id: this.businessObj.id,
              title: this.businessObj.noticeTitle,
              body: this.businessObj.body
            }
            gripManageApi.modifyBusiness(params).then((res) => {
              if (res.code === 'ACK') {
                this.$message({
                  type: 'success',
                  message: res.message
                })
                this.getBusiness()
              } else if (res.code === 'VALIDATION') {
                // 后端验证
                if ('noticeTitle' in res.data) {
                  this.$refs['businessObjForm'].fields.find(
                    (item) => item.prop === 'noticeTitle'
                  ).validateState = 'error'
                  this.$refs['businessObjForm'].fields.find(
                    (item) => item.prop === 'noticeTitle'
                  ).validateMessage = res.data.noticeTitle
                }
                if ('body' in res.data) {
                  this.$refs['businessObjForm'].fields.find(
                    (item) => item.prop === 'body'
                  ).validateState = 'error'
                  this.$refs['businessObjForm'].fields.find(
                    (item) => item.prop === 'body'
                  ).validateMessage = res.data.body
                }
              }
            })
          }
        })
      } else if (type === 'updateAdd') {
        this.$refs['updateDialogObj'].validate((valid) => {
          if (valid) {
            this.noticeType.forEach((item) => {
              if (item.label === this.updateDialogObj.form.noticeType) {
                this.updateDialogObj.form.noticeType = item.value
              }
            })
            const params = {
              body: this.updateDialogObj.form.body,
              noticeTitle: this.updateDialogObj.form.noticeTitle,
              noticeType: this.updateDialogObj.form.noticeType,
              noticeFileIdList: this.updateDialogObj.fileIdList,
              id: this.updateDialogObj.form.id
            }
            gripManageApi.updateNotice(params).then((res) => {
              if (res.code === 'ACK') {
                this.$message({
                  type: 'success',
                  message: res.message
                })
                this.showFileDialog = false
                this.updateDialogObj.visible = false
                this.fetchData()
              } else if (res.code === 'VALIDATION') {
                // 后端验证
                if ('noticeTitle' in res.data) {
                  this.$refs['updateDialogObj'].fields.find(
                    (item) => item.prop === 'noticeTitle'
                  ).validateState = 'error'
                  this.$refs['updateDialogObj'].fields.find(
                    (item) => item.prop === 'noticeTitle'
                  ).validateMessage = res.data.noticeTitle
                }
                if ('noticeType' in res.data) {
                  this.$refs['updateDialogObj'].fields.find(
                    (item) => item.prop === 'noticeType'
                  ).validateState = 'error'
                  this.$refs['updateDialogObj'].fields.find(
                    (item) => item.prop === 'noticeType'
                  ).validateMessage = res.data.noticeType
                }
                if ('body' in res.data) {
                  this.$refs['updateDialogObj'].fields.find(
                    (item) => item.prop === 'body'
                  ).validateState = 'error'
                  this.$refs['updateDialogObj'].fields.find(
                    (item) => item.prop === 'body'
                  ).validateMessage = res.data.body
                }
              }
            })
          }
        })
      } else if (type === 'addNotice') {
        this.addDialogObj.visible = true
        try {
          if (this.$refs.tiny) {
            this.$refs.tiny.setContent('')
          }
        } catch (e) {
          console.log(e)
        }
        this.addDialogObjForm = Object.assign({}, defaultForm)
        this.clearValidate('addDialogObjForm')
        this.addDialogObjForm.fileIdList = []
      } else if (type === 'add') {
        this.$refs['addDialogObjForm'].validate((valid) => {
          if (valid) {
            const params = {
              body: this.addDialogObjForm.body,
              noticeTitle: this.addDialogObjForm.noticeTitle,
              noticeType: this.addDialogObjForm.noticeType,
              noticeFileIdList: this.addDialogObjForm.fileIdList
            }
            gripManageApi.addNotice(params).then((res) => {
              if (res.code === 'ACK') {
                this.$message({
                  type: 'success',
                  message: res.message
                })
                this.addDialogObj.visible = false
                this.fetchData()
                this.addDialogObj.form = ''
                this.addFileIdList = []
                this.addFileList = []
              } else if (res.code === 'VALIDATION') {
                // 后端验证
                if ('noticeTitle' in res.data) {
                  this.$refs['addDialogObjForm'].fields.find(
                    (item) => item.prop === 'noticeTitle'
                  ).validateState = 'error'
                  this.$refs['addDialogObjForm'].fields.find(
                    (item) => item.prop === 'noticeTitle'
                  ).validateMessage = res.data.noticeTitle
                }
                if ('noticeType' in res.data) {
                  this.$refs['addDialogObjForm'].fields.find(
                    (item) => item.prop === 'noticeType'
                  ).validateState = 'error'
                  this.$refs['addDialogObjForm'].fields.find(
                    (item) => item.prop === 'noticeType'
                  ).validateMessage = res.data.noticeType
                }
                if ('body' in res.data) {
                  this.$refs['addDialogObjForm'].fields.find(
                    (item) => item.prop === 'body'
                  ).validateState = 'error'
                  this.$refs['addDialogObjForm'].fields.find(
                    (item) => item.prop === 'body'
                  ).validateMessage = res.data.body
                }
              }
            })
          }
        })
      } else if (type === 'delete') {
        this.$confirm('是否确认删除当前通知公告?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const params = {
              noticeId: row.id
            }
            gripManageApi.deleteNotice(params).then((res) => {
              if (res.code === 'ACK') {
                this.$message({
                  type: 'success',
                  message: res.message
                })
                this.fetchData()
              }
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    },
    getUserProtocol() {
      gripManageApi.getUserProtocol().then((res) => {
        if (res.code === 'ACK') {
          this.protocolObj = JSON.parse(JSON.stringify(res.data))
          const html = this.protocolObj.body
          // html = html.replace(/&lt;/g, '<')
          // html = html.replace(/&gt;/g, '>')
          try {
            this.$refs.protocolObjTiny.setContent(html)
          } catch (e) {
            console.log(e)
          }
        }
      })
    },
    getUserPrivacy() {
      gripManageApi.getUserPrivacy().then((res) => {
        if (res.code === 'ACK') {
          this.privacyObj = JSON.parse(JSON.stringify(res.data))
          const html = this.privacyObj.body
          // html = html.replace(/&lt;/g, '<')
          // html = html.replace(/&gt;/g, '>')
          try {
            this.$refs.privacyObjTiny.setContent(html)
          } catch (e) {
            console.log(e)
          }
        }
      })
    },
    getBusiness() {
      gripManageApi.getBusiness().then((res) => {
        if (res.code === 'ACK') {
          this.businessObj = JSON.parse(JSON.stringify(res.data))
          const html = this.businessObj.body
          // html = html.replace(/&lt;/g, '<')
          // html = html.replace(/&gt;/g, '>')
          try {
            this.$refs.businessObjTiny.setContent(html)
          } catch (e) {
            console.log(e)
          }
        }
      })
    },
    protocolReset() {
      this.getUserProtocol()
    },
    privacyReset() {
      this.getUserPrivacy()
    },
    businessReset() {
      this.getBusiness()
    },
    onSearch() {
      this.mainObj.currentPage = 1
      this.fetchData()
    },
    onReset() {
      this.mainObj.searchForm.noticeType = ''
      this.mainObj.searchForm.keyWords = ''
      this.onSearch()
    },
    fetchData() {
      const params = {
        page: this.mainObj.currentPage,
        pageSize: this.mainObj.pageSize,
        keywords: this.mainObj.searchForm.keyWords,
        noticeType: this.mainObj.searchForm.noticeType
      }
      gripManageApi.noticeSearchByKeywords(params).then((res) => {
        if (res.code === 'ACK') {
          this.mainObj.list = JSON.parse(JSON.stringify(res.data.list))
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
}
::v-deep .el-tabs__active-bar {
  background-color: #2c76d1;
}
::v-deep .el-tabs__item.is-active {
  color: #2c76d1;
}
.label-after ::v-deep .el-form-item__label:after {
  content: '*';
  color: #ff4949;
  margin-left: 4px;
}
.protocol-panel {
  width: 1220px;
  height: 92%;
  padding: 30px 20px;
  overflow: auto;
  background: rgb(255, 255, 255);
  border: 1px solid rgb(223, 223, 223);
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  // align-items: center;
  .tinymce-container {
    width: 96% !important;
  }
  .dialog-footer {
    text-align: center;
  }
}
.html-title {
  font-size: 24px;
  font-weight: 700;
  line-height: 31px;
  color: #303030;
  opacity: 1;
  margin-bottom: 20px;
  text-align: center;
}
</style>
