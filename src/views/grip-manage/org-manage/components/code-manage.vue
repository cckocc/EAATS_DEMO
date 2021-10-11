<template>
  <div>
    <div class="main-body">
      <div class="main-body-top">
        <el-form
          ref="searchForm"
          :model="mainObj.searchForm"
          label-width="80px"
          inline
        >
          <el-form-item label="手机号码">
            <el-input
              v-model.trim="mainObj.searchForm.phoneNo"
              v-limitBytes="300"
              clearable
            />
          </el-form-item>
          <el-form-item label="类型">
            <el-select
              v-model="mainObj.searchForm.smsType"
              placeholder="--全部--"
              clearable
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.code"
                :label="item.text"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="mini"
              @click="onSearch"
            >筛选</el-button>
            <el-button
              size="mini"
              @click="onReset"
            >重置</el-button>
          </el-form-item>
          <el-row>
            <el-form-item label="验证码">
              <el-input
                v-model="mainObj.searchForm.code"
                readonly
              />
            </el-form-item>
            <!-- <el-form-item label="过期时间">
              <el-input
                v-model="mainObj.searchForm.time"
                readonly
              />
            </el-form-item> -->
          </el-row>
        </el-form>
      </div>
      <!-- <div class="main-body-bottom">
        <div class="table">
          <el-table
            v-loading="mainObj.loading"
            :data="mainObj.list"
            fit
            stripe
            border
            highlight-current-row
          >
            <el-table-column
              show-overflow-tooltip
              prop="phoneNo"
              label="手机号码"
              min-width="150"
            />
            <el-table-column
              show-overflow-tooltip
              prop="smsType"
              label="类型"
              min-width="150"
            />
            <el-table-column
              show-overflow-tooltip
              prop="code"
              label="验证码"
              min-width="100"
            />
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
            :current-page="mainObj.currentPage"
            :page-sizes="[20, 50, 100]"
            :page-size="mainObj.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="mainObj.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { getCodeList } from '@/api/gripManageApi'

const defaultSearchForm = {
  code: '',
  phoneNo: '',
  smsType: 'REGISTER_SMS'
}
export default {
  data() {
    return {
      mainObj: {
        loading: false,
        list: [],
        pageSize: 20,
        currentPage: 1,
        total: 0,
        searchForm: Object.assign({}, defaultSearchForm)
      },
      typeOptions: [
        {
          code: 'LOGIN_SMS',
          name: 'LOGIN_SMS',
          text: '登录'
        },
        {
          code: 'REGISTER_SMS',
          name: 'REGISTER_SMS',
          text: '注册'
        }
      ]
    }
  },
  created() {
    console.log('机构验证码管理')
    // this.onSearch()
  },
  methods: {
    onSearch() {
      this.mainObj.currentPage = 1
      this.fetchData()
    },
    onReset() {
      this.mainObj.searchForm = Object.assign({}, defaultSearchForm)
      // this.onSearch()
    },
    handleSizeChange(val) {
      this.mainObj.pageSize = val
      this.mainObj.currentPage = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.mainObj.currentPage = val
      this.fetchData()
    },
    fetchData() {
      this.mainObj.loading = true
      const params = {
        // page: this.mainObj.currentPage,
        // pageSize: this.mainObj.pageSize,
        phoneNo: this.mainObj.searchForm.phoneNo,
        smsType: this.mainObj.searchForm.smsType
      }
      getCodeList(params).then(res => {
        this.mainObj.searchForm.code = res.data
        // this.mainObj.list = res.data.list
        // this.mainObj.total = res.data.totalRecord
        this.$message({
          type: 'success',
          message: res.message
        })
      }).finally(() => {
        setTimeout(() => {
          this.mainObj.loading = false
        }, 500)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

