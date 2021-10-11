<template>
  <div>
    <div class="main">
      <div class="service">
        <div class="header">
          <div
            class="step-panel"
            :class="{'step-one': activeIndex === 1,
                     'step-two': activeIndex === 2}"
          >
            <Steps :steps-list="stepsList" :active-index="activeIndex" />
          </div>
        </div>
        <BasicInfo
          v-show="activeIndex === 1"
          @setFormData="setFormData"
          @changeActiveIndex="changeActiveIndex"
        />
        <ProblemSubmit
          v-show="!info && activeIndex === 2"
          :form-data="formData"
          @changeActiveIndex="changeActiveIndex"
        />
        <InfoProblemSubmit
          v-show="info && activeIndex === 2"
          :form-data="formData"
          @changeActiveIndex="changeActiveIndex"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Steps from '@/components/Steps'
import BasicInfo from './basic-info'
import ProblemSubmit from './problem-submit'
import InfoProblemSubmit from './info-problem-submit'

export default {
  name: 'Index',
  components: {
    BasicInfo,
    ProblemSubmit,
    InfoProblemSubmit,
    Steps
  },
  data() {
    return {
      stepsList: ['基础信息', '问题提交'],
      activeIndex: 1,
      info: true,
      formData: {}
    }
  },
  methods: {
    changeActiveIndex(index) {
      this.activeIndex = index
      window.scrollTo(0, 0)
    },
    setFormData(data) {
      this.formData = data
    }
  }
}
</script>

<style lang="scss" scoped>
$mainWidth: 1220px;
.main {
  display: flex;
  background-color: #e7edf5;
  flex-direction: column;
  width: $mainWidth;
  margin: 28px auto;
  height: 100%;
  .service {
    min-height:468px;
    background: #fff;
    border:1px solid rgba(223,223,223,1);
    box-shadow:0px 3px 6px rgba(0,0,0,0.06);
    .header {
      height:76px;
      background:rgba(250,251,253,1);
      border-bottom:1px solid rgba(234,237,242,1);
    }
  }
}
</style>
