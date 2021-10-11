<template>
  <div>
    <el-tabs v-model="tabActiveName" class="custom-main-tabs" @tab-click="changeTabs">
      <el-tab-pane v-if="checkPermission(timeConfig)" label="验收排布查询配置" name="timeConfig">
        <div class="children_page">
          <el-tabs v-model="activeNameOne" class="custom-minor-tabs" @tab-click="handleClick">

            <el-tab-pane class="self_margin" label="场务端验收排布统计" name="layout_statistics">
              <LayoutStatisticsQuery ref="LayoutStatisticsQuery" />
            </el-tab-pane>
            <el-tab-pane class="self_margin" label="机构端验收排布表设置" name="layout_sheet">
              <AcceptanceSchedule ref="AcceptanceSchedule" />
            </el-tab-pane>
            <el-tab-pane class="self_margin" label="场务端剩余名额统计" name="number_statistics">
              <RemainingQuota ref="RemainingQuota" />
            </el-tab-pane>
            <el-tab-pane class="self_margin" label="预约量及评分统计" name="quantity_score">
              <BookingQuantityScore ref="BookingQuantityScore" />
            </el-tab-pane>
            <el-tab-pane class="self_margin" label="评分模板设置" name="score_templete">
              <ScoreTempleteSettings ref="ScoreTempleteSettings" />
            </el-tab-pane>
            <el-tab-pane class="self_margin" label="评分汇总查询" name="score_statistics">
              <ScoreStatisticsQuery ref="ScoreStatisticsQuery" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-tab-pane>

      <el-tab-pane v-if="checkPermission(personManager)" label="验收人员管理" name="personManager">
        <div class="children_page">
          <el-tabs v-model="activeNameTwo" class="custom-minor-tabs" @tab-click="handleClick">
            <el-tab-pane v-if="!editPersonFlag" class="self_margin" label="人员管理与配置" name="personnel_management">
              <PersonnelManagement ref="PersonnelManagement" @linkSitting="settingPage" />
            </el-tab-pane>
            <el-tab-pane v-else class="self_margin" label="人员管理与配置" name="personnel_config">
              <PersonnelConfig ref="PersonnelConfig" @linkSitting="backToManage" />
            </el-tab-pane>
            <el-tab-pane class="self_margin" label="人员应急修改" name="emergency_modify">
              <EmergencymMdification ref="EmergencymMdification" />
            </el-tab-pane>
            <el-tab-pane class="self_margin" label="验收能力查询统计" name="capability_query">
              <CapablityQuery ref="CapablityQuery" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-tab-pane>

      <el-tab-pane v-if="checkPermission(functionConfig)" label="验收单功能模块配置" name="functionConfig">
        <FunctionModule ref="FunctionModule" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import AcceptanceSchedule from './components/acceptanceResourceSettings/quotaQueryConfig/acceptanceSchedule.vue'
import RemainingQuota from './components/acceptanceResourceSettings/quotaQueryConfig/remainingQuota.vue'
import LayoutStatisticsQuery from './components/acceptanceResourceSettings/quotaQueryConfig/layoutQuery.vue'
import BookingQuantityScore from './components/acceptanceResourceSettings/quotaQueryConfig/bookingQuantityScore.vue'
import ScoreTempleteSettings from './components/acceptanceResourceSettings/quotaQueryConfig/scoreTempleteSettings.vue'
import ScoreStatisticsQuery from './components/acceptanceResourceSettings/quotaQueryConfig/scoreStatisticsQuery.vue'

import PersonnelManagement from './components/acceptanceResourceSettings/personnelManagement/personnelManagement.vue'
import PersonnelConfig from './components/acceptanceResourceSettings/personnelManagement/personnelConfig.vue'
import EmergencymMdification from './components/acceptanceResourceSettings/personnelManagement/EmergencyModification.vue'
import CapablityQuery from './components/acceptanceResourceSettings/personnelManagement/capabilityQuery.vue'

import FunctionModule from './components/acceptanceResourceSettings/functionModule.vue'

