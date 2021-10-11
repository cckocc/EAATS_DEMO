<template>
  <!-- 统计查询 -->
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
    <!-- <el-tabs
      v-model="tabActiveName"
      class="custom-main-tabs"
      @tab-click="changeTabs"
    >
      <el-tab-pane
        v-for="item in StatisticPageList"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        <keep-alive>
          <component
            :is="item.componentName"
            :ref="item.name"
            @newAddEmail="newAddEmail()"
          />
        </keep-alive>
      </el-tab-pane>
    </el-tabs> -->
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import statisticCompents from './tools/statisticsetting'

export default {
  name: 'StatisticQuery',
  components: {
    Audit: () => import('./audit-time-statistics'),
    MarketInstiStatistic: () => import('./MarketInstiStatistic/index.vue'),
    InformationStatistic: () => import('./InformationStatistic/index.vue'),
    ISVStatistic: () => import('./ISVStatistic/index'),
    AlternateQuery: () => import('./AlternateQuery/index.vue')
  },

  data() {
    return {
      tabActiveName: '',
      tabList: [
        {
          label: '审核时间节点统计',
          name: 'Audit',
          componentName: 'Audit',
          roles: ['GRIP_audit_statistic']
        },
        {
          label: '市场机构统计',
          name: 'MarketInstiStatistic',
          componentName: 'MarketInstiStatistic',
          roles: ['MARKET_statistic']
        },
        {
          label: '信息商统计',
          name: 'InformationStatistic',
          componentName: 'InformationStatistic',
          roles: ['INFO_statistic']
        },
        {
          label: 'ISV统计',
          name: 'ISVStatistic',
          componentName: 'ISVStatistic',
          roles: ['ISV_statistic']
        },
        {
          label: '候补查询',
          name: 'AlternateQuery',
          componentName: 'AlternateQuery',
          roles: ['alternate_statistic']
        }
      ],
      StatisticPageList: [],
      StatisticSubscriptionManageList: [],
      cacheList: []
    }
  },
  watch: {
    tabActiveName(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.cacheList.unshift(newValue)
      }
    },
    cacheList: {
      handler: function(newValue, oldValue) {
        if (newValue.length > 10) {
          this.cacheList.splice(9)
        }
      },
      deep: true,
      immediate: true
    }
  },
  async created() {
    this.getTabActiveName()
    // await this.initPage()
    // await this.changeTabs()
  },

  methods: {
    checkPermission,
    // 获取Tab激活页
    getTabActiveName() {
      this.tabList = this.tabList.filter(e => this.checkPermission(e.roles))
      this.tabActiveName = this.tabList.length > 0 ? this.tabList[0].name : ''
    },
    initPage() {
      const userInfo = this.$store.getters.userInfo.userInnerType.code
      this.cacheList = []
      this.StatisticSubscriptionManageList =
        statisticCompents.StatisticSubscriptionManage.filter((item) => {
          if (checkPermission(item.isPermission)) {
            return item
          }
        })
      userInfo === '05'
        ? (this.tabActiveName = 'Audit')
        : (this.tabActiveName =
            this.StatisticSubscriptionManageList[0].componentName)
      this.cacheList = [this.tabActiveName]
    },
    // checkPermission,
    newAddEmail(val) {
      console.log('val==========>', val)
      if (val.id === 1) {
        this.tabActiveName = 'Audit'
        this.changeTabs()
      } else if (val.id === 2) {
        this.tabActiveName = 'MarketInstiStatistic'
        this.changeTabs()
      } else if (val.id === 3) {
        this.tabActiveName = 'InformationStatistic'
        this.changeTabs()
      } else if (val.id === 4) {
        this.tabActiveName = 'ISVStatistic'
        this.changeTabs()
      } else if (val.id === 5) {
        this.tabActiveName = 'AlternateQuery'
        this.changeTabs()
      }
    },
    changeTabs() {
      // var flag = checkPermission([])
      switch (this.tabActiveName) {
        case 'Audit':
          this.StatisticPageList = statisticCompents.StatisticSubscriptionManage
          break
        case 'MarketInstiStatistic':
          this.StatisticPageList = statisticCompents.StatisticSubscriptionManage
          break
        case 'InformationStatistic':
          this.StatisticPageList = statisticCompents.StatisticSubscriptionManage
          break
        case 'ISVStatistic':
          this.StatisticPageList = statisticCompents.StatisticSubscriptionManage
          break
        case 'AlternateQuery':
          this.StatisticPageList = statisticCompents.StatisticSubscriptionManage
          break
      }
    },
    clickBtn(str) {
      // if (this.tabActiveName === 'newEmail' && str === '返回上一步') {
      //   if (this.cacheList.length > 1) this.tabActiveName = this.cacheList[1]
      //   this.changeTabs()
      // } else if (this.tabActiveName === 'newEmail' && str === '保存') {
      //   this.$refs.newEmail[0].save()
      //   console.log('保存信息')
      // } else if (this.tabActiveName === 'mewAutoEmailNotice' && str === '保存并下一步') {
      //   // 需要调用接口等待接口调用结束后再切换界面
      //   if (this.$refs.mewAutoEmailNotice[0].save()) {
      //     this.tabActiveName = 'newEmail'
      //     this.changeTabs()
      //   }
      // } else if (this.tabActiveName === 'mewAutoEmailNotice' && str === '取消') {
      //   this.tabActiveName = 'autoEmailSendNotice'
      //   this.changeTabs()
      // } else if (this.tabActiveName === 'emialTypeTemplate' && str === '返回上一步') {
      //   if (this.cacheList.length > 1) this.tabActiveName = this.cacheList[1]
      //   this.changeTabs()
      // } else if (this.tabActiveName === 'emialTypeTemplate' && str === '保存') {
      //   this.$refs.emialTypeTemplate[0].save()
      // }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

