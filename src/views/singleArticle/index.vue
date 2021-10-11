<template>
  <div>
    <div class="main">
      <div class="body">
        <div class="title">{{ noticeTitle }}</div>
        <div class="submit-date">{{ publishTs }} </div>
        <div class="content" v-html="html" />
        <div v-show="showAppendix" class="appendix">
          <div class="appendix-left"><span>{{ $t('common.file') }}:</span></div>
          <div>
            <div v-for="(item,index) in appendix" :key="index" class="appendix-content">
              <img v-if="item.suffix==='doc'" src="@/assets/icon/doc.png" alt="" class="appendix-image" width="14" height="17.5">
              <img v-if="item.suffix==='docx'" src="@/assets/icon/docx.png" alt="" class="appendix-image" width="14" height="17.5">
              <img v-if="item.suffix==='pdf'" src="@/assets/icon/pdf.png" alt="" class="appendix-image" width="14" height="17.5">
              <img v-if="item.suffix==='xls'" src="@/assets/icon/xls.png" alt="" class="appendix-image" width="14" height="17.5">
              <img v-if="item.suffix==='xlsx'" src="@/assets/icon/xlsx.png" alt="" class="appendix-image" width="14" height="17.5">
              <img v-if="item.suffix==='txt'" src="@/assets/icon/txt.png" alt="" class="appendix-image" width="14" height="17.5">
              <img v-if="item.suffix==='bmp'" src="@/assets/icon/bmp.png" alt="" class="appendix-image" width="14" height="17.5">
              <img v-if="item.suffix==='gif'" src="@/assets/icon/gif.png" alt="" class="appendix-image" width="14" height="17.5">
              <img v-if="item.suffix==='png'" src="@/assets/icon/png.png" alt="" class="appendix-image" width="14" height="17.5">
              <img v-if="item.suffix==='jpg'" src="@/assets/icon/jpg.png" alt="" class="appendix-image" width="14" height="17.5">
              <img v-if="item.suffix==='jpeg'" src="@/assets/icon/jpeg.png" alt="" class="appendix-image" width="14" height="17.5">
              <a class="attach" target="_blank" @click="downloadFile(item)">{{ item.name }}</a>
            </div>
          </div>
        </div>
        <!-- <div class="foot">
          {{ publishUserName }}
        </div>
        <div class="date">
          {{ chTime }}
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { downloadTourist } from '@/api/file'
import { fetchAnnouncement } from '@/api/announcement'
import { isNull } from '@/utils/index.js'
import { downloadFile } from '@/utils/index'
export default {
  name: 'MemberManage',
  data() {
    return {
      id: this.$route.query.id,
      html: '',
      noticeTitle: '',
      noticeType: '',
      orderNo: '',
      publishTs: '',
      publishUserName: '',
      chTime: '',
      appendix: [], // 附件
      showAppendix: false,
      previewNotice: false
    }
  },
  mounted() {
  },
  created() {
    // this.previewNotice = this.$route.query.previewNotice
    // this.id = this.$route.query.id
    this.fetchData()
  },
  methods: {
    // 文件名和id
    downloadFile(fileObj) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      // fileDownload(url).then(response => {
      //   this.download(response.data, filename)
      // }).finally(() => {
      //   loading.close()
      // })
      downloadTourist(fileObj.url).then(res => {
        loading.close()
        downloadFile(res.data, fileObj.name)
        this.$message({
          type: 'success',
          message: this.$t('upload.message.downloadSuccess')
        })
      }).catch(() => {
        loading.close()
        this.$message({
          type: 'error',
          message: this.$t('upload.message.downloadFail')
        })
      })
    },
    fetchData() {
      fetchAnnouncement(this.id).then(response => {
        this.noticeTitle = response.data.noticeTitle
        this.publishTs = response.data.publishTs
        this.publishUserName = response.data.publishUserName
        console.log('html==========>', response.data.body)
        const html = response.data.body
        // html = html.replace(/&lt;/g, '<')
        // html = html.replace(/&gt;/g, '>')
        this.html = html
        this.orderNo = response.data.orderNo
        var date = response.data.publishTs.split(' ')
        var tempArr = date[0].split('-')
        this.chTime = tempArr[0] + '年' + tempArr[1].replace(/\b(0+)/gi, '') + '月' + tempArr[2].replace(/\b(0+)/gi, '') + '日'
        console.log('file:' + response.data.noticeFileDtoList)
        if (isNull(response.data.noticeFileDtoList)) {
          this.showAppendix = false
        } else {
          this.showAppendix = true
          for (var i = 0; i < response.data.noticeFileDtoList.length; i++) {
            var tempItem = {
              name: response.data.noticeFileDtoList[i].fileName,
              url: response.data.noticeFileDtoList[i].fileId, // 通过文件id访问下载接口
              suffix: response.data.noticeFileDtoList[i].fileName.split('.').pop()
            }
            console.log('tempItem:' + JSON.stringify(tempItem))
            this.appendix.push(tempItem)
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
.content {
  img {
    max-width: 100%;
  }
}
</style>
  <style lang="scss" scoped>
  $mainWidth: 1196px;
  .attach {
      color: #2C76D1;
      &:hover {
        color: blue;
        text-decoration: underline;
      }
  }
  .main {
      display: flex;
      background-color: #E7EDF5;
      flex-direction: column;
      width: $mainWidth;
      margin: 28px auto;
      height: 100%;
      .body {
              background: rgba(255, 255, 255, 1);
              border: 1px solid rgba(223, 223, 223, 1);
              box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
              border-bottom: none;
              display: flex;
              flex-direction: column;
              align-items: center;
              padding: 0 22.5px 37px 30.5px;
              .title{
                font-size:24px;
                font-family:Microsoft YaHei;
                font-weight:bold;
                line-height:31px;
                color:rgba(48,48,48,1);
                opacity:1;
                margin-top:31px;
                width: 100%;
                word-wrap: break-word;
                word-break: break-all;
                text-align: center;
              }
              .submit-date{
                font-size:15px;
                font-family:Microsoft YaHei;
                font-weight:400;
                line-height:20px;
                color:rgba(161,161,161,1);
                opacity:1;
                margin:22px 0 19.5px 0;
              }
              .content{
                width: 100%;
                padding: 29.5px 53.5px 0 53.5px;
                background:rgba(255,255,255,1);
                border-top:1px solid rgba(223,223,223,1);
                opacity:1;
                word-wrap: break-word;
                width: 100%;
                word-wrap: break-word;
              }
              .foot{
                font-size:15px;
                font-family:Microsoft YaHei;
                font-weight:400;
                line-height:28px;
                color:rgba(48,48,48,1);
                opacity:1;
                align-self: flex-end;
                margin-right:61.5px;
                margin-top:40px;
              }
              .appendix{
                margin-top:40px;
                align-self: flex-start;
                margin-left:53.5px;
                display:flex;
                justify-content: row;
                .appendix-left{
                  margin-right:10px;
                }
                .appendix-content{
                  margin-bottom:5px;
                  display:flex;
                  .appendix-image{
                    margin-right:5px;
                  }
                }
              }
              .date{
                height:20px;
                font-size:15px;
                font-family:Microsoft YaHei;
                font-weight:400;
                line-height:28px;
                color:rgba(48,48,48,1);
                opacity:1;
                align-self: flex-end;
                margin-right:61.5px;
              }

          }
  }
  </style>

