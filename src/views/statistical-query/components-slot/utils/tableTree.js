class TableTree {
  constructor(config) {
    this.tree = config.tree
    this.maxColumnNum = config.maxColumnNum
    this.treeList = []
  }

  // 生成树状表格数据
  generate(extraColumn, extraColumnObj) {
    this.treeList = this.recursionTreeForList(this.tree)
    // console.log('treeList', this.treeList)
    // 如果需要后面追加额外的列
    if (extraColumn) {
      this.recursionTreeListForAppend(this.treeList, extraColumnObj)
      // console.log(this.treeList)
    } else {
      this.recursionTreeListForAppend(this.treeList, {})
    }
    this.uniqTreeList = this.recursionTreeListForUniq(this.treeList)
    // console.log('uniqTreeList', this.uniqTreeList)
    return this.uniqTreeList
  }

  // 映射树结构为list
  recursionTreeForList(tree, stack = [], path = []) {
    tree.forEach(e => {
      Object.assign(e, { rowSpan: this.recursionNodeForLeafNum(e), colSpan: e.step ? e.step : 1 })
      stack.push(e)
      // console.log('行列合并1233', e, this.recursionNodeForLeafNum(e))
      if (Array.isArray(e.chidrenList) && e.chidrenList.length === 0) {
        // path.push([...stack])
        path.push([...stack])
      } else {
        this.recursionTreeForList(e.chidrenList, stack, path)
      }
      stack.pop(e)
    })
    return path
  }

  // 获取某个节点下所有的叶子节点个数
  recursionNodeForLeafNum(node) {
    let num = 0
    const rev = child => {
      // 此处展开折叠时只能以子节点数判断是否为叶子节点
      if (Array.isArray(child.chidrenList) && child.chidrenList.length === 0) {
        // if (Array.isArray(child.extraInfoList) && child.extraInfoList.length > 0) {
        //   child.extraInfoList.forEach(extra => {
        num++
        // })
        // } else {
        //   num++
        // }
      } else {
        child.chidrenList.forEach(e => {
          rev(e)
        })
      }
    }
    rev(node)
    return num
  }

  // tree数据生成table数据后过滤重复的节点
  recursionTreeListForUniq(list) {
    const map = new Map()
    const arr = []
    list.forEach(tr => {
      const trLlist = tr.filter(td => {
        return !map.has(td.id) && map.set(td.id, 1)
      })
      arr.push(trLlist)
    })
    return arr
  }

  // tree数据生成的table数据补全一个td并在后面追加额外的td
  recursionTreeListForAppend(tableList, extraColumnObj, showExtraColumn) {
    // console.log('ssad', tableList, extraColumnObj)
    tableList.map((tr, trIndex) => {
      const currentLength = tableList[trIndex].reduce((acc, cur) => {
        return acc + cur.colSpan
      }, 0)
      const waitLength = this.maxColumnNum - currentLength
      if (waitLength) {
        const lastNode = tr[tr.length - 1]
        tr.push({
          nodeType: 'blank',
          id: 'blank' + lastNode.id,
          colSpan: waitLength,
          rowSpan: 1,
          pNodeId: lastNode.id,
          nodeName: '',
          chidrenList: [],
          value: ''
        })
      }
      // var thNameSet = new Set()
      if (extraColumnObj.list && extraColumnObj.list[trIndex]) {
        const handleExtraList = []
        extraColumnObj.list[trIndex].forEach((extra, extraIndex) => {
          const obj = {
            nodeType: 'extra',
            id: `extra-${trIndex}-${extraIndex}-${(new Date()).getTime()}`,
            colSpan: extraColumnObj.columns[extraIndex].colspan,
            rowSpan: 1
          }
          Object.assign(obj, extra)
          // obj.nodeName = extra
          if (extra.list) {
            obj.nodeList = extra.list
            tr.thName = extra.thName
          } else {
            obj.nodeList = []
          }
          // console.log('qqq', obj, extraColumnObj, extra)
          handleExtraList.push(JSON.parse(JSON.stringify(obj)))
        })
        tr.push(...handleExtraList)
      }
      // tr.thName = thNameSet
      return tr
    })
  }
}

export default TableTree
