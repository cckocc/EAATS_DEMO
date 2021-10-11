<template>
  <td
    v-if="!tdData.isHide && tdData.nodeName"
    :rowspan="tdData.forkCount"
    :colspan="tdData.colspan"
  >
    <div v-if="formType === 'checkbox'" class="td-container">
      <i
        v-if="node.nodeLevel <= 2"
        :class="[node.isFold ? 'el-icon-minus' : 'el-icon-plus']"
        @click="onFold(node.isFold)"
      />
      <!-- <i v-if="node.nodeLevel <= 2" :class="[node.isFold ? 'el-icon-arrow-down' : 'el-icon-arrow-right']" @click="onFold(node.isFold)" /> -->
      <el-checkbox
        v-model="isCheck"
        class="td-container-checkbox"
        :disabled="isEdit === '10'"
        true-label="10"
        false-label="00"
        @change="onChangeCheck"
        >{{ node.nodeName }}</el-checkbox
      >
    </div>
    <div v-if="formType === 'text'" class="td-container">
      <span>{{ node.nodeName }}</span>
    </div>
  </td>
</template>

<script>
import {
  getParentAll,
  setParentCheckYes,
  setChildrenCheck,
  setTreeFold,
} from '@/utils'
export default {
  name: 'TableTreeTd',
  props: {
    formType: {
      type: String,
      default: 'text',
    },
    value: {
      type: Number,
      default: 0,
    },
    item: {
      type: Object,
      default: () => {},
    },
    depth: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      node: {},
      nodeName: '',
      isEdit: '',
      isCheck: '',
    }
  },
  computed: {
    tdData: function () {
      const option = {}
      const num = []
      Object.keys(this.item).forEach((key) => {
        const arr = key.split('_')
        const keyName = arr[0]
        const index = arr[arr.length - 1] * 1
        if (index === this.value) {
          option[keyName] = this.item[key]
        }
        num.push(index)
      })
      option.colspan = option.step
      this.node = option
      this.nodeName = option.nodeName
      if (option.editType) {
        this.isEdit = option.editType.code
      }
      if (option.nodeOptionalStatus) {
        this.isCheck = option.nodeOptionalStatus.code
      }
      return option
    },
  },
  created() {},
  methods: {
    onFold(val) {
      this.node.isFold = !val
      setTreeFold(this.$store.state.service.menuConfigData, this.node, !val)
    },
    onChangeCheck(val) {
      console.log(val)
      console.log(this.node)
      const dataObj = {
        node: this.node,
        val: val,
      }
      this.$store.dispatch('service/', dataObj)
      const menuConfigData = JSON.parse(
        JSON.stringify(this.$store.state.service.menuConfigData)
      )
      const menuConfigDataOrigin = JSON.parse(
        JSON.stringify(this.$store.state.service.menuConfigDataOrigin)
      )
      if (val === '10') {
        const parentAll = getParentAll(menuConfigDataOrigin, this.node.id)
        console.log(parentAll)
        setParentCheckYes(menuConfigData, parentAll, '10')
        setChildrenCheck(menuConfigData, this.node, '10')
      } else if (val === '00') {
        setChildrenCheck(menuConfigData, this.node, '00')
      }
      this.$store.dispatch('service/setMenuConfigData', menuConfigData)
      this.$store.dispatch(
        'service/setMenuConfigDataOrigin',
        menuConfigDataOrigin
      )
    },
  },
}
</script>

<style lang="scss" scoped>
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
.el-checkbox {
  width: 100%;
  padding-left: 5px;
  ::v-deep .el-checkbox__label {
    // overflow: hidden;
    // text-overflow: ellipsis;
    // white-space: nowrap;
    width: calc(100% - 20px);
    white-space: normal;
    word-break: break-all;
    vertical-align: middle;
  }
}
.td-container {
  display: flex;
  padding: 0 5px;
  &-checkbox {
    flex: 1;
  }
}
</style>
