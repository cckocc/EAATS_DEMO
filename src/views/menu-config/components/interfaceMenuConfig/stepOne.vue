<template>
  <div>
    <div>
      <tableTree
        ref="tableTree"
        :origin-data="originData"
        :table-columns="tableColumns"
        :height="autoHeight"
        :extra-column-obj="extraColumnObj"
        extra-column
      >
        <template v-slot:node="{ node }">
          <span v-if="node.nodeType">{{ node.value }}</span>
          <span v-else>{{ node.nodeName }}</span>
        </template>
      </tableTree>
    </div>
    <div class="btn-container">
      <el-button
        v-preventReClick
        type="primary"
        @click="nextStep"
      >
        下一步
      </el-button>
      <el-button
        class="button-default"
        @click="cancel"
      >
        返回列表页
      </el-button>
    </div>
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
      autoHeight: 100,
      tableColumns: [],
      originData: [],
      configInfoList: [],
      marketColumns: [
        {
          id: null,
          nodeType: 'extra',
          name: '机构身份',
          rowspan: 1,
          colspan: 1
        },
        {
          id: null,
          nodeType: 'extra',
          name: '服务开通审核部门',
          rowspan: 1,
          colspan: 1
        },
        {
          id: null,
          nodeType: 'extra',
          name: '验收测试审核部门',
          rowspan: 1,
          colspan: 1
        },
        {
          id: null,
          nodeType: 'extra',
          name: '验收报告审核部门',
          rowspan: 1,
          colspan: 1
        },
        {
          id: null,
          nodeType: 'extra',
          name: '服务上线审核部门',
          rowspan: 1,
          colspan: 1
        },
        {
          id: null,
          nodeType: 'extra',
          name: '权限变更审核部门',
          rowspan: 1,
          colspan: 1
        },
        {
          id: null,
          nodeType: 'extra',
          name: '接口终止审核部门',
          rowspan: 1,
          colspan: 1
        },
        {
          id: null,
          nodeType: 'extra',
          name: 'ISV服务开通审核部门',
          rowspan: 1,
          colspan: 1
        },
        {
          id: null,
          nodeType: 'extra',
          name: 'ISV验收测试审核部门',
          rowspan: 1,
          colspan: 1
        },
        {
          id: null,
          nodeType: 'extra',
          name: 'ISV验收报告审核部门',
          rowspan: 1,
          colspan: 1
        }
      ],
      iiqColumns: [
        {
          id: null,
          nodeType: 'extra',
          name: '机构身份',
          rowspan: 1,
          colspan: 1
        },
        {
          id: null,
          nodeType: 'extra',
          name: '服务开通审核部门',
          rowspan: 1,
          colspan: 1
        },
        {
          id: null,
          nodeType: 'extra',
          name: '验收测试审核部门',
          rowspan: 1,
          colspan: 1
        },
        {
          id: null,
          nodeType: 'extra',
          name: '验收报告审核部门',
          rowspan: 1,
          colspan: 1
        },
        {
          id: null,
          nodeType: 'extra',
          name: '服务上线审核部门',
          rowspan: 1,
          colspan: 1
        },
        {
          id: null,
          nodeType: 'extra',
          name: '权限变更审核部门',
          rowspan: 1,
          colspan: 1
        },
        {
          id: null,
          nodeType: 'extra',
          name: '接口终止审核部门',
          rowspan: 1,
          colspan: 1
        }
      ],
      extraColumnObj: {
        columns: [],
        list: []
      }
    }
  },
  created() {
    if (this.institutionType === '00') {
      this.extraColumnObj.columns = this.marketColumns
    } else if (this.institutionType === '10') {
      this.extraColumnObj.columns = this.iiqColumns
    }
    this.getMenuConfigDetail()
  },
  mounted() {
    this.autoHeight = this.$root.$el.clientHeight - 380
  },
  methods: {
    nextStep() {
      this.$emit('changeSteps', 2)
    },
    cancel() {
      this.$emit('close')
    },
    getMenuConfigDetail() {
      const params = {
        recordId: this.currentRow.id
      }
      menuConfigApi.getMenuConfigDetail(params).then(res => {
        // console.log(res.data)
        if (res.code === 'ACK') {
          this.originData = res.data.nodeList
          this.tableColumns = res.data.headList
          this.configInfoList = res.data.configInfoList
          this.extraColumnObj.list = []
          this.configInfoList.forEach((tr, trIndex) => {
            const trTemp = []
            tr.forEach((e, index) => {
              trTemp.push({
                nodeType: 'extra',
                id: `extra-${trIndex}-${index}`,
                colspan: 1,
                rowspan: 1,
                pNodeId: e.id,
                nodeName: `extra-${trIndex}-${index}`,
                value: e
              })
            })
            this.extraColumnObj.list.push(trTemp)
          })
          // console.log(this.extraColumnObj.list)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
