<template>
  <div v-loading.fullscreen.lock="loading" class="step-one" element-loading-text="正在发布，请稍后">
    <div v-if="activeName === 'IIQ'" class="btn">
      <el-upload
        class="upload-demo"
        action="fakeaction"
        :accept="accept"
        :show-file-list="false"
        :http-request="uploadFile"
      >
        <el-button v-preventReClick size="small" type="primary">Excel导入</el-button>
      </el-upload>
    </div>

    <div v-if="activeName === 'Market'" class="btn">
      <el-upload
        class="upload-demo"
        action="fakeaction"
        :accept="accept"
        :show-file-list="false"
        :http-request="uploadMarktFile"
      >
        <el-button v-preventReClick size="small" type="primary">Excel导入</el-button>
      </el-upload>
    </div>

    <el-tabs v-model="activeName" type="card" class="secondary-tabs">
      <el-tab-pane label="市场机构" name="Market" class="no-select">
        <marketTab
          :market-data="marketData"
        />
      </el-tab-pane>

      <el-tab-pane label="信息商" name="IIQ">
        <div class="el-table el-table--fit el-table--border el-table--group el-table--scrollable-x">
          <div class="el-table__header-wrapper">
            <table cellspacing="0" cellpadding="0" border="0" class="el-table__header" style="width: 100%;">
              <thead class="is-group has-gutter">
                <tr class="">
                  <th colspan="2" rowspan="1" style="width: 380px">
                    <div class="cell">产品类型</div>
                  </th>
                  <th colspan="4" rowspan="1">
                    <div class="cell">数据内容</div>
                  </th>
                  <th colspan="1" rowspan="1">
                    <div class="cell">备注</div>
                  </th>
                </tr>
              </thead>
            </table>
          </div>
          <div class="el-table__body-wrapper">
            <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" style="width: 100%;">
              <tbody>
                <tr v-for="(item,index) in tableList" :key="index" class="el-table__row">
                  <tableTreeTd
                    v-for="(t,i) in values"
                    :key="i"
                    :depth="values.length"
                    :value="t"
                    :item="item"
                    @changeNode="changeNode"
                    @contextmenu.prevent.native="openMenu(t,$event,item)"
                  />
                </tr>
              </tbody>
              <!-- <tbody>
                <tr v-for="(item, index) in nodeMark">
                  <td style="width: 184px; height: 55px;">{{item}}</td>
                </tr>
              </tbody> -->
            </table>
          </div>
        </div>
        <div class="footer">
          <el-button
            v-preventReClick
            type="primary"
            class="button-primary"
            @click="release"
          >发布</el-button>
          <el-button class="button-default" @click="cancle">取消</el-button>
        </div>
      </el-tab-pane>
    </el-tabs>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li v-preventReClick @click="addNode(selectedTag)">增加</li>
      <!-- <li v-preventReClick >修改</li> -->
      <li v-preventReClick @click="deleteNode(selectedTag)">删除</li>
    </ul>
  </div>
</template>

