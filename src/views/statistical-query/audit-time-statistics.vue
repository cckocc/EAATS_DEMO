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
import Other from './other'
import Test from './test'

export default {
  name: '',
  components: {
    Other,
    Test
  },
  data() {
    return {
      tabActiveName: 'Other',
      tabList: [
        {
          label: '其他服务类型',
          name: 'Other',
          componentName: 'Other'
        },
        {
          label: '验收测试',
          name: 'Test',
          componentName: 'Test'
        }
      ]
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
// .el-input, .el-date-editor {
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
