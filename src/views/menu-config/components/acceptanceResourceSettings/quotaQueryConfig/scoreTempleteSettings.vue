<template>
  <!-- 评分模板设置 -->
  <div class="score_templete">
    <el-card class="score_issure">
      <div class="clearfix">
        <span>评分问题</span>
      </div>

      <!-- 问题表格 -->
      <el-table
        :data="scoreIssureTable"
        style="width: 100%"
        :header-cell-style="{ background: '#F5F7FA', color: '#000' }"
      >
        <el-table-column prop="content" label="标题" width="400px">
          <template slot-scope="scope">
            <span v-if="!scope.row.editFlag">{{ scope.row.content }}</span>
            <span
              v-else
            ><el-input
              v-model="scope.row.content"
              clearable
              style="width: 100%"
              placeholder="请填写问题内容"
            /></span>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="标题（英文）" width="400">
          <template slot-scope="scope">
            <span v-if="!scope.row.editFlag">{{ scope.row.contentEn }}</span>
            <span
              v-else
            ><el-input
              v-model="scope.row.contentEn"
              clearable
              style="width: 100%"
              placeholder="请填写问题内容(英文)"
            /></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="weight"
          label="权重(总和请等于100)"
          width="175px"
        >
          <template slot-scope="scope">
            <span v-if="!scope.row.editFlag">{{ scope.row.weight }}%</span>
            <span
              v-else
            ><el-input
              v-model.number="scope.row.weight"
              clearable
              style="width: 80%"
              placeholder="请填写权重"
            /> %
            </span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="publishStatus"
          label="状态"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.publishStatus === '20'">已发布</span>
            <span v-if="scope.row.publishStatus === '30'">未发布（已删除）</span>
            <span v-if="scope.row.publishStatus !== '20' && scope.row.publishStatus !== '30'">未发布</span>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="options"
          label="操作"
          fixed="right"
        >
          <template slot-scope="scope">
            <div v-if="!scope.row.editFlag">
              <el-button type="text" @click="jumpToComponent(scope.row)">
                设置选项
              </el-button>
              <el-divider direction="vertical" />
              <el-button
                type="text"
                @click.native.prevent="editScoreRow(scope.row)"
              >
                编辑
              </el-button>
              <el-divider direction="vertical" />
              <el-button type="text" @click="deleteScoreRow(scope.row)">
                删除
              </el-button>
            </div>
            <div v-else>
              <el-button type="text" @click="saveScoreQuestion(scope.row)">
                保存
              </el-button>
              <el-divider direction="vertical" />
              <el-button type="text" @click="cancelScoreQuestion(scope.row)">
                取消
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="addQuestions" @click="addScoreQuestions">
        <img src="~@/assets/style/add_btn.svg" alt="">
        <div class="add">添加问题</div>
      </div>
    </el-card>

    <el-card class="feedback_issure">
      <div class="clearfix">
        <span>反馈问题</span>
      </div>

      <!-- 反馈问题表格 -->
      <el-table
        :data="feedbackIssureTable"
        style="width: 100%"
        :header-cell-style="{ background: '#F5F7FA', color: '#000' }"
      >
        <el-table-column prop="content" label="标题" width="400px">
          <template slot-scope="scope">
            <span v-if="!scope.row.editFlag">{{ scope.row.content }}</span>
            <span
              v-else
            ><el-input
              v-model="scope.row.content"
              style="width: 100%"
              clearable
              placeholder="请填写问题内容"
            /></span>
          </template>
        </el-table-column>
        <el-table-column prop="content" label="标题(英文)" width="400">
          <template slot-scope="scope">
            <span v-if="!scope.row.editFlag">{{ scope.row.contentEn }}</span>
            <span
              v-else
            ><el-input
              v-model="scope.row.contentEn"
              style="width: 100%"
              clearable
              placeholder="请填写问题内容(英文)"
            /></span>
          </template>
        </el-table-column>
        <el-table-column prop="required" label="是否必填" width="175px">
          <template slot-scope="scope">
            <span v-if="!scope.row.editFlag">{{
              scope.row.required === '1' ? '是' : '否'
            }}</span>
            <el-form v-else style="width: 80%">
              <el-form-item style="margin-bottom: 0px">
                <el-select
                  v-model="scope.row.required"
                  clearable
                  placeholder="请选择"
                >
                  <el-option label="是" value="1" />
                  <el-option label="否" value="0" />
                </el-select>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="publishStatus"
          label="状态"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.publishStatus === '20'">已发布</span>
            <span v-if="scope.row.publishStatus === '30'">未发布（已删除）</span>
            <span v-if="scope.row.publishStatus !== '20' && scope.row.publishStatus !== '30'">未发布</span>
          </template>
        </el-table-column> -->
        <el-table-column prop="options" label="操作" width="198px">
          <template slot-scope="scope">
            <div v-if="!scope.row.editFlag">
              <el-button
                type="text"
                @click.native.prevent="editFeedbackRow(scope.row)"
              >
                编辑
              </el-button>
              <el-divider direction="vertical" />
              <el-button
                type="text"
                @click="deleteScoreRow(scope.row)"
              >
                删除
              </el-button>
            </div>
            <div v-else>
              <el-button
                type="text"
                @click="saveScoreQuestion(scope.row)"
              >
                保存
              </el-button>
              <el-divider direction="vertical" />
              <el-button
                type="text"
                @click="cancelScoreQuestion(scope.row)"
              >
                取消
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="addQuestions" @click="addFeedbackQuestions">
        <img src="~@/assets/style/add_btn.svg" alt="">
        <div class="add">添加问题</div>
      </div>
    </el-card>

    <div class="bottom_btns">
      <div class="btns">
        <el-button
          type="primary"
          @click="openSatisfiedDialog('online')"
        >在线版本预览</el-button>
        <el-button
          type="primary"
          @click="openSatisfiedDialog()"
        >预览</el-button>
        <el-button type="primary" @click="publishModel()">发布</el-button>
      </div>
    </div>

    <!-- 选项设置的对话框 -->
    <el-dialog
      :modal-append-to-body="false"
      title="选项设置"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="1100px"
    >
      <el-table
        :data="configTableList"
        :header-cell-style="{ background: '#F5F7FA', color: '#000' }"
      >
        <el-table-column prop="optionsConfig" label="选项设置" width="270px">
          <template slot-scope="scope">
            <span v-if="!scope.row.editConfigFlag">{{
              scope.row.optionsConfig
            }}</span>
            <span
              v-else
            ><el-input
              v-model="scope.row.optionsConfig"
              style="width: 180px"
              clearable
              placeholder="请填写选项内容"
            /></span>
          </template>
        </el-table-column>
        <el-table-column prop="optionsConfig" label="选项设置(英文)" width="270px">
          <template slot-scope="scope">
            <span v-if="!scope.row.editConfigFlag">{{
              scope.row.optionsConfigEn
            }}</span>
            <span
              v-else
            ><el-input
              v-model="scope.row.optionsConfigEn"
              style="width: 100%"
              clearable
              placeholder="请填写选项内容(英文)"
            /></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="scoreConfig"
          label="分值设置(百分制)"
          width="200px"
        >
          <template slot-scope="scope">
            <span v-if="!scope.row.editConfigFlag">{{
              scope.row.scoreConfig
            }}</span>
            <span
              v-else
            ><el-input
              v-model.number="scope.row.scoreConfig"
              style="width: 100%"
              clearable
              placeholder="请填写分值"
            /></span>
          </template>
        </el-table-column>
        <el-table-column prop="remark" label="是否填写备注" width="150px">
          <template slot-scope="scope">
            <span v-if="!scope.row.editConfigFlag">{{
              scope.row.remark === '1' ? '是' : '否'
            }}</span>
            <el-form v-else style="width: 64px">
              <el-form-item
                style="margin-bottom: 0px; width: 64px; height: 30px"
              >
                <el-select
                  v-model="scope.row.remark"
                  style="width: 100%"
                  clearable
                  placeholder="请选择"
                >
                  <el-option label="是" value="1" />
                  <el-option label="否" value="0" />
                </el-select>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="options" label="操作">
          <template slot-scope="scope">
            <div v-if="!scope.row.editConfigFlag">
              <el-button
                type="text"
                @click.native.prevent="editConfigRow(scope.row)"
              >
                编辑
              </el-button>
              <el-divider direction="vertical" />
              <el-button
                slot="reference"
                type="text"
                @click="deleteConfigRow(scope.row)"
              >
                删除
              </el-button>
            </div>
            <div v-else>
              <el-button
                type="text"
                @click="saveConfig(scope.row)"
              >
                保存
              </el-button>
              <el-divider direction="vertical" />
              <el-button
                type="text"
                @click="cancelConfig(scope.row)"
              >
                取消
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="addQuestions" @click="addConfig">
        <div class="add">添加</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelConfigConfirm">取消</el-button>
        <el-button type="primary" @click="submitConfig">提交</el-button>
      </span>
    </el-dialog>

    <!-- 满意度调查对话框 -->
    <el-dialog
      center
      :modal="false"
      title="满意度调查"
      :visible.sync="dialogVisibleSatisfied"
      width="766px"
      class="satisfiedDialog"
    >
      <el-tabs v-model="tabActiveName" class="custom-minor-tabs">
        <el-tab-pane
          v-for="item in tabList"
          :key="item.name"
          :label="item.label"
          :name="item.name"
        />
      </el-tabs>
      <div v-for="item in viewList" :key="item.id">
        <!-- 评分问题div -->
        <div
          v-if="item.configType === '10' && item.publishStatus !== '30'"
          class="ViewQuestions"
        >
          <el-row>
            <div class="issureContent">
              <div>
                <el-divider direction="vertical" />
              </div>
              <div style="height: auto">
                {{ tabActiveName === 'ch' ? item.content : item.contentEn }}
              </div>
            </div>
          </el-row>
          <el-row>
            <el-card
              v-for="(card, index) in item.options"
              :key="index"
              class="issureOptions"
            >
              <el-radio
                v-model="card.optionsConfig"
                :disabled="true"
                label="1"
              >{{ tabActiveName === 'ch' ? card.optionsConfig : card.optionsConfigEn }}</el-radio>
            </el-card>
          </el-row>
        </div>
        <!-- 反馈问题div -->
        <div
          v-if="item.configType === '20' && item.publishStatus !== '30'"
          class="ViewQuestions"
        >
          <div class="issureContent">
            <div>
              <el-divider direction="vertical" />
            </div>
            <div style="height: auto">
              {{ tabActiveName === 'ch' ? item.content : item.contentEn }}
            </div>
          </div>
          <el-input
            v-model="item.feedBackInput"
            type="textarea"
            resize="none"
            :disabled="true"
            :autosize="{ minRows: 2, maxRows: 6 }"
            style="margin-top: 10px; width: 100%"
            placeholder="请输入内容"
          />
        </div>
      </div>

      <!-- 对话框底部按钮 -->
      <span slot="footer" class="dialog-footer-satisfied">
        <el-button
          type="primary"
          @click="dialogVisibleSatisfied = false"
        >关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getQuestonist,
  saveQuestion,
  delQuestion,
  editQuestion,
  getConfigList,
  editConfig,
  saveConfigFunction,
  getViewList,
  getOnlineViewList,
  publishModelFunction,
  delConfigRowFunction
} from '@/api/acceptance/scope'
// import tableTreeTdVue from '@/views/menu-config-interface/components/tableTreeTd.vue'
export default {
  name: 'ScoreTempleteSettings',
  data() {
    return {
      tabActiveName: 'ch',
      tabList: [
        {
          label: '中文',
          name: 'ch'
        },
        {
          label: '英文',
          name: 'en'
        }
      ],
      scoreIssureTable: [],
      feedbackIssureTable: [],
      dialogVisibleSettings: false,
      isComponent: 'OptionSetting',
      dialogVisible: false,
      configTableList: [],
      // 预览问题的列表
      viewList: [],
      // scoreSatisfied:[],
      defaultList: [],
      questionId: '',

      // 满意度调查是否显示
      dialogVisibleSatisfied: false
    }
  },
  created() {
    this.GetQuestonist()
  },
  methods: {
    // 跳转页面调用方法
    routerLinkCreated() {
      this.GetQuestonist()
    },
    // 打开选项配置弹窗
    jumpToComponent(row) {
      this.configTableList = []
      if (row.publishStatus === '30') {
        this.$message({
          message: '该问题已被删除,无法编辑选项',
          type: 'warning'
        })
        return false
      }
      // 根据rowid获取现有选项
      this.questionId = row.id
      this.GetConfigList(row.id)
    },
    // 获取选项列表
    async GetConfigList(id) {
      getConfigList({ id: id }).then((res) => {
        console.log('问题选项列表', res)
        if (res.data.length > 0) {
          var list = res.data
          list.forEach((item) => {
            item.editConfigFlag = false
          })
          this.configTableList = list.concat([])
        } else {
          // 若无查询结果则默认为该选项
          this.configTableList = this.defaultList.concat([])
        }
        this.dialogVisible = true
      })
    },
    // 添加选项配置
    addConfig() {
      var num = 0
      this.configTableList.forEach((item) => {
        num = Number(item.configNumber)
      })
      var map = {
        configNumber: num + 1,
        id: '',
        optionsConfig: '',
        remark: '',
        scoreConfig: '',
        editConfigFlag: true
      }
      this.configTableList.push(map)
    },
    // 编辑选项配置
    editConfigRow(row) {
      console.log('编辑', row)
      row.oldOptionsConfig = row.optionsConfig
      row.oldScoreConfig = row.scoreConfig
      row.oldRemark = row.remark
      row.editConfigFlag = true
      this.$forceUpdate()
    },
    // 提交选项配置
    submitConfig() {
      var saveFlag = true
      var newList = []
      this.configTableList.forEach((item) => {
        if (item.editConfigFlag) {
          saveFlag = false
        }
        if (item.id === '' || item.id === null || item.id === undefined) {
          item.templateId = this.questionId
          newList.push(item)
        }
      })
      if (saveFlag) {
        if (newList.length > 0) {
          saveConfigFunction(newList).then((res) => {
            this.$message({
              message: '提交成功',
              type: 'success'
            })
            this.dialogVisible = false
          })
        } else {
          this.$message({
            message: '提交成功',
            type: 'success'
          })
          this.dialogVisible = false
        }
      } else {
        this.$message({
          message: '请保存所有选项后再提交',
          type: 'warning'
        })
      }
    },
    cancelConfigConfirm() {
      this.$confirm('取消配置将失去当前所有编辑，是否确认取消?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.dialogVisible = false
      })
    },
    // 删除选项配置
    deleteConfigRow(row) {
      this.$confirm('确定删除该选项吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var map = {
          id: row.id
        }
        delConfigRowFunction(map).then((res) => {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.GetConfigList(row.templateId)
        })
      })
    },
    // 保存选项配置
    saveConfig(row) {
      // 验证
      var againFlag = false
      console.log(row.configNumber, this.configTableList)
      this.configTableList.forEach((item) => {
        if (
          item.optionsConfig === row.optionsConfig &&
          item.configNumber !== row.configNumber
        ) {
          againFlag = true
        }
      })
      if (againFlag) {
        this.$message({
          message: '选项内容重复',
          type: 'warning'
        })
        return false
      }
      if (row.scoreConfig > 100) {
        this.$message({
          message: '选项分数不能大于100',
          type: 'warning'
        })
        return false
      }
      if (row.scoreConfig < 0) {
        this.$message({
          message: '选项分数不能小于0',
          type: 'warning'
        })
        return false
      }
      if (row.optionsConfig === null || row.optionsConfig === '') {
        this.$message({
          message: '选项内容不能为空',
          type: 'warning'
        })
        return false
      }
      if (row.optionsConfig.length > 50) {
        this.$message({
          message: '选项内容长度不能过长',
          type: 'warning'
        })
        return false
      }
      if (row.optionsConfigEn === null || row.optionsConfigEn === '' || row.optionsConfigEn === undefined) {
        this.$message({
          message: '(英文)选项内容不能为空',
          type: 'warning'
        })
        return false
      }
      if (row.optionsConfigEn.length > 50) {
        this.$message({
          message: '(英文)选项内容长度不能过长',
          type: 'warning'
        })
        return false
      }
      if (row.scoreConfig === null || row.scoreConfig === '') {
        this.$message({
          message: '选项分值不能为空',
          type: 'warning'
        })
        return false
      }
      if (row.remark === null || row.remark === '') {
        this.$message({
          message: '选项备注不能为空',
          type: 'warning'
        })
        return false
      }
      var addConfigList = []
      row.templateId = this.questionId
      addConfigList.push(row)
      if (row.id) {
        editConfig(row).then((res) => {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          row.editConfigFlag = false
        })
      } else {
        saveConfigFunction(addConfigList).then((res) => {
          row.id = res.data[0].id
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          row.editConfigFlag = false
        })
      }
    },
    // 取消配置
    cancelConfig(row) {
      if (row.id) {
        row.remark = row.oldRemark
        row.scoreConfig = row.oldScoreConfig
        row.optionsConfig = row.oldOptionsConfig
        row.editConfigFlag = false
      } else {
        var configIndex = 0
        this.configTableList.forEach((item, index) => {
          if (item.configNumber === row.configNumber) {
            configIndex = index
          }
        })
        this.configTableList.splice(configIndex, 1)
      }
    },
    // 保存评分问题接口
    saveScoreQuestion(row) {
      // 验证
      var againFlag = false
      console.log(row)
      if (row.configType === '10') {
        var weightNum = 0
        if (row.weight < 0) {
          this.$message({
            message: '单个问题权重不能小于0',
            type: 'warning'
          })
          return false
        } else if (row.weight > 100) {
          this.$message({
            message: '单个问题权重不能大于100',
            type: 'warning'
          })
          return false
        }
        this.scoreIssureTable.forEach((item) => {
          if (item.editFlag !== true) {
            weightNum += Number(item.weight)
          }
          if (
            item.serialNumber !== row.serialNumber &&
            item.content === row.content
          ) {
            againFlag = true
          }
        })
        if (againFlag) {
          this.$message({
            message: '问题内容不能重复',
            type: 'warning'
          })
          return false
        }
        weightNum += Number(row.weight)
        if (weightNum > 100) {
          this.$message({
            message: '问题总权重不能大于100',
            type: 'warning'
          })
          return false
        }
        // if (row.weight === null || row.weight === 0) {
        //   this.$message({
        //     message: '问题权重不能为空',
        //     type: 'warning'
        //   })
        //   return false
        // }
      } else {
        this.feedbackIssureTable.forEach((item) => {
          if (
            item.serialNumber !== row.serialNumber &&
            item.content === row.content
          ) {
            againFlag = true
          }
        })
        if (againFlag) {
          this.$message({
            message: '问题内容不能重复',
            type: 'warning'
          })
          return false
        }
        if (row.required === null || row.required === '') {
          this.$message({
            message: '问题是否必填不能为空',
            type: 'warning'
          })
          return false
        }
      }

      if (row.content === null || row.content === '') {
        this.$message({
          message: '问题内容不能为空',
          type: 'warning'
        })
        return false
      }
      if (row.content.length > 100) {
        this.$message({
          message: '问题长度不能过长',
          type: 'warning'
        })
        return false
      }
      if (row.contentEn === null || row.contentEn === '' || row.contentEn === undefined) {
        this.$message({
          message: '(英文)问题内容不能为空',
          type: 'warning'
        })
        return false
      }
      if (row.contentEn !== null && row.contentEn.length > 100) {
        this.$message({
          message: '(英文)问题长度不能过长',
          type: 'warning'
        })
        return false
      }
      // 转换数据格式
      row.weight = row.weight + ''
      row.serialNumber = row.serialNumber + ''
      var saveList = []
      saveList.push(row)
      if (row.id) {
        // 若row.id存在表示为编辑信息
        editQuestion(row).then((res) => {
          this.$message({
            message: '编辑成功',
            type: 'success'
          })
          // if (row.configType === '10') {
          //   this.getScoreList()
          // } else {
          //   this.getFeedList()
          // }
          row.editFlag = false
        })
      } else {
        saveQuestion(saveList).then((res) => {
          var info = res.data[0]
          row.id = info.id
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          // if (row.configType === '10') {
          //   this.getScoreList()
          // } else {
          //   this.getFeedList()
          // }
          // row.id = res.id
          row.editFlag = false
        })
      }
    },
    // 取消新增评分问题接口
    cancelScoreQuestion(row) {
      if (row.id) {
        row.content = row.oldContent
        if (row.configType === '10') {
          row.weight = row.oldWeight
        } else {
          row.required = row.oldRequired
        }
        row.editFlag = false
      } else {
        if (row.configType === '10') {
          var scoreIndex = 0
          this.scoreIssureTable.forEach((item, index) => {
            if (item.serialNumber === row.serialNumber) {
              scoreIndex = index
            }
          })
          this.scoreIssureTable.splice(scoreIndex, 1)
        } else {
          var feedIndex = 0
          this.feedbackIssureTable.forEach((item, index) => {
            if (item.serialNumber === row.serialNumber) {
              feedIndex = index
            }
          })
          this.feedbackIssureTable.splice(feedIndex, 1)
        }
      }
    },
    // 获取问题列表
    GetQuestonist() {
      getQuestonist().then((res) => {
        console.log('获取问题列表', res)
        var list = res.data
        var initQuestionList = []
        var initFeedbackList = []
        if (list.length > 0) {
          // 遍历内容区分评分问题和反馈问题
          list.forEach((item) => {
            item.editFlag = false
            if (item.configType === '10') {
              item.weight = Number(item.weight)
              initQuestionList.push(item)
            } else {
              initFeedbackList.push(item)
            }
          })
          this.scoreIssureTable = initQuestionList
          this.feedbackIssureTable = initFeedbackList
        } else {
          this.scoreIssureTable = []
          this.feedbackIssureTable = []
        }
      })
    },
    // 单独获取反馈问题列表
    getFeedList() {
      getQuestonist().then((res) => {
        var list = res.data
        var initFeedbackList = []
        if (list.length > 0) {
          list.forEach((item) => {
            item.editFlag = false
            if (item.configType === '20') {
              initFeedbackList.push(item)
            }
          })
          this.feedbackIssureTable = initFeedbackList
        }
      })
    },
    // 单独获取评分问题列表
    getScoreList() {
      getQuestonist().then((res) => {
        var list = res.data
        var initQuestionList = []
        if (list.length > 0) {
          list.forEach((item) => {
            item.editFlag = false
            if (item.configType === '10') {
              item.weight = Number(item.weight)
              initQuestionList.push(item)
            }
          })
          this.scoreIssureTable = initQuestionList
        }
      })
    },
    editScoreRow(row) {
      row.oldContent = row.content
      row.oldWeight = row.weight
      row.editFlag = true
    },
    deleteScoreRow(row) {
      this.$confirm('确定删除该问题吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var map = {
          id: row.id
        }
        delQuestion(map).then((res) => {
          if (row.configType === '10') {
            this.getScoreList()
          } else {
            this.getFeedList()
          }
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
      })
    },
    editFeedbackRow(row) {
      row.oldContent = row.content
      row.oldRequired = row.required
      row.editFlag = true
    },
    addScoreQuestions() {
      var num = 0
      this.scoreIssureTable.forEach((item) => {
        num = Number(item.serialNumber)
      })
      var map = {
        configType: '10',
        content: '',
        editFlag: true,
        id: '',
        required: '',
        serialNumber: num + 1,
        weight: 0
      }
      this.scoreIssureTable.push(map)
    },
    addFeedbackQuestions() {
      var num = 0
      this.feedbackIssureTable.forEach((item) => {
        num = Number(item.serialNumber)
      })
      var map = {
        configType: '20',
        content: '',
        editFlag: true,
        id: '',
        required: '',
        serialNumber: num + 1,
        weight: 0
      }
      this.feedbackIssureTable.push(map)
      console.log('添加反馈问题')
    },
    // 发布模板
    publishModel() {
      var publishFlag = true
      var checkList = this.scoreIssureTable.concat(this.feedbackIssureTable)
      var count = 0
      if (checkList.length === 0) {
        this.$message({
          message: '评分模板不能为空',
          type: 'warning'
        })
        return false
      }
      checkList.forEach((item) => {
        if (item.editFlag) {
          publishFlag = false
        }
        count += Number(item.weight)
      })

      if (count !== 100) {
        this.$message({
          message: '评分问题总权重不足100%，请确认后再试',
          type: 'warning'
        })
        return false
      }
      if (!publishFlag) {
        this.$message({
          message: '页面存在未保存问题，请确认后再试',
          type: 'warning'
        })
        return false
      }
      this.$confirm('发布后机构端评分将转为新模板，是否确认发布?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 调发布接口即可
        publishModelFunction().then((res) => {
          if (res.code === 'ACK') {
            this.$message({
              message: '发布成功',
              type: 'success'
            })
          }
          this.GetQuestonist()
        })
      })
    },
    // 满意度调查弹框
    openSatisfiedDialog(type) {
      // 后台接口返回预览需要数据
      if (type === 'online') {
        getOnlineViewList().then((res) => {
          console.log('online后台接口返回预览需要数据', res)
          this.viewList = res.data
          var openFlag = true
          var checkList = this.scoreIssureTable.concat(this.feedbackIssureTable)
          if (this.viewList.length > 0) {
            checkList.forEach((item) => {
              if (item.editFlag) {
                openFlag = false
              }
            })
            if (openFlag) {
              this.tabActiveName = 'ch'
              this.dialogVisibleSatisfied = true
            } else {
              this.$message({
                message: '页面存在未保存问题，请确认后再试',
                type: 'warning'
              })
            }
          } else {
            this.$message({
              message: '暂无问题可预览',
              type: 'warning'
            })
          }
        })
      } else {
        getViewList().then((res) => {
          console.log('后台接口返回预览需要数据', res)
          this.viewList = res.data
          var openFlag = true
          var checkList = this.scoreIssureTable.concat(this.feedbackIssureTable)
          if (this.viewList.length > 0) {
            checkList.forEach((item) => {
              if (item.editFlag) {
                openFlag = false
              }
            })
            if (openFlag) {
              this.tabActiveName = 'ch'
              this.dialogVisibleSatisfied = true
            } else {
              this.$message({
                message: '页面存在未保存问题，请确认后再试',
                type: 'warning'
              })
            }
          } else {
            this.$message({
              message: '暂无问题可预览',
              type: 'warning'
            })
          }
        })
      }
    },
    // 预览页面使用获取选项
    async viewConfigList(id) {
      getConfigList(id).then((res) => {
        console.log('预览页面使用获取选项', res)
        if (res.data.length > 0) {
          return res.data
        } else {
          return null
        }
      })
    }
  }
}
</script>

