<template>
  <div class="showdic">
    <div class="firsthead">IMIX协议简介</div>
    <div class="firstblock">
      IMIX（Inter-bank Market Information eXchange），狭义上指IMIX协议，全称是银行间市场业务数据交换协议，是一种用于在银行间市场交易活动（包括人民币、外汇和衍生品等各类产品的交易、发行、确认和清结算等）中实现金融信息实时传输的电子通信协议。IMIX协议是金融行业标准，起草单位为中国外汇交易中心暨全国银行间同业拆借中心(简称中国交易中心)。经全国金融标准化委员会审核通过，该标准于2011年6月2日由中国人民银行首次发布实施，标准号JR/T 0066-2011。随着银行间市场业务迅速发展和市场成员系统信息化程度的提高，中国外汇交易中心于2014年6月牵头组建标准编制工作组，启动了《银行间市场基础数据元》和《银行间市场业务数据交换协议》的标准修订工作。2019年1月8日，《银行间市场基础数据元》（JR/T 0065-2019，替代JR/T 0065-2011）和《银行间市场业务数据交换协议》第1部分到第3部分（JR/T 0066.1-2019、JR/T 0066.2-2019和JR/T 0066.3-2019，替代JR/T 0066-2011，又称IMIX协议）通过全国金融标准化技术委员会审查，正式由中国人民银行发布。[1]。
    </div>
    <div class="firstblock">
      广义上，IMIX指银行间市场统一业务数据交换体系。该体系结合标准制修订、标准宣贯和系统实施，编制了IMIX协议、《银行间市场基础数据元》和《银行间市场数据接口》三项基础行业技术标准，完成了数据引擎、接口开发工具和开发包、开发规范、开发社区等配套应用基础设施。
    </div>
    <div class="firstblock">
      2016年2月25日，基于IMIX协议标准开发的ISO20022（金融服务：金融业通用报文方案）外汇交易后确认和交易获取的报文正式注册发布。这两组报文是国际标准化组织（ISO）首次发布中国金融领域的相关报文[2]。
      <el-button v-preventReClick v-show="!show" type="text" @click="showMore">查看全部</el-button>
    </div>
    <div class="firstblock">
      <IMIX v-show="show" />
      <el-button v-preventReClick v-show="show" type="text" @click="showMore">收起</el-button>
    </div>
  </div>
</template>

<script>
import IMIX from './IMIX'
export default {
  name: 'ProtocolDictionary',
  components: {
    IMIX
  },
  data() {
    return {
      show: false
    }
  },
  methods: {
    showMore() {
      this.show = !this.show
    }
  }
}
</script>

<style lang="scss" scoped>
  .showdic {
    /*display: flex;*/
    /*flex-direction: column;*/
    /*align-items: center;*/
    justify-content: center;
    padding-bottom: 150px;

    .firsthead {
      font-size: 30px;
      line-height: 40px;
      text-align: center;
      color: rgba(51, 51, 51, 1);
      opacity: 1;
      margin: 41.5px 0 34px 0;
      font-weight: bold;
    }

    .firstblock {
      margin: 0 159px 16px 159px;
      font-size: 14px;
      line-height: 26px;
      color: rgba(51, 51, 51, 1);
      opacity: 1;
    }

    .firstbutton {
      margin-top: 20px;
    }
  }
</style>
