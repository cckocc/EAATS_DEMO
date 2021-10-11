<template>
  <!-- 验收人员管理 -->
  <div class="personnel-management">
    <div v-loading="loading" class="content">
      <el-row :gutter="24" class="textCenter">
        <el-col
          v-for="person in personList"
          :key="person.id"
          :span="6"
        >
          <el-card class="box-card personCard" shadow="hover">
            <div slot="header" class="clearfix">
              <span class="personName">{{ person.name }}</span>
            </div>
            <div class="text item cardBottom">
              <el-row>
                <el-col :span="11">
                  <el-link type="primary" style="position:relative" @click="LinkToPersonConfig(person)"> <img src="~@/assets/style/edit_icon.svg" style="margin-right:5px;position: absolute;left: -20px;" alt=""> 配置</el-link>
                </el-col>
                <el-col :span="2">
                  <el-divider direction="vertical" />
                </el-col>
                <el-col :span="11">
                  <el-link type="primary" style="position:relative" @click="delPerson(person)"> <img src="~@/assets/style/del_icon.svg" style="margin-right:5px;position:absolute;left: -20px;" alt=""> 删除</el-link>
                </el-col>
              </el-row>
            </div>
          </el-card>
        </el-col>
        <!-- 添加人员 -->
        <el-col
          :span="6"
        >
          <el-card class="box-card personCard addPerson" shadow="hover">
            <el-link class="el-icon-circle-plus" :underline="false" style="color:#B4C1D1; " @click="addAccepter()">添加人员</el-link>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-dialog
      title="添加验收人员"
      :modal="false"
      :visible.sync="dialogVisible"
      width="30%"
    >
      <el-form ref="form" :model="autographForm">
        <el-form-item label="验收人员">
          <el-select v-model="autographForm.userId" filterable clearable placeholder="请选择验收人员" style="width:240px;">
            <el-option v-for="item in acceptanceAutographList" :key="item.userId" :label="item.name" :value="item.userId" />
          </el-select>
        </el-form-item>
        <el-button size="mini" type="primary" style="margin-left:10px;" @click="enterAdd()">确认</el-button>
        <el-button size="mini" @click="dialogVisible = false">取消</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getPersonList, delAccepter, getAuthPerson, addAccepterFun } from '@/api/acceptance/personConfig'
export default {
  name: 'PersonnelManagement',
  data() {
    return {
      acceptanceAutographList: [],
      autographForm: {
        userId: '',
        name: ''
      },
      dialogVisible: false,
      isActive: false,
      personListQuery: {
        page: 0,
        pagesize: 9999
      },
      personList: [],
      loading: false
    }
  },
  created() {
    this.GetPersonList()
  },
  methods: {
    routerLinkBack() {
      this.GetPersonList()
    },
    // 打开添加验收人员弹出层
    addAccepter() {
      this.autographForm.userId = ''
      getAuthPerson().then(res => {
        console.log('添加可验收人员列表', res)
        this.acceptanceAutographList = res.data
        this.dialogVisible = true
      })
    },
    // 添加验收人员
    async enterAdd() {
      // 查询name
      this.acceptanceAutographList.forEach(item => {
        if (item.userId === this.autographForm.userId) {
          this.autographForm.name = item.name
        }
      })
      if(this.autographForm.name === '' || this.autographForm.userId === '' || this.autographForm.name === null || this.autographForm.userId === null || this.autographForm.name === undefined || this.autographForm.userId === undefined) {
        this.$message({
          type: 'warning',
          message: '请选择联系人'
        })
        return false
      }
      const res = await addAccepterFun(this.autographForm)
      if (res.code === 'ACK') {
        this.$message({
          type: 'success',
          message: '添加成功'
        })
        this.dialogVisible = false
        this.GetPersonList()
      } else {
        this.$message({
          type: 'error',
          message: res.msg || '添加失败'
        })
      }
    },
    // 获取验收人员管理列表
    GetPersonList() {
      this.loading = true
      getPersonList(this.personListQuery).then(res => {
        // console.log('获取验收人员管理列表', res)
        if (res.data.length > 0) {
          this.personList = res.data
        } else {
          // this.$message({
          //   type: 'error',
          //   message: res.msg
          // })
        }
        this.loading = false
      })
    },
    // 跳转到人员配置页面
    LinkToPersonConfig(personInfo) {
      console.log('跳转人员配置页面参数', personInfo)
      console.log(this.$route)
      // 未决定具体跳转方式
      this.$emit('linkSitting', personInfo)
    },
    // 删除验收人
    delPerson(personInfo) {
      console.log('删除验收人id', personInfo)
      this.$confirm('确认删除验收人？', '').then(() => {
        delAccepter(personInfo.userId).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.GetPersonList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    mouseMove() {
      console.log('------')
      this.isActive = true
    },
    mouseLeave() {
      this.isActive = false
    },
    activeClass() {
      return 'selected_show'
    }
  }
}
</script>

<style lang='scss'>
.personnel-management {
  .textCenter {
    text-align: center;
    vertical-align: middle;
  }
  .personCard {
    margin-top: 15px;
    border-radius: 20px;
    // padding: 20px;
    // width: 300px;
    // height: 144px;
    .el-card__header {
      background:url('~@/assets/style/ysrygl_bg.svg')
    }
    .clearfix {
      line-height: 104px;
    }
    .cardBottom {
      height: 16px;
    }
    .personName{
      width: 72px;
      height: 24px;
      font-size: 20px;
      font-family: Source Han Sans CN;
      font-weight: bold;
      line-height: 22px;
      color: #FFFFFF;
      opacity: 1;
    }
  }
  .addPerson {
    line-height: 160px;
    border: 1px dashed #B4C1D1;
  }
}
</style>
