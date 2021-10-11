<template>
  <div class="tabs-body">
    <div v-for="item in itemList" :key="item.value" :class="{ active: active === item.value }" class="tabs-body-item" @click="tabClick(item)">
      {{ item.label }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tabs',
  props: {
    value: {
      type: String,
      default: ''
    },
    itemList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      active: this.value
    }
  },
  methods: {
    tabClick(item) {
      this.active = item.value
      this.$emit('input', item.value)
      this.$emit('tab-click', item)
    }
  }
}
</script>

<style lang="scss" scoped>
.tabs-body {
  display: flex;
  margin: 5px 0;
  &-item {
    margin-right: 24px;
    width: 183px;
    height: 40px;
    line-height: 40px;
    text-align: center;
    color: #333333;
    font-size: 16px;
    background-color: #fff;
    border: 1px solid #DFDFDF;
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.06);
    border-radius: 2px;
    cursor: pointer;
    &:last-child {
      margin-right: 0;
    }
    &.active {
      color: #fff;
      border: none;
      background: linear-gradient(90deg, #00A5FF 0%, #0084F0 32%, #0065E2 100%);
      box-shadow: 0px 0px 16px rgba(3, 121, 255, 0.4);
    }
  }
}
</style>
