<template>
  <!-- class="flow-tree" -->
  <el-drawer
    title="选择部分接口"
    :visible.sync="drawer"
    :show-close="true"
    :direction="'ltr'"
    :with-header="false"
    size="50%"
  >
    <!--  :wrapperClosable="false"-->
    <div class="drawer_height">
      <div class="main_tabs">
        <el-radio-group v-model="menuInstType" style="margin-top: 10px;" @change="getMenu()">
          <el-radio-button label="00">市场机构</el-radio-button>
          <el-radio-button label="10">信息商</el-radio-button>
        </el-radio-group>
        <div style="margin-top: 10px;float:right;margin-right:10px;">
          <el-button type="primary" size="mini" @click="submit()">确认</el-button>
          <el-button size="mini" @click="cancel()">取消</el-button>
        </div>
      </div>
      <div class="drawer_content_height">
        <table-tree
          ref="tableTree"
          :origin-data="originData"
          :table-columns="tableColumns"
          show-checkbox
          is-fold
        />
      </div>
    </div>
    <!-- <span>我来啦!</span> -->
  </el-drawer>
</template>

<script>
import { reqGetProductTree } from '@/api/email/contact'
export default {
  data() {
    return {
      drawer: false,
      originData: [],
      tableColumns: [],
      // 默认选中机构用户
      menuInstType: '00'
    }
  },
  methods: {
    async initPage() {
      await this.getMenu()
      this.drawer = true
    },
    // 获取树节点的方法
    getMenu() {
      var params = {
        menuInstType: this.menuInstType
      }
      reqGetProductTree(params).then(res => {
        this.originData = res.data.nodeList
        this.tableColumns = res.data.headList
      })
    },
    cancel() {
      this.drawer = false
    },
    submit() {
      const checkedList = this.$refs.tableTree.getCheckedNodeList()
      if (checkedList.length === 0) {
        this.$message({
          type: 'info',
          message: `请至少勾选一个接口`
        })
        return
      }
      const checkedLeafList = checkedList.filter(e => e.isLeafFlg.name === 'YES')
      const checkedMenuConfigNodeList = checkedLeafList.map(e => e.id)
      this.$emit('drawerBackTo', checkedMenuConfigNodeList)
      this.drawer = false
    }
  }
}
</script>

<style lang="scss" scoped>

.drawer_height{
  height: 100vh;
  .main_tabs{
    height: 60px;
  }
  .drawer_content_height{
    height: calc(100% - 60px);
    overflow-y: auto;
  }
}

</style>
