<template>
  <div v-loading="loading">
    <div class="personal-center">
      <div class="center">
        <div class="avatar">
          <div class="user">
            <div>
              <img src="@/assets/icon/avatar-login.png" alt="">
            </div>
          </div>
          <div>
            <span>用户名</span>
            <span>{{ userInfo.loginName }}</span>
          </div>
        </div>
        <div class="collapse">
          <div class="collapse-item">
            <div class="header">
              <div class="header-left">
                <img src="@/assets/icon/user.png" alt="">
              </div>
              <div class="header-right">
                <div class="title">
                  <span class="title-l">姓名、座机 </span>
                </div>
                <div class="btn">
                  <template v-if="isBinding(userInfo.telNo)">
                    <img src="@/assets/icon/right.png" alt="">
                    <el-button type="text" class="btn-set">已设置</el-button>
                    <el-divider direction="vertical" />
                  </template>
                  <el-button type="text" class="btn-collapse" @click="ishow4 = !ishow4">{{ ishow4 ? '收起':'编辑' }}</el-button>
                </div>
              </div>
            </div>
            <el-collapse-transition>
              <Name v-if="ishow4" :user-info="userInfo" :port="port" @getUserInfo="getUserInfo" />
            </el-collapse-transition>
          </div>
          <div class="collapse-item">
            <div class="header">
              <div class="header-left">
                <img src="@/assets/icon/password.png" alt="">
              </div>
              <div class="header-right">
                <div class="title">
                  <span class="title-l">密码</span>
                </div>
                <div class="btn">
                  <img src="@/assets/icon/right.png" alt="">
                  <el-button type="text" class="btn-set">已设置</el-button>
                  <el-divider direction="vertical" />
                  <el-button type="text" class="btn-collapse" @click="ishow = !ishow">{{ ishow ? '收起':'编辑' }}</el-button>
                </div>
              </div>
            </div>
            <el-collapse-transition>
              <Password v-show="ishow" :user-info="userInfo" :port="port" />
            </el-collapse-transition>
          </div>
          <div class="collapse-item">
            <div class="header">
              <div class="header-left">
                <img src="@/assets/icon/phone.png" alt="">
              </div>
              <div class="header-right">
                <div class="title">
                  <span class="title-l">绑定手机</span>
                  <span class="title-r">{{ userInfo.phoneNo }}</span>
                </div>
                <div class="btn">
                  <template v-if="isBinding(userInfo.phoneNo)">
                    <img src="@/assets/icon/right.png" alt="">
                    <el-button type="text" class="btn-set">已绑定</el-button>
                    <el-divider direction="vertical" />
                  </template>
                  <el-button type="text" class="btn-collapse" @click="ishow2 = !ishow2">{{ ishow2 ? '收起':'编辑' }}</el-button>
                </div>
              </div>
            </div>
            <el-collapse-transition>
              <Phone v-show="ishow2" :user-info="userInfo" :port="port" @getUserInfo="getUserInfo" />
            </el-collapse-transition>
          </div>
          <div class="collapse-item">
            <div class="header">
              <div class="header-left">
                <img src="@/assets/icon/email.png" alt="">
              </div>
              <div class="header-right">
                <div class="title">
                  <span class="title-l">绑定邮箱</span>
                  <span class="title-r">{{ userInfo.email }}</span>
                </div>
                <div class="btn">
                  <template v-if="isBinding(userInfo.email)">
                    <img src="@/assets/icon/right.png" alt="">
                    <el-button type="text" class="btn-set">已绑定</el-button>
                    <el-divider direction="vertical" />
                  </template>
                  <el-button type="text" class="btn-collapse" @click="ishow3 = !ishow3">{{ ishow3 ? '收起':'编辑' }}</el-button>
                </div>
              </div>
            </div>
            <el-collapse-transition>
              <Email v-show="ishow3" :user-info="userInfo" :port="port" @getUserInfo="getUserInfo" />
            </el-collapse-transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ElCollapseTransition from 'element-ui/lib/transitions/collapse-transition'
