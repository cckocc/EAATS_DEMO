<template>
  <!-- 场务端 ———— 联系人与邮件订阅管理 -->
  <div class="contact_manage">
    <el-tabs v-model="tabActiveName" class="main-tabs custom-main-tabs" @tab-click="changeTabs">
      <el-tab-pane v-for="item in emailPageList" :key="item.name" :label="item.title" :name="item.name">
        <!-- {{ item.name }} -->
        <keep-alive>
          <component :is="item.componentName" :ref="item.name" @newAddEmail="newAddEmail" />
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
    <div v-show="isFooterBtn" class="foot_page">
      <div class="footer_but">
        <el-button
          v-for="item in butList"
          :key="item.label"
          :plain="item.style === 'plain'"
          :round="item.style === 'round'"
          :circle="item.style === 'circle'"
          :type="item.type ? item.type : ''"
          @click="clickBtn(item.label)"
        >
          {{ item.label }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
// import butsetting from './tools/btnsetting'
import emailCompents from './tools/emailsetting'

export default {
  name: 'ContactManage',
  components: {
    EmailSubscriptionManage: () => import('./email-subscription-manage'),
    ContactManagement: () => import('./contact_management'),
    InstitutionalSubscriptionManagement: () => import('./InstSubManage'),
    GripSubscriptionManagement: () => import('./gripSubManage'),
    PersonalCenter: () => import('@/views/personal-center')
  },
  data() {
    return {
      tabActiveName: 'PersonalCenter',
      content: null,
      emailPageList: [
      ],
      EmailSubscriptionManageList: [],
      cacheList: [],
      isFooterBtn: false,
      butList: [
      ]
    }
  },
  computed: {
    language() {
      return this.$store.getters.language
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
    await this.initPage()
    await this.changeTabs()
  },

  methods: {
    initPage() {
      const userInfo = this.$store.getters.userInfo.userInnerType.code
      this.cacheList = []
      this.EmailSubscriptionManageList = emailCompents.EmailSubscriptionManage.filter(item => {
        // if (checkPermission(item.isPermission)) { return item }
        return item
      })
      userInfo === '00' ? this.tabActiveName = 'PersonalCenterOrg' : this.tabActiveName = this.EmailSubscriptionManageList[0].componentName
      this.cacheList = [this.tabActiveName]
    },
    // checkPermission,
    newAddEmail(val) {
      // console.log('val==========>', val)
      // if (val.id === 1) {
      //   this.tabActiveName = 'EmailSubscriptionManage'
      //   this.changeTabs()
      // } else if (val.id === 2) {
      //   this.tabActiveName = 'ContactManagement'
      //   this.changeTabs()
      // }
    },
    changeTabs() {
      // var flag = checkPermission([])
      switch (this.tabActiveName) {
        case 'PersonalCenterOrg':
          this.isFooterBtn = false
          this.emailPageList = emailCompents.EmailSubscriptionManageOrgan.filter(e => {
            return this.language !== 'en' || e.name === 'PersonalCenterOrg'
          })
          break
        case 'ContactManagement':
          this.isFooterBtn = false
          this.emailPageList = this.EmailSubscriptionManageList
          break
        case 'InstitutionalSubscriptionManagement':
          this.isFooterBtn = false
          this.emailPageList = this.EmailSubscriptionManageList
          break
        case 'GripSubscriptionManagement':
          this.isFooterBtn = false
          this.emailPageList = this.EmailSubscriptionManageList
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
  $mainWidth: 1220px;
.email_page_editor{
    width: 100%;
    background-color: transparent;
    .email_page{
        width: $mainWidth;
        margin: 0px auto;
    }
}
.foot_page{
    background-color: transparent;
    width: $mainWidth;
    margin: 0px auto;
    .footer_but{
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin: 50px 0px;
    }
}

  .main-tabs ::v-deep .el-tabs__header{
    background-color: #fff;
    // height: 69px;
    // line-height: 69px;
  }
  .main-tabs ::v-deep .el-tabs__nav-wrap{
    width:  $mainWidth;
    margin: 0px auto;
  }
  .main-tabs ::v-deep .el-tabs__content{
    width:  $mainWidth;
    margin: 0px auto;
  }
</style>

