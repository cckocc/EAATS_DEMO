<template>
  <div class="isv_detail">
    <div class="item_name">
      <img
        src="~@/assets/style/instiname.svg"
        style="vertical-align: middle"
        alt=""
      >
      {{ msg.cnFullName }}
    </div>

    <div class="form-body-content">
      <div class="support_interface">支持接口</div>

      <el-tabs
        v-model="institutionType"
        :before-leave="handleTabLeave"
        @tab-click="handleTabClick('click')"
      >
        <el-tab-pane label="市场机构" :disabled="tableLoading" name="00" />
        <el-tab-pane label="信息商" :disabled="tableLoading" name="10" />
      </el-tabs>

      <IsvManageSlot
        ref="tableTree"
        v-loading="tableLoading"
        :origin-data="originData"
        :table-columns="tableColumns"
        is-fold
        :userinfo="userinfo"
        :compflag="isvManage"
        :edit-flag-interface="editFlagInterface"
      />

      <div class="btn_bt">
        <el-button
          v-if="!editFlagInterface"
          type="primary"
          @click="editInterface()"
        >
          <span class="text"> 编辑 </span>
        </el-button>
        <el-button v-if="!editFlagInterface" @click="backToLastPage()">
          <span class="text"> 返回 </span>
        </el-button>
        <el-button
          v-if="editFlagInterface"
          type="primary"
          @click="saveInterface()"
        >
          <span class="text"> 保存 </span>
        </el-button>
        <el-button v-if="editFlagInterface" @click="cancelInterface()">
          <span class="text"> 取消 </span>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  reqGetInterList,
  reqEditProductTreeInsti
} from '@/api/isvManagement/isv_manage'
import IsvManageSlot from '../components-slot/isv_manage_slot'

export default {
  name: 'IsvDetail',
  components: {
    IsvManageSlot
  },
  props: {
    msg: {
      type: Object,
      default: Object
    }
  },
  data() {
    return {
      // activeName: 'marketInsti',
      institutionType: '00',
      isvManage: 'isv_manage',
      tableLoading: false,
      originData: [],
      tableColumns: [],
      editFlagInterface: false,

      // 是否支持/审核操作 列表数据
      lastLevelNodeList: [],
      oldData: [],

      userinfo: null
    }
  },
  created() {
    this.getMenu()
    // console.log('msg===>', this.msg)
    this.getUserRoles()
  },

  methods: {
    getUserRoles() {
      this.userinfo = this.$store.getters.userInfo
      // console.log('jigouisv', this.userinfo)
    },
    handleClick() {
      this.getMenu()
    },

    // 获取树节点的方法
    getMenu() {
      this.tableLoading = true
      reqGetInterList({ id: this.msg.id })
        .then((res) => {
          // console.log('打印id===>', this.msg.id)
          if (this.institutionType === '10') {
            this.originData = res.data.xtree.nodeList
            // console.log('22222222', this.originData)
            this.tableColumns = res.data.xtree.headList
            // console.log('信息商表头', this.tableColumns)
          } else {
            this.originData = res.data.stree.nodeList
            // console.log('3333333', this.originData)
            this.tableColumns = res.data.stree.headList
            // console.log('市场机构表头', this.tableColumns)
          }
          this.tableLoading = false
        })
        .catch((err) => {
          console.log(err)
          this.tableLoading = false
        })
    },

    async handleTabLeave(activeName) {
      if (this.editFlagInterface && activeName !== this.institutionType) {
        this.$confirm('数据未保存，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.handleTabClick('leave')
            return true
          })
          .catch(() => {
            this.$nextTick(() => {
              if (activeName === '10') {
                this.institutionType = '00'
              } else {
                this.institutionType = '10'
              }
            })

            // console.log(222, activeName)
            return false
          })
      }
    },

    handleTabClick(tabName) {
      if (
        (tabName === 'click' && !this.editFlagInterface) ||
        tabName === 'leave'
      ) {
        this.getMenu()
      }
    },

    backToLastPage() {
      // console.log('返回上一页22')
      this.$emit('backToLastPage')
    },

    editInterface() {
      this.editFlagInterface = !this.editFlagInterface
      // this.$refs.tableTree.editFlagInterface1 = this.editFlagInterface
      // this.$refs.tableTree.aaa(this.editFlagInterface)
      this.oldData = JSON.parse(JSON.stringify(this.originData))
      this.$forceUpdate()
      // console.log('编辑页', this.editFlagInterface)
    },

    // 递归 -- 拿到产品接口树的最后两列值
    // getLastNodeLevel(tree){
    //   tree.forEach((item)=>{
    //     // 判断是否是最后两列
    //     if(item.nodeType){
    //       // 取最后两列的后端接口需要的三个字段值
    //       var obj = {nodeId:item.finID, status:'', nodeType:item.nodeType}
    //       if(item.nodeType=='0'){
    //         obj.status = item.isSupport
    //       }else if(item.nodeType=='1'){
    //         obj.status=item.cfetsCheckStatus
    //       }
    //       // 把后端需要的三个字段对应的对象放进最后两列的list
    //       this.lastLevelNodeList.push(obj)
    //     }
    //     // 判断是否有下一级数据
    //     if(item.hasChidren.code=='1'){
    //       // 递归到下一级数据
    //       this.getLastNodeLevel(item.childrenList)
    //     }
    //   })
    // },

    async saveInterface() {
      this.editFlagInterface = false
      // this.getLastNodeLevel(this.originData)
      // var list =[]
      // this.originData.forEach((item)=>{
      //   var map ={nodeId:item.finID, status:'', nodeType:item.nodeType}
      //   if(item.nodeType== '0' ){
      //     map.status = item.isSupport
      //   }else if (item.nodeType== '1'){
      //     map.status = item.cfetsCheckStatus
      //   }

      //   list.push(map)
      //   // isSupport:item.isSupport,cfetsCheckStatus:item.cfetsCheckStatus,
      // })
      // console.log('thislist',list);
      // console.log('this.originData',this.originData);
      var tree = this.$refs.tableTree.getTrListCopy()
      // console.log('3334444', tree)
      const res = await reqEditProductTreeInsti({
        saveTree: tree,
        cnFullId: this.msg.cnFullId,
        institutionType: this.institutionType
      })
      if (res.code === 'ACK') {
        this.$message({
          type: 'success',
          message: '保存成功'
        })
      }

      // console.log('保存编辑后的接口产品树', res, this.institutionType)
      // {[ { } ]}
      // finID  isSupport  cfetsCheckStatus  nodeType
    },
    cancelInterface() {
      this.editFlagInterface = false
      this.originData = JSON.parse(JSON.stringify(this.oldData))
    }
  }
}
</script>

<style lang='scss' scoped>
.item_name {
  width: 1218px;
  height: 121px;
  background: url('~@/assets/style/rygpz_user_bg.svg');
  padding-left: 60px;
  line-height: 121px;
  font-size: 24px;
  font-family: Source Han Sans CN;
  font-weight: bold;
  color: #ffffff;
  opacity: 1;
  margin-bottom: 20px;
}

.support_interface {
  height: 30px;
  font-size: 20px;
  font-family: Source Han Sans CN;
  font-weight: bold;
  line-height: 30px;
  color: #333333;
  opacity: 1;
  padding-left: 10px;
  border-left: 4px solid #2494fe;
  margin: 20px 0px;
}

.btn_bt {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
</style>
