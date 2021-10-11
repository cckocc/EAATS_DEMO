<template>
  <div>
    <el-tabs v-model="tabActiveName" class="custom-minor-tabs">
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
import Overall from './overall.vue'
import OnlinePassing from './onlinePassing.vue'
import Process from './process.vue'
import NetworkOpening from './networkOpening.vue'
export default {
  name: 'MarketInstiStatistic',
  components: {
    Overall,
    OnlinePassing,
    Process,
    NetworkOpening
  },
  data() {
    return {
      tabActiveName: 'Overall',
      tabList: [
        {
          label: '总体查询',
          name: 'Overall',
          componentName: 'Overall'
        },
        {
          label: '上线通过查询',
          name: 'OnlinePassing',
          componentName: 'OnlinePassing'
        },
        {
          label: '流程查询',
          name: 'Process',
          componentName: 'Process'
        },
        {
          label: '网络开通查询',
          name: 'NetworkOpening',
          componentName: 'NetworkOpening'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
