const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  token: state => state.user.token,
  publicKey: state => state.user.publicKey,
  userId: state => state.user.userId,
  name: state => state.user.name,
  introduction: state => state.user.introduction,
  changeBaseInfoFlag: state => state.user.changeBaseInfoFlag,
  roles: state => state.user.roles,
  userInfo: state => state.user.userInfo,
  isVisitor: state => state.user.isVisitor,
  permission_routes: state => state.permission.routes,
  errorLogs: state => state.errorLog.logs
}
export default getters
