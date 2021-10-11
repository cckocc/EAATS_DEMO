<template>
  <div class="main">
    <Banner />
    <div class="article">
      <div class="article-main">
        <div class="article-l">
          <div class="header">
            <div>{{ $t('home.notice') }}</div>
            <div @click="moreNotice">{{ $t('home.more') }}<i class="el-icon-d-arrow-right" /></div>
          </div>
          <div class="body">
            <div v-for="(item,index) in noticeList" :key="index" @click="noticeDetail(item, 'notice')">
              <span>{{ item.noticeTitle }}</span>
              <span>{{ item.publishTs | publishTsFilter }}</span>
            </div>
          </div>
        </div>
        <div class="article-r">
          <div class="header">
            <div>{{ $t('home.standardsAndSpecifications') }}</div>
            <div @click="moreStandard">{{ $t('home.more') }}<i class="el-icon-d-arrow-right" /></div>
          </div>
          <div class="body">
            <div v-for="(item,index) in sourceList" :key="index" @click="noticeDetail(item, 'standard')">
              <span>{{ item.noticeTitle }}</span>
              <span>{{ item.publishTs | publishTsFilter }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Banner from '@/layout/components/banner'
import { pageInit } from '@/api/home'
export default {
  components: {
    Banner
  },
  filters: {
    publishTsFilter(val) {
      return val.substr(0, 10)
    }
  },
  data() {
    return {
      loading: false,
      noticeList: [],
      sourceList: []
    }
  },
  computed: {
    hasToken() {
      return this.$store.getters.token
    }
  },
  created() {
    this.pageInit()
  },
  methods: {
    async pageInit() {
      try {
        this.loading = true
        const r = await pageInit()
        this.noticeList = r.data.noticeList
        this.sourceList = r.data.sourceList
      } catch (e) {
        console.log(e)
      }
      this.loading = false
    },
    moreNotice() {
      this.$router.push('/notice/index')
    },
    moreStandard() {
      this.$router.push('/standard-more')
    },
    noticeDetail(item, type) {
      const { noticeTitle, id } = item
      this.$router.push({
        name: 'singleArticle',
        query: {
          id,
          type: type,
          title: noticeTitle
        }
      })
    },
    moreSource() {
      if (this.hasToken) {
        console.log(this.hasToken)
      } else {
        this.$router.push('/login')
      }
    },
    sourceDetail(id) {
      if (this.hasToken) {
        console.log(this.hasToken)
      } else {
        this.$router.push('/login')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  @media only screen and (min-width:1243px){
    .article-main{
      width: 1243px;
    }
  }
  @media only screen and (max-width:1243px){
    .article-main{
      width: 100vw;
    }
  }
  .main {
    .article {
      display: flex;
      justify-content: center;
      background-color: #E7EDF5;
      padding: 28px 0 27px 0;

      .article-main {
        /*width: 1243px;*/
        display: flex;
        flex-direction: row;
        justify-content: space-around;

        > div {
          box-sizing: border-box;
          background: rgba(255, 255, 255, 1);
          border: 1px solid rgba(223, 223, 223, 1);
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
          padding: 0 27px;
          opacity: 1;

          .header {
            height: 70px;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #D1D5DE;
            padding: 0 9px;

            div {
              &:first-child {
                font-size: 24px;
                font-weight: bold;
                color: #303030;
              }

              &:last-child {
                font-size: 18px;
                color: #2C76D1;
                cursor: pointer;
              }
            }
          }

          .body {
            padding: 12px 0 15px 0;

            > div {
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
              >span{
                &:first-child{
                  white-space: nowrap;
                  // max-width: 550px;
                  max-width: 420px;
                  overflow: hidden;
                  text-overflow: ellipsis;
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

        .article-l {
          flex: 5;
        }

        .article-r {
          flex: 5;
          margin-left: 16px;
        }
      }

    }
  }
</style>
