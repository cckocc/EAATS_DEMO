<template>
  <div>
    <el-tabs v-model="tabActiveName" class="custom-main-tabs">
      <el-tab-pane
        v-for="item in tabList"
        :key="item.name"
        :label="item.label"
        :name="item.name"
      />
    </el-tabs>
    <component :is="tabActiveName" class="main-body" />
  </div>

</template>

<script>
import checkPermission from '@/utils/permission'
import interfaceMenuConfig from './components/interfaceMenuConfig/index.vue'
import protocolClauseConfig from './components/protocolClauseConfig/index.vue'
import accpetanceCeritificate from './components/acceptanceCertificate'
import digitalCertificateConfig from './components/digitalCertificateConfig'
export default {
  name: 'MenuConfigInterface',
  components: {
    interfaceMenuConfig,
    protocolClauseConfig,
    accpetanceCeritificate,
    digitalCertificateConfig
  },
  data() {
    return {
      tabActiveName: '',
      tabList: [
        {
          label: '接口菜单配置',
          name: 'interfaceMenuConfig',
          componentName: 'interfaceMenuConfig',
          roles: ['GRIP_menu_serviceApply']
        },
        {
          label: '协议条款配置',
          name: 'protocolClauseConfig',
          componentName: 'protocolClauseConfig',
          roles: ['GRIP_menu_agreementConf']
        },
        {
          label: '验收申请单配置',
          name: 'accpetanceCeritificate',
          componentName: 'accpetanceCeritificate',
          roles: ['grip_menu_acceptance_test_form_conf']
        },
        {
          label: '数字证书配置',
          name: 'digitalCertificateConfig',
          componentName: 'digitalCertificateConfig',
          roles: ['GRIP_menu_certificateConf']
        }
      ]
    }
  },
  created() {
    this.getTabActiveName()
  },
  methods: {
    checkPermission,
    // 获取Tab激活页
    getTabActiveName() {
      this.tabList = this.tabList.filter(e => this.checkPermission(e.roles))
      this.tabActiveName = this.tabList.length > 0 ? this.tabList[0].name : ''
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
