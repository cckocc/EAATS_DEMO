<template>
  <div class="problem-panel">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      label-position="left"
      inline
    >
      <span class="title">机构信息</span>
      <div class="top">
        <label class="label required">接口类型</label>
        <el-row>
          <div class="top-row">
            <el-col :span="8">
              <el-form-item label="产品类型" prop="market" label-width="80px">
                <el-select v-model="form.market" placeholder="" clearable>
                  <el-option
                    v-for="item in market"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item label="" prop="interface">
                <el-select v-model="form.interface" placeholder="" clearable>
                  <el-option
                    v-for="item in interface"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-button
                type="primary"
                class="add-btn"
                @click="add"
              >添加</el-button>
            </el-col>
          </div>
        </el-row>
      </div>
      <div class="middle">
        <label class="label">已添加</label>
        <el-table
          :data="tableData"
          max-height="300"
          fit
          stripe
          style="width: 100%"
          border
          highlight-current-row
          :header-row-style="{height: '42px'}"
          :header-cell-style="{padding: 0}"
          :row-style="{height: '42px'}"
          :cell-style="{padding: 0}"
        >
          <el-table-column show-overflow-tooltip prop="market" label="产品类型" />
          <el-table-column label="操作" align="center" width="100px" fixed="right">
            <template slot-scope="scope">
              <el-button type="text" @click="onOperate('delete', scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="bottom">
        <el-form-item label="问题类型" prop="typeList">
          <el-checkbox-group v-model="form.typeList" @change="typeChange">
            <el-checkbox
              v-for="item in problemType"
              :key="item.value"
              :label="item.value"
              style="width: 130px"
            >{{ item.label }}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="问题描述" class="textarea" prop="describe">
          <el-input v-model="form.describe" type="textarea" placeholder="" style="height: 84px" />
        </el-form-item>
        <el-form-item label="文件上传" prop="fileIdList">
          <UploadFiles
            ref="upload"
            v-model="form.fileIdList"
            :tips="tips"
            :accept="accept"
          />
        </el-form-item>
      </div>
      <el-row class="btn-row">
        <el-form-item>
          <el-button @click="goBack">返回上一步</el-button>
          <el-button type="primary" @click="onOperate()">提交</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import globalOptions from '@/utils/globalOptionsValue'
import UploadFiles from '@/components/UploadFiles'
export default {
  name: 'InfoProblemSubmit',
  components: {
    UploadFiles
  },
  data() {
    const validateFile = (rule, value, callback) => {
      if (this.form.fileIdList.length === 0) {
        callback(new Error('请上传附件'))
      } else {
        callback()
      }
    }
    return {
      accept: '.pdf,.doc,.jpg,.xsl',
      tips: '*注：上传文件格式为.pdf、.doc、.jpg、.xsl格式文件',
      market: globalOptions.MarketSubitem,
      interface: globalOptions.MarketSubitem,
      problemType: globalOptions.problemType,
      form: {
        market: '',
        interface: '',
        typeList: [],
        describe: '',
        fileIdList: []
      },
      rules: {
        typeList: [{ required: true, message: '请选择问题类型', trigger: 'change' }],
        describe: [{ required: true, message: '该项必填，请补充', trigger: 'change' }],
        fileIdList: [{ required: true, validator: validateFile, trigger: 'change' }]
      },
      tableData: [
        { interface: '123', market: '123' },
        { interface: '123', market: '123' },
        { interface: '123', market: '123' },
        { interface: '123', market: '123' }
      ]
    }
  },
  methods: {
    typeChange() {

    },
    add() {

    },
    goBack() {
      this.$emit('changeActiveIndex', 1)
    },
    onOperate() {
    }
  }
}
</script>

<style lang="scss" scoped>
.problem-panel {
  font-family:Microsoft YaHei;
  padding: 30px;
  color: #303030;
  display: flex;
  flex-direction: column;
  .title {
    font-weight: 700;
    border-left: 3px solid #2c76d1;
    padding-left: 6px;
    font-size: 18px;
  }
  .label {
    font-size:14px;
    font-weight:400;
    margin: 20px 0;
    display: inline-block;
  }
  .required:after {
    content: '*';
    color:rgba(255,19,19,1);
  }
  .el-form {
    .el-form-item {
      ::v-deep.el-form-item__label {
        font-size:14px;
        font-weight:400;
      }
    }
  }
  .top {
    .top-row {
      height:55px;
      background:rgba(246,247,251,1);
      border:1px solid rgba(235,235,235,1);
      display: flex;
      align-items: center;
      padding-left: 10px;
      .el-form-item {
        margin: 0;
        ::v-deep .el-form-item__label {
          font-weight: 400;
          font-family:Microsoft YaHei;
          font-size: 14px;
          color: #303030;
        }
        ::v-deep .el-input__inner{
          width: 290px;
        }
      }
      .add-btn {
        height: 30px;
        line-height: 0;
        width: 55px;
        margin-left: 35px;
        padding: 0;
      }
    }
  }
  .middle {
    .el-table {
      ::v-deep th {
        background-color: #F6F7FB;
      }
      ::v-deep th {
        background-color: #F6F7FB;
        .cell {
          color: rgba(48, 48, 48, 1);
          font-size: 15px;
          font-family: Microsoft YaHei;
          font-weight: bold;
        }
      }
      // ::v-deep.el-table_1_column_3 {
      //   border-right: none;
      // }
      ::v-deep.el-table__fixed-right-patch {
        background-color: #F6F7FB;
      }
    }
  }
  .bottom {
    margin-top: 30px;
    .el-form-item {
      width: 100%;
      ::v-deep .el-form-item__label {
        width: 80px!important;
      }
    }
    .el-checkbox {
      width: 80px!important;
    }
    .textarea {
      ::v-deep.el-form-item__content {
        width: 93%;
      }
      ::v-deep.el-textarea__inner {
        width: 100%;
        min-height: 100%!important;
        resize: none;
      }
    }
    ::v-deep.upload-demo {
      display: flex;
      .el-upload__tip {
        margin-left: 20px;
      }
    }
  }
  .btn-row {
      display: flex;
      margin-top: 30px;
      justify-content: center;
      align-items: center;
      .el-form-item {
        margin-bottom: 0;
      }
    }
}
</style>
