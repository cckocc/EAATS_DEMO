<template>
  <div class="input" contenteditable="false" @click="focus">
    <div class="self_input_title" :style="{ width: labelWidth }">
      {{ title }}：
    </div>

    <div
      style="
        max-height: 100px;
        overflow-y: auto;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        width: calc(100% - 100px);
      "
    >
      <el-tag
        v-for="tag in dynamicEmail"
        :key="tag.id"
        :closable="!disabled"
        :disable-transitions="false"
        style="margin-left: 10px;margin-top: 5px;"
        @close="handleClose(tag)"
      >
        {{ tag.label }}
      </el-tag>
      <el-input
        ref="input"
        v-model="emailAdd"
        :disabled="disabled"
        @keyup.enter.native="handleInputConfirm"
        @blur="handleInputConfirm"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => {
        return []
      }
    },
    title: {
      type: String,
      default: () => {
        return ''
      }
    },
    labelWidth: {
      type: String,
      default: () => {
        return '90px'
      }
    },
    disabled: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data() {
    return {
      dynamicEmail: [],
      emailAdd: ''
    }
  },
  watch: {
    dynamicEmail: {
      handler: function(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.$emit('input', newValue)
        }
      },
      deep: true,
      immediate: true
    },
    value: {
      handler: function(newValue, oldValue) {
        this.dynamicEmail = newValue
      },
      deep: true,
      immediate: true
    }
  },
  // emailContent(newValue,oldValue){
  //     if(newValue !== oldValue){
  //         this.$emit("input", newValue);
  //        }
  //     }
  // },
  created() {
    this.dynamicEmail = this.value
  },
  methods: {
    handleClose(tag) {
      this.dynamicEmail.splice(this.dynamicEmail.indexOf(tag), 1)
    },
    focus() {
      this.$refs.input.focus()
    },
    handleInputConfirm() {
      var emailAdd = this.emailAdd
      var date = new Date()
      var number1 = date.getTime()
      var str = number1 * Math.random()
      var str1 = str.toString().substring(0, 8)
      const param = {
        label: emailAdd,
        id: str1
      }
      if (emailAdd) {
        this.dynamicEmail.push(param)
      }
      this.inputVisible = false
      this.emailAdd = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.input {
  width: 100%;
  font-size: 14px;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  padding: 6px 0px;
  flex-direction: row;
  align-items: center;
}
.input:empty::before {
  content: attr(placeholder);
}
.input:focus {
  outline: none;
  border-bottom-color: #409eff;
}
.input ::v-deep .el-input .el-input__inner {
  border: 0px;
}
.input ::v-deep .el-input {
  display: flex;
  flex: 1;
}
.self_input_title {
  font-size: 14px;
  font-weight: 400;
  // line-height: 19px;
  color: #8c8c8c;
}
</style>
