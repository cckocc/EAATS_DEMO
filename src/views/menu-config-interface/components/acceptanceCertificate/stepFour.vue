<template>
  <div>
    <div v-if="type !== 'view'" class="btn-container" style="justify-content: flex-start;">
      <el-button
        class="mr10"
        type="primary"
        style="height:36px"
        @click="download"
      >下载</el-button>
      <el-upload
        class="upload"
        :auto-upload="false"
        :file-list="fileList"
        action=""
        accept=".json"
        :on-change="onChangeFile"
        :on-remove="handleRemove"
      >
        <el-button type="primary">上传json</el-button>
      </el-upload>
    </div>
    <!--预览json-->
    <el-tabs
      v-model="activeTabName"
      type="card"
      class="custom-tabs"
    >
      <el-tab-pane label="中文" name="zh">
        <el-form
          v-if="questionList.length > 0"
          class="panel list-panel clear"
          inline
        >
          <section
            v-for="question in questionList"
            :key="question.index"
          >
            <template v-if="question.hideFlag === '0'">
              <h3>
                {{ `${question.index}、${question.question}` }}
                <el-tooltip v-if="question.prompt">
                  <div
                    slot="content"
                    style="white-space: pre-wrap"
                    v-text="question.prompt"
                  />
                  <i class="el-icon-question" />
                </el-tooltip>
              </h3>
              <el-form-item
                v-for="option in question.options"
                :key="option.elementKey"
                :label="option.elementText"
              >
                <template v-if="option.elementType === 'radio'">
                  <el-radio-group v-model="option.value" disabled>
                    <el-radio
                      v-for="child in option.childCheckList"
                      :key="child.childElementKey"
                      :label="child.childElementValue"
                    >{{ child.childElementText }}</el-radio>
                  </el-radio-group>
                </template>
                <template
                  v-if="
                    option.elementType === 'input' ||
                      option.elementType === 'remark_input'
                  "
                >
                  <el-input v-model="option.value" disabled />
                </template>
                <template v-if="option.elementType === 'checkbox'">
                  <el-checkbox-group v-model="option.value" disabled>
                    <el-checkbox
                      v-for="child in option.childCheckList"
                      :key="child.childElementKey"
                      :label="child.childElementValue"
                    >{{ child.childElementText }}</el-checkbox>
                  </el-checkbox-group>
                </template>
                <template v-if="option.elementType === 'drop_down_box'">
                  <el-select v-model="option.value" value-key="childElementKey" :disabled="!option.fileFlag">
                    <el-option
                      v-for="child in option.childCheckList"
                      :key="child.childElementKey"
                      :label="child.childElementText"
                      :value="child"
                    />
                  </el-select>
                  <el-upload
                    v-if="option.fileFlag"
                    :action="uploadURL"
                    class="upload-component"
                    :show-file-list="false"
                    :headers="headers"
                    :before-upload="file => relatedFileBeforeUpload(file, option)"
                    :on-success="(response, file, fileList) => relatedFileUploadSucc(response, file, fileList,option)"
                    :on-error="onError"
                  >
                    <el-button v-if="type!=='view'" type="primary" size="mini" class="upload-button">上传</el-button>
                  </el-upload>
                  <div v-if="option.fileFlag" class="fileId-display-section">
                    <el-row>
                      <span>关联文件的Id</span>
                    </el-row>
                    <el-input v-model="option.value.linkFileId" disabled />
                    <el-button v-if="type!=='view'" type="primary" size="mini" @click="clearFileId(option)">清空</el-button>
                  </div>
                </template>
              </el-form-item>
            </template>
          </section>
        </el-form>
        <div v-else class="panel list-panel clear noData">暂无内容</div>
      </el-tab-pane>
      <el-tab-pane label="英文" name="en">
        <el-form
          v-if="questionList.length > 0"
          class="panel list-panel clear"
          inline
        >
          <section
            v-for="question in questionList"
            :key="question.index"
          >
            <template v-if="question.hideFlag === '0'">
              <h3>
                {{ `${question.index}、${question.enQuestion}` }}
                <el-tooltip v-if="question.enPrompt">
                  <div
                    slot="content"
                    style="white-space: pre-wrap"
                    v-text="question.enPrompt"
                  />
                  <i class="el-icon-question" />
                </el-tooltip>
              </h3>
              <el-form-item
                v-for="option in question.options"
                :key="option.elementKey"
                :label="option.enElementText"
              >
                <template v-if="option.elementType === 'radio'">
                  <el-radio-group v-model="option.value" disabled>
                    <el-radio
                      v-for="child in option.childCheckList"
                      :key="child.childElementKey"
                      :label="child.childElementValue"
                    >{{ child.enChildElementText }}</el-radio>
                  </el-radio-group>
                </template>
                <template
                  v-if="
                    option.elementType === 'input' ||
                      option.elementType === 'remark_input'
                  "
                >
                  <el-input v-model="option.value" disabled />
                </template>
                <template v-if="option.elementType === 'checkbox'">
                  <el-checkbox-group v-model="option.value" disabled>
                    <el-checkbox
                      v-for="child in option.childCheckList"
                      :key="child.childElementKey"
                      :label="child.childElementValue"
                    >{{ child.enChildElementText }}</el-checkbox>
                  </el-checkbox-group>
                </template>
                <template v-if="option.elementType === 'drop_down_box'">
                  <el-select
                    v-model="option.value"
                    value-key="childElementKey"
                    :placeholder="activeTabName === 'zh' ? '请选择' : 'Please select'"
                    :disabled="!option.fileFlag"
                  >
                    <el-option
                      v-for="child in option.childCheckList"
                      :key="child.childElementKey"
                      :label="child.enChildElementText"
                      :value="child"
                    />
                  </el-select>
                  <el-upload
                    v-if="option.fileFlag"
                    :action="uploadURL"
                    class="upload-component"
                    :show-file-list="false"
                    :headers="headers"
                    :before-upload="file => relatedFileBeforeUpload(file, option)"
                    :on-success="(response, file, fileList) => relatedFileUploadSucc(response, file, fileList,option)"
                    :on-error="onError"
                  >
                    <el-button v-if="type!=='view'" type="primary" size="mini" class="upload-button">上传</el-button>
                  </el-upload>
                  <div v-if="option.fileFlag" class="fileId-display-section">
                    <el-row>
                      <span>关联文件的Id</span>
                    </el-row>
                    <el-input v-model="option.value.linkFileId" disabled />
                    <el-button v-if="type!=='view'" type="primary" size="mini" @click="clearFileId(option)">清空</el-button>
                  </div>
                </template>
              </el-form-item>
            </template>
          </section>
        </el-form>
        <div v-else class="panel list-panel clear noData">暂无内容</div>
      </el-tab-pane>
    </el-tabs>
    <div class="btn-container">
      <el-button v-preventReClick type="primary" @click="previousStep">
        上一步
      </el-button>
      <el-button
        v-if="type !== 'view'"
        v-preventReClick
        type="primary"
        @click="nextStep"
      >
        保存
      </el-button>
      <el-button class="button-default" @click="cancel"> 返回列表页 </el-button>
    </div>
  </div>
