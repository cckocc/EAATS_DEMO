<template>
  <div v-loading="loading" class="secondblock">
    <div class="left">
      <!--<div class="left-button">
        <el-button type="primary" icon="el-icon-document" class="round-button" @click="dialogVisible = true">
          IMIX简介
        </el-button>
      </div>-->
      <div class="left-group">
        <div class="group-item">
          <div class="name">协议版本</div>
          <div class="group-input">
            <el-select v-model="query.protocolVersion" placeholder="请选择" @change="changeVersion">
              <el-option
                v-for="item in options"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </div>
        </div>
        <div class="group-item">
          <div class="name">报文类型</div>
          <div class="group-input2">
            <el-input v-model.trim="query.msgType" placeholder="" clearable />
          </div>
          <el-button class="group-button" type="primary" @click="queryByType()">GO</el-button>
        </div>
        <div class="group-item">
          <div class="name">组件名</div>
          <div class="group-input2">
            <el-input v-model.trim="query.componentName" placeholder="" clearable />
          </div>
          <el-button class="group-button" type="primary" @click="queryByComponent(query.componentName)">GO</el-button>
        </div>
        <div class="group-item">
          <div class="name">域名</div>
          <div class="group-input2">
            <el-input v-model.trim="query.fieldName" placeholder="" clearable />
          </div>
          <el-button class="group-button" type="primary" @click="queryByFieldName()">GO</el-button>
        </div>
        <div class="group-item">
          <div class="name">域号</div>
          <div class="group-input2">
            <el-input v-model.trim="query.number" placeholder="" clearable />
          </div>
          <el-button class="group-button" type="primary" @click="queryByFieldNumber()">GO</el-button>
        </div>
        <div class="group-item">
          <div class="name">注释</div>
          <div class="group-input2">
            <el-input v-model.trim="query.comments" placeholder="" clearable />
          </div>
          <el-button class="group-button" type="primary" @click="queryByComments()">GO</el-button>
        </div>
      </div>
      <div class="left-collapse">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="Components" name="1">
            <div>
              <el-button type="text" @click="queryComponentByName">By Name</el-button>
            </div>
          </el-collapse-item>
          <el-collapse-item title="Datatypes" name="2">
            <div>
              <el-button type="text" @click="queryDatatypes">IMIX datatypes</el-button>
            </div>
          </el-collapse-item>
          <el-collapse-item title="Message Summary" name="3">
            <div>
              <el-button type="text" @click="queryByMessageSummary(1)">By Category</el-button>
            </div>
            <div>
              <el-button type="text" @click="queryByMessageSummary(2)">By Name</el-button>
            </div>
            <div>
              <el-button type="text" @click="queryByMessageSummary(3)">By Message Type</el-button>
            </div>
          </el-collapse-item>
          <el-collapse-item title="Application Level Messages" name="4" @click.native="handleChangeActiveNames(4)">
            <div>
              <el-tree
                :data="tradeOption"
                :props="defaultProps"
                @node-click="handleNodeClick"
              >
                <span slot-scope="{ node, data }" :title="data.name" class="slot-tree-node">{{ data.name }}</span>
              </el-tree>
            </div>
          </el-collapse-item>
          <el-collapse-item title="Session Layer" name="5" class="session-layer" @click.native="handleChangeActiveNames(5)">
            <div v-show="sessionMessageList.length > 0">
              <a href="javascript: void (0)" @click="showSessionMessage = !showSessionMessage">Messages</a>
            </div>
            <el-collapse-transition>
              <div v-show="showSessionMessage" class="session-list">
                <div v-for="item in sessionMessageList">
                  <el-button type="text" @click="queryByMessageId(item)">{{ item.mname }}</el-button>
                </div>
              </div>
            </el-collapse-transition>
            <div>
              <a href="javascript: void (0)" @click="showSessionComponent = !showSessionComponent">Components</a>
            </div>
            <el-collapse-transition>
              <div v-show="showSessionComponent" class="session-list">
                <div v-for="item in sessionComponentList">
                  <el-button type="text" @click="queryComponentList(item)">{{ item.name }}</el-button>
                </div>
              </div>
            </el-collapse-transition>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <div class="right">
      <div id="svgBox">
        <div id="svgTop">
          <template v-if="activeTableIndex === 5">
            <div class="right-subtitle">
              Search Results for regex
              '<i>{{ query.comments }}</i>'
            </div>
            <div class="right-subtitle">Message Names</div>
            <div v-for="(item,index) in list.messageDtos" :key="item.name+index">
              <el-button type="text" @click="queryByMessageId(item)">{{ item.name }}</el-button>
            </div>
            <div class="right-subtitle">Component Names</div>
            <div v-for="(item,index) in list.componentDtos" :key="item.name+index">
              <el-button type="text" @click="queryByComponent(item.name)">{{ item.name }}</el-button>
            </div>
            <div class="right-subtitle">Field Names</div>
            <div v-for="(item,index) in list.fieldDtos" :key="item.name+index">
              <el-button type="text" @click="handleShowDetail(item)">{{ item.name }}</el-button>
            </div>
          </template>
          <template v-if="activeTableIndex === 4">
            <table class="ListTable">
              <tbody>
                <tr>
                  <th class="Hdr">Type</th>
                  <th class="Hdr">Name</th>
                  <th class="Hdr">Category</th>
                  <th class="Hdr">Section</th>
                  <th class="Hdr">Description</th>
                </tr>
                <tr v-for="(item,index) in list">
                  <td :class="{'FldOdd':index%2 == 0,'FldEven':index%2 == 1}">
                    <a href="javascript: void(0)" @click="queryByMessageId(item)">{{ item.mtype }}</a>
                  </td>
                  <td :class="{'FldOdd':index%2 == 0,'FldEven':index%2 == 1}">
                    <a href="javascript: void(0)" @click="queryByMessageId(item)">{{ item.mname }}</a>
                  </td>
                  <td :class="{'FldOdd':index%2 == 0,'FldEven':index%2 == 1}">{{ item.category }}</td>
                  <td :class="{'FldOdd':index%2 == 0,'FldEven':index%2 == 1}">{{ item.session }}</td>
                  <td :class="{'FldOdd':index%2 == 0,'FldEven':index%2 == 1}">{{ item.description }}</td>
                </tr>
              </tbody>
            </table>
          </template>
          <template v-if="activeTableIndex === 3">
            <table class="DTTable">
              <tbody>
                <tr>
                  <th class="Hdr">Type Name</th>
                  <th class="Hdr">Base Type</th>
                  <th class="Hdr">Description</th>
                </tr>
                <tr v-for="(item,index) in list">
                  <td :class="{'FldOdd':index%2 == 0,'FldEven':index%2 == 1}">{{ item.typename }}</td>
                  <td :class="{'FldOdd':index%2 == 0,'FldEven':index%2 == 1}">{{ item.basetype }}</td>
                  <td :class="{'FldOdd':index%2 == 0,'FldEven':index%2 == 1}">{{ item.description }}</td>
                </tr>
              </tbody>
            </table>
          </template>
          <template v-if="activeTableIndex === 2">
            <table class="ListTable">
              <tbody>
                <tr>
                  <th class="Hdr">Name</th>
                  <th class="Hdr">Category</th>
                  <th class="Hdr">Repeating</th>
                  <th class="Hdr">Description</th>
                </tr>
                <tr v-for="(item,index) in list">
                  <td :class="{'FldOdd':index%2 == 0,'FldEven':index%2 == 1}">
                    <a href="javascript: void(0) " @click="queryComponentList(item)">{{ item.name }}</a>
                  </td>
                  <td :class="{'FldOdd':index%2 == 0,'FldEven':index%2 == 1}" />
                  <td :class="{'FldOdd':index%2 == 0,'FldEven':index%2 == 1}" align="center">{{ item.isrepeat }}</td>
                  <td :class="{'FldOdd':index%2 == 0,'FldEven':index%2 == 1}">{{ item.description }}</td>
                </tr>
              </tbody>
            </table>
          </template>
          <template v-if="activeTableIndex === 1">
            <template v-if="list !=null && list.length !== 0">
              <template v-if="searchType === 'component'">
                <div class="right-title">{{ imixName }} Component</div>
                <div class="right-subtitle">{{ name }}</div>
                <div class="right-body">{{ description }}</div>
              </template>
              <template v-else>
                <div class="right-title">{{ imixName }} Message</div>
                <div class="right-subtitle">{{ name }}({{ msgtype }})</div>
                <div class="right-body">{{ commentcn }}</div>
              </template>
              <div class="right-table">
                <table class="HeaderTable">
                  <tbody>
                    <tr>
                      <td class="MsgINDENT0Lines" />
                      <th class="MsgTagHdrContent">Field or Component</th>
                      <th class="MsgFldHdrContent">Field or Component Name</th>
                      <!--<th class="MsgXMLnameHdrContent">IMIXML</th>-->
                      <th class="MsgXMLnameHdrContent">Datatype</th>
                      <th class="MsgRqdHdrContent">Req'd</th>
                      <th class="MsgCmtHdrContent">Comments</th>
                    </tr>
                  </tbody>
                </table>
                <TableGroup
                  v-for="(item,index) in list"
                  :key="item.id?item.id+index:item.childid+index"
                  :protocol-version="query.protocolVersion"
                  :is-last="index === list.length - 1"
                  :is-first="index === 0"
                  :item="item"
                  :level="isrepeat ==='1'?2:0"
                  :isrepeat="isrepeat"
                  :isParentComponent="false"
                />
              </div>
            </template>
            <template v-else>
              <div class="right-title">暂无数据</div>
            </template>
          </template>
        </div>
        <div id="svgResize" />
        <div id="svgDown" style="border-top: 1px solid #b5b9a9; ">
          <template v-if="activeBottomIndex === 1">
            <table>
              <tbody>
                <tr>
                  <th class="FldTagHdr">Tag</th>
                  <th class="FldNameHdr">Field Name</th>
                  <th class="FldNameHdr">Packtype</th>
                  <th class="FldDatHdr">Type</th>
                  <th class="FldDesHdr">Uniontype</th>
                  <th class="FldDesHdr">Description</th>
                </tr>
                <tr>
                  <td class="FldTagEven">{{ protocolTable.number }}</td>
                  <td class="FldNameEven">{{ protocolTable.name }}</td>
                  <td class="FldNameEven">{{ protocolTable.packtype }}</td>
                  <td class="FldDatEven">{{ protocolTable.type }}</td>
                  <td class="FldDesEven">{{ protocolTable.uniontype }}</td>
                  <td class="FldDesEven">
                    {{ protocolTable.commentcn }}
                    <br>
                    <br>
                    <br>
                    <br>
                  </td>
                </tr>
              </tbody>
            </table>
            <div>
              <hr>
              Used in messages:
              <div class="TagUsedIn">
                <template v-for="item in filedParentMessage">
                  [<a href="javascript: void(0)" @click="queryByMessageId(item)">{{ item.name }}</a>]
                </template>
              </div>
              <hr>
              Used in components:
              <div class="TagUsedIn">
                <template v-for="item in filedParentComparent">
                  [<a href="javascript: void(0)" @click="queryComponentList(item)">{{ item.name }}</a>]
                </template>
              </div>
            </div>
          </template>
          <template v-if="activeBottomIndex === 2">
            <div>
              <h3>Component {{ componentParentName }}</h3>
              <hr>
              Used in messages:
              <div class="TagUsedIn">
                <template v-for="item in componentParentMessage">
                  [<a href="javascript: void(0)" @click="queryByMessageId(item)">{{ item.name }}</a>]
                </template>
              </div>
              <hr>
              Used in components:
              <div class="TagUsedIn">
                <template v-for="item in componentParentComparent">
                  [<a href="javascript: void(0)" @click="queryComponentList(item)">{{ item.name }}</a>]
                </template>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import TableGroup from './tableGroup'
