<template>
  <div>
    <div class="main">
      <div class="notice">
        <div class="notice-panel">
          <div class="notice-main">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane name="BIG_NEWS">
                <span slot="label" class="head">{{ $t('notice.news') }}</span>
                <div v-if="showFirst" class="body">
                  <div v-for="(item,index) in firstList" :key="index" @click="noticeDetail(item)">
                    <!-- <router-link class="link-a" :to="{name:'singleArticle',query:{id:item.id,title:item.noticeTitle}}">
                      <span class="title">{{ item.noticeTitle }}</span>
                    </router-link> -->
                    <span class="width90">{{ item.noticeTitle }}</span>
                    <span>{{ item.publishTs.split(' ')[0] }}</span>
                  </div>
                </div>
                <div v-else class="pane-empty"><span>{{ $t('common.noInformationData') }}</span></div>
              </el-tab-pane>
              <el-tab-pane name="BUSINESS_NOTICE">
                <span slot="label" class="head">{{ $t('notice.businessNotice') }}</span>
                <div v-if="showSecond" class="body">
                  <div v-for="(item,index) in secondList" :key="index" @click="noticeDetail(item)">
                    <!-- <router-link class="link-a" :to="{name:'singleArticle',query:{id:item.id,title:item.noticeTitle}}">
                      <span class="title">{{ item.noticeTitle }}</span>
                    </router-link> -->
                    <span class="width90">{{ item.noticeTitle }}</span>
                    <span>{{ item.publishTs.split(' ')[0] }}</span>
                  </div>
                </div>
                <div v-else class="pane-empty"><span>{{ $t('common.noInformationData') }}</span></div>
              </el-tab-pane>
              <el-tab-pane name="TEST_NOTICE">
                <span slot="label" class="head">{{ $t('notice.testNotice') }}</span>
                <div v-if="showthird" class="body">
                  <div v-for="(item,index) in thirdList" :key="index" @click="noticeDetail(item)">
                    <!-- <router-link class="link-a" :to="{name:'singleArticle',query:{id:item.id,title:item.noticeTitle}}">
                      <span class="title">{{ item.noticeTitle }}</span>
                    </router-link> -->
                    <span class="width90">{{ item.noticeTitle }}</span>
                    <span>{{ item.publishTs.split(' ')[0] }}</span>
                  </div>
                </div>
                <div v-else class="pane-empty"><span>{{ $t('common.noInformationData') }}</span></div>
              </el-tab-pane>
              <el-tab-pane name="search" disabled stretch>
                <div slot="label" class="search-input">
                  <el-input
                    v-model.trim="input"
                    v-limitBytes="300"
                    :placeholder="$t('notice.placeholder')"
                    style="width: 240px;"
                  ><img slot="suffix" src="@/assets/icon/search.png" alt="" class="search-icon" @click="search"></el-input>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
          <div class="block">
            <el-pagination
              :current-page="currentPage"
              :page-sizes="pageSizeList"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalPage"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { fetchList } from '@/api/announcement'
import { isNull } from '@/utils/index.js'
export default {
  name: 'MemberManage',
  data() {
    return {
      input: '',
      currentPage: 1,
      pageSize: 20,
      totalPage: 0,
      pageSizeList: [20, 50, 100],
      activeName: 'BIG_NEWS',
      firstList: null,
      showFirst: false,
      secondList: null,
      showSecond: false,
      thirdList: null,
      showthird: false
    }
  },
  created() {
    this.fetchData()
    this.$route.matched[0].meta.title = ''
  },
  methods: {
    noticeDetail(item) {
      const { noticeTitle, id } = item
      this.$router.push({
        name: 'singleArticle',
        query: {
          id,
          title: noticeTitle
        }
      })
    },
    fetchData() {
      const params = {
        page: this.currentPage,
        pageSize: this.pageSize,
        noticeType: this.activeName,
        keywords: ''
      }
      fetchList(params).then(response => {
        if (response.data != null) {
          if (this.activeName === 'BIG_NEWS') {
            if (!isNull(response.data.list) && response.data.totalRecord > 0) {
              this.firstList = response.data.list
              this.totalPage = response.data.totalRecord
              this.showFirst = true
            } else {
              this.totalPage = response.data.totalRecord
              this.showFirst = false
            }
          } else if (this.activeName === 'BUSINESS_NOTICE') {
            if (!isNull(response.data.list) && response.data.totalRecord > 0) {
              this.secondList = response.data.list
              this.totalPage = response.data.totalRecord
              this.showSecond = true
            } else {
              this.totalPage = response.data.totalRecord
              this.showSecond = false
            }
          } else if (this.activeName === 'TEST_NOTICE') {
            if (!isNull(response.data.list) && response.data.totalRecord > 0) {
              this.thirdList = response.data.list
              this.totalPage = response.data.totalRecord
              this.showthird = true
            } else {
              this.totalPage = response.data.totalRecord
              this.showthird = false
            }
          }
        }
      })
    },
    handleClick(tab, event) { // 标签页切换
      this.currentPage = 1
      this.input = ''
      this.totalPage = 0
      this.fetchData()
    },
    handleSizeChange(val) { // 页面容量切换
      this.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) { // 当前页切换
      this.currentPage = val
      this.fetchData()
    },
    search() { // 根据关键词搜索
      this.currentPage = 1
      const params = {
        page: this.currentPage,
        pageSize: this.pageSize,
        keywords: this.input,
        noticeType: this.activeName
      }
      fetchList(params).then(response => {
        if (response.data != null) {
          if (this.activeName === 'BIG_NEWS') {
            if (!isNull(response.data.list) && response.data.totalRecord > 0) {
              this.firstList = response.data.list
              this.totalPage = response.data.totalRecord
              this.showFirst = true
            } else {
              this.totalPage = response.data.totalRecord
              this.showFirst = false
            }
          } else if (this.activeName === 'BUSINESS_NOTICE') {
            if (!isNull(response.data.list) && response.data.totalRecord > 0) {
              this.secondList = response.data.list
              this.totalPage = response.data.totalRecord
              this.showSecond = true
            } else {
              this.totalPage = response.data.totalRecord
              this.showSecond = false
            }
          } else if (this.activeName === 'TEST_NOTICE') {
            if (!isNull(response.data.list) && response.data.totalRecord > 0) {
              this.thirdList = response.data.list
              this.totalPage = response.data.totalRecord
              this.showthird = true
            } else {
              this.totalPage = response.data.totalRecord
              this.showthird = false
            }
          }
        }
      })
    }
  }
}
</script>

