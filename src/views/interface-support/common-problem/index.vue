<template>
  <div>
    <div class="main">
      <div class="content">
        <div class="header">
          <div class="title title24">常见问题</div>
          <el-input v-model.trim="keywords" placeholder="请输入关键词" maxlength="100" class="search-input">
            <img slot="suffix" src="@/assets/icon/search.png" alt="" class="search-icon" @click="search">
          </el-input>
        </div>
        <div class="problem-panel">
          <div class="title">服务开通相关常见问题</div>
          <div class="collapse">
            <el-collapse v-model="activeNames" accordion @change="handleChange">
              <el-tooltip
                v-for="(item,index) in collapseData1"
                :key="index"
                placement="top"
                :open-delay="500"
                effect="dark"
                :content="item.allTitle"
                :disabled="item.title.length < 20"
              >
                <el-collapse-item :title="item.title" :name="`${'服务申请' + item.id}`" @click.native="fetchInfo('服务申请',item.id,index)">
                  <div v-if="showContent" class="collapse-content">
                    <div :class="(problemId === index && readProMore) ? 'show-body-more' : 'show-body'" v-html="item.body" />
                    <a class="read-more" @click="showMore(index)">{{ (problemId === index && readProMore) ? '收起' : '阅读更多' }}</a>
                  </div>
                </el-collapse-item>
              </el-tooltip>
            </el-collapse>
          </div>
        </div>
        <div class="problem-panel">
          <div class="title">验收测试相关常见问题</div>
          <div class="collapse">
            <el-collapse v-model="activeNames" accordion @change="handleChange">
              <el-tooltip
                v-for="(item,index) in collapseData2"
                :key="index"
                placement="top"
                :open-delay="500"
                effect="dark"
                :content="item.allTitle"
                :disabled="item.title.length < 20"
              >
                <el-collapse-item :title="item.title" :name="`${'验收测试' + item.id}`" @click.native="fetchInfo('验收测试',item.id,index)">
                  <div v-if="showContent" class="collapse-content">
                    <div :class="(problemId === index && readProMore) ? 'show-body-more' : 'show-body'" v-html="item.body" />
                    <a class="read-more" @click="showMore(index)">{{ (problemId === index && readProMore) ? '收起' : '阅读更多' }}</a>
                  </div>
                </el-collapse-item>
              </el-tooltip>
            </el-collapse>
          </div>
        </div>
        <div class="problem-panel">
          <div class="title">生产问题相关常见问题</div>
          <div class="collapse">
            <el-collapse v-model="activeNames" accordion @change="handleChange">
              <el-tooltip
                v-for="(item,index) in collapseData3"
                :key="index"
                placement="top"
                :open-delay="500"
                effect="dark"
                :content="item.allTitle"
                :disabled="item.title.length < 20"
              >
                <el-collapse-item :title="item.title" :name="`${'生产相关' + item.id}`" @click.native="fetchInfo('生产相关',item.id,index)">
                  <div v-if="showContent" class="collapse-content">
                    <div :class="(problemId === index && readProMore) ? 'show-body-more' : 'show-body'" v-html="item.body" />
                    <a class="read-more" @click="showMore(index)">{{ (problemId === index && readProMore) ? '收起' : '阅读更多' }}</a>
                  </div>
                </el-collapse-item>
              </el-tooltip>
            </el-collapse>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchtypelist, viewDetail } from '@/api/faq'
