import actions from './actions'
import * as getters from './getters'
import mutations from './mutations'
import State from './state'

export default{
  state: new State({}),
  actions,
  getters,
  mutations,
  namespaced: true
}
