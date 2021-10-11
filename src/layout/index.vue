<template>
  <div :class="classObj" class="main-content">
    <!--<div v-if="sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
    <sidebar class="sidebar-container" />-->
    <Header />
    <Breadcrumb v-if="!hiddenBread" />
    <section class="blueBg" />
    <section class="app-main">
      <transition name="fade-transform" mode="out-in">
        <keep-alive :include="cachedViews">
          <router-view />
        </keep-alive>
      </transition>
    </section>
    <Footer />
  </div>
</template>

<script>
import Header from './components/header'
import Footer from './components/footer'
// import Sidebar from '@/layout/components/Sidebar'
// import ResizeMixin from '@/layout/mixin/ResizeHandler'
import { mapState } from 'vuex'
export default {
  name: 'AppMain',
  // mixins: [ResizeMixin],
  components: {
    Header,
    Footer
    // Sidebar
    // Banner
  },
  data() {
    return {
      cachedViews: ['MyService', 'ProcessView'],
      hiddenBread: false
    }
  },
  computed: {
    ...mapState({
      sidebar: (state) => state.app.sidebar,
      device: (state) => state.app.device
    }),
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        // mobile: this.device === 'mobile'
        mobile: true
      }
    }
    // hiddenBread() {
    //   return this.$route.hiddenBread || false
    // }
  },
  watch: {
    $route: {
      handler(newVal, oldVal) {
        console.log(newVal, oldVal)
        this.hiddenBread = this.$route.meta ? (this.$route.meta.hiddenBread || false) : true
        const cachedNames = ['MyService', 'ProcessView']
        const relateNames = ['ServiceOpening', 'AcceptanceTest', 'ServiceOnline', 'PermissionChange', 'MyService', 'ProcessView']
        if (cachedNames.includes(newVal.name)) {
          this.cachedViews = [newVal.name]
        } else {
          if (!relateNames.includes(newVal.name)) {
            this.cachedViews = []
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  // beforeRouteLeave(to, from, next) {
  //   const cachedNames = ['MyService', 'ProcessView']
  //   const relateNames = ['ServiceOpening', 'AcceptanceTest', 'ServiceOnline', 'PermissionChange', 'MyService', 'ProcessView']
  //   if (cachedNames.includes(to.name)) {
  //     this.cachedViews = [to.name]
  //   } else {
  //     if (!relateNames.includes(to.name)) {
  //       this.cachedViews = []
  //     }
  //   }
  //   next()
  // },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('app/closeSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style lang="scss" scoped>
.blueBg {
  position: absolute;
  width: 100%;
  height: 420px;
  background-color: #edf4ff;
  top: 107px;
  left: 0;
  right: 0;
}
.main-content {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  // overflow-x: hidden;
  .app-main {
    min-height: calc(100vh - 281px);
    position: relative;
  }
}
</style>
