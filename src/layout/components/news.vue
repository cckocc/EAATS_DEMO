<template>
  <div class="news-panel">
    <el-dropdown trigger="click">
      <el-badge class="item" :value="newsNum" @click.native="handClick">
        <i class="el-icon-bell" />
      </el-badge>
      <el-dropdown-menu slot="dropdown">
        <div id="scrollMenu" ref="scrollMenu" class="scroll-div">
          <el-dropdown-item class="clearfix">
            <div v-if="newsData.length === 0" class="no-news">暂无消息提醒</div>
            <div v-for="(item, index) in newsData" :key="index" class="top-title">
              <div class="circle" />
              <div class="news-item">
                服务编号
                <span class="span-color">{{ item.content }}</span>，状态有变动，详情请至
                <span class="span-color">{{ item.body }}</span>模块查看
                <div class="date">{{ item.time }}</div>
                <div class="line" />
              </div>
            </div>
          </el-dropdown-item>
        </div>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import gripManageApi from '@/api/gripManageApi'
export default {
  data() {
    return {
      newsNum: '',
      newsData: [],
      webSocket: '',
      connectTime: 0,
      timer: null
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {
    // this.initWebSocket()
    this.getNews()
    this.timer = setInterval(() => {
      this.getNews()
    }, 30000)
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  destroyed() { // 销毁监听
    this.websocketClose()
    // this.$nextTick(() => {
    //   if (this.$refs.scrollMenu) {
    //     this.$refs.scrollMenu.removeEventListener('scrοll', this.handleScroll, true)
    //   }
    // })
  },
  methods: {
    handClick() {
      if (this.newsNum !== '') {
        this.getNewsList()
      } else {
        this.newsData = []
      }
    },
    getNews() {
      const params = {
        currUserId: this.userInfo.id
      }
      gripManageApi.getNewsNum(params).then(res => {
        this.newsNum = res.data ? res.data : ''
        this.$store.dispatch('app/setMessage', this.newsNum)
      })
    },
    getNewsList() {
      this.newsData = []
      gripManageApi.getNewsList().then(res => {
        this.newsData = res.data
        this.newsNum = ''
        this.$store.dispatch('app/setMessage', '')
      })
    },
    async initWebSocket() {
      const { token } = this.$store.getters
      if (!token) {
        return
      }
      if (typeof (WebSocket) === 'undefined') {
        this.$message({
          message: '当前浏览器无法接收实时消息',
          type: 'warning'
        })
      } else {
        this.connectTime++
        // const socketUrl = `ws://172.20.131.134:8080/cass/connectWebSocket/` + this.userInfo.id
        const socketUrl = `ws://${window.location.host}/cassmgt/connectWebSocket/` + this.userInfo.id
        this.webSocket = new WebSocket(socketUrl)
        this.webSocket.onopen = this.websocketOnopen
        this.webSocket.onmessage = this.websocketOnmessage
        if (this.connectTime < 5) { // 设置失败重连的次数
          this.webSocket.onerror = this.websocketOnerror
        }
      }
    },
    async websocketOnopen() { // 连接建立之后执行send方法发送数据
      // console.log('WebSocket连接成功')
    },
    websocketOnerror(e) { // 连接建立失败重连
      console.log(`WebSocket连接失败`, e)
      setTimeout(() => {
        this.initWebSocket()
      }, 5000)
    },
    async websocketOnmessage(e) { // 数据接收
      this.newsSocket = e.data
      if (this.newsSocket === 'NEW_MESSAGE') {
        const num = await gripManageApi.getNewsNum()
        this.newsNum = num.data
        if (this.newsNum === 0) {
          this.newsNum = ''
        }
        if (this.$route.path === '/field-management/process-view') { // 如果消息提醒时在流程查看页面，更新数据
          this.$router.push(`process-view?redirect=${this.$route.fullPath}`)
        }
        if (this.$route.path === '/service-application/my-service') { // 如果消息提醒时在我的服务页面，更新数据
          this.$router.push(`my-service?redirect=${this.$route.fullPath}`)
        }
      }
    },
    websocketSend(Data) { // 数据发送
      this.webSocket.send(Data)
    },
    websocketClose() { // 关闭
      console.log('断开webSocket连接')
    }
  }
}
</script>

<style lang="scss" scoped>
.news-panel {
  display: flex;
  align-items: center;
  margin-right: 30px;
  margin-top: 40px;
  flex: 1;
  justify-content: flex-end;
  .el-icon-bell {
    font-size: 30px;
    color: #fff;
  }
  ::v-deep .el-badge__content.is-fixed {
    position: absolute;
    top: 3px;
    right: 12px;
  }
  ::v-deep .el-badge__content {
    border: none;
  }
}
.el-dropdown-menu {
  left: 63% !important;
  padding: 0;
  // border-radius:3px;
  box-shadow:0 1px 3px rgba(0,0,0,0.26);
  margin-top: 6px;
  .scroll-div {
    width: 408px;
    max-height: 500px;
    overflow-y: auto;
  }
  ::v-deep .el-dropdown-menu__item {
    font-size: 15px;
    color: #303030;
  }
  ::v-deep .el-dropdown-menu__item:not(.is-disabled):hover {
    background-color: #fff;
  }
  ::v-deep.popper__arrow {
    top: 0;
    left: 340px!important;
    border-bottom-color: #fff;
  }
  a {
    display: inline;
  }
  .no-news {
    color: #303030;
    font-size: 16px;
  }
  .top-title {
    display: flex;
    flex-direction: row;
    &:last-child {
      .line {
        display: none;
      }
    }
  }
  .circle {
    width: 8px;
    height: 8px;
    background-color: red;
    border-radius: 50%;
    margin-top: 15px;
    margin-right: 10px;
  }
  .date {
    font-size: 14px;
    color: #666;
  }
  .line {
    height: 1px;
    background: #E6E6E6;
    // border: 1px solid #E6E6E6;
    margin-top: 10px;
    margin-right: -17px;
    margin-left: -35px;
  }
  .news-item {
    line-height: 22px;
    margin-top: 10px;
    .span-color {
      color: #2c76d1
    }
  }
}
</style>
