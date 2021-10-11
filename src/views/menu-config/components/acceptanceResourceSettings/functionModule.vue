<template>
  <!-- 验收单功能模块配置 —— 导航3 -->
  <div class="functionModule">
    <div class="content">
      <el-card style="margin-bottom:20px">
        <el-row>
          <el-button v-if="!editFlag" size="mini" type="primary" style="height:32px" @click="editSetting">
            <img src="~@/assets/style/edit_func.svg" style="vertical-align: middle;" alt="">
            编辑</el-button>
          <el-button v-if="editFlag" size="mini" @click="cancelSetting">取消</el-button>
          <el-button v-if="editFlag" size="mini" type="primary" style="height:30px" @click="saveSettings">
            <img src="~@/assets/style/save_icon.svg" style="vertical-align: middle;" alt="">
            保存
          </el-button>
        </el-row>
        <el-row>
          <el-table
            :data="list"
            style="width: 100%;margin-top:20px"
            :header-cell-style="{background:'#F5F7FA',color:'#000'}"
          >
            <el-table-column
              show-overflow-tooltip
              prop="formName"
              label="验收单名称"
              width="573px"
            />
            <el-table-column
              show-overflow-tooltip
              prop="formAbbr"
              label="接口简称"
              width="320px"
            >
              <template slot-scope="scope">
                <div v-if="!editFlag && scope.row.formAbbr">{{ scope.row.formAbbr }}</div>
                <div v-else-if="!editFlag">暂无</div>
                <div v-else>
                  <el-input v-model="scope.row.formAbbr" placeholder="请输入简称" />
                </div>
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="occupyQuantity"
              label="占用名额"
              align="center"
              width="112px"
            >
              <template slot-scope="scope">
                <div v-if="!editFlag && scope.row.occupyQuantity === 1">Y</div>
                <div v-else-if="!editFlag && scope.row.occupyQuantity === 0">N</div>
                <div v-else-if="!editFlag">-</div>
                <div v-else>
                  <el-select v-model="scope.row.occupyQuantity" placeholder="请选择占用名额">
                    <el-option label="Y" :value="1" />
                    <el-option label="N" :value="0" />
                  </el-select>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="level"
              label="验收等级"
              align="center"
              width="171px"
            >
              <template slot-scope="scope">
                <div v-if="!editFlag">{{ scope.row.level }}</div>
                <div v-else>
                  <el-select v-model="scope.row.level" placeholder="请选择验收等级">
                    <el-option label="低" value="低" />
                    <el-option label="中" value="中" />
                    <el-option label="高" value="高" />
                  </el-select>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
        <!-- <el-pagination
          style="display:flex;justify-content:flex-end;margin-top:17px"
          :current-page="page.page"
          :page-sizes="[ 10,20,30,40]"
          :page-size="page.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        /> -->
      </el-card>

    </div>
  </div>
</template>

<script>
import { queryAcceptanceList, modifyLevel, saveFunction } from '@/api/acceptance/functionModel'

export default {
  name: 'FunctionModule',
  data() {
    return {

      level: '',
      list: [],
      // selectList: [],
      total: 0,
      page: {
        page: 1,
        pageSize: 10
      },
      jumper: '',
      editFlag: false
    }
  },
  created() {
    this.getAcceptanceList()
  },
  methods: {
    routerCreated() {
      this.editFlag = false
      this.getAcceptanceList()
    },
    editSetting() {
      this.editFlag = true
    },
    saveSettings() {
      console.log('当前页面全部数据', this.list)
      var againName = ''
      var flag = false
      var emptyFlag = false
      this.list.forEach(item => {
        var count = 0
        var name = item.formAbbr
        if (name === '' || name === null || name === undefined) {
          emptyFlag = true
        }
        this.list.forEach(ele => {
          if (name === ele.formAbbr) {
            count += 1
          }
        })
        if (count > 1) {
          againName = name
          flag = true
        }
      })
      if (emptyFlag) {
        this.$message({
          message: '接口简称不能为空',
          type: 'warning'
        })
        return false
      }
      if (flag) {
        this.$message({
          message: '接口简称:' + againName + '重复,请编辑后再试',
          type: 'warning'
        })
        return false
      }

      saveFunction(this.list).then(async res => {
        this.page.page = 1
        await this.getAcceptanceList()
      })
      this.editFlag = false
    },
    cancelSetting() {
      this.$confirm('取消将使得当前编辑无效，是否确认取消?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.getAcceptanceList()
        this.$message({
          message: '取消成功',
          type: 'success'
        })
        this.editFlag = false
      })
      this.editFlag = true
    },
    async getAcceptanceList() {
      const { data } = await queryAcceptanceList({ ...this.page })
      // console.log(data)
      this.list = data
      console.log(this.list)
      // this.total = data.totalRecord
      // this.page.currentPage = data.page
      // this.editFlag = false
      // if (Array.isArray(data.list) && data.list.length > 0) {
      //   const newArr = []; let newObj = {}
      //   data.list.forEach(item => {
      //     newObj = {}
      //     newObj.selectValue = ''
      //     newArr.push(newObj)
      //   })
      //   this.selectList = newArr
      // }
    },

    // 修改验收单占用名额情况
    async changeOccupyQuantity(args, param) {
      // console.log('args=======>', args, param)
      const res = await modifyLevel([{ formId: param.formId, occupyQuantity: args }])
      console.log(res)
      if (res.code === 'ACK') {
        this.getAcceptanceList()
      }
    },

    async updateModifyLevel() {
      // const res = await modifyLevel({ formId: this.formId, level: this.level })
      // console.log(res)
    },

    handleSizeChange(val) {
      if (this.editFlag) {
        this.$message({
          message: '请先保存当前页面数据后调整展示',
          type: 'warning'
        })
        // this.jumper = this.page.currentPage
        // this.page.page = this.page.currentPage
      } else {
        this.page.pageSize = val
        this.getAcceptanceList()
      }
    },
    // 获取当前页面值
    handleCurrentChange(val) {
      if (this.editFlag) {
        this.$message({
          message: '请先保存当前页面数据后换页',
          type: 'warning'
        })
        // this.jumper = this.page.currentPage
        // this.page.page = this.page.currentPage
      } else {
        this.page.page = val
        this.getAcceptanceList()
      }
    }
  }
}
</script>

<style lang='scss' scoped>

</style>
