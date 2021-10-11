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
            <el-button v-preventReClick size="small" type="primary">导入</el-button>
          </el-upload>
        </div>
        <el-button v-preventReClick class="right-button" size="small" @click="publish">发布</el-button>
      </div>
      <div class="table">
        <el-table
          :data="IIQObj.list"
          style="width: 100%"
          fit
          stripe
          border
          highlight-current-row
        >
          <el-table-column show-overflow-tooltip prop="instnId" label="机构超级码" width="280" />
          <el-table-column show-overflow-tooltip prop="instnCnFullNm" label="机构名称" min-width="150" />
          <el-table-column show-overflow-tooltip prop="apiAccountName" label="API用户名" min-width="150" />
          <el-table-column show-overflow-tooltip prop="authType" label="权限类型" min-width="150" />
          <el-table-column show-overflow-tooltip prop="interfaceUsage" label="接口用途" min-width="150" />
          <el-table-column show-overflow-tooltip prop="publishPerscription" label="发布时效" min-width="150" />
          <el-table-column show-overflow-tooltip prop="market" label="市场" min-width="150" />
          <el-table-column show-overflow-tooltip prop="childMarketOne" label="子市场-1" min-width="150" />
          <el-table-column show-overflow-tooltip prop="childMarketTwo" label="子市场-2" min-width="150" />
          <el-table-column show-overflow-tooltip prop="dataAuthorityOne" label="行情数据权限-1" min-width="150" />
          <el-table-column show-overflow-tooltip prop="dataAuthorityTwo" label="行情数据权限-2" min-width="150" />
          <el-table-column show-overflow-tooltip prop="dataAuthorityThree" label="行情数据权限-3" min-width="150" />
          <el-table-column show-overflow-tooltip prop="remark" label="备注" min-width="150" />
          <el-table-column show-overflow-tooltip prop="instnType" label="接口身份" min-width="150" />
        </el-table>
      </div>
      <div class="pagination">
        <el-pagination
          :current-page="IIQObj.currentPage"
          :page-size="IIQObj.pageSize"
          :page-sizes="IIQObj.pagesizes"
          :total="IIQObj.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChangeIIQ"
          @current-change="handleCurrentChangeIIQ"
        />
      </div>
    </div>
  </div>
</template>

<script>
import gripManageApi from '@/api/gripManageApi'
const defaultIIQSearchForm = {
  keywords: ''
}
const defaultIIQForm = {
  iiq1: '',
  iiq2: '',
  iiq3: '',
  iiq4: '',
  iiq5: '',
  iiq6: '',
  iiq7: '',
  iiq8: '',
  iiq9: '',
  iiq10: '',
  iiq11: '',
  iiq12: '',
  iiq13: '',
  iiq14: ''
}
export default {
  data() {
    return {
      tabActiveName: '00',
      accept: '.xlsx,.xls',
      IIQObj: {
        currentPage: 1,
        pageSize: 20,
        pagesizes: [20, 50, 100],
        total: 0,
        list: [],
        searchForm: Object.assign({}, defaultIIQSearchForm)
      },
      IIQDialogObj: {
        visible: false,
        title: '',
        type: '',
        row: {},
        form: Object.assign({}, defaultIIQForm)
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
      gripManageApi.publishExcelIIQ().then(res => {
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
      }).catch((e) => {
        this.$alert(e, '提示', {
          confirmButtonText: '确定',
          customClass: 'err-tip-alert',
          showClose: false
        })
        loading.close()
      })
    },
    handleSizeChangeIIQ(val) {
      this.IIQObj.pageSize = val
      this.IIQObj.currentPage = 1
      this.onSearch()
    },
    handleCurrentChangeIIQ(val) {
      this.IIQObj.currentPage = val
      this.onSearch()
    },
    /**
     * @method: 获取列表
     * @param {无}
     * @return {无}
     */
    onSearch() {
      const params = {
        page: this.IIQObj.currentPage,
        pageSize: this.IIQObj.pageSize
      //   keywords: this.IIQObj.searchForm.keywords
      }
      gripManageApi.selectAllIIQ(params).then(res => {
        if (res.code === 'ACK') {
          this.IIQObj.list = res.data.list
          this.IIQObj.total = res.data.totalRecord
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
      this.IIQObj.searchForm = Object.assign({}, defaultIIQSearchForm)
      this.onSearch()
    },
    /**
     * @method: 操作信息商
     * @param {type} 操作类型
     * @param {row} 当前行数据
     * @return {无}
     */
    onOperateIIQ(type, row) {
      console.log(type, row)
      if (type === 'add') {
        this.IIQDialogObj.visible = true
        this.IIQDialogObj.title = '信息商-新增'
      }
    },
    closeIIQDialog() {
      this.IIQDialogObj.visible = false
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
        const r = await gripManageApi.importExcelIIQ(form)
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
    }
  }
}
</script>

<style lang="scss" scoped>
.main-body-bottom {
  .main-body-bottom-btn {
    justify-content: flex-start;
    .el-button {
      width: 80px;
    }
    .right-button {
      margin-left: 20px;
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
