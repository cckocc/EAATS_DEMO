<template>
  <el-popover
    placement="right"
    width="500"
    trigger="click"
  >
    <div class="user-name">{{ showUserObj.sName }}</div>
    <div class="user-row">
      <div class="user-row-img">
        <img src="@/assets/style/user-department.png">
      </div>
      <div class="user-row-text">{{ showUserObj.instnDepartment }}</div>
    </div>
    <div class="user-row">
      <div class="user-row-img">
        <img src="@/assets/style/user-phone.png">
      </div>
      <div class="user-row-text">{{ showUserObj.phoneNo }}</div>
    </div>
    <div class="user-row">
      <div class="user-row-img">
        <img src="@/assets/style/user-mail.png">
      </div>
      <div class="user-row-text">{{ showUserObj.email }}</div>
    </div>
    <span slot="reference" class="link-type" @click="showUserDetail">{{ userName }}</span>
  </el-popover>
</template>

<script>
import { getOrgUserInfo } from '@/api/myServiceApi'
export default {
  name: 'UserCard',
  props: {
    value: {
      type: String,
      default: ''
    },
    userName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      showUserObj: {
        visible: true,
        sName: '',
        phoneNo: '',
        email: '',
        instnDepartment: ''
      }
    }
  },
  methods: {
    showUserDetail() {
      const params = {
        userId: this.value
      }
      getOrgUserInfo(params).then(res => {
        if (res.code === 'ACK') {
          this.showUserObj = {
            visible: true,
            sName: res.data.sName,
            phoneNo: res.data.phoneNo,
            email: res.data.email,
            instnDepartment: res.data.instnDepartment
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .user-name {
    font-size: 20px;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #364C67;
  }
  .user-row {
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #333333;
    margin-top: 10px;
    display: flex;
    align-items: center;
    word-wrap: break-word;
    word-break: break-all;
    &-img {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 10px;
      width: 24px;
      height: 24px;
      box-shadow: 0px 0px 6px rgba(0, 114, 255, 0.2);
      border-radius: 50%;
    }
    &-text {
      flex: 1;
    }
  }
</style>
