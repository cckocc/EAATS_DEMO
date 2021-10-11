<template>
  <div>
    <div v-if="isView" class="form-body-content">
      <div class="modal-main-body">
        <div class="form-title">
          <span>{{ $t('serviceOpening.requestedPermissionList') }}</span>
        </div>
        <tableTree
          :origin-data="stepOneObj.originData"
          :table-columns="stepOneObj.tableColumns"
        />
      </div>
    </div>
    <div v-else class="form-body-content">
      <template v-if="institutionType === '00'">
        <div class="modal-main-header">
          <span class="modal-main-header-all">{{ $t('serviceOpening.allCategories') }}:
            <el-tag
              v-for="tag in checkList"
              :key="tag.id"
              closable
              @close="handleCloseTag(tag)"
            >
              {{ tag.type === 'market' ? $t('serviceOpening.market') + '-' : $t('serviceOpening.interfacePurpose') + '-' }}{{ tag.name }}
            </el-tag>
          </span>
        </div>
        <div class="modal-main-body">
          <el-row>
            <el-col :span="3">
              <div class="left-collapse">
                <section class="left-collapse-row">
                  <div
                    class="left-collapse-row-title"
                    @click="handleChange('market')"
                  >
                    <el-checkbox
                      v-model="checkAllMarket"
                      :indeterminate="isIndeterminateMarket"
                      @change="val => handleCheckAllChange(val, 'market')"
                    >{{ $t('serviceOpening.market') }}</el-checkbox>
                    <i :class="[showMarket ? 'el-icon-arrow-down' : 'el-icon-arrow-right']" />
                  </div>
                  <div
                    v-show="showMarket"
                    class="left-collapse-row-list"
                  >
                    <el-checkbox-group
                      v-model="checkMarketList"
                      class="left-collapse-row-list-group"
                    >
                      <el-checkbox
                        v-for="item in marketList"
                        :key="item.id"
                        :label="item.id"
                        class="mtb5"
                        @change="val => onChangeCheckSingle(val, 'market', item)"
                      >{{ item.name }}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                </section>
                <section class="left-collapse-row">
                  <div
                    class="left-collapse-row-title"
                    @click="handleChange('interface')"
                  >
                    <el-checkbox
                      v-model="checkAllInterface"
                      :indeterminate="isIndeterminateInterface"
                      @change="val => handleCheckAllChange(val, 'interface')"
                    >{{ $t('serviceOpening.interfacePurpose') }}</el-checkbox>
                    <i :class="[showInterface ? 'el-icon-arrow-down' : 'el-icon-arrow-right']" />
                  </div>
                  <div
                    v-show="showInterface"
                    class="left-collapse-row-list"
                  >
                    <el-checkbox-group
                      v-model="checkInterfaceList"
                      class="left-collapse-row-list-group"
                    >
                      <el-checkbox
                        v-for="item in interfaceList"
                        :key="item"
                        :label="item"
                        class="mtb5"
                        @change="val => onChangeCheckSingle(val, 'interface', item)"
                      >{{ item }}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                </section>
              </div>
            </el-col>
            <el-col :span="21">
              <div class="right-table">
                <tableTree
                  ref="tableTree"
                  :origin-data="stepOneObj.originData"
                  :table-columns="stepOneObj.tableColumns"
                  show-checkbox
                  is-fold
                />
              </div>
            </el-col>
          </el-row>
        </div>
      </template>
      <template v-if="institutionType === '10'">
        <div class="modal-main-header">
          <span class="modal-main-header-all">{{ $t('serviceOpening.allCategories') }}:
            <el-tag
              v-for="tag in checkList"
              :key="tag.id"
              closable
              @close="handleCloseTag(tag)"
            >
              {{ $t('serviceOpening.productCategories') }}-{{ tag.name }}
            </el-tag>
          </span>
        </div>
        <div class="modal-main-body">
          <el-row>
            <el-col :span="3">
              <div class="left-collapse">
                <section class="left-collapse-row">
                  <div
                    class="left-collapse-row-title"
                    @click="handleChange('product')"
                  >
                    <el-checkbox
                      v-model="checkAllProduct"
                      :indeterminate="isIndeterminateProduct"
                      @change="val => handleCheckAllChange(val, 'product')"
                    >{{ $t('serviceOpening.productCategories') }}</el-checkbox>
                    <i :class="[showProduct ? 'el-icon-arrow-down' : 'el-icon-arrow-right']" />
                  </div>
                  <div
                    v-show="showProduct"
                    class="left-collapse-row-list"
                  >
                    <el-checkbox-group
                      v-model="checkProductList"
                      class="left-collapse-row-list-group"
                    >
                      <el-checkbox
                        v-for="item in productList"
                        :key="item"
                        :label="item"
                        class="mtb5"
                        @change="val => onChangeCheckSingle(val, 'product', item)"
                      >{{ item }}</el-checkbox>
                    </el-checkbox-group>
                  </div>
                </section>
              </div>
            </el-col>
            <el-col :span="21">
              <div class="right-table">
                <tableTree
                  ref="tableTree"
                  :origin-data="stepOneObj.originData"
                  :table-columns="stepOneObj.tableColumns"
                  show-checkbox
                  is-fold
                />
              </div>
            </el-col>
          </el-row>
        </div>
      </template>
    </div>
    <div class="btn-container">
      <el-button
        v-preventReClick
        type="primary"
        @click="nextStep"
      >{{ $t('common.button.nextPage') }}</el-button>
      <el-button
        @click="cancel"
      >{{ $t('common.button.cancel') }}</el-button>
    </div>
  </div>
