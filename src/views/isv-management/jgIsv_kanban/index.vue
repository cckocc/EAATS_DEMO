<template>
  <div class="jgisv_index">
    <div v-if="!flag" class="showFlag">
      <div class="kanban_title">
        <div class="content">
          <div class="kanban">ISV看板</div>
          <div style="margin-top: 20px">
            <el-input
              v-model="searchCondition.searchValue"
              placeholder="请输入内容"
              class="input-with-select"
            >
              <el-select
                slot="prepend"
                v-model="searchCondition.searchType"
                placeholder="请选择"
                class="select_option"
                @change="changeOption()"
              >
                <el-option
                  v-for="item in selectOptionList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>

              <el-button
                slot="append"
                icon="el-icon-search"
                style="color: #0050b3"
                @click="handleFilter()"
              />
              <!-- <img src="" alt=""> -->
            </el-input>
          </div>
        </div>
      </div>

      <div v-loading="loading" class="compony_info">
        <el-row :gutter="24" class="textCenter">
          <el-col
            v-for="item in institutionList"
            :key="item.cnFullId"
            :span="12"
          >
            <el-card class="box-card institutionCard" shadow="hover">
              <div class="company_info">
                <el-row>
                  <el-col>
                    <div class="positio_border" />
                    <h3>
                      <el-link
                        class="insti_name"
                        @click="jumpToDetailPage(item)"
                        >{{ item.cnFullName }}</el-link
                      >
                    </h3>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="10">
                    <span class="insti_text_left"
                      >支持接口服务内容的数量：<span
                        class="support_account"
                        :title="item.interfaceNum"
                        >{{
                          item.interfaceNum && item.interfaceNum.length > 10
                            ? item.interfaceNum.substring(0, 9) + '...'
                            : item.interfaceNum
                        }}</span
                      ></span
                    >
                  </el-col>
                  <el-col :span="14">
                    <span class="insti_text" :title="item.cfetsInstnCd"
                      >社会信用代码：{{
                        item.cfetsInstnCd && item.cfetsInstnCd.length > 25
                          ? item.cfetsInstnCd.substring(0, 24) + '...'
                          : item.cfetsInstnCd
                      }}</span
                    >
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="10">
                    <span class="insti_text_left" :title="item.esDate"
                      >成立日期：{{
                        item.esDate && item.esDate.length > 20
                          ? item.esDate.substring(0, 19) + '...'
                          : item.esDate
                      }}</span
                    >
                  </el-col>
                  <el-col :span="14">
                    <span
                      class="insti_text"
                      :title="item.registCaptial + '万元人民币'"
                      >注册资本：
                      {{ getRegistCaptial(item) }}
                    </span>
                  </el-col>
                </el-row>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>

      <el-pagination
        style="display: flex; justify-content: center; margin: 17px 0px"
        :current-page="pageQuery.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="pageQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <JgIsvDetail v-if="flag" :msg="myMsg" @backToLastPage="backToLastPage" />
  </div>
</template>

<script>
import {
  reqGetSelectOption,
  reqQueryResult,
} from '@/api/isvManagement/isv_manage'

