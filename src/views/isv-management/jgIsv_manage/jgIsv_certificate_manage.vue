<template>
  <div class="jgIsv_certificate_manage">
    <div class="content">
      <el-card class="top_card">
        <el-form :inline="true" :model="formInline" class="query_inline_form">
          <el-form-item label="证书编号">
            <el-input
              v-model="formInline.certificateNum"
              clearable
              placeholder="请输入证书编号"
              maxlength="300"
            />
          </el-form-item>
          <el-form-item label="持证人姓名">
            <el-input
              v-model="formInline.certificateUser"
              clearable
              placeholder="请输入持证人姓名"
              maxlength="300"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              size="mini"
              type="primary"
              style="margin-left: 30px"
              @click="handleFilter()"
            >查询</el-button>
            <el-button size="mini" @click="onReset()">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <div v-loading="loading">
        <el-row :gutter="24" class="textCenter">
          <el-col v-for="item in isvCertifList" :key="item.id" :span="12">
            <el-card class="box_card" shadow="hover">
              <el-row>
                <el-col :span="24">
                  <span class="text"> 证书编号: </span>
                  <span class="return" style="padding-left: 30px">{{
                    item.certificateNum
                  }}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <span class="text"> 持证人姓名: </span>
                  <span class="return">{{ item.certificateUser }}</span>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="24">
                  <span class="text"> 发证日期: </span>
                  <span class="return" style="padding-left: 30px">{{
                    item.issureDt
                  }}</span>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="24">
                  <span class="text"> 有效期: </span>
                  <span class="return" style="padding-left: 50px">{{
                    item.validityTime
                  }}</span>
                </el-col>
              </el-row>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import { reqQueryCert } from '@/api/isvManagement/isv_manage'
import axios from 'axios'
export default {
  name: 'JgIsvCertificateManage',
  data() {
    return {
      formInline: {
        certificateNum: '',
        certificateUser: ''
      },
      searchForm: {
        certificateNum: '',
        certificateUser: ''
      },
      loading: false,

      // 查询后的证书列表
      isvCertifList: [
        // {
        //   certificateNum: '123123123',
        //   certificateUser: 'chen',
        //   issureDt: '2021-01-01',
        //   validityTime: '2022-01-10'
        // }
      ]
    }
  },
  created() {
    // this.handleFilter()
  },
  methods: {
    handleFilter() {
      this.searchForm = JSON.parse(JSON.stringify(this.formInline))
      this.onQuery(this.searchForm)
    },
    async onQuery(searchForm) {
      this.loading = true
      try {
        // axios({
        //   method: 'post',
        //   url: `/cass/certificate/certificate/organ/certList`,
        //   data: {
        //     ...searchForm
        //   }
        // }).then((res) => {
        //   console.log(res)
        //   if (res.data.data.code === 'ACK') {
        //     this.isvCertifList = res.data.data.data.list
        //     this.total = res.data.data.data.totalRecord
        //   }
        //   this.loading = false
        // }).catch(error => {
        //   console.log(error)
        // })
        const res = await reqQueryCert({ ...searchForm })
        if (res.code === 'ACK') {
          this.isvCertifList = res.data
          if (res.data && res.data.length === 0) {
            this.$message({
              type: 'warning',
              message: '查询结果为空'
            })
          }
        }

        // if (res.data.list && res.data.list.length === 0) {
        //   this.$message({
        //     type: 'warning',
        //     message: '查询结果为空',
        //   })
        // }
        this.loading = false
        // console.log('查询机构端ISV证书列表信息', res)
      } catch (error) {
        this.loading = false
        console.log(error)
      }
    },

    onReset() {
      Object.keys(this.formInline).forEach((item) => {
        if (typeof this.formInline[item] === 'string') {
          this.formInline[item] = ''
        }
        if (
          typeof this.formInline[item] === 'object' &&
          Array.isArray(this.formInline[item])
        ) {
          this.formInline[item] = []
        }
        if (
          Object.prototype.toString.call(this.formInline[item]) ===
            '[object object]' &&
          Array.isArray(this.formInline[item])
        ) {
          this.formInline[item] = {}
        }
        if (item === 'page') this.formInline[item] = 1
        if (item === 'pageSize') this.formInline[item] = 10
      })
      // this.handleFilter()
    }
  }
}
</script>

<style lang='scss' scoped>
$mainWidth: 1220px;
.content {
  width: $mainWidth;
  margin: 0px auto;
}

.top_card {
  margin: 20px 0px;
}
.query_inline_form {
  height: 30px;
}
.box_card {
  width: 598px;
  height: 200px;
  background: url('~@/assets/style/isvKB_BG.svg') no-repeat #ffffff;
  border: 1px solid #dfdfdf;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
  opacity: 1;
  // margin-top: 15px;
  // margin-bottom: 20px;
  padding: 15px;
}
.text {
  width: 224px;
  height: 51px;
  font-size: 20px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 30px;
  color: #667baa;
  opacity: 1;
  // padding-left: 20px;
}
.return {
  width: 292px;
  height: 51px;
  font-size: 20px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  line-height: 30px;
  color: #000;
  opacity: 1;
  padding-left: 10px;
}

.el-input ::v-deep .el-input__inner {
  width: 300px;
}

.el-input ::v-deep .el-input--medium .el-input--suffix {
  width: 300px;
}
</style>
