<template>
  <div class="main">
    <div class="main-body">
      <el-tabs v-model="tabActiveName" class="custom-main-tabs" @tab-click="handleClick">
        <el-tab-pane label="市场机构" name="00">
          <div class="main-body-top">
            <el-form
              ref="searchForm"
              class="top-form"
              :model="MKTObj.searchForm"
              label-width="100px"
              label-position="left"
              inline
            >
              <el-form-item label="请输入关键字">
                <el-input v-model.trim="MKTObj.searchForm.keywords" clearable />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  size="mini"
                  @click="onSearch"
                >筛选</el-button>
                <el-button size="mini" @click="onReset">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="main-body-bottom">
            <div class="main-body-bottom-btn">
              <div class="main-body-bottom-btn-left">
                <el-button
                  type="primary"
                  icon="el-icon-circle-plus"
                  size="small"
                  @click="onOperateMKT('add')"
                >新增</el-button>
                <el-button
                  type="primary"
                  icon="el-icon-remove"
                  size="small"
                  @click="onOperateMKT('delete')"
                >删除</el-button>
              </div>
              <div class="main-body-bottom-btn-right">
                <el-upload
                  action="fakeaction"
                  :accept="accept"
                  :show-file-list="false"
                  :http-request="uploadFile"
                >
                  <el-button v-preventReClick size="small" type="primary">Excel导入</el-button>
                </el-upload>
              </div>
            </div>
            <div class="table">
              <el-table
                :data="MKTObj.list"
                style="width: 100%"
                fit
                stripe
                border
                highlight-current-row
                header-row-class-name="header-row-th"
                :header-row-style="{ height: '42px' }"
                :header-cell-style="{ padding: 0 }"
                :row-style="{ height: '42px' }"
                :cell-style="{ padding: 0 }"
              >
                <el-table-column
                  prop="mkt1"
                  label="机构6位代码"
                  width="120"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="mkt2"
                  label="机构英文简称（仅外汇）"
                  min-width="200"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="mkt3"
                  label="机构名称"
                  min-width="150"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="mkt4"
                  label="FloorCode（外汇）"
                  min-width="160"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="mkt5"
                  label="API用户名"
                  min-width="150"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="mkt6"
                  label="权限类型"
                  min-width="150"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="mkt7"
                  label="市场"
                  min-width="150"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="mkt8"
                  label="接口用途"
                  min-width="150"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="mkt9"
                  label="接口产品（中心内部系统）"
                  min-width="210"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="mkt10"
                  label="货币对/货币（仅外汇API）"
                  min-width="210"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="mkt11"
                  label="子市场"
                  min-width="150"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="mkt12"
                  label="货币对/货币（仅交易后）"
                  min-width="200"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="mkt13"
                  label="接口功能-1"
                  min-width="150"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="mkt14"
                  label="接口功能-2"
                  min-width="150"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="mkt15"
                  label="接口功能-3"
                  min-width="150"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="mkt16"
                  label="匹配报文"
                  min-width="150"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="mkt17"
                  label="行情数据权限-1"
                  min-width="150"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="mkt18"
                  label="行情数据权限-2"
                  min-width="150"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="mkt19"
                  label="行情数据权限-3"
                  min-width="150"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="mkt20"
                  label="机构身份"
                  min-width="150"
                />
                <el-table-column
                  align="center"
                  label="操作"
                  fixed="right"
                  min-width="100"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      @click="onOperateMKT('edit', scope.row)"
                    >
                      编辑
                    </el-button>
                    <el-button
                      type="text"
                      @click="onOperateMKT('delete', scope.row)"
                    >删除</el-button>
                  </template>
                </el-table-column>
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
        </el-tab-pane>
        <el-tab-pane label="信息商" name="10">
          <div class="main-body-top">
            <el-form
              ref="searchForm"
              class="top-form"
              :model="IIQObj.searchForm"
              label-width="100px"
              label-position="left"
              inline
            >
              <el-form-item label="请输入关键字">
                <el-input v-model.trim="IIQObj.searchForm.keywords" clearable />
              </el-form-item>
              <el-form-item>
                <el-button
                  type="primary"
                  size="mini"
                  @click="onSearch"
                >筛选</el-button>
                <el-button size="mini" @click="onReset">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="main-body-bottom">
            <div class="main-body-bottom-btn">
              <div class="main-body-bottom-btn-left">
                <el-button
                  type="primary"
                  icon="el-icon-circle-plus"
                  size="small"
                  @click="onOperateIIQ('add')"
                >新增</el-button>
                <el-button
                  type="primary"
                  icon="el-icon-remove"
                  size="small"
                  @click="onOperateIIQ('delete')"
                >删除</el-button>
              </div>
              <div class="main-body-bottom-btn-right">
                <el-upload
                  action="fakeaction"
                  :accept="accept"
                  :show-file-list="false"
                  :http-request="uploadFile"
                >
                  <el-button v-preventReClick size="small" type="primary">Excel导入</el-button>
                </el-upload>
              </div>
            </div>
            <div class="table">
              <el-table
                :data="IIQObj.list"
                style="width: 100%"
                fit
                stripe
                border
                highlight-current-row
                header-row-class-name="header-row-th"
                :header-row-style="{ height: '42px' }"
                :header-cell-style="{ padding: 0 }"
                :row-style="{ height: '42px' }"
                :cell-style="{ padding: 0 }"
              >
                <el-table-column
                  prop="iiq1"
                  label="机构6位代码"
                  width="120"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="iiq2"
                  label="机构名称"
                  min-width="150"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="iiq3"
                  label="API用户名"
                  min-width="150"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="iiq4"
                  label="权限类型"
                  min-width="150"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="iiq5"
                  label="接口用途"
                  min-width="150"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="iiq6"
                  label="发布时效"
                  min-width="150"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="iiq7"
                  label="市场"
                  min-width="150"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="iiq8"
                  label="子市场-1"
                  min-width="150"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="iiq9"
                  label="子市场-2"
                  min-width="150"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="iiq10"
                  label="行情数据权限-1"
                  min-width="150"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="iiq11"
                  label="行情数据权限-2"
                  min-width="150"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="iiq12"
                  label="行情数据权限-3"
                  min-width="150"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="iiq13"
                  label="备注"
                  min-width="150"
                />
                <el-table-column
                  show-overflow-tooltip
                  prop="iiq14"
                  label="机构身份"
                  min-width="150"
                />
                <el-table-column
                  align="center"
                  label="操作"
                  fixed="right"
                  min-width="100"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      @click="onOperateIIQ('edit', scope.row)"
                    >
                      编辑
                    </el-button>
                    <el-button
                      type="text"
                      @click="onOperateIIQ('delete', scope.row)"
                    >删除</el-button>
                  </template>
                </el-table-column>
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
        </el-tab-pane>
      </el-tabs>
    </div>
    <!-- 市场机构-新增/编辑 -->
    <el-dialog
      width="1200px"
      :title="MKTDialogObj.title"
      :visible.sync="MKTDialogObj.visible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      destroy-on-close
      @close="closeMKTDialog"
    >
      <el-form
        ref="MKTForm"
        :model="MKTDialogObj.form"
        label-width="150px"
        label-position="left"
        inline
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="机构6位代码">
              <el-input v-model="MKTDialogObj.form.mkt1" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="机构英文简称（仅外汇）">
              <el-input v-model="MKTDialogObj.form.mkt2" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="机构名称">
              <el-input v-model="MKTDialogObj.form.mkt3" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="FloorCode（外汇）">
              <el-input v-model="MKTDialogObj.form.mkt4" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="API用户名">
              <el-input v-model="MKTDialogObj.form.mkt5" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="权限类型">
              <el-select v-model="MKTDialogObj.form.mkt6" placeholder="请选择">
                <el-option label="申请通过" value="申请通过" />
                <el-option label="生产权限" value="生产权限" />
                <el-option label="验收通过" value="验收通过" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="市场">
              <el-select v-model="MKTDialogObj.form.mkt7" placeholder="请选择">
                <el-option label="申请通过" value="申请通过" />
                <el-option label="生产权限" value="生产权限" />
                <el-option label="验收通过" value="验收通过" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接口用途">
              <el-select v-model="MKTDialogObj.form.mkt8" placeholder="请选择">
                <el-option label="申请通过" value="申请通过" />
                <el-option label="生产权限" value="生产权限" />
                <el-option label="验收通过" value="验收通过" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接口产品（中心内部系统）">
              <el-select v-model="MKTDialogObj.form.mkt9" placeholder="请选择">
                <el-option label="申请通过" value="申请通过" />
                <el-option label="生产权限" value="生产权限" />
                <el-option label="验收通过" value="验收通过" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="货币对/货币（仅外汇API）">
              <el-select v-model="MKTDialogObj.form.mkt10" placeholder="请选择">
                <el-option label="申请通过" value="申请通过" />
                <el-option label="生产权限" value="生产权限" />
                <el-option label="验收通过" value="验收通过" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="子市场">
              <el-select v-model="MKTDialogObj.form.mkt11" placeholder="请选择">
                <el-option label="申请通过" value="申请通过" />
                <el-option label="生产权限" value="生产权限" />
                <el-option label="验收通过" value="验收通过" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="货币对/货币（仅交易后）">
              <el-select v-model="MKTDialogObj.form.mkt12" placeholder="请选择">
                <el-option label="申请通过" value="申请通过" />
                <el-option label="生产权限" value="生产权限" />
                <el-option label="验收通过" value="验收通过" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="接口功能-1">
              <el-select v-model="MKTDialogObj.form.mkt13" placeholder="请选择">
                <el-option label="申请通过" value="申请通过" />
                <el-option label="生产权限" value="生产权限" />
                <el-option label="验收通过" value="验收通过" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接口功能-2">
              <el-select v-model="MKTDialogObj.form.mkt14" placeholder="请选择">
                <el-option label="申请通过" value="申请通过" />
                <el-option label="生产权限" value="生产权限" />
                <el-option label="验收通过" value="验收通过" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接口功能-3">
              <el-select v-model="MKTDialogObj.form.mkt15" placeholder="请选择">
                <el-option label="申请通过" value="申请通过" />
                <el-option label="生产权限" value="生产权限" />
                <el-option label="验收通过" value="验收通过" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="匹配报文">
              <el-select v-model="MKTDialogObj.form.mkt16" placeholder="请选择">
                <el-option label="申请通过" value="申请通过" />
                <el-option label="生产权限" value="生产权限" />
                <el-option label="验收通过" value="验收通过" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="行情数据权限-1">
              <el-select v-model="MKTDialogObj.form.mkt17" placeholder="请选择">
                <el-option label="申请通过" value="申请通过" />
                <el-option label="生产权限" value="生产权限" />
                <el-option label="验收通过" value="验收通过" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="行情数据权限-2">
              <el-select v-model="MKTDialogObj.form.mkt18" placeholder="请选择">
                <el-option label="申请通过" value="申请通过" />
                <el-option label="生产权限" value="生产权限" />
                <el-option label="验收通过" value="验收通过" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="行情数据权限-3">
              <el-select v-model="MKTDialogObj.form.mkt19" placeholder="请选择">
                <el-option label="申请通过" value="申请通过" />
                <el-option label="生产权限" value="生产权限" />
                <el-option label="验收通过" value="验收通过" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="机构身份">
              <el-select v-model="MKTDialogObj.form.mkt20" placeholder="请选择">
                <el-option label="申请通过" value="申请通过" />
                <el-option label="生产权限" value="生产权限" />
                <el-option label="验收通过" value="验收通过" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="text-center">
        <span slot="footer">
          <el-button
            type="primary"
            class="button-primary"
            @click="onOperateIIQ('submit')"
          >
            确定
          </el-button>
          <el-button
            class="button-default"
            @click="closeMKTDialog"
          >
            取消
          </el-button>
        </span>
      </div>
    </el-dialog>
    <!-- 信息商-新增/编辑 -->
    <el-dialog
      width="1200px"
      :title="IIQDialogObj.title"
      :visible.sync="IIQDialogObj.visible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      destroy-on-close
      @close="closeIIQDialog"
    >
      <el-form
        ref="IIQForm"
        :model="IIQDialogObj.form"
        label-width="150px"
        label-position="left"
        inline
      >
        <el-row>
          <el-col :span="8">
            <el-form-item label="机构6位代码">
              <el-input v-model="IIQDialogObj.form.iiq1" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="机构名称">
              <el-input v-model="IIQDialogObj.form.iiq2" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="API用户名">
              <el-input v-model="IIQDialogObj.form.iiq3" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="权限类型">
              <el-select v-model="IIQDialogObj.form.iiq4" placeholder="请选择">
                <el-option label="申请通过" value="申请通过" />
                <el-option label="生产权限" value="生产权限" />
                <el-option label="验收通过" value="验收通过" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="接口用途">
              <el-select v-model="IIQDialogObj.form.iiq5" placeholder="请选择">
                <el-option label="申请通过" value="申请通过" />
                <el-option label="生产权限" value="生产权限" />
                <el-option label="验收通过" value="验收通过" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发布时效">
              <el-select v-model="IIQDialogObj.form.iiq6" placeholder="请选择">
                <el-option label="申请通过" value="申请通过" />
                <el-option label="生产权限" value="生产权限" />
                <el-option label="验收通过" value="验收通过" />
              </el-select>
            </el-form-item>

          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="市场">
              <el-select v-model="IIQDialogObj.form.iiq7" placeholder="请选择">
                <el-option label="申请通过" value="申请通过" />
                <el-option label="生产权限" value="生产权限" />
                <el-option label="验收通过" value="验收通过" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="子市场-1">
              <el-select v-model="IIQDialogObj.form.iiq8" placeholder="请选择">
                <el-option label="申请通过" value="申请通过" />
                <el-option label="生产权限" value="生产权限" />
                <el-option label="验收通过" value="验收通过" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="子市场-2">
              <el-select v-model="IIQDialogObj.form.iiq9" placeholder="请选择">
                <el-option label="申请通过" value="申请通过" />
                <el-option label="生产权限" value="生产权限" />
                <el-option label="验收通过" value="验收通过" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="行情数据权限-1">
              <el-select v-model="IIQDialogObj.form.iiq10" placeholder="请选择">
                <el-option label="申请通过" value="申请通过" />
                <el-option label="生产权限" value="生产权限" />
                <el-option label="验收通过" value="验收通过" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="行情数据权限-2">
              <el-select v-model="IIQDialogObj.form.iiq11" placeholder="请选择">
                <el-option label="申请通过" value="申请通过" />
                <el-option label="生产权限" value="生产权限" />
                <el-option label="验收通过" value="验收通过" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="行情数据权限-3">
              <el-select v-model="IIQDialogObj.form.iiq12" placeholder="请选择">
                <el-option label="申请通过" value="申请通过" />
                <el-option label="生产权限" value="生产权限" />
                <el-option label="验收通过" value="验收通过" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item label="备注">
              <el-input v-model="IIQDialogObj.form.iiq13" placeholder="请输入" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="机构身份">
              <el-select v-model="IIQDialogObj.form.iiq14" placeholder="请选择">
                <el-option label="申请通过" value="申请通过" />
                <el-option label="生产权限" value="生产权限" />
                <el-option label="验收通过" value="验收通过" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="text-center">
        <span slot="footer">
          <el-button
            type="primary"
            class="button-primary"
            @click="onOperateIIQ('submit')"
          >
            确定
          </el-button>
          <el-button
            class="button-default"
            @click="closeIIQDialog"
          >
            取消
          </el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import myServiceApi from '@/api/myServiceApi'
