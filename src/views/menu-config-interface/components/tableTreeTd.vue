<template>
  <td
    v-if="!tdData.isHide && tdData.nodeName"
    :rowspan="tdData.forkCount"
    :colspan="tdData.colspan"
  >
    <el-tooltip
      placement="top"
      :open-delay="500"
      effect="dark"
      :disabled="showTooltip"
    >
      <div slot="content">{{ nodeName }}</div>
      <el-input v-model="nodeName" @mouseenter.native="showTip(nodeName)" @blur="onBlurNode(tdData.id, tdData.nodeName)" />
    </el-tooltip>
    <!-- <el-input v-model="nodeName" @blur="onBlurNode(tdData.id, tdData.nodeName)"></el-input> -->
    <!-- <el-input v-if="tdData.add" v-model="tdData.nodeName"></el-input>
    <div v-else class="cell">{{ tdData.nodeName }}</div> -->
  </td>
</template>

<script>
export default {
  name: 'TableTreeTd',
  props: {
    value: {
      type: Number
    },
    item: {
      type: Object
    },
    depth: {
      type: Number
    }
  },
  data() {
    return {
      nodeName: '',
      showTooltip: false
    }
  },
  computed: {
    tdData: function() {
      const option = {}
      const num = []
      Object.keys(this.item).forEach(key => {
        const arr = key.split('_')
        const keyName = arr[0]
        const index = arr[arr.length - 1] * 1
        if (index === this.value) {
          option[keyName] = this.item[key]
        }
        num.push(index)
      })
      const max = Math.max(...num)
      const { forkCount } = option
      // if (forkCount === 1 && max - this.value === 0) {
      //   option.colspan = this.depth - max + 1
      // } else {
      //   option.colspan = 1
      // }
      option.colspan = option.step
      this.nodeName = option.nodeName
      return option
    }
  },
  created() {

  },
  methods: {
    showTip(nodeName) {
      if (nodeName.length > 10) {
        this.showTooltip = false
      } else {
        this.showTooltip = true
      }
    },
    onBlurNode(id, nodeName) {
      if (this.nodeName === nodeName) { // 输入框值未改变，不进行操作
        return
      } else { // 将单元格改变的值返回给父组件
        const node = {
          id: id,
          text: this.nodeName
        }
        this.$emit('changeNode', node)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
// td {
//   border-top: 1px solid #dfe6ec;
// }
.el-textarea {
  ::v-deep .el-textarea__inner {
    resize: none;
    overflow: auto;
    border: none;
  }
}
.el-input {
  ::v-deep .el-input__inner {
    border: none;
  }
}
</style>
