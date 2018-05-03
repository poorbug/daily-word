// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'
import { TABLE_ID } from '@/constant/'
import { showErr } from '@/utils'

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
    }
  },
  actions: {
    async requestList ({ commit, state }, product) {
      console.log('will requestList')
      const q = new wx.BaaS.Query()
      q.compare('user_id', '=', state.user.openid)
      const myActivityIds = await new wx.BaaS.TableObject(TABLE_ID.ACTIVITY_MEMBER).setQuery(q).find()

      const ids = myActivityIds.data.objects.map(e => e.activity_id)
      const q2 = new wx.BaaS.Query()
      q2.in('id', ids)
      const myActivitys = await new wx.BaaS.TableObject(TABLE_ID.ACTIVITY).setQuery(q2).find()
      commit('setList', myActivitys.data.objects)
    },
    saveMember ({ state }, { activityId, callback }) {
      wx.getLocation({
        type: 'gcj02',
        success: ({ latitude, longitude }) => {
          const activityMember = {
            user_id: state.user.openid,
            activity_id: activityId,
            coordinate: new wx.BaaS.GeoPoint(longitude, latitude)
          }
          new wx.BaaS.TableObject(TABLE_ID.ACTIVITY_MEMBER).create().set(activityMember).save().then(res => {
            console.log('saveMember success: ', res)
            callback && callback()
          }, err => { showErr(err.toString()) })
        }
      })
    },
    delMember ({ state, dispatch }, { activityId, callback }) {
      const query = new wx.BaaS.Query()
      query.compare('activity_id', '=', activityId)
      query.compare('user_id', '=', state.user.openid)
      const Product = new wx.BaaS.TableObject(TABLE_ID.ACTIVITY_MEMBER)
      Product.setQuery(query).find().then(res1 => {
        Product.delete(res1.data.objects[0].id).then(res2 => {
          console.log('delMember success: ', res2)
          callback && callback()
          dispatch('requestList')
        }, err => {
          console.log(err)
        })
      }, () => { showErr('退出出错') })
    }
  }
})

export default store
