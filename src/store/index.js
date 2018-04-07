// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    list: [],
    user: {}
  },
  mutations: {
    setUser: (state, user) => {
      state.user = user
    },
    setList: (state, list) => {
      state.list = list
    },
    push: (state, o) => {
      state.list.push(o)
    }
  }
})

export default store
