/* global baike, _ENV_, VConsole */
/*
 * @Author: arvinlin
 * @Date: 2018-07-17 19:57:49
 * @Last Modified by: arvinlin
 * @Last Modified time: 2018-10-07 19:25:57
 */
import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import State from './state'
import expenseCalculator from './modules/expenseCalculator'
import doctorSearch from './modules/doctorSearch'
import appSearch from './modules/appSearch'
if (_ENV_ !== 'production' && baike.query('debug') === 'true') {
  var vConsole = new VConsole()
  window.vConsole = vConsole
}

Vue.use(Vuex)

const debug = _ENV_ !== 'production'

export function createStore () {
  return new Vuex.Store({
    modules: {
      expenseCalculator,
      doctorSearch,
      appSearch
    },
    actions,
    mutations,
    state: new State({}),
    strict: debug
  })
}
