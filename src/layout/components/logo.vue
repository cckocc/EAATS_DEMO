<template>
  <div class="logo">
    <!-- <img src="~@/assets/style/logo.png" alt="" @click="goHome"> -->
    <img src="~@/assets/style/logo.png" alt="" @click="goHome">
  </div>
</template>

<script>
export default {
  name: 'Logo',
  data() {
    return {}
  },
  methods: {
    goHome() {
      this.$router.push('/home')
    }
  }
}
</script>

<style lang="scss" scoped>
  .logo {
    height: 100%;
    display: flex;
    align-items: center;

    img {
      width: 241px;
      height: 89px;
      cursor: pointer;
    }
  }
</style>
