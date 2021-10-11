<template>
  <div :id="item.id">
    <h2 v-show="level === 1">{{item.id}}&nbsp;{{item.title}}</h2>
    <h3 v-show="level === 2">{{item.id}}&nbsp;{{item.title}}</h3>
    <h4 v-show="level === 3">{{item.id}}&nbsp;{{item.title}}</h4>
    <div v-for="(t,i) in item.content">
      <div v-if="t.type === 'table'">
        <br>
        <el-table
          :data="t.value"
          border
          style="">
          <el-table-column
            prop="num"
            label="域号">
          </el-table-column>
          <el-table-column
            prop="name"
            label="域名">
          </el-table-column>
          <el-table-column
            prop="isNeed"
            label="必需">
          </el-table-column>
          <el-table-column
            prop="description"
            label="说明">
          </el-table-column>
        </el-table>
        <br>
      </div>
      <div v-else-if="t.type === 'image'">
        <br>
        <img :src="pic[t.value]" alt="">
        <br>
      </div>
      <div class="text" v-else v-html="t.value"></div>
    </div>
    <template v-if="item.children">
      <IMIXItem
        v-for="(it,ind) in item.children"
        :key="ind"
        :item="it"
        :level="currentLevel"/>
    </template>
  </div>
</template>

<script>
import IMIX_PIC_A from '@/assets/IMIX/a.jpg'
import IMIX_PIC_B from '@/assets/IMIX/b.jpg'
import IMIX_PIC_C from '@/assets/IMIX/c.jpg'
import IMIX_PIC_D from '@/assets/IMIX/d.jpg'
export default {
  name: 'IMIXItem',
  props: {
    item: {
      type: Object,
      default: null
    },
    level: {
      type: Number,
      default: 1
    }
  },
  computed: {
    currentLevel () {
      let { level } = this
      return level*1 + 1
    }
  },
  data () {
    return {
      pic: {
        a: IMIX_PIC_A,
        b: IMIX_PIC_B,
        c: IMIX_PIC_C,
        d: IMIX_PIC_D,
      }
    }
  }
}
</script>

<style lang="scss" scoped>
 .text{
   font-size: 14px;
   color: #333333;
 }
</style>