<!--[if IE]>
<style lang="scss" scoped>
.block {
  margin-top: -10px !important;
}
</style>
<![endif]-->

<style lang="scss" scoped>
  $mainWidth: 1196px;

  .main {
    display: flex;
    flex-direction: column;
    width: $mainWidth;
    margin: 28px auto;
    height: 100%;

    .notice {
      display: flex;
      padding: 0 0 27px 0;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;

      .notice-main {
        ::v-deep .el-tabs__nav {
          width: 100%;
          #tab-search {
            float: right;
          }
        }
        ::v-deep .el-tabs{
          border-bottom: none;
        }
        ::v-deep .el-tabs__content{
          border-bottom:1px solid rgba(209,213,222,1);
          padding-bottom: 21px;
        }
        .searchbtn{
          padding: 10px 5px 10px 0;
        }
        .search-icon{
          margin: 5px;
        }
        .width90 {
          width: 90%;
        }

        .head{
          font-size:22px;
          font-family:Microsoft YaHei;
          font-weight:400;
          line-height:29px;
          color:rgba(48,48,48,1);
          opacity:1;
        }

        ::v-deep.el-tabs__item {
          line-height: 20px;
        }
        ::v-deep.el-tabs__item.is-active {
          .head{
            font-size:22px;
            font-family:Microsoft YaHei;
            font-weight:bold;
            line-height:29px;
            color:rgba(44,118,209,1);
            opacity:1;
          }
        }
        ::v-deep .el-tabs__active-bar {
          width:151px;
          height:4px;
          background:rgba(44,118,209,1);
          opacity:1;
        }

        width: $mainWidth;

        >div {
          box-sizing: border-box;
          background: rgba(255, 255, 255, 1);
          border: 1px solid rgba(223, 223, 223, 1);
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
          border-top: none;
          padding: 27px 30px 0px 23px;
          opacity: 1;

          .body {
            >div {
              display: flex;
              flex-direction: row;
              justify-content: space-between;
              cursor: pointer;
              align-items: center;
              padding: 0 9px 0 23px;
              font-size: 16px;
              color: #303030;
              height: 40px;
              position: relative;

              &:nth-child(even) {
                background-color: #FBFBFC;
              }

              .title{
                &:first-child{
                  &::after {
                    content: "";
                    display: inline-block;
                    width: 5px;
                    height: 5px;
                    border-radius: 50%;
                    background-color: #2C76D1;
                    position: absolute;
                    left: 9px;
                    top: 50%;
                    margin-top: -2.5px;
                  }
                }
              }

            }
          }
        }
      }
      .block {
        background: rgba(255, 255, 255, 1);
        border: 1px solid rgba(223, 223, 223, 1);
        box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
        border-top: none;
        padding: 25px 23px 28px 10px;
        display: flex;
        justify-content: flex-end;
        background-color: #FFFFFF;
        width: $mainWidth;
      }

    }

    .head {
      font-size: 20px;
      font-family: Microsoft YaHei;
      font-weight: normal;
      color: #303030;
    }
    .search-input{
      ::v-deep .el-input__suffix {
        cursor:pointer;
      }
    }
    .pane-empty{
      display: flex;
      justify-content: center;
      padding-top:10px;
      >span{
        color:#cecece;
      }
    }
  }
  .notice-panel {
    background-color: #fff;
  }
  .link-a {
    width: 80%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
