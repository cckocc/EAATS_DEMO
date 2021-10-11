<template>
  <div class="jgisv_detail">
    <div class="top_part">
      <div class="text_info">
        <el-row>
          <el-col>
            <h3 class="insti_name">
              {{ msg.cnFullName }}
            </h3>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <span class="insti_text_left"
              >社会信用代码：<span class="content" :title="msg.cfetsInstnCd">{{
                msg.cfetsInstnCd && msg.cfetsInstnCd.length > 25
                  ? msg.cfetsInstnCd.substring(0, 24) + '...'
                  : msg.cfetsInstnCd
              }}</span></span
            >
          </el-col>
          <el-col :span="14">
            <span class="insti_text"
              >成立日期：<span class="content" :title="msg.esDate">{{
                msg.esDate && msg.esDate.length > 20
                  ? msg.esDate.substring(0, 19) + '...'
                  : msg.esDate
              }}</span></span
            >
          </el-col>
        </el-row>
        <el-row style="margin-top: 15px">
          <el-col :span="8">
            <span class="insti_text_left"
              >注册资本：<span
                class="content"
                :title="
                  msg.registCaptial ? msg.registCaptial + '万元人民币' : ''
                "
              >
                {{ getRegistCaptial() }}
              </span></span
            >
          </el-col>
          <el-col :span="14">
            <span class="insti_text"
              >人员规模：<span
                class="content"
                :title="msg.staffScale ? msg.staffScale + '人' : ''"
              >
                {{ getStaffScale() }}
              </span></span
            >
          </el-col>
        </el-row>

        <el-button plain class="back_btn" @click="backToLastPage()">
          返回ISV看板
        </el-button>
      </div>
    </div>

    <div class="mdl_part">
      <div class="list_info">
        <el-tabs v-model="activeName" @tab-click="handleClick()">
          <el-tab-pane name="marketInsti">
            <span
              slot="label"
              style="
                display: inline-block;
                width: 580px;
                padding: 0px 250px;
                margin: 10px 0px;
              "
            >
              <img
                src="~@/assets/style/attach.svg"
                style="vertical-align: middle"
              />
              市场机构</span
            >
          </el-tab-pane>
          <el-tab-pane name="information">
            <span
              slot="label"
              style="display: inline-block; width: 580px; padding: 0px 250px"
            >
              <img
                src="~@/assets/style/infor.svg"
                style="vertical-align: middle"
              />
              信息商</span
            >
          </el-tab-pane>
        </el-tabs>

        <IsvTreeSlot
          ref="tableTree"
          v-loading="tableLoading"
          :origin-data="originData"
          :table-columns="tableColumns"
          is-fold
          :compflag="isvManage"
          :edit-flag-interface="editFlagInterface"
        />
      </div>
    </div>

    <div class="bt_part">
      <div class="text_info">
        <div class="title">联系我们</div>
        <div class="info">
          <div class="left">
            <div class="name" :title="msg.contact">
              <img
                src="~@/assets/style/ISV_phonebook_icon.svg"
                class="picture"
                alt=""
              />
              {{
                msg.contact && msg.contact.length > 10
                  ? msg.contact.substring(0, 9) + '...'
                  : msg.contact
              }}
            </div>
            <div class="name" :title="msg.conMobile">
              <img
                src="~@/assets/style/phone_icon.svg"
                class="picture"
                alt=""
              />
              {{
                msg.conMobile && msg.conMobile.length > 60
                  ? msg.conMobile.substring(0, 59) + '...'
                  : msg.conMobile
              }}
            </div>
            <div class="name" :title="msg.conEmail">
              <img src="~@/assets/style/mail_icon.svg" class="picture" alt="" />
              {{
                msg.conEmail && msg.conEmail.length > 60
                  ? msg.conEmail.substring(0, 59) + '...'
                  : msg.conEmail
              }}
            </div>
            <div class="name_address" :title="msg.comAddress">
              <img
                src="~@/assets/style/ISV_address_icon.svg"
                class="picture_img"
                alt=""
              />
              <span class="address_content">
                {{
                  msg.comAddress && msg.comAddress.length > 70
                    ? msg.comAddress.substring(0, 69) + '...'
                    : msg.comAddress
                }}
              </span>
            </div>
          </div>

          <div class="right">
            <img
              src="~@/assets/style/ISV_contactus_img.svg"
              alt=""
              class="contactus"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { string } from 'jszip/lib/support'
import { reqGetInterListInsti } from '@/api/isvManagement/isv_manage'
import IsvTreeSlot from '../components-slot/isv_tree_slot'

