<template>
  <el-dialog
    title="添加发送目标"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    append-to-body
    class="page_all"
    width="538px"
    :before-close="handleClose"
    @close="closeDialog"
  >
    <!-- <el-input
      v-model="filterText"
      placeholder="输入关键字进行过滤"
    /> -->
    <div class="select_usere">
      <el-input v-model="templateForm.orgName" style="margin-right:8px" placeholder="请输入关键字进行查询" />
      <el-button type="primary" size="mini" icon="el-icon-search" @click="searchNode" />
    </div>
    <div class="tree_page_all">
      <div class="tree_page">
        <el-checkbox v-model="checkAll" @change="selectAll">全选</el-checkbox>
        <el-tree
          ref="tree"
          v-loading="treeStatus"
          :data="peopleTreeData"
          show-checkbox
          default-expand-all
          class="tree"
          node-key="id"
          highlight-current
          :props="defaultProps"
          :render-content="renderContent"
          :filter-node-method="filterNode"
        >
          <!-- <span slot-scope="{ node, data }" class="custom-tree-node">
            <span>{{ node.label }}</span><span class="custom_email_font">{{ data.email ? '(' + data.email + ')' : '' }}</span>
          </span> -->
        </el-tree>
      </div>
    </div>
    <!-- <el-button style="margin-left: 10px" type="primary" size="mini" icon="el-icon-circle-plus-outline" /> -->
    <!-- <div class="tree_page_all">
      <el-checkbox v-model="checkAll" @change="selectAll">全选</el-checkbox>
      <div class="tree_page">
        <el-tree
          ref="tree"
          :data="treeData"
          show-checkbox
          node-key="selfId"
          default-expand-all
          class="tree"
          :default-checked-keys="defaultSelect"
          :filter-node-method="filterNode"
          :props="defaultProps"
        />
      </div>
    </div> -->
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="submitForm">提 交</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
const emailTypeList = [
  {
    label: '指引更新通知',
    value: '1'
  },
  {
    label: '升级通知',
    value: '2'
  },
  {
    label: '接口影响评估通知',
    value: '3'
  },
  {
    label: '接口计划通知',
    value: '4'
  }
]