</template>

<script>
import serviceQueryConditionMixin from '@/mixins/serviceQueryConditionMixin'
import serviceOpeningApi from '@/api/interface-service/serviceOpeningApi'
export default {
  mixins: [serviceQueryConditionMixin],
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
    }
  },
  data() {
    return {
    }
  },
  computed: {
    applyOrdNo() {
      return this.$store.state.service.serviceOpeningObj.commonObj.applyOrdNo
    },
    stepOneObj() {
      return this.$store.state.service.serviceOpeningObj.stepOneObj
    },
    isView() {
      return this.operationType === 'detail' || this.operationType === 'audit'
    }
  },
  created() {
    console.log('服务开通第一步')
    if (this.isView) {
      console.log('detail')
    } else {
      this.getMenuConfig()
    }
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    nextStep() {
      if (this.isView) {
        this.$emit('changeSteps', 2)
      } else {
        const checkedList = this.$refs.tableTree.getCheckedNodeList()
        if (checkedList.length === 0) {
          this.$message({
            type: 'info',
            message: this.$t('serviceOpening.message.atLeastOneItemChecked')
          })
          return
        }
        const checkedLeafList = checkedList.filter(e => e.isLeafFlg.name === 'YES')
        const checkedLeafIdList = checkedLeafList.map(e => e.id)
        const params = {
          bizProcId: this.parentType,
          institutionType: this.institutionType,
          checkedMenuConfigNodeList: checkedLeafIdList
        }
        if (this.operationType === 'edit') {
          params.applyOrdNo = this.applyOrdNo
        }
        serviceOpeningApi.saveApplyPermission(params).then(res => {
          console.log(res)
          if (res.code !== 'ACK') {
            this.$message({
              type: 'error',
              message: res.message
            })
            return
          }
          // 更新common和第二步数据
          this.$store.dispatch('service/setServiceOpeningData', {
            commonObj: {
              applyOrdNo: res.data.contactInfo.applyOrdNo
            },
            stepTwoObj: res.data.contactInfo
          })
          // 更新第三步数据
          const stepThreeFlagObj = {
            cmssNodeFlag: res.data.cmssNodeFlag,
            cmssNodeTradAfterFlag: res.data.cmssNodeTradAfterFlag,
            fxspNodeFlag: res.data.fxspNodeFlag,
            fxspNodeTradAfterFlag: res.data.fxspNodeTradAfterFlag
          }
          let basicObj = {}
          if (this.operationType === 'add') {
            basicObj = {
              applyOrdNo: '',
              infoStandardFlag: '0',
              hasRiskMechanism: '0',
              tradeStandardFlag: '0',
              qualificationFlag: '0',
              requirementsFlag: '0',
              hasHotLine: '0',
              hasBackupHotLine: '0',
              devInstitutionName: '',
              devInstitutionId: null,
              basicInfoList: [],
              hotlineInfo: '',
              contactForeignExchangeSystemFlag: '0',
              foreignCurrencyMarketFlag: '0',
              lyForeignSales: '',
              contactCurrencySystemFlag: '0',
              bondCurrencyMarketFlag: '0',
              ltLocalSales: ''
            }
          } else if (this.operationType === 'edit') {
            basicObj = this.$store.state.service.serviceOpeningObj.stepThreeObj.form
          }
          this.$store.dispatch('service/setServiceOpeningData', {
            stepThreeObj: {
              ...stepThreeFlagObj,
              form: basicObj
            }
          }).then(() => {
            this.$nextTick(() => {
              this.$parent.$refs.stepThree.$refs.stepThreeForm.clearValidate()
            })
          })
          this.$emit('changeSteps', 2)
        })
      }
    },
    // 获取菜单配置项
    getMenuConfig() {
      const params = {
        bizProcId: this.parentType,
        levelOneList: [],
        levelTwoNameList: [],
        menuInstiType: this.institutionType
      }
      if (this.operationType === 'edit') {
        params.applyOrdNo = this.applyOrdNo
      }
      if (this.institutionType === '00') {
        params.levelOneList = this.checkMarketList
        params.levelTwoNameList = this.checkInterfaceList
      } else if (this.institutionType === '10') {
        params.levelTwoNameList = this.checkProductList
      }
      serviceOpeningApi.getMenuConfig(params).then(res => {
        const originData = res.data.nodeList
        const tableColumns = res.data.headList
        this.$store.dispatch(
          'service/setServiceOpeningData',
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

</style>