export default {
  name: 'JgIsvDetail',

  components: {
    IsvTreeSlot,
  },

  props: ['msg'],

  data() {
    return {
      activeName: 'marketInsti',
      isvManage: 'isv_manage',
      tableLoading: false,
      originData: [],
      tableColumns: [],
      editFlagInterface: false,
    }
  },

  created() {
    this.getMenu()
  },

  methods: {
    handleClick() {
      this.getMenu()
    },

    backToLastPage() {
      this.$emit('backToLastPage')
    },

    // // 获取树节点的方法
    getMenu() {
      this.tableLoading = true
      reqGetInterListInsti({ id: this.msg.id })
        .then((res) => {
          if (this.activeName === 'information') {
            this.originData = res.data.xtree.nodeList
            this.tableColumns = res.data.xtree.headList
          } else {
            this.originData = res.data.stree.nodeList
            this.tableColumns = res.data.stree.headList
          }
          this.tableLoading = false
        })
        .catch((err) => {
          console.log(err)
          this.tableLoading = false
        })
    },
    // 注册资本展示
    getRegistCaptial() {
      if (this.msg.registCaptial) {
        if ((this.msg.registCaptial + '万元人民币').length > 20) {
          return (
            (this.msg.registCaptial + '万元人民币').substring(0, 19) + '...'
          )
        } else {
          return this.msg.registCaptial + '万元人民币'
        }
      } else {
        return ''
      }
    },
    // 人员规模展示
    getStaffScale() {
      if (this.msg.staffScale) {
        if ((this.msg.staffScale + '人').length > 15) {
          return (this.msg.staffScale + '人').substring(0, 14) + '...'
        } else {
          return this.msg.staffScale + '人'
        }
      } else {
        return ''
      }
    },
  },
}
</script>

<style lang='scss' scoped>
$mainWidth: 1220px;
// .content {
//   color: #333333;
//   overflow: hidden;
//   text-overflow: ellipsis;
// }
.top_part {
  width: 100%;
  height: 245px;
  background: #edf4ff;
  opacity: 1;
  margin-top: 30px;

  .text_info {
    width: $mainWidth;
    margin: 0px auto;
    height: 245px;
    background: url('~@/assets/style/isvdetail_bg.svg') no-repeat;
    // background-size: cover;

    .insti_name {
      width: 800px;
      height: 28px;
      font-size: 28px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      line-height: 48px;
      color: #333333;
      opacity: 1;
      margin-top: 40px;
    }

    .insti_text_left {
      // width: 320px;
      // height: 53px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      // line-height: 32px;
      color: #667baa;
      opacity: 1;
    }

    .insti_text {
      // width: 292px;
      // height: 51px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: 400;
      // line-height: 30px;
      color: #667baa;
      opacity: 1;
      // margin-left: 30px;
    }
  }
}

.mdl_part {
  margin-bottom: 20px;

  .list_info {
    width: $mainWidth;
    margin: 100px auto;
  }
}

.bt_part {
  // width: 1920px;
  width: 100%;
  height: 364px;
  // opacity: 0.2;
  background: url('~@/assets/style/ISV_contactus_bg.svg') no-repeat center;

  .text_info {
    width: $mainWidth;
    margin: 0px auto;
    .title {
      text-align: center;
      margin: 0px auto;
      padding-top: 30px;
      // width: 112px;
      height: 28px;
      font-size: 28px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      line-height: 48px;
      color: #333333;
      opacity: 1;
    }

    .info {
      position: relative;
      .left {
        width: 1112px;
        height: 208px;
        background: #ffffff;
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
        opacity: 1;
        margin-top: 67px;
        margin-left: 53px;

        .name {
          // width: 111px;
          // height: 21px;
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 22px;
          color: #333333;
          opacity: 1;
          padding-top: 20px;
          margin-left: 72px;
        }
        .name_address {
          display: flex;
          // height: 44px;
          width: 616px;
          font-size: 16px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          line-height: 22px;
          color: #333333;
          // background-color: red;
          opacity: 1;
          margin-left: 72px;
          margin-top: 20px;
          word-wrap: anywhere;
        }
      }

      .address_content {
        padding-left: 7px;
      }
      .right {
        width: 386px;
        height: 208px;
        position: absolute;
        right: 55px;
        top: 0px;
      }
    }
  }
}

.back_btn {
  height: 38px;
  border: 1px solid;
  opacity: 1;
  border-radius: 10px;
  color: #2c76d1;
  background-color: #eef3ff;
  font-size: 15px;
  margin-top: 36px;
}

.picture_img {
  justify-content: start;
}

::v-deep .el-row {
  margin-top: 20px;
}

::v-deep .el-tabs__nav {
  padding-bottom: 10px;
}
</style>
