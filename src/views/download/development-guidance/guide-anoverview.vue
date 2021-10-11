<template>
  <div class="info">
    指引总述
    <ul>
      <li v-for="(item, index) in overviewList" :key="index" class="col-style">
        <el-button type="text" size="small" @click="handleClick(item)">
          {{ item.name }}
        </el-button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      overviewList: [
        { name: '指引总述.rar', id: 1 },
        { name: '指引总述2.rar', id: 2 },
        { name: '指引总述3.rar', id: 3 }
      ]
    }
  },
  methods: {
    // 点击下载
    handleClick(data) {
      console.log('data', data)
    }
  }
}
</script>

<style lang="scss" scoped>
$mainWidth: 1220px;
.info {
}
ul {
  padding-left: 0;
  li {
    list-style: none;
    border: 1px solid #dfe4ed;
    &:hover {
      background-color: #efefef;
    }
    &.col-style {
      padding: 3px 0 3px 10px;
      border-top: 0;
    }
    &:first-child {
      border-top: 1px solid #dfe4ed;
    }
  }
}
</style>