</template>

<script>
import menuConfigApi from '@/api/grip-manage/menuConfigApi'
import { getToken } from '@/utils/auth'
import { downloadFile } from '@/utils'
export default {
  props: {
    type: {
      type: String,
      default: ''
    },
    receiptBasicData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      uploadURL: '',
      headers: { 'X-Auth-Token': '' },
      fileList: [],
      questionList: [],
      activeTabName: 'zh'
    }
  },
  created() {
    this.uploadURL = process.env.VUE_APP_BASE_API + '/system/file/uploadFile/upload'
    this.headers['X-Auth-Token'] = getToken()
    this.loadSelfCheckData()
  },
  methods: {
    async loadSelfCheckData() {
      const params = {
        formId: this.receiptBasicData.id,
        formVersion: this.receiptBasicData.formVersion
      }
      const result = await menuConfigApi.getSelfCheckData(params)
      if (result.code === 'ACK') {
        this.questionList = result.data

        let index = 0
        this.questionList.forEach(element => {
          if (element.hideFlag === '0') {
            ++index
            element.index = index
          }
          if (element.options) {
            element.options.forEach(option => {
              if (option.fileFlag) {
                this.$set(option, 'value', '')
              }
            })
          }
        })
      }
    },
    onChangeFile(file, fileList) {
      if (file.raw.type === 'application/json') {
        if (fileList.length > 1) {
          fileList.splice(0, 1)
        }
        this.preview(file)
      } else {
        this.$message.error('只能上传json文件')
        fileList.splice(fileList.length - 1, 1)
      }
      this.fileList = fileList
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
      this.fileList = []
    },
    preview(file) {
      var reader = new FileReader()
      reader.onload = (e) => {
        this.questionList = JSON.parse(reader.result)

        let index = 0
        this.questionList.forEach(element => {
          if (element.hideFlag === '0') {
            ++index
            element.index = index
          }
          if (element.options) {
            element.options.forEach(option => {
              if (option.fileFlag) {
                this.$set(option, 'value', '')
              }
            })
          }
        })

        let errorNum = 0
        this.questionList.forEach(e => {
          if (!e.question) {
            errorNum++
          }
        })

        if (errorNum > 0) {
          this.$message.error('json文件中存在格式问题，请修改后再上传')
        }
      }

      reader.readAsText(file.raw)
    },
    clearFileId(option) {
      if (option) {
        const item = option.childCheckList.find(element => element.linkFileId === option.value.linkFileId)
        console.log(option, item)
        if (item) {
          item.linkFileId = ''
          item.linkFileName = null
        }
      }
    },
    async download() {
      const params = {
        formId: this.receiptBasicData.id,
        version: this.receiptBasicData.formVersion
      }
      try {
        const result = await menuConfigApi.downloadSelfCheckData(params)
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
          var reader = new FileReader()
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
    },
    previousStep() {
      this.$emit('previousStep')
    },
    async nextStep() {
      if (this.questionList.length === 0) { // 没有旧的自查清单规则数据，也没有上传新的规则
        const result = await this.$confirm(
          '未上传自查清单，是否结束?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).catch(() => {})
        if (result === 'confirm') {
          this.$emit('receiptSaved')
        }
      } else {
        const data = {
          formId: this.receiptBasicData.id,
          version: this.receiptBasicData.formVersion,
          selfCheckQuestionDtoList: this.questionList
        }

        const result = await menuConfigApi.uploadSelfCheckJson(data)
        if (result.code === 'ACK') {
          this.$emit('receiptSaved')
        }
      }
    },
    relatedFileBeforeUpload(file, option) {
      if (option.value === '') {
        this.$message.error('请先选择下拉选项')
        return false
      }
      return true
    },
    relatedFileUploadSucc(response, file, fileList, option) {
      if (response.data.code === 'ACK') {
        this.$message.success('上传成功')
        const optionElement = this.questionList.find(e => e.options && (e.options.find(ee => ee.elementKey === option.elementKey) !== undefined))
        if (optionElement) {
          optionElement.options.forEach(ee => {
            const childrenElement = ee.childCheckList.find(o => o.childElementKey === option.value.childElementKey)
            childrenElement.linkFileId = response.data.data.id
            childrenElement.linkFileName = response.data.data.fileName
          })
        }
      }
    },
    onError(err, file, fileList) {
      console.log('error:' + err, file, fileList)
    },
    cancel() {
      this.$emit('cancel')
    }
  }
}
</script>

<style scoped lang="scss">
.clear {
  clear: both;
}

.panel {
  background: #fff;
  margin: 5px 0 15px 0;
  border: 1px solid #bfcbd9;
  padding: 10px;
  max-height: 450px;
  overflow-y: auto;
  .inner-title {
    margin: 10px 0;
    font-weight: bold;
    font-size: 15px;
  }
}
.list-panel {
  .el-form-item {
    margin-bottom: 0;
  }
  /deep/ .el-input {
        width: 280px;
      }
      .upload-component{
        display: inherit;
      }
      .upload-button{
        width:54px;
      }
}
.noData {
  text-align: center;
}

.fileId-display-section{
  margin-top:10px;
  width:500px;
}
</style>
