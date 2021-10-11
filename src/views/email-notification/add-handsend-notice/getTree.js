const getTree = function(data, selectArr) {
  let newArr = []
  for (let i = 0; i < selectArr.length; i++) {
    newArr = newArr.concat(test(data, selectArr[i]))
  }
  return Array.from(new Set(newArr))
}

function test(newNode, str) {
  const newArr = [] // 获得的字节点至祖父节点的数据
  let parentId = null // 父节点数据
  let isArr = false // 是否进入
  newArr.push(str)
  for (let i = 0; i < newNode.length; i++) {
    if (newNode[i].selfId === str) {
      parentId = newNode[i].parentId
      isArr = true
      i = 0
    }
    if ((newNode[i].childrenId === parentId) && isArr) {
      newArr.push(newNode[i].selfId)
      str = newNode[i].selfId
      isArr = false
      i = 0
    }
    if (parentId === 0) {
      break
    }
  }
  return newArr
}

export { getTree }
