<template>
  <div class="input" contenteditable="false" @click="focus">
    <div class="self_input_title" :style="{ width: labelWidth }">
      {{ title }}：
    </div>
    <el-input
      ref="input"
      v-model="emailAdd"
      type="textarea"
      autosize
      :disabled="disabled"
      :placeholder="placeholder"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: () => {
        return ''
      },
    },
    title: {
      type: String,
      default: () => {
        return ''
      },
    },
    disabled: {
      type: Boolean,
      default: () => {
        return false
      },
    },
    labelWidth: {
      type: String,
      default: () => {
        return '90px'
      },
    },
    placeholder: {
      type: String,
      default: () => {
        return ''
      },
    },
  },
  data() {
    return {
      emailAdd: '',
    }
  },
  watch: {
    emailAdd(newValue, oldValue) {
      if (newValue !== oldValue) {
        this.$emit('input', newValue)
      }
    },
    value(newValue, oldValue) {
      // console.log('过分', newValue)
      this.emailAdd = newValue
    },
  },
  created() {
    this.emailAdd = this.value
  },
  methods: {
    focus() {
      this.$refs.input.focus()
    },
  },
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
  line-height: 19px;
  color: #030303;
}
::v-deep .el-textarea .el-textarea__inner {
  border: none;
  resize: none;
}
</style>