export default {
  name: 'MemberManage',
  components: {
    AcceptanceSchedule,
    RemainingQuota,
    LayoutStatisticsQuery,
    BookingQuantityScore,
    ScoreTempleteSettings,
    ScoreStatisticsQuery,
    PersonnelManagement,
    PersonnelConfig,
    EmergencymMdification,
    CapablityQuery,
    FunctionModule
  },
  data() {
    return {
      functionConfig: ['GRIP_MENU_ACCEPTANCECONF_FROMCONFIG', 'admin'],
      personManager: ['GRIP_MENU_ACCEPTANCECONF_PEOPLEMANAGEMENT', 'admin'],
      timeConfig: ['GRIP_MENU_ACCEPTANCECONF_LAYOUTQUERY', 'admin'],
      tabActiveName: '',
      activeNameOne: 'layout_statistics',
      activeNameTwo: 'personnel_management',
      editPersonFlag: false,
      smallTabName: ''
    }
  },
  created() {
    this.getTabActiveName()
  },
  methods: {
    checkPermission,
    // 获取Tab激活页
    getTabActiveName() {
      if (this.checkPermission(this.timeConfig)) {
        this.tabActiveName = 'timeConfig'
      } else if (this.checkPermission(this.personManager)) {
        this.tabActiveName = 'personManager'
      } else if (this.checkPermission(this.functionConfig)) {
        this.tabActiveName = 'functionConfig'
      } else {
        this.tabActiveName = ''
      }
      this.changeTabs({ name: this.tabActiveName })
    },
    // 人员管理跳转到人员配置
    settingPage(str) {
      this.editPersonFlag = true
      this.activeNameTwo = 'personnel_config'
      console.log('跳转', str)
      this.$nextTick(() => {
        this.$refs.PersonnelConfig.routerLinkCreated(str)
      })
    },
    // 人员配置返回人员管理
    backToManage(person) {
      this.editPersonFlag = false
      this.activeNameTwo = 'personnel_management'
      this.$nextTick(() => {
        this.$refs.PersonnelManagement.routerLinkBack()
      })
      if (person) { console.log('person', person) }
      console.log('返回')
    },

    changeTabs(str) {
      // 判断权限
      // if(tab.name==='layout_sheet'){
      //   this.$refs.AcceptanceSchedule.reqInitMessage().then(res=>{
      //     if(res.code!=='ACK'){
      //       return false
      //     }
      //   })
      // })

      // console.log("str",)
      str.name === 'personManager' ? this.$route.meta.title = '验收资源配置'
        : (str.name === 'functionConfig' ? this.$route.meta.title = '验收资源配置'
          : (str.name === 'timeConfig' ? this.$route.meta.title = '验收资源配置'
            : '默认'))
      // console.log('str', str, this.$route)
      this.$router.push({
        // query: merge(this.$route.query, { 'id': '1' })
      })
      if (str.name === 'functionConfig') {
        this.$nextTick(() => {
          this.$refs.FunctionModule.routerCreated()
        })
      } else if (str.name === 'timeConfig') {
        if (this.smallTabName === 'score_templete') {
        // 直接选择评分模板页面
          this.$refs.ScoreTempleteSettings.routerLinkCreated()
        } else if (this.smallTabName === 'layout_statistics') {
        // 场务端验收排布统计查询页面
          this.$refs.LayoutStatisticsQuery.routerLinkCreated()
        } else if (this.smallTabName === 'quantity_score') {
        // 场务端预约量及评分统计查询页面
          this.$refs.BookingQuantityScore.routerLinkCreated()
        } else if (this.smallTabName === 'score_statistics') {
        // 评分统计查询页面详细
          this.$refs.ScoreStatisticsQuery.routerLinkCreated()
        } else if (this.smallTabName === 'layout_sheet') {
        // 机构端验收排布表设置页面
          this.$refs.AcceptanceSchedule.routerLinkCreated()
        } else if (this.smallTabName === 'number_statistics') {
        // 剩余名额统计
          this.$refs.RemainingQuota.routerLinkCreated()
        }
      } else {
        if (this.smallTabName === 'capability_query') {
        // 验收能力查询统计页面
          this.$refs.CapablityQuery.routerLinkCreated()
        } else if (this.smallTabName === 'emergency_modify') {
        // 应急修改
          this.$refs.EmergencymMdification.routerLinkCreated()
        } else {
          this.$nextTick(() => {
            this.$refs.PersonnelManagement.routerLinkBack()
          })
        }
      }
    },

    handleClick(tab, event) {
      this.smallTabName = tab.name
      if (tab.name === 'score_templete') {
        // 直接选择评分模板页面
        this.$refs.ScoreTempleteSettings.routerLinkCreated()
      } else if (tab.name === 'layout_statistics') {
        // 场务端验收排布统计查询页面
        this.$refs.LayoutStatisticsQuery.routerLinkCreated()
      } else if (tab.name === 'quantity_score') {
        // 场务端预约量及评分统计查询页面
        this.$refs.BookingQuantityScore.routerLinkCreated()
      } else if (tab.name === 'score_statistics') {
        // 评分统计查询页面详细
        this.$refs.ScoreStatisticsQuery.routerLinkCreated()
      } else if (tab.name === 'layout_sheet') {
        // 机构端验收排布表设置页面
        this.$refs.AcceptanceSchedule.routerLinkCreated()
      } else if (tab.name === 'number_statistics') {
        // 剩余名额统计
        this.$refs.RemainingQuota.routerLinkCreated()
      } else if (tab.name === 'capability_query') {
        // 验收能力查询统计页面
        this.$refs.CapablityQuery.routerLinkCreated()
      } else if (tab.name === 'emergency_modify') {
        // 应急修改
        this.$refs.EmergencymMdification.routerLinkCreated()
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
