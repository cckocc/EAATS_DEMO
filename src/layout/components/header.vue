<template>
  <div class="header">
    <div class="header-main">
      <!--<hamburger
        v-if="device === 'mobile'"
        id="hamburger-container"
        :is-active="sidebar.opened"
        class="hamburger-container"
        @toggleClick="toggleSideBar" />-->
      <Logo />
      <Nav />
      <div class="header-main-right">
        <News v-if="isLogin && language !== 'en'" class="mr10" />
        <lang-select class="set-language mr10" />
        <div class="user">
          <el-popover
            v-if="!token"
            placement="bottom"
            title=""
            :visible-arrow="false"
            trigger="hover"
          >
            <div slot="reference" class="user-icon">
              <span>
                <img src="@/assets/icon/avatar.png" alt="">
              </span>
            </div>
            <div class="login-mes">
              <div>{{ $t('header.loginOrRegister') }}</div>
              <div>
                <el-button
                  type="primary"
                  size="mini"
                  @click="login"
                >{{ $t('route.login') }}</el-button>
                <el-button
                  type="primary"
                  size="mini"
                  @click="register"
                >{{ $t('route.register') }}</el-button>
              </div>
            </div>
          </el-popover>

          <el-dropdown
            v-else
            placement="bottom"
            class="avatar-container right-menu-item hover-effect"
            trigger="click"
          >
            <div class="login-in">
              <div class="user-icon">
                <span class="login">
                  <img src="@/assets/icon/avatar-login.png" alt="">
                </span>
              </div>
              <span class="username">{{ name }}</span>
              <i class="el-icon-caret-bottom" />
            </div>

            <el-dropdown-menu slot="dropdown" style="width: 240px">
              <template>
                <router-link
                  v-if="isOrgUser && checkPermission(organRoles) && language !== 'en'"
                  to="/organ-basicinfo"
                >
                  <el-dropdown-item>机构信息</el-dropdown-item>
                </router-link>
                <!-- 2.1.2版本Isv模块隐藏 -->
                <div
                  v-if="getUserRoles() && language !== 'en'"
                  class="increase_style_son"
                  @click="routerToISV"
                >
                  ISV管理
                </div>
                <router-link
                  v-if="isOrgUser && language !== 'en'"
                  to="/jg-statistic-query"
                >
                  <el-dropdown-item>统计查询</el-dropdown-item>
                </router-link>
                <router-link v-if="isOrgAdmin && checkPermission(userRoles) && language !== 'en'" to="/user-manage">
                  <el-dropdown-item>用户管理</el-dropdown-item>
                </router-link>
                <router-link
                  v-if="checkPermission(personRoles)"
                  :to="isOrgUser ? '/personal-center' : '/personal-center/persion_index'"
                >
                  <el-dropdown-item>{{ $t('header.personalCenter') }}</el-dropdown-item>
                </router-link>
              </template>
              <el-dropdown-item @click.native="logout">
                <span style="display: block">{{ $t('header.exit') }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Nav from './nav'
import Logo from './logo'
import News from './news'
import LangSelect from '@/components/LangSelect'
import { mapGetters } from 'vuex'
import checkPermission from '@/utils/permission'
// import Hamburger from '@/components/Hamburger'

export default {
  // name:'header',
  components: {
    Nav,
    News,
    Logo,
    LangSelect
    // Hamburger
  },
  data() {
    return {
      personRoles: ['AGENCY_userCenter', 'GRIP_userCenter', 'admin'],
      userRoles: ['AGENCY_systemMgtUser', 'admin'],
      organRoles: ['AGENCY_institutionBaseInfo', 'admin'],
      isvRoles: ['GRIP_MENU_ISV_MSG_MANGER', 'admin'],
      getUserRolesa: false
    }
  },
  computed: {
    ...mapGetters(['name', 'token', 'sidebar', 'avatar', 'device', 'userInfo']),
    isLogin() {
      // const { token } = this.$store.getters
      // return !!token
      return this.userInfo.id
    },
    isOrgUser() {
      return this.userInfo && this.userInfo.userInnerType && this.userInfo.userInnerType.code === '00'
    },
    isOrgAdmin() {
      return this.userInfo.roleType.name === 'AGENCY_ADMIN'
    },
    language() {
      return this.$store.getters.language
    }
  },
  methods: {
    getUserRoles() {
      var Roles = this.$store.getters.userInfo
      var flag = false
      // console.log('权限12123', Roles)
      if (Roles.userInnerType && Roles.userInnerType.code === '00') {
        if (Roles.roleType && Roles.roleType.code === 'agency-admin') {
          if (Roles.instnIdentity.indexOf('15') != '-1') {
            flag = true
          }
        }
      }
      // console.log('权限', Roles)
      return flag
      // this.getUserRolesa=flag
    },
    // isv管理
    // jump() {
    //   // this.$router.push('organ-basicinfo')
    //   this.$router.push({ name: 'organBasicinfo' })
    // },
    routerToISV() {
      // this.$router.push({path:'jgIsv_manage'})
      this.$router.push({ name: 'jgIsv_manage' })
    },
    // jump3() {
    //   // this.$router.push({name:'JgMarketInstiStatistic'})
    // },
    checkPermission,
    login() {
      this.$router.push({
        path: '/login'
      })
    },
    register() {
      this.$router.push({
        path: '/register'
      })
    },
    async logout() {
      await this.$store.dispatch('user/logout')
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    }
  }
}
</script>
<style lang="scss" scoped>
a,
a:focus,
a:hover {
  cursor: pointer;
  color: inherit;
  text-decoration: none;
}
$bg: #144785;
$mainWidth: 1243px;
.header-main {
  width: $mainWidth;
}
// @media only screen and (min-width:1243px){
//   .header-main{
//     width: $mainWidth;
//   }
// }
// @media only screen and (max-width:1243px){
//   .header-main{
//     width: 100vw;
//   }
// }
#hamburger-container {
  display: flex;
  align-items: center;
}
.el-popover {
  .login-mes {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #ffffff;

    > div {
      &:first-child {
        margin: 10px 0;
        color: #cccccc;
      }

      .el-button--primary {
        background-color: #2a71c8;
      }
    }
  }
}

