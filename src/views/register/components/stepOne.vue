<template>
  <div class="step-one">
    <div class="step-one-main">
      <div class="content">
        <h1 class="text-center">{{ protocolTitle }}</h1>
        <div v-html="protolcolHtml" />
      </div>
      <div class="check">
        <el-checkbox v-model="checked">
          <span class="check-text">{{ $t('register.terms') }}</span>
        </el-checkbox>
      </div>
      <div class="btn">
        <el-button type="primary" @click="next()">{{ $t('common.button.nextStep') }}</el-button>
        <el-button type="default" @click="cancel()">{{ $t('common.button.cancel') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import gripManageApi from '@/api/gripManageApi'
export default {
  data() {
    return {
      checked: false,
      protocolTitle: '',
      protolcolHtml: ''
    }
  },
  created() {
    this.getUserProtocol()
  },
  methods: {
    next() {
      if (this.checked) {
        this.$emit('changeSteps', 2)
      } else {
        this.$message({
          message: this.$t('register.message.terms'),
          type: 'info'
        })
      }
    },
    cancel() {
      this.$router.go(-1)
    },
    getUserProtocol() {
      gripManageApi.getUserProtocol().then(res => {
        if (res.code === 'ACK') {
          const protocolObj = JSON.parse(JSON.stringify(res.data))
          this.protocolTitle = protocolObj.noticeTitle
          const html = protocolObj.body
          this.protolcolHtml = html
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .step-one {
    padding: 27px 46px 43px 55px;
    &-main{
      .content {
        width: 100%;
        word-break: break-word;
        word-wrap: break-word;
      }
      .check {
        margin: 5px 0 37px;
        &-text {
          font-size: 14px;
          font-weight: bold;
          color: rgba(44,118,209,1);
        }
      }
      .btn {
        display: flex;
        justify-content: center;
      }
    }
  }
</style>
