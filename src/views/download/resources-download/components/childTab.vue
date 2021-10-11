<template>
  <div>
    <div class="el-table el-table--fit el-table--border el-table--group el-table--scrollable-x">
      <div class="el-table__header-wrapper">
        <table
          cellspacing="0"
          cellpadding="0"
          border="0"
          class="el-table__header"
          style="width: 100%;"
        >
          <thead class="table-tree-head">
            <tr>
              <th>
                <div class="cell">用户类型</div>
              </th>
              <th>
                <div class="cell">接口产品</div>
              </th>
              <th>
                <div class="cell">市场</div>
              </th>
              <th>
                <div class="cell">接口用途</div>
              </th>
              <th>
                <div class="cell">业务指引</div>
              </th>
              <th>
                <div class="cell">开发指引</div>
              </th>
              <th>
                <div class="cell">接口开发包</div>
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <div class="el-table__body-wrapper">
        <table
          cellspacing="0"
          cellpadding="0"
          border="0"
          class="el-table__body"
          style="width: 100%;"
        >
          <tbody>
            <tr v-for="(item,index) in tableList" :key="index" class="el-table__row">
              <tableTreeTd
                v-for="(t,i) in values"
                :key="i"
                :depth="values.length"
                :value="t"
                :item="item"
              />
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import tableTreeTd from './tableTreeTd'
import TableTree from '@/utils/table-tree'
import treeMethods from '@/utils/treeMethods'
export default {
  name: 'ChildTab',
  components: {
    tableTreeTd
  },
  props: {
    resourcesData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tableList: [],
      tableData: [],
      treeMap: [],
      values: [],
      lastLevel: 1
    }
  },
  watch: {
    resourcesData: {
      handler(newVal) {
        this.tableData = JSON.parse(JSON.stringify(newVal))
        treeMethods.getNodeMapToChildrenList(this.tableData, this.treeMap)
        this.getTableList(this.tableData)
      },
      deep: true
    }
  },
  created() {},
  methods: {
    getTableList(treeData) {
      if (treeData) {
        const tableTree = new TableTree()
        this.values = tableTree.getValues(treeData)
        this.tableList = tableTree.run(treeData)
        console.log(this.tableList)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
