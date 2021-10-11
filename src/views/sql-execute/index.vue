<template>
  <div>
    <div class="main-body">
      <!-- <el-tabs v-model="tabActiveName" class="custom-main-tabs"> -->
      <!-- <el-tab-pane label="SQL执行" name="02"> -->
      <el-form ref="form" class="sql-form" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="留言" prop="text">
          <el-input v-model="form.text" type="textarea" :rows="18" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">提交</el-button>
          <el-button @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- </el-tab-pane> -->
      <!-- </el-tabs> -->
    </div>
    <el-dialog
      title="执行结果"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <!-- <div>{{ dialogJson }}</div> -->
      <json-viewer
        :value="dialogJson"
        :expand-depth="5"
        copyable
        sort
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import gripManageApi from '@/api/gripManageApi'
import { btnPermission } from '@/utils'
// import JSEncrypt from 'jsencrypt'
import { Base64 } from 'js-base64'
export default {
  name: 'MemberManage',
  data() {
    return {
      tabActiveName: '02',
      form: {
        text: ''
      },
      rules: {
        text: [{ required: true, message: '内容不能为空！', trigger: 'blur' }]
      },
      marketBtn: false,
      iiqBtn: false,
      dialogVisible: false,
      dialogJson: {}
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'publicKey'
    ])
  },
  created() {
  },
  methods: {
    onSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // const encryptStr = new JSEncrypt()
          // encryptStr.setPublicKey(this.publicKey)
          // const params = {
          //   sql: encryptStr.encrypt(this.form.text.toString())
          // }
          const params = {
            sql: Base64.encode(this.form.text.toString())
          }
          gripManageApi.execSql(params).then(res => {
            if (res.code === 'ACK') {
              if (res.message === '执行失败') {
                this.$message({
                  type: 'error',
                  message: res.message
                })
              } else {
                this.dialogJson = res.data
                this.dialogVisible = true
                this.$message({
                  type: 'success',
                  message: res.message
                })
              }
            } else if (res.code === 'NACK') {
              this.$message({
                type: 'error',
                message: res.message
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    onReset() {
      this.form.text = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.sql-form {
  margin-top: 25px;
  /deep/ .el-form-item__label {
    color: #303030;
    font-weight: 400;
  }
}
</style>
