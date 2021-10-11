<template>
  <div>
    <table class="BodyTable">
      <tbody>
      <tr class="NotDepr">
        <template v-if="level == 0">
          <td class="MsgINDENT0Lines"></td>
        </template>
        <template v-else-if="level == 1">
          <td v-if="itemData.repeatType === '2'" class="MsgINDENT0Lines"></td>
          <td v-else class="MsgINDENT0LinesInlineComponent0"></td>
        </template>
        <template v-else>
          <td v-if="isFirst" :class="`MsgGS${level-2}LinesInlineComponent${level-1}`"></td>
          <td v-if="!isFirst && !isLast" :class="`MsgINDENT${level-1}LinesInlineComponent${level-1}`"></td>
          <td v-if="isLast" :class="`MsgGE${level-2}LinesInlineComponent${level-1}`"></td>
        </template>
        <template v-if="isComponent">
          <td class="MsgTagContent">
            <a @click="queryMessageList()" href="javascript:void(0)">
              <b>Component</b>
              <span class="inlcmp" v-show="show">(-)</span>
            </a>
          </td>
          <td class="MsgFldContent">
            <a @click="queryMessageList()" href="javascript:void(0)">
              <b>{{itemData.name}}</b>
            </a>
          </td>
          <!--<td class="MsgXMLnameContent"/>-->
          <td class="MsgXMLnameContent"/>
          <td class="MsgRqdContent">
            <img v-if="itemData.neeed" src="@/assets/icon/checkmark.gif" alt="">
          </td>
          <td class="MsgCmtContent"/>
        </template>
        <template v-else>
          <td class="MsgTagContent">
            <i v-if="(isrepeat === '1' && itemData.repeatType === '1') || itemData.repeatType === '2'" v-html="itemData.number"></i>
            <a v-else @click="showDetail(itemData)" href="javascript:void(0)">
              <i v-show="isrepeat === '1' && isFirst">Repeating Group</i>
              {{itemData.number}}
            </a>
          </td>
          <td class="MsgFldContent">
            <a @click="showDetail(itemData)" v-if="itemData.name" href="javascript:void(0)">
              <b v-if="isrepeat === '1' && isFirst">{{itemData.name}}</b>
              <span v-else>{{itemData.name}}</span>
            </a>
          </td>
          <td class="MsgXMLnameContent">
            <span v-show="(isrepeat !== '1' || !isFirst) && itemData.repeatType != '2'">{{ itemData.type }}</span>
          </td>
          <td class="MsgRqdContent">
            <img v-if="itemData.neeed" src="@/assets/icon/checkmark.gif" alt="">
          </td>
          <td class="MsgCmtContent">
            <span v-show="isrepeat !== '1' || !isFirst">{{ itemData.commenten }}</span>
          </td>
        </template>
      </tr>
      <tr v-if="isParentComponent && isLast">
        <td :class="`MsgINDENT${level-2}LinesInlineComponent${level-2}`"></td>
        <td class="MsgTagContent">
          <i>end</i>
          <br>
          <i>Component</i>
        </td>
        <td class="MsgFldContent"></td>
        <td class="MsgXMLnameContent"></td>
        <td class="MsgRqdContent"></td>
        <td class="MsgCmtContent"></td>
      </tr>
      </tbody>
    </table>
    <div class="InlineComponent">
      <el-collapse-transition v-if="isComponent">
        <div v-show="show">
          <TableGroup
            v-for="(t,index) in itemData.componentLists"
            :key="t.id?t.id+index:t.childid+index"
            :protocolVersion="protocolVersion"
            :is-end="isComponent"
            :is-last="index === itemData.componentLists.length - 1"
            :is-first="index === 0"
            :item="t"
            :level="currentLevel"
            :isrepeat="itemRepeat"
            :isParentComponent="true"
          />
        </div>
      </el-collapse-transition>
    </div>
  </div>
</template>

<script>
import ElCollapseTransition from 'element-ui/lib/transitions/collapse-transition'
import { queryComponentList } from '@/api/dict'
import Emitter from 'element-ui/lib/mixins/emitter'

export default {
  name: 'TableGroup',
  mixins: [Emitter],
  components: {
    ElCollapseTransition
  },
  props: {
    item: {
      type: Object,
      default: null
    },
    protocolVersion: {
      type: String,
      default: '1'
    },
    level: {
      type: Number,
      default: 1
    },
    isEnd: {
      type: Boolean,
      default: false
    },
    isLast: {
      type: Boolean,
      default: false
    },
    isFirst: {
      type: Boolean,
      default: false
    },
    isrepeat: {
      type: String,
      default: '0'
    },
    isParentComponent: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      show: false,
      itemData: null,
      itemRepeat: '0'
    }
  },
  computed: {
    isComponent () {
      return !!this.item.childid
    },
    currentLevel () {
      let { level,itemRepeat } = this
      if(level === 0 && itemRepeat ==='1'){
        level += 1
      }
      return level*1 + 1
    }
  },
  created () {
    this.itemData = Object.assign({}, this.item)
  },
  methods: {
    async queryMessageList () {
      if (!this.show && !this.itemData.componentLists) {
        const { childid } = this.item
        const param = {
          protocolVersion: this.protocolVersion,
          id: childid
        }
        const r = await queryComponentList(param)
        const { componentLists, fields,isrepeat } = r.data
        let list = [];
        if (componentLists != null) {
          list = componentLists.concat(fields)
        } else {
          list = fields
        }
        if(isrepeat){
          list.push({ number: 'end Repeating Group',repeatType:'1',id:'1' })
          this.itemRepeat = '1'
        }else {
          this.itemRepeat = '0'
        }
        // list.push({ number: 'end <br> Component',repeatType: '2',id: '2'});
        this.itemData.componentLists = list;
        this.show = true
      } else {
        this.show = !!(!this.show && this.itemData.componentLists)
      }
      this.showComponentParent(this.item)
    },
    showComponentParent(item){
      this.dispatch('DictionaryLookup', 'child-to-p2', item)
    },
    showDetail (item) {
      this.dispatch('DictionaryLookup', 'child-to-p1', item)
    }
  }
}
</script>

<style lang="scss" scoped>
  .secondblock .right .right-table {
    .cell {
      &.component {
        font-size: 14px;
        color: #2C75D0;
        font-weight: bold;
        cursor: pointer;
      }

      &.field {
        cursor: pointer;
      }
    }
  }

</style>
