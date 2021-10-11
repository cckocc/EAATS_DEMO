<template>
  <div>
    <div class="main-body">
      <div class="main-body-top">
        <el-form
          ref="searchForm"
          :model="mainObj.searchForm"
          label-position="left"
          inline
        >
          <el-form-item label="机构名称">
            <el-input v-model="mainObj.searchForm.agencyName" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="申请单号">
            <el-input v-model="mainObj.searchForm.applyNo" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="申请单类型">
            <el-select
              v-model="mainObj.searchForm.serviceType"
              placeholder="--全部--"
              clearable
            >
              <el-option
                v-for="item in serveiceOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="处理类型">
            <el-select
              v-model="mainObj.searchForm.type"
              placeholder="--全部--"
              clearable
            >
              <el-option
                v-for="item in typeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="处理结果">
            <el-select
              v-model="mainObj.searchForm.result"
              placeholder="--全部--"
              clearable
            >
              <el-option
                v-for="item in resultOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="mini"
              @click="onSearch"
            >查询</el-button>
            <el-button size="mini" @click="onReset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="main-body-bottom">
        <div class="main-body-bottom-btn">
          <div class="main-body-bottom-btn-left">
            <el-button
              type="primary"
              icon="el-icon-circle-plus el-icon--right"
              @click="onOperate('add')"
            >新增</el-button>
          </div>
        </div>
        <div class="table">
          <el-table
            ref="tableRef"
            v-loading="mainObj.loading"
            :data="mainObj.list"
            fit
            stripe
            border
            highlight-current-row
          >
            <el-table-column
              show-overflow-tooltip
              prop="agencyName"
              label="机构名称"
              min-width="240"
            />
            <el-table-column
              show-overflow-tooltip
              prop="applyNo"
              label="原申请单号"
              min-width="200"
            />
            <el-table-column
              show-overflow-tooltip
              prop="afterApplyNo"
              label="申请单号"
              min-width="200"
            />
            <el-table-column
              show-overflow-tooltip
              prop="type"
              label="处理类型"
              width="80"
            />
            <el-table-column
              show-overflow-tooltip
              prop="result"
              label="处理结果"
              width="80"
            />
            <el-table-column
              show-overflow-tooltip
              prop="serviceType"
              label="申请单类型"
              width="100"
            />
            <el-table-column
              show-overflow-tooltip
              prop="remark"
              label="备注"
              min-width="120"
            />
            <el-table-column
              show-overflow-tooltip
              prop="procTs"
              label="处理时间"
              width="160"
            />
          </el-table>
        </div>
        <div class="pagination">
          <el-pagination
            :current-page="mainObj.currentPage"
            :page-sizes="[20, 50, 100]"
            :page-size="mainObj.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="mainObj.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
    <!-- 新增弹窗 -->
    <el-dialog
      :title="dialogObj.title"
      :visible.sync="dialogObj.visible"
      width="600px"
    >
      <el-form
        ref="dialogForm"
        :model="dialogObj.form"
        :rules="dialogObj.rules"
        label-width="80px"
        label-position="left"
      >
        <el-form-item label="申请单号" prop="applyNo">
          <el-input
            v-model="dialogObj.form.applyNo"
            maxlength="300"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="处理结果" prop="result">
          <el-select
            v-model="dialogObj.form.result"
            placeholder="请选择"
            style="width: 100%;"
            clearable
          >
            <el-option
              v-for="item in resultOptions"
              :key="item.name"
              :label="item.label"
              :value="item.name"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="dialogObj.form.remark"
            type="textarea"
            placeholder="请输入"
            maxlength="500"
            :autosize="{ minRows: 2, maxRows: 6 }"
            clearable
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          v-preventReClick
          type="primary"
          @click="onOperate('submit')"
        >确定</el-button>
        <el-button
          @click="dialogObj.visible = false"
        >取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getFormProcessDetail, addFormProcessDetail } from '@/api/gripManageApi'
import globalOptions from '@/utils/globalOptionsValue'
const defaultSearchForm = {
  agencyName: '',
  applyNo: '',
  serviceType: '',
  type: '',
  result: ''
}
const defaultDialogForm = {
  applyNo: '',
  result: '',
  remark: ''
}
export default {
  data() {
    return {
      serveiceOptions: [],
      typeOptions: [
        {
          label: '自动',
          value: '10'
        },
        {
          label: '手动',
          value: '20'
        }
      ],
      resultOptions: [
        {
          label: '成功',
          name: 'YES',
          value: '1'
        },
        {
          label: '失败',
          name: 'NO',
          value: '0'
        }
      ],
      mainObj: {
        loading: false,
        list: [],
        pageSize: 20,
        currentPage: 1,
        total: 0,
        searchForm: Object.assign({}, defaultSearchForm)
      },
      dialogObj: {
        visible: false,
        title: '新增',
        form: Object.assign({}, defaultDialogForm),
        rules: {
          applyNo: [{ required: true, message: '不能为空', trigger: 'blur' }],
          result: [{ required: true, message: '不能为空', trigger: 'change' }]
        }
      }
    }
  },
  created() {
    this.serveiceOptions = globalOptions.serveiceOptions.filter(e => e.value !== '50')
    this.onSearch()
  },
  methods: {
    handleSizeChange(val) {
      this.mainObj.pageSize = val
      this.mainObj.currentPage = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.mainObj.currentPage = val
      this.fetchData()
    },
    onSearch() {
      this.mainObj.currentPage = 1
      this.fetchData()
    },
    onReset() {
      this.mainObj.searchForm = Object.assign({}, defaultSearchForm)
      this.onSearch()
    },
    fetchData() {
      this.mainObj.loading = true
      const params = {
        page: this.mainObj.currentPage,
        pageSize: this.mainObj.pageSize,
        agencyName: this.mainObj.searchForm.agencyName,
        applyNo: this.mainObj.searchForm.applyNo,
        serviceType: this.mainObj.searchForm.serviceType,
        type: this.mainObj.searchForm.type,
        result: this.mainObj.searchForm.result
      }
      getFormProcessDetail(params).then(res => {
        if (res.code === 'ACK') {
          this.mainObj.list = res.data.list
          this.mainObj.total = res.data.totalRecord
        }
      }).finally(() => {
        setTimeout(() => {
          this.mainObj.loading = false
        }, 500)
      })
    },
    onOperate(type, row) {
      console.log(type, row)
      if (type === 'add') {
        this.dialogObj.visible = true
        this.dialogObj.form = Object.assign({}, JSON.parse(JSON.stringify(defaultDialogForm)))
        this.$nextTick(() => {
          this.$refs.dialogForm.clearValidate()
        })
      } else if (type === 'submit') {
        this.$refs.dialogForm.validate((valid) => {
          if (valid) {
            const params = {
              applyNo: this.dialogObj.form.applyNo,
              result: this.dialogObj.form.result,
              remark: this.dialogObj.form.remark
            }
            console.log(params)
            addFormProcessDetail(params).then(res => {
              if (res.code === 'ACK') {
                this.$message({
                  type: 'success',
                  message: res.message
                })
                this.fetchData()
                this.dialogObj.visible = false
              }
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
