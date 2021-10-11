// 回显是不能包含树根节点否则会回显出错所有要用一个关键字usrtType确定最底层数据否则后果自负
const newNode = [
  {
    parentId: 0, // 父节点ID如果为0则意味着该节点是顶层节点
    childrenId: 1, // 子节点对应的节点id
    label: '一级-总', // tree节点显示数据
    organId: '0', // 组织ID
    contactType: '服务开通联系人', // 服务开通联系人
    contactTypeId: '1', // 服务开通联系人id
    organName: '一级-总', // 组织名称
    userName: '总统', // 姓名
    selfId: 0, // 唯一值标识用来选中节点不可重复且不可为空
    usrtType: 'other' // 用户类型必须要
    // orgeId
  },
  {
    parentId: 1, // 父节点ID如果为0则意味着该节点是顶层节点
    selfId: 1, // 唯一值标识用来选中节点不可重复且不可为空
    childrenId: 2, // 子节点对应的节点id
    label: '二级-分总', // tree节点显示数据
    contactType: '服务开通联系人', // 服务开通联系人
    contactTypeId: '1', // 服务开通联系人id
    organId: '1', // 组织ID
    organName: '二级-分总', // 组织名称
    userName: '国务卿', // 姓名
    usrtType: 'other'
  },
  {
    parentId: 1,
    selfId: 3,
    childrenId: 3,
    label: '二级-分总',
    contactType: '验收测试联系人',
    contactTypeId: '2',
    organId: '2',
    organName: '二级-分总',
    userName: '参议院参事',
    usrtType: 'other'
  },
  {
    parentId: 1,
    selfId: 4,
    childrenId: null,
    label: '二级-普通用户',
    contactType: '验收测试联系人',
    contactTypeId: '2',
    organId: '',
    organName: '',
    userName: '用户1',
    usrtType: 'user' // 必须有，我做回显使用
  },
  {
    parentId: 2,
    childrenId: 4,
    selfId: 5,
    label: '三级-领导',
    contactType: '接口上线联系人',
    contactTypeId: '3',
    organId: '3',
    organName: '三级-领导',
    userName: '众议院参事',
    usrtType: 'other'
  },
  {
    parentId: 2,
    childrenId: null,
    selfId: 6,
    label: '三级-普通',
    contactType: '接口上线联系人',
    contactTypeId: '3',
    organId: '',
    organName: '',
    userName: '用户2',
    usrtType: 'user' // 必须有，我做回显使用
  },
  {
    parentId: 2,
    childrenId: null,
    selfId: 7,
    label: '三级-普通用户',
    contactType: '权限变更联系人',
    contactTypeId: '4',
    organId: '',
    organName: '',
    userName: '用户3',
    usrtType: 'user' // 必须有，我做回显使用
  },
  {
    parentId: 2,
    childrenId: null,
    selfId: 8,
    label: '三级-普通',
    contactType: '权限变更联系人',
    contactTypeId: '4',
    organId: '',
    organName: '',
    userName: '用户4',
    usrtType: 'user' // 必须有，我做回显使用
  },
  {
    parentId: 3,

    childrenId: null,
    selfId: 9,
    label: '三级-领导',
    contactType: '权限变更联系人',
    contactTypeId: '4',
    organId: '4',
    organName: '三级-领导',
    userName: '行政部',
    usrtType: 'other'
  },
  {
    parentId: 3,
    childrenId: null,
    selfId: 10,
    label: '三级-普通',
    contactType: '机构用户联系人',
    contactTypeId: '5',
    organId: '',
    organName: '',
    userName: '用户5',
    usrtType: 'user' // 必须有，我做回显使用
  },
  {
    parentId: 3,
    childrenId: null,
    selfId: 11,
    label: '三级-普通用户',
    contactType: '机构用户联系人',
    contactTypeId: '5',
    organId: '',
    organName: '',
    userName: '用户6',
    usrtType: 'user' // 必须有，我做回显使用
  },
  {
    parentId: 3,
    childrenId: null,
    selfId: 12,
    label: '三级-普通',
    contactType: '机构用户联系人',
    contactTypeId: '5',
    organId: '',
    organName: '',
    userName: '用户7',
    usrtType: 'user' // 必须有，我做回显使用
  },
  {
    parentId: 4,
    childrenId: null,
    selfId: 13,
    label: '四级-普通',
    contactType: '机构用户联系人',
    contactTypeId: '5',
    organId: '',
    organName: '',
    userName: '用户8',
    usrtType: 'user' // 必须有，我做回显使用
  },
  {
    parentId: 4,
    childrenId: null,
    selfId: 14,
    label: '四级-普通',
    contactType: '机构补充联系人',
    contactTypeId: '6',
    organId: '',
    organName: '',
    userName: '用户9',
    usrtType: 'user' // 必须有，我做回显使用
  },
  {
    parentId: 4,
    childrenId: null,
    selfId: 15,
    label: '四级-普通',
    contactType: '机构补充联系人',
    contactTypeId: '6',
    organId: '',
    organName: '',
    userName: '用户10',
    usrtType: 'user' // 必须有，我做回显使用
  },
  {
    parentId: 4,
    childrenId: null,
    selfId: 16,
    label: '三级-普通',
    contactType: '机构补充联系人',
    contactTypeId: '6',
    organId: '',
    organName: '',
    userName: '用户11',
    usrtType: 'user' // 必须有，我做回显使用
  }
]

export default { newNode }
