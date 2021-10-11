<template>
  <div class="document-panel">
    <el-tabs v-model="activeName" class="document-panel-tabs" type="card" @tab-click="handleClick">
      <el-tab-pane label="市场机构" name="first">
        <div class="header">
          <div class="header-left">
            <span class="type-all">所有分类: 全部</span>
          </div>
          <div class="header-right">
            <el-button
              type="primary"
              icon="el-icon-folder-add"
              class="btn"
              @click="dialogFormVisible = true"
            >资源上传</el-button>
          </div>
        </div>
        <div ref="body" class="body">
          <el-row>
            <el-col :span="3">
              <div class="left-collapse">
                <el-collapse v-model="activeMarket" accordion @change="handleChange">
                  <el-collapse-item title="市场" name="market" />
                  <el-collapse-item title="接口用途" name="interface" />
                </el-collapse>
              </div>
              <div v-show="showMarket" class="subitem market-subitem">
                <el-checkbox-group v-model="checkMarketList" max="1">
                  <el-checkbox v-for="(item,index) in MarketSubitem" :key="index" :label="item.label" />
                </el-checkbox-group>
              </div>
              <div v-show="showInterface" class="subitem interface-subitem">
                <el-checkbox-group v-model="checkMarketList">
                  <el-checkbox v-for="(item,index) in MarketSubitem" :key="index" :label="item.label" />
                </el-checkbox-group>
              </div>
            </el-col>
            <el-col :span="21">
              <div class="right-table">
                <el-table
                  :data="tableData"
                  stripe
                  border
                  highlight-current-row
                  :header-row-class-name="tableRowClassName"
                  :header-row-style="{height: '42px'}"
                  :header-cell-style="{padding: 0}"
                  :row-style="{height: '42px'}"
                  :cell-style="{padding: 0}"
                >
                  <el-table-column show-overflow-tooltip prop="file" label="文件" min-width="200">
                    <template slot-scope="scope">
                      <el-button type="text" size="small" @click="handleClick(scope.row)">{{ scope.row.file }}</el-button>
                    </template>
                  </el-table-column>
                  <el-table-column show-overflow-tooltip prop="people" label="发布人" min-width="150" />
                  <el-table-column show-overflow-tooltip prop="date" label="发布时间" min-width="150" />
                  <el-table-column label="操作" align="center" width="100" fixed="right">
                    <template slot-scope="scope">
                      <el-button type="text" @click="onOperate('resetPass', scope.row)">删除</el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="block">
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
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>

      <el-tab-pane label="信息商" name="second" />
    </el-tabs>
    <el-dialog :close-on-click-modal="false" :visible.sync="dialogFormVisible" class="dialog">
      <label slot="title" class="notice-title">资源新增</label>
      <el-form :model="form" label-position="left">
        <el-form-item :label-width="formLabelWidth" required>
          <label slot="label">类型</label>
          <el-select v-model="form.region" placeholder="请选择资源类型" style="width:309px;">
            <el-option label="指引和SDK" value="shanghai" />
            <el-option label="测试报告" value="beijing" />
            <el-option label="协议字典" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" required>
          <label slot="label">标题</label>
          <el-input v-model="form.name" autocomplete="off" style="width:309px;" maxlength="100" />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" required>
          <label slot="label">文件</label>
          <el-upload
            ref="upload"
            class="upload-demo"
            action=""
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :auto-upload="false"
            accept=".xlsx,.xml,.doc,.docx"
            :http-request="httpRequestPosi"
          >
            <el-button slot="trigger" size="small" type="primary" style="height:30px;padding:0 6px;">
              选取文件</el-button>
            <div slot="tip" class="el-upload__tip">只能上传xml、doc、rar文件</div>
          </el-upload>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <div class="footer-content"><el-button type="primary" @click="submitUpload">上 传</el-button>
          <el-button @click="dialogFormVisible = false">取 消</el-button></div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import globalOptions from '@/utils/globalOptionsValue'
