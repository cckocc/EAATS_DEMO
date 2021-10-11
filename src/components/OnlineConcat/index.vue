<template>
  <div class="main">
    <div v-if="show" class="iframe-container">
      <el-dialog :close-on-click-modal="false" title="在线客服" :visible.sync="show" width="1100px">
        <div class="container">
          <iframe id="online-service-iframe" :src="url" />
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getOnlineServiceUrl } from '@/api/faq'
import { getInfo } from '@/api/user'
export default {
  name: 'OnlineService',
  data() {
    return {
      show: false,
      url: ''
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getUrl()
    })
    window.addEventListener('message', messageEvent => {
      console.log('iframe message:' + messageEvent)
      this.show = false
    }, false)
  },
  methods: {
    async getUrl() {
      const r = await getInfo()
      const userId = r.data.id
      const params = {
        userId: userId
      }
      await getOnlineServiceUrl(params).then(res => {
        if (res.code === 'ACK') {
          this.url = res.data
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  display: flex;
  justify-content: center;
}
.iframe-container {
  width: 50%;
  .container {
    width: 100%;
    height: 700px;
    display: flex;
    flex-direction: row;
    iframe {
      width: 100%;
      min-height: calc(100vh - 408px);
    }
    .contact-btn {
      align-self: flex-end;
      margin-left: 10px;
    }
  }
  .el-dialog {
    height: 700px;
  }
  /deep/.el-dialog__body {
    padding: 0 !important;
  }
}
</style>
