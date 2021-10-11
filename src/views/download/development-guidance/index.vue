<template>
  <div>
    <div class="main">
      <div class="body">
        <el-tabs
          v-model="activeName"
          class="tabs"
          type="card"
          @tab-click="handleClick"
        >
          <el-tab-pane label="指引总述" name="Guide">
            <GuideAnOverview />
          </el-tab-pane>
          <el-tab-pane label="市场机构" name="Market">
            <MarketInsitute />
          </el-tab-pane>
          <el-tab-pane label="信息商" name="IIQ">
            <Information />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import GuideAnOverview from './guide-anoverview'
import MarketInsitute from './market-institute'
import Information from './information'
export default {
  name: 'DevelopmentGuidance',
  components: {
    GuideAnOverview,
    MarketInsitute,
    Information
  },
  data() {
    return {
      activeName: 'Market' // 'Guide'
    }
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
    }
  }
}
</script>

<style lang="scss" scoped>
$mainWidth: 1220px;
.main {
  background-color: #e7edf5;
  width: $mainWidth;
  margin: 28px auto;
  height: 100%;

  .body {
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(223, 223, 223, 1);
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
    border-bottom: none;
    padding: 21px 25.5px 21px 19px;
    .tabs {
      ::v-deep.el-tabs__header {
        .el-tabs__nav {
          border-radius: 0;
          height: 41px;

          .el-tabs__item {
            color: #303030;
            font-size: 15px;

            &.is-active {
              border-top: 2px solid #2c76d1;
              font-weight: bold;
              color: #2c76d1;
            }
          }
        }
      }
    }
  }
}
</style>
