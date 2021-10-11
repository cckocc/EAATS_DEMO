import serviceOpeningApi from '@/api/interface-service/serviceOpeningApi'
export default {
  data() {
    return {
      showMarket: false,
      showInterface: false,
      showProduct: false,
      checkMarketList: [],
      checkInterfaceList: [],
      checkProductList: [],
      marketList: [],
      interfaceList: [],
      productList: [],
      checkList: []
    }
  },
  computed: {
    checkAllMarket: {
      // getter
      get: function() {
        return (
          this.checkMarketList.length > 0 &&
          this.checkMarketList.length === this.marketList.length
        )
      },
      // setter
      set: function(newValue) {
        // this.form = newValue
      }
    },
    isIndeterminateMarket() {
      return (
        this.checkMarketList.length > 0 &&
        this.checkMarketList.length < this.marketList.length
      )
    },
    checkAllInterface: {
      // getter
      get: function() {
        return (
          this.checkInterfaceList.length > 0 &&
          this.checkInterfaceList.length === this.interfaceList.length
        )
      },
      // setter
      set: function(newValue) {
        // this.form = newValue
      }
    },
    isIndeterminateInterface() {
      return (
        this.checkInterfaceList.length > 0 &&
        this.checkInterfaceList.length < this.interfaceList.length
      )
    },
    checkAllProduct: {
      // getter
      get: function() {
        return (
          this.checkProductList.length > 0 &&
          this.checkProductList.length === this.productList.length
        )
      },
      // setter
      set: function(newValue) {
        // this.form = newValue
      }
    },
    isIndeterminateProduct() {
      return (
        this.checkProductList.length > 0 &&
        this.checkProductList.length < this.productList.length
      )
    }
  },
  created() {
    this.getMarketMarket()
    this.getMarketUsage()
    this.getInformationProduct()
  },
  methods: {
    handleCheckAllChange(val, type) {
      console.log(val)
      if (type === 'market') {
        if (val) {
          const arr = []
          this.marketList.forEach(e => {
            arr.push(e.id)
            const has = this.checkList.some(
              tag => tag.type === 'market' && tag.id === e.id
            )
            if (!has) {
              this.checkList.push(Object.assign({ type: 'market' }, e))
            }
          })
          this.checkMarketList = arr
          this.getUsagesByMarkets()
        } else {
          this.checkMarketList = []
          this.checkList = this.checkList.filter(tag => tag.type !== 'market')
          this.getMarketUsage()
          if (this.checkInterfaceList.length === 0) {
            this.getMarketMarket()
          }
        }
      } else if (type === 'interface') {
        if (val) {
          const arr = []
          this.interfaceList.forEach(e => {
            arr.push(e)
            const has = this.checkList.some(
              tag => tag.type === 'interface' && tag.name === e
            )
            if (!has) {
              this.checkList.push({ type: 'interface', name: e })
            }
          })
          this.checkInterfaceList = arr
          this.getMarketsByUsages()
        } else {
          this.checkInterfaceList = []
          this.checkList = this.checkList.filter(
            tag => tag.type !== 'interface'
          )
          this.getMarketMarket()
          if (this.checkMarketList.length === 0) {
            this.getMarketUsage()
          }
        }
      } else if (type === 'product') {
        if (val) {
          const arr = []
          this.checkList = []
          this.productList.forEach(e => {
            arr.push(e)
            this.checkList.push({ type: 'product', name: e })
          })
          this.checkProductList = arr
        } else {
          this.checkProductList = []
          this.checkList = []
        }
      }
      this.getMenuConfig()
    },
    handleCloseTag(tag) {
      console.log(tag)
      if (tag.type === 'market') {
        this.checkMarketList = this.checkMarketList.filter(e => e !== tag.id)
        const item = this.marketList.find(e => tag.id === e.id)
        this.onChangeCheckSingle(false, tag.type, item)
      } else if (tag.type === 'interface') {
        this.checkInterfaceList = this.checkInterfaceList.filter(
          e => e !== tag.name
        )
        const item = this.interfaceList.find(e => tag.name === e)
        this.onChangeCheckSingle(false, tag.type, item)
      } else if (tag.type === 'product') {
        this.checkProductList = this.checkProductList.filter(
          e => e !== tag.name
        )
        this.checkList = this.checkList.filter(
          e => e.type !== 'product' || e.name !== tag.name
        )
      }
      this.getMenuConfig()
    },
    handleChange(val) {
      if (this.institutionType === '00') {
        if (val === 'market') {
          this.showMarket = !this.showMarket
        } else if (val === 'interface') {
          this.showInterface = !this.showInterface
        } else {
          this.showMarket = false
          this.showInterface = false
        }
      } else if (this.institutionType === '10') {
        if (val === 'product') {
          this.showProduct = !this.showProduct
        } else {
          this.showProduct = false
        }
      }
    },
    // 切换单个市场、接口用途、产品类型
    onChangeCheckSingle(val, type, item) {
      console.log(val, type, item)
      console.log(this.checkMarketList)
      this.getMenuConfig()
      if (type === 'market') {
        if (val) {
          this.checkList.push(Object.assign({ type: 'market' }, item))
          this.getUsagesByMarkets()
        } else {
          this.checkList = this.checkList.filter(
            e => e.type !== 'market' || e.id !== item.id
          )
          // 市场全部取消勾选时查询全部接口用途
          if (this.checkMarketList.length === 0) {
            this.getMarketUsage()
            if (this.checkInterfaceList.length === 0) {
              this.getMarketMarket()
            }
          } else {
            // 市场取消勾选后接口用途之前已勾选的可能已不存在，需要过滤
            this.getUsagesByMarkets(true)
          }
        }
      } else if (type === 'interface') {
        if (val) {
          this.checkList.push({ type: 'interface', name: item })
          this.getMarketsByUsages()
        } else {
          this.checkList = this.checkList.filter(
            e => e.type !== 'interface' || e.name !== item
          )
          // 接口用途全部取消勾选时查询全部市场
          if (this.checkInterfaceList.length === 0) {
            this.getMarketMarket()
            if (this.checkMarketList.length === 0) {
              this.getMarketUsage()
            }
          } else {
            // 接口用途取消勾选后市场之前已勾选的可能已不存在，需要过滤
            this.getMarketsByUsages(true)
          }
        }
      } else if (type === 'product') {
        if (val) {
          this.checkList.push({ type: 'product', name: item })
        } else {
          this.checkList = this.checkList.filter(
            e => e.type !== 'product' || e.name !== item
          )
        }
      }
    },
    // 获取市场机构-所有市场
    getMarketMarket() {
      const params = {}
      if (this.operationType === 'edit') {
        params.applyOrdNo = this.applyOrdNo
      }
      serviceOpeningApi.getMarketMarket(params).then(res => {
        console.log(res)
        this.marketList = res.data
      })
    },
    // 获取市场机构-所有接口用途
    getMarketUsage() {
      const params = {}
      if (this.operationType === 'edit') {
        params.applyOrdNo = this.applyOrdNo
      }
      serviceOpeningApi.getMarketUsage(params).then(res => {
        // console.log(res)
        this.interfaceList = res.data
      })
    },
    // 获取信息商-所有产品类型
    getInformationProduct() {
      const params = {}
      if (this.operationType === 'edit') {
        params.applyOrdNo = this.applyOrdNo
      }
      serviceOpeningApi.getInformationProduct(params).then(res => {
        // console.log(res)
        this.productList = res.data
      })
    },
    // 根据市场查询接口用途
    getUsagesByMarkets(status) {
      const params = {
        nodeIds: this.checkMarketList
      }
      if (this.operationType === 'edit') {
        params.applyOrdNo = this.applyOrdNo
      }
      serviceOpeningApi.getUsagesByMarkets(params).then(res => {
        // console.log(res)
        this.interfaceList = res.data
        if (status) {
          this.checkInterfaceList = this.checkInterfaceList.filter(e =>
            this.interfaceList.includes(e)
          )
          this.checkList = this.checkList.filter(
            e =>
              e.type !== 'interface' || this.checkInterfaceList.includes(e.name)
          )
        }
      })
    },
    // 根据接口用途查询市场
    getMarketsByUsages(status) {
      const params = {
        nodeNames: this.checkInterfaceList
      }
      if (this.operationType === 'edit') {
        params.applyOrdNo = this.applyOrdNo
      }
      serviceOpeningApi.getMarketsByUsages(params).then(res => {
        // console.log(res)
        this.marketList = res.data
        if (status) {
          this.checkMarketList = this.checkMarketList.filter(e =>
            this.marketList.some(item => item.id === e)
          )
          this.checkList = this.checkList.filter(
            e => e.type !== 'market' || this.checkMarketList.includes(e.id)
          )
        }
      })
    }
  }
}
