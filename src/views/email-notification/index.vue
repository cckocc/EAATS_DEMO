<template>
  <!-- 场务端邮件配置首页 -->
  <div class="email_page_editor">
    <el-tabs
      v-model="tabActiveName"
      class="main-tabs custom-main-tabs"
      @tab-click="changeTabs(1)"
    >
      <el-tab-pane
        v-for="item in emailPageList"
        :key="item.name"
        :label="item.title"
        :name="item.name"
      >
        <keep-alive>
          <component
            :is="item.componentName"
            :ref="item.name"
            :components-info="componentsInfo"
            @newAddEmail="newAddEmail"
            @loadingStatus="loadingStatus"
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
          :disabled="item.disabledStatus"
          :loading="item.loadStatus"
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
import butsetting from './tools/btnsetting'
import emailCompents from './tools/emailsetting'
export default {
  name: 'FuncFormsEdit',
  components: {
    AutoEmail: () => import('./auto-email/index'),
    handEmail: () => import('./hand-email/index'),
    handSendEmail: () => import('./handSendEmail/index'),
    autoEmailSendNotice: () => import('./automatically-send-email/index'),
    mewAutoEmailNotice: () => import('./new-auto-email-notice/index'),
    subscribeEmail: () => import('./subscribe-emial/index'),
    emialTypeTemplate: () => import('./add-emial-type-template/index'),
    addHandsendNotice: () => import('./add-handsend-notice/index'),
  },
  data() {
    return {
      content: null,
      selectCurrent: {},
      // tabActiveName: 'autoEmailSendNotice',
      emailNoticeList: [],
      tabActiveName: 'autoEmailSendNotice',
      emailPageList: [],
      cacheList: [],
      componentsInfo: {
        // 各个页面数据统一放入这个对象内进行传递交互
        title: '新建邮件通知',
        transfer: {
          content: '请查看新建邮件通知',
        },
      },
      isFooterBtn: false,
      butList: [],
    }
  },
  watch: {
    tabActiveName(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.cacheList.unshift(newValue)
      }
    },
    cacheList: {
      handler: function (newValue, oldValue) {
        if (newValue.length > 10) {
          this.cacheList.splice(9)
        }
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.cacheList = []
    this.emailNoticeList = emailCompents.handSendEmail.filter((item) => {
      if (checkPermission(item.isPermission)) {
        return item
      }
    })
    this.tabActiveName = this.emailNoticeList[0].componentName
    this.cacheList = [this.tabActiveName]
    this.changeTabs()
  },
  methods: {
    /*
      @methods { Function }
      @params{ Object } Object.id唯一标识Object.title调用的按钮名称
      已存在的对应规则：
      id:1 title:新建邮件通知 id:2 title:订阅模板类模板维护 id:3 title:新建订阅邮件类型模板
      id:6 title:自动邮件查看 id:7 title手动发送按钮
    */
    newAddEmail(val) {
      this.selectCurrent = val
      if (val.id === 1) {
        // editor/view/add
        this.tabActiveName = 'mewAutoEmailNotice'
        this.componentsInfo.title = '新建/查看/编辑-自动邮件通知'
        this.componentsInfo.data = val
        this.changeTabs(val)
        console.log(val)
      } else if (val.id === 2) {
        this.tabActiveName = 'subscribeEmail'
        this.changeTabs()
      } else if (val.id === 3) {
        this.tabActiveName = 'emialTypeTemplate'
        this.componentsInfo.title = '订阅模板类型通知查看'
        this.componentsInfo.data = val
        this.changeTabs(val)
      } else if (val.id === 4) {
        this.tabActiveName = 'addHandsendNotice'
        this.componentsInfo.data = val
        this.changeTabs(val)
      } else if (val.id === 5) {
        this.tabActiveName = 'handSendEmail'
        this.changeTabs()
      } else if (val.id === 6) {
        this.tabActiveName = 'newEmail'
        this.componentsInfo.data = val
        this.changeTabs(val)
      } else if (val.id === 7) {
        this.tabActiveName = 'autoEmailSendNotice'
        this.changeTabs()
      } else if (val.id === 8) {
        this.tabActiveName = 'handEmail'
        this.componentsInfo.data = val
        this.changeTabs(val)
      }
    },
    // 控制按钮配置
    loadingStatus(val) {
      // 1-3自动流程
      // 101-103手动流程
      // 201-模板信息
      if (!val) return false
      switch (val.id) {
        case 1:
          this.butList.forEach((item) => {
            if (item.label === '保存并下一步') {
              item.loadStatus = val.loadStatus
            }
            if (item.label === '取消') {
              item.disabledStatus = val.loadStatus
            }
          })
          break
        case 2:
          this.butList.forEach((item) => {
            if (item.label === '保存') {
              item.loadStatus = val.loadStatus
            }
            if (item.label === '发布') {
              item.disabledStatus = val.loadStatus
            }
            if (item.label === '返回上一步') {
              item.disabledStatus = val.loadStatus
            }
          })
          break
        case 3:
          this.butList.forEach((item) => {
            if (item.label === '发布') {
              item.loadStatus = val.loadStatus
            }
            if (item.label === '保存') {
              item.disabledStatus = val.loadStatus
            }
            if (item.label === '返回上一步') {
              item.disabledStatus = val.loadStatus
            }
          })
          break
        case 101:
          this.butList.forEach((item) => {
            if (item.label === '保存并下一步') {
              item.loadStatus = val.loadStatus
            }
            if (item.label === '取消') {
              item.disabledStatus = val.loadStatus
            }
          })
          break
        case 102:
          this.butList.forEach((item) => {
            if (item.label === '保存') {
              item.loadStatus = val.loadStatus
            }
            if (item.label === '发布') {
              item.disabledStatus = val.loadStatus
            }
            if (item.label === '返回上一步') {
              item.disabledStatus = val.loadStatus
            }
          })
          break
        case 103:
          this.butList.forEach((item) => {
            if (item.label === '发布') {
              item.loadStatus = val.loadStatus
            }
            if (item.label === '保存') {
              item.disabledStatus = val.loadStatus
            }
            if (item.label === '返回上一步') {
              item.disabledStatus = val.loadStatus
            }
          })
          break
        case 201:
          this.butList.forEach((item) => {
            if (item.label === '保存') {
              item.disabledStatus = val.loadStatus
            }
            if (item.label === '返回上一步') {
              item.disabledStatus = val.loadStatus
            }
          })
          break
      }
    },
    changeTabs(val) {
      switch (this.tabActiveName) {
        case 'newEmail':
          this.isFooterBtn = true
          this.butList =
            this.selectCurrent && this.selectCurrent.from === 'view'
              ? butsetting.newEmailView
              : butsetting.newEmail
          emailCompents.newEmail.forEach((item) => {
            if (this.selectCurrent.from === 'view') {
              item.title = '查看自动邮件通知'
            } else if (this.selectCurrent.from === 'editor') {
              item.title = '编辑自动邮件通知'
            } else {
              item.title = '新建自动邮件通知'
            }
          })
          this.emailPageList = emailCompents.newEmail
          break
        case 'handSendEmail':
          this.isFooterBtn = false
          this.emailPageList = this.emailNoticeList
          break
        case 'autoEmailSendNotice':
          this.isFooterBtn = false
          this.emailPageList = this.emailNoticeList
          break
        case 'mewAutoEmailNotice':
          this.isFooterBtn = true
          this.butList =
            this.selectCurrent && this.selectCurrent.from === 'view'
              ? butsetting.mewAutoEmailNoticeView
              : butsetting.mewAutoEmailNotice
          // console.log(emailCompents.mewAutoEmailNotice)
          console.log('======================>')
          this.emailPageList = emailCompents.mewAutoEmailNotice.map((item) => {
            if (this.selectCurrent.from === 'view') {
              item.title = '查看自动邮件通知'
              return item
            } else if (this.selectCurrent.from === 'editor') {
              item.title = '编辑自动邮件通知'
              return item
            } else {
              item.title = '新建自动邮件通知'
              return item
            }
          })
          this.emailPageList = emailCompents.mewAutoEmailNotice
          console.log('======================>')
          break
        case 'subscribeEmail':
          this.isFooterBtn = false
          this.butList = butsetting.subscribeEmail
          this.emailPageList = emailCompents.subscribeEmail
          break
        case 'emialTypeTemplate':
          this.isFooterBtn = true
          this.butList =
            this.selectCurrent && this.selectCurrent.from === 'view'
              ? butsetting.emialTypeTemplateView
              : butsetting.emialTypeTemplate
          emailCompents.emialTypeTemplate.forEach((item) => {
            if (this.selectCurrent.from === 'view') {
              item.title = '查看订阅邮件类型模板'
            } else if (this.selectCurrent.from === 'editor') {
              item.title = '编辑订阅邮件类型模板'
            } else {
              item.title = '新建订阅邮件类型模板'
            }
          })
          this.emailPageList = emailCompents.emialTypeTemplate
          break
        case 'addHandsendNotice':
          this.isFooterBtn = true
          this.butList =
            this.selectCurrent && this.selectCurrent.from === 'view'
              ? butsetting.addHandsendNoticeView
              : butsetting.addHandsendNotice
          emailCompents.addHandsendNotice.forEach((item) => {
            if (this.selectCurrent.from === 'view') {
              item.title = '查看手动邮件通知'
            } else if (this.selectCurrent.from === 'editor') {
              item.title = '编辑手动邮件通知'
            } else {
              item.title = '新建手动邮件通知'
            }
          })
          // this.butList = butsetting.addHandsendNotice
          this.emailPageList = emailCompents.addHandsendNotice
          break
        case 'handEmail':
          this.isFooterBtn = true
          this.butList =
            this.selectCurrent && this.selectCurrent.from === 'view'
              ? butsetting.handEmailView
              : butsetting.handEmail
          emailCompents.handEmail.forEach((item) => {
            if (this.selectCurrent.from === 'view') {
              item.title = '查看手动邮件通知'
            } else if (this.selectCurrent.from === 'editor') {
              item.title = '编辑手动邮件通知'
            } else {
              item.title = '新建手动邮件通知'
            }
          })
          this.emailPageList = emailCompents.handEmail
          break
      }
    },
    clickBtn(str) {
      if (this.tabActiveName === 'newEmail' && str === '返回上一步') {
        this.$refs.newEmail[0].returnBack()
      } else if (this.tabActiveName === 'newEmail' && str === '保存') {
        this.$refs.newEmail[0].save(1)
      } else if (this.tabActiveName === 'newEmail' && str === '发布') {
        this.$refs.newEmail[0].save(2)
      } else if (this.tabActiveName === 'newEmail' && str === '返回列表') {
        this.$refs.newEmail[0].returnList()
      } else if (this.tabActiveName === 'handEmail' && str === '返回上一步') {
        this.$refs.handEmail[0].returnBack()
      } else if (this.tabActiveName === 'handEmail' && str === '保存') {
        this.$refs.handEmail[0].save(1)
      } else if (this.tabActiveName === 'handEmail' && str === '发布') {
        this.$refs.handEmail[0].save(2)
      } else if (this.tabActiveName === 'handEmail' && str === '返回列表') {
        this.$refs.handEmail[0].returnList()
      } else if (
        this.tabActiveName === 'mewAutoEmailNotice' &&
        str === '保存并下一步'
      ) {
        // 需要调用接口等待接口调用结束后再切换界面切换跳转可以放入到回调组件回调函数处理这样可以区分自动/手动的新建、编辑、查看
        this.$refs.mewAutoEmailNotice[0].save()
      } else if (
        this.tabActiveName === 'mewAutoEmailNotice' &&
        str === '取消'
      ) {
        this.tabActiveName = 'autoEmailSendNotice'
        this.changeTabs()
      } else if (
        this.tabActiveName === 'mewAutoEmailNotice' &&
        str === '下一步'
      ) {
        this.$refs.mewAutoEmailNotice[0].handNext()
      } else if (
        this.tabActiveName === 'emialTypeTemplate' &&
        str === '返回上一步'
      ) {
        if (this.cacheList.length > 1) this.tabActiveName = this.cacheList[1]
        this.changeTabs()
      } else if (
        this.tabActiveName === 'emialTypeTemplate' &&
        str === '返回列表'
      ) {
        this.tabActiveName = 'subscribeEmail'
        this.changeTabs()
      } else if (this.tabActiveName === 'emialTypeTemplate' && str === '保存') {
        // 需要调用接口等待接口调用结束后再切换界面切换跳转可以放入到回调组件回调函数处理这样可以区分自动/手动的新建、编辑、查看
        this.$refs.emialTypeTemplate[0].save()
      } else if (this.tabActiveName === 'subscribeEmail' && str === '取消') {
        this.tabActiveName = 'handSendEmail'
        this.changeTabs()
      } else if (this.tabActiveName === 'addHandsendNotice' && str === '取消') {
        this.tabActiveName = 'handSendEmail'
        this.changeTabs()
        // addEmailTemplate
      } else if (
        this.tabActiveName === 'addHandsendNotice' &&
        str === '保存并下一步'
      ) {
        // 需要调用接口等待接口调用结束后再切换界面切换跳转可以放入到回调组件回调函数处理这样可以区分自动/手动的新建、编辑、查看
        this.$refs.addHandsendNotice[0].save()
      } else if (
        this.tabActiveName === 'addHandsendNotice' &&
        str === '下一步'
      ) {
        this.$refs.addHandsendNotice[0].handNext()
        // this.tabActiveName = 'newEmail'
        // this.changeTabs({ from: 'view', type: 'hand' })
      }
    },
  },
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

