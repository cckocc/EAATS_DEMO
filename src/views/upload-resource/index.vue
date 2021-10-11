<template>
  <div>
    <el-tabs v-model="activeName" class="custom-main-tabs" @tab-click="handleClick">
      <el-tab-pane :key="'first'" label="指引&SDK" name="first">
        <!-- <child1 operation-type="upload" /> -->
        <child1 />
      </el-tab-pane>
      <el-tab-pane :key="'second'" label="协议标准" name="second">
        <child2 />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// import child1 from '@/views/download/resources-download/components/child'
import child1 from './components/upload-resource'
import child2 from '@/views/upload-resource/protocol-dictionary'
export default {
  name: 'UploadResource',
  components: {
    child1,
    child2
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  mounted() {

  },
  methods: {
    handleClick(tab) {
      console.log(tab)
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-tabs__content {
  overflow: initial;
}
</style>
