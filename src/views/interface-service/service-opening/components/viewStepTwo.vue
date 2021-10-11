<template>
  <div>
    <div class="form-body">
      <el-form
        ref="stepTwoForm"
        :model="stepTwoObj"
        :rules="rules"
        :disabled="isView"
        label-position="top"
      >
        <div class="form-body-content mb20">
          <div class="form-title">
            <span>{{ $t('serviceOpening.institutionInfo') }}</span>
          </div>
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item :label="$t('serviceOpening.institutionFullName')" prop="instnName">
                <el-input v-model="stepTwoObj.instnName" maxlength="200" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('serviceOpening.institutionAddress')" prop="address">
                <el-input v-model="stepTwoObj.address" maxlength="60" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('serviceOpening.postcode')" prop="postCode">
                <el-input v-model="stepTwoObj.postCode" clearable />
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <el-collapse v-model="activeNames">
          <el-collapse-item v-for="(item, index) in stepTwoObj.contactList" :key="item.nodeId" :name="index">
            <template slot="title">
              <div class="collapse-header">
                <span v-if="institutionType === '00'">{{ $t('serviceOpening.interface') }}：{{ item.nodeNameEn }}</span>
                <span v-if="institutionType === '10'">{{ $t('serviceOpening.informationVendorContact') }}</span>
                <div v-if="!isView" class="collapse-header-btn">
                  <el-button
                    v-if="institutionType === '00'"
                    class="ml10"
                    type="primary"
                    size="mini"
                    @click.stop="copyContact(index)"
                  >{{ $t('common.button.copy') }}</el-button>
                  <el-button
                    v-if="institutionType === '00'"
                    :disabled="pasteDisabled"
                    type="primary"
                    size="mini"
                    @click.stop="pasteContact(index)"
                  >{{ $t('common.button.paste') }}</el-button>
                  <el-button
                    size="mini"
                    @click.stop="clearForm(item, index)"
                  >
                    <svg-icon icon-class="empty" />{{ $t('common.button.oneClickClear') }}
                  </el-button>
                </div>
              </div>
            </template>
            <div v-for="(itemin, indexin) in item.businessContact" :key="itemin.indexin">
              <h3>{{ $t('serviceOpening.businessContract') }}</h3>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item :label="$t('serviceOpening.name')" :prop="'contactList.' + index + '.businessContact.' + indexin + '.userName'" :rules="rules.userName">
                    <el-input v-model="itemin.userName" maxlength="100" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('serviceOpening.department')" :prop="'contactList.' + index + '.businessContact.' + indexin + '.depart'" :rules="rules.depart">
                    <el-input v-model="itemin.depart" maxlength="100" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('serviceOpening.position')" :prop="'contactList.' + index + '.businessContact.' + indexin + '.position'" :rules="rules.position">
                    <el-input v-model="itemin.position" maxlength="100" clearable />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item :label="$t('serviceOpening.telephone')" :prop="'contactList.' + index + '.businessContact.' + indexin + '.telNo'" :rules="rules.telNo">
                    <el-input v-model="itemin.telNo" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('serviceOpening.mobilePhone')" :prop="'contactList.' + index + '.businessContact.' + indexin + '.phoneNo'" :rules="rules.phoneNo">
                    <el-input v-model="itemin.phoneNo" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('serviceOpening.fax')" :prop="'contactList.' + index + '.businessContact.' + indexin + '.faxNo'" :rules="rules.faxNo">
                    <el-input v-model="itemin.faxNo" maxlength="30" clearable />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item :label="$t('serviceOpening.email')" :prop="'contactList.' + index + '.businessContact.' + indexin + '.email'" :rules="rules.email">
                    <el-input v-model="itemin.email" v-limitBytes="500" clearable />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div v-for="(itemin, indexin) in item.spareBusinessContact" :key="itemin.indexin">
              <h3 class="reserve-title">
                <span>{{ $t('serviceOpening.standbyBusinessContract') }} {{ indexin + 1 }}</span>
                <i v-if="!isView" class="el-icon-remove reserve-title-icon" @click="onOperateContactMarket('delete', 'business', index, indexin)" />
              </h3>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item :label="$t('serviceOpening.name')" :prop="'contactList.' + index + '.spareBusinessContact.' + indexin + '.userName'" :rules="rules.userName">
                    <el-input v-model="itemin.userName" maxlength="100" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('serviceOpening.department')" :prop="'contactList.' + index + '.spareBusinessContact.' + indexin + '.depart'" :rules="rules.depart">
                    <el-input v-model="itemin.depart" maxlength="100" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('serviceOpening.position')" :prop="'contactList.' + index + '.spareBusinessContact.' + indexin + '.position'" :rules="rules.position">
                    <el-input v-model="itemin.position" maxlength="100" clearable />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item :label="$t('serviceOpening.telephone')" :prop="'contactList.' + index + '.spareBusinessContact.' + indexin + '.telNo'" :rules="rules.telNo">
                    <el-input v-model="itemin.telNo" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('serviceOpening.mobilePhone')" :prop="'contactList.' + index + '.spareBusinessContact.' + indexin + '.phoneNo'" :rules="rules.phoneNo">
                    <el-input v-model="itemin.phoneNo" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('serviceOpening.fax')" :prop="'contactList.' + index + '.spareBusinessContact.' + indexin + '.faxNo'" :rules="rules.faxNo">
                    <el-input v-model="itemin.faxNo" maxlength="30" clearable />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item :label="$t('serviceOpening.email')" :prop="'contactList.' + index + '.spareBusinessContact.' + indexin + '.email'" :rules="rules.email">
                    <el-input v-model="itemin.email" v-limitBytes="500" clearable />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <i v-if="!isView" class="el-icon-circle-plus reserve-title-icon" @click="onOperateContactMarket('add', 'business', index)" />
            <div v-for="(itemin, indexin) in item.technologyContact" :key="itemin.indexin">
              <h3>{{ $t('serviceOpening.technicalContrct') }}</h3>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item :label="$t('serviceOpening.name')" :prop="'contactList.' + index + '.technologyContact.' + indexin + '.userName'" :rules="rules.userName">
                    <el-input v-model="itemin.userName" maxlength="100" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('serviceOpening.department')" :prop="'contactList.' + index + '.technologyContact.' + indexin + '.depart'" :rules="rules.depart">
                    <el-input v-model="itemin.depart" maxlength="100" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('serviceOpening.position')" :prop="'contactList.' + index + '.technologyContact.' + indexin + '.position'" :rules="rules.position">
                    <el-input v-model="itemin.position" maxlength="100" clearable />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item :label="$t('serviceOpening.telephone')" :prop="'contactList.' + index + '.technologyContact.' + indexin + '.telNo'" :rules="rules.telNo">
                    <el-input v-model="itemin.telNo" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('serviceOpening.mobilePhone')" :prop="'contactList.' + index + '.technologyContact.' + indexin + '.phoneNo'" :rules="rules.phoneNo">
                    <el-input v-model="itemin.phoneNo" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('serviceOpening.fax')" :prop="'contactList.' + index + '.technologyContact.' + indexin + '.faxNo'" :rules="rules.faxNo">
                    <el-input v-model="itemin.faxNo" maxlength="30" clearable />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item :label="$t('serviceOpening.email')" :prop="'contactList.' + index + '.technologyContact.' + indexin + '.email'" :rules="rules.email">
                    <el-input v-model="itemin.email" v-limitBytes="500" clearable />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <div v-for="(itemin, indexin) in item.spareTechnologyContact" :key="itemin.indexin">
              <h3 class="reserve-title">
                <span>{{ $t('serviceOpening.standbyTechnicalContract') }} {{ indexin + 1 }}</span>
                <i v-if="!isView" class="el-icon-remove reserve-title-icon" @click="onOperateContactMarket('delete', 'technology', index, indexin)" />
              </h3>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item :label="$t('serviceOpening.name')" :prop="'contactList.' + index + '.spareTechnologyContact.' + indexin + '.userName'" :rules="rules.userName">
                    <el-input v-model="itemin.userName" maxlength="100" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('serviceOpening.department')" :prop="'contactList.' + index + '.spareTechnologyContact.' + indexin + '.depart'" :rules="rules.depart">
                    <el-input v-model="itemin.depart" maxlength="100" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('serviceOpening.position')" :prop="'contactList.' + index + '.spareTechnologyContact.' + indexin + '.position'" :rules="rules.position">
                    <el-input v-model="itemin.position" maxlength="100" clearable />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item :label="$t('serviceOpening.telephone')" :prop="'contactList.' + index + '.spareTechnologyContact.' + indexin + '.telNo'" :rules="rules.telNo">
                    <el-input v-model="itemin.telNo" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('serviceOpening.mobilePhone')" :prop="'contactList.' + index + '.spareTechnologyContact.' + indexin + '.phoneNo'" :rules="rules.phoneNo">
                    <el-input v-model="itemin.phoneNo" clearable />
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('serviceOpening.fax')" :prop="'contactList.' + index + '.spareTechnologyContact.' + indexin + '.faxNo'" :rules="rules.faxNo">
                    <el-input v-model="itemin.faxNo" maxlength="30" clearable />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :span="8">
                  <el-form-item :label="$t('serviceOpening.email')" :prop="'contactList.' + index + '.spareTechnologyContact.' + indexin + '.email'" :rules="rules.email">
                    <el-input v-model="itemin.email" v-limitBytes="500" clearable />
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
            <i v-if="!isView" class="el-icon-circle-plus reserve-title-icon" @click="onOperateContactMarket('add', 'technology', index)" />
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </div>
    <div class="btn-container">
      <el-button v-preventReClick @click="prevStep">{{ $t('common.button.lastPage') }}</el-button>
      <el-button v-preventReClick type="primary" @click="nextStep">{{ $t('common.button.nextPage') }}</el-button>
      <el-button @click="cancel">{{ $t('common.button.cancel') }}</el-button>
    </div>
  </div>
