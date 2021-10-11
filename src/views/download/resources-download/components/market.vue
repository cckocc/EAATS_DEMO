<template>
  <div class="main">
    <span v-if="show" />
    <div v-if="interfaceList.length == 0" class="list-box empty">
      <div class="list-main empty-main">
        <div class="search-box">
          <div class="search-btn" @click="search()">
            <div class="img">
              <img src="@/assets/icon/closeSearch.png" alt="">
            </div>
            <span class="text">展开筛选</span>
          </div>
        </div>
        <div class="empty-box">
          <img src="@/assets/icon/emptyList.png" alt="">
          <p class="empty-tip">暂无数据</p>
          <p>十分遗憾，未搜到你想要的结果，请拨打4009787878转5咨询</p>
        </div>
      </div>
    </div>
    <div v-for="(item, i) in interfaceList" :key="i" class="list-box">
      <div
        class="list-main"
        :class="interfaceList.length == 1 ? 'empty-main' : ''"
      >
        <div v-if="i == 0" class="search-box">
          <div class="search-btn" @click="search()">
            <div class="img">
              <img src="@/assets/icon/closeSearch.png" alt="">
            </div>
            <span class="text">展开筛选</span>
          </div>
        </div>
        <div class="list-head">
          <span class="title">
            {{ item.nodeTypeName }}
            <el-dropdown placement="bottom-start" trigger="click">
              <img
                style="margin-left: 10px"
                src="@/assets/icon/information.png"
                alt=""
                @click="showDesc(item.nodeTypeId)"
              >
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <!-- <el-tree class="show-search" :data="item.nodeTypeDesc" node-key="id" :props="defaultProps"></el-tree> -->
                  <!-- <span v-if="showSearch">请稍等</span> -->
                  <tableTree
                    v-if="nodeTypeDesc.length > 0"
                    ref="tableTree"
                    :origin-data="nodeTypeDesc"
                    :is-show-table-head="showHead"
                    class="show-search"
                  />
                  <!-- <span v-else>暂无数据</span> -->
                  <span v-else>{{ showSearch ? '请稍等' : '暂无数据' }}</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </span>
          <div class="download" @click="downloadAgree(item)">
            <div>
              <img src="@/assets/icon/download.png" alt="">
            </div>
            <span>下载协议条款</span>
          </div>
        </div>
        <div class="box-card" style="margin-right: 24px">
          <div class="position-card" />
          <div class="head">
            <img src="@/assets/style/ywzy.png" alt="">
          </div>
          <div class="card-main">
            <div v-if="item.businessGuide == null" class="empty-card">
              资源文件为空
            </div>
            <div
              v-for="(tag, key) in item.businessGuide"
              :key="key"
              class="tag-list"
            >
              <div class="tag">
                <p class="number" :title="tag.resourceVersion">
                  {{ tag.resourceVersion ? tag.resourceVersion : '—' }}
                </p>
                <p class="name">{{ tag.fileType.text }}</p>
                <p class="open-list" @click="showFile(tag)">
                  <span>下载</span>
                  <img src="@/assets/icon/openList.png" alt="">
                </p>
              </div>
              <ul class="file-list">
                <li v-for="(file, o) in tag.fileList" :key="o">
                  <span>{{ file.fileName }}</span>
                  <img
                    src="@/assets/icon/download.png"
                    alt=""
                    @click="downloadFile(file)"
                  >
                </li>
              </ul>
            </div>
            <div
              v-if="item.businessGuide != null"
              class="card-footer"
              @click="showVersion(item.businessGuide)"
            >
              <img src="@/assets/icon/bejl.png" alt="">
              <span>版本记录</span>
            </div>
          </div>
        </div>
        <div class="box-card" style="margin-right: 24px">
          <div class="position-card" />
          <div class="head">
            <img src="@/assets/style/schj.png" alt="">
          </div>
          <div class="card-main">
            <div v-if="item.productResource == null" class="empty-card">
              资源文件为空
            </div>
            <div
              v-for="(tag, key) in item.productResource"
              :key="key"
              class="tag-list"
            >
              <div class="tag">
                <p class="number" :title="tag.resourceVersion">
                  {{ tag.resourceVersion ? tag.resourceVersion : '—' }}
                </p>
                <p class="name">{{ tag.fileType.text }}</p>
                <p class="open-list" @click="showFile(tag)">
                  <span>下载</span>
                  <img src="@/assets/icon/openList.png" alt="">
                </p>
              </div>
              <ul class="file-list">
                <li v-for="(file, o) in tag.fileList" :key="o">
                  <el-dropdown
                    v-if="
                      tag.description
                        ? tag.description.length > 0
                        : tag.description != null &&
                          tag.fileType.code == 'DEVELOP_PACKAGE'
                    "
                    placement="bottom-start"
                    popper-class="link"
                  >
                    <span class="package-title">
                      {{ file.fileName }}
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <span>开发包包含：</span>
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-for="(pack, e) in tag.description"
                        :key="e"
                      >
                        <span style="margin-right: 16px">{{
                          pack.version
                        }}</span>
                        <span>{{ pack.value }}</span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <span v-else>{{ file.fileName }}</span>
                  <img
                    src="@/assets/icon/download.png"
                    alt=""
                    @click="downloadFile(file)"
                  >
                </li>
              </ul>
            </div>
            <div
              v-if="item.productResource != null"
              class="card-footer"
              @click="showVersion(item.productResource)"
            >
              <img src="@/assets/icon/bejl.png" alt="">
              <span>版本记录</span>
            </div>
          </div>
        </div>
        <div class="box-card" style="margin-right: 24px">
          <div class="position-card" />
          <div class="head">
            <img src="@/assets/style/yszy.png" alt="">
          </div>
          <div class="card-main">
            <div v-if="item.acceptanceResource == null" class="empty-card">
              资源文件为空
            </div>
            <div
              v-for="(tag, key) in item.acceptanceResource"
              :key="key"
              class="tag-list"
            >
              <div class="tag">
                <p class="number" :title="tag.resourceVersion">
                  {{ tag.resourceVersion ? tag.resourceVersion : '—' }}
                </p>
                <p class="name">{{ tag.fileType.text }}</p>
                <p class="open-list" @click="showFile(tag)">
                  <span>下载</span>
                  <img src="@/assets/icon/openList.png" alt="">
                </p>
              </div>
              <ul class="file-list">
                <li v-for="(file, o) in tag.fileList" :key="o">
                  <el-dropdown
                    v-if="
                      tag.description
                        ? tag.description.length > 0
                        : tag.description != null &&
                          tag.fileType.code == 'DEVELOP_PACKAGE'
                    "
                    placement="bottom-start"
                    popper-class="link"
                  >
                    <span class="package-title">
                      {{ file.fileName }}
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <span>开发包包含：</span>
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-for="(pack, e) in tag.description"
                        :key="e"
                      >
                        <span style="margin-right: 16px">{{
                          pack.version
                        }}</span>
                        <span>{{ pack.value }}</span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <span v-else>{{ file.fileName }}</span>
                  <img
                    src="@/assets/icon/download.png"
                    alt=""
                    @click="downloadFile(file)"
                  >
                </li>
              </ul>
            </div>
            <div
              v-if="item.acceptanceResource != null"
              class="card-footer"
              @click="showVersion(item.acceptanceResource)"
            >
              <img src="@/assets/icon/bejl.png" alt="">
              <span>版本记录</span>
            </div>
          </div>
        </div>
        <div class="box-card">
          <div class="position-card" />
          <div class="head">
            <img src="@/assets/style/dsxzy.png" alt="">
          </div>
          <div class="card-main">
            <div v-if="item.waitOnlineResource == null" class="empty-card">
              资源文件为空
            </div>
            <div
              v-for="(tag, key) in item.waitOnlineResource"
              :key="key"
              class="tag-list"
            >
              <div class="tag">
                <el-select
                  v-if="tag.fileType.code == 'DEVELOP_GUIDE'"
                  v-model="tag.id"
                  class="number"
                  @change="changeId(tag, key, item.waitOnlineResource)"
                >
                  <el-option
                    v-for="item in tag.versionOptions"
                    :key="item.devGuideId"
                    :label="item.devGuideVersion"
                    :value="item.devGuideId"
                  />
                </el-select>
                <el-select
                  v-if="tag.fileType.code == 'DEVELOP_PACKAGE'"
                  v-model="tag.id"
                  class="number"
                  @change="changeId(tag, key, item.waitOnlineResource)"
                >
                  <el-option
                    v-for="item in tag.versionOptions"
                    :key="item.devPackageId"
                    :label="item.devPackageVersion"
                    :value="item.devPackageId"
                  />
                </el-select>
                <p class="name">{{ tag.fileType.text }}</p>
                <p class="open-list" @click="showFile(tag)">
                  <span>下载</span>
                  <img src="@/assets/icon/openList.png" alt="">
                </p>
              </div>
              <ul class="file-list">
                <li v-for="(file, o) in tag.fileList" :key="o">
                  <el-dropdown
                    v-if="
                      tag.description
                        ? tag.description.length > 0
                        : tag.description != null &&
                          tag.fileType.code == 'DEVELOP_PACKAGE'
                    "
                    placement="bottom-start"
                    popper-class="link"
                  >
                    <span class="package-title">
                      {{ file.fileName }}
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>
                        <span>开发包包含：</span>
                      </el-dropdown-item>
                      <el-dropdown-item
                        v-for="(pack, e) in tag.description"
                        :key="e"
                      >
                        <span style="margin-right: 16px">{{
                          pack.version
                        }}</span>
                        <span>{{ pack.value }}</span>
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <span v-else>{{ file.fileName }}</span>
                  <img
                    src="@/assets/icon/download.png"
                    alt=""
                    @click="downloadFile(file)"
                  >
                </li>
              </ul>
            </div>
            <div
              v-if="item.waitOnlineResource != null"
              class="card-footer"
              @click="showVersion(item.waitOnlineResource)"
            >
              <img src="@/assets/icon/bejl.png" alt="">
              <span>版本记录</span>
            </div>
          </div>
        </div>
        <div style="clear: both" />
      </div>
    </div>
    <!-- 筛选 -->
    <el-drawer
      title="接口菜单筛选"
      :visible.sync="drawer"
      direction="ltr"
      size="60%"
    >
      <Search
        ref="search"
        :institution-type="institutionType"
        @closeDrawer="closeDrawer"
        @searchList="searchList"
      />
    </el-drawer>
    <!-- 版本记录 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      width="800px"
      title="版本记录"
    >
      <el-table
        :data="versionList"
        style="width: 100%"
        fit
        :header-cell-style="{
          background: '#f6f7fb',
          color: '#303030',
          fontWeight: 'bold',
          fontFamily: 'Source Han Sans CN',
        }"
        highlight-current-row
      >
        <el-table-column align="left" label="资源类型" width="100">
          <template slot-scope="scope">{{
            scope.row.fileType.text
          }}</template>
        </el-table-column>
        <el-table-column
          prop="fileName"
          align="left"
          label="文件名称"
          min-width="250"
        >
          <template slot-scope="scope">
            <span class="dialog-download" @click="downloadFile(scope.row)">{{
              scope.row.fileName
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTs"
          align="left"
          label="更新时间"
          width="160"
        />
        <el-table-column prop="resourceVersion" align="left" label="版本号">
          <template slot-scope="scope">
            <span>{{
              scope.row.resourceVersion ? scope.row.resourceVersion : '—'
            }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 下载协议条款 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="downloadVisible"
      width="800px"
      title="下载协议条款"
    >
      <el-table
        :data="agreement"
        style="width: 100%"
        :header-cell-style="{
          background: '#f6f7fb',
          color: '#303030',
          fontWeight: 'bold',
          fontFamily: 'Source Han Sans CN',
        }"
        highlight-current-row
      >
        <el-table-column prop="fileName" align="center" label="文件名" />
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="downloadFile(scope.row)"
            >下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import Search from './search'
import {
  getInterfaceList,
  getFileList,
  getVersionList,
  getAgreement,
  getDescList
} from '@/api/download'
import { downloadAuthen } from '@/api/file'
import { downloadFile } from '@/utils/index'

export default {
  components: {
    Search
  },
  props: {},
  data() {
    return {
      nodeTypeDesc: [],
      showHead: false,
      institutionType: '00',
      drawer: false,
      showSearch: false,
      show: false,
      options: [],
      interfaceList: [],
      test: [],
      nodeIds: [],
      dialogVisible: false,
      versionList: [],
      downloadVisible: false,
      agreement: [],
      sortArr: [
        'GUIDE_FILE',
        'DEVELOP_GUIDE',
        'DEVELOP_PACKAGE',
        'ACCEPTANCE_FILE'
      ],
      defaultProps: {
        children: 'chidrenList',
        label: 'nodeName'
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      const query = {
        institutionType: this.institutionType,
        nodeIds: this.nodeIds
      }
      getInterfaceList(query).then((res) => {
        // this.interfaceList = JSON.parse(JSON.stringify(res.data))
        this.test = JSON.parse(JSON.stringify(res.data))
        // console.log(this.interfaceList, 'rp');
        this.interfaceList = res.data.map((item) => {
          if (item.businessGuide) {
            item.businessGuide.sort((e) => {
              if (e.fileType.code === 'GUIDE_FILE' || e.fileType.code === 'DEVELOP_GUIDE') {
                return -1
              }
              if (e.fileType.code === 'DATA_SET' || e.fileType.code === 'DEVELOP_PACKAGE') {
                return 1
              }
            })
          }
          if (item.productResource) {
            item.productResource.sort((e) => {
              if (e.fileType.code === 'GUIDE_FILE' || e.fileType.code === 'DEVELOP_GUIDE') {
                return -1
              }
              if (e.fileType.code === 'DATA_SET' || e.fileType.code === 'DEVELOP_PACKAGE') {
                return 1
              }
            })
            item.productResource.forEach((k) => {
              if (k.fileType.code === 'DEVELOP_PACKAGE') {
                k.description = k.description ? JSON.parse(k.description) : []
              }
            })
          }
          if (item.acceptanceResource) {
            item.acceptanceResource.sort((a, b) => {
              const aIndex = this.sortArr.findIndex((s) => s === a.fileType.code)
              const bIndex = this.sortArr.findIndex((s) => s === b.fileType.code)
              return aIndex - bIndex
            })
            item.acceptanceResource.forEach((k) => {
              if (k.fileType.code === 'DEVELOP_PACKAGE') {
                k.description = k.description ? JSON.parse(k.description) : []
              }
            })
          }
          if (item.waitOnlineResource) {
            item.waitOnlineResource.sort((e) => {
              if (e.fileType.code === 'GUIDE_FILE' || e.fileType.code === 'DEVELOP_GUIDE') {
                return -1
              }
              if (e.fileType.code === 'DATA_SET' || e.fileType.code === 'DEVELOP_PACKAGE') {
                return 1
              }
            })
            item.waitOnlineResource.forEach((k) => {
              if (k.fileType.code === 'DEVELOP_PACKAGE') {
                k.description = k.description ? JSON.parse(k.description) : []
              }
            })
          }
          return item
        })
        // console.log(this.interfaceList, this.test, 'interface');
      })
    },
    downloadAgree(item) {
      const params = {
        menuInstiType: '00',
        nodeTypeId: item.nodeTypeId
      }
      getAgreement(params).then((res) => {
        this.agreement = res.data
        this.downloadVisible = true
      })
    },
    changeId(tag, key, wait) {
      if (tag.fileType.code === 'DEVELOP_GUIDE') {
        tag.versionOptions.forEach((item) => {
          if (item.devGuideId === tag.id) {
            tag.description = item.description
              ? JSON.parse(item.description)
              : []
            wait[0].resourceId = item.resouceId
            if (key === 0) {
              wait[1].id = item.devPackageId
              wait[1].description = tag.description
            } else if (key === 1) {
              wait[0].id = item.devPackageId
            }
          }
        })
      } else if (tag.fileType.code === 'DEVELOP_PACKAGE') {
        tag.versionOptions.forEach((item) => {
          if (item.devPackageId === tag.id) {
            tag.description = item.description
              ? JSON.parse(item.description)
              : []
            wait[0].resourceId = item.resouceId
            if (key === 0) {
              wait[1].id = item.devGuideId
            } else if (key === 1) {
              wait[0].id = item.devGuideId
            }
          }
        })
      }
      this.show = true
      wait[0].fileList = []
      wait[1].fileList = []
      this.showFile(tag)
    },
    showVersion(versions) {
      getVersionList(versions[0].resourceId).then((res) => {
        console.log(res, 'rppp')
        this.versionList = res.data
        this.dialogVisible = true
      })
    },
    showFile(tag) {
      if (this.show === false) {
        const id = tag.id
        getFileList(id).then((res) => {
          console.log(res, 'list')
          tag.fileList = res.data
          this.show = true
          if (res.data.length === 0) {
            this.$message({
              message: '接口数据已更新，请刷新页面',
              type: 'info'
            })
          }
        })
      } else {
        // this.interfaceList = JSON.parse(JSON.stringify(this.test))
        tag.fileList = []
        this.show = false
      }
    },
    downloadFile(file) {
      const loading = this.$loading({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      downloadAuthen(file.fileId)
        .then((res) => {
          downloadFile(res.data, file.fileName)
          this.$message({
            type: 'success',
            message: '下载成功!'
          })
          loading.close()
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '下载失败!'
          })
          loading.close()
        })
    },
    search() {
      this.drawer = true
    },
    closeDrawer() {
      this.drawer = false
    },
    searchList() {
      this.nodeIds = this.$refs.search.nodeIds
      this.getList()
    },
    showDesc(id) {
      this.showSearch = true
      this.nodeTypeDesc = []
      console.log(id, 'id')
      getDescList(id).then((res) => {
        this.nodeTypeDesc = res.data
        this.showSearch = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.empty-main {
  min-height: calc(100vh - 475px);
}
.main {
  // min-height: 481px;
  width: 100%;
  // background: url('../../../../assets/style/tabBg.png') no-repeat;
  background-color: #fff;
  // padding: 23px 0 1px;
  .empty {
    background-color: #edf4ff;
    .empty-main {
      min-height: calc(100vh - 475px);
    }
    .empty-box {
      text-align: center;
      img {
        margin: 24px auto 0;
      }
      p {
        margin: 7px auto;
        font-size: 12px;
        font-weight: 400;
        color: #a3b1bf;
      }
      .empty-tip {
        font-size: 16px;
      }
    }
  }
  .list-box:nth-of-type(odd) {
    background-color: #edf4ff;
    .list-main {
      background: url('../../../../assets/style/tabBg.png') no-repeat;
    }
  }
  .search {
    margin-top: 23px;
  }
  .search-box {
    width: 1220px;
    margin: 0 auto;
  }
  .search-btn {
    width: 130px;
    height: 40px;
    background-color: #2c76d1;
    cursor: pointer;
    padding: 12px 17px;
    margin-bottom: 36px;
    .img {
      float: left;
      margin-right: 10px;
    }
    .text {
      font-size: 16px;
      color: #fff;
    }
  }
  .list-box {
    margin-bottom: 8px;
    // margin-bottom: 61px;
    .list-head {
      width: 100%;
      // margin: 0 auto;
      display: flex;
      justify-content: space-between;
      .title {
        width: 89%;
        font-size: 20px;
        font-weight: bold;
        color: #333333;
      }
      .download {
        cursor: pointer;
        margin-bottom: 24px;
        div {
          width: 24px;
          height: 24px;
          float: left;
          margin-right: 8px;
        }
        span {
          font-size: 16px;
          font-weight: bold;
          line-height: 27px;
          color: #2c6ec0;
        }
      }
    }
    .list-main {
      width: 1220px;
      margin: 0 auto;
      padding: 23px 0 30px;
    }
    .position-card {
      position: absolute;
      border-radius: 15px;
      width: 100%;
      height: 100%;
      z-index: 1;
    }
    .box-card:hover .position-card {
      border: 1px solid #6ac0ff;
      box-shadow: 0px 0px 20px rgba(0, 118, 253, 0.3);
    }
    .box-card {
      position: relative;
      width: 287px;
      background: #ffffff;
      border-radius: 15px;
      // border: 1px solid rgba(255, 255, 255, 0);
      box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
      // margin-left: 24px;
      float: left;
      .card-main {
        padding: 0 0 18px;
        // padding: 18px 20px;
        .empty-card {
          height: 30px;
          line-height: 44px;
          text-align: center;
          font-size: 14px;
          color: #333;
        }
        .tag-list {
          p {
            height: 19px;
            font-size: 14px;
            font-weight: 400;
            line-height: 19px;
            color: #333333;
          }
          .number {
            // width: 66px;
            // margin: 10px 0;
            width: 86px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            z-index: 2;
          }
          /deep/.el-input__inner {
            // padding: 0 10px !important;
            padding: 0 17px 0 10px !important;
            // width: 90% !important;
            margin-top: 8px;
            // border: 0;
            border: 1px solid #e6e6e6;
            font-size: 13px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            // width: 76px;
            width: 86px;
          }
          /deep/.el-input__suffix {
            right: -3px;
          }
          /deep/.el-input__icon {
            margin-top: 3px;
          }
          .name {
            // width: 66px;
            width: 86px;
          }
          .open-list {
            z-index: 2;
            color: #0050b3;
            // width: 50px;
            width: 52px;
            display: flex;
            justify-content: space-between;
            cursor: pointer;
            span {
              line-height: 20px;
            }
          }
          .tag {
            display: flex;
            justify-content: space-between;
            padding: 0 20px;
            border-bottom: 1px solid #e6e6e6;
          }
          .file-list {
            width: 100%;
            background: #f9f9fb;
            padding: 0 !important;
            margin: 0 !important;
            li {
              list-style: none;
              // margin-bottom: 15px;
              // margin-bottom: 10px;
              // height: 19px;
              min-height: 19px;
              font-size: 14px;
              font-weight: 400;
              line-height: 19px;
              color: #0050b3;
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 8px 20px;
              border-bottom: 1px solid #e6e6e6;
              span {
                width: 218px;
                word-break: normal;
                white-space: pre-wrap;
                word-wrap: break-word;
              }
              img {
                z-index: 2;
                cursor: pointer;
                height: 19px;
                margin-left: 10px;
              }
            }
          }
        }
        .card-footer {
          // margin-left: 79px;
          // margin-top: 14px;
          margin: 14px auto 0;
          width: 80px;
          height: 19px;
          font-size: 14px;
          font-weight: 400;
          line-height: 20px;
          color: #0050b3;
          display: flex;
          justify-content: space-between;
          cursor: pointer;
          span {
            z-index: 2;
          }
        }
      }
    }
  }
  /deep/.el-tooltip__popper.is-dark {
    background: #214574 !important;
  }
  /deep/.el-drawer__header {
    margin-bottom: 17px;
    font-size: 20px;
    font-weight: bold;
    line-height: 26px;
    color: #303030;
  }
  .dialog-download {
    color: #0050b3;
    cursor: pointer;
  }
  // /deep/.el-drawer__body {
  //   overflow: auto;
  // }
  .package-title {
    color: #0050b3;
    cursor: default;
  }
}
.el-dropdown {
  width: 218px;
  z-index: 2;
}
.el-dropdown-menu {
  padding: 6px 0;
  margin-top: 5px;
  margin-left: 30px;
  background-color: #214574;
  border: unset;
  border-radius: 4px;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
}
.el-dropdown-menu__item {
  line-height: 24px;
  color: #fff;
  font-size: 12px;
  // padding: 0 8px !important;
  padding: 0 7px !important;
  &:hover {
    background-color: #214574;
    color: #fff;
    cursor: default;
  }
}
::v-deep .popper__arrow {
  display: none;
  &::after {
    display: none;
  }
}
.el-table thead {
  color: #303030;
}
::v-deep :focus {
  outline: 0;
}
/deep/.el-table {
  color: #303030;
}
/deep/.show-search {
  width: 330px;
  .el-table {
    color: #fff !important;
    tr {
      background-color: #214574;
      > td:last-child {
        display: none;
      }
    }
    td {
      padding: 0;
    }
  }
}
</style>
<style lang="scss">
body > .atooltip {
  background: #214574 !important;
  .popper__arrow {
    // left: 170px !important;
    left: 47% !important;
    border-top-color: #214574 !important;
  }
  .popper__arrow::after {
    border-top-color: #214574 !important;
  }
}
</style>