export default {
  name: 'JgisvIndex',
  components: {
    JgIsvDetail: () => import('./jgisv_detail'),
  },
  data() {
    return {
      myMsg: '',
      flag: false,
      searchCondition: {
        searchType: '',
        searchValue: '',
      },
      searchForm: {
        searchType: '',
        searchValue: '',
      },

      selectOptionList: [
        {
          value: 'cnFullName',
          label: '机构名称',
        },
        {
          value: 'productNodeName',
          label: '支持接口',
        },
      ],

      // 加载状态
      loading: false,
      // 机构列表
      institutionList: [],

      // 分页信息
      total: 0,
      pageQuery: {
        page: 0,
        pageSize: 10,
      },
    }
  },
  created() {
    this.handleFilter()
  },

  methods: {
    // 根据下拉框选项 模糊搜索显示输入框内容
    async changeOption() {
      const res = await reqGetSelectOption({ ...this.searchCondition })
      // this.institutionList = res.data

      console.log('模糊搜索', res)
    },

    handleFilter() {
      this.pageQuery.page = 1
      if (this.searchCondition.searchType === 'cnFullName') {
        this.searchCondition.cnFullName = this.searchCondition.searchValue
        this.searchCondition.productNodeName = ''
      } else if (this.searchCondition.searchType === 'productNodeName') {
        this.searchCondition.productNodeName = this.searchCondition.searchValue
        this.searchCondition.cnFullName = ''
      }
      this.searchForm = JSON.parse(JSON.stringify(this.searchCondition))
      this.onQuery(this.searchForm)
    },
    async onQuery(searchForm) {
      this.loading = true
      try {
        const res = await reqQueryResult({ ...this.pageQuery, ...searchForm })
        if (res.code === 'ACK') {
          this.institutionList = res.data.list
          this.total = res.data.totalRecord
        }
        this.loading = false
        // console.log('查询ISV信息', res)
      } catch (error) {
        this.loading = false
        console.log(error)
      }
    },

    jumpToDetailPage(item) {
      this.myMsg = item
      this.flag = true
      // 跳转至详情页
    },
    backToLastPage() {
      console.log('111')
      this.flag = false
    },

    // 分页方法
    handleSizeChange(val) {
      // console.log('改变每页条数', val)
      this.pageQuery.pageSize = val
      // this.handleFilter()
      if (
        JSON.stringify(this.searchForm) === JSON.stringify(this.searchCondition)
      ) {
        this.onQuery(this.searchCondition)
      } else {
        this.searchCondition = JSON.parse(JSON.stringify(this.searchForm))
        this.onQuery(this.searchForm)
      }
    },
    handleCurrentChange(val) {
      // console.log('改变当前页码', val)
      this.pageQuery.page = val
      // this.handleFilter()
      if (
        JSON.stringify(this.searchForm) === JSON.stringify(this.searchCondition)
      ) {
        this.onQuery(this.searchCondition)
      } else {
        this.searchCondition = JSON.parse(JSON.stringify(this.searchForm))
        this.onQuery(this.searchForm)
        // }
      }
    },

    // 注册资本展示
    getRegistCaptial(item) {
      if (item.registCaptial) {
        if ((item.registCaptial + '万元人民币').length > 20) {
          return (item.registCaptial + '万元人民币').substring(0, 19) + '...'
        } else {
          return item.registCaptial + '万元人民币'
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

.kanban_title {
  // width: 100%;
  height: 246px;
  background: url('~@/assets/style/ISVkb_banner_bg.svg') no-repeat;
  background-size: cover;
  .content {
    width: $mainWidth;
    margin: 0px auto;
    .kanban {
      // width: 107px;
      // height: 30px;
      display: flex;
      justify-content: center;
      font-size: 30px;
      padding-top: 40px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      line-height: 51px;
      color: #ffffff;
      opacity: 1;
    }
  }
}

.select_option {
  width: 300px;
  border-radius: 20px 0px 0px 20px;
}

.compony_info {
  width: $mainWidth;
  margin: 20px auto;
}

.institutionCard {
  margin-bottom: 24px;
  background: url('~@/assets/style/isvKB_BG.svg') no-repeat #ffffff;
  width: 598px;
  height: 200px;
  border: 1px solid #dfdfdf;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
}

.positio_border {
  position: absolute;
  top: 20px;
  left: -20px;
  width: 6px;
  height: 30px;
  background: #2c76d1;
  opacity: 1;
}
.insti_name {
  // cursor: pointer;
  // width: 538px;
  height: 20px;
  font-size: 20px;
  font-family: Source Han Sans CN;
  font-weight: bold;
  line-height: 22px;
  color: #333333;
  opacity: 1;
}

.insti_text_left {
  // width: 224px;
  height: 51px;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 30px;
  color: #667baa;
  opacity: 1;
  // padding-left: 20px;
}

.insti_text {
  // width: 292px;
  height: 51px;
  font-size: 16px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 30px;
  color: #667baa;
  opacity: 1;
}

.support_account {
  color: #0050b3;
  font-weight: bold;
}

.institutionCard:hover {
  width: 598px;
  height: 200px;
  background: url('~@/assets/style/isvKB_BG.svg') no-repeat #ffffff;
  border: 1px solid #75c4ff;
  box-shadow: 0px 0px 20px rgba(0, 118, 253, 0.3);
  opacity: 1;
}

.input-with-select {
  height: 56px;
}
::v-deep .el-input-group__prepend {
  border-top-left-radius: 30px;
  border-bottom-left-radius: 30px;
}

::v-deep .el-input-group__append {
  border-top-right-radius: 30px;
  border-bottom-right-radius: 30px;
  background-color: #fff;
}
.el-input ::v-deep .el-input__inner {
  height: 56px;
}
</style>
