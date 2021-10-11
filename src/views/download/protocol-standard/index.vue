<template>
  <div>
    <div class="main">
      <div class="body">
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="协议字典" name="first">
            <ProtocolDictionary />
          </el-tab-pane>
          <el-tab-pane label="字典查询" name="second">
            <DictionaryLookup />
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import ProtocolDictionary from './compoments/protocolDictionary'
import DictionaryLookup from './compoments/dictionaryLookup'
export default {
  name: 'ProtocolStandard',
  components: {
    ProtocolDictionary,
    DictionaryLookup
  },
  data() {
    return {
      activeName: 'first'
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
    background-color: #E7EDF5;
    width: $mainWidth;
    margin: 28px auto;
    height: 100%;

    .body {
      background: rgba(255, 255, 255, 1);
      border: 1px solid rgba(223, 223, 223, 1);
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
      border-bottom: none;
      padding: 21px 25.5px 21px 19px;
    }
  }
</style>
