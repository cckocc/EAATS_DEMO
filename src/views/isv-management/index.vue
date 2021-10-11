<template>
  <!-- 场务端 ———— ISV看板管理 -->
  <div class="isvManagement">
    <el-tabs
      v-model="tabActiveName"
      class="main-tabs custom-main-tabs"
      @tab-click="changeTabs"
    >
      <el-tab-pane
        v-for="item in ISVPageList"
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
import checkPermission from '@/utils/permission' // 权限
// import butsetting from './tools/btnsetting'
import isvComponents from './tools/isvComponents'

export default {
  name: 'ISVManagement',
  components: {
    DisplayInformationAudit: () => import('./display_information_audit'),
    IsvManage: () => import('./isv_manage'),
    IsvCertificateManage: () => import('./isv_manage/isv_certificate_manage'),
    JgIsvKanban: () => import('./jgIsv_kanban')
  },

  data() {
    return {
      tabActiveName: 'IsvManage',
      content: null,
      ISVPageList: [],
      ISVSubscriptionManageList: [],
      cacheList: [],
      isFooterBtn: false,
      butList: []
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
      this.ISVSubscriptionManageList =
        isvComponents.ISVSubscriptionManage.filter((item) => {
          if (checkPermission(item.isPermission)) {
            return item
          }
        })
      userInfo !== '05'
        ? (this.tabActiveName = 'JgIsvManage')
        : (this.tabActiveName = this.ISVSubscriptionManageList[0].componentName)
      this.cacheList = [this.tabActiveName]
    },
    // checkPermission,
    newAddEmail(val) {
      console.log('val==========>', val)
      if (val.id === 1) {
        this.tabActiveName = 'DisplayInformationAudit'
        this.changeTabs()
      } else if (val.id === 2) {
        this.tabActiveName = 'IsvManage'
        this.changeTabs()
      } else if (val.id === 3) {
        this.tabActiveName = 'IsvCertificateManage'
        this.changeTabs()
      } else if (val.id === 4) {
        this.tabActiveName = 'JgIsvKanban'
        this.changeTabs()
      }
    },
    changeTabs() {
      // var flag = checkPermission([])
      switch (this.tabActiveName) {
        case 'IsvManage':
          this.isFooterBtn = false
          this.ISVPageList = this.ISVSubscriptionManageList
          // this.$nextTick(() => {
          //   this.$refs.IsvCertificateManage.routerLinkCreated()
          // })
          break
        case 'DisplayInformationAudit':
          this.isFooterBtn = false
          this.ISVPageList = this.ISVSubscriptionManageList
          break
        case 'IsvCertificateManage':
          this.isFooterBtn = false
          this.ISVPageList = this.ISVSubscriptionManageList
          break
        case 'JgIsvKanban':
          this.isFooterBtn = false
          this.ISVPageList = this.ISVSubscriptionManageList
          break
        // case 'NoPermission':
        //   this.$message.error('无权限访问')
        //   break
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
.email_page_editor {
  width: 100%;
  background-color: transparent;
  .email_page {
    width: $mainWidth;
    margin: 0px auto;
  }
}
.foot_page {
  background-color: transparent;
  width: $mainWidth;
  margin: 0px auto;
  .footer_but {
    display: flex;
    flex-direction: row;
    justify-content: center;
    margin: 50px 0px;
  }
}

.main-tabs ::v-deep .el-tabs__header {
  background-color: #fff;
  // height: 69px;
  // line-height: 69px;
}
.main-tabs ::v-deep .el-tabs__nav-wrap {
  width: $mainWidth;
  margin: 0px auto;
}
.main-tabs ::v-deep .el-tabs__content {
  width: $mainWidth;
  margin: 0px auto;
}
</style>

