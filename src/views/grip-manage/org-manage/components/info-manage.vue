<template>
  <div>
    <div class="main-body">
      <div class="main-body-top">
        <el-form
          ref="searchForm"
          :model="mainObj.searchForm"
          :label-width="isShowMore ? '120px' : null"
          label-position="left"
          inline
        >
          <el-form-item label="机构名称">
            <el-input
              v-model.trim="mainObj.searchForm.cnFullName"
              v-limitBytes="300"
              clearable
            />
          </el-form-item>
          <el-form-item label="机构身份">
            <el-select
              v-model="mainObj.searchForm.instiType"
              placeholder="--全部--"
              clearable
            >
              <el-option
                v-for="item in instiTypeList"
                :key="item.code"
                :label="item.text"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="是否为VIP机构">
            <el-select
              v-model="mainObj.searchForm.labelType"
              placeholder="--全部--"
              clearable
            >
              <el-option
                v-for="item in labelTypeOptions"
                :key="item.code"
                :label="item.label"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
          <template v-if="isShowMore">
            <el-form-item label="18位码">
              <el-input
                v-model.trim="mainObj.searchForm.cfetsInstnCdNew"
                v-limitBytes="300"
                clearable
              />
            </el-form-item>
            <el-form-item label="4位码">
              <el-input
                v-model.trim="mainObj.searchForm.fourCode"
                v-limitBytes="300"
                clearable
              />
            </el-form-item>
            <el-form-item label="6位码">
              <el-input
                v-model.trim="mainObj.searchForm.sixCode"
                v-limitBytes="300"
                clearable
              />
            </el-form-item>
            <el-form-item label="21位码">
              <el-input
                v-model.trim="mainObj.searchForm.twentyoneCode"
                v-limitBytes="300"
                clearable
              />
            </el-form-item>
            <el-form-item label="超级码">
              <el-input
                v-model.trim="mainObj.searchForm.instnId"
                v-limitBytes="300"
                clearable
              />
            </el-form-item>
          </template>
          <el-form-item>
            <el-button
              type="primary"
              size="mini"
              @click="onSearch"
            >筛选</el-button>
            <el-button
              size="mini"
              @click="onReset"
            >重置</el-button>
            <el-button
              size="mini"
              type="text"
              @click="isShowMore = !isShowMore"
            >
              {{ !isShowMore ? '展开' : '收起' }}<i :class="[ !isShowMore ? 'el-icon-arrow-down' : 'el-icon-arrow-up','el-icon--right']" />
            </el-button>
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
            >新增机构</el-button>
          </div>
        </div>
        <div class="table">
          <el-table
            v-loading="mainObj.loading"
            :data="mainObj.list"
            fit
            stripe
            border
            highlight-current-row
          >
            <el-table-column
              show-overflow-tooltip
              prop="instnCnFullNmNew"
              label="新机构名称"
              min-width="150"
            />
            <el-table-column
              show-overflow-tooltip
              prop="labelType"
              label="是否为VIP机构"
              min-width="150"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.labelType == '20'">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="instiId"
              label="超级码"
              min-width="150"
            />
            <el-table-column
              show-overflow-tooltip
              prop="typeList"
              label="机构身份"
              min-width="150"
            >
              <template slot-scope="scope">
                <span> {{ scope.row.typeList | typeListFilter }}</span>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="fourCode"
              label="4位码"
              min-width="150"
            />
            <el-table-column
              show-overflow-tooltip
              prop="sixCode"
              label="6位码"
              min-width="150"
            />
            <el-table-column
              show-overflow-tooltip
              prop="twentyoneCode"
              label="21位码"
              min-width="150"
            />
            <el-table-column
              show-overflow-tooltip
              prop="instnCdNew"
              label="新18位码"
              min-width="150"
            />
            <el-table-column
              show-overflow-tooltip
              prop="instnCd"
              label="原18位码"
              min-width="150"
            />
            <el-table-column
              show-overflow-tooltip
              prop="cnFullName"
              label="原机构名称"
              min-width="150"
            />
            <el-table-column
              show-overflow-tooltip
              prop="theCurrency"
              label="本币机构名称"
              min-width="150"
            />
            <el-table-column
              show-overflow-tooltip
              prop="foreignCurrencyInstnNm"
              label="外汇机构名称"
              min-width="150"
            />
            <el-table-column
              show-overflow-tooltip
              prop="englishNm"
              label="英文名称"
              min-width="150"
            />
            <el-table-column
              label="操作"
              align="center"
              :width="isAdmin ? 140 : 100"
              fixed="right"
            >
              <template slot-scope="scope">
                <el-button
                  v-preventReClick
                  type="text"
                  @click="onOperate('view', scope.row)"
                >查看</el-button>
                <el-button
                  v-preventReClick
                  type="text"
                  :disabled="!scope.row.flag"
                  @click="onOperate('modify', scope.row)"
                >修改</el-button>
                <el-button
                  v-if="isAdmin"
                  v-preventReClick
                  type="text"
                  @click="onOperate('disable', scope.row)"
                >{{ scope.row.instiStatus && scope.row.instiStatus.text === '禁用' ? '激活' : '禁用' }}</el-button>
              </template>
            </el-table-column>
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
    <!-- 新增/编辑/查看弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      class="add-dialog"
      :title="userDialogObj.title"
      :visible.sync="userDialogObj.visible"
      :modal-append-to-body="false"
      width="678px"
      @close="userDialogObj.visible = false"
    >
      <el-form
        ref="userForm"
        :model="userDialogObj.form"
        :rules="userDialogObj.type === 'view' ? null : userDialogObj.rules"
        :disabled="userDialogObj.type === 'view'"
        label-width="144px"
        label-position="left"
      >
        <el-form-item label="机构名称" prop="instnCnFullNm">
          <el-input
            v-model.trim="userDialogObj.form.instnCnFullNm"
            v-limitBytes="300"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
        <el-form-item label="4位码">
          <el-input
            v-model="userDialogObj.form.fourCode"
            placeholder="请输入"
            maxlength="4"
            clearable
          />
        </el-form-item>
        <el-form-item label="6位码">
          <el-input
            v-model="userDialogObj.form.sixCode"
            placeholder="请输入"
            maxlength="6"
            clearable
          />
        </el-form-item>
        <el-form-item label="18位码" prop="cfetsInstnCdNew">
          <el-input
            v-model="userDialogObj.form.cfetsInstnCdNew"
            placeholder="请输入"
            maxlength="18"
            clearable
          />
        </el-form-item>
        <el-form-item label="21位码">
          <el-input
            v-model="userDialogObj.form.twentyoneCode"
            placeholder="请输入"
            maxlength="21"
            clearable
          />
        </el-form-item>
        <el-form-item label="机构身份" prop="instiType">
          <el-checkbox-group v-model="userDialogObj.form.instiType">
            <el-checkbox
              v-for="item in instiTypeList"
              :key="item.code"
              :label="item.code"
            >{{ item.text }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="是否为VIP机构" prop="labelType">
          <el-radio-group v-model="userDialogObj.form.labelType">
            <el-radio label="20">是</el-radio>
            <el-radio label="10">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          v-if="userDialogObj.type !== 'view'"
          v-preventReClick
          type="primary"
          class="button-primary"
          @click="onOperate('submit')"
        >确定</el-button>
        <el-button
          class="button-default"
          @click="userDialogObj.visible = false"
        >取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { validSocialCode } from '@/utils/validate'
import gripManageApi from '@/api/gripManageApi'
import { getOrgTypeList } from '@/api/register'
import { mapGetters } from 'vuex'

const defaultSearchForm = {
  cnFullName: '',
  instiType: '',
  labelType: '',
  cfetsInstnCdNew: '',
  fourCode: '',
  sixCode: '',
  twentyoneCode: '',
  instnId: ''
}
const defaultUserForm = {
  instnCnFullNm: '',
  fourCode: '',
  sixCode: '',
  cfetsInstnCdNew: '',
  twentyoneCode: '',
  instiType: [],
  labelType: ''
}
export default {
  filters: {
    typeListFilter(val) {
      return val.join('、')
    }
  },
  data() {
    const validateSocial = (rule, value, callback) => {
      if (!validSocialCode(value)) {
        callback(new Error('统一社会信用代码格式不正确'))
      } else {
        callback()
      }
    }
    return {
      isShowMore: false,
      isAdmin: false,
      accept: '.jpg,.jpeg,.png,.pdf',
      tips: '请提供1.营业执照2.组织机构代码证3.金融业务许可证4.身份证或工作证的原件照片或彩色扫描件（正副本均可），文字/盖章清晰可辨认，格式要求jpg、jpeg、png、pdf，不超过10MB',
      mainObj: {
        loading: false,
        list: [],
        pageSize: 20,
        currentPage: 1,
        total: 0,
        searchForm: Object.assign({}, defaultSearchForm)
      },
      labelTypeOptions: [
        {
          code: '10',
          label: '否'
        },
        {
          code: '20',
          label: '是'
        }
      ],
      instiTypeList: [],
      userDialogObj: {
        visible: false,
        tile: '',
        type: '',
        form: Object.assign({}, defaultUserForm),
        checkIsYNStatus: true,
        viewForm: {
          instnId: '',
          cassInstiFileDtoList: [],
          instiStatus: '',
          auditRemark: ''
        },
        rules: {
          instnCnFullNm: [{ required: true, message: '不能为空', trigger: 'blur' }],
          instiType: [{ type: 'array', required: true, message: '不能为空', trigger: 'change' }],
          labelType: [{ required: true, message: '不能为空', trigger: 'change' }],
          cfetsInstnCdNew: [
            { required: true, message: '不能为空', trigger: 'blur' },
            { required: true, validator: validateSocial, trigger: 'blur' }
          ]
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  created() {
    console.log('机构信息管理')
    this.isAdmin = this.userInfo.roleType.code === 'super-admin'
    this.getOrgTypeList()
    this.onSearch()
  },
  methods: {
    async getOrgTypeList() {
      try {
        const { data } = await getOrgTypeList()
        this.instiTypeList = data
      } catch (e) {
        console.log(e)
      }
    },
    onOperate(type, row) {
      if (type === 'add') {
        this.userDialogObj.visible = true
        this.userDialogObj.type = type
        this.userDialogObj.title = '新增机构'
        this.userDialogObj.form = Object.assign({}, defaultUserForm)
        this.$nextTick(() => {
          this.$refs.userForm.clearValidate()
        })
      } else if (type === 'modify') {
        this.userDialogObj.visible = true
        this.userDialogObj.type = type
        this.userDialogObj.title = '修改机构'
        const params = {
          id: row.instiId
        }
        gripManageApi.getInstiDetail(params).then(res => {
          if (res.code === 'ACK') {
            this.userDialogObj.form.instiId = res.data.instiId
            this.userDialogObj.form.instnCnFullNm = res.data.instnCnFullNm || res.data.cnFullName
            this.userDialogObj.form.fourCode = res.data.fourCode
            this.userDialogObj.form.sixCode = res.data.sixCode
            this.userDialogObj.form.cfetsInstnCdNew = res.data.cfetsInstnCdNew
            this.userDialogObj.form.twentyoneCode = res.data.twentyoneCode
            this.userDialogObj.form.instiType = res.data.typeList || []
            this.userDialogObj.form.labelType = res.data.labelType
            this.userDialogObj.visible = true
            this.$nextTick(() => {
              this.$refs.userForm.clearValidate()
            })
          }
        })
      } else if (type === 'view') {
        this.userDialogObj.visible = true
        this.userDialogObj.type = type
        this.userDialogObj.title = '查看'
        const params = {
          id: row.instiId
        }
        gripManageApi.getInstiDetail(params).then(res => {
          if (res.code === 'ACK') {
            this.userDialogObj.form.instnCnFullNm = res.data.instnCnFullNm || res.data.cnFullName
            this.userDialogObj.form.fourCode = res.data.fourCode
            this.userDialogObj.form.sixCode = res.data.sixCode
            this.userDialogObj.form.cfetsInstnCdNew = res.data.cfetsInstnCdNew
            this.userDialogObj.form.twentyoneCode = res.data.twentyoneCode
            this.userDialogObj.form.instiType = res.data.typeList || []
            this.userDialogObj.form.labelType = res.data.labelType
            this.userDialogObj.visible = true
            this.$nextTick(() => {
              this.$refs.userForm.clearValidate()
            })
          }
        })
      } else if (type === 'submit') {
        this.$refs.userForm.validate(valid => {
          if (valid) {
            const params = {
              instnCnFullNm: this.userDialogObj.form.instnCnFullNm,
              fourCode: this.userDialogObj.form.fourCode,
              sixCode: this.userDialogObj.form.sixCode,
              cfetsInstnCdNew: this.userDialogObj.form.cfetsInstnCdNew,
              twentyoneCode: this.userDialogObj.form.twentyoneCode,
              instiType: this.userDialogObj.form.instiType.join(','),
              labelType: this.userDialogObj.form.labelType,
              checkIsYNStatus: this.userDialogObj.checkIsYNStatus
            }
            if (this.userDialogObj.type === 'modify') {
              params.instnId = this.userDialogObj.form.instiId
            }
            gripManageApi.insitiSave(params, this.userDialogObj.type).then(res => {
              if (res.code === 'ACK') {
                if (res.data) {
                  this.$confirm(res.message.replace(/\/n/g, '<br>'), '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    dangerouslyUseHTMLString: true,
                    type: 'warning'
                  }).then(() => {
                    this.userDialogObj.checkIsYNStatus = false
                    this.onOperate('submit')
                  })
                } else {
                  this.$message({
                    type: 'success',
                    message: res.message
                  })
                  this.fetchData()
                  this.userDialogObj.visible = false
                  this.userDialogObj.checkIsYNStatus = true
                }
              }
            })
          }
        })
      } else if (type === 'disable') {
        const params = {
          instnId: row.instiId
        }
        if (row.instiStatus.text === '禁用') {
          gripManageApi.activateSwitch(params).then(res => {
            if (res.code === 'ACK') {
              this.$message({
                type: 'success',
                message: res.message
              })
              this.fetchData()
            }
          })
        } else {
          this.$confirm(`禁用后该机构下所有用户将不能登录，确认禁用?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            gripManageApi.disableSwitch(params).then(res => {
              if (res.code === 'ACK') {
                this.$message({
                  type: 'success',
                  message: res.message
                })
                this.fetchData()
              }
            })
          })
        }
      }
    },
    onSearch() {
      this.mainObj.currentPage = 1
      this.fetchData()
    },
    onReset() {
      this.mainObj.searchForm = Object.assign({}, defaultSearchForm)
      this.onSearch()
    },
    handleSizeChange(val) {
      this.mainObj.pageSize = val
      this.mainObj.currentPage = 1
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.mainObj.currentPage = val
      this.fetchData()
    },
    fetchData() {
      this.mainObj.loading = true
      const params = {
        page: this.mainObj.currentPage,
        pageSize: this.mainObj.pageSize,
        cnFullName: this.mainObj.searchForm.cnFullName,
        instiType: this.mainObj.searchForm.instiType,
        labelType: this.mainObj.searchForm.labelType,
        cfetsInstnCdNew: this.mainObj.searchForm.cfetsInstnCdNew,
        fourCode: this.mainObj.searchForm.fourCode,
        sixCode: this.mainObj.searchForm.sixCode,
        twentyoneCode: this.mainObj.searchForm.twentyoneCode,
        instnId: this.mainObj.searchForm.instnId
      }
      gripManageApi.institutionSearch(params).then(res => {
        this.mainObj.list = res.data.list
        this.mainObj.total = res.data.totalRecord
      }).finally(() => {
        setTimeout(() => {
          this.mainObj.loading = false
        }, 500)
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
