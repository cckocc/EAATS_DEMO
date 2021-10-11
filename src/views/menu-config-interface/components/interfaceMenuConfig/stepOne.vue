<template>
  <div>
    <div>
      <el-tabs v-model="tabActiveName" class="custom-minor-tabs" style="margin: 0 10px 10px;">
        <el-tab-pane
          v-for="item in tabList"
          :key="item.name"
          :label="item.label"
          :name="item.name"
        />
      </el-tabs>
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
          <span v-else>{{ tabActiveName === 'ch' ? node.nodeName : node.fullEnName }}</span>
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
    currentRow: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      autoHeight: 100,
      tabActiveName: 'ch',
      tabList: [
        {
          label: '中文',
          name: 'ch'
        },
        {
          label: '英文',
          name: 'en'
        }
      ],
      tableColumns: [],
      originData: [],
      configInfoList: [],
      defaultProps: {
        children: 'childrenList',
        label: 'name'
      },
      extraColumnObj: {
        columns: [
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
            name: '服务开通审核',
            rowspan: 1,
            colspan: 1
          },
          {
            id: null,
            nodeType: 'extra',
            name: '网络开通审核',
            rowspan: 1,
            colspan: 1
          },
          {
            id: null,
            nodeType: 'extra',
            name: '验收测试审核',
            rowspan: 1,
            colspan: 1
          },
          {
            id: null,
            nodeType: 'extra',
            name: '接口上线审核',
            rowspan: 1,
            colspan: 1
          },
          {
            id: null,
            nodeType: 'extra',
            name: '权限变更审核',
            rowspan: 1,
            colspan: 1
          },
          {
            id: null,
            nodeType: 'extra',
            name: 'ISV服务开通审核',
            rowspan: 1,
            colspan: 1
          },
          {
            id: null,
            nodeType: 'extra',
            name: 'ISV网络开通审核',
            rowspan: 1,
            colspan: 1
          },
          {
            id: null,
            nodeType: 'extra',
            name: 'ISV验收测试审核',
            rowspan: 1,
            colspan: 1
          }
        ],
        list: []
      }
    }
  },
  created() {
    this.getMenuConfigDetail()
  },
  mounted() {
    this.autoHeight = this.$root.$el.clientHeight - 420
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
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .btn-group {
    height: 60px;
    line-height: 60px;
    padding-left: 10px;
  }
  .group-audit-select{
    ::v-deep.el-select__tags-text{
    max-width:400px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
    float: left;
  }
  }
</style>