import ElCollapseTransition from 'element-ui/lib/transitions/collapse-transition'
import {
  getVersion,
  queryByType,
  queryByComponent,
  queryByFieldName,
  queryByFieldNumber,
  queryByComments,
  queryComponentByName,
  queryComponentList,
  queryDatatypes,
  queryByCategory,
  queryByMessageName,
  queryByMessageType,
  queryByMessageId,
  queryFieldParentComparent,
  queryFieldParentMessage,
  queryComponentParentComparent,
  queryComponentParentMessage,
  queryAlltrade,
  queryAllByVersion,
  querySessionMessage,
  querySessionComponent
} from '@/api/dict'

const listQuery = {
  msgType: '',
  componentName: '',
  fieldName: '',
  comments: ''
}
export default {
  componentName: 'DictionaryLookup',
  components: {
    TableGroup
  },
  data() {
    return {
      loading: false,
      activeNames: [],
      options: [],
      query: {
        msgType: '',
        protocolVersion: '1',
        componentName: '',
        fieldName: '',
        number: '',
        comments: ''
      },
      list: [],
      activeTableIndex: 0,
      commentcn: '',
      msgtype: '',
      name: '',
      imixName: '',
      description: '',
      searchType: '',
      filedParentComparent: [],
      filedParentMessage: [],
      componentParentName: '',
      componentParentComparent: [],
      componentParentMessage: [],
      protocolTable: {},
      activeBottomIndex: 0,
      tradeOption: [],
      defaultProps: {
        children: 'mesgDtos',
        label: 'name'
      },
      sessionMessageList: [],
      sessionComponentList: [],
      showSessionMessage: false,
      showSessionComponent: false,
      isrepeat: '0'
    }
  },
  created() {
    this.$on('child-to-p1', this.handleShowDetail)
    this.$on('child-to-p2', this.handleShowComponentParent)
    this.getVersion()
    // this.queryAllByVersion();
  },
  mounted() {
    this.dragControllerDiv()
  },
  methods: {
    async getVersion() {
      const r = await getVersion()
      this.options = r.data
      this.query.protocolVersion = r.data[0].id
      this.imixName = r.data[0].name
    },
    async querySessionMessage() {
      const { protocolVersion } = this.query
      const params = { protocolVersion }
      const r = await querySessionMessage(params)
      this.sessionMessageList = r.data
    },
    async querySessionComponent() {
      const { protocolVersion } = this.query
      const params = { protocolVersion }
      const r = await querySessionComponent(params)
      this.sessionComponentList = r.data
    },
    async queryAlltrade() {
      const { protocolVersion } = this.query
      const { data } = await queryAlltrade({ protocolVersion })
      const list = []
      Object.keys(data).forEach(key => {
        const option = {
          name: key,
          mesgDtos: data[key]
        }
        list.push(option)
      })
      this.tradeOption = list
    },
    handleNodeClick(data) {
      const { id, mesgDtos, name } = data
      if ((!mesgDtos || mesgDtos.length === 0) && !!id) {
        this.queryByMessageId(data)
      }
    },
    changeVersion(value) {
      this.query = Object.assign({ protocolVersion: value }, listQuery)
      this.activeNames = []
      this.tradeOption = []
      this.sessionMessageList = []
      this.sessionComponentList = []
      this.list = []
      this.activeTableIndex = 0
      this.activeBottomIndex = 0
      try {
        this.options.forEach(item => {
          if (item.id === value) {
            this.imixName = item.name
            throw 'complete'
          }
        })
      } catch (e) {

      }
    },
    async queryAllByVersion() {
      try {
        this.loading = true
        const { protocolVersion } = this.query
        const param = { protocolVersion }
        const r = await queryAllByVersion(param)
        const { commentcn, components, fields, msgtype, name } = r.data
        if (components != null) {
          this.list = JSON.parse(JSON.stringify(components.concat(fields)));
        } else {
          this.list = JSON.parse(JSON.stringify(fields));
        }
        this.commentcn = commentcn
        this.msgtype = msgtype
        this.name = name
        this.activeTableIndex = 1
        this.isrepeat = '0'
        this.searchType = ''
      } catch (e) {

      }
      this.loading = false
    },
    async queryByType() {
      try {
        this.loading = true
        const { msgType, protocolVersion } = this.query
        if (msgType && protocolVersion) {
          const param = { msgType, protocolVersion }
          const r = await queryByType(param)
          const { commentcn, components, fields, msgtype, name } = r.data
          if (components != null) {
            this.list = JSON.parse(JSON.stringify(components.concat(fields)));
          } else {
            this.list = JSON.parse(JSON.stringify(fields));
          }

          this.commentcn = commentcn
          this.msgtype = msgtype
          this.name = name
          this.searchType = ''
          this.activeTableIndex = 1
          this.isrepeat = '0'
        } else {
          this.$message({
            message: '请输入报文类型',
            type: 'warning'
          })
        }
      } catch (e) {

      }
      this.loading = false
    },
    async queryByComponent(componentName) {
      try {
        this.loading = true
        const { protocolVersion } = this.query
        if (componentName && protocolVersion) {
          const param = { componentName, protocolVersion }
          const r = await queryByComponent(param)
          const { descripton, componentLists, fields, name } = r.data
          if (componentLists != null) {
            this.list = JSON.parse(JSON.stringify(componentLists.concat(fields)));
          } else {
            this.list = JSON.parse(JSON.stringify(fields));
          }
          this.name = name
          this.description = descripton
          this.searchType = 'component'
          this.activeTableIndex = 1
          this.isrepeat = '0'
        } else {
          this.$message({
            message: '请输入组件名',
            type: 'warning'
          })
        }
      } catch (e) {
        console.error(e)
      }
      this.loading = false
    },
    async queryByFieldName() {
      try {
        this.loading = true
        const { fieldName, protocolVersion } = this.query
        if (fieldName && protocolVersion) {
          const param = { fieldName, protocolVersion }
          const r = await queryByFieldName(param)
          this.handleShowDetail(r.data)
        } else {
          this.$message({
            message: '请输入域名',
            type: 'warning'
          })
        }
      } catch (e) {

      }
      this.loading = false
    },
    async queryByFieldNumber() {
      try {
        this.loading = true
        const { number, protocolVersion } = this.query
        if (number && protocolVersion) {
          const param = { number, protocolVersion }
          const r = await queryByFieldNumber(param)
          this.handleShowDetail(r.data)
        } else {
          this.$message({
            message: '请输入域号',
            type: 'warning'
          })
        }
      } catch (e) {

      }
      this.loading = false
    },
    async queryByComments() {
      try {
        this.loading = true
        const { comments, protocolVersion } = this.query
        if (comments && protocolVersion) {
          const param = { comments, protocolVersion }
          const r = await queryByComments(param)
          this.list = JSON.parse(JSON.stringify(r.data));
          this.activeTableIndex = 5
        } else {
          this.$message({
            message: '请输入注释',
            type: 'warning'
          })
        }
      } catch (e) {

      }
      this.loading = false
    },
    async queryComponentByName() {
      try {
        this.loading = true
        const { protocolVersion } = this.query
        const param = { protocolVersion }
        const r = await queryComponentByName(param)
        this.list = JSON.parse(JSON.stringify(r.data));
        this.activeTableIndex = 2
      } catch (e) {

      }
      this.loading = false
    },
    async queryComponentList(item) {
      try {
        this.loading = true
        const { protocolVersion } = this.query
        const { id } = item
        const param = { protocolVersion, id }
        const r = await queryComponentList(param)
        const { componentLists, fields, descripton, name,isrepeat } = r.data
        let list = null;
        if (componentLists != null) {
          list = JSON.parse(JSON.stringify(componentLists.concat(fields)));
        } else {
          list = JSON.parse(JSON.stringify(fields));
        }
        if(isrepeat){
          this.isrepeat = '1';
          list.push({ number: 'end Repeating Group',repeatType:'1',id:'1' });
        }else {
          this.isrepeat = '0';
        }
        this.list = list;
        this.description = descripton
        this.name = name
        this.activeTableIndex = 1
        this.searchType = 'component'
      } catch (e) {

      }
      this.loading = false
    },
    async queryDatatypes() {
      try {
        this.loading = true
        const r = await queryDatatypes()
        this.list = JSON.parse(JSON.stringify(r.data));
        this.activeTableIndex = 3
      } catch (e) {

      }
      this.loading = false
    },
    async queryByMessageSummary(type) {
      try {
        this.loading = true
        const { protocolVersion } = this.query
        const param = { protocolVersion }
        let r = null
        switch (type) {
          case 1:
            r = await queryByCategory(param)
            break
          case 2:
            r = await queryByMessageName(param)
            break
          case 3:
            r = await queryByMessageType(param)
            break
        }
        this.list = JSON.parse(JSON.stringify(r.data));
        this.activeTableIndex = 4
      } catch (e) {

      }
      this.loading = false
    },
    async queryByMessageId(item) {
      this.loading = true
      try {
        const { protocolVersion } = this.query
        const { id } = item
        const param = { protocolVersion, id }
        const r = await queryByMessageId(param)
        if (r.data != null) {
          const { commentcn, components, fields, msgtype, name } = r.data
          if (components != null) {
            this.list = JSON.parse(JSON.stringify(components.concat(fields)));
          } else {
            this.list = JSON.parse(JSON.stringify(fields));
          }

          this.commentcn = commentcn
          this.msgtype = msgtype
          this.name = name
          this.activeTableIndex = 1
        } else {
          this.list = []
          this.commentcn = ''
          this.msgtype = ''
          this.name = ''
          this.activeTableIndex = 1
        }
        this.searchType = ''
        this.isrepeat = '0'
      } catch (e) {

      }
      this.loading = false
    },
    async queryFieldParentComparent(fid) {
      const { protocolVersion } = this.query
      const params = { protocolVersion, fid }
      const r = await queryFieldParentComparent(params)
      this.filedParentComparent = r.data
    },
    async queryFieldParentMessage(fid) {
      const { protocolVersion } = this.query
      const params = { protocolVersion, fid }
      const r = await queryFieldParentMessage(params)
      this.filedParentMessage = r.data
    },
    async queryComponentParentComparent(cid) {
      const { protocolVersion } = this.query
      const params = { protocolVersion, cid }
      const r = await queryComponentParentComparent(params)
      this.componentParentComparent = r.data
    },
    async queryComponentParentMessage(cid) {
      const { protocolVersion } = this.query
      const params = { protocolVersion, cid }
      const r = await queryComponentParentMessage(params)
      this.componentParentMessage = r.data
    },
    handleShowDetail(item) {
      this.protocolTable = Object.assign({}, item)
      const { id } = item
      this.queryFieldParentComparent(id)
      this.queryFieldParentMessage(id)
      this.activeBottomIndex = 1
    },
    handleShowComponentParent(item) {
      const { childid, name } = item
      this.componentParentName = name
      this.queryComponentParentComparent(childid)
      this.queryComponentParentMessage(childid)
      this.activeBottomIndex = 2
    },
    handleChange(val) {

    },
    handleChangeActiveNames(type) {
      if (type === 4 && this.tradeOption.length === 0) {
        this.queryAlltrade()
      }
      if (type === 5 && this.sessionMessageList.length === 0) {
        this.querySessionMessage()
        this.querySessionComponent()
      }
    },
    dragControllerDiv() {
      this.$nextTick(() => {
        var svgResize = document.getElementById('svgResize')
        var svgTop = document.getElementById('svgTop')
        var svgDown = document.getElementById('svgDown')
        var svgBox = document.getElementById('svgBox')
        svgResize.onmousedown = function(e) {
          var startY = e.clientY
          svgResize.top = svgResize.offsetTop
          document.onmousemove = function(e) {
            var endY = e.clientY
            var moveLen = svgResize.top + (endY - startY)
            var maxT = svgBox.clientHeight - svgResize.offsetHeight
            if (moveLen < 30) moveLen = 30
            if (moveLen > maxT - 30) moveLen = maxT - 30
            svgResize.style.top = moveLen
            svgTop.style.height = moveLen + 'px'
            svgDown.style.height = (svgBox.clientHeight - moveLen - 5) + 'px'
          }
          document.onmouseup = function(evt) {
            document.onmousemove = null
            document.onmouseup = null
            svgResize.releaseCapture && svgResize.releaseCapture()
          }
          svgResize.setCapture && svgResize.setCapture()
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss">
  @import "~@/styles/fixstyle.scss";
</style>
<style lang="scss" scoped>
  .secondblock {
    display: flex;
    flex-direction: row;

    .left {
      width: 310px;
      height: 780px;
      background: rgba(246, 247, 251, 1);
      border: 1px solid rgba(235, 235, 235, 1);
      opacity: 1;
      overflow: auto;

      .left-button {
        padding: 20px 187px 21.5px 20px;
        border-bottom: 1px solid rgba(235, 235, 235, 1);
        opacity: 1;

        .round-button {
          border-radius: 3px;
        }
      }

      .left-group {
        padding: 18.5px 19.5px 20.25px 20px;

        .group-item {
          display: flex;
          flex-direction: row;
          align-items: center;
          margin-bottom: 20px;

          .name {
            width: 70px;
            margin-right: 10px;
            font-size: 14px;
            line-height: 19px;
            color: rgba(51, 51, 51, 1);
            opacity: 1;
          }

          .group-input {
            width: 193px;
          }

          .group-input2 {
            width: 157px;
          }

          .group-button {
            width: 30px;
            height: 30px;
            padding: 0 2px;
            margin-left: 6px;
            border-radius: 2px;
          }
        }
      }

      .left-collapse {
        .session-list {
          padding-left: 20px;
        }
      }

      ::v-deep.slot-tree-node {
        max-width: 190px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }

    .right {
      width: 855px;
      height: 780px;
      overflow: auto;
      padding-left: 10px;
      padding-right: 10px;
      display: flex;
      flex-direction: column;
      align-items: center;

      .right-title {
        font-size: 20px;
        line-height: 26px;
        color: rgba(51, 51, 51, 1);
        -webkit-text-stroke: 1 rgba(51, 51, 51, 1);
        text-align: center;
        opacity: 1;
        margin-top: 21.5px;
        font-weight: bold;
      }

      .right-subtitle {
        font-size: 16px;
        line-height: 21px;
        color: rgba(51, 51, 51, 1);
        text-align: center;
        opacity: 1;
        margin-top: 14px;
        font-weight: bold;
      }

      .right-body {
        font-size: 14px;
        line-height: 26px;
        color: rgba(51, 51, 51, 1);
        opacity: 1;
        margin-top: 7px;
      }

      .right-table {
        margin-top: 20px;
        /*width: 855px;*/

        ::v-deep.el-table th {
          background-color: #F6F7FB;
        }

        ::v-deep .cell {
          font-size: 14px;
          line-height: 19px;
          color: rgba(51, 51, 51, 1);
          -webkit-text-stroke: 1 rgba(0, 0, 0, 1);
          opacity: 1;
        }

        /*::v-deep .el-table__row:nth-child(7n+1) div {
          font-size: 14px;
          font-family: MicrosoftYaHei;
          line-height: 19px;
          color: rgba(44, 117, 208, 1);
          -webkit-text-stroke: 1 rgba(44, 117, 208, 1);
          opacity: 1;
          font-weight: bold;
        }*/
      }
    }
  }

  .left-collapse {
    ::v-deep .el-collapse-item__header {
      background-color: #F6F7FB;
      margin-left: 20px;
    }

    ::v-deep .el-collapse-item__content {
      padding: 0 20px 0 20px;
      background-color: #F6F7FB;
    }

    ::v-deep .el-tree-node__content {
      background-color: #EDF0F8;
    }
  }

  .right-dialog {
    ::v-deep .el-table__header {
      display: none;
    }

    ::v-deep .el-table__header {
      background: rgba(0, 0, 0, 0);
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.26);
      opacity: 1;
    }

    ::v-deep .el-table__row td:first-child {
      background-color: #F6F7FB;
    }
  }

  #svgBox {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;

    #svgTop {
      height: calc(70% - 5px);
      width: 100%;
      overflow: auto;
    }

    #svgResize {
      position: relative;
      height: 10px;
      width: 100%;
      cursor: s-resize;
    }

    #svgDown {
      height: 30%;
      width: 100%;
      overflow: auto;
      padding: 5px 0;
      box-sizing: border-box;
    }
  }

</style>