.el-dropdown-menu {
  width: 195px;
  padding-top: 25px;
  border-radius: 0;
  box-shadow: 0 1px 3px rgba(100, 100, 100, 0.3);
  &.el-popper[x-placement^='bottom'] {
    margin-top: 5px;
    ::v-deep.popper__arrow {
      display: none;
    }
  }

  .el-dropdown-menu__item {
    color: #303030;
    font-size: 20px;
    height: 26px;
    line-height: 26px;
    padding-left: 30px;
    margin-bottom: 25px;
    &:hover {
      color: #2c76d1;
      background-color: transparent;
    }
  }
}

.header {
  height: 107px;
  background-color: $bg;

  .header-main {
    /*width: $mainWidth;*/
    margin: 0 auto;
    display: flex;
    flex-direction: row;
    height: 100%;
    &-right {
      margin-left: auto;
      display: flex;
    }
    .user {
      flex: 1;
      display: flex;
      align-items: flex-end;
      justify-content: center;
      margin-bottom: 10px;
      position: relative;

      .user-icon {
        width: 52px;
        height: 52px;
        border: 1px solid rgba(203, 226, 255, 0.26);
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        &:hover .login-mes {
          display: flex;
        }

        span {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          background: rgba(42, 113, 200, 1);
          border-radius: 50%;
          opacity: 1;
          color: #ffffff;
          font-size: 30px;
          text-align: center;
          img {
            width: 24px;
            height: 26px;
          }
          &.login {
            background-color: #6486af;
            align-items: flex-end;
            img {
              width: 31.6px;
              height: 35.6px;
            }
          }
        }
      }

      .login-in {
        display: flex;
        flex-direction: row;
        align-items: center;
        cursor: pointer;
        .username {
          font-size: 20px;
          font-weight: 400;
          color: rgba(255, 255, 255, 1);
          margin: 0 8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        > i {
          color: #ffffff;
        }
      }
    }
  }
}

.increase_style {
  color: #303030;
  font-size: 20px;
  height: 26px;
  line-height: 26px;
  padding-left: 30px;
  margin-bottom: 25px;
  cursor: pointer;
}

.increase_style_son {
  color: #303030;
  font-size: 20px;
  height: 26px;
  line-height: 26px;
  padding-left: 32px;
  margin-bottom: 25px;
  cursor: pointer;
}
.increase_style_son:hover {
  color: #2c76d1;
}
.set-language {
  display: flex;
  align-items: center;
  margin-top: 40px;
  font-size: 30px;
  color: #fff;
}
</style>
