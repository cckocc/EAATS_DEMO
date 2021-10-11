<template>
  <div>
    <!-- <div v-if="operationType === 'download'" class="main-body-top resources-top">
      <div class="resources-top-left">
        <el-form ref="searchForm" inline>
          <el-form-item>
            <el-input v-model="keywords" placeholder="请输入关键字" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="mini">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="resources-top-right">
        <div v-if="operationType === 'download'" class="resources-top-right-download">
          <el-button type="text" size="mini" @click="showUpdateLog">更新日志<i class="el-icon-question" /></el-button>
        </div>
        <div v-if="operationType === 'upload'" class="resources-top-right-upload">
          <el-button v-if="overviewObj.val.length > 0" type="primary" size="mini" plain @click="downloadLastVersionFile(overviewObj.val[0])">{{ overviewObj.val[0].name }}</el-button>
          <el-button v-if="overviewObj.val.length === 0" type="primary" size="mini" @click="showUploadDialog('add')">上传指引总述</el-button>
          <el-button v-if="overviewObj.val.length > 0" type="primary" size="mini" @click="showUploadDialog('edit', overviewObj.val[0])">更新</el-button>
          <el-button v-if="overviewObj.val.length > 0" type="primary" size="mini" @click="showVersionRecord(overviewObj.val[0])">更新记录</el-button>
        </div>
      </div>
    </div> -->
    <!-- <div class="main-body-bottom">
      <childTab :resources-data="resourcesData" :operation-type="operationType" />
    </div> -->
    <div v-if="isShowResources" class="main-body-bottom">
      <div v-if="operationType === 'download'" class="text-right">
        <el-button type="text" size="mini" @click="showUpdateLog">更新日志<i class="el-icon-question" /></el-button>
      </div>
      <div class="el-table el-table--fit el-table--border el-table--group el-table--scrollable-x">
        <div ref="tableHeaderContainer" class="el-table__header-wrapper" style="overflow: auto;">
          <table
            ref="tableHeader"
            cellpadding="0"
            cellspacing="0"
            border="0"
            class="el-table__header"
            :style="{width: widthObj.header + 'px'}"
          >
            <thead class="table-tree-head table-tree-head-resources">
              <tr>
                <!-- <th style="width: 100px;">用户类型</th> -->
                <th style="width: 150px;">接口产品</th>
                <th style="width: 150px;">市场</th>
                <th style="width: 180px;">接口用途</th>
                <th style="width: 180px;">业务指引</th>
                <th style="width: 180px;">开发指引</th>
                <th style="width: 180px;">接口开发包</th>
                <th style="width: 180px;">协议条款</th>
              </tr>
            </thead>
          </table>
        </div>
        <div ref="tableBodyContainer" class="el-table__body-wrapper" style="overflow: auto;" :style="{height: autoHeight + 'px'}">
          <table
            ref="tableBody"
            cellspacing="0"
            cellpadding="0"
            border="0"
            class="el-table__body"
          >
            <thead class="table-tree-head table-tree-head-resources">
              <tr style="visibility: collapse;">
                <!-- <th style="width: 100px;">用户类型</th> -->
                <th style="width: 150px;">接口产品</th>
                <th style="width: 150px;">市场</th>
                <th style="width: 180px;">接口用途</th>
                <th style="width: 180px;">业务指引</th>
                <th style="width: 180px;">开发指引</th>
                <th style="width: 180px;">接口开发包</th>
                <th style="width: 180px;">协议条款</th>
              </tr>
            </thead>
            <tbody class="table-tree-body">
              <!-- <tr v-show="lateShow" style="visibility: hidden;">
                <td ref="td1" style="width: 82px;" />
                <td ref="td2" style="width: 206px;" />
                <td ref="td3" style="width: 120px;" />
                <td ref="td4" style="width: 136px;" />
                <td ref="td5" />
                <td ref="td6" />
                <td ref="td7" />
                <td ref="td8" />
              </tr> -->
              <tr>
                <!-- <td rowspan="92">市场机构</td> -->
                <td>LC API</td>
                <td>外汇市场</td>
                <td>交易执行</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E2" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceIdea_F2" :operation-type="operationType" column-title="开发指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceBag_G2" :operation-type="operationType" column-title="接口开发包" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.protocol_H2" :operation-type="operationType" column-title="协议条款" />
                </td>
              </tr>
              <tr>
                <td>LP API</td>
                <td>外汇市场</td>
                <td>交易执行</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E3" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceIdea_F3" :operation-type="operationType" column-title="开发指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceBag_G3" :operation-type="operationType" column-title="接口开发包" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.protocol_H3" :operation-type="operationType" column-title="协议条款" />
                </td>
              </tr>
              <tr>
                <td>C-Swap行情接口</td>
                <td>外汇市场</td>
                <td>交易行情</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E4" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td rowspan="3">
                  <fileTd :upload-td-obj="uploadAllData.interfaceIdea_F4" :operation-type="operationType" column-title="开发指引" />
                </td>
                <td rowspan="3">
                  <fileTd :upload-td-obj="uploadAllData.interfaceBag_G4" :operation-type="operationType" column-title="接口开发包" />
                </td>
                <td rowspan="3">
                  <fileTd :upload-td-obj="uploadAllData.protocol_H4" :operation-type="operationType" column-title="协议条款" />
                </td>
              </tr>
              <tr>
                <td>C-Swap交易接口</td>
                <td>外汇市场</td>
                <td>交易执行</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E5" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td>C-Swap授信接口</td>
                <td>外汇市场</td>
                <td>授信管理</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E6" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td rowspan="15">本币交易接口</td>
                <td>现券买卖</td>
                <td>交易执行</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E7" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td rowspan="13">
                  <fileTd :upload-td-obj="uploadAllData.interfaceIdea_F7" :operation-type="operationType" column-title="开发指引" />
                </td>
                <td rowspan="13">
                  <fileTd :upload-td-obj="uploadAllData.interfaceBag_G7" :operation-type="operationType" column-title="接口开发包" />
                </td>
                <td rowspan="49">
                  <fileTd :upload-td-obj="uploadAllData.protocol_H7" :operation-type="operationType" column-title="协议条款" />
                </td>
              </tr>
              <tr>
                <td rowspan="3">质押式回购</td>
                <td>交易执行</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E8" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td>客户端报价数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E9" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td>交易行情</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E9_TRADINGQUATION" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td rowspan="3">标准债券远期</td>
                <td>交易执行</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E10" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td>交易行情</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E11" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td>授信管理</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E12" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td rowspan="3">标准利率互换</td>
                <td>交易执行</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E13" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td>交易行情</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E14" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td>授信管理</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E15" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td rowspan="3">利率互换</td>
                <td>交易执行</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E16" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td>交易行情</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E17" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td>授信管理</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E18" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td>同业存款</td>
                <td>交易执行</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E19" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td rowspan="2">
                  <fileTd :upload-td-obj="uploadAllData.interfaceIdea_F19" :operation-type="operationType" column-title="开发指引" />
                </td>
                <td rowspan="2">
                  <fileTd :upload-td-obj="uploadAllData.interfaceBag_G19" :operation-type="operationType" column-title="接口开发包" />
                </td>
              </tr>
              <tr>
                <td>同业借款</td>
                <td>交易执行</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E20" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td rowspan="12">RDI</td>
                <td>现券买卖</td>
                <td>交易参考数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E21" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td rowspan="11">
                  <fileTd :upload-td-obj="uploadAllData.interfaceIdea_F21" :operation-type="operationType" column-title="开发指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceBag_G21" :operation-type="operationType" column-title="接口开发包" />
                </td>
              </tr>
              <tr>
                <td>质押式回购</td>
                <td>交易参考数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E22" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceBag_G22" :operation-type="operationType" column-title="接口开发包" />
                </td>
              </tr>
              <tr>
                <td>利率互换期权</td>
                <td>交易参考数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E23" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceBag_G23" :operation-type="operationType" column-title="接口开发包" />
                </td>
              </tr>
              <tr>
                <td>标准债券远期</td>
                <td>交易参考数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E24" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceBag_G24" :operation-type="operationType" column-title="接口开发包" />
                </td>
              </tr>
              <tr>
                <td>标准利率互换</td>
                <td>交易参考数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E25" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceBag_G25" :operation-type="operationType" column-title="接口开发包" />
                </td>
              </tr>
              <tr>
                <td>利率互换</td>
                <td>交易参考数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E26" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceBag_G26" :operation-type="operationType" column-title="接口开发包" />
                </td>
              </tr>
              <tr>
                <td>债券借贷</td>
                <td>交易参考数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E27" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceBag_G27" :operation-type="operationType" column-title="接口开发包" />
                </td>
              </tr>
              <tr>
                <td>同业存单</td>
                <td>交易参考数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E28" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceBag_G28" :operation-type="operationType" column-title="接口开发包" />
                </td>
              </tr>
              <tr>
                <td>预发行</td>
                <td>交易参考数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E29" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceBag_G29" :operation-type="operationType" column-title="接口开发包" />
                </td>
              </tr>
              <tr>
                <td>同业存款</td>
                <td>交易参考数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E30" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceBag_G30" :operation-type="operationType" column-title="接口开发包" />
                </td>
              </tr>
              <tr>
                <td>本币基础信息</td>
                <td>交易参考数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E31" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceBag_G31" :operation-type="operationType" column-title="接口开发包" />
                </td>
              </tr>
              <tr>
                <td>同业存单</td>
                <td>交易参考数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E32" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceIdea_F32" :operation-type="operationType" column-title="开发指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceBag_G32" :operation-type="operationType" column-title="接口开发包" />
                </td>
              </tr>
              <tr>
                <td rowspan="24">CSTP</td>
                <td>现券买卖</td>
                <td>成交数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E33" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td rowspan="21">
                  <fileTd :upload-td-obj="uploadAllData.interfaceIdea_F33" :operation-type="operationType" column-title="开发指引" />
                </td>
                <td rowspan="22">
                  <fileTd :upload-td-obj="uploadAllData.interfaceBag_G33" :operation-type="operationType" column-title="接口开发包" />
                </td>
              </tr>
              <tr>
                <td>质押式回购</td>
                <td>成交数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E34" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td>买断式回购</td>
                <td>成交数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E35" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td>同业拆借</td>
                <td>成交数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E36" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td>利率互换期权</td>
                <td>成交数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E37" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td>利率上下限期权</td>
                <td>成交数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E38" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td>标准债券远期</td>
                <td>成交数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E39" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td>债券远期</td>
                <td>成交数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E40" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td>标准利率互换</td>
                <td>成交数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E41" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td>利率互换</td>
                <td>成交数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E42" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td>债券借贷</td>
                <td>成交数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E43" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td>同业存单</td>
                <td>发行结果</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E44" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td>预发行</td>
                <td>成交数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E45" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td>同业存款</td>
                <td>成交数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E46" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td>同业借款</td>
                <td>成交数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E47" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td>债券指数产品</td>
                <td>认申赎信息</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E48" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td>远期利率协议</td>
                <td>成交数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E49" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td>信用缓释凭证</td>
                <td>成交数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E50" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td>信用违约互换</td>
                <td>成交数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E51" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td>做市支持成交</td>
                <td>成交数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E52" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td>常备借贷便利</td>
                <td>成交数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E53" :operation-type="operationType" column-title="业务指引" />
                </td>
              </tr>
              <tr>
                <td>本币计费</td>
                <td>本币缴款通知单</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E54" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceIdea_F54" :operation-type="operationType" column-title="开发指引" />
                </td>
              </tr>
              <tr>
                <td>外汇市场</td>
                <td>成交数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E55" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceIdea_F55" :operation-type="operationType" column-title="开发指引" />
                </td>
                <td rowspan="2">
                  <fileTd :upload-td-obj="uploadAllData.interfaceBag_G55" :operation-type="operationType" column-title="接口开发包" />
                </td>
                <td rowspan="2">
                  <fileTd :upload-td-obj="uploadAllData.protocol_H55" :operation-type="operationType" column-title="协议条款" />
                </td>
              </tr>
              <tr>
                <td>银企外汇（即远掉）</td>
                <td>成交数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E55_TRADE_BANKCOMPANY" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceIdea_F55_TRADE_BANKCOMPANY" :operation-type="operationType" column-title="开发指引" />
                </td>
              </tr>
              <tr>
                <td rowspan="13">市场机构CMDS</td>
                <td>现券买卖</td>
                <td>交易行情</td>
                <td rowspan="13">
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E56" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td rowspan="11">
                  <fileTd :upload-td-obj="uploadAllData.interfaceIdea_F56" :operation-type="operationType" column-title="开发指引" />
                </td>
                <td rowspan="13">
                  <fileTd :upload-td-obj="uploadAllData.interfaceBag_G56" :operation-type="operationType" column-title="接口开发包" />
                </td>
                <td rowspan="14">
                  <fileTd :upload-td-obj="uploadAllData.protocol_H56" :operation-type="operationType" column-title="协议条款" />
                </td>
              </tr>
              <tr>
                <td>质押式回购</td>
                <td>交易行情</td>
              </tr>
              <tr>
                <td>同业拆借</td>
                <td>交易行情</td>
              </tr>
              <tr>
                <td>利率互换期权</td>
                <td>交易行情</td>
              </tr>
              <tr>
                <td>利率上下限期权</td>
                <td>交易行情</td>
              </tr>
              <tr>
                <td>标准债券远期</td>
                <td>交易行情</td>
              </tr>
              <tr>
                <td>债券远期</td>
                <td>交易行情</td>
              </tr>
              <tr>
                <td>标准利率互换</td>
                <td>交易行情</td>
              </tr>
              <tr>
                <td>利率互换</td>
                <td>交易行情</td>
              </tr>
              <tr>
                <td>债券借贷</td>
                <td>交易行情</td>
              </tr>
              <tr>
                <td>远期利率协议</td>
                <td>交易行情</td>
              </tr>
              <tr>
                <td>本币信息产品</td>
                <td>信息产品</td>
                <td rowspan="2">
                  <fileTd :upload-td-obj="uploadAllData.interfaceIdea_F67" :operation-type="operationType" column-title="开发指引" />
                </td>
              </tr>
              <tr>
                <td>外汇市场</td>
                <td>交易行情</td>
              </tr>
              <tr>
                <td>CMDS Pro</td>
                <td>外汇市场</td>
                <td>交易行情</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E69" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceIdea_F69" :operation-type="operationType" column-title="开发指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceBag_G69" :operation-type="operationType" column-title="接口开发包" />
                </td>
              </tr>
              <tr>
                <td>RDI</td>
                <td>外汇市场</td>
                <td>交易参考数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E70" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceIdea_F70" :operation-type="operationType" column-title="开发指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceBag_G70" :operation-type="operationType" column-title="接口开发包" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.protocol_H70" :operation-type="operationType" column-title="协议条款" />
                </td>
              </tr>
              <tr>
                <td rowspan="5">交易确认接口</td>
                <td>外汇市场</td>
                <td>交易后业务</td>
                <td rowspan="11">
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E71" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td rowspan="10">
                  <fileTd :upload-td-obj="uploadAllData.interfaceIdea_F71" :operation-type="operationType" column-title="开发指引" />
                </td>
                <td rowspan="11">
                  <fileTd :upload-td-obj="uploadAllData.interfaceBag_G71" :operation-type="operationType" column-title="接口开发包" />
                </td>
                <td rowspan="11">
                  <fileTd :upload-td-obj="uploadAllData.protocol_H71" :operation-type="operationType" column-title="协议条款" />
                </td>
              </tr>
              <tr>
                <td>利率互换期权</td>
                <td>交易后业务</td>
              </tr>
              <tr>
                <td>利率上下限期权</td>
                <td>交易后业务</td>
              </tr>
              <tr>
                <td>利率互换</td>
                <td>交易后业务</td>
              </tr>
              <tr>
                <td>信用违约互换</td>
                <td>交易后业务</td>
              </tr>
              <tr>
                <td rowspan="2">交易冲销接口</td>
                <td>外汇市场</td>
                <td>交易后业务</td>
              </tr>
              <tr>
                <td>利率互换</td>
                <td>交易后业务</td>
              </tr>
              <tr>
                <td>结算服务接口</td>
                <td>外汇市场</td>
                <td>交易后业务</td>
              </tr>
              <tr>
                <td>组合对账接口</td>
                <td>利率互换</td>
                <td>交易后业务</td>
              </tr>
              <tr>
                <td rowspan="2">交易核对接口</td>
                <td>外汇市场</td>
                <td>交易后业务</td>
                <!-- <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceBag_G80" :operation-type="operationType" column-title="接口开发包" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.protocol_H80" :operation-type="operationType" column-title="协议条款" />
                </td> -->
              </tr>
              <tr>
                <td>现券买卖</td>
                <td>交易后业务</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceIdea_F81" :operation-type="operationType" column-title="开发指引" />
                </td>
                <!-- <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceBag_G81" :operation-type="operationType" column-title="接口开发包" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.protocol_H81" :operation-type="operationType" column-title="协议条款" />
                </td> -->
              </tr>
              <tr>
                <td>货债接口</td>
                <td>债券指数产品</td>
                <td>发行</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E82" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceIdea_F82" :operation-type="operationType" column-title="开发指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceBag_G82" :operation-type="operationType" column-title="接口开发包" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.protocol_H82" :operation-type="operationType" column-title="协议条款" />
                </td>
              </tr>
              <tr>
                <td rowspan="4">iDeal接口</td>
                <td>外汇市场</td>
                <td>聊天记录下行接口</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E83" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td rowspan="2">
                  <fileTd :upload-td-obj="uploadAllData.interfaceIdea_F83" :operation-type="operationType" column-title="开发指引" />
                </td>
                <td rowspan="4">
                  <fileTd :upload-td-obj="uploadAllData.interfaceBag_G83" :operation-type="operationType" column-title="接口开发包" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.protocol_H83" :operation-type="operationType" column-title="协议条款" />
                </td>
              </tr>
              <tr>
                <td rowspan="3">本币市场</td>
                <td>聊天记录下行接口</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E84" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.protocol_H84" :operation-type="operationType" column-title="协议条款" />
                </td>
              </tr>
              <tr>
                <td>一级承分销</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E85" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceIdea_F85" :operation-type="operationType" column-title="开发指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.protocol_H85" :operation-type="operationType" column-title="协议条款" />
                </td>
              </tr>
              <tr>
                <td>前端插件</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E86" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceIdea_F86" :operation-type="operationType" column-title="开发指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.protocol_H86" :operation-type="operationType" column-title="协议条款" />
                </td>
              </tr>
              <tr>
                <td rowspan="6">备案接口</td>
                <td rowspan="2">现券买卖</td>
                <td>成交数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E87" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td rowspan="6">
                  <fileTd :upload-td-obj="uploadAllData.interfaceIdea_F87" :operation-type="operationType" column-title="开发指引" />
                </td>
                <td rowspan="6">
                  <fileTd :upload-td-obj="uploadAllData.interfaceBag_G87" :operation-type="operationType" column-title="接口开发包" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.protocol_H87" :operation-type="operationType" column-title="协议条款" />
                </td>
              </tr>
              <tr>
                <td>报价数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E88" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.protocol_H88" :operation-type="operationType" column-title="协议条款" />
                </td>
              </tr>
              <tr>
                <td rowspan="2">质押式回购</td>
                <td>成交数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E89" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.protocol_H89" :operation-type="operationType" column-title="协议条款" />
                </td>
              </tr>
              <tr>
                <td>报价数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E90" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.protocol_H90" :operation-type="operationType" column-title="协议条款" />
                </td>
              </tr>
              <tr>
                <td rowspan="2">买断式回购</td>
                <td>成交数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E91" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.protocol_H91" :operation-type="operationType" column-title="协议条款" />
                </td>
              </tr>
              <tr>
                <td>报价数据</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E92" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.protocol_H92" :operation-type="operationType" column-title="协议条款" />
                </td>
              </tr>
              <tr>
                <td>大额备案接口</td>
                <td>大额存单</td>
                <td>发行备案</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E93" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceIdea_F93" :operation-type="operationType" column-title="开发指引" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.interfaceBag_G93" :operation-type="operationType" column-title="接口开发包" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.protocol_H93" :operation-type="operationType" column-title="协议条款" />
                </td>
              </tr>
              <tr>
                <!-- <td rowspan="3">信息商</td> -->
                <td rowspan="3">信息商CMDS</td>
                <td>CNEX</td>
                <td>信息订阅</td>
                <td rowspan="3">
                  <fileTd :upload-td-obj="uploadAllData.businessIdea_E94" :operation-type="operationType" column-title="业务指引" />
                </td>
                <td rowspan="3">
                  <fileTd :upload-td-obj="uploadAllData.interfaceIdea_F94" :operation-type="operationType" column-title="开发指引" />
                </td>
                <td rowspan="3">
                  <fileTd :upload-td-obj="uploadAllData.interfaceBag_G94" :operation-type="operationType" column-title="接口开发包" />
                </td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.protocol_H94" :operation-type="operationType" column-title="协议条款" />
                </td>
              </tr>
              <tr>
                <td>市场数据</td>
                <td>信息订阅</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.protocol_H95" :operation-type="operationType" column-title="协议条款" />
                </td>
              </tr>
              <tr>
                <td>外汇深度行情</td>
                <td>信息订阅</td>
                <td>
                  <fileTd :upload-td-obj="uploadAllData.protocol_H96" :operation-type="operationType" column-title="协议条款" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <!-- 上传/更新 -->
    <el-dialog
      :title="uploadDialogObj.title"
      width="658px"
      :visible.sync="uploadDialogObj.visible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      destroy-on-close
      @close="closeUploadDialog"
    >
      <el-upload
        ref="upload"
        action="fakeaction"
        :accept="accept"
        :file-list="fileList"
        :auto-upload="false"
        :on-change="onChangeFile"
        :on-remove="onRemoveFile"
      >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <div slot="tip" class="el-upload__tip">只能上传{{ accept }}文件</div>
      </el-upload>
      <div slot="footer" class="text-center">
        <span slot="footer">
          <el-button
            type="primary"
            class="button-primary"
            @click="uploadFile"
          >
            确定
          </el-button>
          <el-button
            class="button-default"
            @click="closeUploadDialog"
          >
            取消
          </el-button>
        </span>
      </div>
    </el-dialog>
    <!-- 版本记录 -->
    <el-dialog
      :title="versionRecordDialogObj.title"
      width="1000px"
      :visible.sync="versionRecordDialogObj.visible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      destroy-on-close
      @close="versionRecordDialogObj.visible = false"
    >
      <el-table
        :data="versionRecordDialogObj.list"
        style="width: 100%"
        fit
        stripe
        border
        highlight-current-row
        header-row-class-name="header-row-th"
        :header-row-style="{ height: '42px' }"
        :header-cell-style="{ padding: 0 }"
        :row-style="{ height: '42px' }"
        :cell-style="{ padding: 0 }"
      >
        <el-table-column
          prop="type"
          label="文件分类"
          width="100"
        />
        <el-table-column
          show-overflow-tooltip
          prop="name"
          label="文件名称"
          min-width="150"
        />
        <el-table-column
          prop="createTs"
          label="更新时间"
          width="155"
        />
        <el-table-column
          prop="versionCt"
          label="版本号"
          width="70"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.versionCt | versionCtFilter }}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="80"
        >
          <template slot-scope="scope">
            <el-button type="text" @click="onOperateVersionRecord('download', scope.row)">
              <i class="el-icon-download" />
            </el-button>
            <el-button type="text" @click="onOperateVersionRecord('delete', scope.row)">
              <i class="el-icon-delete" />
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 更新日志 -->
    <el-dialog
      :title="updateLogDialogObj.title"
      width="1000px"
      :visible.sync="updateLogDialogObj.visible"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      destroy-on-close
      @close="updateLogDialogObj.visible = false"
    >
      <el-table
        :data="updateLogDialogObj.list"
        style="width: 100%"
        fit
        stripe
        border
        highlight-current-row
        header-row-class-name="header-row-th"
        :header-row-style="{ height: '42px' }"
        :header-cell-style="{ padding: 0 }"
        :row-style="{ height: '42px' }"
        :cell-style="{ padding: 0 }"
      >
        <el-table-column
          prop="fileType"
          label="文件分类"
          width="120"
        />
        <el-table-column
          show-overflow-tooltip
          prop="fileName"
          label="文件名称"
          min-width="200"
        />
        <el-table-column
          prop="opTs"
          label="操作时间"
          width="155"
        />
        <!-- <el-table-column
          prop="opAccount"
          label="操作用户"
          width="120"
        /> -->
        <el-table-column
          prop="action"
          label="操作"
          width="60"
        />
        <!-- <el-table-column
          prop="versionCt"
          label="版本号"
          width="70"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.versionCt | versionCtFilter }}</span>
          </template>
        </el-table-column> -->
      </el-table>
      <div class="pagination">
        <el-pagination
          :current-page="updateLogDialogObj.currentPage"
          :page-size="updateLogDialogObj.pageSize"
          :page-sizes="updateLogDialogObj.pagesizes"
          :total="updateLogDialogObj.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import childTab from './childTab'
