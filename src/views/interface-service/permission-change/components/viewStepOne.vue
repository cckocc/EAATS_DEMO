<template>
  <div>
    <div class="main-body">
      <div class="main-body-bottom">
        <div class="table">
          <el-table
            :data="stepOneObj.originData"
            style="width: 100%"
            fit
            stripe
            border
            highlight-current-row
            :header-cell-class-name="headerCellClassName"
            :cell-class-name="cellClassName"
          >
            <el-table-column
              show-overflow-tooltip
              prop="apiAccountName"
              :label="$t('permissionChange.apiAccount')"
              min-width="160"
            />
            <el-table-column
              prop="dimensionName"
              :label="$t('permissionChange.interfaceName')"
              align="center"
              min-width="600"
            >
              <template slot="header" slot-scope="scope">
                <tableTree
                  :origin-data="[]"
                  :table-columns="stepOneObj.tableColumns"
                />
              </template>
              <template slot-scope="scope">
                <tableTree
                  v-if="isView"
                  :origin-data="scope.row.menuConfigNodeList"
                  :table-columns="stepOneObj.tableColumns"
                  :is-show-table-head="false"
                >
                  <template v-slot:node="{ node }">
                    <div>
                      <div>{{ node.nodeName }}</div>
                      <div v-if="node.isLeafFlg && node.isLeafFlg.name === 'YES'" class="leaf-node">
                        <span v-if="node.nodeOptionalStatus.code === '10'" class="leaf-node-add">{{ $t('permissionChange.newAdd') }}</span>
                        <span v-if="node.nodeOptionalStatus.code === '00'" class="leaf-node-cancel">{{ $t('permissionChange.newCancle') }}</span>
                      </div>
                    </div>
                  </template>
                </tabletree>
                <tableTree
                  v-else
                  :ref="`tree${scope.$index}`"
                  :origin-data="scope.row.menuConfigNodeList"
                  :table-columns="stepOneObj.tableColumns"
                  :is-show-table-head="false"
                  show-checkbox
                  show-checkbox-and-slot
                >
                  <template v-slot:node="{ node }">
                    <div v-if="node.preNodeOptionalStatus" class="leaf-node">
                      <span v-if="node.preNodeOptionalStatus.code === '00' && node.nodeOptionalStatus.code === '10'" class="leaf-node-add">{{ $t('permissionChange.newAdd') }}</span>
                      <span v-if="node.preNodeOptionalStatus.code === '10' && node.nodeOptionalStatus.code === '00'" class="leaf-node-cancel">{{ $t('permissionChange.newCancle') }}</span>
                    </div>
                  </template>
                </tableTree>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="btn-container">
      <el-button
        v-preventReClick
        type="primary"
        @click="nextStep"
      >{{ $t('common.button.nextPage') }}</el-button>
      <el-button
        class="button-default"
        @click="cancel"
      >{{ $t('common.button.cancel') }}</el-button>
    </div>
  </div>
</template>

<script>
import interfaceTerminationApi from '@/api/interface-service/interfaceTerminationApi'
export default {
  props: {
    operationType: {
      type: String,
      default: 'add'
    },
    parentType: {
      type: String,
      default: ''
    },
    institutionType: {
      type: String,
      default: ''
    },
    subApplyNoList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    }
  },
  computed: {
    applyOrdNo() {
      return this.$store.state.service.permissionChangeObj.commonObj.applyOrdNo
    },
    stepOneObj() {
      return this.$store.state.service.permissionChangeObj.stepOneObj
    },
    isView() {
      return this.operationType === 'detail' || this.operationType === 'audit'
    }
  },
  created() {
    console.log('权限变更第一步')
    if (this.isView) {
      console.log('detail')
    } else {
      this.getMenuConfig()
    }
  },
  methods: {
    headerCellClassName({ row, column, rowIndex, columnIndex }) {
      return columnIndex === 1 ? 'custom-header' : ''
    },
    cellClassName({ row, column, rowIndex, columnIndex }) {
      return columnIndex === 1 ? 'custom-cell' : ''
    },
    cancel() {
      this.$emit('cancel')
    },
    nextStep() {
      if (this.isView) {
        this.$emit('changeSteps', 2)
      } else {
        const apiCheckInfoList = []
        this.stepOneObj.originData.forEach((e, i) => {
          console.log(this.$refs[`tree${i}`])
          const checkedList = this.$refs[`tree${i}`].getCheckedNodeList()
          const checkedLeafList = checkedList.filter(e => e.isLeafFlg.name === 'YES')
          const checkedLeafIdList = checkedLeafList.map(e => e.id)
          apiCheckInfoList.push({
            apiAccount: e.apiAccountName,
            onlineTsList: e.onlineTsList,
            checkedNodeIdList: checkedLeafIdList
          })
        })
        const params = {
          applyOrdNo: this.applyOrdNo,
          bizProcId: this.parentType,
          institutionType: this.institutionType,
          apiCheckInfoList: apiCheckInfoList
        }
        // if (this.operationType === 'edit') {
        //   params.applyOrdNo = this.applyOrdNo
        // }
        interfaceTerminationApi.checkSaveApplyPermission(params).then(response => {
          if (response.data) {
            this.$confirm(response.data, this.$t('common.message.tips'), {
              confirmButtonText: this.$t('permissionChange.button.stillApply'),
              cancelButtonText: this.$t('common.button.cancel'),
              type: 'warning'
            }).then(() => {
              interfaceTerminationApi.saveApplyPermission(params).then(res => {
                this.$store.dispatch('service/setPermissionChangeData', {
                  commonObj: {
                    applyOrdNo: res.data[0].applyOrdNo
                  },
                  stepTwoObj: {
                    basicInfoList: res.data
                  }
                })
                this.$emit('changeSteps', 2)
              })
            }).catch(() => {

            })
          } else {
            interfaceTerminationApi.saveApplyPermission(params).then(res => {
              this.$store.dispatch('service/setPermissionChangeData', {
                commonObj: {
                  applyOrdNo: res.data[0].applyOrdNo
                },
                stepTwoObj: {
                  basicInfoList: res.data
                }
              })
              this.$emit('changeSteps', 2)
            })
          }
        })
      }
    },
    // 获取菜单配置项
    getMenuConfig() {
      const params = {
        bizProcId: this.parentType,
        menuInstiType: this.institutionType,
        apiInfoList: this.subApplyNoList
      }
      if (this.operationType === 'edit') {
        params.applyOrdNo = this.applyOrdNo
      }
      interfaceTerminationApi.getMenuConfigItem(params).then(res => {
        const originData = res.data.bodyData
        const tableColumns = res.data.headList
        this.$store.dispatch(
          'service/setPermissionChangeData',
          {
            stepOneObj: {
              originData: originData,
              tableColumns: tableColumns
            }
          }
        )
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.leaf-node {
  max-width: 61px;
  line-height: 15px;
}
</style>
