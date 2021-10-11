<template>
  <div class="main-body">
    <div class="main-body-bottom">
      <div class="main-body-bottom-btn">
        <div class="main-body-bottom-btn-right">
          <el-upload
            action="fakeaction"
            :accept="accept"
            :show-file-list="false"
            :http-request="uploadFile"
          >
            <el-button v-preventReClick class="width80" size="small" type="primary">导入</el-button>
          </el-upload>
        </div>
        <el-button v-preventReClick class="width80 right-button" size="small" @click="publish">发布</el-button>
        <el-upload
          action="fakeaction"
          :accept="accept"
          :show-file-list="false"
          :http-request="importSixCode"
        >
          <el-button v-preventReClick class="sixcode-button" size="small" type="primary">6位码和18位码映射关系表导入</el-button>
        </el-upload>
      </div>
      <div class="table">
        <el-table
          :data="MKTObj.list"
          style="width: 100%"
          fit
          stripe
          border
          highlight-current-row
        >
          <el-table-column show-overflow-tooltip prop="instnId" label="机构超级码" width="280" />
          <el-table-column show-overflow-tooltip prop="instnName" label="机构名称" min-width="150" />
          <el-table-column show-overflow-tooltip prop="apiAccountName" label="API用户名" min-width="150" />
          <el-table-column show-overflow-tooltip prop="authType" label="权限类型" min-width="150" />
          <el-table-column show-overflow-tooltip prop="market" label="市场" min-width="150" />
          <el-table-column show-overflow-tooltip prop="interfaceUsage" label="接口用途" min-width="150" />
          <el-table-column
            show-overflow-tooltip
            prop="interfaceProduct"
            label="接口产品（中心内部系统）"
            min-width="210"
          />
          <el-table-column
            show-overflow-tooltip
            prop="currencyForeign"
            label="货币对/货币（仅外汇API）"
            min-width="210"
          />
          <el-table-column show-overflow-tooltip prop="childMarket" label="子市场" min-width="150" />
          <el-table-column
            show-overflow-tooltip
            prop="currencyAfterSale"
            label="货币对/货币（仅交易后）"
            min-width="200"
          />
          <el-table-column show-overflow-tooltip prop="interfaceFunctionOne" label="接口功能-1" min-width="150" />
          <el-table-column show-overflow-tooltip prop="interfaceFunctionTwo" label="接口功能-2" min-width="150" />
          <el-table-column show-overflow-tooltip prop="interfaceFunctionThree" label="接口功能-3" min-width="150" />
          <el-table-column show-overflow-tooltip prop="matchMessage" label="匹配报文" min-width="150" />
          <el-table-column show-overflow-tooltip prop="dataAuthorityOne" label="行情数据权限-1" min-width="150" />
          <el-table-column show-overflow-tooltip prop="dataAuthorityTwo" label="行情数据权限-2" min-width="150" />
          <el-table-column show-overflow-tooltip prop="dataAuthorityThree" label="行情数据权限-3" min-width="150" />
          <el-table-column show-overflow-tooltip prop="instnType" label="接口身份" min-width="150" />
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          :current-page="MKTObj.currentPage"
          :page-size="MKTObj.pageSize"
          :page-sizes="MKTObj.pagesizes"
          :total="MKTObj.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChangeMKT"
          @current-change="handleCurrentChangeMKT"
        />
      </div>
    </div>
  </div>
</template>

