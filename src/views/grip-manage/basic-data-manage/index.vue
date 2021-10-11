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
    </el-tabs>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import networkOpeningConfig from './components/network-opening-config'
import firewallConfig from './components/firewall-config'
import testInfoConfig from './components/test-info-config'
import serviceIntroConfig from './components/service-intro-config'
import auditConfig from './components/audit-config.vue'
export default {
  name: 'BasicDataManage',
  components: {
    networkOpeningConfig,
    firewallConfig,
    testInfoConfig,
    serviceIntroConfig,
    auditConfig
  },
  data() {
    return {
      tabActiveName: '',
      tabList: [
        {
          label: '网络开通目标地址配置',
          name: 'networkOpeningConfig',
          componentName: 'networkOpeningConfig',
          roles: ['GRIP_GOAL_ADDRESS_CONF_GET_MENU']
        },
        {
          label: '防火墙配置',
          name: 'firewallConfig',
          componentName: 'firewallConfig',
          roles: ['GRIP_FIREWALL_CONF_GET_MENU']
        },
        {
          label: '测试信息配置',
          name: 'testInfoConfig',
          componentName: 'testInfoConfig',
          roles: ['GRIP_TEST_INFORMATION_CONF_GET_MENU']
        },
        {
          label: '服务简介配置',
          name: 'serviceIntroConfig',
          componentName: 'serviceIntroConfig',
          roles: ['GRIP_BASIC_INFORMATION_SERVICE_INTRODUCTION_MENU']
        },
        {
          label: '审核配置',
          name: 'auditConfig',
          componentName: 'auditConfig',
          roles: ['GRIP_BASIC_INFORMATION_SERVICE_AUIDT_CONF']
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
      this.tabList = this.tabList.filter((e) => this.checkPermission(e.roles))
      this.tabActiveName = this.tabList.length > 0 ? this.tabList[0].name : ''
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
