<template>
  <div>
    <div class="main-body">
      <div class="main-body-content">
        <section v-for="item in itemList" :key="item.type" class="item">
          <div class="item-title">{{ item.title }}</div>
          <div class="item-steps">
            <div v-for="step in item.steps" :key="step.type" class="item-steps-btn">
              <el-button type="primary" @click="showIntro(item, step)">{{ step.title }}简介</el-button>
            </div>
          </div>
        </section>
      </div>
    </div>
    <el-dialog
      :title="dialogObj.title"
      :visible.sync="dialogObj.visible"
      width="678px"
    >
      <el-form
        ref="dialogForm"
        :model="dialogObj.form"
        :rules="dialogObj.rules"
        label-width="110px"
        label-position="left"
      >
        <el-form-item label="内容(中文版)" prop="content">
          <el-input
            v-model="dialogObj.form.content"
            type="textarea"
            placeholder="请输入"
            maxlength="3000"
            :autosize="{ minRows: 2, maxRows: 6 }"
            show-word-limit
            clearable
          />
        </el-form-item>
        <el-form-item label="内容(英文版)" prop="contentEn">
          <el-input
            v-model="dialogObj.form.contentEn"
            type="textarea"
            placeholder="请输入"
            maxlength="3000"
            :autosize="{ minRows: 2, maxRows: 6 }"
            show-word-limit
            clearable
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          v-preventReClick
          type="primary"
          class="button-primary"
          @click="publish"
        >发布</el-button>
        <el-button
          class="button-default"
          @click="dialogObj.visible = false"
        >取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import basicDataConfigApi from '@/api/grip-manage/basicDataConfigApi'
import globalOptions from '@/utils/globalOptionsValue'

const defaultDialogForm = {
  content: '',
  contentEn: ''
}
export default {
  data() {
    return {
      itemList: globalOptions.procTypeOptions,
      dialogObj: {
        visible: false,
        title: '',
        item: {},
        step: {},
        obj: {},
        form: Object.assign({}, defaultDialogForm),
        rules: {
          content: [
            { required: true, message: '不能为空！', trigger: 'blur' }
          ],
          contentEn: [
            { required: true, message: '不能为空！', trigger: 'blur' }
          ]
        }
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      const params = {
        introductionBody: '',
        introductionBodyEn: '',
        introductionType: '',
        parentType: ''
      }
      basicDataConfigApi.getServiceIntro(params).then(res => {
        console.log(res)
        this.itemList.map(item => {
          item.steps.map(step => {
            const findItem = res.data.find(e => e.parentType === item.type && e.introductionType.code === step.type)
            step.obj = findItem
            step.content = findItem.introductionBody
            step.contentEn = findItem.introductionBodyEn
            return step
          })
          return item
        })
      })
    },
    showIntro(item, step) {
      this.dialogObj.visible = true
      this.dialogObj.item = item
      this.dialogObj.step = step
      this.dialogObj.title = `${item.title}-${step.title}简介`
      this.dialogObj.form.content = step.content
      this.dialogObj.form.contentEn = step.contentEn
      this.dialogObj.obj = step.obj
      this.$nextTick(() => {
        this.$refs.dialogForm.clearValidate()
      })
    },
    publish() {
      this.$refs.dialogForm.validate((valid) => {
        if (valid) {
          const params = {
            id: this.dialogObj.obj.id,
            introductionBody: this.dialogObj.form.content,
            introductionBodyEn: this.dialogObj.form.contentEn
          }
          basicDataConfigApi.updateServiceIntro(params).then(res => {
            this.fetchData()
            this.$message({
              type: 'success',
              message: '更新成功!'
            })
            this.dialogObj.visible = false
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.item {
  margin: 20px;
  &-title {
    height: 28px;
    font-size: 28px;
    line-height: 28px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #333333;
    border-left: 4px solid #2494FE;
    padding-left: 10px;
  }
  &-steps {
    display: flex;
    margin: 20px 0 0 20px;
    &-btn {
      flex-basis: 25%;
    }
  }
}
</style>