import Password from './components/password'
import Phone from './components/phone'
import Email from './components/email'
import Name from './components/name'
import { getUserInfo } from '@/api/personalCenter'
export default {
  name: 'PersonalCenter',
  components: {
    ElCollapseTransition,
    Password,
    Phone,
    Email,
    Name
  },
  data() {
    return {
      ishow: false,
      ishow2: false,
      ishow3: false,
      ishow4: false,
      loading: false,
      userInfo: {}
    }
  },
  computed: {
    userId() {
      return this.$store.getters.userId
    },
    port() {
      const { code } = this.$store.getters.userInfo.roleType
      if (code === 'grip-admin' || code === 'grip-user' || code === 'super-admin') {
        return 'grip'
      } else {
        return 'agency'
      }
    }
  },
  created() {
    this.getUserInfo()
  },
  methods: {
    isBinding(str) {
      return !(str == null || str === '' || str === undefined || !str)
    },
    async getUserInfo() {
      try {
        this.loading = true
        const r = await getUserInfo(this.userId, this.port)
        this.userInfo = r.data
      } catch (e) {
        console.log(e)
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
  .personal-center{
    .center{
      width: 1236px;
      background-color: #FFFFFF;
      border:1px solid rgba(223,223,223,1);
      box-shadow:0px 3px 6px rgba(0,0,0,0.06);
      margin: 28px auto;
      padding: 57px 58px 60px 57px;
      .avatar{
        display: flex;
        align-items: center;
        flex-direction: row;
        margin-bottom: 39px;
        .user{
          width: 74px;
          height: 74px;
          border-radius: 50%;
          margin-right: 13px;
          border:1px solid #C7DBF2;
          display: flex;
          align-items: center;
          justify-content: center;
          >div{
            display: flex;
            align-items: flex-end;
            justify-content: center;
            width: 62px;
            height: 62px;
            background:#B7D0EF;
            border-radius: 50%;
            img{
              width: 45px;
              height: auto;
            }
          }
        }
        >div{
          display: flex;
          flex-direction: column;
          span{
            &:first-child{
              height:20px;
              font-size:15px;
              font-weight:400;
              line-height:20px;
              color:rgba(180,180,180,1);
            }
            &:last-child{
              height:31px;
              font-size:24px;
              font-weight:bold;
              line-height:31px;
              color:rgba(44,118,209,1);
            }
          }
        }
      }

      .collapse{
        .collapse-item{
          background:rgba(250,251,253,1);
          border:1px solid rgba(234,237,242,1);
          opacity:1;
          &:not(:last-child){
            margin-bottom: 22px;
          }

          .header{
            display: flex;
            flex-direction: row;
            .header-left{
              width:77px;
              height:74px;
              background:rgba(236,239,249,1);
              display: flex;
              align-items: center;
              justify-content: center;
              img{
                width: 39px;
                height: auto;
              }
            }
            .header-right{
              display: flex;
              flex: 1;
              flex-direction: row;
              justify-content: space-between;
              padding: 0 20px;

              .title{
                display: flex;
                align-items: center;
                span{
                  &.title-l{
                    font-size:16px;
                    font-weight:bold;
                    color:rgba(48,48,48,1);
                  }
                  &.title-r{
                    font-size:16px;
                    font-weight:bold;
                    color:rgba(44,118,209,1);
                    margin-left: 13px;
                  }
                }
              }

              .btn{
                display: flex;
                align-items: center;
                img{
                  width: 20px;
                  height: auto;
                  margin-right: 5px;
                }
                .btn-set{
                  color: #02A40D;
                  font-size: 14px;
                  font-weight:400;
                }
                .btn-collapse{
                  color: #2C76D1;
                  font-size: 14px;
                  font-weight:400;
                }
              }
            }
          }
        }
      }
    }
  }
</style>
