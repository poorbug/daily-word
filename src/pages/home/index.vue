<template>
  <div class="home">
    <div v-if="list.length === 0" class="userinfo">
      <img :src="user.avatarUrl" background-size="cover" />
      <p>空空如也～</p>
    </div>
    <ul class="list" v-else>
      <activity v-for="(o, i) in list" :key="i" :name="o.name" :people="o.people_amount" :id="o.id" />
    </ul>
    <button @click="inputName" />
    <div v-if="showInputer" class="inputer">
      <div>
        <span @click="closeInputer" />
        <input v-model="name" />
        <button @click="add" :disabled="!name">提交</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

import store from '@/store'
import { TABLE_ID } from '@/constant/'
import { showErr } from '@/utils/'
import Activity from '@/components/activity'

export default {
  store,
  components: {
    Activity
  },
  data () {
    return {
      showInputer: false,
      name: ''
    }
  },
  created () {
    console.log(this.user)
    this.getActivityIDs()
  },
  computed: {
    ...mapState([ 'list', 'user' ])
  },
  methods: {
    getActivityIDs () {
      let query = new wx.BaaS.Query()
      query.compare('user_id', '=', this.user.openid)
      let Product = new wx.BaaS.TableObject(TABLE_ID.MY_ACTIVITY)
      Product.setQuery(query).find().then(res => {
        const ids = res.data.objects.map(e => e.activity_id)
        this.getActivitys(ids)
      }, err => { showErr(err.toString()) })
    },
    getActivitys (ids) {
      let query = new wx.BaaS.Query()
      query.in('id', ids)
      let Product = new wx.BaaS.TableObject(TABLE_ID.ACTIVITY)
      Product.setQuery(query).find().then(res => {
        store.commit('setList', res.data.objects)
      }, err => { showErr(err.toString()) })
    },
    inputName () {
      this.showInputer = true
    },
    add () {
      wx.getLocation({
        type: 'gcj02',
        success: (res) => {
          const latitude = res.latitude
          const longitude = res.longitude
          this.saveActivity({ latitude, longitude })
        }
      })
    },
    saveActivity (coordinate) {
      const activityTable = new wx.BaaS.TableObject(TABLE_ID.ACTIVITY)
      const activity = {
        name: this.name,
        creator_id: this.user.openid,
        people_amount: 1
      }
      activityTable.create().set(activity).save().then(res => {
        this.name = ''
        this.showInputer = false
        this.saveMyActivity(res.data.id)
        this.saveActivityMember(res.data.id, coordinate)
        store.commit('setList', this.list.concat(res.data))
        wx.navigateTo({
          url: `/pages/map/main?id=${res.data.id}`
        })
      }, err => { showErr(err.toString()) })
    },
    saveMyActivity (activityId) {
      const myActivityTable = new wx.BaaS.TableObject(TABLE_ID.MY_ACTIVITY)
      const myActivity = {
        user_id: this.user.openid,
        activity_id: activityId
      }
      myActivityTable.create().set(myActivity).save().then(res => {
        console.log(1, res)
      }, err => { showErr(err.toString()) })
    },
    saveActivityMember (activityId, coordinate) {
      const activityMemberTable = new wx.BaaS.TableObject(TABLE_ID.ACTIVITY_MEMBER)
      const activityMember = {
        user_id: this.user.openid,
        activity_id: activityId,
        coordinate: new wx.BaaS.GeoPoint(coordinate.longitude, coordinate.latitude)
      }
      activityMemberTable.create().set(activityMember).save().then(res => {
        console.log(2, res)
      }, err => { showErr(err.toString()) })
    },
    closeInputer () {
      this.name = ''
      this.showInputer = false
    }
  }
}
</script>

<style lang="less">
@import './style.less';
</style>
