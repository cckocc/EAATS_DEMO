<template>
  <div class="search-main">
    <el-form
      v-if="institutionType == '00'"
      ref="searchForm"
      :model="searchForm"
      class="form"
      label-position="left"
      inline
    >
      <!-- 输入框 -->
      <el-form-item prop="checkMarkets" label="市场">
        <el-select
          v-model="searchForm.checkMarkets"
          multiple
          collapse-tags
          placeholder="-- 请选择 --"
        >
          <el-option
            v-for="item in marketList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <!-- 下拉框 -->
      <el-form-item prop="interfaces" label="接口用途">
        <el-select
          v-model="searchForm.interfaces"
          multiple
          collapse-tags
          placeholder="-- 请选择 --"
        >
          <el-option
            v-for="item in interfaceList"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="interfaceProduct" label="接口产品">
        <el-select
          v-model="searchForm.interfaceProduct"
          multiple
          collapse-tags
          placeholder="-- 请选择 --"
        >
          <el-option
            v-for="item in interfaceProductList"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item>
        <el-button type="primary" style="margin-left: 10px;" @click="onSearch">查询</el-button>
        <el-button @click="onResetSearch">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form v-if="institutionType == '10'" ref="searchForm1" inline label-width="80px" :model="searchForm1" class="form" label-position="left">
      <!-- 输入框 -->
      <el-form-item prop="checkProducts" label="产品类型">
        <el-select
          v-model="searchForm1.checkProducts"
          multiple
          collapse-tags
          placeholder="-- 请选择 --"
        >
          <el-option
            v-for="item in productList"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <!-- 按钮 -->
      <el-form-item>
        <el-button type="primary" style="margin-left: 10px;" @click="onSearch">查询</el-button>
        <el-button @click="onResetSearch">重置</el-button>
      </el-form-item>
    </el-form>
    <div v-if="institutionType == '00'" class="main-table1">
      <tableTree
        ref="tableTree"
        :origin-data="market.originData"
        :table-columns="market.tableColumns"
        show-checkbox
        :show-checkbox-level="institutionType == '00' ? 3 : 2"
      />
    </div>
    <div v-if="institutionType == '10'" class="main-table2">
      <tableTree
        ref="tableTree"
        :origin-data="info.originData"
        :table-columns="info.tableColumns"
        show-checkbox
        :show-checkbox-level="institutionType == '00' ? 3 : 2"
      />
    </div>
    <div class="footer">
      <div class="footer-btn">
        <el-button @click="close()">取消</el-button>
        <el-button type="primary" @click="check()">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import serviceOpeningApi from '@/api/interface-service/serviceOpeningApi'
import { getMenuConfig, getInterfaceProductList } from '@/api/download'
import { param } from '../../../../utils'

