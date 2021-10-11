<template>
  <div>
    <el-tabs v-model="tabActiveName" class="custom-minor-tabs">
      <el-tab-pane label="待处理机构列表" name="waitOrgList" />
      <el-tab-pane label="申请单处理详情" name="formProcessDetail" />
    </el-tabs>
    <component :is="tabActiveName" />
  </div>
</template>

<script>
import waitOrgList from './old-components/wait-org-list'
import formProcessDetail from './old-components/form-process-detail'
export default {
  components: {
    waitOrgList,
    formProcessDetail
  },
  data() {
    return {
      tabActiveName: 'waitOrgList'
    }
  },
  created() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
</style>
