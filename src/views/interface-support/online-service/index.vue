<template>
  <div>
    <div class="iframe-container">
      <div class="container">
        <iframe id="online-service-iframe" :src="url" />
      </div>
    </div>
  </div>
</template>

<script>
import { getOnlineServiceUrl } from '@/api/faq'
import { mapGetters } from 'vuex'
export default {
  name: 'OnlineService',
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  data() {
    return {
      url: ''
    }
  },
  created() {
    // this.getUrl()
  },
  methods: {
    getUrl() {
      const userId = this.userInfo.id
      const params = {
        userId: userId
      }
      getOnlineServiceUrl(params).then(res => {
        if (res.code === 'ACK') {
          this.url = res.data
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .iframe-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    .container {
      width: 65%;
      margin: 20px 0;
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
  }
</style>
