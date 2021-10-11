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
import flowLibrary from './components/flow-library'
import flowConfig from './components/flow-config'
export default {
  name: 'FlowEngine',
  components: {
    flowLibrary,
    flowConfig
  },
  data() {
    return {
      tabActiveName: '',
      tabList: [
        {
          label: '流程库',
          name: 'flowLibrary',
          componentName: 'flowLibrary',
          roles: ['GRIP_procFlowMgt_modelLib']
        },
        {
          label: '流程配置',
          name: 'flowConfig',
          componentName: 'flowConfig',
          roles: ['GRIP_procFlowMgt_menuNodeConf']
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
