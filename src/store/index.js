import { TABLE_ID } from '@/constant/'
// https://vuex.vuejs.org/zh-cn/intro.html
// make sure to call Vue.use(Vuex) if using a module system
import Vue from 'vue'
import Vuex from 'vuex'
import { showErr } from '@/utils'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    list: [],
    user: {}
  },
  mutations: {
    login (state, { success, fail }) {
      wx.BaaS.login()
        .then(user => {
          state.user = user
          success && success()
        }, () => {
          fail && fail()
        })
    },
    requestList (state) {
      const q = new wx.BaaS.Query()
      q.compare('user_id', '=', state.user.openid)
      new wx.BaaS.TableObject(TABLE_ID.ACTIVITY_MEMBER).setQuery(q).find()
        .then(res => {
          const ids = res.data.objects.map(e => e.activity_id)
          const q2 = new wx.BaaS.Query()
          q2.in('id', ids)
          new wx.BaaS.TableObject(TABLE_ID.ACTIVITY).setQuery(q2).find()
            .then(
              res => { state.list = res.data.objects },
              err => { showErr(err.message) }
            )
        }, err => { showErr(err.message) })
    }
  },
  actions: {
    saveMember ({ state }, { activityId, callback }) {
      wx.getLocation({
        type: 'gcj02',
        success: (res) => {
          const activityMember = {
            user_id: state.user.openid,
            activity_id: activityId,
            coordinate: new wx.BaaS.GeoPoint(res.longitude, res.latitude)
          }
          new wx.BaaS.TableObject(TABLE_ID.ACTIVITY_MEMBER).create().set(activityMember).save().then(res => {
            callback && callback()
          }, err => { showErr(err.message) })
        }
      })
    },
    delMember ({ state, commit }, { activityId, callback }) {
      const query = new wx.BaaS.Query()
      query.compare('activity_id', '=', activityId)
      query.compare('user_id', '=', state.user.openid)
      const Product = new wx.BaaS.TableObject(TABLE_ID.ACTIVITY_MEMBER)
      Product.setQuery(query).find().then(res1 => {
        Product.delete(res1.data.objects[0].id).then(res2 => {
          callback && callback()
          commit('requestList')
        }, err => { showErr(err.message) })
      }, err => { showErr(err.message) })
    },
    auth (store, { callback }) {
      wx.showModal({
        title: '授权登录',
        content: '[在哪聚] 需要授权才可定位',
        success: (res1) => {
          if (res1.confirm) {
            wx.openSetting({ success: (res2) => {
              if (res2.authSetting['scope.userInfo']) {
                callback && callback()
              }
            }})
          }
        }
      })
    }
  }
})

export default store
