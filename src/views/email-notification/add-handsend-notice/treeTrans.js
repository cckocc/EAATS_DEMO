const treeFun = function(data, parentId) {
  var itemArr = []
  for (let i = 0; i < data.length; i++) {
    var node = data[i]
    if (node.parentId === parentId) {
      var newNode = {}
      newNode.childrenId = node.childrenId
      newNode.selfId = Number(node.selfId)
      newNode.label = node.label
      newNode.usrtType = node.usrtType
      newNode.parentId = node.parentId
      newNode.isShow = node.isShow
      newNode.contactTypeId = node.contactTypeId
      newNode.organId = node.organId
      newNode.organName = node.organName
      newNode.userName = node.userName
      newNode.children = treeFun(data, node.childrenId)
      itemArr.push(newNode)
    }
  }
  return itemArr
}

export { treeFun }

// function toTree(data) {
//   // 空数组
//   var result = []
//   // 判断不是数组  直接返回
//   if (!Array.isArray(data)) {
//     return result
//   }
//   // 遍历  删除  children 属性  做初始化操作
//   data.forEach(item => {
//     delete item.children
//   })
//   //  空对象
//   var map = {}
//   data.forEach(item => {
//     map[item.id] = item
//   })

//   /**
//    * map对象的 键: 是每个id  值：对应的item
//    * 1: {id: 1, pid: 0, name: "body"}
//    * 2: {id: 2, pid: 1, name: "title"}
//    * 3: {id: 3, pid: 2, name: "div"}
//    */
//   data.forEach(item => {
//     // item.pid 为0时 返回underfined
//     var parent = map[item.pid]
//     if (parent) {
//       (parent.children || (parent.children = [])).push(item)
//     } else {
//       // 这里push的item是pid为0的数据
//       result.push(item)
//     }
//   })
//   return result
// }

// console.log(toTree(data))
