<template>
  <div class="main">
    <Banner />
    <div class="main-body">
      <div class="main-body-content register-wrap">
        <Steps :steps-list="stepsList" :active-index="activeIndex" />
        <div>
          <StepOne v-show="activeIndex === 1" @changeSteps="changeSteps" />
          <StepTwo v-show="activeIndex === 2" @changeSteps="changeSteps" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Banner from '@/layout/components/banner'
import Steps from '@/components/Steps'
import StepOne from './components/stepOne'
import StepTwo from './components/stepTwo'
export default {
  name: 'Register',
  components: {
    Banner,
    Steps,
    StepOne,
    StepTwo
  },
  data() {
    return {
      stepsList: this.$t('register.stepsList'),
      activeIndex: 1
    }
  },
  methods: {
    changeSteps(index) {
      this.activeIndex = index
      window.scrollTo(0, 0)
    }
  }
}
</script>

<style lang="scss" scoped>
.register-wrap {
  position: relative;
  margin-top: -200px;
  z-index: 2;
}
</style>
