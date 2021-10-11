<template>
  <div>
    <div class="main">
      <iframe :src="iframeSrc" />
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import JSEncrypt from 'jsencrypt'
export default {
  name: 'ExternalDevGuideDesign',
  data() {
    return {
      iframeSrc: ''
    }
  },
  created() {
    this.encryptTokenKey()
  },
  methods: {
    /**
     * @method: 加密TokenKey
     * @param {无}
     * @return {无}
     */
    encryptTokenKey() {
      const publicKey = this.$store.state['user'].publicKey
      const tokenKey = Cookies.get('Admin-Token')
      const encryptStr = new JSEncrypt()
      encryptStr.setPublicKey(publicKey)
      this.iframeSrc = `/guide/home.html?token=${encryptStr.encrypt(tokenKey.toString())}`
    }

  }
}
</script>

<style lang="scss" scoped>
  $mainWidth: 100%;

  .main {
    display: flex;
    background-color: #E7EDF5;
    flex-direction: column;
    width: $mainWidth;
    margin: 28px auto;
    height: 100%;

    .body {
      background: rgba(255, 255, 255, 1);
      border-bottom: none;
      padding: 0 0 0 0;
      display: flex;
    }
  }

</style>
