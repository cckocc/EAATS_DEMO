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
  name: 'MarketInstiMarketInstiStatisticStatistic',
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
      ],
      OverallPermission: false,
      OnlinePassingPermission: false,
      ProcessPermission: false,
      NetworkOpeningPermission: false,
      itemList: []
    }
  }
}
</script>

<style lang="scss" scoped>
// .el-table {
//   /deep/thead {
//     color: #303030 !important;
//   }
// }
// .el-input,
// .el-date-editor {
//   width: 310px !important;
// }
// .el-button.el-button--mini {
//   line-height: 16px !important;
// }
// .el-button--text {
//   color: #333;
//   svg {
//     margin-right: 5px;
//   }
// }
// .button-icon {
//   width: 24px;
//   height: 24px;
//   cursor: pointer;
// }
// /deep/.main-body-top .el-form .el-form-item__content .el-input {
//   width: 310px !important;
// }
</style>
