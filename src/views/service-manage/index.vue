<template>
  <div>
    <div class="board-container">
      <section v-for="item in itemList" :key="item.type" class="item">
        <div class="item-container">
          <div class="item-container-title">{{ item.title }}</div>
          <div class="item-container-steps">
            <div class="my-steps" :class="{'my-steps-en': language === 'en'}">
              <div v-for="step in item.steps" :key="step.type" class="my-step">
                <div class="my-step-main service-opening" :class="[step.class]">
                  <div class="my-step-main-title">{{ step.title }}</div>
                  <div class="my-step-main-content">{{ step.content }}</div>
                  <div class="my-step__more">
                    <span @click="onApply(item, step)">{{ $t('serviceApply.applyImmediately') }}</span>
                    <el-divider :direction="language === 'en' ? 'horizontal' : 'vertical'" />
                    <span @click="showMoreIntro(item, step)">{{ $t('serviceApply.moreIntroduction') }}</span>
                  </div>
                </div>
                <div class="my-step-head">
                  <div class="my-step__line" />
                  <div class="my-step__text">
                    <template v-if="step.index">{{ step.index }}</template>
                    <span v-else class="circle" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <el-dialog
      width="766px"
      :title="dialogObj.title"
      :visible.sync="dialogObj.visible"
    >
      <div style="white-space: pre-wrap">{{ dialogObj.content }}</div>
    </el-dialog>
  </div>
</template>

<script>
import basicDataConfigApi from '@/api/grip-manage/basicDataConfigApi'
import globalOptions from '@/utils/globalOptionsValue'

export default {
  name: 'ServiceManage',
  data() {
    return {
      userType: true,
      itemList: [],
      allItemList: globalOptions.procTypeOptions,
      dialogObj: {
        visible: false,
        title: '',
        content: {}
      }
    }
  },
  computed: {
    isIsvUser() {
      return this.$store.getters.userInfo.instnIdentity.includes('15')
    },
    language() {
      return this.$store.getters.language
    }
  },
  created() {
    const itemList = JSON.parse(JSON.stringify(this.allItemList))
    if (this.isIsvUser) {
      this.itemList = itemList
        .filter((e) => e.type !== '20')
        .map((e) => {
          e.steps = e.steps.filter((step) => {
            return step.type !== '20'
          })
          return e
        })
    } else {
      this.itemList = itemList
    }
    this.fetchData()
  },
  methods: {
    fetchData() {
      const params = {
        introductionBody: '',
        introductionType: '',
        parentType: ''
      }
      basicDataConfigApi.getOrgServiceIntro(params).then(res => {
        console.log(res)
        this.itemList.map((item) => {
          item.steps.map((step) => {
            const findItem = res.data.find(
              (e) =>
                e.parentType === item.type &&
                e.introductionType.code === step.type
            )
            step.obj = findItem
            step.introductionBody = this.language === 'en' ? findItem.introductionBodyEn : findItem.introductionBody
            step.content = step.introductionBody ? (step.introductionBody.length > 20 ? step.introductionBody.substr(0, 20) + '...' : step.introductionBody) : step.introductionBody
            return step
          })
          return item
        })
      })
    },
    onApply(item, step) {
      console.log(item, step)
      const type = item.type
      const sonType = step.type
      if (sonType === '00') {
        // 服务开通
        const obj = {
          parentType: type,
          sonType: sonType,
          operationType: 'add',
          serviceOpeningObj: JSON.stringify({})
        }
        this.$router.push({
          name: 'ServiceOpening',
          query: {
            isShowTitleBefore: true,
            params: encodeURIComponent(JSON.stringify(obj))
          }
        })
      } else if (sonType === '50') {
        // 网络开通
        this.$router.push({
          name: 'NetworkOpeningList',
          query: {
            parentType: type
          }
        })
      } else if (sonType === '10') {
        // 验收测试
        this.$router.push({
          name: 'AcceptanceTestList',
          query: {
            parentType: type
          }
        })
      } else if (sonType === '20') {
        // 接口上线
        this.$router.push({
          name: 'InterfaceOnlineList',
          query: {
            parentType: type
          }
        })
      } else if (sonType === '40') {
        // 权限变更
        this.$router.push({
          name: 'PermissionChangeList',
          query: {
            parentType: type
          }
        })
      }
    },
    showMoreIntro(item, step) {
      this.dialogObj.visible = true
      this.dialogObj.title = `${item.title}-${step.title}`
      this.dialogObj.content = step.introductionBody
    }
  }
}
</script>

<style lang="scss" scoped>
.board-container {
  .item {
    height: 365px;
    padding: 60px 0;
    &:nth-child(odd) {
      background-color: #fff;
    }
    &:nth-child(even) {
      background-color: #edf4ff;
    }
    &-container {
      width: 1164px;
      margin: 0 auto;
      &-title {
        height: 28px;
        font-size: 28px;
        line-height: 28px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #333333;
        border-left: 4px solid #2494fe;
        padding-left: 10px;
      }
      &-steps {
        margin-top: 32px;
      }
    }
  }
}
.my-steps {
  display: flex;
  .my-step {
    flex-basis: 291px;
    &-main {
      width: 260px;
      height: 136px;
      border-radius: 8px;
      overflow: hidden;
      position: relative;
      &.service-opening {
        background: url('~@/assets/style/steps/my-step-fwkt.png');
      }
      &.network-opening {
        background: url('~@/assets/style/steps/my-step-wlktsq.png');
        &.en {
          background: url('~@/assets/style/steps/my-step-wlktsq-en.png');
        }
      }
      &.acceptance-test {
        background: url('~@/assets/style/steps/my-step-yscs.png');
      }
      &.interface-online {
        background: url('~@/assets/style/steps/my-step-jksx.png');
      }
      &.permission-change {
        background: url('~@/assets/style/steps/my-step-qxbg.png');
      }
      &-title {
        margin: 30px 0 0 86px;
        height: 26px;
        line-height: 26px;
        font-size: 20px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        color: #ffffff;
      }
      &-content {
        margin: 8px 0 0 86px;
        width: 153px;
        font-size: 12px;
        font-family: Microsoft YaHei;
        font-weight: 400;
        line-height: 22px;
        color: #ffffff;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-all;
      }
      & .my-step__more {
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 100%;
        left: 0;
        width: 100%;
        height: 100%;
        background: #1c91ff;
        opacity: 0.9;
        border-radius: 8px;
        transition: top 0.4s;
        & > span {
          font-size: 20px;
          font-family: Microsoft YaHei;
          color: #fff;
          cursor: pointer;
        }
        &::v-deep .el-divider--vertical {
          margin: 0 16px;
        }
      }
      &:hover {
        .my-step__more {
          top: 0;
        }
      }
    }
    &-head {
      position: relative;
      text-align: center;
      margin-top: 16px;
      .my-step__line {
        position: absolute;
        top: 14px;
        left: 50%;
        right: -50%;
        border-top: 2px dashed #899ab2;
      }
      .my-step__text {
        position: relative;
        z-index: 1;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 32px;
        height: 32px;
        line-height: 32px;
        font-size: 18px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #899ab2;
        box-sizing: border-box;
        background: #fff;
        border: 2px solid #899ab2;
        border-radius: 50%;
        transition: 0.15s ease-out;
        & .circle {
          width: 12px;
          height: 12px;
          background: #899ab2;
          border-radius: 50%;
        }
      }
    }
    &:last-of-type .my-step__line {
      display: none;
    }
  }
  &-en {
    .my-step-main-title {
      font-size: 16px;
      height: auto;
    }
    .my-step__more {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
