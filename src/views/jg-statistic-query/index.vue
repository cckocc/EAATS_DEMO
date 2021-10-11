<template>
  <div>
    <el-tabs
      v-model="institutionType"
      class="custom-main-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane v-if="institutionTypeList.includes('00')" name="00">
        <div slot="label">
          <span class="tab-label">市场机构统计</span>
        </div>
        <JgMarketInstiStatistic />
      </el-tab-pane>
      <el-tab-pane v-if="institutionTypeList.includes('10')" name="10">
        <div slot="label">
          <span class="tab-label">信息商统计</span>
        </div>
        <JgInformationStatistic />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import JgMarketInstiStatistic from './jg-market-insti-statistic/index.vue'
import JgInformationStatistic from './jg-information-statistic/index.vue'
export default {
  name: 'StatisticQuery',
  components: {
    JgMarketInstiStatistic,
    JgInformationStatistic
  },
  data() {
    return {
      institutionType: '00',
      notice: ''
    }
  },
  computed: {
    isAgencyUser() {
      return this.$store.getters.userInfo.userInnerType.name === 'AGENCY'
    },
    institutionTypeList() {
      // console.log(
      //   '这个institutionTypeList',
      //   this.$store.state.user.institutionTypeList
      // )
      return this.isAgencyUser
        ? this.$store.state.user.institutionTypeList
        : ['00', '10']
    }
  },
  mounted() {
    if (this.institutionTypeList.length > 0) {
      this.institutionType = this.institutionTypeList[0]
      // console.log('打印 this.institutionType', this.institutionType)
    }
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-main-tabs ::v-deep .el-tabs__active-bar.is-top {
  background-color: transparent;
}

::v-deep .el-tabs__item {
  width: 150px;
}
</style>