const defaultMKTSearchForm = {
  keywords: ''
}
const defaultIIQSearchForm = {
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
      MKTObj: {
        currentPage: 1,
        pageSize: 20,
        pagesizes: [20, 50, 100],
        total: 0,
        list: [],
        searchForm: Object.assign({}, defaultMKTSearchForm)
      },
      IIQObj: {
        currentPage: 1,
        pageSize: 20,
        pagesizes: [20, 50, 100],
        total: 0,
        list: [],
        searchForm: Object.assign({}, defaultIIQSearchForm)
      },
      MKTDialogObj: {
        visible: false,
        title: '',
        type: '',
        row: {},
        form: Object.assign({}, defaultMKTForm)
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
    // this.onSearch()
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return 'header-row-th'
      }
    },
    handleClick(tab, event) {
      console.log(tab, event)
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
        page: this.MKTObj.currentPage,
        pageSize: this.MKTObj.pageSize,
        keywords: this.MKTObj.searchForm.keywords
      }
      myServiceApi.getMyServiceList(params).then(res => {
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
      if (this.tabActiveName === '00') {
        this.MKTObj.searchForm = Object.assign({}, defaultMKTSearchForm)
      } else if (this.tabActiveName === '10') {
        this.IIQObj.searchForm = Object.assign({}, defaultMKTSearchForm)
      }
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
    closeMKTDialog() {
      this.MKTDialogObj.visible = false
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
      try {
        const form = new FormData()
        form.append('file', file)
        // const r = await importExcel(form)
        this.onSearch()
        this.$message({
          message: `${fileName}上传成功`,
          type: 'success'
        })
      } catch (e) {
        console.log('文件上传失败，错误信息：', e)
        this.$message({
          message: `${fileName}上传失败`,
          type: 'error'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
