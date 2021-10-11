<template>
  <div class="main-body">
    <Tabs v-model="activeName" :item-list="itemList" @tab-click="handleClick" />
    <div class="main-body">
      <div class="main-body-bottom">
        <div class="main-body-bottom-btn">
          <div class="main-body-bottom-btn-left">
            <el-button
              type="primary"
              size="mini"
              @click="onOperate('publishNotice')"
            ><svg-icon icon-class="publish" />发布公告</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="onOperate('interfaceTypeManage')"
            ><svg-icon icon-class="publish" />接口类型管理</el-button>
          </div>
          <div class="main-body-bottom-btn-right">
            <el-dropdown trigger="click" :hide-on-click="false">
              <el-button type="text">
                <svg-icon class="button-icon" icon-class="config" />
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-checkbox-group v-model="columnCheckedList" @change="onChangeColumnChecked">
                  <el-dropdown-item v-for="item in uploadTypeList" :key="item.value">
                    <el-checkbox :label="item.value">{{ item.label }}</el-checkbox>
                  </el-dropdown-item>
                </el-checkbox-group>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <div class="table">
          <el-table
            :data="mainObj.list"
            style="width: 100%"
            fit
            stripe
            border
            highlight-current-row
          >
            <el-table-column label="接口类型" align="center" min-width="188" fixed="left">
              <el-table-column prop="nodeTypeName" label="名称" align="center" width="100" />
              <el-table-column label="操作" align="center" width="88">
                <template slot-scope="scope">
                  <div>
                    <el-button
                      v-preventReClick
                      type="text"
                      @click="onOperate('resourceUpload', scope.row)"
                    >资源上传</el-button>
                  </div>
                  <div>
                    <el-button
                      v-preventReClick
                      type="text"
                      @click="onOperate('interfaceView', scope.row)"
                    >接口查看</el-button>
                  </div>
                </template>
              </el-table-column>
            </el-table-column>
            <template v-for="(column, columnIndex) in mainObj.columns">
              <el-table-column v-if="columnCheckedList.includes(column.value)" :key="column.value" :label="column.label" align="center">
                <template v-for="(option, optionIndex) in column.options ? column.options : []">
                  <el-table-column v-if="option.fileType !== 'ACCEPTANCE_FILE'" :key="option.fileType + 'version'" label="版本号" align="center" min-width="70">
                    <template v-if="scope.row.options[columnIndex] && scope.row.options[columnIndex][optionIndex] && scope.row.options[columnIndex].length > 0" slot-scope="scope">
                      {{ scope.row.options[columnIndex][optionIndex].resourceVersion }}
                    </template>
                  </el-table-column>
                  <el-table-column v-if="option.fileType !== 'ACCEPTANCE_FILE'" :key="option.fileType" show-overflow-tooltip :label="option.label" align="center" min-width="80">
                    <template v-if="scope.row.options[columnIndex] && scope.row.options[columnIndex][optionIndex] && scope.row.options[columnIndex].length > 0" slot-scope="scope">
                      <el-dropdown
                        trigger="click"
                        @command="handleCommand"
                        @visible-change="val => getFileListById(val, scope.row.options[columnIndex][optionIndex])"
                      >
                        <el-button type="text">
                          <svg-icon class="button-icon" icon-class="download" />
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item
                            v-for="item in scope.row.options[columnIndex][optionIndex].fileList"
                            :key="item.fileId"
                            :command="item"
                          >{{ item.fileName }}</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </template>
                  </el-table-column>
                  <el-table-column v-if="option.fileType === 'ACCEPTANCE_FILE'" :key="option.fileType" show-overflow-tooltip label="验收材料" align="center" min-width="80">
                    <template v-if="scope.row.options[columnIndex] && scope.row.options[columnIndex][optionIndex] && scope.row.options[columnIndex].length > 0" slot-scope="scope">
                      <el-dropdown
                        trigger="click"
                        @command="handleCommand"
                        @visible-change="val => getFileListById(val, scope.row.options[columnIndex][optionIndex])"
                      >
                        <el-button type="text">
                          <svg-icon class="button-icon" icon-class="download" />
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item
                            v-for="item in scope.row.options[columnIndex][optionIndex].fileList"
                            :key="item.fileId"
                            :command="item"
                          >{{ item.fileName }}</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </template>
                  </el-table-column>
                </template>
                <el-table-column label="操作" align="center" min-width="88">
                  <template v-if="scope.row.options[columnIndex] && scope.row.options[columnIndex].length > 0" slot-scope="scope">
                    <div>
                      <el-button
                        v-preventReClick
                        type="text"
                        @click="onOperate('modify', scope.row, column)"
                      >更新</el-button>
                    </div>
                    <div v-if="column.value === 'ACCEPTANCE_RESOURCE' || column.value === 'WAIT_ONLINE_RESOURCE'">
                      <el-button
                        v-preventReClick
                        type="text"
                        @click="onOperate('move', scope.row, column)"
                      >移动</el-button>
                    </div>
                    <div>
                      <el-button
                        v-preventReClick
                        type="text"
                        @click="onOperate('delete', scope.row, column)"
                      >删除</el-button>
                    </div>
                    <div>
                      <el-button
                        v-preventReClick
                        type="text"
                        @click="onOperate('versionRecord', scope.row.options[columnIndex])"
                      >版本记录</el-button>
                    </div>
                    <div>
                      <el-button
                        v-preventReClick
                        type="text"
                        @click="onOperate('moreView', scope.row, column)"
                      >更多查看</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table-column>
            </template>
          </el-table>
        </div>
      </div>
    </div>
    <!-- 发布公告 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="publishNoticeDialogObj.title"
      :visible.sync="publishNoticeDialogObj.visible"
      :modal-append-to-body="false"
      width="766px"
      @close="publishNoticeDialogObj.visible = false"
    >
      <el-form
        ref="publishNoticeForm"
        :model="publishNoticeDialogObj.form"
      >
        <el-form-item label="" prop="notice">
          <el-input
            v-model="publishNoticeDialogObj.form.notice"
            :autosize="{ minRows: 3, maxRows: 6}"
            type="textarea"
            placeholder="请输入内容"
            clearable
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button
          v-preventReClick
          type="primary"
          class="button-primary"
          @click="onOperate('publishNoticeSubmit')"
        >发布</el-button>
        <el-button
          class="button-default"
          @click="publishNoticeDialogObj.form.notice = ''"
        >重置</el-button>
      </span>
    </el-dialog>
    <!-- 接口类型管理 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="interfaceTypeManageDialogObj.title"
      :visible.sync="interfaceTypeManageDialogObj.visible"
      :modal-append-to-body="false"
      width="662px"
      @close="interfaceTypeManageDialogObj.visible = false"
    >
      <el-form
        ref="interfaceTypeManageForm"
        :model="interfaceTypeManageDialogObj.form"
        :rules="interfaceTypeManageDialogObj.rules"
      >
        <el-table
          :data="interfaceTypeManageDialogObj.form.list"
          style="width: 100%"
          fit
          stripe
          border
          highlight-current-row
        >
          <el-table-column type="index" label="序号" width="60" align="center" />
          <el-table-column label="接口类型名称" min-width="500">
            <template slot-scope="scope">
              <div class="interface-type" :class="{'is-edit':scope.row.isEdit}">
                <el-form-item
                  v-if="scope.row.isEdit"
                  label=""
                  :prop="'list.' + scope.$index + '.nodeTypeName'"
                  :rules="interfaceTypeManageDialogObj.rules.nodeTypeName"
                >
                  <el-row>
                    <el-col :span="22">
                      <el-input
                        :ref="'list' + scope.$index"
                        v-model.trim="scope.row.nodeTypeName"
                        v-limitBytes="300"
                        placeholder="请输入内容"
                        clearable
                        @blur="event => onOperateInterfaceType('blur', scope.$index)"
                      />
                    </el-col>
                    <el-col :span="2">
                      <el-button type="text" @click="onOperateInterfaceType('delete', scope.$index)">
                        <svg-icon class="ml10" icon-class="delete" />
                      </el-button>
                    </el-col>
                  </el-row>
                </el-form-item>
                <div v-else class="interface-type-text">{{ scope.row.nodeTypeName }}</div>
                <div class="interface-type-btn">
                  <el-button type="text" :disabled="hasEdit" @click="onOperateInterfaceType('edit', scope.$index)">
                    <svg-icon icon-class="edit" />
                  </el-button>
                  <el-button type="text" @click="onOperateInterfaceType('delete', scope.$index)">
                    <svg-icon icon-class="delete" />
                  </el-button>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          size="mini"
          class="interface-type-add"
          :disabled="hasEdit"
          @click="onOperateInterfaceType('add')"
        >
          <svg-icon icon-class="add" />添加
        </el-button>
      </el-form>
      <span slot="footer">
        <el-button
          v-preventReClick
          type="primary"
          class="button-primary"
          @click="onOperateInterfaceType('submit')"
        >提交</el-button>
        <el-button
          class="button-default"
          @click="interfaceTypeManageDialogObj.visible = false"
        >取消</el-button>
      </span>
    </el-dialog>
    <!-- 资源上传/更新资源 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="resourceUploadDialogObj.title"
      :visible.sync="resourceUploadDialogObj.visible"
      :modal-append-to-body="false"
      width="766px"
      @close="resourceUploadDialogObj.visible = false"
    >
      <el-form
        ref="resourceUploadForm"
        class="resource-upload"
        label-position="left"
        label-width="88px"
        :model="resourceUploadDialogObj"
        :rules="resourceUploadDialogObj.rules"
      >
        <el-form-item label="上传类型" prop="uploadType">
          <el-select
            v-model="resourceUploadDialogObj.uploadType"
            style="width: 100%;"
            placeholder="请选择"
            :disabled="resourceUploadDialogObj.type === 'modify'"
          >
            <el-option
              v-for="item in resourceUploadDialogObj.uploadTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <div v-for="(item, index) in resourceUploadDialogObj.uploadTypeList" :key="item.value">
          <template v-if="item.value === resourceUploadDialogObj.uploadType">
            <div v-for="(option, optionIndex) in item.options" :key="optionIndex">
              <el-row>
                <el-col :span="10" style="display: flex;">
                  <el-form-item
                    v-if="option.fileType !== 'ACCEPTANCE_FILE'"
                    label="版本号"
                    :prop="'uploadTypeList.' + index + '.options.' + optionIndex + '.resourceVersion'"
                    :rules="[
                      {required: option.fileList.length > 0, message: '不能为空', trigger: 'blur'}, { validator: ((rule, value, callback) => { validateVersion(rule, value, callback, option, index, optionIndex) }), trigger: 'blur' }
                    ]"
                  >
                    <el-input
                      v-model="option.resourceVersion"
                      :disabled="option.hasFile && resourceUploadDialogObj.type === 'modify'"
                      style="width: 100%;"
                      placeholder="请输入"
                      clearable
                    />
                  </el-form-item>
                  <svg-icon v-if="option.fileType !== 'ACCEPTANCE_FILE'" class="resource-upload-row-info" icon-class="info" />
                </el-col>
                <el-col :span="14">
                  <el-form-item
                    :label="fileTypeListFilter(option.fileType)"
                    :prop="'uploadTypeList.' + index + '.options.' + optionIndex + '.fileList.length'"
                    :rules="(option.fileType === 'GUIDE_FILE' || option.fileType === 'DEVELOP_PACKAGE' || option.fileType === 'DEVELOP_GUIDE' || (option.fileType === 'DATA_SET' && option.resourceVersion)) ? commonRules.files : (resourceUploadDialogObj.type === 'modify' && option.fileType !== 'ACCEPTANCE_FILE' && option.hasFile ? commonRules.files : [{required: false, message: '不能为空', trigger: 'change'}])"
                  >
                    <el-upload
                      class="upload-demo"
                      action="fakeaction"
                      :accept="accept"
                      :file-list="option.fileList"
                      :http-request="param => uploadFile(param, option, 'fileList')"
                      :on-preview="onPreview"
                      :on-remove="(file, fileList) =>onRemoveFile(file, fileList, option, 'fileList')"
                      :on-error="onError"
                    >
                      <el-button
                        slot="trigger"
                        class="upload-btn"
                        type="primary"
                      >
                        上传文件
                      </el-button>
                    </el-upload>
                    <el-input v-model="option.fileList.length" style="display: none;" />
                  </el-form-item>
                </el-col>
              </el-row>
              <template v-if="option.fileType === 'DEVELOP_PACKAGE' && showJar">
                <el-row v-for="(jarItem, jarIndex) in resourceUploadDialogObj.jarList" :key="jarIndex">
                  <el-col :span="10" style="display: flex;">
                    <el-form-item
                      label="版本号"
                      :prop="`jarList.${jarIndex}.version`"
                      :rules="commonRules.input"
                    >
                      <el-input
                        v-model="jarItem.version"
                        clearable
                      />
                    </el-form-item>
                    <svg-icon class="resource-upload-row-info" icon-class="info" />
                  </el-col>
                  <el-col :span="10" style="display: flex;">
                    <el-form-item
                      label="jar包名"
                      :prop="`jarList.${jarIndex}.value`"
                      :rules="commonRules.input"
                    >
                      <el-input
                        v-model="jarItem.value"
                        clearable
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-button type="text" @click="deleteJar(jarIndex)"><svg-icon class="ml10" icon-class="delete" /></el-button>
                  </el-col>
                </el-row>
                <el-button
                  size="mini"
                  class="interface-type-add"
                  style="margin: 0 0 10px 0;"
                  @click="addJar"
                >
                  <svg-icon icon-class="add" />添加jar包
                </el-button>
              </template>
            </div>
          </template>
        </div>
      </el-form>
      <span slot="footer">
        <el-button
          v-preventReClick
          type="primary"
          class="button-primary"
          @click="onOperate('resourceUploadSubmit')"
        >确定</el-button>
        <el-button
          class="button-default"
          @click="resourceUploadDialogObj.visible = false"
        >取消</el-button>
      </span>
    </el-dialog>
    <!-- 版本记录 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="versionRecordDialogObj.title"
      :visible.sync="versionRecordDialogObj.visible"
      :modal-append-to-body="false"
      width="766px"
      @close="versionRecordDialogObj.visible = false"
    >
      <el-table
        :data="versionRecordDialogObj.list"
        style="width: 100%"
        fit
        stripe
        border
        highlight-current-row
      >
        <el-table-column
          prop="fileType"
          label="资源类型"
          width="120"
        />
        <el-table-column
          show-overflow-tooltip
          prop="userName"
          label="更新人"
          min-width="120"
        />
        <el-table-column
          prop="fileName"
          label="文件名称"
          min-width="150"
        >
          <template slot-scope="scope">
            <span class="link-type" @click="onPreview(scope.row)">{{ scope.row.fileName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTs"
          label="更新时间"
          width="155"
        />
        <el-table-column
          prop="resourceVersion"
          label="版本号"
          width="70"
        />
      </el-table>
    </el-dialog>
    <!-- 更多查看 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="moreViewDialogObj.title"
      :visible.sync="moreViewDialogObj.visible"
      :modal-append-to-body="false"
      width="766px"
      @close="moreViewDialogObj.visible = false"
    >
      <el-table
        :data="moreViewDialogObj.list"
        :span-method="objectSpanMethod"
        :max-height="moreViewDialogObj.height"
        style="width: 100%"
        fit
        stripe
        border
        highlight-current-row
      >
        <el-table-column
          prop="nodeTypeName"
          label="接口类型"
          width="120"
        />
        <el-table-column :label="moreViewDialogObj.currentColumn.label" align="center">
          <template v-for="(option, optionIndex) in moreViewDialogObj.currentColumn.options">
            <el-table-column v-if="option.fileType !== 'ACCEPTANCE_FILE'" :key="option.fileType + 'version'" label="版本号" align="center" min-width="70">
              <template v-if="scope.row.options[optionIndex]" slot-scope="scope">
                {{ scope.row.options[optionIndex].resourceVersion }}
              </template>
            </el-table-column>
            <el-table-column v-if="option.fileType !== 'ACCEPTANCE_FILE'" :key="option.fileType" show-overflow-tooltip :label="option.label" align="center" min-width="80">
              <template v-if="scope.row.options[optionIndex]" slot-scope="scope">
                <el-dropdown
                  trigger="click"
                  @command="handleCommand"
                  @visible-change="val => getFileListById(val, scope.row.options[optionIndex])"
                >
                  <el-button type="text">
                    <svg-icon class="button-icon" icon-class="download" />
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in scope.row.options[optionIndex].fileList"
                      :key="item.fileId"
                      :command="item"
                    >{{ item.fileName }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
            <el-table-column v-if="option.fileType === 'ACCEPTANCE_FILE'" :key="option.fileType" show-overflow-tooltip label="验收材料" align="center" min-width="80">
              <template v-if="scope.row.options[optionIndex]" slot-scope="scope">
                <el-dropdown
                  trigger="click"
                  @command="handleCommand"
                  @visible-change="val => getFileListById(val, scope.row.options[optionIndex])"
                >
                  <el-button type="text">
                    <svg-icon class="button-icon" icon-class="download" />
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item
                      v-for="item in scope.row.options[optionIndex].fileList"
                      :key="item.fileId"
                      :command="item"
                    >{{ item.fileName }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </template>
            </el-table-column>
          </template>
          <el-table-column label="操作" align="center" min-width="88">
            <template slot-scope="scope">
              <div>
                <el-button
                  v-preventReClick
                  type="text"
                  @click="onOperate('modify', scope.row, moreViewDialogObj.currentColumn)"
                >更新</el-button>
              </div>
              <div v-if="moreViewDialogObj.currentColumn.value === 'ACCEPTANCE_RESOURCE' || moreViewDialogObj.currentColumn.value === 'WAIT_ONLINE_RESOURCE'">
                <el-button
                  v-preventReClick
                  type="text"
                  @click="onOperate('move', scope.row, moreViewDialogObj.currentColumn)"
                >移动</el-button>
              </div>
              <div>
                <el-button
                  v-preventReClick
                  type="text"
                  @click="onOperate('deleteMore', scope.row, moreViewDialogObj.currentColumn)"
                >删除</el-button>
              </div>
              <div>
                <el-button
                  v-preventReClick
                  type="text"
                  @click="onOperate('versionRecord', scope.row.options)"
                >版本记录</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 适用接口查看 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="interfaceViewDialogObj.title"
      :visible.sync="interfaceViewDialogObj.visible"
      :modal-append-to-body="false"
      width="1080px"
      @close="interfaceViewDialogObj.visible = false"
    >
      <el-button
        type="primary"
        size="mini"
        class="mb10"
        @click="onOperate('interfaceEdit', interfaceViewDialogObj.row)"
      ><svg-icon icon-class="publish" />编辑</el-button>
      <tableTree
        :origin-data="interfaceViewDialogObj.nodeList"
        :table-columns="interfaceViewDialogObj.headList"
        :height="interfaceEditDialogObj.height"
      />
    </el-dialog>
    <!-- 适用接口编辑 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="interfaceEditDialogObj.title"
      :visible.sync="interfaceEditDialogObj.visible"
      :modal-append-to-body="false"
      width="1080px"
      destroy-on-close
      @close="interfaceEditDialogObj.visible = false"
    >
      <el-form
        ref="searchForm"
        :model="interfaceEditDialogObj.form"
        label-position="left"
        inline
      >
        <template v-if="activeName === '00'">
          <el-form-item label="市场" prop="marketList">
            <el-select
              v-model="interfaceEditDialogObj.form.marketList"
              placeholder="请选择"
              multiple
              collapse-tags
            >
              <el-option
                v-for="item in interfaceEditDialogObj.options.marketList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="接口用途" prop="usageList">
            <el-select
              v-model="interfaceEditDialogObj.form.usageList"
              placeholder="请选择"
              multiple
              collapse-tags
            >
              <el-option
                v-for="item in interfaceEditDialogObj.options.usageList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="接口产品" prop="productList">
            <el-select
              v-model="interfaceEditDialogObj.form.productList"
              placeholder="请选择"
              multiple
              collapse-tags
            >
              <el-option
                v-for="item in interfaceEditDialogObj.options.productList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </template>
        <template v-if="activeName === '10'">
          <el-form-item label="产品类型" prop="typeList">
            <el-select
              v-model="interfaceEditDialogObj.form.typeList"
              placeholder="请选择"
              multiple
              collapse-tags
            >
              <el-option
                v-for="item in interfaceEditDialogObj.options.typeList"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </template>
        <el-form-item>
          <el-button type="primary" size="mini" @click="onSearchTree">查询</el-button>
          <el-button size="mini" @click="onResetTree">重置</el-button>
        </el-form-item>
      </el-form>
      <tableTree
        ref="tableTree"
        :origin-data="interfaceEditDialogObj.nodeList"
        :table-columns="interfaceEditDialogObj.headList"
        :height="interfaceEditDialogObj.height"
        show-checkbox
      />
      <span slot="footer">
        <el-button
          v-preventReClick
          type="primary"
          class="button-primary"
          @click="submitTree"
        >保存</el-button>
        <el-button
          class="button-default"
          @click="interfaceEditDialogObj.visible = false"
        >取消</el-button>
      </span>
    </el-dialog>
    <!-- 移动 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="moveDialogObj.title"
      :visible.sync="moveDialogObj.visible"
      :modal-append-to-body="false"
      width="766px"
      @close="moveDialogObj.visible = false"
    >
      <el-form
        ref="moveForm"
        class="move-dialog"
        :model="moveDialogObj"
        :rules="moveDialogObj.rules"
        inline
      >
        <div v-for="item in moveDialogObj.list" :key="item.fileType" class="move-dialog-row">
          <div class="move-dialog-row-label">{{ item.label }}</div>
          <el-row>
            <el-col :span="12">
              <el-form-item label="版本号">
                <el-input
                  v-model="item.resourceVersion"
                  disabled
                />
              </el-form-item>

            </el-col>
            <el-col :span="12">
              <el-form-item label="文件">
                <el-upload
                  action="fakeaction"
                  :accept="accept"
                  :file-list="item.fileList"
                  :on-preview="onPreview"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-form-item label="移动至" prop="resourceType" :rules="commonRules.change">
          <el-select
            v-model="moveDialogObj.resourceType"
            style="width: 100%;"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="option in moveDialogObj.options"
              :key="option.value"
              :label="option.label"
              :value="option.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button
          v-preventReClick
          type="primary"
          class="button-primary"
          @click="onOperate('moveSubmit')"
        >确定</el-button>
        <el-button
          class="button-default"
          @click="moveDialogObj.visible = false"
        >取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Tabs from '@/components/Tabs'
import { downloadFile, isNull } from '@/utils/index'
import { uploadLogin, downloadAuthen } from '@/api/file'
import { getMarketMarket, getMarketUsage, getMarketProduct, getInformationProduct } from '@/api/interface-service/serviceOpeningApi'
import resourceApi from '@/api/grip-manage/resourceApi'
const blurRequired = [{ required: true, message: '不能为空', trigger: 'blur' }]
const changeRequired = [{ required: true, message: '不能为空', trigger: 'change' }]
const validateFiles = (rule, value, callback) => {
  if (value === 0) {
    callback(new Error('不能为空'))
  } else {
    callback()
  }
}
const fileRequired = [
  { required: true, validator: validateFiles, trigger: 'change' }
]
export default {
  components: {
    Tabs
  },
  data() {
    return {
      activeName: '00',
      accept: '.PDF,.pdf,.xls,.xlsx,.doc,.docx,.rar,.zip,.7z,7Z',
      itemList: [
        {
          label: '市场机构',
          value: '00'
        },
        {
          label: '信息商',
          value: '10'
        }
      ],
      sortArr: ['GUIDE_FILE', 'DATA_SET', 'DEVELOP_PACKAGE', 'DEVELOP_GUIDE', 'ACCEPTANCE_FILE'],
      fileTypeList: [
        {
          label: '指引文件',
          value: 'GUIDE_FILE'
        },
        {
          label: '数据集',
          value: 'DATA_SET'
        },
        {
          label: '开发包',
          value: 'DEVELOP_PACKAGE'
        },
        {
          label: '开发指引',
          value: 'DEVELOP_GUIDE'
        },
        {
          label: '验收材料',
          value: 'ACCEPTANCE_FILE'
        }
      ],
      uploadTypeList: [
        {
          label: '业务指引',
          value: 'BUSINESS_GUIDE',
          options: [
            {
              description: '',
              nodeTypeId: null,
              fileType: 'GUIDE_FILE',
              resourceVersion: '',
              resourceType: 'BUSINESS_GUIDE',
              fileList: []
            },
            {
              description: '',
              nodeTypeId: null,
              fileType: 'DATA_SET',
              resourceVersion: '',
              resourceType: 'BUSINESS_GUIDE',
              fileList: []
            }
          ]
        },
        {
          label: '生产环境资源',
          value: 'PRODUCT_RESOURCE',
          options: [
            {
              description: '',
              nodeTypeId: null,
              fileType: 'DEVELOP_PACKAGE',
              resourceVersion: '',
              resourceType: 'PRODUCT_RESOURCE',
              fileList: []
            },
            {
              description: '',
              nodeTypeId: null,
              fileType: 'DEVELOP_GUIDE',
              resourceVersion: '',
              resourceType: 'PRODUCT_RESOURCE',
              fileList: []
            }
          ]
        },
        {
          label: '验收环境资源',
          value: 'ACCEPTANCE_RESOURCE',
          options: [
            {
              description: '',
              nodeTypeId: null,
              fileType: 'DEVELOP_PACKAGE',
              resourceVersion: '',
              resourceType: 'ACCEPTANCE_RESOURCE',
              fileList: []
            },
            {
              description: '',
              nodeTypeId: null,
              fileType: 'DEVELOP_GUIDE',
              resourceVersion: '',
              resourceType: 'ACCEPTANCE_RESOURCE',
              fileList: []
            },
            {
              description: '',
              nodeTypeId: null,
              fileType: 'ACCEPTANCE_FILE',
              resourceVersion: '',
              resourceType: 'ACCEPTANCE_RESOURCE',
              fileList: []
            }
          ]
        },
        {
          label: '待上线资源',
          value: 'WAIT_ONLINE_RESOURCE',
          options: [
            {
              description: '',
              nodeTypeId: null,
              fileType: 'DEVELOP_PACKAGE',
              resourceVersion: '',
              resourceType: 'WAIT_ONLINE_RESOURCE',
              fileList: []
            },
            {
              description: '',
              nodeTypeId: null,
              fileType: 'DEVELOP_GUIDE',
              resourceVersion: '',
              resourceType: 'WAIT_ONLINE_RESOURCE',
              fileList: []
            }
          ]
        }
      ],
      commonRules: {
        input: blurRequired,
        files: fileRequired,
        change: changeRequired
      },
      columnCheckedList: [],
      mainObj: {
        list: [],
        columns: [
          {
            label: '业务指引',
            value: 'BUSINESS_GUIDE',
            options: [
              {
                label: '指引文件',
                fileType: 'GUIDE_FILE'
              },
              {
                label: '数据集',
                fileType: 'DATA_SET'
              }
            ]
          },
          {
            label: '生产环境资源',
            value: 'PRODUCT_RESOURCE',
            options: [
              {
                label: '开发包',
                fileType: 'DEVELOP_PACKAGE'
              },
              {
                label: '开发指引',
                fileType: 'DEVELOP_GUIDE'
              }
            ]
          },
          {
            label: '验收环境资源',
            value: 'ACCEPTANCE_RESOURCE',
            options: [
              {
                label: '开发包',
                fileType: 'DEVELOP_PACKAGE'
              },
              {
                label: '开发指引',
                fileType: 'DEVELOP_GUIDE'
              },
              {
                label: '验收材料',
                fileType: 'ACCEPTANCE_FILE'
              }
            ]
          },
          {
            label: '待上线资源',
            value: 'WAIT_ONLINE_RESOURCE',
            options: [
              {
                label: '开发包',
                fileType: 'DEVELOP_PACKAGE'
              },
              {
                label: '开发指引',
                fileType: 'DEVELOP_GUIDE'
              }
            ]
          }
        ]
      },
      publishNoticeDialogObj: {
        visible: false,
        title: '发布公告',
        form: {
          notice: ''
        },
        rules: {
          notice: [{ required: true, message: '不能为空', trigger: 'blur' }]
        }
      },
      interfaceTypeManageDialogObj: {
        visible: false,
        title: '接口类型管理',
        hasEdit: false,
        form: {
          list: []
        },
        originList: [],
        deleteList: [],
        rules: {
          nodeTypeName: blurRequired
        }
      },
      resourceUploadDialogObj: {
        visible: false,
        title: '',
        type: '',
        nodeTypeId: null,
        uploadType: '',
        uploadTypeList: [],
        jarList: [],
        rules: {
          uploadType: blurRequired
        }
      },
      versionRecordDialogObj: {
        visible: false,
        title: '版本记录',
        list: []
      },
      moreViewDialogObj: {
        visible: false,
        title: '更多查看',
        height: 100,
        row: {},
        uploadType: {},
        nodeTypeName: '',
        list: [],
        currentColumn: {},
        columns: [
          {
            label: '业务指引',
            value: 'BUSINESS_GUIDE',
            options: [
              {
                label: '指引文件',
                fileType: 'GUIDE_FILE'
              },
              {
                label: '数据集',
                fileType: 'DATA_SET'
              }
            ]
          },
          {
            label: '生产环境资源',
            value: 'PRODUCT_RESOURCE',
            options: [
              {
                label: '开发包',
                fileType: 'DEVELOP_PACKAGE'
              },
              {
                label: '开发指引',
                fileType: 'DEVELOP_GUIDE'
              }
            ]
          },
          {
            label: '验收环境资源',
            value: 'ACCEPTANCE_RESOURCE',
            options: [
              {
                label: '开发包',
                fileType: 'DEVELOP_PACKAGE'
              },
              {
                label: '开发指引',
                fileType: 'DEVELOP_GUIDE'
              },
              {
                label: '验收材料',
                fileType: 'ACCEPTANCE_FILE'
              }
            ]
          },
          {
            label: '待上线资源',
            value: 'WAIT_ONLINE_RESOURCE',
            options: [
              {
                label: '开发包',
                fileType: 'DEVELOP_PACKAGE'
              },
              {
                label: '开发指引',
                fileType: 'DEVELOP_GUIDE'
              }
            ]
          }
        ]
      },
      interfaceViewDialogObj: {
        visible: false,
        title: '适用接口查看',
        row: {},
        headList: [],
        nodeList: []
      },
      interfaceEditDialogObj: {
        visible: false,
        title: '适用接口编辑',
        height: 100,
        row: {},
        headList: [],
        nodeList: [],
        form: {
          marketList: [],
          usageList: [],
          productList: [],
          typeList: []
        },
        options: {
          marketList: [],
          usageList: [],
          productList: [],
          typeList: []
        }
      },
      moveDialogObj: {
        visible: false,
        title: '移动',
        resourceType: '',
        optionsOrigin: [
          {
            label: '生产环境资源',
            value: 'PRODUCT_RESOURCE'
          },
          {
            label: '验收环境资源',
            value: 'ACCEPTANCE_RESOURCE'
          },
          {
            label: '待上线资源',
            value: 'WAIT_ONLINE_RESOURCE'
          }
        ],
        options: [],
        list: [
          {
            label: '开发指引',
            fileType: 'DEVELOP_GUIDE',
            resourceVersion: '',
            fileList: [],
            value: ''
          },
          {
            label: '开发包',
            fileType: 'DEVELOP_PACKAGE',
            resourceVersion: '',
            fileList: [],
            value: ''
          }
        ],
        rules: {
          developGuide: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if (isNull(value) && isNull(this.moveDialogObj.list[1].value)) {
                  callback(new Error('不能同时为空'))
                } else {
                  callback()
                }
              },
              trigger: 'change'
            }
          ],
          developPackage: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if (isNull(value) && isNull(this.moveDialogObj.list[0].value)) {
                  callback(new Error('不能同时为空'))
                } else {
                  callback()
                }
              },
              trigger: 'change'
            }
          ]
        }
      }
    }
  },
  computed: {
    hasEdit() {
      return this.interfaceTypeManageDialogObj.form.list.some(e => e.isEdit)
    },
    uploadTypeOptions() {
      const obj = this.resourceUploadDialogObj.uploadTypeList.find(e => e.value === this.resourceUploadDialogObj.uploadType)
      return obj ? obj.options : []
    },
    showJar() {
      const obj = this.resourceUploadDialogObj.uploadTypeList.find(e => e.value === this.resourceUploadDialogObj.uploadType)
      const options = obj ? obj.options : []
      return options.some(e => e.fileType === 'DEVELOP_PACKAGE')
    }
  },
  created() {
    this.getResourceUploadList()
    this.getMarketMarket()
    this.getMarketUsage()
    this.getMarketProduct()
    this.getInformationProduct()
    this.columnCheckedList = []
    this.uploadTypeList.forEach(e => {
      this.columnCheckedList.push(e.value)
    })
  },
  mounted() {
    this.$nextTick(() => {
      const interfaceEditDialogAutoHeight = this.$root.$el.clientHeight - 320
      this.interfaceEditDialogObj.height = interfaceEditDialogAutoHeight > 100 ? interfaceEditDialogAutoHeight : 100

      const moreViewDialogAutoHeight = this.$root.$el.clientHeight - 140
      this.moreViewDialogObj.height = moreViewDialogAutoHeight > 100 ? moreViewDialogAutoHeight : 100

      window.onresize = () => {
        const interfaceEditDialogAutoHeight = this.$root.$el.clientHeight - 320
        this.interfaceEditDialogObj.height = interfaceEditDialogAutoHeight > 100 ? interfaceEditDialogAutoHeight : 100

        const moreViewDialogAutoHeight = this.$root.$el.clientHeight - 140
        this.moreViewDialogObj.height = moreViewDialogAutoHeight > 100 ? moreViewDialogAutoHeight : 100
      }
    })
  },
  destroyed() {
    window.onresize = null
  },
  methods: {
    fileTypeListFilter(val) {
      return this.fileTypeList.find(e => e.value === val).label
    },
    handleClick(tab) {
      console.log(tab)
      this.getResourceUploadList()
    },
    addJar() {
      this.resourceUploadDialogObj.jarList.push({
        version: '',
        value: ''
      })
    },
    deleteJar(index) {
      this.resourceUploadDialogObj.jarList = this.resourceUploadDialogObj.jarList.filter((e, i) => i !== index)
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex === 0) {
          return {
            rowspan: this.moreViewDialogObj.list.length,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    validateVersion(rule, value, callback, option, index, optionIndex) {
      if (option.fileList.length > 0 && isNull(value)) {
        callback(new Error('不能为空'))
      } else {
        if (option.fileType === 'DATA_SET') {
          this.$refs.resourceUploadForm.validateField('uploadTypeList.' + index + '.options.' + optionIndex + '.fileList.length')
        }
        callback()
      }
    },
    handleCommand(command) {
      console.log(command)
      this.downloadFile(command)
    },
    onChangeMoveOption(val, index) {
      console.log((val, index))
      const i = !index ? 1 : 0
      this.$refs.moveForm.validateField('list.' + i + '.value', error => {
        if (!error) {
          console.log(111)
        } else {
          return false
        }
      })
    },
    onChangeColumnChecked(val) {
      console.log(val)
    },
    onPreview(file) {
      console.log('preview:' + file)
      const fileObj = {
        fileId: file.fileId,
        fileName: file.name || file.fileName
      }
      this.downloadFile(fileObj)
    },
    onRemoveFile(file, fileList, item, key) {
      console.log('remove:' + file, fileList)
      item[key] = fileList
    },
    onError(err, file, fileList) {
      console.log('error:' + err, file, fileList)
    },
    uploadFile(param, item, key) {
      const file = param.file
      console.log(file)
      const fileNameArr = file.name.split('.')
      const fileType = fileNameArr[fileNameArr.length - 1]
      // 兼容ie，因为el-upload的accept不支持ie
      if (this.accept.indexOf(fileType) < 0) {
        this.$message.error(`上传失败，文件类型不支持`)
        param.onError()
        return
      }
      const isLt50M = file.size / 1024 / 1024 <= 100
      if (!isLt50M) {
        this.$message.error(`上传失败，文件大小超过100MB`)
        param.onError()
        return
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const form = new FormData()
      form.append('file', file)
      uploadLogin(form).then(res => {
        console.log(res)
        loading.close()
        if (res.code === 'ACK') {
          this.$message({
            message: `${res.data.fileName}上传成功`,
            type: 'success'
          })
          item[key].push({
            name: res.data.fileName,
            fileName: res.data.fileName,
            fileId: res.data.id
          })
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      }).catch(() => {
        loading.close()
        param.onError()
      })
    },
    downloadFile(fileObj) {
      console.log(fileObj)
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      downloadAuthen(fileObj.fileId).then(res => {
        loading.close()
        downloadFile(res.data, fileObj.fileName, fileObj.type)
        this.$message({
          type: 'success',
          message: '下载成功!'
        })
      }).catch(() => {
        loading.close()
        this.$message({
          type: 'error',
          message: '下载失败!'
        })
      })
    },
    getFileListById(val, row) {
      console.log(val, row)
      if (val) {
        const params = {
          resourceVersionId: row.id
        }
        resourceApi.getFileListById(params).then(res => {
          row.fileList = res.data
        })
      }
    },
    async getFileListByIdForWait(row) {
      const params = {
        resourceVersionId: row.id
      }
      return new Promise((resolve, reject) => {
        resourceApi.getFileListById(params).then(res => {
          row.fileList = res.data.map(e => {
            e.name = e.fileName
            return e
          })
          resolve(res.data)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取主列表
    getResourceUploadList() {
      const params = {
        institutionType: this.activeName,
        nodeIds: []
      }
      resourceApi.getResourceUploadList(params).then(res => {
        console.log(res.data)
        const includesKeys = ['businessGuide', 'acceptanceResource', 'productResource', 'waitOnlineResource']
        this.mainObj.list = res.data.map(e => {
          for (const key of Object.keys(e)) {
            if (includesKeys.includes(key)) {
              e[key] = e[key] ? e[key] : []
              e[key].map(item => {
                item.fileList = []
                return item
              })
              e[key].sort((a, b) => {
                const aIndex = this.sortArr.findIndex(s => s === a.fileType.code)
                const bIndex = this.sortArr.findIndex(s => s === b.fileType.code)
                return aIndex - bIndex
              })
            }
          }
          return e
        }).map(e => {
          e.options = [e.businessGuide, e.productResource, e.acceptanceResource, e.waitOnlineResource]
          return e
        })
        console.log(this.mainObj.list)
      })
    },
    // 获取市场机构-所有市场
    getMarketMarket() {
      getMarketMarket().then(res => {
        this.interfaceEditDialogObj.options.marketList = res.data
      })
    },
    // 获取市场机构-所有接口用途
    getMarketUsage() {
      getMarketUsage().then(res => {
        this.interfaceEditDialogObj.options.usageList = res.data
      })
    },
    // 获取市场机构-所有接口产品
    getMarketProduct() {
      getMarketProduct().then(res => {
        this.interfaceEditDialogObj.options.productList = res.data
      })
    },
    // 获取信息商-所有产品类型
    getInformationProduct() {
      getInformationProduct().then(res => {
        this.interfaceEditDialogObj.options.typeList = res.data
      })
    },
    onSearchTree() {
      const params = {
        menuInstiType: this.activeName,
        nodeTypeId: this.interfaceEditDialogObj.row.nodeTypeId
      }
      if (this.activeName === '00') {
        Object.assign(params, {
          levelOneList: this.interfaceEditDialogObj.form.marketList,
          levelTwoNameList: this.interfaceEditDialogObj.form.usageList,
          levelThreeList: this.interfaceEditDialogObj.form.productList
        })
      } else {
        Object.assign(params, {
          levelOneList: [],
          levelTwoNameList: this.interfaceEditDialogObj.form.typeList
        })
      }
      resourceApi.getNodesEdit(params).then(res => {
        this.interfaceEditDialogObj.headList = res.data.headList
        this.interfaceEditDialogObj.nodeList = res.data.nodeList
      })
    },
    onResetTree() {
      this.$refs.searchForm.resetFields()
      this.onSearchTree()
    },
    submitTree() {
      console.log(this.$refs.tableTree.getCheckedNodeList())
      const checkedList = this.$refs.tableTree.getCheckedNodeList().filter(e => e.editType.code === '00')
      const checkedLeafList = checkedList.filter(e => e.isLeafFlg.name === 'YES')
      const checkedLeafIdList = checkedLeafList.map(e => e.id)
      // if (checkedLeafIdList.length === 0) {
      //   this.$message({
      //     type: 'info',
      //     message: '请至少选择一个接口'
      //   })
      //   return
      // }
      const params = {
        nodeIds: checkedLeafIdList,
        nodeTypeId: this.interfaceEditDialogObj.row.nodeTypeId
      }
      resourceApi.saveNodesEdit(params).then(res => {
        this.$message({
          type: 'success',
          message: res.message
        })
        this.interfaceEditDialogObj.visible = false
        this.onOperate('interfaceView', this.interfaceEditDialogObj.row)
      })
    },
    /**
     * @method: onOperate
     * @param {String} type publishNotice: 发布公告, publishNoticeSubmit: 发布公告提交, interfaceTypeManage: 接口类型管理, versionRecord: 版本记录, moreView: 更多查看, resourceUpload: 资源上传, modify: 更新资源, interfaceView: 接口查看, interfaceEdit：接口编辑, resourceUploadSubmit: 资源上传提交, delete: 主列表删除, deleteMore: 更多查看删除, move: 移动, moveSubmit: 移动提交
     * @return {Object} row
     * @return {Object} uploadType
     */
    onOperate(type, row, uploadType) {
      console.log(type, row, uploadType)
      if (type === 'publishNotice') {
        this.publishNoticeDialogObj.visible = true
        resourceApi.getNotoce().then(res => {
          this.publishNoticeDialogObj.form.notice = res.data
        })
      } else if (type === 'publishNoticeSubmit') {
        this.$refs.publishNoticeForm.validate(valid => {
          if (valid) {
            console.log(this.publishNoticeDialogObj.form)
            this.$confirm('是否确认发布给机构端?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              const params = {
                notice: this.publishNoticeDialogObj.form.notice
              }
              resourceApi.saveNotoce(params).then(res => {
                this.$message({
                  type: 'success',
                  message: res.message
                })
                this.publishNoticeDialogObj.visible = false
              })
            })
          }
        })
      } else if (type === 'interfaceTypeManage') {
        this.interfaceTypeManageDialogObj.visible = true
        this.interfaceTypeManageDialogObj.deleteList = []
        const params = {
          institutionType: this.activeName
        }
        resourceApi.getInterfaceTypeList(params).then(res => {
          this.interfaceTypeManageDialogObj.originList = JSON.parse(JSON.stringify(res.data))
          this.interfaceTypeManageDialogObj.form.list = res.data.map(e => {
            e.isEdit = false
            return e
          })
        })
      } else if (type === 'versionRecord') {
        this.versionRecordDialogObj.visible = true
        let resourceId
        if (row && row.length > 0) {
          resourceId = row[0].resourceId
        }
        const params = {
          resourceId: resourceId
        }
        resourceApi.getVersionRecordList(params).then(res => {
          this.versionRecordDialogObj.list = res.data
        })
      } else if (type === 'moreView') {
        this.moreViewDialogObj.visible = true
        this.moreViewDialogObj.row = row
        this.moreViewDialogObj.uploadType = uploadType
        this.moreViewDialogObj.nodeTypeName = row.nodeTypeName
        const params = {
          nodeTypeId: row.nodeTypeId,
          resourceType: uploadType.value
        }
        resourceApi.getMoreViewList(params).then(res => {
          this.moreViewDialogObj.currentColumn = this.moreViewDialogObj.columns.find(e => e.value === uploadType.value)
          this.moreViewDialogObj.list = res.data.map(e => {
            e.nodeTypeName = this.moreViewDialogObj.nodeTypeName
            e.resourceList.map(item => {
              item.fileList = []
              return item
            })
            e.options = e.resourceList.sort((a, b) => {
              const aIndex = this.sortArr.findIndex(s => s === a.fileType.code)
              const bIndex = this.sortArr.findIndex(s => s === b.fileType.code)
              return aIndex - bIndex
            })
            return e
          })
          console.log(this.moreViewDialogObj.list)
        })
      } else if (type === 'resourceUpload') {
        this.resourceUploadDialogObj.visible = true
        this.resourceUploadDialogObj.title = '资源上传'
        this.resourceUploadDialogObj.type = type
        this.resourceUploadDialogObj.uploadType = 'BUSINESS_GUIDE'
        this.resourceUploadDialogObj.nodeTypeId = row.nodeTypeId
        const sortArr = ['GUIDE_FILE', 'DATA_SET', 'DEVELOP_GUIDE', 'DEVELOP_PACKAGE', 'ACCEPTANCE_FILE']
        this.resourceUploadDialogObj.uploadTypeList = JSON.parse(JSON.stringify(this.uploadTypeList)).map(e => {
          e.options.sort((a, b) => {
            const aIndex = sortArr.findIndex(s => s === a.fileType)
            const bIndex = sortArr.findIndex(s => s === b.fileType)
            return aIndex - bIndex
          })
          return e
        })
        this.resourceUploadDialogObj.jarList = []
        this.$nextTick(() => {
          this.$refs.resourceUploadForm.clearValidate()
        })
      } else if (type === 'modify') {
        this.resourceUploadDialogObj.visible = true
        this.resourceUploadDialogObj.title = '更新资源'
        this.resourceUploadDialogObj.type = type
        this.resourceUploadDialogObj.uploadType = uploadType.value
        this.resourceUploadDialogObj.nodeTypeId = row.nodeTypeId
        const sortArr = ['GUIDE_FILE', 'DATA_SET', 'DEVELOP_GUIDE', 'DEVELOP_PACKAGE', 'ACCEPTANCE_FILE']
        this.resourceUploadDialogObj.uploadTypeList = JSON.parse(JSON.stringify(this.uploadTypeList)).map(e => {
          e.options.sort((a, b) => {
            const aIndex = sortArr.findIndex(s => s === a.fileType)
            const bIndex = sortArr.findIndex(s => s === b.fileType)
            return aIndex - bIndex
          })
          return e
        })
        console.log(this.resourceUploadDialogObj)
        const waitFileList = []
        let currentOptions = []
        // row.options是为了兼容主列表和更多查看
        switch (this.resourceUploadDialogObj.uploadType) {
          case 'BUSINESS_GUIDE':
            currentOptions = row.businessGuide || row.options
            break
          case 'PRODUCT_RESOURCE':
            currentOptions = row.productResource || row.options
            break
          case 'ACCEPTANCE_RESOURCE':
            currentOptions = row.acceptanceResource || row.options
            break
          case 'WAIT_ONLINE_RESOURCE':
            currentOptions = row.waitOnlineResource || row.options
            break
        }
        currentOptions.forEach(e => {
          if (e.fileType.code === 'DEVELOP_PACKAGE') {
            this.resourceUploadDialogObj.jarList = e.description ? JSON.parse(e.description) : []
          }
          const obj = this.resourceUploadDialogObj.uploadTypeList.find(item => item.value === this.resourceUploadDialogObj.uploadType).options.find(option => option.fileType === e.fileType.code)
          waitFileList.push(this.getFileListByIdForWait(Object.assign(obj, { id: e.id, resourceVersion: e.resourceVersion, resourceId: e.resourceId, hasFile: true })))
        })
        Promise.allSettled(waitFileList).then(results => {
          console.log(results)
        })
      } else if (type === 'interfaceView') {
        this.interfaceViewDialogObj.visible = true
        this.interfaceViewDialogObj.row = row
        const params = {
          menuInstiType: this.activeName,
          nodeTypeId: row.nodeTypeId
        }
        resourceApi.getNodesView(params).then(res => {
          this.interfaceViewDialogObj.headList = res.data.headList
          this.interfaceViewDialogObj.nodeList = res.data.nodeList
        })
      } else if (type === 'interfaceEdit') {
        this.interfaceEditDialogObj.visible = true
        this.interfaceEditDialogObj.row = row
        this.interfaceEditDialogObj.form = {
          marketList: [],
          usageList: [],
          productList: [],
          typeList: []
        }
        this.onSearchTree()
      } else if (type === 'resourceUploadSubmit') {
        this.$refs.resourceUploadForm.validate(valid => {
          if (valid) {
            const options = this.resourceUploadDialogObj.uploadTypeList.find(e => e.value === this.resourceUploadDialogObj.uploadType).options
            const totalFileNum = options.reduce((last, cur) => {
              const fileNum = cur.fileList.length
              return fileNum + last
            }, 0)
            const guideFileList = options.find(e => e.fileType === 'GUIDE_FILE')
            // 指引文件数据集可以不传，所以必须校验文件
            if (this.resourceUploadDialogObj.uploadType === 'BUSINESS_GUIDE' && guideFileList.fileList.length === 0) {
              this.$message({
                type: 'info',
                message: '请至少上传一个文件!'
              })
              return
            }
            if (totalFileNum === 0) {
              this.$message({
                type: 'info',
                message: '请至少上传一个文件!'
              })
              return
            }
            options.map(e => {
              e.nodeTypeId = this.resourceUploadDialogObj.nodeTypeId
              return e
            })
            const copyOptions = JSON.parse(JSON.stringify(options))
            copyOptions.map(e => {
              const arr = []
              e.fileList.forEach(file => {
                const obj = {
                  fileName: file.fileName,
                  fileId: file.fileId
                }
                arr.push(obj)
              })
              e.fileList = arr
              return e
            })
            console.log(copyOptions)
            const copyOptionsFilter = copyOptions
            // 上传过滤空的file，更新保留
            // if (this.resourceUploadDialogObj.type === 'modify') {
            //   copyOptionsFilter = copyOptions
            // } else {
            //   copyOptionsFilter = copyOptions.filter(e => e.fileList.length > 0)
            // }
            // 开发包加上jar包
            copyOptionsFilter.map(e => {
              if (e.fileType === 'DEVELOP_PACKAGE') {
                e.description = JSON.stringify(this.resourceUploadDialogObj.jarList)
              }
            })
            resourceApi.uploadResourceUploadFile(copyOptionsFilter, this.resourceUploadDialogObj.type).then(res => {
              this.$message({
                type: 'success',
                message: res.message
              })
              this.resourceUploadDialogObj.visible = false
              this.getResourceUploadList()
              // 如果是更新更多查看的资源，刷新更多查看列表
              if (this.moreViewDialogObj.visible) {
                this.onOperate('moreView', this.moreViewDialogObj.row, this.moreViewDialogObj.uploadType)
              }
            })
          }
        })
      } else if (type === 'delete') {
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(row, uploadType)
          let currentOptions = []
          switch (uploadType.value) {
            case 'BUSINESS_GUIDE':
              currentOptions = row.businessGuide
              break
            case 'PRODUCT_RESOURCE':
              currentOptions = row.productResource
              break
            case 'ACCEPTANCE_RESOURCE':
              currentOptions = row.acceptanceResource
              break
            case 'WAIT_ONLINE_RESOURCE':
              currentOptions = row.waitOnlineResource
              break
          }
          if (currentOptions.length > 0) {
            const params = {
              resourceId: currentOptions[0].resourceId
            }
            resourceApi.deleteResourceUploadFile(params).then(res => {
              this.$message({
                type: 'success',
                message: res.message
              })
              this.getResourceUploadList()
            })
          } else {
            this.$message({
              type: 'info',
              message: '删除失败!'
            })
          }
        })
      } else if (type === 'deleteMore') {
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = {
            resourceId: row.resourceId
          }
          resourceApi.deleteResourceUploadFile(params).then(res => {
            this.$message({
              type: 'success',
              message: res.message
            })
            this.getResourceUploadList()
            // 更多查看删完时关闭弹窗并刷新主列表
            if (this.moreViewDialogObj.list.length === 1) {
              this.moreViewDialogObj.visible = false
            } else {
              this.onOperate('moreView', row, uploadType)
            }
          })
        })
      } else if (type === 'move') {
        this.moveDialogObj.visible = true
        this.moveDialogObj.resourceType = ''
        const options = JSON.parse(JSON.stringify(this.moveDialogObj.optionsOrigin))
        this.moveDialogObj.options = options.filter(e => e.value !== uploadType.value)
        this.moveDialogObj.list = [
          {
            label: '开发指引',
            fileType: 'DEVELOP_GUIDE',
            resourceVersion: '',
            fileList: [],
            value: ''
          },
          {
            label: '开发包',
            fileType: 'DEVELOP_PACKAGE',
            resourceVersion: '',
            fileList: [],
            value: ''
          }
        ]
        const waitFileList = []
        let currentOptions = []
        // row.options是为了兼容主列表和更多查看
        switch (uploadType.value) {
          case 'ACCEPTANCE_RESOURCE':
            currentOptions = row.acceptanceResource || row.options
            break
          case 'WAIT_ONLINE_RESOURCE':
            currentOptions = row.waitOnlineResource || row.options
            break
        }
        console.log('currentOptions', currentOptions)
        // 这步过滤是因为验收资源环境每一对还多一个文件
        currentOptions = currentOptions.filter(e => this.moveDialogObj.list.some(item => item.fileType === e.fileType.code))
        currentOptions.forEach(e => {
          const obj = this.moveDialogObj.list.find(item => item.fileType === e.fileType.code)
          waitFileList.push(this.getFileListByIdForWait(Object.assign(obj, { id: e.id, resourceVersion: e.resourceVersion, resourceId: e.resourceId })))
        })
        Promise.allSettled(waitFileList).then(results => {
          console.log(results)
        })
        this.$nextTick(() => {
          this.$refs.moveForm.clearValidate()
        })
      } else if (type === 'moveSubmit') {
        this.$refs.moveForm.validate(valid => {
          if (valid) {
            console.log(this.moveDialogObj.resourceType)
            this.$confirm('确认移动吗?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              const params = {
                resourceId: this.moveDialogObj.list[0].resourceId,
                resourceType: this.moveDialogObj.resourceType
              }
              resourceApi.moveResource(params).then(res => {
                this.$message({
                  type: 'success',
                  message: res.message
                })
                this.moveDialogObj.visible = false
                this.getResourceUploadList()
              })
            })
          }
        })
      }
    },
    /**
     * @method: onOperateInterfaceType
     * @param {String} type delete: 删除
     * @return {Number} index
     */
    onOperateInterfaceType(type, index) {
      console.log(type, index)
      if (type === 'add') {
        this.interfaceTypeManageDialogObj.form.list.push({
          nodeTypeName: '',
          isEdit: true
        })
        this.$nextTick(() => {
          this.$refs['list' + (this.interfaceTypeManageDialogObj.form.list.length - 1)].focus()
        })
      } else if (type === 'delete') {
        this.$confirm('确认删除吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const id = this.interfaceTypeManageDialogObj.form.list[index].id
          if (id) {
            this.interfaceTypeManageDialogObj.deleteList.push(this.interfaceTypeManageDialogObj.form.list[index])
          }
          this.interfaceTypeManageDialogObj.form.list = this.interfaceTypeManageDialogObj.form.list.filter((e, i) => {
            return i !== index
          })
        })
      } else if (type === 'edit') {
        this.interfaceTypeManageDialogObj.form.list = this.interfaceTypeManageDialogObj.form.list.map((e, i) => {
          if (i === index) {
            e.isEdit = true
          }
          return e
        })
        this.$nextTick(() => {
          this.$refs['list' + index].focus()
        })
      } else if (type === 'submit') {
        this.$refs.interfaceTypeManageForm.validate(valid => {
          if (valid) {
            console.log(this.interfaceTypeManageDialogObj.form.list)
            const list = JSON.parse(JSON.stringify(this.interfaceTypeManageDialogObj.form.list))
            const addList = list.filter(e => !e.id).map(e => {
              e.editType = 'A'
              delete e.isEdit
              return e
            })
            const updateList = list.filter(e => e.id).map(e => {
              e.editType = 'U'
              delete e.isEdit
              return e
            })
            // .filter(e => {
            //   return e.nodeTypeName !== this.interfaceTypeManageDialogObj.originList.find(item => item.id === e.id).nodeTypeName
            // })
            const deleteList = JSON.parse(JSON.stringify(this.interfaceTypeManageDialogObj.deleteList)).map(e => {
              e.editType = 'D'
              delete e.isEdit
              return e
            })
            // const params = {
            //   institutionType: this.activeName,
            //   addList,
            //   updateList,
            //   deleteList
            // }
            const changeList = [...updateList, ...addList, ...deleteList].map(e => {
              e.institutionType = this.activeName
              return e
            })
            resourceApi.saveInterfaceType(changeList).then(res => {
              this.$message({
                type: 'success',
                message: res.message
              })
              this.interfaceTypeManageDialogObj.visible = false
              this.getResourceUploadList()
            })
          }
        })
      } else if (type === 'blur') {
        this.$refs.interfaceTypeManageForm.validateField('list.' + index + '.nodeTypeName', error => {
          if (!error) {
            this.interfaceTypeManageDialogObj.form.list = this.interfaceTypeManageDialogObj.form.list.map((e, i) => {
              if (i === index) {
                e.isEdit = false
              }
              return e
            })
          } else {
            return false
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.button-icon {
  width: 24px;
  height: 24px;
  cursor: pointer;
}
.interface-type {
  position: relative;
  &-btn {
    position: absolute;
    right: 20px;
    top: 0;
    display: none;
  }
  &-text {
    width: calc(100% - 80px);
  }
  &.is-edit {
    &:hover {
      .interface-type-btn {
        display: none;
      }
    }
  }
  &:hover {
    .interface-type-btn {
      display: block;
    }
  }
  &-add {
    width: 100%;
    margin-top: 18px;
    color: #B4C1D1;
    font-size: 15px;
  }
}
.resource-upload {
  &-row {
    display: flex;
    &-info {
      margin: 8px 20px 0 10px;
    }
  }
}
.move-dialog {
  &-row {
    &-label {
      border-left: 3px solid #2C76D1;
      font-size: 18px;
      font-weight: bold;
      color: #303030;
      padding-left: 8px;
      margin-bottom: 20px;
    }
  }
}
::v-deep .el-button--text.el-button--medium {
  padding: 5px 0;
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
