<template>
  <div v-loading.fullscreen.lock="loading" class="market-tab" element-loading-text="正在发布，请稍后">
    <div class="el-table el-table--fit el-table--border el-table--group el-table--scrollable-x">
      <div class="el-table__header-wrapper">
        <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" style="width: 100%;">
          <thead class="is-group has-gutter">
            <tr class="">
              <th colspan="1" rowspan="2">
                <div class="cell">市场</div>
              </th>
              <th colspan="1" rowspan="2">
                <div class="cell">接口用途</div>
              </th>
              <th :colspan="lastLevel + 1" rowspan="1">
                <div class="cell text-center">接口服务</div>
              </th>
            </tr>
            <tr class="">
              <th colspan="1" rowspan="1">
                <div class="cell">接口产品</div>
              </th>
              <th :colspan="lastLevel" rowspan="1">
                <div class="cell">服务内容</div>
              </th>
            </tr>
          </thead>
        </table>
      </div>
      <div class="el-table__body-wrapper">
        <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" style="width: 100%;">
          <tbody>
            <tr v-for="(item,index) in tableList" :key="index" class="el-table__row">
              <tableTreeTd
                v-for="(t,i) in values"
                :key="i"
                :depth="values.length"
                :value="t"
                :item="item"
                @changeNode="changeNode"
                @contextmenu.prevent.native="openMenu(t,$event,item)"
              />
            </tr>
            <tr style="visibility: collapse;">
              <td v-for="level of (lastLevel + 3)" :key="level" />
              <!-- <td />
              <td />
              <td />
              <td />
              <td />
              <td />
              <td />
              <td /> -->
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="footer">
      <el-button
        v-preventReClick
        type="primary"
        class="button-primary"
        @click="release"
      >发布</el-button>
      <el-button class="button-default" @click="cancle">取消</el-button>
    </div>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li v-preventReClick @click="addNode(selectedTag)">增加</li>
      <li v-preventReClick @click="deleteNode(selectedTag)">删除</li>
    </ul>
  </div>
</template>

<script>
import tableTreeTd from './tableTreeTd'
import TableTree from '@/utils/table-tree'
import treeMethods from '@/utils/treeMethods'
import { selectTree, publishTree } from '@/api/menuConfig'
import { getTreeMaxLevel } from '@/utils'
export default {
  name: 'MarketTab',
  components: {
    tableTreeTd
  },
  props: {
    marketData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      loading: false,
      tableList: [],
      tableData: [],
      treeMap: [],
      values: [],
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {},
      selectedItem: {},
      lastLevel: 1
    }
  },
  computed: {

  },
  watch: {
    marketData(newVal) {
      this.tableData = newVal
      treeMethods.getNodeMapToChildrenList(this.tableData, this.treeMap)
      const maxLevel = getTreeMaxLevel(this.tableData)
      this.lastLevel = (maxLevel - 3) > 0 ? (maxLevel - 3) : 1
      this.getTableList(this.tableData)
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  created() {
    this.selectTree()
  },
  methods: {
    // 市场机构数据交互
    selectTree() {
      const params = {
        menuInstiType: 'MARKET'
      }
      selectTree(params).then(res => {
        if (res.code === 'ACK') {
          this.tableData = res.data
          localStorage.setItem('marketDataTemp', JSON.stringify(this.tableData))
          treeMethods.getNodeMapToChildrenList(this.tableData, this.treeMap)
          this.getTableList(this.tableData)
        }
      })
    },

    /* 增加树节点 */
    async addNode(node) {
      if (node.nodeLevel > 5) {
        await treeMethods.handlerMarketInsert(this.values, node, this.treeMap)
      } else {
        await treeMethods.handlerInsert(this.values, node, this.treeMap)
      }
      this.getTableList(this.tableData)
      console.log('this.tableData', this.tableData)
    },

    /* 删除树节点 */
    deleteNode(node) {
      if (node.nodeLevel > 4) {
        treeMethods.deleteMarketNode(node, this.treeMap)
      } else {
        treeMethods.deleteNode(node, this.treeMap, this.values)
      }
      this.getTableList(this.tableData)
    },

    /* 修改树节点 */
    changeNode(node) { // 获取子组件改变的节点数据 node = {id: '', text: ''}
      this.changeNodeById(this.tableData, node)
      this.getTableList(this.tableData)
    },
    changeNodeById(tree, node) { // 将改变的数据更新到tableData
      for (let i = 0; i < tree.length; i++) {
        if (tree[i].id === node.id) {
          tree[i].nodeName = node.text
          break
        } else if (tree[i].chidrenList !== null) {
          this.changeNodeById(tree[i].chidrenList, node)
        }
      }
    },

    getTableList(treeData) {
      if (treeData) {
        const tableTree = new TableTree()
        this.values = tableTree.getValues(treeData)
        this.tableList = tableTree.run(treeData)
      }
    },
    release() {
      const params = {
        menuDtoList: this.tableData,
        menuInstiType: 'MARKET'
      }
      this.loading = true
      publishTree(params).then(res => {
        if (res.code === 'ACK') {
          this.loading = false
          this.$message({
            message: '已新增接口，请联系开发配置审核部门',
            type: 'success'
          })
          localStorage.setItem('marketDataTemp', JSON.stringify(this.tableData)) // 将发布成功的数据保存到localStorage
        }
      })
    },
    cancle() {
      const tableDataTemp = localStorage.getItem('marketDataTemp')
      this.tableData = JSON.parse(tableDataTemp)
      treeMethods.getNodeMapToChildrenList(this.tableData, this.treeMap)
      this.getTableList(this.tableData)
      this.$message({
        message: '操作成功',
        type: 'success'
      })
    },
    openMenu(tag, e, item) {
      const menuMinWidth = 122
      const menuMinHeight = 134
      const offsetLeft = this.$el.getBoundingClientRect().left
      const offsetTop = this.$el.getBoundingClientRect().top
      const offsetWidth = this.$el.offsetWidth
      const offsetHeight = this.$el.offsetHeight
      const maxLeft = offsetWidth - menuMinWidth
      const left = e.clientX - offsetLeft
      const maxTop = offsetHeight - menuMinHeight
      const top = e.clientY - offsetTop

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      if (top > maxTop) {
        this.top = maxTop
      } else {
        this.top = top
      }
      this.visible = true
      this.selectedTag = this.getItemValue(tag, item)
    },
    getItemValue(value, item) {
      const option = {}
      Object.keys(item).forEach(key => {
        const arr = key.split('_')
        const keyName = arr[0]
        const index = arr[arr.length - 1] * 1
        if (index === value) {
          option[keyName] = item[key]
        }
      })
      return option
    },
    closeMenu() {
      this.visible = false
    }
  }
}
</script>

<style lang="scss" scoped>
.market-tab {
  .is-group {
    font-size: 15px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: rgba(48,48,48,1);
  }
  .footer {
    text-align: center;
    display: block;
    margin-top: 40px;
  }
  .contextmenu {
    margin: 0;
    width: 122px;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 10px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow:0 1px 3px rgba(209,213,222,0.8);
    li {
      margin: 0;
      padding: 11px 20px;
      font-size: 14px;
      color: #303030;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