<script>
import gripManageApi from '@/api/gripManageApi'
const defaultMKTSearchForm = {
  keywords: ''
}
const defaultMKTForm = {
  mkt1: '',
  mkt2: '',
  mkt3: '',
  mkt4: '',
  mkt5: '',
  mkt6: '',
  mkt7: '',
  mkt8: '',
  mkt9: '',
  mkt10: '',
  mkt11: '',
  mkt12: '',
  mkt13: '',
  mkt14: '',
  mkt15: '',
  mkt16: '',
  mkt17: '',
  mkt18: '',
  mkt19: '',
  mkt20: ''
}
export default {
  data() {
    return {
      tabActiveName: '00',
      accept: '.xlsx,.xls',
      MKTObj: {
        currentPage: 1,
        pageSize: 20,
        pagesizes: [20, 50, 100],
        total: 0,
        list: []
        // searchForm: Object.assign({}, defaultMKTSearchForm)
      },
      MKTDialogObj: {
        visible: false,
        title: '',
        type: '',
        row: {},
        form: Object.assign({}, defaultMKTForm)
      }
    }
  },
  created() {
    this.onSearch()
  },
  methods: {
    publish() {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      gripManageApi.publishExcelMarket().then(res => {
        if (res.code === 'ACK') {
          this.$message({
            type: 'success',
            message: res.message
          })
          loading.close()
          this.onSearch()
        } else {
          this.$message({
            type: 'error',
            message: res.message
          })
          loading.close()
        }
      }).catch(() => {
        this.$alert(e, '提示', {
          confirmButtonText: '确定',
          customClass: 'err-tip-alert',
          showClose: false
        })
        loading.close()
      })
    },
    handleSizeChangeMKT(val) {
      this.MKTObj.pageSize = val
      this.MKTObj.currentPage = 1
      this.onSearch()
    },
    handleCurrentChangeMKT(val) {
      this.MKTObj.currentPage = val
      this.onSearch()
    },
    /**
     * @method: 获取列表
     * @param {无}
     * @return {无}
     */
    onSearch() {
      const params = {
        page: this.MKTObj.currentPage,
        pageSize: this.MKTObj.pageSize
        // keywords: this.MKTObj.searchForm.keywords
      }
      gripManageApi.selectAllMarket(params).then(res => {
        if (res.code === 'ACK') {
          this.MKTObj.list = res.data.list
          this.MKTObj.total = res.data.totalRecord
        } else {
          this.$message({
            type: 'error',
            message: '获取列表失败'
          })
        }
      })
    },
    /**
     * @method: 重置
     * @param {无}
     * @return {无}
     */
    onReset() {
      this.MKTObj.searchForm = Object.assign({}, defaultMKTSearchForm)
      this.onSearch()
    },
    /**
     * @method: 操作市场机构
     * @param {type} 操作类型
     * @param {row} 当前行数据
     * @return {无}
     */
    onOperateMKT(type, row) {
      console.log(type, row)
      if (type === 'add') {
        this.MKTDialogObj.visible = true
        this.MKTDialogObj.title = '市场机构-新增'
      }
    },
    closeMKTDialog() {
      this.MKTDialogObj.visible = false
    },
    async uploadFile(params) {
      const file = params.file
      const fileName = file.name
      const isLt2M = file.size / 1024 / 1024 <= 10
      if (!isLt2M) {
        this.$message.error(`上传失败，文件大小超过10MB`)
        return
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const form = new FormData()
        form.append('file', file)
        const r = await gripManageApi.importExcelMarket(form)
        this.onSearch()
        this.$message({
          message: `${fileName}上传成功`,
          type: 'success'
        })
        loading.close()
      } catch (e) {
        this.$alert(e, '提示', {
          confirmButtonText: '确定',
          customClass: 'err-tip-alert',
          showClose: false
        })
        loading.close()
      }
    },
    async importSixCode(params) {
      const file = params.file
      const fileName = file.name
      const isLt2M = file.size / 1024 / 1024 <= 10
      if (!isLt2M) {
        this.$message.error(`上传失败，文件大小超过10MB`)
        return
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      try {
        const form = new FormData()
        form.append('file', file)
        const r = await gripManageApi.importSixCode(form)
        // this.onSearch()
        this.$message({
          message: `${fileName}上传成功`,
          type: 'success'
        })
        loading.close()
      } catch (e) {
        this.$alert(e, '提示', {
          confirmButtonText: '确定',
          customClass: 'err-tip-alert',
          showClose: false
        })
        loading.close()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.main-body-bottom {
  .main-body-bottom-btn {
    justify-content: flex-start;
    .width80 {
      width: 80px;
    }
    .right-button {
      margin-left: 20px;
    }
    .sixcode-button {
      margin-left: 20px;
      width: 100%;
    }
  }
  .main-body-bottom-btn-right {
    display: block;
  }
}
</style>

<style lang="scss">
.err-tip-alert {
  /deep/ .el-message-box__content {
    max-height: 355px;
    overflow: auto;
  }
}
</style>
