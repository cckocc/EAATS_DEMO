<template>
  <div class="footer">
    <div class="footer-t">
      <div class="footer-t-m">
        <div class="tm-img">
          <img src="@/assets/style/other.png" alt="">
        </div>
        <div class="tm-text">
          <div>对外接口服务系统</div>
          <div>CFETS API Service System</div>
        </div>
        <div style="display: none" class="cass-version">v2.1.3.3</div>
      </div>
      <div v-if="language !== 'en'" class="mb10">客服热线：4009787878转5</div>
    </div>
    <div class="footer-b">
      <div class="footer-b-m">
        <!--<div class="bm-t">
          <div>网站地图</div>
          <div>法律声明</div>
          <div>用户反馈</div>
          <div>联系我们</div>
        </div>-->
        <div class="bm-t">
          <div>{{ $t('footer.externalLinks') }}：</div>
          <div
            v-for="item in urlList"
            :key="item.linkName"
            class="link"
            @click="toFriendUrl(item.linkAddress)"
          >
            {{ item.linkName }}
          </div>
          <!-- <div class="link" @click="toFriendUrl('全球LEI体系本地系统(Local Operating Unit)')">全球LEI体系本地系统（Local Operating Unit）</div>
          <div class="link" @click="toFriendUrl('中国货币网')">中国货币网</div>
          <div class="link" @click="toFriendUrl('全国金融标准化技术委员会')">全国金融标准化技术委员会</div> -->
        </div>
        <div v-if="language !== 'en'" class="bm-m">
          <div>沪ICP备05040578</div>
          <img src="@/assets/style/log-gaba.png" alt="">
          <div>沪公网安备31010102003218号</div>
        </div>
        <div class="bm-b">
          {{ $t('footer.copyright') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getFriendUrl } from '@/api/common'
export default {
  data() {
    return {
      urlList: []
    }
  },
  computed: {
    language() {
      return this.$store.getters.language
    }
  },
  created() {
    this.getFriendUrl()
  },
  methods: {
    getFriendUrl() {
      getFriendUrl().then((res) => {
        // console.log(res)
        if (res.code === 'ACK') {
          this.urlList = res.data
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    toFriendUrl(url) {
      window.open(url)
    }
  }
}
</script>
<style lang="scss" scoped>
.footer {
  background-color: #144785;
  .footer-t {
    // height: 87px;
    padding: 10px 0 0 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    color: #ffffff;
    font-size: 15px;
    .footer-t-m {
      display: flex;
      align-items: center;
      justify-content: center;
      .tm-text {
        color: #ffffff;
        div {
          &:first-child {
            font-size: 20px;
            margin-top: -5px;
            font-weight: 400;
            height: 26px;
            line-height: 26px;
            letter-spacing: 2px;
          }
          &:last-child {
            font-size: 14px;
            height: 19px;
            font-weight: 400;
            line-height: 19px;
          }
        }
      }
    }
  }
  .footer-b {
    // height: 160px;
    padding: 15px 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-size: 15px;
    .footer-b-m {
      display: flex;
      flex-direction: column;
      .bm-t {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-bottom: 20px;
        > div {
          padding: 0 20px;
          &:first-child {
            border-right: none !important;
          }
          &:not(:last-child) {
            border-right: 1px solid #ffffff;
          }
        }
        .link {
          cursor: pointer;
          &:hover {
            color: #2c76d1;
          }
        }
      }
      .bm-m {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-bottom: 18px;
        div {
          line-height: 20px;
          &:first-child {
            margin-right: 20px;
          }
        }
      }
      .bm-b {
        text-align: center;
      }
    }
  }
}
</style>
