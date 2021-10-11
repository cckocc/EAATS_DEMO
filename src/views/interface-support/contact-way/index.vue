<template>
  <div>
    <div class="main">
      <div class="content">
        <!-- <div class="center">
          <h3> 接口业务介绍</h3>
          <pre class="pre">
      银行间市场对外接口包括交易执行接口、交易行情接口、成交数据接口、交易后处理接口、交易参考数据接口、信息产品接口和授信管理接口，覆盖交易全生命周期，具有标准性、便捷性、时效性、兼容性与可靠性等诸多优势。机构可使用接口实现自动交易、行情获取、实时核对、风险管理和直通式处理。

  1.交易执行接口: 主要用于银行间本外币市场做市报价、自动化交易等，目前支持指示性报价、做市报价、请求报价、匿名点击、对话报价五种交易方式。
  2.交易行情接口：向机构提供实时的交易行情数据，包括报价行情和成交行情。
  3.成交数据接口：向机构提供获取本方实时成交数据、本方成交查询及关联机构成交信息的统一专属通道。
  4.交易后处理接口：向机构提供交易确认、交易冲销、交易核对、组合对账、结算服务等交易后处理业务功能的接口通道。
  5.交易参考数据接口：向机构提供交易标的、机构基础信息、节假日等交易所需的参考数据接口。
  6.信息产品接口：提供基准指标、曲线类指标、产品估值、指数类指标等四大系列基准产品数据和多维数据挖掘产品。
  7.授信管理接口：用于机构在交易过程中对额度数据进行管理和查询，以控制交易风险。
        </pre>
          <div class="process">
            <h3>接口申请流程</h3>
            <div class="img">
              <img src="@/assets/icon/connect-way.png" alt="">
            </div>
            <el-row>
              <el-col :span="8">
                <ul>
                  <li>业务申请/变更/终止</li>
                  <li>获取开发指引和开发包</li>
                </ul>
              </el-col>
              <el-col :span="8">
                <ul>
                  <li>接口开发调试</li>
                  <li>验收申请</li>
                  <li>验收报告</li>
                </ul>
              </el-col>
              <el-col :span="8">
                <ul>
                  <li>签署接口协议</li>
                  <li>提交上线材料</li>
                  <li>获得接口权限</li>
                </ul>
              </el-col>
            </el-row>
          </div>
          <h3>流程指引</h3>
          <pre class="pre">
  （一）、服务申请/变更
      1、机构可通过接口服务菜单申请开通或变更接口业务。
      2、机构可通过接口服务菜单下载相应的接口开发指引和开发包。
  （二）、开发和调试
      1、机构在接口开发过程中如需接口调试可通过交易中心提供的测试环境进行接口测试。如有业务或技术问题，可通过下方“联系人信息”获得业务及技术支持。
      2、接口内部测试通过后，可向交易中心申请接口验收，选择相应的接口验收范围和验收时间。
      3、接口验收通过后，交易中心将出具验收报告。机构可在验收申请页面进行查阅。
  （三）、接口上线
      验收通过后，机构可通过接口服务菜单提交上线申请、确定上线日期、提交相关材料，并提交上线申请中对应产品的表单。上述材料完成提交后，交易中心将为机构开立接口账户或开通相应接口权限，并为机构提供上线支持。
        </pre>
          <h3>联系人信息：</h3>
          <p><b>会员支持：</b></p>
          <p>4009-787878*5*1/2/3/4</p>
          <p>cfetsapi@chinamoney.com.cn</p>
        </div> -->
        <h3 class="center">{{ noticeTitle }}</h3>
        <div v-html="noticeContent" />
      </div>
    </div>
  </div>
</template>

<script>
import { getBusiness } from '@/api/gripManageApi'
export default {
  name: 'ContactWay',
  data() {
    return {
      treeData: [],
      treeList: [],
      needLength: 0,
      noticeTitle: '',
      noticeContent: ''
    }
  },
  created() {
    this.getBusiness()
  },
  methods: {
    getBusiness() {
      getBusiness().then(res => {
        if (res.code === 'ACK') {
          this.noticeTitle = res.data.noticeTitle
          this.noticeContent = res.data.body
          // let data = JSON.parse(JSON.stringify(res.data))
          // let html = this.businessObj.body
          // html = html.replace(/&lt;/g, '<')
          // html = html.replace(/&gt;/g, '>')
          // try {
          //   this.$refs.businessObjTiny.setContent(html)
          // } catch (e) {
          //   console.log(e)
          // }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
    $mainWidth: 1220px;

    .main {
        display: flex;
        background-color: #E7EDF5;
        flex-direction: column;
        width: $mainWidth;
        margin: 28px auto;
        height: 100%;
        .content{
          background-color: #ffffff;
          height: auto;
          padding: 0 160px;
          margin: 0 auto;
          word-break: break-word;
          width: 100%;
          word-wrap: break-word;
          .pre{
            line-height: 28px;
            width: 900px;
            white-space: pre-wrap;
          }
          .center{
            text-align: center;
          }
          .process{
            img{
              width: 800px;
            }
            li{
              line-height: 27px;
            }
          }
        }
    }
</style>
