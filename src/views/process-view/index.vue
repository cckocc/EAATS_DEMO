<template>
  <div>
    <el-tabs v-model="tabActiveName" class="custom-main-tabs">
      <el-tab-pane
        v-for="item in tabList"
        :key="item.componentName"
        :label="item.label"
        :name="item.componentName"
      />
    </el-tabs>
    <waitList v-if="tabActiveName === 'waitList'" ref="processViewList" await-flag="true" />
    <allList v-if="tabActiveName === 'allList'" ref="processViewList" await-flag="false" />
    <!-- 流程查看 -->
    <processViewDialog
      ref="processViewDialog"
      :modal-visible="processViewObj.visible"
      :process-view-obj="processViewObj.row"
      :operation-type="processViewObj.type"
      @close="processViewObj.visible = false"
    />
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import waitList from './components/waitList'
import allList from './components/waitList'
import processViewDialog from '@/views/interface-service/my-service/components/processViewDialog'
export default {
  inject: ['reload'],
  name: 'ProcessView',
  components: {
    waitList,
    allList,
    processViewDialog
  },
  data() {
    return {
      isFirst: true,
      tabActiveName: '',
      tabList: [
        {
          label: '待审核',
          name: 'waitList',
          componentName: 'waitList',
          awaitFlag: 'true',
          roles: ['GRIP_processView_awaitAudit']
        },
        {
          label: '全部',
          name: 'allList',
          componentName: 'allList',
          awaitFlag: 'false',
          roles: ['GRIP_processView_search']
        }
      ],
      processViewObj: {
        row: {},
        visible: false,
        type: ''
      }
    }
  },
  computed: {
    message() {
      return this.$store.state.app.message
    }
  },
  watch: {
    message(val) {
      if (val !== '') {
        this.reload()
      }
    }
  },
  created() {
    console.log('流程查看列表')
    this.getTabActiveName()
  },
  activated() {
    if (!this.isFirst) {
      console.log('流程查看列表缓存回来')
      if (this.tabActiveName) {
        this.$nextTick(() => {
          this.$refs.processViewList.refreshSonList()
          this.$refs.processViewList.fetchData()
        })
      }
    }
    this.isFirst = false
  },
  methods: {
    checkPermission,
    // 获取Tab激活页
    getTabActiveName() {
      this.tabList = this.tabList.filter((e) => this.checkPermission(e.roles))
      this.tabActiveName = this.tabList.length > 0 ? this.tabList[0].componentName : ''
      if (this.$route.params.tabActiveName) {
        this.tabActiveName = this.$route.params.tabActiveName
      }
    }
  }
}
</script>

<style lang="scss"></style>