<style lang='scss' >
.score_templete {
  .clearfix {
    height: 42px;
    width: 100%;

    span {
      display: inline-block;
      width: 64px;
      height: 28px;
      line-height: 42px;
      font-size: 16px;
      font-weight: bold;
    }
  }

  .el-table--border th {
    background: #f6f7fb;
    opacity: 1;
  }

  .feedback_issure {
    margin-top: 20px;
    margin-bottom: 50px;
  }

  .el-table th > .cell {
    color: #000;
  }

  .addQuestions {
    margin-top: 16px;
    opacity: 1;
    width: 100%;
    height: 30px;
    border: 1px dotted #b4c1d1;
    // margin-top: 20px;
    // margin: 10 auto;
    display: flex;
    justify-content: center;
    align-content: center;

    img {
      width: 16px;
      height: 16px;
      margin: 7px 5px;
    }

    .add {
      text-align: center;
      border: none;
      background-color: #fff;

      width: 60px;
      height: 15px;
      font-size: 15px;
      font-family: Source Han Sans CN;
      font-weight: 400;
      line-height: 26px;
      color: #b4c1d1;
      opacity: 1;
    }
  }

  .bottom_btns {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 50px;

    // .btns {
    // .el-button {
    //   width: 128px;
    //   height: 38px;
    // }
    // }
  }

  // 满意度调查对话框
  .satisfiedDialog {
    .el-dialog {
      margin: 63px 577px;
      width: 766px;
      height: 1152px;
      background: #f2f7ff;
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      opacity: 1;
      border-radius: 2px;

      .el-dialog__header .el-dialog__title {
        width: 140px;
        height: 28px;
        font-size: 28px;
        font-family: Source Han Sans CN;
        font-weight: bold;
        line-height: 48px;
        color: #303030;
        opacity: 1;
      }
    }

    // 去掉满意度调查对话框标题下边框
    .el-dialog__header {
      border: none;
      background: #f2f7ff;
      margin-top: 20px;
    }
    .el-dialog .el-dialog__body {
      padding: 0px 100px;
    }

    // .ViewQuestions{
    //   margin: 0 100px;
    // }

    .issureContent {
      display: flex;
      flex: 1;
      flex-direction: row;
      // width: 292px;
      font-size: 16px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      line-height: 21px;
      color: #303030;
      opacity: 1;
      margin-top: 16px;

      .el-divider {
        margin-left: 0;
        width: 3px;
        // height: auto;
        background: #2c76d1;
        opacity: 1;
      }
    }

    .issureOptions {
      margin: 10px 0;

      .el-card__body {
        position: relative;
        width: 566px;
        height: 36px;
        background: #ffffff;
        opacity: 1;
        border-radius: 4px;

        .el-radio__inner {
          position: absolute;
          top: -16px;
          left: -5px;
          width: 17px;
          height: 17px;
          background: #ffffff;
          border: 1px solid #d1d5de;
          opacity: 1;
          border-radius: 9px;
        }

        .el-radio__label {
          position: absolute;
          top: -19px;
          left: 12px;
          height: 36px;
          line-height: 36px;
          font-size: 14px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          color: #333333;
          opacity: 1;
        }
      }
    }

    .el-dialog .el-dialog__footer {
      background-color: #f2f7ff;
    }
  }
  .el-input--medium {
    width: 110px;
  }
}
</style>

<style lang="scss">
.el-dialog--center .el-dialog__body {
  text-align: left;
}
</style>
