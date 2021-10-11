<template>
  <div>
    <div>
      <tableTree
        ref="tableTree"
        :origin-data="nodeListLocal"
        :table-columns="headListLocal"
        :height="autoHeight"
        :show-checkbox="isEdit"
      />
    </div>
    <div class="btn-container">
      <el-button v-preventReClick type="primary" @click="previousStep">
        上一步
      </el-button>
      <el-button v-preventReClick type="primary" @click="nextStep">
        下一步
      </el-button>
      <el-button class="button-default" @click="cancel"> 返回列表页 </el-button>
    </div>
  </div>
</template>

<script>
import menuConfigApi from '@/api/grip-manage/menuConfigApi'
export default {
  props: {
    type: {
      type: String,
      default: ''
    },
    receiptBasicData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      autoHeight: 100,
      isEdit: true,
      nodeListLocal: [],
      headListLocal: []
    }
  },
  created() {
    this.loadData()
    this.isEdit = this.type !== 'view'
  },
  mounted() {
    this.autoHeight = this.$root.$el.clientHeight - 380
  },
  methods: {
    previousStep() {
      this.$emit('previousStep')
    },
    async loadData() {
      const params = {
        formId: this.receiptBasicData.id,
        formVersion: this.receiptBasicData.formVersion
      }
      let result
      if (this.type !== 'view') {
        result = await menuConfigApi.getAcceptanceInterfaceData(params)
      } else {
        result = await menuConfigApi.viewAcceptanceInterfaceData(params)
      }
      if (result.code === 'ACK') {
        this.nodeListLocal = result.data.nodeList
        this.headListLocal = result.data.headList
      }
    },
    async saveData() {
      const checkedList = this.$refs.tableTree.getCheckedNodeList()
      const checkedLeafList = checkedList.filter((e) => e.isLeafFlg.name === 'YES')
      const checkedLeafIdList = checkedLeafList.map((e) => e.id)

      if (checkedLeafIdList.length === 0) {
        this.$message.error('至少勾选一个接口')
        return
      }
      const data = {
        formType: this.receiptBasicData.formType,
        formVersion: this.receiptBasicData.formVersion,
        id: this.receiptBasicData.id,
        nodeIdList: checkedLeafIdList
      }

      return await menuConfigApi.saveAcceptanceInterfaceData(data)
    },
    async nextStep() {
      if (this.type !== 'view') {
        const result = await this.saveData()
        if (result.code === 'ACK') {
          this.$emit('nextStep', result.data)
        }
      } else {
        this.$emit('nextStep')
      }
    },
    cancel() {
      if (this.type !== 'view') {
        this.$confirm(
          '退出前是否保存?',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          this.saveData().then(result => {
            if (result.code === 'ACK') {
              this.$message.success('保存成功')
              this.$emit('cancel')
            }
          })
        }).catch(() => {

        })
      } else {
        this.$emit('cancel')
      }
    }
  }
}

</script>

<style scoped>
</style>
