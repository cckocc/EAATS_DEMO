<template>
  <div>
    <div v-for="(item,index) in tableTitle">
      <a :href="'#'+item.id">{{item.name}}</a>
    </div>
    <IMIXItem
      v-for="(item,index) in tableContent"
      :key="index"
      :item="item"
      :level="1"/>
  </div>
</template>

<script>
import { tableTitle, tableContent } from './data'
import IMIXItem from './IMIXItem'

export default {
  name: 'IMIX',
  components: {
    IMIXItem
  },
  data () {
    return {
      tableTitle,
      tableContent
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
