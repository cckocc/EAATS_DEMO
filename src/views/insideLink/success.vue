|<template>
  <div class="inside-success">
    <div class="inside-success-left">欢迎进入：</div>
    <div class="inside-success-center">对外接口服务系统</div>
    <div class="inside-success-bottom">CFETS API Service System</div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  computed: {
    token() {
      return this.$store.state.user.token
    }
  },
  mounted() {
    if (this.$store.getters.isVisitor) {
      window.location.reload()
    }
    if (this.$route.params.isHref) {
      const newpage = this.$router.resolve({
        name: 'inside-success'
      })
      window.open(newpage.href, '_blank')
    }
  }
}
</script>

<style lang="scss" scoped>
.inside-success {
  font-weight: bold;
  width: 400px;
  margin: 200px auto;
  &-left {
    font-size: 20px;
  }
  &-center {
    margin: 0 auto;
    text-align: center;
    padding: 20px;
    border-bottom: 1px solid #ddd;
    width: 400px;
    font-size: 22px;
    letter-spacing: 8px;
  }
  &-bottom {
    font-size: 20px;
    padding-top: 20px;
    text-align: center;
  }
}
</style>
