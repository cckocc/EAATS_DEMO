<template>
  <div>
    <div class="p20" style="position: relative;">
      <div v-if="operationType === 'edit'" class="edit-btn">
        <el-button type="primary" @click="isEdit = !isEdit">{{ isEdit ? '取消编辑' : '编辑' }}</el-button>
      </div>
      <el-form ref="form" :model="dimensionForm" :disabled="operationType === 'detail' || !isEdit" label-width="260px">
        <!-- <h2>流程基础页面展示维度配置</h2>
        <el-divider />
        <el-form-item label="服务开通基础信息页面展示维度">
          <el-select v-model="dimensionForm.serviceOpen" value-key="column" placeholder="请选择">
            <el-option v-for="item in dimensionThList" :key="item.column" :label="item.headName" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="接口上线（权限变更）页面展示维度">
          <el-select v-model="dimensionForm.interfacePop" value-key="column" placeholder="请选择">
            <el-option v-for="item in dimensionThList" :key="item.column" :label="item.headName" :value="item" />
          </el-select>
        </el-form-item> -->
        <!-- <el-form-item label="权限变更页面展示维度">
          <el-select v-model="dimensionForm.jurisdictionChange" value-key="column" placeholder="请选择">
            <el-option v-for="item in dimensionThList" :key="item.column" :label="item.headName" :value="item" />
          </el-select>
        </el-form-item> -->
        <h2>验收测试功能模块指向列数配置</h2>
        <el-divider />
        <!-- <el-row :gutter="20" class="mb10">
          <el-col :span="6">请选择市场</el-col>
          <el-col :span="6">功能模块指向列数</el-col>
          <el-col :span="4" />
        </el-row>
        <el-row v-for="(item, index) in dimensionForm.acceptanceTest" :key="index" :gutter="20">
          <el-col :span="6">
            <el-form-item label="" label-width="0">
              <el-select v-model="item.market" value-key="id" style="width: 100%" placeholder="请选择" multiple>
                <el-option v-for="market in marketList" :key="market.id" :label="market.nodeName" :value="market" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="" label-width="0">
              <el-select v-model="item.functionPoint" value-key="column" style="width: 100%" placeholder="请选择">
                <el-option v-for="dimension in dimensionThList" :key="dimension.column" :label="dimension.headName" :value="dimension" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button v-if="operationType === 'edit'" type="primary" icon="el-icon-minus" circle @click="deleteColumn(index)" />
          </el-col>
        </el-row>
        <el-button v-if="operationType === 'edit'" type="primary" icon="el-icon-plus" circle @click="addColumn" /> -->
        <el-table
          :data="dimensionForm.acceptanceTest"
          style="width: 100%"
          fit
          stripe
          border
          highlight-current-row
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center" width="55" />
          <el-table-column show-overflow-tooltip prop="market" label="请选择市场" align="center" min-width="300">
            <template slot-scope="scope">
              <span>{{ scope.row.market ? scope.row.market.nodeName : null }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" fixed="right" width="180">
            <template slot="header" slot-scope="scope">
              <el-button type="primary" @click="showDialog">批量配置</el-button>
            </template>
            <template slot-scope="scope">
              <el-select v-model="scope.row.functionPoint" value-key="column" placeholder="请选择" clearable>
                <el-option v-for="item in dimensionTableThList" :key="item.column" :label="item.headName" :value="item" />
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </div>
    <div class="btn-container">
      <el-button
        v-preventReClick
        type="primary"
        @click="prevStepSave"
      >
        上一步
      </el-button>
      <el-button
        v-preventReClick
        type="primary"
        @click="nextStepSave"
      >
        下一步
      </el-button>
      <el-button
        class="button-default"
        @click="cancel"
      >
        返回列表页
      </el-button>
      <el-button
        v-if="operationType === 'edit'"
        v-preventReClick
        type="primary"
        @click="save(true)"
      >
        保存
      </el-button>
    </div>
    <!-- 批量配置展示维度弹窗 -->
    <el-dialog
      width="658px"
      :title="dialogObj.title"
      :visible.sync="dialogObj.visible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      destroy-on-close
      append-to-body
      @close="closeDialog"
    >
      <el-form ref="form" :model="dialogObj.form" label-width="160px">
        <el-form-item label="功能模块指向列数">
          <el-select v-model="dialogObj.form.functionPoint" value-key="column" placeholder="请选择">
            <el-option v-for="item in dimensionTableThList" :key="item.column" :label="item.headName" :value="item" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="text-center">
        <span slot="footer">
          <el-button
            type="primary"
            class="button-primary"
            @click="onConfirm"
          >
            确定
          </el-button>
          <el-button
            class="button-default"
            @click="closeDialog"
          >
            取消
          </el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import menuConfigApi from '@/api/grip-manage/menuConfigApi'
export default {
  props: {
    institutionType: {
      type: String,
      default: ''
    },
    operationType: {
      type: String,
      default: 'add'
    },
    currentRow: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isEdit: false,
      dimensionForm: {
        // serviceOpen: '',
        // interfacePop: '',
        // jurisdictionChange: '',
        acceptanceTest: []
      },
      dimensionThList: [],
      dimensionTableThList: [],
      marketList: [],
      multipleSelection: [],
      dialogObj: {
        visible: false,
        title: '批量配置',
        form: {
          functionPoint: null
        }
      }
    }
  },
  created() {
    // this.getDimensionThList()
    this.getDimensionTableThList()
    // this.getMarketList()
    this.getDimensionConfig()
  },
  methods: {
    prevStepSave() {
      if (this.operationType !== 'detail') {
        this.save().then(() => {
          this.prevStep()
        })
      } else {
        this.prevStep()
      }
    },
    nextStepSave() {
      if (this.operationType !== 'detail') {
        this.save().then(() => {
          this.nextStep()
        })
      } else {
        this.nextStep()
      }
    },
    prevStep() {
      this.$emit('changeSteps', 3)
    },
    nextStep() {
      this.$emit('changeSteps', 5)
    },
    cancel() {
      this.$emit('close')
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    showDialog() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: 'info',
          message: `请先勾选需要配置验收测试功能模块指向列数的市场`
        })
        return
      }
      this.dialogObj.visible = true
    },
    closeDialog() {
      this.dialogObj.visible = false
    },
    onConfirm() {
      this.dimensionForm.acceptanceTest.map(e => {
        const has = this.multipleSelection.findIndex(select => select.market.id === e.market.id)
        if (has > -1) {
          e.functionPoint = this.dialogObj.form.functionPoint
        }
        return e
      })
      this.closeDialog()
    },
    save(isShowMessage) {
      return new Promise((resolve, reject) => {
        const loading = this.$loading({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        })
        this.dimensionForm.acceptanceTest.map(e => {
          if (e.functionPoint === '') {
            e.functionPoint = null
          }
          return e
        })
        const params = {
          recordId: this.currentRow.id
        }
        Object.assign(params, this.dimensionForm)
        menuConfigApi.saveDimensions(params).then(res => {
          loading.close()
          if (res.code === 'ACK') {
            if (isShowMessage) {
              this.$message({
                message: res.message,
                type: 'success'
              })
            }
            this.getDimensionConfig()
            this.$emit('onSearch')
            resolve()
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        }).catch(() => {
          loading.close()
        })
      })
    },
    addColumn() {
      this.dimensionForm.acceptanceTest.push({
        market: [],
        functionPoint: ''
      })
    },
    deleteColumn(index) {
      this.dimensionForm.acceptanceTest = this.dimensionForm.acceptanceTest.filter((e, i) => i !== index)
    },
    getDimensionThList() {
      const params = {
        recordId: this.currentRow.id
      }
      menuConfigApi.getDimensionThList(params).then(res => {
        if (res.code === 'ACK') {
          this.dimensionThList = res.data
        }
      })
    },
    getDimensionTableThList() {
      const params = {
        recordId: this.currentRow.id
      }
      menuConfigApi.getDimensionTableThList(params).then(res => {
        if (res.code === 'ACK') {
          this.dimensionTableThList = res.data
        }
      })
    },
    getMarketList() {
      const params = {
        recordId: this.currentRow.id,
        nodeIds: ''
      }
      menuConfigApi.getMarketList(params).then(res => {
        if (res.code === 'ACK') {
          this.marketList = res.data
        }
      })
    },
    getDimensionConfig() {
      const params = {
        recordId: this.currentRow.id
      }
      menuConfigApi.getDimensionConfig(params).then(res => {
        if (res.code === 'ACK') {
          this.dimensionForm.acceptanceTest = res.data.acceptanceTest
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .edit-btn {
    position: absolute;
    top: 25px;
    right: 10px;
  }
</style>
