<template>
  <div>
    <el-tabs v-model="institutionType" class="custom-main-tabs" @tab-click="tabClick">
      <el-tab-pane v-if="institutionTypeList.includes('00')" :label="$t('permissionChange.marketMembers')" name="00" />
      <el-tab-pane v-if="institutionTypeList.includes('10')" :label="$t('permissionChange.informationVendors')" name="10" />
    </el-tabs>
    <div class="main-body">
      <div class="main-body-top">
        <el-form
          ref="searchForm"
          :model="mainObj.searchForm"
          :label-width="$t('permissionChange.labelWidth')"
          label-position="left"
          inline
        >
          <el-form-item :label="$t('permissionChange.interfaceName')">
            <el-input
              v-model.trim="mainObj.searchForm.dimensionName"
              :placeholder="$t('common.placeholder.required')"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('permissionChange.submitter')">
            <el-input
              v-model.trim="mainObj.searchForm.submitName"
              :placeholder="$t('common.placeholder.required')"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('permissionChange.apiAccount')">
            <el-input
              v-model.trim="mainObj.searchForm.api"
              :placeholder="$t('common.placeholder.required')"
              clearable
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearch">{{ $t('common.button.inquiry') }}</el-button>
            <el-button type="default" @click="onReset">{{ $t('common.button.reset') }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="main-body-bottom">
        <div class="main-body-bottom-btn">
          <div class="main-body-bottom-btn-left">
            <el-button v-preventReClick type="primary" size="small" @click="onApply">
              <svg-icon class="button-icon" icon-class="service-apply" />
              {{ $t('permissionChange.button.applicationPermissionChange') }}
            </el-button>
          </div>
        </div>
        <div class="table">
          <el-table
            ref="tableRef"
            v-loading="mainObj.loading"
            :data="mainObj.list"
            :span-method="objectSpanMethod"
            style="width: 100%"
            fit
            stripe
            border
            highlight-current-row
          >
            <el-table-column
              type="selection"
              width="55"
            />
            <el-table-column
              show-overflow-tooltip
              prop="api"
              :label="$t('permissionChange.apiAccount')"
              min-width="160"
            />
            <el-table-column
              show-overflow-tooltip
              prop="dimensionName"
              :label="$t('permissionChange.interfaceName')"
              min-width="200"
            />
            <el-table-column
              show-overflow-tooltip
              :label="$t('permissionChange.submitter')"
              min-width="100"
            >
              <template slot-scope="scope">
                <UserCard v-model="scope.row.submitUserId" :user-name="scope.row.submitName" />
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="onlineTime"
              :label="$t('permissionChange.goLiveTime')"
              min-width="160"
            >
              <template slot-scope="scope">
                {{ scope.row.onlineTime ? scope.row.onlineTime.substr(0, 10) : '' }}
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
            :current-page="mainObj.currentPage"
            :page-size="mainObj.pageSize"
            :page-sizes="mainObj.pagesizes"
            :total="mainObj.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import myServiceApi from '@/api/myServiceApi'
import UserCard from '@/components/UserCard'
const defaultSearchForm = {
  dimensionName: '',
  submitName: '',
  api: ''
}
export default {
  components: {
    UserCard
  },
  data() {
    return {
      institutionType: '',
      mainObj: {
        loading: false,
        list: [],
        currentPage: 1,
        pageSize: 20,
        pagesizes: [20, 50, 100],
        total: 0,
        searchForm: Object.assign({}, defaultSearchForm)
      }
    }
  },
  computed: {
    institutionTypeList() {
      return this.$store.state.user.institutionTypeList
    },
    parentType() {
      return this.$route.query.parentType
    }
  },
  created() {
    console.log('待权限变更列表')
    if (this.institutionTypeList.length > 0) {
      this.institutionType = this.institutionTypeList[0]
    }
    this.onSearch()
  },
  methods: {
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex < 2) {
        return [row.rowSpan, 1]
      } else {
        return [1, 1]
      }
    },
    tabClick(tab, event) {
      console.log(tab, event)
      this.onReset()
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
    onSearch() {
      this.mainObj.currentPage = 1
      this.fetchData()
    },
    fetchData() {
      this.mainObj.loading = true
      const params = {
        page: this.mainObj.currentPage,
        pageSize: this.mainObj.pageSize,
        type: this.institutionType,
        dimensionName: this.mainObj.searchForm.dimensionName,
        submitName: this.mainObj.searchForm.submitName,
        api: this.mainObj.searchForm.api
      }
      myServiceApi.getWaitInterfaceTerminationList(params).then(res => {
        this.mainObj.total = res.data.totalRecord
        const list = []
        res.data.list.forEach(api => {
          api.list.forEach((e, i) => {
            list.push(Object.assign({}, e, { rowSpan: i === 0 ? api.list.length : 0 }))
          })
        })
        this.mainObj.list = list
      }).finally(() => {
        setTimeout(() => {
          this.mainObj.loading = false
        }, 500)
      })
    },
    onReset() {
      this.mainObj.searchForm = Object.assign({}, defaultSearchForm)
      this.onSearch()
    },
    onApply() {
      console.log(this.$refs.tableRef.selection)
      if (this.$refs.tableRef.selection.length === 0) {
        this.$message({
          type: 'info',
          message: this.$t('common.message.selectItem')
        })
      } else {
        const subApplyNoList = this.$refs.tableRef.selection.map(e => {
          const obj = {
            apiAccount: e.api,
            onlineTime: e.onlineTime
          }
          return obj
        })
        const params = {
          bizProcId: this.parentType,
          levelOneList: [],
          levelTwoNameList: [],
          menuInstiType: this.institutionType,
          apiInfoList: subApplyNoList
        }
        myServiceApi.checkPermissionChange(params).then(res => {
          console.log(res)
          const obj = {
            parentType: this.parentType,
            operationType: 'add',
            institutionType: this.institutionType,
            subApplyNoList: subApplyNoList
          }
          this.$router.push({
            name: 'PermissionChange',
            query: {
              params: encodeURIComponent(JSON.stringify(obj))
            }
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