// import { treeFun } from './treeTrans'
// import treeData from './tree'
// import { getUserType } from './getUserType'
import { getPeopleTree, getPeopleTreeNoInst, getSearchPeopleTree } from '@/api/email/email_manage.js'
export default {
  props: {
    selectNode: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      // 过滤搜索条件
      filterText: '',
      dialogVisible: false,
      treeStatus: false,
      emailTypeList: emailTypeList,
      defaultSelect: [],
      templateForm: {
        orgName: '',
        userName: '',
        peopleType: ''
      },
      treeData: [],
      checkAll: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      // xzn test
      allTree: [],
      peopleTreeData: [],
      selectedNodes: [],
      selectedKeys: [],
      searchList: [],
      userType: ''
    }
  },
  methods: {
    initPage(userType) {
      this.checkAll = false
      this.userType = userType
      this.selectedKeys = []
      this.templateForm.orgName = ''
      this.getTree()
      this.dialogVisible = true
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class='custom-tree-node'>
          { (node.label + data.email).length > 45
            ? <el-tooltip effect='dark' placement='right'>
              <div class='content_email' slot='content'>{node.label + data.email }</div>
              <span>
                <span>{ node.label }</span>
                <span class='custom_email_font'>
                  { data.email ? (data.email.length > 21 ? '(' + data.email.substring(0, 21) + '...' + ')' : data.email) : '' }
                </span>
              </span>
            </el-tooltip>
            : <span>
              <span>
                <span>{ node.label }</span>
                <span class='custom_email_font'>
                  { data.email ? '(' + data.email + ')' : '' }
                </span>
              </span>
            </span>
          }
        </span>)
    },
    searchNode() {
      // this.searchList = []
      // // 获取当前已选中的key值（回显使用）
      // var selectedKeys = this.$refs.tree.getCheckedKeys()
      // // console.log('keys', selectedKeys)
      // this.getSelectNodes(this.peopleTreeData, selectedKeys)
      // if (this.templateForm.orgName) {
      //   var newList = this.searchTreeList(this.peopleTreeData, this.templateForm.orgName)
      //   // this.$refs.tree.filter(this.templateForm.orgName)
      //   // console.log('newList', newList)
      //   this.peopleTreeData = newList.concat([])
      // } else {
      //   this.getTree()
      // }
      // this.$nextTick(() => {
      //   // console.log('datakeys', this.selectedKeys)
      //   this.$refs.tree.setCheckedKeys(this.selectedKeys)
      // })
      // this.$refs.tree.filter(this.templateForm.orgName)
      // 调用后台方法搜索
      this.treeStatus = true
      var map = {
        keys: [],
        userType: this.userType,
        search: this.templateForm.orgName,
        isSearch: '2',
        sizeWindow: '1'
      }
      console.log(map)
      getSearchPeopleTree(map).then(res => {
        if (res.code === 'ACK') {
          // 机构端树
          this.peopleTreeData = res.data.concat([])
          this.treeStatus = false
        }
      })
    },
    // 获取选中节点加入选中内容
    getSelectNodes(peopleTreeData, selectedKeys) {
      if (this.selectedKeys.length > 0) {
        var addList = []
        selectedKeys.forEach(key => {
          if (this.selectedKeys.indexOf(key) === -1) {
            addList.push(key)
          }
        })
        this.selectedKeys = this.selectedKeys.concat(addList)
      } else {
        this.selectedKeys = selectedKeys.concat([])
      }
    },
    // 递归树做查询
    searchTreeList(list, searchName) {
      list.forEach(item => {
        var pushFlag = false
        // 若数据label包含数据，则保留
        if (item.label.indexOf(searchName) !== -1) {
          pushFlag = true
          this.searchList.push(item)
        }
        if (!pushFlag) {
          if (item.children) {
            this.searchTreeList(item.children)
          }
        }
      })
      return this.searchList
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label && data.label.indexOf(value) !== -1
    },
    selectAll(val) {
      this.treeStatus = true
      try {
        if (val) {
        // 全选
          this.$refs.tree.setCheckedNodes(this.peopleTreeData)
          this.treeStatus = false
        } else {
        // 取消选中
          this.$refs.tree.setCheckedKeys([])
          this.treeStatus = false
        }
      } catch (error) {
        this.treeStatus = false
      }
    },
    async getTree() {
      this.treeStatus = true
      console.log(this.userType)
      try {
        if (this.userType === '05') {
        // 场务端
          const res = await getPeopleTreeNoInst({ ids: [], keys: [] })
          // console.log('获取接口树========>', res)
          if (res.code === 'ACK') {
            this.treeStatus = false
            this.peopleTreeData = res.data.concat([])
            this.allTree = res.data.concat([])
          }
        } else {
          // 机构端 sizeWindow =1 小窗口传值
          const res = await getPeopleTree({ ids: [], keys: [], sizeWindow: '1' })
          // console.log('获取接口树========>', res)
          if (res.code === 'ACK') {
            this.treeStatus = false
            this.peopleTreeData = res.data.concat([])
            this.allTree = res.data.concat([])
          }
        }
      } catch (error) {
        this.treeStatus = false
        console.log('error=======>', error)
      }
    },
    async openDialog() {

    },
    // async openDialog() {
    //   try {
    //     const { code, data } = await getPeopleTree([])
    //     console.log('res========>', res)
    //     if (code === 'ACK') {
    //       this.treeData = treeFun(data, "0")
    //       console.log('ACK==========>', this.treeData)
    //     }
    //   } catch (error) {
    //     console.log('error=======>', error)
    //   }
    //   // this.treeData = treeFun(treeData.newNode, 0)
    //   this.defaultSelect = []
    //   const val = this.selectNode
    //   if (val && Array.isArray(val)) {
    //     this.defaultSelect = getUserType(treeData.newNode, val)
    //   }
    // },
    handleClose(next) {
      next()
    },
    closeDialog() {
      this.defaultSelect = []
      //  this.$refs.tree.setCheckedKeys([]);
    },
    async submitForm() {
      // 前冲源代码
      // this.$emit('getTree', { nodeList: treeData.newNode, selectList: this.$refs.tree.getCheckedKeys() })
      // xzn测试代码
      // var nodes = []
      // if (this.selectedKeys.length > 0) {
      //   await this.getTree()
      //   console.log('datakeys', this.selectedKeys)
      //   this.$refs.tree.setCheckedKeys(this.selectedKeys)
      //   this.$nextTick(() => {
      //     nodes = this.$refs.tree.getCheckedNodes()
      //     console.log('node', nodes)
      //     this.$emit('getTree', { selectList: nodes })
      //     this.dialogVisible = false
      //   })
      // } else {
      //   nodes = this.$refs.tree.getCheckedNodes()
      //   console.log('node', nodes)
      //   this.$emit('getTree', { selectList: nodes })
      // }
      if (this.selectedKeys.length > 0) {
        await this.getTree()
        // console.log('datakeys', this.selectedKeys)
        this.$refs.tree.setCheckedKeys(this.selectedKeys)
        this.$nextTick(() => {
          var keys = this.$refs.tree.getCheckedKeys()
          var halfKeys = this.$refs.tree.getHalfCheckedKeys()
          keys = keys.concat(halfKeys)
          this.$emit('getTree', { selectList: keys })
          this.dialogVisible = false
        })
      } else {
        var keys = this.$refs.tree.getCheckedKeys()
        var halfKeys = this.$refs.tree.getHalfCheckedKeys()
        keys = keys.concat(halfKeys)

        if (Array.isArray(keys) && keys.length > 0) {
          this.$emit('getTree', { selectList: keys })
          this.dialogVisible = false
        } else {
          this.$message({
            type: 'error',
            message: '未选择发送目标'
          })
        }
      }
      // this.$emit('getTree', { selectList: this.selectedKeys })
    }
  }
}
</script>

