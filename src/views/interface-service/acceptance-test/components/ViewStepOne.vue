<template>
  <div>
    <div v-if="isView" class="form-body-content">
      <div class="modal-main-body">
        <div class="form-title">
          <span>{{ $t('acceptanceTest.requestedPermissionList') }}</span>
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
          <span class="modal-main-header-all">{{ $t('acceptanceTest.allCategories') }}:
            <el-tag
              v-for="tag in checkList"
              :key="tag.id"
              closable
              @close="handleCloseTag(tag)"
            >
              {{ tag.type === 'market' ? $t('acceptanceTest.market') + '-' : $t('acceptanceTest.interfacePurpose') + '-' }}{{ tag.name }}
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
                    >{{ $t('acceptanceTest.market') }}</el-checkbox>
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
                    >{{ $t('acceptanceTest.interfacePurpose') }}</el-checkbox>
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
          <span class="modal-main-header-all">{{ $t('acceptanceTest.allCategories') }}:
            <el-tag
              v-for="tag in checkList"
              :key="tag.id"
              closable
              @close="handleCloseTag(tag)"
            >
              {{ $t('acceptanceTest.productCategories') }}-{{ tag.name }}
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
                    >{{ $t('acceptanceTest.productCategories') }}</el-checkbox>
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
    <div class="btn-container no-background">
      <el-button
        v-preventReClick
        type="primary"
        @click="nextStep('10')"
      >{{ $t('common.button.nextPage') }}</el-button>
      <el-button
        v-if="!isView"
        v-preventReClick
        type="primary"
        @click="nextStep('20')"
      >{{ $t('acceptanceTest.button.saveApplicationForm') }}</el-button>
      <el-button
        class="button-default"
        @click="cancel"
      >{{ $t('common.button.cancel') }}</el-button>
    </div>
    <el-dialog width="30%" class="dialog-content" :destroy-on-close="true" :close-on-click-modal="false" :visible.sync="promptVisible" :modal-append-to-body="false" append-to-body>
      <label slot="title" class="notice-title">{{ $t('common.message.tips') }}</label>
      <p>
        {{ $t('acceptanceTest.message.noticeContent') }}
      </p>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <span slot="footer">
          <el-button
            type="primary"
            class="button-primary"
            @click="nextStep('10')"
          >{{ $t('common.button.confirm2') }}</el-button>
          <el-button
            @click="promptVisible = false"
          >{{ $t('common.button.cancel') }}</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import serviceQueryConditionMixin from '@/mixins/serviceQueryConditionMixin'
import acceptanceTestApi from '@/api/interface-service/acceptanceTestApi'
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
    },
    subApplyNoList: {
      type: Array,
      default: () => []
    },
    stillApplyFlag: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      promptVisible: false,
      regressionTestList: []
    }
  },
  computed: {
    applyOrdNo() {
      return this.$store.state.service.acceptanceTestObj.commonObj.applyOrdNo
    },
    stepOneObj() {
      return this.$store.state.service.acceptanceTestObj.stepOneObj
    },
    isView() {
      return this.operationType === 'detail' || this.operationType === 'audit'
    }
  },
  created() {
    console.log('验收测试第一步')
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
    /**
     * @method: 下一步
     * @param {String} operateType 10-下一步、20-保存
     * @param {Boolean} isCheck 是否需要调用校验接口
     */
    nextStep(operateType, isCheck) {
      if (this.isView) {
        this.$emit('changeSteps', 2)
      } else {
        const checkedList = this.$refs.tableTree.getCheckedNodeList()
        if (checkedList.length === 0) {
          this.$message({
            type: 'info',
            message: this.$t('acceptanceTest.message.atLeastOneItemChecked')
          })
          return
        }
        const checkedFormKeys = []
        const checkedLeafList = checkedList.filter(e => e.isLeafFlg.name === 'YES')
        checkedLeafList.forEach(e => {
          checkedFormKeys.push(e.id)
        })
        const checkedLeafIdList = checkedLeafList.map(e => e.id)
        const params = {
          applyOrdNo: this.applyOrdNo,
          bizProcId: this.parentType,
          institutionType: this.institutionType,
          checkedMenuConfigNodeList: checkedLeafIdList,
          operateType: operateType,
          subApplyNoList: this.subApplyNoList,
          regressionTestList: this.regressionTestList,
          stillApplyFlag: this.stillApplyFlag
        }
        if (isCheck) {
          acceptanceTestApi.checkApplyPermission(params).then(res => {
            if (res.code === 'ACK') {
              this.promptVisible = true
            }
          })
        } else {
          acceptanceTestApi.saveApplyPermission(params).then(res => {
            this.promptVisible = false
            // 更新common数据
            this.$store.dispatch('service/setAcceptanceTestData', {
              commonObj: {
                applyOrdNo: res.data[0].applyOrdNo,
                checkedFormKeys: checkedFormKeys
              }
            })
            if (operateType === '20') {
              this.$message({
                type: 'success',
                message: this.$t('acceptanceTest.message.saveSuccess')
              })
              return
            } else if (operateType === '10') {
              // 更新第二步数据
              this.$store.dispatch('service/setAcceptanceTestData', {
                stepTwoObj: {
                  formList: res.data
                }
              })
              this.$emit('changeSteps', 2)
            }
          })
        }
      }
    },
    // 获取菜单配置项
    getMenuConfig() {
      const params = {
        bizProcId: this.parentType,
        levelOneList: [],
        levelTwoNameList: [],
        menuInstiType: this.institutionType,
        subApplyNoList: this.subApplyNoList,
        stillApplyFlag: this.stillApplyFlag
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
      acceptanceTestApi.getMenuConfigItem(params).then(res => {
        this.regressionTestList = res.data.regressionTestList
        const originData = res.data.nodeList
        const tableColumns = res.data.headList
        this.$store.dispatch(
          'service/setAcceptanceTestData',
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
