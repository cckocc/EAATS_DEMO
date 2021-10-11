<template>
  <!-- 插入元素组件 -->
  <!-- min-width="810px" -->
  <el-dialog
    :title="title"
    :visible.sync="visibleInsert"
    width="50%"
    append-to-body
    :before-close="handleClose"
    @open="openDialog"
  >
    <div class="dialog_content">
      <el-radio-group v-model="selectElement" size="mini">
        <el-radio v-for="(item, index) in insertList" :key="item.id" :disabled="item.flag" :style="{ marginLeft: index === 0 ? '10px' : '',marginBottom:'10px' }" :label="item.name" border>{{ item.name }}</el-radio>
      </el-radio-group>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirmEle">确 定</el-button>
      <el-button @click="visibleInsert = false">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>

export default {
  name: 'InsertDialog',
  props: {
    value: {
      type: String,
      default: () => {
        return ''
      }
    },
    title: {
      type: String,
      default: () => {
        return '标题'
      }
    },
    insertList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      visibleInsert: false,
      selectElement: ''
    }
  },
  watch: {
    selectElement(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.$emit('input', newValue)
      }
    },
    value(newValue, oldValue) {
      if (newValue !== oldValue) {
        // this.selectElement = newValue
      }
    }
  },
  methods: {
    async initInsertOpen() {
      // alert(111)
      // // 点击插入元素 调用接口
      // const res = await reqInsertElements({ })
      // console.log('插入元素', res)
      // 初始化数据
      this.initData()
    },
    initData() {
      this.visibleInsert = true
    },
    handleClose(done) {
      done()
    },
    openDialog() {
      this.selectElement = ''
    },
    confirmEle() {
      if (this.selectElement) {
        this.$emit('confirmBut')
      } else {
        this.$message({
          message: '请选择插入元素',
          type: 'warning'
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.dialog_content{
    width: 100%;
}
</style>
