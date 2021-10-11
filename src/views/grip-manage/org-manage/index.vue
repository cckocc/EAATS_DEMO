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
import infoAudit from './components/info-audit'
import infoManage from './components/info-manage'
import userManage from './components/user-manage'
import codeManage from './components/code-manage'
export default {
  name: 'GripOrgManage',
  components: {
    infoAudit,
    infoManage,
    userManage,
    codeManage
  },
  data() {
    return {
      tabActiveName: '',
      tabList: [
        {
          label: '机构信息审核',
          name: 'infoAudit',
          componentName: 'infoAudit',
          roles: ['GRIP_agencyReview']
        },
        {
          label: '机构信息管理',
          name: 'infoManage',
          componentName: 'infoManage',
          roles: ['GRIP_agencyInfoMgt']
        },
        {
          label: '机构用户管理',
          name: 'userManage',
          componentName: 'userManage',
          roles: ['GRIP_agencyMgtUser']
        },
        {
          label: '机构验证码管理',
          name: 'codeManage',
          componentName: 'codeManage',
          roles: ['GRIP_agency_sms_code']
        }
      ]
    }
  },
  created() {
    console.log('机构管理')
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
