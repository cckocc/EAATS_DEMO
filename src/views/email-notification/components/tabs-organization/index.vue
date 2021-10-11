<template>
  <div class="tabs_pages">
    <div
      v-for="item in tabsList"
      :key="item.activeId"
      class="tabs_item"
      :class="[ value === item.activeId ? 'item_border' : '' ]"
      @click="activeEvent(item)"
      v-text="item.title"
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
      }
    },
    tabsList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
    }
  },
  methods: {
    activeEvent(args) {
      console.log(args)
      this.$emit('input', args)
    }
  }
}
</script>

<style lang="scss" scoped>
.tabs_pages{
    width: 100%;
    overflow-x: auto;
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid #DFDFDF;
    background-color: #ffffff;
    .tabs_item{
        padding: 11px 0px 11px 0px;
        margin-right: 24px;
        margin-left: 24px;
        cursor: pointer;
    }
    .item_border{
        color: #0050B3;
        border-bottom: 2px solid #0050B3;
        font-weight: bold;
        cursor: text;
    }
}
</style>
