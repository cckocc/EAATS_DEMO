const getUserType = function(treeData, userData) {
  var newArr = []
  for (let i = 0; i < userData.length; i++) {
    for (let j = 0; j < treeData.length; j++) {
      if (
        userData[i] === treeData[j].selfId &&
        treeData[j].usrtType === 'user'
      ) {
        newArr.push(treeData[j].selfId)
      }
    }
  }
  return newArr
}

export { getUserType }
