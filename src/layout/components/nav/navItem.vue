<template>
  <li v-if="!item.hidden && (item.children )" class="menu-li">
    <template v-if="hasOneShowingChild(item.children,item)&&!item.alwaysShow">
      <span :class="{'notAllowed':onlyOneChild.meta.notAllowed}" @click="goPath(onlyOneChild)">{{ onlyOneChild.meta.title }}</span>
    </template>
    <template v-else>
      {{ item.meta.title }}
      <ul class="submenu-ul">
        <li
          v-for="child in item.children"
          v-if="!child.hidden"
          :key="child.path"
          class="submenu-li"
          :class="{'notAllowed':child.meta.notAllowed}"
          @click="goPath(child)"
        >
          {{ child.meta.title }}
        </li>
      </ul>
    </template>
  </li>
</template>

<script>
import { mapGetters } from 'vuex'
import path from 'path'
import { isExternal } from '@/utils/validate'
// import { log } from 'util'
// import { toExternalLink } from '@/utils'
// import { getToUrl } from '@/api/common'
export default {
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    this.onlyOneChild = null
    return {
      visible: false
    }
  },
  computed: {
    ...mapGetters([
      'token'
    ]),
    isLogin() {
      const { token } = this.$store.getters
      return !!token
    },
    userInnerType() {
      return this.$store.getters.userInfo.userInnerType
    }
  },
  methods: {
    hasOneShowingChild(children = [], parent) {
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })
      // When there is only one child router, the child router is displayed by default
      if (showingChildren.length === 1) {
        return true
      }

      // Show parent if there are no child router to display
      // if (showingChildren.length === 0) {
      //   this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
      //   return false
      // }

      return false
    },
    resolvePath(routePath) {
      // let newBaePath = this.basePath
      // let newToPath = routePath
      // if (routePath.split('_')[0] === 'private') {
      //   newBaePath += '-copy'
      //   newToPath = routePath.split('_')[1]
      // }
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    },
    goPath(item) {
      const blackNames = ['ServiceManage', 'ServiceOpening', 'AcceptanceTest', 'ServiceOnline', 'InterfaceTermination', 'MyService']
      const routePath = item.path
      const notAllowed = item.meta.notAllowed
      const isAgencyTypeNoOpen = this.userInnerType && this.userInnerType.name === 'GRIP' && blackNames.indexOf(item.name) !== -1

      if (!notAllowed) {
        if (isAgencyTypeNoOpen) {
          this.$message({
            message: '当前用户为场务端用户，不可访问接口服务下相关页面!',
            type: 'warning'
          })
        } else {
          if (item.clickType) {
            const ciphertext = window.btoa(`token=${this.token}&type=${item.clickType}`)
            const href = `/cass/guide/templates/controlHome.html?${ciphertext}`
            window.open(href)
            // getToUrl().then(res => {
            //   console.log(res)
            //   if (res.code === 'ACK') {
            //     const link = res.data ? res.data : window.location.host
            //     toExternalLink(`${link}`, item.clickType, this.token)
            //   }
            // })
          } else {
            const path = this.resolvePath(routePath)
            this.$router.push(path)
          }
        }
      } else {
        if (this.isLogin) {
          this.$router.push('/home')
          // this.$message({
          //   message: '功能正在开发中，敬请期待',
          //   type: 'warning'
          // })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  // @media only screen and (min-width:1280px){
  //   .menu-li{
  //     width: 120px;
  //   }
  // }
  // @media only screen and (max-width:1280px){
  //   .menu-li{
  //     width: 10.86vw;
  //   }
  // }
  .menu-li {
    height: 63px;
    line-height: 63px;
    text-align: center;
    color: #FFFFFF;
    cursor: pointer;
    font-size: 20px;
    position: relative;
    margin: 0 10px;
    >span{
      display: inline-block;
      width: 100%;
      height: 100%;

      &.notAllowed{
        /*cursor: not-allowed;*/
        &:hover{
          background-color: #144785;
          color: white;
          font-weight: normal;
        }
      }
    }
    .submenu-ul {
      width: 260px;
      text-align: left;
      display: none;
      list-style: none;
      margin: 0;
      padding: 0;
      position: absolute;
      z-index: 100;
      border-radius:2px;
      background-color: #FFFFFF;
      box-shadow:0 1px 3px rgba(0,0,0,0.26);
      left: 0;
      top: 80%;

      .submenu-li {
        font-weight: normal;
        color: #303030;
        width: fit-content;
        margin-left: 30px;
        line-height: normal;
        margin-bottom: 25px;
        font-size: 18px;

        &:first-child {
          margin-top: 25px;
        }
        &:hover {
          color: #E5B000;
        }
        /*&.notAllowed{
          cursor: not-allowed;
        }*/
      }
    }

    &:hover {
      background-color: transparent;
      color: #E5B000;
      font-weight: bold;

      ul {
        display: block;
      }
    }
  }
</style>
