<template>
  <div class="print-outter" :style="{ transform: type ==='print' ? 'translate(-22mm, 0)' : 'auto'}">
    <div v-show="loading" class="print-btn">
      <el-button v-if="type !=='print'" type="primary" @click="getPdf('pdfDom', $t('interfaceOnline.interfaceOnlineAppForm'))">导出PDF</el-button>
    </div>
    <div id="pdfDom" class="print-page">
      <div class="el-table el-table--fit el-table--border el-table--group el-table--scrollable-x">
        <div class="el-table__body-wrapper">
          <table
            cellspacing="0"
            cellpadding="0"
            border="0"
            class="el-table__body print-page-normal"
            style="width: 100%;"
          >
            <thead>
              <tr style="visibility: collapse;">
                <th style="width: 20%;" />
                <th style="width: 20%;" />
                <th style="width: 30%;" />
                <th style="width: 30%;" />
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="4" class="print-page-normal-maintitle">{{ $t('interfaceOnline.interfaceOnlineAppForm') }}</td>
              </tr>
              <tr>
                <td colspan="2">{{ $t('interfaceOnline.serviceCode') }}</td>
                <td colspan="2" style="width: 60%;">{{ applyOrdNo }}</td>
              </tr>
              <tr>
                <td colspan="2">{{ $t('interfaceOnline.institutionFullName') }}</td>
                <td colspan="2" style="width: 60%;">{{ instName }}</td>
              </tr>
              <tr>
                <td colspan="4" class="print-page-normal-rowtitle">{{ $t('interfaceOnline.requestForAccess') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <tableTree
        :origin-data="originData"
        :table-columns="tableColumns"
      />
      <div v-for="item in onlineBasicInfoList" :key="item.nodeId" class="el-table el-table--fit el-table--border el-table--group el-table--scrollable-x">
        <div class="el-table__body-wrapper">
          <table
            cellspacing="0"
            cellpadding="0"
            border="0"
            class="el-table__body print-page-normal"
            style="width: 100%;"
          >
            <thead>
              <tr style="visibility: collapse;">
                <th style="width: 20%;" />
                <th style="width: 20%;" />
                <th style="width: 30%;" />
                <th style="width: 30%;" />
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colspan="4" class="print-page-normal-rowtitle">
                  <span v-if="institutionType === '00'">{{ $t('interfaceOnline.interface') }}：{{ item.nodeName }}</span>
                  <span v-if="institutionType === '10'">{{ $t('interfaceOnline.informationVendorContact') }}</span>
                </td>
              </tr>
              <tr>
                <td rowspan="7">{{ $t('interfaceOnline.emergencyTechnicalContract') }}</td>
                <td>{{ $t('interfaceOnline.name') }}</td>
                <td colspan="2" style="width: 60%;">{{ item.urgencyContact.userName }}</td>
              </tr>
              <tr>
                <td>{{ $t('interfaceOnline.department') }}</td>
                <td colspan="2" style="width: 60%;">{{ item.urgencyContact.depart }}</td>
              </tr>
              <tr>
                <td>{{ $t('interfaceOnline.position') }}</td>
                <td colspan="2" style="width: 60%;">{{ item.urgencyContact.position }}</td>
              </tr>
              <tr>
                <td>{{ $t('interfaceOnline.telephone') }}</td>
                <td colspan="2" style="width: 60%;">{{ item.urgencyContact.telNo }}</td>
              </tr>
              <tr>
                <td>{{ $t('interfaceOnline.mobilePhone') }}</td>
                <td colspan="2" style="width: 60%;">{{ item.urgencyContact.phoneNo }}</td>
              </tr>
              <tr>
                <td>{{ $t('interfaceOnline.fax') }}</td>
                <td colspan="2" style="width: 60%;">{{ item.urgencyContact.faxNo }}</td>
              </tr>
              <tr>
                <td>E-mail</td>
                <td colspan="2" style="width: 60%;">{{ item.urgencyContact.email }}</td>
              </tr>
              <tr>
                <td colspan="2">{{ $t('interfaceOnline.goLiveDate') }}</td>
                <td colspan="2" style="width: 60%;">{{ item.onlineTs | dateFilter }}</td>
              </tr>
              <tr>
                <td colspan="2">{{ $t('interfaceOnline.clientIPAddress') }}</td>
                <td colspan="2" style="width: 60%;">{{ item.ipAddress }}</td>
              </tr>
              <tr>
                <td colspan="2">{{ $t('interfaceOnline.internalVersionOfInstitution') }}</td>
                <td colspan="2" style="width: 60%;">{{ item.innerInterfaceSystemVersion }}</td>
              </tr>
              <tr>
                <td colspan="2">{{ $t('interfaceOnline.isLeasedLine') }}</td>
                <td colspan="2" style="width: 60%;">{{ item.hasHotLine | statusFilter }}</td>
              </tr>
              <template v-if="item.hasHotLine === '1'">
                <tr>
                  <td>{{ $t('interfaceOnline.leasedLineCode') }}</td>
                  <td>{{ item.hotLineNo }}</td>
                  <td style="width: 30%;">{{ $t('interfaceOnline.routerIPAddress') }}</td>
                  <td style="width: 30%;">{{ item.hotLineIpAddress }}</td>
                </tr>
                <tr>
                  <td>{{ $t('interfaceOnline.bandwidth') }}</td>
                  <td>{{ item.hotLineBandwidth }}</td>
                  <td style="width: 30%;">{{ $t('interfaceOnline.leasedLineServiceProviderName') }}</td>
                  <td style="width: 30%;">{{ item.hotLineOperator | serviceFilter }}</td>
                </tr>
              </template>
              <tr>
                <td colspan="2">{{ $t('interfaceOnline.isBackupLeasedLine') }}</td>
                <td colspan="2" style="width: 60%;">{{ item.hasBackupLine | statusFilter }}</td>
              </tr>
              <template v-if="item.hasBackupLine === '1'">
                <tr>
                  <td>{{ $t('interfaceOnline.backupLeasedLineCode') }}</td>
                  <td>{{ item.backupLineNo }}</td>
                  <td style="width: 30%;">{{ $t('interfaceOnline.routerIPAddress') }}</td>
                  <td style="width: 30%;">{{ item.backupLineIpAddress }}</td>
                </tr>
                <tr>
                  <td>{{ $t('interfaceOnline.bandwidth') }}</td>
                  <td>{{ item.backupLineBandwidth }}</td>
                  <td style="width: 30%;">{{ $t('interfaceOnline.leasedLineServiceProviderName') }}</td>
                  <td style="width: 30%;">{{ item.backupLineOperator | serviceFilter }}</td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
      <div class="print-page-footer">
        <div>{{ $t('interfaceOnline.seal') }}</div>
        <div>{{ $t('interfaceOnline.date') }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getServiceOnlineDetail } from '@/api/interface-service/serviceOnlineApi'
import vm from '@/main'
export default {
  filters: {
    statusFilter(value) {
      const obj = {
        '0': vm.$t('interfaceOnline.no'),
        '1': vm.$t('interfaceOnline.yes')
      }
      return obj[value]
    },
    dateFilter(value) {
      return value ? value.substr(0, 10) : ''
    },
    serviceFilter(value) {
      const obj = {
        '00': vm.$t('interfaceOnline.telecom'),
        '10': vm.$t('interfaceOnline.unicom'),
        '20': vm.$t('interfaceOnline.mobile'),
        '90': vm.$t('interfaceOnline.other')
      }
      return obj[value]
    }
  },
  data() {
    return {
      loading: false,
      originData: [],
      tableColumns: [],
      onlineBasicInfoList: [],
      applyOrdNo: '',
      instName: '',
      institutionType: '',
      type: ''
    }
  },
  created() {
    this.applyOrdNo = this.$route.query.applyOrdNo
    this.institutionType = this.$route.query.institutionType
    this.type = this.$route.query.type
    this.getServiceOnlineDetail()
  },
  // 创建前设置
  beforeCreate() {
    document && document.querySelector('body').setAttribute('style', 'height:auto')
  },
  // 销毁前清除
  beforeDestroy() {
    document && document.querySelector('body').removeAttribute('style')
  },
  methods: {
    downloadPrint() {
      const tdList = document.querySelectorAll('td')
      const thList = document.querySelectorAll('th')
      Array.prototype.forEach.call(tdList, (element, index) => {
        console.log(element, index)
        element.setAttribute('style', 'border: 1px solid #dfe6ec!important')
      })
      Array.prototype.forEach.call(thList, (element, index) => {
        console.log(element, index)
        element.setAttribute('style', 'border: 1px solid #dfe6ec!important')
      })
      window.print()
    },
    getServiceOnlineDetail() {
      const params = {
        applyOrdNo: this.applyOrdNo,
        institutionType: this.institutionType,
        viewType: 'view'
      }
      getServiceOnlineDetail(params).then(res => {
        console.log(res)
        this.instName = res.data.instName
        this.originData = res.data.menuManageTreeDto.nodeList
        this.tableColumns = res.data.menuManageTreeDto.headList
        this.onlineBasicInfoList = res.data.onlineBasicInfoList
        this.loading = true
        if (this.type === 'print') {
          this.$nextTick(() => {
            setTimeout(() => {
              this.downloadPrint()
            }, 500)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .print-outter {
    width: 210mm;
    padding: 0 5mm;
    margin: 0 auto;
  }
  .print-btn {
    width: 100%;
    padding: 0 5mm;
    margin-top: 5mm;
    text-align: right;
  }
  .print-page {
    // position: absolute;
    // left: 50%;
    // transform: translate(-50%, 0);
    // border: 1px #D3D3D3 solid;
    // border-radius: 5px;
    // background: white;
    // box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
    width: 100%;
    padding: 5mm;
    ::v-deep.td-container {
      &>span {
        word-break: break-all;
      }
    }
    &-normal {
      td {
        padding: 12px 5px;
      }
      &-maintitle {
        text-align: center;
        font-size: 18px;
        font-weight: bold;
      }
      &-rowtitle {
        font-weight: bold;
        background-color: #F5F7FA;
      }
    }
    &-footer {
      text-align: center;
      margin-top: 10px;
      &>div {
        line-height: 24px;
      }
    }
  }
</style>
<style>
.meun-switch {
  display: none!important;
}
</style>
