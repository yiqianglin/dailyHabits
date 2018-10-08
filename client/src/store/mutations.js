import { app as types } from './mutation-types'

const mutations = {
  [types.SET_SEARCHER] (state, searcher) {
    state.searcher = searcher
  }
}

export default mutations
