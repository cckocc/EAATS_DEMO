<template>
  <el-dialog
    ref="processViewDialog"
    :visible="modalVisible"
    :close-on-click-modal="false"
    width="800px"
    :modal-append-to-body="false"
    destroy-on-close
    :title="$t('myService.processView')"
    @close="close"
  >
    <div slot="title">
      <el-tabs v-if="isGripUser" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane :label="$t('myService.processView')" name="first" />
        <el-tab-pane :label="$t('myService.dialog.processView.auditDetails')" name="second" />
      </el-tabs>
      <span v-else>{{ $t('myService.processView') }}</span>
    </div>
    <div v-if="activeName === 'first'" class="process-view">
      <div v-for="(item, index) in processViewInfo" :key="index" class="item">
        <i v-if="item.statusStr !== '审核结束'" class="el-icon-more item-more" :class="item.operateTs ? 'green' : 'gray'" />
        <div class="item-info">
          <div class="item-info-base">
            <div class="item-info-base-icon">
              <!-- 待提交 -->
              <svg-icon
                v-if="item.status === '98'"
                class="icon"
                :icon-class="item.operateTs?'audit-save':'audit-save-disable'"
              />
              <!-- 待审核 -->
              <svg-icon
                v-if="item.status === '00'"
                class="icon"
                :icon-class="item.operateTs?'audit-pending':'audit-pending-disable'"
              />
              <!-- 05-审核中 91驳回 -->
              <svg-icon
                v-if="item.status === '05' || item.status === '91'"
                class="icon"
                :icon-class="item.operateTs?'audit-doing':'audit-doing-disable'"
              />
              <!-- 验收测试相关 1000-申请单待审核 1005-候补 1010-测试中 1050-报告待审核 -->
              <svg-icon
                v-if="item.status === '1000' || item.status === '1005' || item.status === '1010' || item.status === '1050'"
                class="icon"
                :icon-class="item.operateTs?'audit-doing':'audit-doing-disable'"
              />
              <!-- 已撤回 -->
              <svg-icon
                v-if="item.status === '20'"
                class="icon"
                :icon-class="item.operateTs?'audit-recall':'audit-recall-disable'"
              />
              <!-- 10-通过 90-拒绝 80-一键通过 -->
              <svg-icon
                v-if="item.status === '10' || item.status === '90'|| item.status === '80'"
                class="icon"
                :icon-class="item.operateTs?'audit-finish':'audit-finish-disable'"
              />
              <!-- 审核结束 end-pass-通过 end-refuse-拒绝 -->
              <svg-icon
                v-if="item.status === 'end-pass' || item.status === 'end-refuse' || item.status === 'end-refuse-freed'"
                class="icon"
                :icon-class="item.operateTs?'audit-finish':'audit-finish-disable'"
              />
            </div>
            <div class="item-info-base-content">
              <div class="item-info-base-content-status">{{ item.statusStr }}</div>
              <div class="item-info-base-content-time">{{ item.operateTs ? item.operateTs : null }}</div>
            </div>
          </div>
          <div
            v-if="!isGripUser && (['10', '90', 'end-pass', 'end-refuse', 'end-refuse-freed'].includes(item.status) || (item.nextAuditDepartmentConcat && item.nextAuditDepartmentConcat.length && index === 0))"
            class="item-info-other"
          >
            <div v-if="['10', '90', 'end-pass', 'end-refuse', 'end-refuse-freed'].includes(item.status)">
              {{ $t('myService.dialog.processView.auditFeedback') }}：
              <span v-if="item.status === '10' || item.status === 'end-pass'" style="color: green;">{{ $t('common.button.pass') }}</span>
              <span v-if="item.status === '90' || item.status === 'end-refuse'" style="color: red;">{{ $t('common.button.reject') }}</span>
              <span v-if="item.status === 'end-refuse-freed'" style="color: red;">{{ $t('common.button.release') }}</span>
              <template v-else>
                <span v-if="isGripUser || item.status !== 'end-refuse' || processViewObj.serviceType !== '10'">{{ item.feedback ? ('-' + item.feedback) : null }}</span>
              </template>
            </div>
            <div v-if="item.nextAuditDepartmentConcat && item.nextAuditDepartmentConcat.length && index === 0">
              <div style="margin: 10px 0;">{{ $t('myService.dialog.processView.pendingAuditor') }}:</div>
              <div v-for="user in item.nextAuditDepartmentConcat" :key="user">{{ user }}</div>
            </div>
            <div v-if="!isGripUser && (item.status !== 'end-refuse' || processViewObj.serviceType !== '10')">
              <div v-for="(user, userIndex) in item.departConcatList" :key="user.sName + userIndex" style="margin: 10px 0;">
                {{ $t('myService.dialog.processView.reviewer') }}:
                <span>{{ $t('myService.dialog.processView.name') }}-{{ user.sName }}</span>
                <span class="ml10">{{ $t('myService.dialog.processView.concatInfo') }}-{{ user.concatInfo }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="activeName === 'second'">
      <p>{{ $t('myService.dialog.processView.applStatus') }}:<span class="status-word">{{ processViewObj.subAuditStatus.text }}</span></p>
      <el-table
        :data="statusList"
        style="width: 100%"
        fit
        stripe
        border
        highlight-current-row
        header-row-class-name="header-row-th"
        :header-row-style="{ height: '42px' }"
        :header-cell-style="{ padding: 0 }"
        :row-style="{ height: '42px' }"
        :cell-style="{ padding: 0 }"
        :span-method="arraySpanMethod"
      >
        <el-table-column
          v-if="processViewObj.serviceType === '10'"
          show-overflow-tooltip
          prop="testName"
          :label="$t('myService.dialog.processView.AcceptApplFormName')"
          min-width="180"
        />
        <el-table-column
          show-overflow-tooltip
          prop="reviewerDep"
          :label="$t('myService.dialog.processView.dept')"
          min-width="120"
        />
        <el-table-column
          show-overflow-tooltip
          prop="reviewerResult"
          :label="$t('myService.dialog.processView.auditStatus')"
          width="100"
        />
        <el-table-column
          show-overflow-tooltip
          prop="reviewerName"
          :label="$t('myService.dialog.processView.reviewer')"
          min-width="120"
        />
        <el-table-column
          show-overflow-tooltip
          prop="reviewerTs"
          :label="$t('myService.dialog.processView.auditTime')"
          width="160"
        />
        <el-table-column
          show-overflow-tooltip
          prop="reviewerFeedback"
          :label="$t('myService.dialog.processView.auditFeedback')"
          min-width="120"
        />
        <!-- <el-table-column
          show-overflow-tooltip
          prop="reviewerRemark"
          label="备注"
          min-width="120"
        /> -->
      </el-table>
    </div>
  </el-dialog>
</template>
<script>
import myServiceApi from '@/api/myServiceApi'
import { mapGetters } from 'vuex'
export default {
  name: 'ProcessDetail',
  props: {
    modalVisible: {
      type: Boolean,
      default: false
    },
    processViewObj: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      isActive: true,
      processViewInfo: [],
      activeName: 'first',
      statusList: []
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    isGripUser() {
      return this.userInfo.userInnerType.name === 'GRIP'
    }
  },
  watch: {
    modalVisible(newVal, oldVal) {
      console.log(newVal, oldVal)
      if (newVal) {
        this.activeName = 'first'
        this.getProcessDetail()
        if (this.isGripUser) {
          this.getProcessList()
        }
      }
    }
  },
  methods: {
    close() {
      this.$emit('close', 'cancel')
    },
    getProcessDetail() {
      const params = {
        id: this.processViewObj.subApplyId
      }
      myServiceApi.getProcessView(params).then(res => {
        if (res.code === 'ACK') {
          this.processViewInfo = res.data
          if (this.isGripUser) {
            this.processViewInfo = this.processViewInfo.filter(e => e.status !== '98')
          }
        }
      })
    },
    getProcessList() {
      const params = {
        applyOrdNo: this.processViewObj.subApplyId
      }
      myServiceApi.getProcessList(params).then(res => {
        const map = new Map()
        this.statusList = res.data.map((e, index, arr) => {
          if (!map.has(e.testName)) {
            e.rowspan = arr.filter(item => e.testName === item.testName).length
            map.set(e.testName, 1)
          } else {
            e.rowspan = 0
          }
          return e
        })
      })
    },
    handleClick(tab, event) {
      console.log(tab, event)
    },
    // 验收测试需要合并子验收单
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (this.processViewObj.serviceType === '10' && columnIndex === 0) {
        if (row.rowspan) {
          return [row.rowspan, 1]
        } else {
          return [0, 0]
        }
      } else {
        return [1, 1]
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .process-view {
    margin-bottom: 20px;
    padding: 30px 80px;
    background: #fafbfd;
    border: 1px dashed #dfdfdf;
    .item {
      padding-bottom: 20px;
      border-bottom: 1px solid #d1d5de;
      margin-top: 20px;
      &:last-child {
        border-bottom: none;
        padding-bottom: 0;
      }
      &:first-child {
        margin-top: 0;
      }
      &-more {
        font-size: 30px;
        transform: rotate(90deg);
        margin-left: 5px;
        &.green {
          color: #14bf85;
        }
        &.gray {
          color: #6d6d6d;
        }
      }
      &-info {
        &-base {
          display: flex;
          &-icon {
            font-size: 48px;
          }
          &-content {
            font-size: 16px;
            color: #303030;
            margin-left: 20px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            &-status {
              font-weight: bold;
            }
          }
        }
        &-other {
          margin-top: 20px;
          padding: 10px;
          background: #fff;
          border: 1px solid #e4e4e4;
          color: #6d6d6d;
          font-weight: bold;
          font-size: 13px;
        }
      }
    }
  }
  ::v-deep.el-tabs__header {
    margin: 0;
    .el-tabs__nav-wrap::after {
      height: 0;
      .el-tabs__active-bar {
        height: 0;
      }
    }
  }
  .status-word {
    color: #9fb890;
  }
</style>
