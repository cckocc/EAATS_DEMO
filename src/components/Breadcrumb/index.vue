<template>
  <div class="breadcrumb">
    <div class="shadow-box">
      <div class="main">
        <!--<i class="el-icon-location"></i>-->
        <img class="point" src="@/assets/icon/point.png" alt="">
        <el-breadcrumb
          class="app-breadcrumb"
          separator-class="el-icon-arrow-right"
        >
          <transition-group name="breadcrumb">
            <el-breadcrumb-item
              v-for="(item, index) in levelList"
              :key="item.path"
              :to="
                item.redirect === 'noRedirect' || item.redirect === 'link'
                  ? ''
                  : { path: item.currentPath ? item.currentPath : item.path }
              "
            >
              <template v-if="item.redirect === 'noRedirect'">{{
                item.meta.realTitle || item.meta.title
              }}</template>
              <template v-if="item.redirect === 'link'">
                <a @click.prevent="handleLink(item)">{{ item.meta.realTitle || item.meta.title }}</a>
              </template>
              <template
                v-if="
                  item.redirect !== 'noRedirect' && item.redirect !== 'link'
                "
              >
                <span
                  :class="{ 'no-redirect': index == levelList.length - 1 }"
                >{{ item.meta.realTitle || item.meta.title }}</span>
              </template>
              <!-- <span
              v-if="item.redirect==='noRedirect'||index==levelList.length-1"
              class="no-redirect"
            >{{ item.meta.title }}</span>
            <a v-else @click.prevent="handleLink(item)">{{ item.meta.title }}</a> -->
            </el-breadcrumb-item>
          </transition-group>
        </el-breadcrumb>
      </div>
    </div>
  </div>
</template>

<script>
import pathToRegexp from 'path-to-regexp'
import globalOptions from '@/utils/globalOptionsValue'
export default {
  data() {
    return {
      procTypeOptions: globalOptions.procTypeOptions,
      levelList: []
    }
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith('/redirect/')) {
        return
      }
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      // 同个页面面包屑中不同的展示
      if (this.$route.query.isShowTitleBefore) {
        const urlParams = JSON.parse(decodeURIComponent(this.$route.query.params))
        const item = this.procTypeOptions.find(e => e.type === urlParams.parentType)
        this.$route.meta.realTitle = `${item.title}-${this.$route.meta.title}`
      } else {
        this.$route.meta.realTitle = null
      }
      // only show routes with meta.title
      const matched = this.$route.matched.filter(item => item.meta && item.meta.title)
      // const first = matched[0]

      // if (!this.isDashboard(first)) {
      //   matched = [{ path: '/dashboard', meta: { title: 'Dashboard' }}].concat(matched)
      // }
      // const levelList = matched.filter(item => item.meta && item.meta.title)
      // currentPath作用是点击带参数的面包屑时不会跳转
      this.levelList = matched.map(e => {
        if (e.name === this.$route.name) {
          e.currentPath = this.$route.fullPath
        }
        return e
      })
      console.log(this.levelList)
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      if (item.meta.title === '标准与规范') {
        this.$router.push({
          name: 'standardMore'
        })
        return
      }
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style lang="scss" scoped>
.shadow-box {
  width: 100%;
  display: flex;
  justify-content: center;
  background-color: #ffffff;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
  // margin-bottom: 6px;
}
.breadcrumb {
  display: flex;
  align-items: center;
  position: relative;
  z-index: 1;
  .main {
    display: flex;
    align-items: center;
    width: 1220px;
    height: 53px;
    .point {
      width: 14px;
      height: auto;
    }
    .app-breadcrumb.el-breadcrumb {
      display: block;
      font-size: 14px;
      line-height: 50px;
      margin-left: 8px;
      width: 100%;

      .el-breadcrumb__item {
        font-size: 16px;
        color: #5a5a5a;
        &:nth-child(2) {
          // width: 90%;
        }
        .no-redirect {
          display: block;
          color: #2c76d1;
          font-weight: bold;
          cursor: text;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }
}
</style>
