<template>
  <div>
    <div>
      <tableTree
        ref="tableTree"
        :origin-data="originData"
        :table-columns="tableColumns"
        :userinfo="userinfo"
        :edit-flag-interface="editFlagInterface"
      >
        <template v-slot:node="{ node }">
          <span v-if="node.nodeType == 0">
            <span v-if="editFlagInterface">
              <el-switch
                v-model="node.isSupport"
                active-value="0"
                inactive-value="1"
                active-color="#4173CB"
                inactive-color="#ff4949"
                :disabled="!editFlagInterface"
              />
            </span>

            <span v-else>
              <span v-if="node.isSupport" align="center">
                <span v-if="node.isSupport == 1">
                  <img src="~@/assets/style/ISV_icon_fork.svg" alt="" />
                </span>
                <span v-if="node.isSupport == 0">
                  <img src="~@/assets/style/ISV_icon_support.svg" alt="" />
                </span>
              </span>
              <span v-else> 暂无 </span>
            </span>
          </span>

          <span v-else-if="node.nodeType == 1">
            <span
              v-if="editFlagInterface && userinfo.userInnerType.code !== '00'"
            >
              <el-select v-model="node.cfetsCheckStatus">
                <el-option
                  v-for="item in optionsStatusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </span>

            <span v-else>
              <span v-if="node.cfetsCheckStatus == '01'">
                <!-- 未发起 -->
                <img src="~@/assets/style/ISV_icon_fork.svg" alt="" />
              </span>
              <span v-if="node.cfetsCheckStatus == '00'">
                <!-- 待审核 -->
                <img src="~@/assets/style/ISV_icon_fork.svg" alt="" />
              </span>
              <span v-else-if="node.cfetsCheckStatus == '05'">
                <!-- 审核中 -->
                <img src="~@/assets/style/ISV_icon_fork.svg" alt="" />
              </span>
              <span v-else-if="node.cfetsCheckStatus == '10'">
                <!-- 通过 -->
                <img src="~@/assets/style/ISV_icon_support.svg" alt="" />
              </span>
              <span v-else-if="node.cfetsCheckStatus == '90'">
                <!-- 拒绝 -->
                <img src="~@/assets/style/ISV_icon_fork.svg" alt="" />
              </span>
            </span>
          </span>

          <span v-if="node.nodeType != 1 && node.nodeType != 0">
            {{ node.nodeName }}
          </span>
        </template>
      </tableTree>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IsvTreeSlot',
  props: {
    // isv管理
    compflag: {
      type: String,
      default: '',
    },
    userinfo: {
      type: Object,
      default: () => {},
    },
    editFlagInterface: Boolean,

    // 是否启用展开折叠：是-true | 否-false
    isFold: {
      type: Boolean,
      default: false,
    },
    // 是否显示复选框：是-true | 否-false
    showCheckbox: {
      type: Boolean,
      default: false,
    },
    // 是否同时显示复选框和slot：是-true | 否-false
    showCheckboxAndSlot: {
      type: Boolean,
      default: false,
    },
    // 是否显示表头
    isShowTableHead: {
      type: Boolean,
      default: true,
    },
    // 是否严格的遵循父子不互相关联：是-true | 否-false
    checkStrictly: {
      type: Boolean,
      default: false,
    },
    // 是否后面额外有固定的列拼接：是-true | 否-false
    extraColumn: {
      type: Boolean,
      default: false,
    },
    // 仅当extraColumn为true时生效，额外列的数据
    extraColumnObj: {
      type: Object,
      default: () => ({
        columns: [],
        list: [],
      }),
    },
    // table动态列的表头数据
    tableColumns: {
      type: Array,
      default: () => [],
    },
    // tree传入数据
    originData: {
      type: Array,
      default: () => [],
    },
    // table传入的高度
    height: {
      type: [String, Number],
      default: 'auto',
    },
    // 置灰checkbox的层级
    disabledCheckboxNodeLevel: {
      type: Number,
      default: 0,
    },
    // checkbox隐藏的层级
    showCheckboxLevel: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      // 树格式为table后的tr列表（实际展示的数据）
      trList: [],
      changeList: [],
      autoHeight: 100,
      // tableColumns: [],
      // originData: [],
      configInfoList: [],
      optionsStatusList: [
        {
          value: '00',
          label: '待审核',
        },
        {
          value: '01',
          label: '未发起',
        },
        {
          value: '10',
          label: '通过',
        },
        {
          value: '90',
          label: '拒绝',
        },
      ],
    }
  },
  created() {},
  mounted() {
    this.autoHeight = this.$root.$el.clientHeight - 380
  },
  methods: {
    // 获取树的数据
    getTreeData() {
      return this.$refs.tableTree.getTreeData()
    },
    getTrListCopy() {
      return this.$refs.tableTree.getTrListCopy()
    },
    // addToChangelist(node) {
    //   this.changeList.push(node)
    // }
  },
}
</script>

<style lang="scss" scoped>
</style>
