import { getUUid } from '@/api/menuConfig'

/**
 * 树的映射，根据节点id映射所有兄弟节点到mapData，生成一个内存数据
 *
 * @export
 * @param {*} tree 需要映射的整个树结构
 * @param {*} mapData 映射的结果数据
 */
export function getNodeMapToChildrenList(tree, mapData) {
  tree.forEach((item, index) => {
    mapData[item['id']] = tree
    function NodeMap(childrenList, mapData) {
      if (childrenList === null) {
        return
      }
      childrenList.forEach(e => {
        mapData[e.id] = childrenList
        if (e.isFold) {
          NodeMap(e.chidrenList, mapData)
        }
      })
    }
    NodeMap(item['chidrenList'], mapData)
  })
}
/**
 * 递归生成需要添加的子节点，即在表格下方添加的行
 * 节点的id唯一，方便进行映射
 *
 * @param {*} chidrenList 当前节点的所有兄弟节点，进行遍历操作
 * @param {*} values 树的深度
 * @param {*} map 当前节点id对应的树映射，对应所有兄弟节点
 * @param {*} tag 当前节点
 * @return {*}
 */
async function newNode(chidrenList, values, map, tag) {
  const r = await getUUid() // 动态生成id
  const nodeOrd = tag.nodeOrd + 1
  const levelOne = tag.levelOne
  const levelOneName = tag.levelOneName
  const levelTwo = tag.levelTwo
  const levelTwoName = tag.levelTwoName
  const levelThree = tag.levelThree
  const levelThreeName = tag.levelThreeName
  const pNodeId = tag.pNodeId
  const temp = {
    chidrenList: [],
    id: r.data,
    add: true,
    nodeOrd: nodeOrd,
    levelOne: levelOne,
    levelOneName: levelOneName,
    levelTwo: levelTwo,
    levelTwoName: levelTwoName,
    levelThree: levelThree,
    levelThreeName: levelThreeName,
    pNodeId: pNodeId,
    nodeName: ' ',
    forkCount: 1,
    step: 1,
    nodeLevel: tag.nodeLevel
  }
  let node = temp
  const col = values.length - tag.nodeLevel
  for (let i = 0; i < col; i++) {
    map[node['id']] = chidrenList
    const r = await getUUid()
    const dataNode = {
      chidrenList: [],
      id: r.data,
      add: true,
      nodeOrd: 1,
      levelOne: null,
      levelOneName: null,
      levelTwo: null,
      levelTwoName: null,
      levelThree: null,
      levelThreeName: null,
      pNodeId: node.id,
      nodeName: ' ',
      forkCount: 1,
      step: 1,
      nodeLevel: node.nodeLevel + 1
    }
    node.chidrenList.push(dataNode)
    chidrenList = node.chidrenList
    node = dataNode
  }
  map[node['id']] = chidrenList
  return temp
}

/**
 * 在表格下方添加行数据
 *
 * @export
 * @param {*} values 树深度
 * @param {*} node 点击的当前节点
 * @param {*} map 树的映射
 */
export async function handlerInsert(values, node, map) {
  const childrenList = map[node['id']] // 在映射中对应id获取childrenList
  for (let i = 0; i < childrenList.length; i++) {
    if (childrenList[i]['id'] === node['id']) {
      let newNode1 = ''
      await newNode(childrenList, values, map, node).then(res => {
        newNode1 = res
      })
      childrenList.splice(i + 1, 0, newNode1)
      break
    }
  }
}

/**
 * 递归生成需要添加的子节点，即在表格下方添加的行
 * 节点的id唯一，方便进行映射
 *
 * @param {*} chidrenList 当前节点的所有兄弟节点，进行遍历操作
 * @param {*} values 树的深度
 * @param {*} map 当前节点id对应的树映射，对应所有兄弟节点
 * @param {*} tag 当前节点
 * @return {*}
 */
async function newMarketNode(chidrenList, values, map, tag) {
  const r = await getUUid() // 动态生成id
  const nodeOrd = tag.nodeOrd + 1
  const levelOne = tag.levelOne
  const levelOneName = tag.levelOneName
  const levelTwo = tag.levelTwo
  const levelTwoName = tag.levelTwoName
  const levelThree = tag.levelThree
  const levelThreeName = tag.levelThreeName
  const pNodeId = tag.pNodeId
  const temp = {
    chidrenList: [],
    id: r.data,
    add: true,
    nodeOrd: nodeOrd,
    levelOne: levelOne,
    levelOneName: levelOneName,
    levelTwo: levelTwo,
    levelTwoName: levelTwoName,
    levelThree: levelThree,
    levelThreeName: levelThreeName,
    pNodeId: pNodeId,
    nodeName: ' ',
    forkCount: 1,
    step: 1,
    nodeLevel: 5
  }
  let node = temp
  let col = 0
  if (tag.nodeLevel > 4) {
    col = values.length - 5
  } else {
    col = values.length - tag.nodeLevel
  }
  for (let i = 0; i < col; i++) {
    map[node['id']] = chidrenList
    const r = await getUUid()
    const dataNode = {
      chidrenList: [],
      id: r.data,
      add: true,
      nodeOrd: 1,
      levelOne: null,
      levelOneName: null,
      levelTwo: null,
      levelTwoName: null,
      levelThree: null,
      levelThreeName: null,
      pNodeId: node.id,
      nodeName: ' ',
      forkCount: 1,
      step: 1,
      nodeLevel: node.nodeLevel + 1
    }
    node.chidrenList.push(dataNode)
    chidrenList = node.chidrenList
    node = dataNode
  }
  map[node['id']] = chidrenList
  return temp
}
/**
 * 在表格下方添加行数据
 *
 * @export
 * @param {*} values 树深度
 * @param {*} node 点击的当前节点
 * @param {*} map 树的映射
 */
export async function handlerMarketInsert(values, node, map) {
  const childrenList = map[node['pNodeId']] // 在映射中对应id获取childrenList
  for (let i = 0; i < childrenList.length; i++) {
    if (childrenList[i]['id'] === node['pNodeId']) {
      if (childrenList[i].nodeLevel === 5) {
        let newNode = ''
        await newMarketNode(childrenList, values, map, node).then(res => {
          newNode = res
        })
        childrenList.splice(i + 1, 0, newNode)
        break
      } else {
        await handlerMarketInsert(values, childrenList[i], map)
      }
    }
  }
}
export function deleteNode(tag, map, values) {
  const id = tag.id
  const childrenList = map[id]
  if (childrenList.length === 1) {
    const pNodeId = tag.pNodeId
    const pNode = map[pNodeId]
    pNode.forEach((item) => {
      if (item.id === pNodeId) {
        item.step = values.length - item.nodeLevel + 1 // 删除之后与父节点合并
      }
    })
  }
  childrenList.forEach((item, index) => {
    if (item.id === id) {
      childrenList.splice(index, 1)
    }
  })
}
/**
   * 删除树节点
   *
   * @export
   * @param {*} tag 当前需要删除的节点
   */
export function deleteMarketNode(tag, map) {
  const id = tag.id
  const childrenList = map[id]
  childrenList.forEach((item, index) => {
    if (item.id === id) {
      childrenList[index].nodeName = ' '
    }
  })
}

export default {
  getNodeMapToChildrenList,
  handlerInsert,
  deleteNode,
  deleteMarketNode,
  handlerMarketInsert
}