export default {
  components: {},
  props: {
    institutionType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      marketList: [],
      interfaceList: [],
      interfaceProductList: [],
      productList: [],
      searchForm: {
        checkMarkets: [],
        interfaces: [],
        interfaceProduct: []
      },
      searchForm1: {
        checkProducts: []
      },
      nodeIds: [],
      market: {
        originData: [],
        tableColumns: []
      },
      info: {
        originData: [],
        tableColumns: []
      }
    }
  },
  computed: {
    // stepOneObj() {
    //   return this.$store.state.service.serviceOpeningObj.stepOneObj
    // }
  },
  created() {
    if (this.institutionType === '00') {
      this.getMarketMarket()
      this.getMarketInterface()
      this.getInterfaceProductList()
    } else if (this.institutionType === '10') {
      this.getInformationProduct()
    }
    this.getMenuConfig()
  },
  mounted() {},
  methods: {
    // 获取菜单配置项
    getMenuConfig() {
      const params = {
        levelOneList: [],
        levelTwoNameList: [],
        levelThreeList: [],
        menuInstiType: this.institutionType
      }
      if (this.institutionType == '00') {
        params.levelOneList = this.searchForm.checkMarkets
        params.levelTwoNameList = this.searchForm.interfaces
        params.levelThreeList = this.searchForm.interfaceProduct
      } else if (this.institutionType == '10') {
        params.levelTwoNameList = this.searchForm1.checkProducts
      }
      getMenuConfig(params).then(res => {
        const originData = res.data.nodeList
        const tableColumns = res.data.headList
        if (this.institutionType == '00') {
          this.market.originData = originData
          this.market.tableColumns = tableColumns
        } else if (this.institutionType == '10') {
          this.info.originData = originData
          this.info.tableColumns = tableColumns
        }
      })
    },
    // 获取市场机构-所有市场
    getMarketMarket() {
      const params = {}
      serviceOpeningApi.getMarketMarket(params).then(res => {
        console.log(res)
        this.marketList = res.data
      })
    },
    // 获取市场机构-所有接口用途
    getMarketInterface() {
      const params = {}
      serviceOpeningApi.getMarketUsage(params).then(res => {
        this.interfaceList = res.data
      })
    },
    // 获取市场机构-所有接口产品
    getInterfaceProductList() {
      getInterfaceProductList().then(res => {
        console.log(res, 'test')

        this.interfaceProductList = res.data
      })
    },
    // 获取信息商-所有产品类型
    getInformationProduct() {
      const params = {}
      serviceOpeningApi.getInformationProduct(params).then(res => {
        this.productList = res.data
      })
    },
    // 查询表格
    onSearch() {
      this.getMenuConfig()
    },
    // 重置查询表单
    onResetSearch() {
      if (this.institutionType == '00') {
        this.searchForm.checkMarkets = []
        this.searchForm.interfaces = []
        this.searchForm.interfaceProduct = []
      } else if (this.institutionType == '10') {
        this.searchForm1.checkProducts = []
      }
      this.getMenuConfig()
    },
    // 筛选
    check() {
      // if(this.institutionType == '00') {
      const checkedList = this.$refs.tableTree.getCheckedNodeList()
      // console.log(checkedList, 'check');
      const checkedFinalList = checkedList.filter(e => e.isLeafFlg.name === 'YES')
      // console.log(checkedFinalList, 'final');
      this.nodeIds = checkedFinalList.map(e => e.id)
      // console.log(this.nodeIds, 'ids');
      // }
      this.$emit('searchList').$nextTick(() => {
        this.$emit('closeDrawer')
      })
    },
    // 关闭抽屉
    close() {
      this.onResetSearch()
      this.$emit('closeDrawer')
    }
  }
}
</script>
<style lang="scss" scoped>
.search-main {
  // padding: 11px 24px;
  .form {
    background: #FAFBFD;
    padding: 0 24px;
    min-height: 62px;
    margin-bottom: 16px;
    /deep/.el-button--primary {
      height: 30px;
    }
    /deep/.el-button--default {
      height: 30px;
    }
    /deep/.el-button--medium {
      padding: 0 20px;
    }
  }
  .main-table1 {
    margin: 0 24px 40px;
    /deep/.el-table__body-wrapper {
      height: calc(100vh - 385px) !important;
    }
  }
  .main-table2 {
    margin: 0 24px 40px;
    /deep/.el-table__body-wrapper {
      height: calc(100vh - 340px) !important;
    }
  }
  /deep/.el-table {
    // height: calc(100vh - 235px);
    // height: calc(100vh - 300px);
    // overflow: auto;
    &::before {
      height: 0 !important;
    }
    .td-container {
      span {
        width: 100%;
        word-wrap: break-word;
      }
    }
  }
  /deep/.el-checkbox__input {
    width: 17px !important;
  }
  /deep/.el-checkbox {
    .el-checkbox__label {
      width: calc(100% - 20px) !important;
    }
  }
  /deep/.el-form-item {
    margin-top: 16px;
    margin-bottom: 16px;
  }
  /deep/.el-form-item__content {
    width: 206px;
  }
  .footer {
    height: 60px;
    border-top: 1px solid #e6e6e6;
  }
  .footer-btn {
    float: right;
    // margin-top: 42px;
    margin: 20px 24px 0 0;
  }
}
::v-deep .el-select__tags-text {
  display: inline-block;
  max-width: 76px;
  overflow: hidden;
  text-overflow:ellipsis;
  white-space: nowrap;
}
// ::v-deep .el-select .el-tag__close.el-icon-close {
//   right: -5px;
//   top: -5px;
// }
</style>