import fileTd from './fileTd'
import uploadResourceApi from '@/api/uploadResourceApi'
import { downloadAuthen } from '@/api/file'
import { downloadFile } from '@/utils/index'
export default {
  name: 'Child',
  components: {
    // childTab,
    fileTd
  },
  filters: {
    versionCtFilter(val) {
      return (val / 10).toFixed(1)
    }
  },
  props: {
    operationType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      autoHeight: 100,
      minusHeight: 0,
      resourcesData: [],
      keywords: '',
      isShowResources: false,
      uploadAllList: [],
      uploadDialogObj: {
        visible: false,
        title: '',
        type: '',
        row: {}
      },
      fileList: [],
      accept: '.PDF,.ZIP,.RAR',
      versionRecordDialogObj: {
        visible: false,
        title: '版本记录',
        row: {},
        list: []
      },
      updateLogDialogObj: {
        visible: false,
        title: '更新日志',
        currentPage: 1,
        pageSize: 20,
        pagesizes: [20, 50, 100],
        total: 0,
        list: []
      },
      widthObj: {
        width1: 0,
        width2: 0,
        width3: 0,
        width4: 0,
        width5: 0,
        width6: 0,
        width7: 0,
        width8: 0,
        header: 0
      },
      lateShow: true
    }
  },
  computed: {
    uploadAllData() {
      const obj = {}
      this.uploadAllList.forEach(e => {
        obj[e.key] = e
      })
      console.log(obj)
      return obj
    },
    overviewObj() {
      return this.uploadAllData.overview_I2 ? this.uploadAllData.overview_I2 : { key: 'overview_I2', val: [] }
    }
  },
  created() {
    console.log(this.operationType)
    this.getResourcesKeyList()
  },
  mounted() {
    if (this.operationType === 'download') {
      this.minusHeight = 420
    } else if (this.operationType === 'upload') {
      this.minusHeight = 480
    }
    this.$nextTick(() => {
      this.autoHeight = this.$root.$el.clientHeight - this.minusHeight
      this.autoHeight = this.autoHeight > this.minusHeight ? this.autoHeight : this.minusHeight
      window.onresize = () => {
        this.autoHeight = this.$root.$el.clientHeight - this.minusHeight
        this.autoHeight = this.autoHeight > this.minusHeight ? this.autoHeight : this.minusHeight
      }
    })
  },
  methods: {
    getResourcesKeyList() {
      const that = this
      uploadResourceApi.getResourcesKeyList().then(res => {
        if (res.code === 'ACK') {
          this.uploadAllList = res.data.map(e => {
            e.val = e.val ? e.val : []
            return e
          })
          this.isShowResources = true
          this.$nextTick(() => {
            // const width1 = that.$refs.td1.clientWidth
            // const width2 = this.$refs.td2.clientWidth
            // const width3 = this.$refs.td3.clientWidth
            // const width4 = this.$refs.td4.clientWidth
            // const width5 = this.$refs.td5.clientWidth
            // const width6 = this.$refs.td6.clientWidth
            // const width7 = this.$refs.td7.clientWidth
            // const width8 = this.$refs.td8.clientWidth
            // const header = this.$refs.tableBody.clientWidth + 20
            // this.widthObj = {
            //   width1: width1,
            //   width2: width2,
            //   width3: width3,
            //   width4: width4,
            //   width5: width5,
            //   width6: width6,
            //   width7: width7,
            //   width8: width8,
            //   header: header
            // }
            // setTimeout(() => {
            //   const tableHeaderContainer = that.$refs.tableHeaderContainer
            //   const tableBodyContainer = that.$refs.tableBodyContainer
            //   tableBodyContainer.addEventListener('scroll', function(e) {
            //     console.log(e)
            //     tableHeaderContainer.scrollLeft = tableBodyContainer.scrollLeft
            //   })
            //   this.lateShow = false
            // }, 50)
          })
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    closeUploadDialog() {
      this.$refs.upload.clearFiles()
      this.uploadDialogObj.visible = false
      this.fileList = []
    },
    showUploadDialog(type, row) {
      console.log(type, row)
      this.uploadDialogObj.visible = true
      this.uploadDialogObj.type = type
      if (type === 'add') {
        this.uploadDialogObj.title = `上传指引总述`
      } else if (type === 'edit') {
        this.uploadDialogObj.row = row
        this.uploadDialogObj.title = `更新指引总述-${row.name}`
      }
    },
    showVersionRecord(item) {
      this.versionRecordDialogObj.visible = true
      this.versionRecordDialogObj.row = item
      this.keyHistoryInfo()
    },
    showUpdateLog() {
      this.updateLogDialogObj.visible = true
      this.onSearchUpdateLog()
    },
    onSearchUpdateLog() {
      const params = {
        page: this.updateLogDialogObj.currentPage,
        pageSize: this.updateLogDialogObj.pageSize
      }
      uploadResourceApi.getAllUpdateLog(params).then(res => {
        if (res.code === 'ACK') {
          this.updateLogDialogObj.list = res.data.list
          this.updateLogDialogObj.total = res.data.totalRecord
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    handleSizeChange(val) {
      this.updateLogDialogObj.pageSize = val
      this.updateLogDialogObj.currentPage = 1
      this.onSearchUpdateLog()
    },
    handleCurrentChange(val) {
      this.updateLogDialogObj.currentPage = val
      this.onSearchUpdateLog()
    },
    keyHistoryInfo() {
      const params = {
        id: this.versionRecordDialogObj.row.id
      }
      uploadResourceApi.keyHistoryInfo(params).then(res => {
        if (res.code === 'ACK') {
          this.versionRecordDialogObj.list = res.data
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      })
    },
    onOperateVersionRecord(type, row) {
      console.log(type, row)
      if (type === 'download') {
        console.log(type, row)
        const fileObj = {
          name: row.name,
          fileId: row.fileId
        }
        this.downloadFile(fileObj)
      } else if (type === 'delete') {
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          const params = {
            id: row.id
          }
          uploadResourceApi.deleteResourcesFile(params).then(res => {
            if (res.code === 'ACK') {
              this.$message({
                message: `文件删除成功`,
                type: 'success'
              })
              this.getResourcesKeyList()
              this.versionRecordDialogObj.list = res.data
              if (res.data.length === 0) {
                this.versionRecordDialogObj.visible = false
              }
            } else {
              this.$message({
                message: res.message,
                type: 'error'
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    downloadLastVersionFile(item) {
      const fileObj = {
        name: item.name,
        fileId: item.fileId
      }
      this.downloadFile(fileObj)
    },
    downloadFile(fileObj) {
      console.log(fileObj)
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      downloadAuthen(fileObj.fileId).then(res => {
        loading.close()
        downloadFile(res.data, fileObj.name)
        this.$message({
          type: 'success',
          message: '下载成功!'
        })
      }).catch(() => {
        loading.close()
        this.$message({
          type: 'error',
          message: '下载失败!'
        })
      })
    },
    onChangeFile(file, fileList) {
      console.log(file, fileList)
      // this.fileList = fileList
      // 当多余一个的时候替换文件
      if (fileList.length > 1) {
        fileList.splice(0, 1)
      }
      this.fileList = fileList
    },
    onRemoveFile(file, fileList) {
      console.log(file, fileList)
      this.fileList = []
    },
    uploadFile() {
      console.log(this.fileList)
      if (this.fileList.length === 0) {
        this.$message({
          message: `请选择一个文件`,
          type: 'info'
        })
        return
      }
      const isLt100M = this.fileList[0].size / 1024 / 1024 <= 100
      if (!isLt100M) {
        this.$message({
          message: `上传失败，文件大小超过100MB`,
          type: 'info'
        })
        return
      }
      const file = this.fileList[0]
      const form = new FormData()
      form.append('file', file.raw)

      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      if (this.uploadDialogObj.type === 'add') {
        const params = {
          data: form,
          params: {
            key: this.overviewObj.key
          }
        }
        uploadResourceApi.uploadResourcesFile(params).then(res => {
          if (res.code === 'ACK') {
            this.$message({
              message: `文件上传成功`,
              type: 'success'
            })
            this.getResourcesKeyList()
            this.closeUploadDialog()
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
          loading.close()
        }).catch(() => {
          loading.close()
        })
      } else if (this.uploadDialogObj.type === 'edit') {
        const params = {
          data: form,
          params: {
            id: this.uploadDialogObj.row.id
          }
        }
        uploadResourceApi.updateResourcesFile(params).then(res => {
          if (res.code === 'ACK') {
            this.$message({
              message: `文件更新成功`,
              type: 'success'
            })
            this.getResourcesKeyList()
            this.closeUploadDialog()
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
          loading.close()
        }).catch(() => {
          loading.close()
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .resources-top {
    display: flex;
    justify-content: space-between;
    &-right {
      display: flex;
      align-items: flex-end;
      padding-bottom: 10px;
      &-download {
        color: gray;
      }
      &-upload {
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }
  }
  .table-tree-head-resources {
    th {
      padding: 10px;
      white-space: nowrap;
    }
  }
  .el-table__header-wrapper {
    width: auto;
    overflow: initial;
    &::-webkit-scrollbar{
      width:0;
      height: 0;
    }
    scrollbar-width: none; /* firefox */
    -ms-overflow-style: none; /* IE 10+ */
  }
  .table-tree-body {
    td {
      padding: 10px;
      vertical-align: top;
      // white-space: nowrap;
    }
    .el-table__header-wrapper tbody td, .el-table__footer-wrapper tbody td {
      background-color: #fff;
    }
  }
  .el-table::before {
    display: none;
  }
  .el-table--group::after, .el-table--border::after {
    display: none;
  }
</style>