</template>

<script>
import { saveBasicInfo } from '@/api/interface-service/serviceOpeningApi'
import { validEmail, validTel, validPhone, validPostCode } from '@/utils/validate'
export default {
  props: {
    institutionType: {
      type: String,
      default: ''
    },
    operationType: {
      type: String,
      default: 'add'
    }
  },
  data() {
    const validateEmpty = [
      { required: true, message: this.$t('common.validate.required'), trigger: 'blur' }
    ]
    const validatePostCode = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('common.validate.required')))
      } else {
        if (!validPostCode(value)) {
          callback(new Error(this.$t('common.validate.postcode')))
        }
        callback()
      }
    }
    const validateTelNo = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('common.validate.required')))
      } else {
        if (!validTel(value)) {
          callback(new Error(this.$t('common.validate.telephone')))
        }
        callback()
      }
    }
    const validatePhoneNo = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('common.validate.required')))
      } else {
        if (!validPhone(value)) {
          callback(new Error(this.$t('common.validate.mobilePhone')))
        }
        callback()
      }
    }
    const validateEmail = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('common.validate.required')))
      } else {
        if (!validEmail(value)) {
          callback(new Error(this.$t('common.validate.email')))
        }
        callback()
      }
    }
    return {
      activeNames: [0],
      rules: {
        instnName: validateEmpty,
        address: validateEmpty,
        postCode: [
          { required: true, message: this.$t('common.validate.required'), trigger: 'blur' },
          { validator: validatePostCode, trigger: 'blur' }
        ],
        userName: validateEmpty,
        depart: validateEmpty,
        position: validateEmpty,
        telNo: [
          { required: true, message: this.$t('common.validate.required'), trigger: 'blur' },
          { validator: validateTelNo, trigger: 'blur' }
        ],
        phoneNo: [
          { required: true, message: this.$t('common.validate.required'), trigger: 'blur' },
          { validator: validatePhoneNo, trigger: 'blur' }
        ],
        faxNo: validateEmpty,
        email: [
          { required: true, message: this.$t('common.validate.required'), trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ]
      },
      copyObj: null,
      pasteDisabled: true
    }
  },
  computed: {
    stepTwoObj: {
      // getter
      get: function() {
        return this.$store.state.service.serviceOpeningObj.stepTwoObj
      },
      // setter
      set: function(newValue) {

      }
    },
    isView() {
      return this.operationType === 'detail' || this.operationType === 'audit'
    }
  },
  created() {
  },
  methods: {
    cancel() {
      this.$emit('cancel')
    },
    prevStep() {
      this.$emit('changeSteps', 1)
    },
    nextStep() {
      if (this.isView) {
        this.$emit('changeSteps', 3)
      } else {
        this.$refs.stepTwoForm.validate((valid, prop) => {
          if (valid) {
            this.stepTwoObj.contactList.map(contact => {
              contact.spareBusinessContact.map((e, index) => {
                e.spareContactNo = index
                e.nodeId = contact.nodeId
                e.applyOrdNo = this.stepTwoObj.applyOrdNo
                e.institutionType = this.institutionType
                e.contactType = '50'
                return e
              })
              contact.spareTechnologyContact.map((e, index) => {
                e.spareContactNo = index
                e.nodeId = contact.nodeId
                e.applyOrdNo = this.stepTwoObj.applyOrdNo
                e.institutionType = this.institutionType
                e.contactType = '40'
                return e
              })
              contact.businessContact.map((e, index) => {
                e.spareContactNo = index
                e.nodeId = contact.nodeId
                e.applyOrdNo = this.stepTwoObj.applyOrdNo
                e.institutionType = this.institutionType
                e.contactType = '10'
                return e
              })
              contact.technologyContact.map((e, index) => {
                e.spareContactNo = index
                e.nodeId = contact.nodeId
                e.applyOrdNo = this.stepTwoObj.applyOrdNo
                e.institutionType = this.institutionType
                e.contactType = '20'
                return e
              })
              return contact
            })
            saveBasicInfo(this.stepTwoObj).then(res => {
              console.log(res)
              if (res.code !== 'ACK') {
                this.$message({
                  type: 'error',
                  message: res.message
                })
                return
              }
              this.$emit('changeSteps', 3)
            })
          } else {
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
    /**
     * @method: 市场机构-备用联系人增删
     * @param {operateType} 'add': 新增, 'delete': 删除
     * @param {type} 'business': 业务联系人, 'technology': 技术联系人
     * @return {无}
     */
    onOperateContactMarket(operateType, type, index, indexin) {
      console.log(operateType, type, index, indexin)
      if (operateType === 'add') {
        const addObj = {
          userName: null,
          depart: null,
          position: null,
          telNo: null,
          phoneNo: null,
          faxNo: null,
          email: null
        }
        if (type === 'business') {
          this.stepTwoObj.contactList[index].spareBusinessContact.push(addObj)
        } else if (type === 'technology') {
          this.stepTwoObj.contactList[index].spareTechnologyContact.push(addObj)
        }
      } else if (operateType === 'delete') {
        if (type === 'business') {
          this.stepTwoObj.contactList[index].spareBusinessContact.splice(indexin, 1)
        } else if (type === 'technology') {
          this.stepTwoObj.contactList[index].spareTechnologyContact.splice(indexin, 1)
        }
      }
    },
    // 复制
    copyContact(index) {
      this.copyObj = this.stepTwoObj.contactList[index]
      this.pasteDisabled = false
    },
    // 粘贴
    pasteContact(index) {
      const businessContact = []
      this.copyObj.businessContact.forEach(e => {
        const obj = {
          userName: e.userName,
          depart: e.depart,
          position: e.position,
          telNo: e.telNo,
          phoneNo: e.phoneNo,
          faxNo: e.faxNo,
          email: e.email
        }
        businessContact.push(obj)
      })
      const technologyContact = []
      this.copyObj.technologyContact.forEach(e => {
        const obj = {
          userName: e.userName,
          depart: e.depart,
          position: e.position,
          telNo: e.telNo,
          phoneNo: e.phoneNo,
          faxNo: e.faxNo,
          email: e.email
        }
        technologyContact.push(obj)
      })
      const spareBusinessContact = []
      this.copyObj.spareBusinessContact.forEach(e => {
        const obj = {
          userName: e.userName,
          depart: e.depart,
          position: e.position,
          telNo: e.telNo,
          phoneNo: e.phoneNo,
          faxNo: e.faxNo,
          email: e.email
        }
        spareBusinessContact.push(obj)
      })
      const spareTechnologyContact = []
      this.copyObj.spareTechnologyContact.forEach(e => {
        const obj = {
          userName: e.userName,
          depart: e.depart,
          position: e.position,
          telNo: e.telNo,
          phoneNo: e.phoneNo,
          faxNo: e.faxNo,
          email: e.email
        }
        spareTechnologyContact.push(obj)
      })
      this.stepTwoObj.contactList[index].businessContact = businessContact
      this.stepTwoObj.contactList[index].technologyContact = technologyContact
      this.stepTwoObj.contactList[index].spareBusinessContact = spareBusinessContact
      this.stepTwoObj.contactList[index].spareTechnologyContact = spareTechnologyContact
    },
    clearForm(item, index) {
      console.log(item, index)
      const defaultForm = {
        businessContact: [
          {
            userName: null,
            depart: null,
            position: null,
            telNo: null,
            phoneNo: null,
            faxNo: null,
            email: null
          }
        ],
        technologyContact: [
          {
            userName: null,
            depart: null,
            position: null,
            telNo: null,
            phoneNo: null,
            faxNo: null,
            email: null
          }
        ],
        spareBusinessContact: [],
        spareTechnologyContact: []
      }
      Object.assign(item, defaultForm)
      this.$nextTick(() => {
        for (const key in defaultForm) {
          if (key === 'businessContact' || key === 'technologyContact') {
            for (const keyin in defaultForm[key][0]) {
              this.$refs.stepTwoForm.clearValidate(`contactList.${index}.${key}.0.${keyin}`)
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.contact-row {
  margin-top: 20px;
  &-title {
    color: #303030;
    font-size: 18px;
    font-weight: bold;
    &>span {
      border-left: 3px solid #2C76D1;
      padding-left: 10px;
    }
  }
  &-btn {
    display: flex;
  }
  ::v-deep .el-collapse-item__header {
    min-height: 48px;
    height: auto;
  }
}
.icon-style {
  font-size: 20px;
  color: #2196f3;
  cursor: pointer;
  margin-left: 10px;
}
.reserve-title {
  display: flex;
  align-items: center;
  &-icon {
    @extend .icon-style;
  }
}
</style>
