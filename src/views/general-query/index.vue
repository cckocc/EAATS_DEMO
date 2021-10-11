<template>
  <div>
    <el-tabs v-model="tabActiveName" class="custom-main-tabs">
      <el-tab-pane
        v-for="item in tabList"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      />
      <component :is="tabActiveName" />
      <!-- <el-tab-pane v-if="userInfo.roleType.code === 'super-admin'" label="SQL执行" name="02">
          <el-form ref="form" class="sql-form" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="输入SQL语句" prop="text">
              <el-input v-model="form.text" type="textarea" :rows="18" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">提交</el-button>
              <el-button @click="onReset">重置</el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane> -->
    </el-tabs>
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
import checkPermission from '@/utils/permission'
import { mapGetters } from 'vuex'
import gripManageApi from '@/api/gripManageApi'
import marketImport from './components/market-import.vue'
import infoImport from './components/info-import.vue'
import oldDataProcess from './components/old-data-process.vue'
import importExport from './components/import-export.vue'
// import JSEncrypt from 'jsencrypt'
import { Base64 } from 'js-base64'
export default {
  name: 'MemberManage',
  components: {
    marketImport,
    infoImport,
    oldDataProcess,
    importExport
  },
  data() {
    return {
      tabActiveName: '',
      tabList: [
        {
          label: '市场机构导入',
          name: 'marketImport',
          componentName: 'marketImport',
          roles: ['GRIP_fieldEmergency_MARKET']
        },
        {
          label: '信息商导入',
          name: 'infoImport',
          componentName: 'infoImport',
          roles: ['GRIP_fieldEmergency_IIQ']
        },
        {
          label: '历史数据处理',
          name: 'oldDataProcess',
          componentName: 'oldDataProcess',
          roles: ['OLD_data_handler']
        },
        {
          label: '导入导出',
          name: 'importExport',
          componentName: 'importExport',
          roles: ['GRIP_fieldEmergency_import_export']
        }
      ],
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
    this.getTabActiveName()
  },
  methods: {
    checkPermission,
    // 获取Tab激活页
    getTabActiveName() {
      this.tabList = this.tabList.filter((e) => this.checkPermission(e.roles))
      this.tabActiveName = this.tabList.length > 0 ? this.tabList[0].name : ''
    },
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
