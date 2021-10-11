<template>
  <div>
    <el-tabs v-model="institutionType" class="custom-main-tabs" @tab-click="tabClick">
      <el-tab-pane v-if="institutionTypeList.includes('00')" :label="$t('networkOpening.marketMembers')" name="00" />
      <el-tab-pane v-if="institutionTypeList.includes('10')" :label="$t('networkOpening.informationVendors')" name="10" />
    </el-tabs>
    <div class="main-body">
      <div class="main-body-top">
        <el-form
          ref="searchForm"
          :model="mainObj.searchForm"
          label-position="left"
          inline
        >
          <el-form-item :label="$t('networkOpening.interfaceName')">
            <el-input
              v-model.trim="mainObj.searchForm.dimensionName"
              :placeholder="$t('common.placeholder.required')"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('networkOpening.serviceCode')">
            <el-input
              v-model.trim="mainObj.searchForm.applyNo"
              :placeholder="$t('common.placeholder.required')"
              clearable
            />
          </el-form-item>
          <el-form-item :label="$t('networkOpening.submitter')">
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
              <svg-icon class="button-icon" icon-class="service-apply" />{{ $t('networkOpening.button.networkActivationApplication') }}
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
              :label="$t('networkOpening.serviceCode')"
              min-width="200"
            />
            <el-table-column
              show-overflow-tooltip
              prop="dimensionName"
              :label="$t('networkOpening.interfaceName')"
              min-width="150"
            />
            <el-table-column
              show-overflow-tooltip
              prop="serviceType"
              :label="$t('networkOpening.serviceType')"
              min-width="150"
            >
              <template slot-scope="scope">
                <span v-if="parentType === '10'">{{ $t('networkOpening.serviceOpening') }}</span>
                <span v-if="parentType === '20'">{{ $t('networkOpening.permissionChange') }}</span>
                <span v-if="parentType === '30'">{{ scope.row.serviceType.code | serviceTypeFilter }}</span>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="procStatus"
              :label="$t('networkOpening.processStatus')"
              width="140"
            >
              <template slot-scope="scope">
                {{ $t('common.button.pass') }}
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="submitName"
              :label="$t('networkOpening.submitter')"
              min-width="100"
            >
              <template slot-scope="scope">
                <UserCard v-model="scope.row.submitUserId" :user-name="scope.row.submitName" />
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="passTime"
              :label="$t('networkOpening.approvalTime')"
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
    <!-- 网络开通 -->
    <networkOpeningDialog
      :visible="networkOpeningObj.visible"
      :operation-type="networkOpeningObj.type"
      :sub-apply-no-list="mainObj.subApplyNoList"
      @close="networkOpeningObj.visible = false"
    />
  </div>
</template>

<script>
import globalOptions from '@/utils/globalOptionsValue'
import myServiceApi from '@/api/myServiceApi'
import networkOpeningApi from '@/api/interface-service/networkOpeningApi'
import UserCard from '@/components/UserCard'
import networkOpeningDialog from '@/views/service-manage/network-opening-list/components/index'
const defaultSearchForm = {
  dimensionName: '',
  submitName: '',
  applyNo: ''
}
export default {
  components: {
    UserCard,
    networkOpeningDialog
  },
  filters: {
    serviceTypeFilter(val) {
      return val ? globalOptions.serveiceOptions.find(e => e.value === val).label : null
    }
  },
  data() {
    return {
      institutionType: '',
      mainObj: {
        loading: false,
        subApplyNoList: [],
        list: [],
        currentPage: 1,
        pageSize: 20,
        pagesizes: [20, 50, 100],
        total: 0,
        searchForm: Object.assign({}, defaultSearchForm)
      },
      // 网络开通
      networkOpeningObj: {
        visible: false,
        type: '',
        formList: []
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
    console.log('待网络开通列表')
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
        institutionType: this.institutionType,
        bizType: this.parentType,
        dimensionName: this.mainObj.searchForm.dimensionName,
        submitName: this.mainObj.searchForm.submitName,
        applyNo: this.mainObj.searchForm.applyNo
      }
      myServiceApi.getWaitNetworkList(params).then(res => {
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
    onApply(type) {
      console.log(this.$refs.tableRef.selection)
      if (this.$refs.tableRef.selection.length === 0) {
        this.$message({
          type: 'info',
          message: this.$t('common.message.selectItem')
        })
      } else {
        this.mainObj.subApplyNoList = this.$refs.tableRef.selection.map(e => e.applyNo)
        const params = {
          bizType: this.parentType,
          institutionType: this.institutionType,
          subApplyOrdNoList: this.mainObj.subApplyNoList
        }
        networkOpeningApi.verifyNetworkOpening(params).then(res => {
          console.log(res.data)
          this.networkOpeningObj.type = 'add'
          this.networkOpeningObj.visible = true
          this.networkOpeningObj.formList = res.data.networkOpeningVoList
          // this.$nextTick(() => {
          //   this.$refs.whiteListForm.clearValidate()
          // })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