export default {
  name: 'MemberManage',
  data() {
    return {
      activeNames: [],
      problemId: '',
      keywords: '',
      showContent: false,
      readProMore: false,
      collapseData1: [],
      collapseData2: [],
      collapseData3: []
    }
  },
  created() {
    this.fetchData('服务申请')
    this.fetchData('验收测试')
    this.fetchData('生产问题')
  },
  methods: {
    showMore(index) {
      this.problemId = index
      this.readProMore = !this.readProMore
    },
    async fetchInfo(type, id, index) {
      await viewDetail(id).then(response => {
        if (type === '服务申请') {
          this.collapseData1[index].body = response.data.questContentText
        } else if (type === '验收测试') {
          this.collapseData2[index].body = response.data.questContentText
        } else if (type === '生产相关') {
          this.collapseData3[index].body = response.data.questContentText
        }
      })
      this.showContent = false
      this.showContent = true
    },
    search() {
      this.fetchData('服务申请')
      this.fetchData('验收测试')
      this.fetchData('生产问题')
    },
    handleChange(val) {
      this.readProMore = false
    },
    fetchData(type) {
      const params = {
        page: 1,
        pageSize: 10,
        keywords: this.keywords,
        questType: type
      }
      fetchtypelist(params).then(response => {
        var tempData = []
        for (var item in response.data.list) {
          var tempItem = {
            title: response.data.list[item].questTitle,
            allTitle: response.data.list[item].questAllTitle,
            id: response.data.list[item].id
          }
          tempData.push(tempItem)
        }
        if (type === '服务申请') {
          this.collapseData1 = tempData
        } else if (type === '验收测试') {
          this.collapseData2 = tempData
        } else if (type === '生产问题') {
          this.collapseData3 = tempData
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    $mainWidth: 1220px;

    .main {
        display: flex;
        background-color: #E7EDF5;
        flex-direction: column;
        width: $mainWidth;
        margin: 28px auto;
        height: 100%;

        .content {
            background: rgba(255, 255, 255, 1);
            border: 1px solid rgba(223, 223, 223, 1);
            box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
            border-bottom: none;
            padding: 25px 20px 25px 20px;
            display: flex;
            flex-direction: column;

            .title {
                font-size: 20px;
                font-family: Microsoft YaHei;
                font-weight: bold;
            }

            .title24 {
              font-size: 24px;
            }

            .header {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                padding-bottom: 15px;
                border-bottom: 1px solid rgba(209, 213, 222, 1);

                .search-input {
                    width: 300px;
                }

                .search-icon {
                    margin: 5px;
                }
            }
            .problem-panel{
                padding-top:30px;
                .collapse{
                    padding-top:15px;
                    .collapse-content{
                        display:flex;
                        flex-direction: column;
                        background:rgba(246,247,251,1);
                        .show-body-more {
                          min-height: 310px;
                        }
                        .show-body {
                          height: 310px;
                          text-overflow: ellipsis;
                          display: -webkit-box;
                          -webkit-box-orient: vertical;
                          -webkit-line-clamp: 9;
                          overflow: hidden;
                        }
                    }
                    .read-more{
                        align-self:flex-end;
                        font-size: 15px;
                        font-weight:bold;
                        font-family:Microsoft YaHei;
                        color:rgba(44,118,209,1);
                    }
                    ::v-deep .el-collapse-item__arrow{
                        display:none;
                    }
                    ::v-deep .el-collapse-item{
                        border-left: 1px solid rgba(233,233,233,1);
                        border-right: 1px solid rgba(233,233,233,1);
                    }
                    ::v-deep .el-collapse-item__header{
                        padding: 0 20px;
                        font-size:16px;
                        font-family:Microsoft YaHei;
                        color:rgba(44,118,209,1);
                    }
                    ::v-deep .el-collapse-item__header.is-active{
                        padding: 0 20px;
                        border-bottom: 1px solid rgba(233,233,233,1);
                        background: rgba(243,248,255,1);
                        font-size:16px;
                        font-family:Microsoft YaHei;
                        font-weight:bold;
                        color:rgba(44,118,209,1);
                    }
                    ::v-deep .el-collapse-item__content{
                        padding: 20px 38px 20px 20px;
                        background-color: rgba(246,247,251,1);
                    }
                }
            }

            /* .problem-panel {
                padding-top: 20px;

                .problem-content {
                    padding: 15px 10px;

                    .problem {
                        border: 1px solid rgba(209, 213, 222, 1);
                        padding: 10px 10px;
                        margin-top: -1px;

                        >a {
                            color: rgba(44, 118, 209, 1);
                        }
                    }
                }
            } */
        }
    }
</style>
