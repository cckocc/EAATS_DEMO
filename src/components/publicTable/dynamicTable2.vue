<template>
  <!-- height="400px"
    max-height="400px" -->
  <div class="self_table">
    <el-table
      :data="tableData"
      size="small"
      row-class-name="row"
      cell-class-name="column"
      :row-style="setRowStyle"
      :highlight-current-row="true"
      :cell-style="{ textAlign: 'center' }"
      :header-cell-style="{ textAlign: 'center' }"
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
          <div
            v-if="
              item.prop === 'contactsId' ||
              item.prop === 'emails' ||
              item.prop === 'userName'
            "
          >
            {{ scope.row[item.prop] }}
          </div>
          <el-switch
            v-else
            v-model="scope.row[item.prop]"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-value="1"
            inactive-value="0"
            @change="switchStatus(scope.row, item)"
          />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default: () => {
        return []
      },
    },
    tableLabel: {
      type: Array,
      default: () => {
        return []
      },
    },
  },

  data() {
    return {}
  },
  methods: {
    setRowStyle() {},
    setColumnStyle() {},
    switchStatus(str, args) {
      this.$emit('selectSwitch', str, args)
    },
  },
}
</script>

<style lang="scss" scoped>
.self_table ::v-deep .el-table__fixed {
  height: 100% !important;
}
</style>
