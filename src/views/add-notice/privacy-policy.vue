<template>
  <div>
    <div class="main">
      <div class="content">
        <h1 class="text-center">{{ privacyTitle }}</h1>
        <div v-html="privacyHtml" />
      </div>
    </div>
  </div>
</template>

<script>
import gripManageApi from '@/api/gripManageApi'
export default {
  data() {
    return {
      privacyTitle: '',
      privacyHtml: '',
      privacyObj: {
        body: ''
      }
    }
  },
  created() {
    this.getUserPrivacy()
  },
  methods: {
    getUserPrivacy() {
      gripManageApi.getUserPrivacy().then(res => {
        if (res.code === 'ACK') {
          this.privacyObj = JSON.parse(JSON.stringify(res.data))
          this.privacyTitle = this.privacyObj.noticeTitle
          const html = this.privacyObj.body
          // html = html.replace(/&lt;/g, '<')
          // html = html.replace(/&gt;/g, '>')
          this.privacyHtml = html
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
$mainWidth: 1196px;
.main {
  display: flex;
  background-color: #E7EDF5;
  flex-direction: column;
  width: $mainWidth;
  margin: 28px auto;
  height: 100%;
  .content {
    height: auto;
    padding: 0 160px;
    margin: 0 auto;
    word-break: break-word;
    width: 100%;
    word-wrap: break-word;
  }
}
</style>
