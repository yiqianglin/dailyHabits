import actions from './actions'
import * as getters from './getters'
import mutations from './mutations'
import State from './state'

let localData = JSON.parse(localStorage.getItem('state_expenseCalculator'))
let state = null
if (localData) {
  state = new State(localData)
} else {
  state = new State({})
}

export default{
  state: state,
  actions,
  getters,
  mutations,
  namespaced: true
}
