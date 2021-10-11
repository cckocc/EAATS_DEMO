<template>
  <div>
    <div class="download-main">
      <div v-if="notice.length > 1" class="top-info">
        <p>
          <img src="@/assets/icon/notice.png" alt="" />
          {{ notice }}
        </p>
      </div>
      <!-- <child operation-type="download" /> -->
      <el-tabs v-model="institutionType" @tab-click="handleClick">
        <el-tab-pane v-if="institutionTypeList.includes('00')" name="00">
          <div slot="label">
            <div class="label-img">
              <img src="@/assets/icon/market.png" alt="" />
            </div>
            <span class="tab-label">市场机构</span>
          </div>
          <Market />
        </el-tab-pane>
        <el-tab-pane v-if="institutionTypeList.includes('10')" name="10">
          <div slot="label">
            <div class="label-img">
              <img src="@/assets/icon/info.png" alt="" />
            </div>
            <span class="tab-label">信息商</span>
          </div>
          <Info />
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
// import child from '@/views/download/resources-download/components/child'
import { getNotice } from '@/api/download'
import Market from './components/market'
import Info from './components/info'
export default {
  name: 'ResourcesDownload',
  components: {
    // child
    Market,
    Info,
  },
  data() {
    return {
      institutionType: '00',
      notice: '',
    }
  },
  computed: {
    isGripUser() {
      return this.$store.getters.userInfo.userInnerType.name === 'GRIP'
    },
    institutionTypeList() {
      return this.isGripUser
        ? ['00', '10']
        : this.$store.state.user.institutionTypeList
    },
  },
  mounted() {
    if (this.institutionTypeList.length > 0) {
      this.institutionType = this.institutionTypeList[0]
    }
    this.getNotice()
  },
  methods: {
    // 获取公告
    getNotice() {
      getNotice().then((res) => {
        console.log(res, 'notice')
        this.notice = res.data
      })
    },
    handleClick(tab, event) {
      // console.log(tab, event)
    },
  },
}
</script>

<style lang="scss" scoped>
.download-main {
  background-color: #fff;
}
.top-info {
  width: 1220px;
  // height: 100px;
  height: 40px;
  // padding: 10px 0 10px 10px;
  padding-left: 10px;
  background: #edf4ff;
  border: 1px solid #94b4eb;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
  // margin-bottom: 24px;
  margin: 0 auto 24px;
  overflow-y: auto;
  overflow-x: hidden;
  img {
    width: 16px;
    // margin-right: 10px;
    margin: 11px 10px 0 0;
    float: left;
  }
  p {
    height: 38px;
    font-size: 12px;
    color: #333333;
    float: left;
    margin: 0;
    // width: 1200px;
    width: 1190px;
    // height: 15px;
    // line-height: 17px;
    line-height: 38px;
    word-break: normal;
    white-space: pre-wrap;
    word-wrap: break-word;
  }
}
.label-img {
  height: 46px;
  width: 46px;
  margin: 11px 17px 11px 234px;
  float: left;
  text-align: center;
  line-height: 58px;
}
/deep/.el-tabs__header {
  width: 1220px;
  background-color: #fff;
  margin: 0 auto;
}
/deep/.el-tabs__nav-wrap::after {
  height: 0;
}
/deep/.el-tabs__nav {
  float: unset;
  width: 100%;
}
/deep/.el-tabs__item {
  width: 50%;
  height: 70px;
  line-height: 70px;
  font-size: 20px;
  font-weight: bold;
}
/deep/.el-tabs__active-bar {
  width: 143px !important;
  left: 234px;
}
</style>