<style lang="scss">
.custom-tree-node .show_children_one{
  display: none;
}
.custom-tree-node:hover .show_children_one{
  display: inline;
}
.content_email{
  max-width: 1000px;
  word-wrap:break-word
}
.custom_email_font{
  color: #b1b3b8;
}
</style>

<style lang="scss" scoped>
.select_usere{
    display: flex;
    flex-direction: row;
    padding: 6px 24px;
    border-bottom: 1px solid #DFDFDF;
    box-shadow: 0px 2px 2px rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
}
.tree_page_all{
    padding: 10px 0px 0px 24px;
    max-height: 700px;
    overflow-y: auto;
    .tree_page{
        padding: 6px 0px;
        background: #FCFCFC;
        ::v-deep .el-tree{
            background-color: transparent !important;
            }
    }
}
.custom_email_font{
  color: #b1b3b8;
}
.page_all ::v-deep .el-dialog__body{
    padding: 0px 0px;
    overflow: inherit;
}

.page_all ::v-deep .el-button--mini{
    height: 30px;
     padding-left: 10px;
    padding-right: 8px;
}
/* 树形结构节点添加连线 */
.tree ::v-deep .el-tree-node {
  position: relative;
  padding-left: 16px;
}

.tree ::v-deep .el-tree-node__children {
  padding-left: 16px;
}

.tree ::v-deep .el-tree-node :last-child:before {
  height: 38px;
}

.tree ::v-deep .el-tree > .el-tree-node:before {
  border-left: none;
}

.tree_page ::v-deep .el-tree > .el-tree-node:after {
  border-top: none;
}

.tree_page ::v-deep .el-tree > .el-tree-node:before {
  border-left: none;
}

.tree ::v-deep .el-tree-node__content{
    padding-left: 0px !important;
}
// el-tree-node__content

.tree ::v-deep .el-tree-node:before {
  content: "";
  left: -4px;
  position: absolute;
  right: auto;
  border-width: 1px;
}

.tree ::v-deep.el-tree-node:after {
  content: "";
  left: -4px;
  position: absolute;
  right: auto;
  border-width: 1px;
}
.tree ::v-deep .el-tree-node__expand-icon.is-leaf {
  display: none;
}

.tree ::v-deep .el-tree-node:before {
  border-left: 1px dashed #b8b9bb;
  // overflow: auto !important;
  bottom: 0px;
  height: 100%;
  top: -26px;
  width: 1px;
}

.tree ::v-deep .el-tree-node:after {
  border-top: 1px dashed #b8b9bb;
  height: 20px;
  top: 12px;
  width: 24px;
}
.tree ::v-deep .el-tree{
  background-color: transparent;
}

// .tree ::v-deep .el-icon-caret-right:before{
//   background-color: #2C76D1;
//   content: "\e791"
// }
// .tree ::v-deep .el-icon-minus:before{
//   background-color: #2C76D1
// }
// .tree ::v-deep .el-icon-plus:before{
//   background-color: #2C76D1
// }

//   .tree_page {
//     margin-top: 20px;
//     // height: 100%;
//     ::v-deep .el-icon-caret-right:before {
//       content: '';
//     }
//     ::v-deep .el-tree-node__expand-icon {
//       padding: 0;
//     }
//   }
</style>
