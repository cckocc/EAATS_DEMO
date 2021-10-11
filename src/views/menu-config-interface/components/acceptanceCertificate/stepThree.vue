<template>
  <div>
    <div>
      <el-tabs v-if="type === 'view'" v-model="tabActiveName" class="custom-minor-tabs" style="margin: 0 10px 10px;">
        <el-tab-pane
          v-for="item in tabList"
          :key="item.name"
          :label="item.label"
          :name="item.name"
        />
      </el-tabs>
      <tableTree
        v-if="type !== 'view'"
        ref="tableTree"
        :origin-data="nodeListLocal"
        :table-columns="headListLocal"
        extra-column
        :height="autoHeight"
        :extra-column-obj="extraColumnObj"
      >
        <template v-slot:title="{ node }">
          <span v-if="node.nodeType === 'extra'" class="tips">{{
            node.name
          }}</span>
        </template>

        <template v-slot:node="{ node }">
          <div v-if="node.nodeType === 'extra'">
            <div
              v-for="(item, index) in node.saveDetailList"
              :key="index"
              :class="{ mt10: index > 0 }"
              class="el-input-container"
              @mouseenter="item.removeHide = false"
              @mouseleave="item.removeHide = true"
            >
              <el-input v-model="item.scopeName" class="el-input-control" :maxlength="100" placeholder="输入中文验收菜单" />
              <el-input v-model="item.fullEnName" class="el-input-control" :maxlength="100" placeholder="输入英文验收菜单" />
              <transition name="fade">
                <i
                  v-if="!item.removeHide"
                  class="el-icon-remove remove-button"
                  @click="removeInputTextBox(node.saveDetailList, index)"
                />
              </transition>
              <div class="clear" />

            </div>
            <i
              class="el-icon-circle-plus add-button"
              @click="appendInputTextBox(node.saveDetailList)"
            /></div>
        </template>
      </tableTree>
      <tableTree
        v-else
        ref="tableTree"
        :origin-data="nodeListLocal"
        :table-columns="headListLocal"
        :height="autoHeight"
        :extra-column-obj="extraColumnObj"
        extra-column
      >
        <template v-slot:node="{ node }">
          <div v-if="node.nodeType === 'extra'" class="">
            <div v-for="item in node.saveDetailList" :key="item.sort">{{ tabActiveName === 'ch' ? item.scopeName : item.fullEnName }}</div>
          </div>
        </template>
      </tableTree>
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
      nodeListLocal: [],
      headListLocal: [],
      testScopeListLocal: [],
      extraColumnObj: {
        columns: [
          {
            id: null,
            nodeType: 'extra',
            name: '验收菜单配置',
            rowSpan: 1,
            colSpan: 3
          }
        ],
        list: []
      }
    }
  },
  async created() {
    await this.loadData()
    this.initExtraColumn()
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
      const result = await menuConfigApi.getAcceptanceTestScopeData(params)

      if (result.code === 'ACK') {
        this.nodeListLocal = result.data.nodeList
        this.headListLocal = result.data.headList
        this.testScopeListLocal = result.data.testScopeList
      }
    },
    async nextStep() {
      if (this.type !== 'view') {
        const extraNodelist = this.$refs.tableTree.getExtraNodeList()
        const testScopeListData = []
        extraNodelist.forEach(element => {
          const newElement = {
            nodeId: element[0].nodeId,
            saveDetailList: element[0].saveDetailList
          }
          if (newElement.nodeId) {
            testScopeListData.push(newElement)
          }
        })
        const data = {
          ...this.receiptBasicData,
          testScopeSaveDtoList: testScopeListData
        }
        const result = await menuConfigApi.saveAcceptanceTestScopeData(data)
        if (result.code === 'ACK') {
          this.$emit('nextStep')
        }
      } else {
        this.$emit('nextStep')
      }
    },
    cancel() {
      this.$emit('cancel')
    },
    initExtraColumn() {
      const array = []
      this.testScopeListLocal.forEach((o) => {
        o.saveDetailList.forEach((item) => {
          this.$set(item, 'removeHide', true)
        })

        array.push([o])
      })
      this.extraColumnObj.list = array
    },
    appendInputTextBox(list) {
      let maxSort = 0
      if (list.length > 0) {
        maxSort = Math.max(
          ...list.map((o) => {
            return o.sort
          })
        )
      }
      list.push({ scopeName: '', fullEnName: '', sort: maxSort + 1, removeHide: true })
    },
    removeInputTextBox(list, sort) {
      list.splice(sort, 1)
    }
  }
}
</script>

<style scoped>
.add-button {
  margin-top: 10px;
  font-size: 20px;
  color: rgb(44, 118, 209);
  cursor: pointer;
  float: left;
  clear: both;
}
.remove-button {
  position: relative;
  display: block;
  float: right;
  font-size: 20px;
  margin: 5px 0;
  color: rgb(44, 118, 209);
  cursor: pointer;
}
.el-input-container{
  width: 355px;
}
.el-input-control {
  width: 160px;
  margin-right:5px;
  display: block;
  float: left;
}
.clear {
  clear: both;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to{
  opacity: 0;
}
</style>
