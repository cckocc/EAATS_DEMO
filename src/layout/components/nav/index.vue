<template>
  <div class="nav">
    <ul class="menu-ul">
      <navItem v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
    </ul>
  </div>
</template>

<script>
import navItem from './navItem'
// import { constantRoutes } from '@/router'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'permission_routes'
    ]),
    routes() {
      console.log(this.permission_routes)
      // 为了区分入口界面做的内容跳转逻辑
      const new_routes = this.permission_routes.filter(item => {
        return item
      })
      return new_routes
    }
  },
  components: {
    navItem
  },
  data() {
    return {
      // constantRoutes
    }
  }
}
</script>

<style lang="scss" scoped>
  .nav {
    display: flex;
    align-items: flex-end;
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Chrome/Safari/Opera */
    -khtml-user-select: none; /* Konqueror */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently not supported by any browser */
    .menu-ul {
      list-style: none;
      display: flex;
      flex-direction: row;
      margin: 0;
      padding: 0;
    }
  }
</style>
