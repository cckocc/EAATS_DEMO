<template>
  <!-- height="400px"
    max-height="400px" -->
  <el-table
    :data="tableData"
    size="small"
    row-class-name="row"
    cell-class-name="column"
    :row-style="setRowStyle"
    :highlight-current-row="true"
    :cell-style="{textAlign:'center'}"
    :header-cell-style="{textAlign:'center'}"
    fit
  >
    <el-table-column
      v-for="(item, index) in tableLabel"
      :key="index"
      :fixed="item.fixed"
      :prop="item.prop"
      :width="item.width"
      :label="item.label"
    >
      <template slot-scope="scope">
        <span v-if="scope.row[item.prop] === '1'"><img src="~@/assets/style/support_icon.svg"></span>
        <el-button v-if="item.isOpera" type="text" size="small" @click="handleGoods(scope.row)">{{ scope.row[item.prop] }}</el-button>
        <div v-else-if="!item.isOpera && scope.row[item.prop] !== '1'">{{ scope.row[item.prop] }}</div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    tableLabel: {
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
    setRowStyle() {},
    setColumnStyle() {}
  }
}
</script>
