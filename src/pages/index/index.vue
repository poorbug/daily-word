<template>
  <div class="home">
    <div v-if="list.length === 0" class="userinfo">
      <img :src="user.avatarUrl" background-size="cover" />
      <p>空空如也～</p>
    </div>
    <ul class="list" v-else>
      <activity v-for="(o, i) in list" :key="i" :name="o.name" :people="o.people_amount" :id="o.id" />
    </ul>
    <img src="/static/image/add.png" @click="inputName" />
    <div v-if="showInputer" class="inputer">
      <div>
        <img src="/static/image/close.png" @click="closeInputer" />
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
    store.dispatch('requestList')
  },
  computed: {
    ...mapState([ 'list', 'user' ])
  },
  methods: {
    inputName () {
      this.showInputer = true
    },
    closeInputer () {
      this.name = ''
      this.showInputer = false
    },
    add () {
      const activity = {
        name: this.name,
        creator_id: this.user.openid,
        people_amount: 1
      }
      new wx.BaaS.TableObject(TABLE_ID.ACTIVITY).create().set(activity).save().then(res => {
        this.name = ''
        this.showInputer = false
        store.dispatch('saveMember', { activityId: res.data.id })
        store.commit('setList', this.list.concat(res.data))
        wx.navigateTo({
          url: `/pages/map/main?id=${res.data.id}`
        })
      }, err => { showErr(err.toString()) })
    }
  }
}
</script>

<style lang="less">
@import './style.less';
</style>
