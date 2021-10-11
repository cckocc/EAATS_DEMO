<template>
  <td
    v-if="!tdData.isHide && tdData.nodeName"
    :rowspan="tdData.forkCount"
    :colspan="tdData.colspan"
  >
    <el-checkbox v-model="isCheck">{{ nodeName }}</el-checkbox>
  </td>
</template>

<script>
export default {
  name: 'TableTreeTd',
  props: {
    value: {
      type: Number,
      default: 0
    },
    item: {
      type: Object,
      default: () => {}
    },
    depth: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isCheck: false,
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
      // const max = Math.max(...num)
      // const { forkCount } = option
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
//   padding-left: 10px;
// }
.el-checkbox {
  width: 100%;
  padding-left: 5px;
  ::v-deep .el-checkbox__label {
    // overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
    width: calc(100% - 25px);
    white-space: normal;
    vertical-align: middle;
  }
}
</style>
