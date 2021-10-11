<template>
  <div class="market">
    <div class="top">
      <el-form
        ref="searchForm"
        class="top-form"
        :model="mainObj.form"
        label-width="80px"
        label-position="left"
        inline
      >
        <el-row>
          <el-col :span="10">
            <el-form-item label="市场" prop="market">
              <el-select v-model="mainObj.form.market" multiple placeholder="--全部--" clearable>
                <el-option
                  v-for="item in marketOptions"
                  :key="item.value"
                  :label="item.text"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="接口产品" prop="market">
              <el-select v-model="mainObj.form.market" multiple placeholder="--全部--" clearable>
                <el-option
                  v-for="item in marketOptions"
                  :key="item.value"
                  :label="item.text"
                  :value="item.name"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="接口用途" prop="interface">
              <el-select v-model="mainObj.form.interface" multiple placeholder="--全部--" clearable>
                <el-option
                  v-for="item in interface"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="mini" @click="onSearch">筛选</el-button>
              <el-button size="mini" @click="onReset('searchForm')">重置</el-button>
              <el-button size="mini" @click="download">下载</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="main">
      <div class="el-table el-table--fit el-table--border el-table--group el-table--scrollable-x">
        <div class="el-table__header-wrapper">
          <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" style="width: 100%;">
            <thead class="is-group has-gutter">
              <tr class="">
                <th colspan="1" rowspan="2" style="width: 190px">
                  <div class="cell">市场</div>
                </th>
                <th colspan="1" rowspan="2" style="width: 190px">
                  <div class="cell">接口用途</div>
                </th>
                <th colspan="2" rowspan="1">
                  <div class="cell">接口服务内容</div>
                </th>
              </tr>
              <tr class="">
                <th colspan="1" rowspan="1">
                  <div class="cell">接口产品</div>
                </th>
                <th colspan="1" rowspan="1">
                  <div class="cell">接口内容</div>
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
                />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="bottom">
        <div style="width: 62%">
          <p style="text-indent: 2em">
            当一个通过API提交的订单状态发生变化时，系统通过接口实时推送该订单的状态变更信息。若
            X-Swap订单撮合成交后系统会发送成交通知。
          </p>
          <p style="text-indent: 2em">
            具有匿名点击报价行情订阅权限的会员机构通过交易接口订阅/取消订阅标准债券远期深度行情，
            订阅成功后，交易中心实时向会员机构推送行情数据。订阅行情内容详见3.1.1标准债券远期私有深度行情章节。
          </p>
          <p style="text-indent: 2em">
            匿名点击的整体交易流程如下图：
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import tableTreeTd from './tableTreeTd'
import TableTree from '@/utils/table-tree'
import treeMethods from '@/utils/treeMethods'
import globalOptions from '@/utils/globalOptionsValue'
import { selectTree } from '@/api/menuConfig'
export default {
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
      tableList: [],
      tableData: [],
      treeMap: [],
      values: '',
      mainObj: {
        form: {
          market: '',
          interface: ''
        }
      },
      marketOptions: globalOptions.marketOptions,
      interface: globalOptions.MarketSubitem
    }
  },
  watch: {
    marketData(newVal) {
      this.tableData = newVal
      treeMethods.getNodeMapToChildrenList(this.tableData, this.treeMap)
      this.getTableList(this.tableData)
    }
  },
  created() {
    this.selectTree()
  },
  methods: {
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
    getTableList(treeData) {
      if (treeData) {
        const tableTree = new TableTree()
        this.values = tableTree.getValues(treeData)
        this.tableList = tableTree.run(treeData)
      }
    },
    onSearch() {
      console.log('查询')
    },
    onReset(forName) {
      console.log('forName')
    },
    download() {
      console.log('下载')
    }
  }
}
</script>

<style lang="scss" scoped>
  $mainWidth: 1220px;
  .market {
    font-family:Microsoft YaHei;
    .top {
      margin-top: 10px;
      .top-form {
        ::v-deep .el-form-item__label{
          font-size:15px;
          font-weight:400;
          color: #303030;
        }
        ::v-deep .el-input__inner {
          width: 380px;
        }
      }
    }
    .main {
      .el-table {
        .is-group {
          font-size: 15px;
          font-family: Microsoft YaHei;
          font-weight: bold;
          color: rgba(48,48,48,1);
        }
      }
    }
    .bottom {
      height: 500px;
      padding: 20px;
      display: flex;
      justify-content: center;
      border: 1px solid #dfe6ec;
      overflow-y: auto;
      border-top: none;
      p {
        color: rgba(48,48,48,1);
        font-family: Microsoft YaHei;
        line-height: 30px;
        margin: 5px 0;
      }
    }
  }
</style>