export default {
  name: 'MemberManage',
  data() {
    return {
      activeName: 'first',
      activeMarket: '',
      showMarket: false,
      showInterface: false,
      dialogFormVisible: false,
      marketHeight: null,
      interfaceHeight: null,
      checkMarketList: ['外汇'],
      mainObj: {
        list: [],
        pageSize: 20,
        currentPage: 1,
        total: 0
      },
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      formLabelWidth: '100px',
      MarketSubitem: globalOptions.MarketSubitem,
      tableData: [{
        title: '协议字典1.0',
        type: '指引和SDK',
        file: '外汇接口指引.doc、外汇接口SDK.rar',
        people: '管理员1',
        date: '2016-05-02'
      },
      {
        title: '协议字典1.0',
        type: '指引和SDK',
        file: '外汇接口指引.doc、外汇接口SDK.rar',
        people: '管理员1',
        date: '2016-05-02'
      },
      {
        title: '协议字典1.0',
        type: '指引和SDK',
        file: '外汇接口指引.doc、外汇接口SDK.rar',
        people: '管理员1',
        date: '2016-05-02'
      },
      {
        title: '协议字典1.0',
        type: '指引和SDK',
        file: '外汇接口指引.doc、外汇接口SDK.rar',
        people: '管理员1',
        date: '2016-05-02'
      }
      ]
    }
  },
  mounted() {
    document.addEventListener('click', this.hideSubitem)
  },
  destroyed() {
    document.removeEventListener('click', this.hideSubitem, true)
  },
  methods: {
    handleChange(val) {
      if (val === 'market') {
        this.showMarket = true
        this.showInterface = false
      } else if (val === 'interface') {
        this.showInterface = true
        this.showMarket = false
      } else {
        this.showMarket = false
        this.showInterface = false
      }
    },
    hideSubitem(e) {
      const className = e.target.className
      if (className !== 'el-collapse-item__header is-active' && className !== 'el-checkbox__original') {
        this.showMarket = false
        this.showInterface = false
        this.activeMarket = ''
      }
      // if(className === 'el-checkbox__original') {
      //   if(this.activeMarket === 'market') {
      //     this.showMarket = true
      //   } else {
      //     this.showInterface = true
      //   }
      // }
    },
    handleClick(row) {
      console.log(row)
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
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
      console.log(this.fileList)
    },
    httpRequestPosi(file) {
      const param = new FormData() // 创建form对象
      param.append('file', file.file)
      console.log(file)
    },
    tableRowClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        return 'header-row-th'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$mainWidth: 1218px;
.document-panel {
  padding: 22px;
  display: flex;
  background-color: #FFF;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .font-header {
    padding: 0 0 15px 10px;
    font-size: 20px;
    font-family: Microsoft YaHei;
    font-weight: bold;
  }

  .header {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
    border-bottom: none;
    display: flex;
    flex-direction: row;
    padding-bottom: 10px;
    justify-content: space-between;
    align-items: center;
    .header-left {
      font-size: 14px;
    }
    .btn {
      width: 100px;
      height: 30px;
      padding: 0;
    }
  }

  .body {
    background: rgba(255, 255, 255, 1);
    border-bottom: none;
    padding: 0 0 0 0;
    display: flex;
    .el-row {
      width: 100%;
      .el-col {
        height: 100%;
      }
      .el-col-3 {
        display: flex;
      }
      .el-col-21 {
        padding-left: 10px;
      }
    }
    .left-collapse {
      width: 100%;
      height: 100%;
      background:rgba(250,251,253,1);
      border:1px solid rgba(237,239,244,1);
      border-top: none;
      .el-collapse-item {
        width: 100%;
        ::v-deep .el-collapse-item__header {
          height:42px;
          border-right:1px solid rgba(237,239,244,1);
          background:rgba(246,247,251,1);
          padding-left: 10px;
          font-size: 15px;
          .el-collapse-item__arrow.is-active {
            transform: rotate(0);
            color: #2C76D1;
            font-weight: 700;
          }
        }
        ::v-deep .el-collapse-item__header.is-active {
          border-bottom-color: #e6ebf5;
          color: #2C76D1;
          font-weight: 700;
        }
        ::v-deep .el-collapse-item__wrap {
          display: none;
        }
      }
    }
    .subitem {
      width: 17%;
      height: 100%;
      position: absolute;
      margin-left: 12.5%;
      z-index: 999;
      background:rgba(246,247,251,1);
      border:1px solid rgba(237,239,244,1);
      border-left: none;
      padding: 10px;
      overflow-y: auto;
      .el-checkbox {
        margin-bottom: 15px;
      }
    }
    .market-subitem {
      // max-height: var(--market-height);
    }
    .interface-subitem {
      margin-top: 42px;
      max-height: calc(100% - 42px);
    }
    .right-table {
      width: 100%;
    }
    .el-table {
      ::v-deep .el-table--border {
        border-right: 1px solid #dfe6ec;
      }
      ::v-deep .header-row-th {
       th {
         font-size:15px;
         font-family:Microsoft YaHei;
         font-weight:bold;
         line-height:20px;
         color:rgba(48,48,48,1);
       }
     }
    }
    ::v-deep.el-table th {
      background-color: #F6F7FB;
    }
  }

  .block {
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(223, 223, 223, 1);
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
    border-top: none;
    width: 100%;
    padding: 20px 23px 20px 10px;
    display: flex;
    justify-content: flex-end;
  }

.dialog {
  .notice-title {
    font-size: 20px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    line-height: 26px;
    color: rgba(48, 48, 48, 1);
    opacity: 1;
  }

  ::v-deep .el-dialog__header {
    border-bottom: 1px solid rgba(209, 213, 222, 1);
    opacity: 1;
  }

  .dialog-footer {
    display:flex;
    justify-content: center;
  }

  ::v-deep .el-dialog__footer {
    background-color: #FFFFFF;
  }
}
::v-deep.document-panel-tabs {
  > .el-tabs__header {
        .el-tabs__nav {
          border-radius: 0;
          height: 41px;

          .el-tabs__item {
            color: #303030;
            font-size: 14px;

            &.is-active {
              border-top: 2px solid #2C76D1;
              font-weight: bold;
              color: #2C76D1;
            }
          }
        }
      }
  }
}
</style>
