<template>
  <div class="card_manage_page">
    <div class="header_title">{{ cardItem.title }}</div>
    <div class="content_check">
      <!-- <el-radio-group
        v-model="cardItem.select"
        :disabled="disabled"
      > -->
      <div class="check_display">
        <el-radio v-for="ele in cardItem.userManageMent" :key="ele.id" class="check_display_inner" :label="ele.id">{{ ele.title }}</el-radio>
      </div>
      <!-- </el-radio-group> -->
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cardItem: {
      type: Object,
      default: () => {
        return {}
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
      checkedCities: []
    }
  }
}
</script>

<style lang="scss" scoped>
.card_manage_page{
    width: 257px;
    height: 298px;
    border: 1px solid #E6E6E6;
    border-radius: 8px;
    float: left;
    .header_title{
        width: 100%;;
        padding: 12px 0px 12px 20px;
        background-color: #2C76D1;
        color: #FFFFFF;
        font-size: 18px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }
    .content_check{
        width: 100%;
        height: 248px;
        overflow: auto;
    }
    .check_display{
        display: flex;
        flex-direction: column;
        padding: 10px 0px 0px 20px;
        .check_display_inner{
            margin-bottom: 10px;
        }
    }
}
</style>
