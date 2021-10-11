<template>
  <div>
    <div class="form-body">
      <el-form
        ref="stepTwoForm"
        :model="stepTwoObj"
        :rules="rules"
        label-position="top"
        label-width="100px"
      >
        <div class="form-body-content mb20">
          <div class="form-title">
            <span>{{ $t('interfaceOnline.institutionInfo') }}</span>
          </div>
          <el-form-item :label="$t('interfaceOnline.institutionFullName')">
            <el-input v-model="stepTwoObj.instName" disabled />
          </el-form-item>
        </div>
        <el-collapse v-model="activeNames">
          <el-collapse-item
            v-for="(item, index) in stepTwoObj.onlineBasicInfoList"
            :key="item.nodeId"
            :name="index"
          >
            <template slot="title">
              <div class="collapse-header">
                <span v-if="institutionType === '00'">{{ $t('interfaceOnline.interface') }}：{{ item.nodeNameEn }}</span>
                <span v-if="institutionType === '10'">{{ $t('interfaceOnline.informationVendorContact') }}</span>
                <el-button
                  v-if="!isView"
                  size="mini"
                  @click.stop="clearForm(item, index)"
                >
                  <svg-icon icon-class="empty" />{{ $t('common.button.oneClickClear') }}
                </el-button>
              </div>
            </template>
            <div v-if="item.permChangeFlg === 'YES' && item.serviceOnlineApiInfo.length > 0 && operationType !== 'audit'">
              <fieldset v-for="apiInfo in item.serviceOnlineApiInfo" :key="apiInfo.id">
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item :label="$t('interfaceOnline.fourDigitCode')">
                      <el-input
                        v-model="apiInfo.fourBitCode"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('interfaceOnline.sixDigitCode')">
                      <el-input
                        v-model="apiInfo.sixBitCode"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('interfaceOnline.twentyOnedigitCode')">
                      <el-input
                        v-model="apiInfo.twentyOneBitCode"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row v-for="(apiAct, apiActIndex) in apiInfo.apiActList" :key="apiAct.id" :gutter="20">
                  <el-col :span="12">
                    <el-form-item :label="$t('interfaceOnline.apiAccountName')">
                      <template slot="label">
                        <span v-if="apiAct.purpose" class="purpose-text">{{ apiAct.purpose }} </span>
                        <span>{{ $t('interfaceOnline.apiAccountName') }}</span>
                      </template>
                      <el-input
                        v-model="apiAct.apiActName"
                        disabled
                      />
                    </el-form-item>
                  </el-col>
                  <el-col v-if="apiActIndex === 0" :span="12">
                    <el-form-item :label="$t('interfaceOnline.apiPassword')">
                      <el-input
                        v-model="apiInfo.apiPwd"
                        disabled
                        :placeholder="$t('interfaceOnline.placeholder.passwordNote')"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item :label="$t('interfaceOnline.ipAdreessFirewallInfo')">
                  <el-table
                    :data="apiInfo.firewallList"
                    fit
                    stripe
                    border
                    highlight-current-row
                  >
                    <el-table-column
                      show-overflow-tooltip
                      prop="serverAddress"
                      :label="$t('interfaceOnline.tradingCenterServerAddress')"
                      min-width="300"
                    />
                    <el-table-column
                      show-overflow-tooltip
                      prop="servicePort"
                      :label="$t('interfaceOnline.servicePort')"
                      min-width="100"
                    />
                    <el-table-column
                      show-overflow-tooltip
                      prop="remark"
                      :label="$t('interfaceOnline.remark')"
                      min-width="200"
                    />
                  </el-table>
                </el-form-item>
              </fieldset>
            </div>
            <div>
              <h3>{{ $t('interfaceOnline.emergencyTechnicalContract') }}</h3>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item
                    :label="$t('interfaceOnline.name')"
                    :prop="'onlineBasicInfoList.' + index + '.urgencyContact.userName'"
                    :rules="rules.userName"
                  >
                    <el-input
                      v-model="item.urgencyContact.userName"
                      maxlength="100"
                      :disabled="isView"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    :label="$t('interfaceOnline.department')"
                    :prop="'onlineBasicInfoList.' + index + '.urgencyContact.depart'"
                    :rules="rules.depart"
                  >
                    <el-input
                      v-model="item.urgencyContact.depart"
                      maxlength="100"
                      :disabled="isView"
                      clearable
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item
                    :label="$t('interfaceOnline.position')"
                    :prop="'onlineBasicInfoList.' + index + '.urgencyContact.position'"
                    :rules="rules.position"
                  >
                    <el-input
                      v-model="item.urgencyContact.position"
                      maxlength="100"
                      :disabled="isView"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    :label="$t('interfaceOnline.telephone')"
                    :prop="'onlineBasicInfoList.' + index + '.urgencyContact.telNo'"
                    :rules="rules.telNo"
                  >
                    <el-input
                      v-model="item.urgencyContact.telNo"
                      :disabled="isView"
                      clearable
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item
                    :label="$t('interfaceOnline.mobilePhone')"
                    :prop="'onlineBasicInfoList.' + index + '.urgencyContact.phoneNo'"
                    :rules="rules.phoneNo"
                  >
                    <el-input
                      v-model="item.urgencyContact.phoneNo"
                      :disabled="isView"
                      clearable
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    :label="$t('interfaceOnline.fax')"
                    :prop="'onlineBasicInfoList.' + index + '.urgencyContact.faxNo'"
                    :rules="rules.faxNo"
                  >
                    <el-input
                      v-model="item.urgencyContact.faxNo"
                      maxlength="30"
                      :disabled="isView"
                      clearable
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item
                :label="$t('interfaceOnline.email')"
                :prop="'onlineBasicInfoList.' + index + '.urgencyContact.email'"
                :rules="rules.email"
              >
                <el-input
                  v-model="item.urgencyContact.email"
                  v-limitBytes="500"
                  :disabled="isView"
                  clearable
                />
              </el-form-item>
            </div>
            <div>
              <h3>{{ $t('interfaceOnline.otherInfo') }}</h3>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item
                    :label="$t('interfaceOnline.goLiveDate')"
                    :prop="'onlineBasicInfoList.' + index + '.onlineTs'"
                    :rules="rules.onlineTs"
                  >
                    <template slot="label">
                      <el-tooltip placement="bottom-start">
                        <div slot="content">{{ $t('interfaceOnline.goLiveDateTooltip') }}</div>
                        <span>{{ $t('interfaceOnline.goLiveDate') }}<i class="el-icon-question" /></span>
                      </el-tooltip>
                    </template>
                    <el-date-picker
                      v-model="item.onlineTs"
                      placeholder=""
                      value-format="yyyy-MM-dd"
                      style="width: 100%;"
                      :picker-options="pickerOptions"
                      :disabled="isView"
                    />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    :label="$t('interfaceOnline.internalVersionOfInstitution')"
                    :prop="'onlineBasicInfoList.' + index + '.innerInterfaceSystemVersion'"
                    :rules="rules.innerInterfaceSystemVersion"
                  >
                    <el-input
                      v-model="item.innerInterfaceSystemVersion"
                      maxlength="200"
                      :disabled="isView"
                      clearable
                    />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item
                :label="$t('interfaceOnline.clientIPAddress')"
                :prop="'onlineBasicInfoList.' + index + '.ipAddress'"
                :rules="rules.ipAddress"
              >
                <template slot="label">
                  <el-tooltip placement="bottom-start">
                    <div slot="content">
                      {{ $t('interfaceOnline.clientIPAddressTooltip') }}
                    </div>
                    <span>{{ $t('interfaceOnline.clientIPAddress') }}<i class="el-icon-question" /></span>
                  </el-tooltip>
                </template>
                <el-input
                  v-model="item.ipAddress"
                  :disabled="isView"
                  maxlength="200"
                  clearable
                />
              </el-form-item>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item
                    :label="$t('interfaceOnline.isLeasedLine')"
                    :prop="'onlineBasicInfoList.' + index + '.hasHotLine'"
                    :rules="rules.hasHotLine"
                  >
                    <el-radio-group
                      v-model="item.hasHotLine"
                      :disabled="isView"
                    >
                      <el-radio label="1">
                        {{ $t('interfaceOnline.yes') }}
                      </el-radio>
                      <el-radio label="0">
                        {{ $t('interfaceOnline.no') }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    :label="$t('interfaceOnline.isBackupLeasedLine')"
                    :prop="'onlineBasicInfoList.' + index + '.hasBackupLine'"
                    :rules="rules.hasBackupLine"
                  >
                    <el-radio-group
                      v-model="item.hasBackupLine"
                      :disabled="isView"
                    >
                      <el-radio label="1">
                        {{ $t('interfaceOnline.yes') }}
                      </el-radio>
                      <el-radio label="0">
                        {{ $t('interfaceOnline.no') }}
                      </el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div v-if="item.hasHotLine == 1">
              <h3>{{ $t('interfaceOnline.basicInfoOfLeasedLine') }}</h3>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item
                    :label="$t('interfaceOnline.is')"
                    :prop="'onlineBasicInfoList.' + index + '.hotLineOperator'"
                    :rules="rules.hotLineOperator"
                  >
                    <el-radio-group v-model="item.hotLineOperator" :disabled="isView">
                      <el-radio label="00">{{ $t('interfaceOnline.telecom') }}</el-radio>
                      <el-radio label="10">{{ $t('interfaceOnline.unicom') }}</el-radio>
                      <el-radio label="20">{{ $t('interfaceOnline.mobile') }}</el-radio>
                      <el-radio label="90">{{ $t('interfaceOnline.other') }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    :label="$t('interfaceOnline.leasedLineCode')"
                    :prop="'onlineBasicInfoList.' + index + '.hotLineNo'"
                    :rules="rules.hotLineNo"
                  >
                    <el-input v-model="item.hotLineNo" maxlength="50" :disabled="isView" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item
                    :label="$t('interfaceOnline.routerIPAddress')"
                    :prop="'onlineBasicInfoList.' + index + '.hotLineIpAddress'"
                    :rules="rules.hotLineIpAddress"
                  >
                    <el-input v-model="item.hotLineIpAddress" :disabled="isView" maxlength="200" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    :label="$t('interfaceOnline.bandwidth')"
                    :prop="'onlineBasicInfoList.' + index + '.hotLineBandwidth'"
                    :rules="rules.hotLineBandwidth"
                  >
                    <el-input v-model="item.hotLineBandwidth" maxlength="20" :disabled="isView" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div v-if="item.hasBackupLine == 1">
              <h3>{{ $t('interfaceOnline.backupLeasedLineBasicInfo') }}</h3>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item
                    :label="$t('interfaceOnline.is')"
                    :prop="'onlineBasicInfoList.' + index + '.backupLineOperator'"
                    :rules="rules.backupLineOperator"
                  >
                    <el-radio-group v-model="item.backupLineOperator" :disabled="isView">
                      <el-radio label="00">{{ $t('interfaceOnline.telecom') }}</el-radio>
                      <el-radio label="10">{{ $t('interfaceOnline.unicom') }}</el-radio>
                      <el-radio label="20">{{ $t('interfaceOnline.mobile') }}</el-radio>
                      <el-radio label="90">{{ $t('interfaceOnline.other') }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    :label="$t('interfaceOnline.backupLeasedLineCode')"
                    :prop="'onlineBasicInfoList.' + index + '.backupLineNo'"
                    :rules="rules.backupLineNo"
                  >
                    <el-input v-model="item.backupLineNo" maxlength="50" :disabled="isView" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item
                    :label="$t('interfaceOnline.routerIPAddress')"
                    :prop="'onlineBasicInfoList.' + index + '.backupLineIpAddress'"
                    :rules="rules.backupLineIpAddress"
                  >
                    <el-input v-model="item.backupLineIpAddress" :disabled="isView" maxlength="200" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item
                    :label="$t('interfaceOnline.bandwidth')"
                    :prop="'onlineBasicInfoList.' + index + '.backupLineBandwidth'"
                    :rules="rules.backupLineBandwidth"
                  >
                    <el-input v-model="item.backupLineBandwidth" maxlength="20" :disabled="isView" />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <el-row :gutter="20">
              <el-col v-if="item.agreementTermDtoList.length > 0" :span="12">
                <el-form-item
                  :prop="'onlineBasicInfoList.' + index + '.onlineFiles.length'"
                  :rules="(item.signAgreementFlg === 'NO' && !isView) ? rules.onlineFiles : rules.allowEmpty"
                >
                  <template slot="label">
                    {{ $t('interfaceOnline.uploadAgreementTerms') }}
                    <el-tooltip placement="bottom-start">
                      <div slot="content">
                        {{ $t('interfaceOnline.uploadAgreementTermsTooltip') }}
                      </div>
                      <i class="el-icon-question" style="color: #303133;" />
                    </el-tooltip>
                  </template>
                  <div class="file-row">
                    <el-checkbox
                      v-model="item.signAgreementFlg"
                      true-label="YES"
                      false-label="NO"
                      :disabled="isView"
                    >
                      {{ $t('interfaceOnline.alreadySigned') }}
                      <span
                        v-if="item.agreementTermDtoList.length === 1"
                        class="link-type"
                        style="text-decoration: underline;"
                        @click.prevent="downloadFile(item.agreementTermDtoList[0])"
                      >{{ $t('interfaceOnline.agreementTerm') }}</span>
                      <el-dropdown v-else>
                        <span
                          class="link-type"
                          style="text-decoration: underline;"
                        >
                          {{ $t('interfaceOnline.agreementTerm') }}<i class="el-icon-arrow-down el-icon--right" />
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item v-for="agreement in item.agreementTermDtoList" :key="agreement.fileId">
                            <div @click="downloadFile(agreement)">{{ agreement.name }}</div>
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-checkbox>
                  </div>
                  <div>
                    <el-upload
                      ref="upload"
                      :class="{'custom-upload-hide': isView}"
                      class="file-row-upload"
                      action="fakeaction"
                      :accept="acceptAggrement"
                      :file-list="item.onlineFiles"
                      :http-request="param => uploadFile(param, item, 'onlineFiles')"
                      :on-preview="onPreview"
                      :on-remove="(file, fileList) =>onRemoveFile(file, fileList, item, 'onlineFiles')"
                      :on-error="onError"
                      :disabled="isView"
                    >
                      <el-button
                        v-if="!isView"
                        slot="trigger"
                        size="mini"
                        type="primary"
                      >
                        {{ $t('interfaceOnline.agreementTermsUpload') }}
                      </el-button>
                      <el-tooltip v-if="!isView" placement="bottom-start">
                        <div slot="content">
                          {{ $t('interfaceOnline.agreementTermsUploadTooltip') }}
                        </div>
                        <i class="el-icon-question" />
                      </el-tooltip>
                    </el-upload>
                    <el-input v-model="item.onlineFiles.length" style="display: none;" />
                  </div>
                </el-form-item>
              </el-col>
              <el-col v-if="item.digitalCertificateDtoList.length > 0" :span="12">
                <el-form-item
                  :prop="'onlineBasicInfoList.' + index + '.onlineFiles2.length'"
                  :rules="(item.signDigitalFlg === 'NO' && !isView) ? rules.onlineFiles2 : rules.allowEmpty"
                >
                  <template slot="label">
                    {{ $t('interfaceOnline.applicationTemplateOfDigitalCertificate') }}
                    <el-tooltip placement="bottom-start">
                      <div slot="content">
                        {{ $t('interfaceOnline.applicationTemplateOfDigitalCertificateTooltip') }}
                      </div>
                      <i class="el-icon-question" style="color: #303133;" />
                    </el-tooltip>
                  </template>
                  <div class="file-row">
                    <el-checkbox
                      v-model="item.signDigitalFlg"
                      true-label="YES"
                      false-label="NO"
                      :disabled="isView"
                    >
                      {{ $t('interfaceOnline.alreadyApplied') }}
                      <span
                        v-if="item.digitalCertificateDtoList.length === 1"
                        class="link-type"
                        style="text-decoration: underline;"
                        @click.prevent="downloadFile(item.digitalCertificateDtoList[0])"
                      >{{ $t('interfaceOnline.applicationTemplateOfDigitalCertificate') }}</span>
                      <el-dropdown v-else>
                        <span
                          class="link-type"
                          style="text-decoration: underline;"
                        >
                          {{ $t('interfaceOnline.applicationTemplateOfDigitalCertificate') }}<i class="el-icon-arrow-down el-icon--right" />
                        </span>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item v-for="agreement in item.digitalCertificateDtoList" :key="agreement.fileId">
                            <div @click="downloadFile(agreement)">{{ agreement.name }}</div>
                          </el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
                    </el-checkbox>
                  </div>
                  <div>
                    <el-upload
                      ref="upload"
                      :class="{'custom-upload-hide': isView}"
                      class="file-row-upload"
                      action="fakeaction"
                      :accept="acceptAggrement"
                      :file-list="item.onlineFiles2"
                      :http-request="param => uploadFile(param, item, 'onlineFiles2')"
                      :on-preview="onPreview"
                      :on-remove="(file, fileList) =>onRemoveFile(file, fileList, item, 'onlineFiles2')"
                      :on-error="onError"
                      :disabled="isView"
                    >
                      <div>
                        <el-button
                          v-if="!isView"
                          slot="trigger"
                          size="mini"
                          type="primary"
                          style="white-space: normal;"
                        >
                          {{ $t('interfaceOnline.uploadAppTempOfDigitalCert') }}
                        </el-button>
                        <el-tooltip v-if="!isView" placement="bottom-start">
                          <div slot="content">
                            {{ $t('interfaceOnline.uploadAppTempOfDigitalCertTooltip') }}
                          </div>
                          <i class="el-icon-question" />
                        </el-tooltip>
                      </div>
                    </el-upload>
                    <el-input v-model="item.onlineFiles2.length" style="display: none;" />
                  </div>
                </el-form-item>
              </el-col>
            </el-row>
            <div v-if="(item.permChangeFlg === 'NO' || (item.permChangeFlg === 'YES' && operationType === 'audit')) && item.serviceOnlineApiInfo.length > 0">
              <h3>
                {{ $t('interfaceOnline.fieldServiceFeedback') }}
                <el-tooltip :content="$t('interfaceOnline.fieldServiceFeedbackTooltip')">
                  <el-button
                    v-if="operationType === 'audit' && !item.serviceOnlineApiInfo[0].apiActList[0].purpose && item.permChangeFlg === 'NO'"
                    type="primary"
                    size="mini"
                    class="ml10"
                    icon="el-icon-plus"
                    @click="addAct(item.serviceOnlineApiInfo[0].apiActList)"
                  >{{ $t('interfaceOnline.addAPIAccount') }}</el-button>
                </el-tooltip>
              </h3>
              <fieldset v-for="(apiInfo, apiIndex) in item.serviceOnlineApiInfo" :key="apiInfo.id">
                <el-row :gutter="20">
                  <el-col :span="8">
                    <el-form-item :label="$t('interfaceOnline.fourDigitCode')">
                      <el-input
                        v-model="apiInfo.fourBitCode"
                        clearable
                        maxlength="2000"
                        :disabled="operationType === 'detail'"
                      />
                      <div v-if="isGripUser" class="red-color">
                        {{ $t('interfaceOnline.businessDeptEnter') }}
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('interfaceOnline.sixDigitCode')">
                      <el-input
                        v-model="apiInfo.sixBitCode"
                        clearable
                        maxlength="2000"
                        :disabled="operationType === 'detail'"
                      />
                      <div v-if="isGripUser" class="red-color">
                        {{ $t('interfaceOnline.businessDeptEnter') }}
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('interfaceOnline.twentyOnedigitCode')">
                      <el-input
                        v-model="apiInfo.twentyOneBitCode"
                        clearable
                        maxlength="2000"
                        :disabled="operationType === 'detail'"
                      />
                      <div v-if="isGripUser" class="red-color">
                        {{ $t('interfaceOnline.businessDeptEnter') }}
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row v-for="(apiAct, apiActIndex) in apiInfo.apiActList" :key="apiActIndex" :gutter="20">
                  <el-col :span="12">
                    <el-form-item
                      :label="$t('interfaceOnline.apiAccountName')"
                      label-width="100px"
                      :prop="'onlineBasicInfoList.' + index + '.serviceOnlineApiInfo.' + apiIndex + '.apiActList.' + apiActIndex + '.apiActName'"
                      :rules="apiAct.rdiFlag === 'NO' ? null : rules.apiAccountName"
                    >
                      <template slot="label">
                        <span v-if="apiAct.purpose" class="purpose-text">{{ apiAct.purpose }} </span>
                        <span>{{ $t('interfaceOnline.apiAccountName') }}</span>
                      </template>
                      <el-input
                        v-model.trim="apiAct.apiActName"
                        :disabled="operationType === 'detail' || item.permChangeFlg === 'YES'"
                        maxlength="100"
                        clearable
                      />
                      <div v-if="isGripUser" class="red-color">
                        {{ $t('interfaceOnline.businessDeptEnter') }}
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col v-if="apiActIndex === 0" :span="12">
                    <el-form-item :label="$t('interfaceOnline.apiPassword')">
                      <el-input
                        :placeholder="$t('interfaceOnline.passwordContactFeildService')"
                        disabled
                        clearable
                      />
                      <div v-if="isGripUser" class="red-color">
                        {{ $t('interfaceOnline.businessDeptEnter') }}
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col
                    v-if="operationType === 'audit' && apiActIndex !== 0 && !apiAct.purpose && item.permChangeFlg === 'NO'"
                    :span="4"
                  >
                    <el-button
                      style="margin-top: 40px;"
                      type="primary"
                      icon="el-icon-minus"
                      size="mini"
                      circle
                      @click="deleteAct(apiInfo.apiActList, apiActIndex)"
                    />
                  </el-col>
                </el-row>
                <el-form-item :label="$t('interfaceOnline.ipAdreessFirewallInfo')">
                  <el-table
                    :data="apiInfo.firewallList"
                    fit
                    stripe
                    border
                    highlight-current-row
                  >
                    <el-table-column
                      :label="$t('interfaceOnline.tradingCenterServerAddress')"
                      min-width="300"
                    >
                      <template slot-scope="scope">
                        <el-form-item
                          v-if="operationType === 'audit'"
                          label=""
                          label-width="0"
                          :prop="`onlineBasicInfoList.${index}.serviceOnlineApiInfo.${apiIndex}.firewallList.${scope.$index}.serverAddress`"
                          :rules="rules.blurRequired"
                        >
                          <el-input
                            v-model.trim="scope.row.serverAddress"
                            v-limitBytes="300"
                            :placeholder="$t('common.placeholder.required')"
                            clearable
                          />
                        </el-form-item>
                        <span v-else>{{ scope.row.serverAddress }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      :label="$t('interfaceOnline.servicePort')"
                      min-width="100"
                    >
                      <template slot-scope="scope">
                        <el-form-item
                          v-if="operationType === 'audit'"
                          label=""
                          label-width="0"
                          :prop="`onlineBasicInfoList.${index}.serviceOnlineApiInfo.${apiIndex}.firewallList.${scope.$index}.servicePort`"
                          :rules="rules.blurRequired"
                        >
                          <el-input
                            v-model.trim="scope.row.servicePort"
                            v-limitBytes="300"
                            :placeholder="$t('common.placeholder.required')"
                            clearable
                          />
                        </el-form-item>
                        <span v-else>{{ scope.row.servicePort }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      :label="$t('interfaceOnline.remark')"
                      min-width="200"
                    >
                      <template slot-scope="scope">
                        <el-form-item
                          v-if="operationType === 'audit'"
                          label=""
                          label-width="0"
                          :prop="`onlineBasicInfoList.${index}.serviceOnlineApiInfo.${apiIndex}.firewallList.${scope.$index}.remark`"
                          :rules="rules.blurRequired"
                        >
                          <el-input
                            v-model.trim="scope.row.remark"
                            v-limitBytes="300"
                            :placeholder="$t('common.placeholder.required')"
                            clearable
                          />
                        </el-form-item>
                        <span v-else>{{ scope.row.remark }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      v-if="operationType === 'audit'"
                      :label="$t('interfaceOnline.operation')"
                      align="center"
                      width="60"
                      fixed="right"
                    >
                      <template slot-scope="scope">
                        <el-button type="text" @click="deleteFirewall(apiInfo, scope.$index)"><svg-icon icon-class="delete" /></el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-button
                    v-if="operationType === 'audit'"
                    type="text"
                    @click="addFirewall(apiInfo)"
                  >
                    <svg-icon icon-class="add" />
                  </el-button>
                </el-form-item>
              </fieldset>
            </div>
          </el-collapse-item>
        </el-collapse>
        <div class="form-body-content mt20">
          <h3 class="h3-body">
            {{ $t('interfaceOnline.materialsUpload') }}
            <el-tooltip placement="bottom-start">
              <div slot="content">
                {{ $t('interfaceOnline.materialsUploadTooltip') }}
              </div>
              <i class="el-icon-question" />
            </el-tooltip>
          </h3>
          <div v-if="!isView" class="file-apply-download">
            {{ $t('common.button.download') }}
            <span
              class="link-type"
              style="text-decoration: underline;"
              @click="submit('00', true)"
            >{{ $t('interfaceOnline.onlineApplicationForm') }}</span>
            {{ $t('interfaceOnline.onlineApplicationForm2') }}
          </div>
          <el-form-item
            label=""
            label-width="0px"
            prop="onlineFileList.length"
            :rules="rules.onlineFileList"
          >
            <el-upload
              ref="upload"
              :class="{'custom-upload-hide': isView}"
              action="fakeaction"
              :accept="accept"
              :file-list="stepTwoObj.onlineFileList"
              :http-request="param => uploadFile(param, stepTwoObj, 'onlineFileList')"
              :on-preview="onPreview"
              :on-remove="(file, fileList) =>onRemoveFile(file, fileList, stepTwoObj, 'onlineFileList')"
              :on-error="onError"
              :disabled="isView"
            >
              <el-button
                v-if="!isView"
                slot="trigger"
                class="mt20"
                type="primary"
              >
                {{ $t('common.button.uploadFiles') }}
              </el-button>
            </el-upload>
            <el-input v-model="stepTwoObj.onlineFileList.length" style="display: none;" />
          </el-form-item>
          <div v-if="!isView" class="form-tip">
            <p>{{ $t('interfaceOnline.uploadNote1') }}</p>
            <p>{{ $t('interfaceOnline.uploadNote2') }}</p>
            <p>{{ $t('interfaceOnline.uploadNote3') }}</p>
            <p>{{ $t('interfaceOnline.uploadNote4') }}</p>
          </div>
        </div>
      </el-form>
    </div>
    <div class="btn-container">
      <el-button
        v-preventReClick
        @click="prevStep"
      >
        {{ $t('interfaceOnline.button.previousPage') }}
      </el-button>
      <el-button
        @click="cancel"
      >
        {{ $t('common.button.cancel') }}
      </el-button>
      <el-button
        v-if="!isView"
        v-preventReClick
        type="primary"
        @click="submit('20')"
      >
        {{ $t('interfaceOnline.button.saveApplicationForm') }}
      </el-button>
      <el-button
        v-if="!isView"
        v-preventReClick
        type="primary"
        @click="submit('10')"
      >
        {{ $t('common.button.submit') }}
      </el-button>
    </div>
  </div>
</template>

<script>
import { saveBaseInfo } from '@/api/interface-service/serviceOnlineApi'
import { uploadLogin, downloadAuthen } from '@/api/file'
import { getWorkDay } from '@/api/common'
import {
  validEmail,
  validTel,
  validPhone
  // validIP
} from '@/utils/validate'
import { downloadFile, isEmpty, parseTime } from '@/utils/index'
export default {
  inject: ['reload'],
  props: {
    parentType: {
      type: String,
      default: ''
    },
    operationType: {
      type: String,
      default: 'add'
    },
    serviceObj: {
      type: Object,
      default: () => {}
    },
    institutionType: {
      type: String,
      default: ''
    },
    isGripUser: {
      type: Boolean,
      default: false
    },
    isLastAuditUser: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const that = this
    const validateEmpty = [
      { required: true, message: this.$t('common.message.required'), trigger: 'blur' }
    ]
    const validateTelNo = (rule, value, callback) => {
      if (isEmpty(value)) {
        callback(new Error(this.$t('common.message.required')))
      } else {
        if (!validTel(value)) {
          callback(new Error(this.$t('common.validate.telephone')))
        }
        callback()
      }
    }
    const validatePhoneNo = (rule, value, callback) => {
      if (value) {
        if (!validPhone(value)) {
          callback(new Error(this.$t('common.validate.mobilePhone')))
        }
        callback()
      } else {
        callback(new Error(this.$t('common.message.required')))
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (value) {
        if (!validEmail(value)) {
          callback(new Error(this.$t('common.validate.email')))
        }
        callback()
      } else {
        callback(new Error(this.$t('common.message.required')))
      }
    }
    // const validateIP = (rule, value, callback) => {
    //   if (value) {
    //     // if (!validIP(value)) {
    //     //   callback(new Error('IP地址格式不正确'))
    //     // }
    //     callback()
    //   } else {
    //     callback(new Error(this.$t('common.message.required')))
    //   }
    // }
    const validateApiAccountName = (rule, value, callback) => {
      if (that.isLastAuditUser) {
        if (isEmpty(value)) {
          callback(new Error(this.$t('common.message.required')))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const validateApiTwentyOneBitCode = (rule, value, callback) => {
      if (that.isLastAuditUser) {
        if (isEmpty(value)) {
          callback(new Error(this.$t('common.message.required')))
        } else {
          if (value.length === 21) {
            callback()
          } else {
            callback(new Error(this.$t('common.message.required')))
          }
        }
      } else {
        callback()
      }
    }
    const validateFourBitCode = (rule, value, callback) => {
      if (that.isLastAuditUser) {
        if (isEmpty(value)) {
          callback(new Error(this.$t('interfaceOnline.message.atLeast21Digit')))
        } else {
          if (value.length === 4) {
            callback()
          } else {
            callback(new Error(this.$t('interfaceOnline.message.atLeast4Digit')))
          }
        }
      } else {
        callback()
      }
    }
    const validateSixBitCode = (rule, value, callback) => {
      if (that.isLastAuditUser) {
        if (isEmpty(value)) {
          callback(new Error(this.$t('common.message.required')))
        } else {
          if (value.length === 6) {
            callback()
          } else {
            callback(new Error(this.$t('interfaceOnline.message.atLeast6Digit')))
          }
        }
      } else {
        callback()
      }
    }
    const validateIsFieldNull2 = (rule, value, callback) => {
      if (value === 0) {
        callback(new Error(this.$t('common.message.required')))
      } else {
        callback()
      }
    }
    const validateIsFieldNull3 = (rule, value, callback) => {
      if (that.saveStatus === '10') {
        if (value === 0) {
          callback(new Error(this.$t('common.message.required')))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const validateOnlineTs = (rule, value, callback) => {
      console.log(value)
      const currentDay = parseTime(new Date().getTime(), '{yyyy}-{mm}-{dd}')
      const todayTimestamp = new Date(currentDay).getTime()
      const valueTimestamp = new Date(value).getTime()
      console.log(todayTimestamp, valueTimestamp)
      if (!that.isView) {
        if (isEmpty(value)) {
          callback(new Error(this.$t('common.message.required')))
        } else {
          if (valueTimestamp < todayTimestamp) {
            callback(new Error(this.$t('interfaceOnline.message.dateValidate')))
          } else {
            callback()
          }
        }
      } else {
        callback()
      }
    }
    return {
      activeNames: [0],
      accept: '.PDF,.pdf,.xls,.xlsx',
      acceptAggrement: '.PDF,.pdf',
      rules: {
        allowEmpty: [
          { required: false, message: this.$t('common.message.required'), trigger: ['blur', 'change'] }
        ],
        blurRequired: [
          { required: that.isLastAuditUser, message: this.$t('common.message.required'), trigger: 'blur' }
        ],
        userName: validateEmpty,
        depart: validateEmpty,
        position: validateEmpty,
        faxNo: validateEmpty,
        email: [{ required: true, validator: validateEmail, trigger: 'blur' }],
        phoneNo: [{ required: true, validator: validatePhoneNo, trigger: 'blur' }],
        telNo: [{ required: true, validator: validateTelNo, trigger: 'blur' }],
        onlineTs: [
          { required: true, validator: validateOnlineTs, trigger: 'change' }
        ],
        // ipAddress: [{ required: true, validator: validateIP, trigger: 'blur' }],
        ipAddress: validateEmpty,
        hasBackupLine: { required: true, message: this.$t('common.message.required'), trigger: 'change' },
        hasHotLine: { required: true, message: this.$t('common.message.required'), trigger: 'change' },
        innerInterfaceSystemVersion: validateEmpty,
        hotLineNo: validateEmpty,
        // hotLineIpAddress: [{ required: true, validator: validateIP, trigger: 'blur' }],
        hotLineIpAddress: validateEmpty,
        hotLineBandwidth: validateEmpty,
        hotLineOperator: { required: true, message: this.$t('common.message.required'), trigger: 'change' },
        backupLineOperator: { required: true, message: this.$t('common.message.required'), trigger: 'change' },
        backupLineNo: validateEmpty,
        backupLineBandwidth: validateEmpty,
        // backupLineIpAddress: [{ required: true, validator: validateIP, trigger: 'blur' }],
        backupLineIpAddress: validateEmpty,
        apiAccountName: [
          { required: true, validator: validateApiAccountName, trigger: 'blur' }
        ],
        twentyOneBitCode: [
          { required: true, validator: validateApiTwentyOneBitCode, trigger: 'blur' }
        ],
        fourBitCode: [
          { required: true, validator: validateFourBitCode, trigger: 'blur' }
        ],
        sixBitCode: [
          { required: true, validator: validateSixBitCode, trigger: 'blur' }
        ],
        permChangeFlg: validateEmpty,
        onlineFiles: [
          { required: true, validator: validateIsFieldNull2, trigger: 'change' }
        ],
        onlineFiles2: [
          { required: true, validator: validateIsFieldNull2, trigger: 'change' }
        ],
        onlineFileList: [
          { required: true, validator: validateIsFieldNull3, trigger: 'change' }
        ],
        signAgreementFlg: validateEmpty,
        signDigitalFlg: validateEmpty
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < (new Date(that.workDay).getTime() - 86400000)
        }
      },
      workDay: null,
      saveStatus: '00'
    }
  },
  computed: {
    applyOrdNo() {
      return this.$store.state.service.serviceOnlineObj.commonObj.applyOrdNo
    },
    stepTwoObj: {
      // getter
      get: function() {
        return this.$store.state.service.serviceOnlineObj.stepTwoObj
      },
      // setter
      set: function(newValue) {
        console.log(newValue)
      }
    },
    isView() {
      return this.operationType === 'detail' || this.operationType === 'audit'
    }
  },
  created() {
    console.log('接口上线第二步')
    this.getWorkDay()
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    prevStep() {
      if (!this.isView) {
        this.$refs.stepTwoForm.resetFields()
      }
      this.$emit('changeSteps', 1)
    },
    getWorkDay() {
      const params = {
        offset: 3
      }
      getWorkDay(params).then(res => {
        if (res.code === 'ACK') {
          this.workDay = res.data
        }
      })
    },
    deleteAct(apiActList, index) {
      console.log(apiActList, index)
      apiActList.splice(index, 1)
    },
    addAct(item) {
      console.log(item)
      item.push({
        apiActName: ''
      })
    },
    onPreview(file) {
      console.log('preview:' + file)
      const fileObj = {
        fileId: file.fileId,
        name: file.name
      }
      this.downloadFile(fileObj)
    },
    onRemoveFile(file, fileList, item, key) {
      console.log('remove:' + file, fileList)
      item[key] = fileList
    },
    onError(err, file, fileList) {
      console.log('error:' + err, file, fileList)
    },
    downloadFile(fileObj) {
      console.log(fileObj)
      if (!fileObj || !fileObj.fileId) return
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      downloadAuthen(fileObj.fileId).then(res => {
        downloadFile(res.data, fileObj.name, fileObj.type)
        this.$message({
          type: 'success',
          message: this.$t('interfaceOnline.message.downloadSuccess')
        })
      }).finally(() => {
        loading.close()
      })
    },
    uploadFile(param, item, key) {
      const file = param.file
      console.log(file)
      const fileNameArr = file.name.split('.')
      const fileType = fileNameArr[fileNameArr.length - 1]
      const accept = key.includes('onlineFiles') ? this.acceptAggrement : this.accept
      // 兼容ie，因为el-upload的accept不支持ie
      if (accept.indexOf(fileType) < 0) {
        this.$message.error(this.$t('interfaceOnline.message.fileTypeNotAccpeted'))
        param.onError()
        return
      }
      const isLt50M = file.size / 1024 / 1024 <= 50
      if (!isLt50M) {
        this.$message.error(this.$t('interfaceOnline.message.fileOversize'))
        param.onError()
        return
      }
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      const form = new FormData()
      form.append('file', file)
      uploadLogin(form).then(res => {
        console.log(res)
        loading.close()
        if (res.code === 'ACK') {
          this.$message({
            message: `${res.data.fileName}${this.$t('interfaceOnline.message.uploadSuccess')}`,
            type: 'success'
          })
          item[key].push({
            name: res.data.fileName,
            fileName: res.data.fileName,
            fileId: res.data.id
          })
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          })
        }
      }).catch(() => {
        loading.close()
        param.onError()
      })
    },
    submitOperate(type, printStatus) {
      const onlineBasicInfoList = JSON.parse(JSON.stringify(this.stepTwoObj.onlineBasicInfoList))
      const onlineFileList = JSON.parse(JSON.stringify(this.stepTwoObj.onlineFileList))
      const params = {
        status: type,
        onlineFileList: onlineFileList.map(e => {
          const obj = {
            fileName: e.fileName,
            fileId: e.fileId
          }
          return obj
        }),
        applyOrdNo: this.applyOrdNo,
        onlineBasicInfoList: onlineBasicInfoList.map(e => {
          e.agreementTermDtoList = e.agreementTermDtoList.map(file => {
            const obj = {
              fileName: file.fileName,
              fileId: file.fileId
            }
            return obj
          })
          e.digitalCertificateDtoList = e.digitalCertificateDtoList.map(file => {
            const obj = {
              fileName: file.fileName,
              fileId: file.fileId
            }
            return obj
          })
          e.onlineFiles = e.onlineFiles.map(file => {
            const obj = {
              fileName: file.fileName,
              fileId: file.fileId
            }
            return obj
          })
          e.onlineFiles2 = e.onlineFiles2.map(file => {
            const obj = {
              fileName: file.fileName,
              fileId: file.fileId
            }
            return obj
          })
          return e
        })
      }
      if (this.operationType === 'edit') {
        params.applyOrdNo = this.applyOrdNo
      }
      console.log(params)
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      saveBaseInfo(params).then(res => {
        loading.close()
        if (res.code === 'ACK') {
          if (!isEmpty(res.message)) {
            this.$message.success(res.message)
          }
          if (type === '10') {
            this.$router.push({
              name: 'MyService',
              params: {
                institutionType: this.institutionType,
                isCurrentByMe: true
              }
            })
          } else {
            if (printStatus) {
              const routeData = this.$router.resolve({
                name: 'serviceOnlinePrint',
                query: {
                  applyOrdNo: params.applyOrdNo,
                  institutionType: this.institutionType,
                  type: 'print'
                }
              })
              window.open(routeData.href, '_blank')
            }
          }
        } else {
          this.$message({
            type: 'error',
            message: res.message
          })
        }
      }).catch(() => {
        loading.close()
      })
    },
    // 提交
    submit(type, printStatus) {
      this.saveStatus = type
      if (type === '20') {
        this.$refs.stepTwoForm.clearValidate()
        this.submitOperate('00', printStatus)
      } else {
        this.$refs.stepTwoForm.validate((valid, prop) => {
          if (valid) {
            if (type === '00') {
              this.submitOperate(type, printStatus)
            } else {
              this.$confirm(this.$t('interfaceOnline.message.dataConfirm'), this.$t('common.message.tips'), {
                confirmButtonText: this.$t('common.button.confirm2'),
                cancelButtonText: this.$t('common.button.cancel'),
                type: 'warning'
              }).then(() => {
                this.submitOperate(type, printStatus)
              })
            }
          } else {
            if (type === '00' || type === '10') {
              if (printStatus) {
                this.$message({
                  message: this.$t('interfaceOnline.message.dataIncorrectNotice1'),
                  type: 'info'
                })
              } else {
                this.$message({
                  message: this.$t('interfaceOnline.message.dataIncorrectNotice2'),
                  type: 'info'
                })
              }
            } else {
              this.$message({
                message: this.$t('interfaceOnline.message.dataIncorrectNotice3'),
                type: 'info'
              })
            }
            const errArr = []
            for (var key in prop) {
              console.log(key)
              const index = key.split('.')[1]
              errArr.push(Number(index))
            }
            const activeNames = this.activeNames
            activeNames.push(...errArr)
            this.activeNames = [...new Set(activeNames)]
          }
        })
      }
    },
    clearForm(item, index) {
      console.log(item, index)
      const defaultForm = {
        urgencyContact: {
          userName: null,
          depart: null,
          position: null,
          telNo: null,
          phoneNo: null,
          faxNo: null,
          email: null
        },
        onlineTs: null,
        innerInterfaceSystemVersion: null,
        ipAddress: null,
        hasHotLine: null,
        hasBackupLine: null,
        hotLineOperator: null,
        hotLineNo: null,
        hotLineIpAddress: null,
        hotLineBandwidth: null,
        backupLineOperator: null,
        backupLineNo: null,
        backupLineIpAddress: null,
        backupLineBandwidth: null,
        signAgreementFlg: null,
        signDigitalFlg: null,
        onlineFiles: [],
        onlineFiles2: []
      }
      Object.assign(item, defaultForm)
      this.$nextTick(() => {
        for (const key in defaultForm) {
          this.$refs.stepTwoForm.clearValidate(`onlineBasicInfoList.${index}.${key}`)
          if (key === 'urgencyContact') {
            for (const keyin in defaultForm[key]) {
              this.$refs.stepTwoForm.clearValidate(`onlineBasicInfoList.${index}.${key}.${keyin}`)
            }
          }
        }
        this.$refs.stepTwoForm.clearValidate([
          `onlineBasicInfoList.${index}.onlineFiles.length`,
          `onlineBasicInfoList.${index}.onlineFiles2.length`
        ])
      })
    },
    addFirewall(apiInfo) {
      apiInfo.firewallList.push({
        serverAddress: '',
        servicePort: '',
        remark: ''
      })
    },
    deleteFirewall(apiInfo, index) {
      apiInfo.firewallList = apiInfo.firewallList.filter((e, i) => i !== index)
    }
  }
}
</script>

<style lang="scss" scoped>
.uploadBtn {
  display: inline;
  float: left;
}
.h3-body {
  &>span {
    color: rgba(234, 130, 145, 1);
    font-size: 12px;
  }
}
.purpose-text {
  font-weight: bold;
  color: #303133;
}
.file-row {
  display: flex;
}
.file-apply {
  &-download {
    color: #666666;
    font-size: 14px;
  }
}
fieldset {
  border: 1px solid #DFDFDF;
  margin-bottom: 10px;
}
</style>
