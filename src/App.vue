<template>
  <div id="app">
    <router-view v-if="isReload" />
    <div
      v-if="isLogin"
      class="meun-switch"
    >
      <img src="@/assets/icon/contact.png" alt="在线客服" @click="openClick">
      <!-- <el-button type="primary" @click="openClick" icon="el-icon-headset"></el-button> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  provide() {
    return {
      reload: this.reload
    }
  },
  data() {
    return {
      isReload: true
    }
  },
  computed: {
    isLogin() {
      const { token } = this.$store.getters
      return !!token
    }
  },
  methods: {
    reload() {
      this.isReload = false
      this.$nextTick(() => {
        this.isReload = true
      })
    },
    openClick() {
      this.$concat({})
    }
  }
}
</script>

<style lang="scss" scoped>
.off {
  background: transparent;
}

.meun-switch {
  position: fixed;
  top: 50%;
  right: -20px;
  z-index: 2001;
  cursor: pointer;
  padding: 10px;
  transition: all 0.25s;
  &:hover {
    right: 0;
  }
  &>img {
    width: 50px;
    height: 50px;
  }
}
</style>