<script>
import tableTreeTd from './tableTreeTd'
import TableTree from '@/utils/table-tree'
import treeMethods from '@/utils/treeMethods'
import marketTab from './marketTab'
import { importExcel, getAddTree, getUUid, publishTree, selectTree, importMerketExcel } from '@/api/menuConfig'
import { mapGetters } from 'vuex'
export default {
  name: 'ServiceApplication',
  components: {
    tableTreeTd,
    marketTab
  },
  data() {
    return {
      activeName: 'Market',
      loading: false,
      map: {},
      values: [],
      tableList: [],
      tableData: [], // 增加、删除、修改树节点，前端操作，发布时返回给后台
      visible: false,
      // nodeMark: [],
      top: 0,
      left: 0,
      selectedTag: {},
      selectedItem: {},
      accept: '.xlsx,.xls',
      marketData: []
    }
  },
  watch: {
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  created() {
    this.selectTree()
  },
  methods: {
    // handleNodeMark(tableList) { // 备注作为单独列渲染
    //   tableList.forEach(item => {
    //     let num = this.values.length
    //     let nodeMarkTemp = item[`nodeRemark_${num}`]
    //     console.log(`nodeRemark_${num}`, nodeMarkTemp)
    //     this.nodeMark.push(nodeMarkTemp)
    //   })
    // },
    async addNode(node) { // 增加树节点
      await treeMethods.handlerInsert(this.values, node, this.map)
      this.getTableList(this.tableData)
    },

    changeNode(node) { // 获取子组件改变的节点数据 node = {id: '', text: ''}
      this.changeNodeById(this.tableData, node)
      this.getTableList(this.tableData)
    },

    /* 改变子节点 */
    changeNodeById(tree, node) {
      for (let i = 0; i < tree.length; i++) {
        if (tree[i].id === node.id) {
          tree[i].nodeName = node.text
          break
        } else if (tree[i].chidrenList !== null) {
          this.changeNodeById(tree[i].chidrenList, node)
        }
      }
    },

    /* 递归删除子节点 */
    deleteNode(tag) {
      this.delete(tag)
      this.getTableList(this.tableData)
    },
    delete(tag) {
      const id = tag.id
      const childrenList = this.map[id]
      if (childrenList.length === 1) {
        const pNodeId = tag.pNodeId
        const pNode = this.map[pNodeId]
        pNode.forEach((item, index) => {
          if (item.id === pNodeId) {
            item.step = this.values.length - item.nodeLevel + 1 // 删除之后与父节点合并
          }
        })
        // this.$message({
        //   message: '删除成功',
        //   type: 'success'
        // })
        // return
      }
      childrenList.forEach((item, index) => {
        if (item.id === id) {
          childrenList.splice(index, 1)
        }
      })
    },
    openMenu(tag, e, item) {
      const menuMinWidth = 122
      const menuMinHeight = 134
      const offsetLeft = this.$el.getBoundingClientRect().left
      const offsetTop = this.$el.getBoundingClientRect().top
      const offsetWidth = this.$el.offsetWidth
      const offsetHeight = this.$el.offsetHeight
      const maxLeft = offsetWidth - menuMinWidth
      const left = e.clientX - offsetLeft
      const maxTop = offsetHeight - menuMinHeight
      const top = e.clientY - offsetTop

      if (left > maxLeft) {
        this.left = maxLeft
      } else {
        this.left = left
      }

      if (top > maxTop) {
        this.top = maxTop
      } else {
        this.top = top
      }
      this.visible = true
      this.selectedTag = this.getItemValue(tag, item)
    },
    closeMenu() {
      this.visible = false
    },
    getItemValue(value, item) {
      const option = {}
      Object.keys(item).forEach(key => {
        const arr = key.split('_')
        const keyName = arr[0]
        const index = arr[arr.length - 1] * 1
        if (index === value) {
          option[keyName] = item[key]
        }
      })
      return option
    },
    getTableList(treeData) {
      if (treeData) {
        const tableTree = new TableTree()
        this.values = tableTree.getValues(treeData)
        this.tableList = tableTree.run(treeData)
        // this.handleNodeMark(this.tableList)
      }
    },
    async uploadFile(params) {
      const file = params.file
      const fileName = file.name
      const extName = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
      const isLt2M = file.size / 1024 / 1024 <= 10
      if (!isLt2M) {
        this.$message.error(`上传失败，文件大小超过10MB`)
        return
      }
      if (this.accept && this.accept.indexOf(extName) === -1) {
        this.$message({
          message: '上传失败，不支持上传该格式文件!',
          type: 'error'
        })
        return false
      }
      try {
        const form = new FormData()
        form.append('file', file)
        const r = await importExcel(form)
        this.tableData = r.data
        localStorage.setItem('tableDataTemp', JSON.stringify(r.data))
        treeMethods.getNodeMapToChildrenList(this.tableData, this.map)
        this.getTableList(this.tableData)
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
    },
    selectTree() {
      const params = {
        menuInstiType: 'IIQ'
      }
      selectTree(params).then(res => {
        if (res.code === 'ACK') {
          this.tableData = res.data
          localStorage.setItem('tableDataTemp', JSON.stringify(this.tableData))
          treeMethods.getNodeMapToChildrenList(this.tableData, this.map)
          this.getTableList(this.tableData)
        }
      })
    },
    release() {
      const params = {
        menuDtoList: this.tableData,
        menuInstiType: this.activeName
      }
      this.loading = true
      publishTree(params).then(res => {
        if (res.code === 'ACK') {
          this.loading = false
          this.$message({
            message: '已新增接口，请联系开发配置审核部门',
            type: 'success'
          })
          localStorage.setItem('tableDataTemp', JSON.stringify(this.tableData)) // 将发布成功的数据保存到localStorage
        }
      })
    },
    cancle() {
      const tableDataTemp = localStorage.getItem('tableDataTemp')
      this.tableData = JSON.parse(tableDataTemp)
      treeMethods.getNodeMapToChildrenList(this.tableData, this.map)
      this.getTableList(this.tableData)
      this.$message({
        message: '操作成功',
        type: 'success'
      })
    },

    async uploadMarktFile(params) {
      const file = params.file
      const fileName = file.name
      const extName = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
      const isLt2M = file.size / 1024 / 1024 <= 10
      if (!isLt2M) {
        this.$message.error(`上传失败，文件大小超过10MB`)
        return
      }
      if (this.accept && this.accept.indexOf(extName) === -1) {
        this.$message({
          message: '上传失败，不支持上传该格式文件!',
          type: 'error'
        })
        return false
      }
      try {
        const form = new FormData()
        form.append('file', file)
        const r = await importMerketExcel(form)
        this.marketData = r.data
        localStorage.setItem('marketDataTemp', JSON.stringify(this.marketData))
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
  .step-one {
    padding: 37px;
    position: relative;
    ::v-deep.secondary-tabs {
      > .el-tabs__header {
        .el-tabs__nav {
          border-radius: 0;
          height: 41px;

          .el-tabs__item {
            color: #303030;
            font-size: 15px;

            &.is-active {
              border-top: 2px solid #2C76D1;
              font-weight: bold;
              color: #2C76D1;
            }
          }
        }
      }
    }
    .is-group{
      font-size: 15px;
      font-family: Microsoft YaHei;
      font-weight: bold;
      color: rgba(48,48,48,1);
    }
    .footer {
      text-align: center;
      display: block;
      margin-top: 40px;
    }
  }
  .btn{
    display: flex;
    justify-content: flex-end;
    margin-bottom: 20px;
  }
  .contextmenu {
    margin: 0;
    width: 122px;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 10px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow:0 1px 3px rgba(209,213,222,0.8);
    li {
      margin: 0;
      padding: 11px 20px;
      font-size: 14px;
      color: #303030;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
</style>
