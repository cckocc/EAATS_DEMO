<template>
  <div class="isv_manage">
    <div v-if="!flag" class="isvManage">
      <el-card class="top_card">
        <el-form :inline="true" :model="formInline" class="query_inline_form">
          <el-form-item label="机构名称">
            <el-input
              v-model="formInline.cnFullName"
              clearable
              placeholder="请输入机构名称"
            />
          </el-form-item>
          <el-form-item label="支持接口" style="margin-left: 20px">
            <el-input
              v-model="formInline.productNodeName"
              clearable
              placeholder="请输入支持接口"
            />
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="handleFilter()"
              >查询</el-button
            >
            <el-button size="mini" @click="onReset()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <div v-loading="loading" element-loading-text="拼命加载中">
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
                    <div class="border_left" />
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
                    <span class="insti_text_left" :title="item.interfaceNum"
                      >支持接口服务内容的数量：<span class="support_account">{{
                        item.interfaceNum && item.interfaceNum.length > 5
                          ? item.interfaceNum.substring(0, 4) + '...'
                          : item.interfaceNum
                      }}</span></span
                    >
                  </el-col>
                  <el-col :span="14">
                    <span class="insti_text" :title="item.esDate"
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
                      >注册资本：{{ getRegistCaptial(item) }}</span
                    >
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

    <div class="detail">
      <IsvDetail v-if="flag" :msg="myMsg" @backToLastPage="backToLastPage()" />
    </div>
  </div>
</template>

<script>
import {
  reqGetInterfaceList,
  reqQueryInsit,
  reqGetInterList,
} from '@/api/isvManagement/isv_manage.js'
import IsvDetail from './isv_detail'

export default {
  name: 'IsvManage',
  components: {
    IsvDetail,
  },
  data() {
    return {
      myMsg: '',
      formInline: {
        cnFullName: '',
        productNodeName: '',
      },
      searchForm: {
        cnFullName: '',
        productNodeName: '',
      },

      // 接口产品列表
      interfaceList: [],

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

      flag: false,
    }
  },

  created() {
    this.getInterfaceList()
    this.handleFilter()
  },
  methods: {
    // 获取接口产品
    async getInterfaceList() {
      var map = {
        searchType: 'productNodeName',
        searchValue: '',
      }
      const res = await reqGetInterfaceList(map)
      // console.log('场务端获取接口产品列表', res)
      this.interfaceList = res.data
    },

    handleFilter() {
      this.pageQuery.page = 1
      this.searchForm = JSON.parse(JSON.stringify(this.formInline))
      this.onQuery(this.searchForm)
    },
    async onQuery(searchForm) {
      this.loading = true
      try {
        const res = await reqQueryInsit({ ...searchForm, ...this.pageQuery })
        if (res.code === 'ACK') {
          this.institutionList = res.data.list
          this.total = res.data.totalRecord
        }
        this.loading = false
        // console.log('查询123123', res)
      } catch (error) {
        this.loading = false
        console.log(error)
      }
    },

    onReset() {
      Object.keys(this.formInline).forEach((item) => {
        if (typeof this.formInline[item] === 'string') {
          this.formInline[item] = ''
        }
        if (
          typeof this.formInline[item] === 'object' &&
          Array.isArray(this.formInline[item])
        ) {
          this.formInline[item] = []
        }
        if (
          Object.prototype.toString.call(this.formInline[item]) ===
            '[object object]' &&
          Array.isArray(this.formInline[item])
        ) {
          this.formInline[item] = {}
        }
        if (item === 'page') this.formInline[item] = 1
        if (item === 'pageSize') this.formInline[item] = 10
      })
      // console.log('重置信息', this.formInline)
      this.handleFilter()
    },

    // // 分页方法
    // handleSizeChange(val) {
    //   console.log('改变每页条数')
    //   this.pageQuery.pageSize = val
    //   if (JSON.stringify(this.searchForm) === JSON.stringify(this.formInline)) {
    //     this.onQuery(this.formInline)
    //   } else {
    //     this.formInline = JSON.parse(JSON.stringify(this.searchForm))
    //     this.onQuery(this.searchForm)
    //   }
    // },
    // handleCurrentChange(val) {
    //   console.log('改变当前页码')
    //   this.pageQuery.page = val
    //   if (JSON.stringify(this.searchForm) === JSON.stringify(this.formInline)) {
    //     this.onQuery(this.formInline)
    //   } else {
    //     this.formInline = JSON.parse(JSON.stringify(this.searchForm))
    //     this.onQuery(this.searchForm)
    //   }
    // },

    // 分页方法
    handleSizeChange(val) {
      this.pageQuery.pageSize = val
      if (JSON.stringify(this.searchForm) === JSON.stringify(this.formInline)) {
        this.onQuery(this.formInline)
      } else {
        this.formInline = JSON.parse(JSON.stringify(this.searchForm))
        this.onQuery(this.searchForm)
      }
    },
    handleCurrentChange(val) {
      // console.log(val)
      this.pageQuery.page = val
      if (JSON.stringify(this.searchForm) === JSON.stringify(this.formInline)) {
        this.onQuery(this.formInline)
      } else {
        this.formInline = JSON.parse(JSON.stringify(this.searchForm))
        this.onQuery(this.searchForm)
      }
    },

    async jumpToDetailPage(item) {
      // 跳转至详情页
      this.myMsg = item
      this.flag = true
      // console.log('打印这个item', item, this.myMsg)
    },

    backToLastPage() {
      // console.log('111')
      this.flag = false
      this.handleFilter()
    },

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
.top_card {
  margin: 8px 0px 24px 0px;
}

.query_inline_form {
  height: 30px;
}

.el-input ::v-deep .el-input__inner {
  width: 300px;
}

.el-button {
  margin-left: 30px;
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
.insti_name {
  height: 20px;
  font-size: 20px;
  font-family: Source Han Sans CN;
  font-weight: bold;
  line-height: 22px;
  color: #333333;
  opacity: 1;
}
.border_left {
  width: 5px;
  height: 30px;
  background-color: #2c76d1;
  position: absolute;
  top: 15px;
  left: -20px;
}

.insti_text_left {
  width: 224px;
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
  width: 292px;
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
</style>
