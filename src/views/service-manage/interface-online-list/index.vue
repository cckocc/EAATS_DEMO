<template>
  <div>
    <el-tabs v-model="institutionType" class="custom-main-tabs" @tab-click="tabClick">
      <el-tab-pane v-if="institutionTypeList.includes('00')" :label="$t('interfaceOnline.marketMembers')" name="00" />
      <el-tab-pane v-if="institutionTypeList.includes('10')" :label="$t('interfaceOnline.informationVendors')" name="10" />
    </el-tabs>
    <div class="main-body">
      <div class="main-body-top">
        <el-form
          ref="searchForm"
          :model="mainObj.searchForm"
          label-position="left"
          inline
        >
          <el-form-item :label="$t('interfaceOnline.interfaceName')">
            <el-input
              v-model.trim="mainObj.searchForm.dimensionName"
              :placeholder="$t('common.placeholder.required')"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('interfaceOnline.serviceCode')">
            <el-input
              v-model.trim="mainObj.searchForm.applyNo"
              :placeholder="$t('common.placeholder.required')"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('interfaceOnline.submitter')">
            <el-input
              v-model.trim="mainObj.searchForm.submitName"
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
            <el-button
              v-preventReClick
              type="primary"
              size="small"
              @click="onApply"
            >
              <svg-icon class="button-icon" icon-class="service-apply" />{{ $t('interfaceOnline.applicationForInterfaceGoLive') }}
            </el-button>
          </div>
        </div>
        <div class="table">
          <el-table
            ref="tableRef"
            v-loading="mainObj.loading"
            :data="mainObj.list"
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
              prop="applyNo"
              :label="$t('interfaceOnline.serviceCode')"
              min-width="200"
            />
            <el-table-column
              v-if="parentType !== '10'"
              show-overflow-tooltip
              prop="api"
              :label="$t('interfaceOnline.apiAccount')"
              min-width="160"
            />
            <el-table-column
              show-overflow-tooltip
              prop="dimensionName"
              :label="$t('interfaceOnline.interfaceName')"
              min-width="150"
            />
            <el-table-column
              show-overflow-tooltip
              prop="serviceType"
              :label="$t('interfaceOnline.serviceType')"
              min-width="150"
            />
            <el-table-column
              show-overflow-tooltip
              prop="procStatus"
              :label="$t('interfaceOnline.processStatus')"
              width="140"
            />
            <el-table-column
              show-overflow-tooltip
              :label="$t('interfaceOnline.submitter')"
              min-width="100"
            >
              <template slot-scope="scope">
                <UserCard v-model="scope.row.submitUserId" :user-name="scope.row.submitName" />
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="passTime"
              :label="$t('interfaceOnline.approvalTime')"
              width="160"
            />
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
import globalOptions from '@/utils/globalOptionsValue'
const defaultSearchForm = {
  dimensionName: '',
  submitName: '',
  applyNo: ''
}
export default {
  components: {
    UserCard
  },
  data() {
    return {
      institutionType: '',
      procTypeOptions: globalOptions.procTypeOptions,
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
    console.log('待上线列表')
    if (this.institutionTypeList.length > 0) {
      this.institutionType = this.institutionTypeList[0]
    }
    this.onSearch()
  },
  methods: {
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
        bizType: [this.parentType],
        dataProcessStatus: '40',
        dimensionName: this.mainObj.searchForm.dimensionName,
        submitName: this.mainObj.searchForm.submitName,
        applyNo: this.mainObj.searchForm.applyNo
      }
      if (this.parentType === '30') {
        params.versionUpgradeFlag = true
      } else {
        params.versionUpgradeFlag = false
      }
      myServiceApi.getWaitProcessList(params).then(res => {
        this.mainObj.list = res.data.list
        this.mainObj.total = res.data.totalRecord
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
        const subApplyNoList = this.$refs.tableRef.selection.map(e => e.applyNo)
        const params = {
          bizProcId: this.parentType,
          levelOneList: [],
          levelTwoNameList: [],
          menuInstiType: this.institutionType,
          subApplyNoList: subApplyNoList
        }
        myServiceApi.checkInterfaceOnline(params).then(res => {
          console.log(res)
          const obj = {
            parentType: this.parentType,
            operationType: 'add',
            institutionType: this.institutionType,
            subApplyNoList: subApplyNoList
          }
          this.$router.push({
            name: 'ServiceOnline',
            query: {
              isShowTitleBefore: true,
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
