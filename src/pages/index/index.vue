<template>
  <div class="home">
    <div v-if="list.length === 0" class="userinfo">
      <img :src="user.avatarUrl || avatarImg" background-size="cover" />
      <p>空空如也～</p>
    </div>
    <ul class="list" v-else>
      <activity v-for="(o, i) in list" :key="i" :name="o.name" :id="o.id" />
    </ul>
    <img :src="addImg" @click="inputName" />
    <div v-if="showInputer" class="inputer">
      <div>
        <img :src="closeImg" @click="closeInputer" />
        <input v-model="name" placeholder="活动名称" />
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

import avatarImg from '@/static/image/avatar.png'
import addImg from '@/static/image/add.png'
import closeImg from '@/static/image/close.png'

export default {
  store,
  components: {
    Activity
  },
  data () {
    return {
      avatarImg,
      addImg,
      closeImg,
      showInputer: false,
      name: '',
      reject: true
    }
  },
  mounted () {
    store.dispatch('firstBlood', { callback: this.login })
  },
  computed: {
    ...mapState([ 'list', 'user' ])
  },
  methods: {
    login () {
      store.commit('login', {
        success: () => {
          this.reject = false
          store.commit('requestList')
        },
        fail: this.auth
      })
    },
    inputName () {
      if (this.reject) {
        this.auth()
        return
      }
      this.showInputer = true
    },
    closeInputer () {
      this.name = ''
      this.showInputer = false
    },
    add () {
      wx.showLoading({ title: '提交中...', mask: true })
      const activity = {
        name: this.name,
        creator_id: this.user.openid,
        people_amount: 1
      }
      new wx.BaaS.TableObject(TABLE_ID.ACTIVITY).create().set(activity).save().then(res => {
        store.dispatch('saveMember', {
          activityId: res.data.id,
          callback: () => {
            this.name = ''
            this.showInputer = false
            wx.hideLoading()
            store.commit('requestList')
            wx.navigateTo({
              url: `/pages/map/main?id=${res.data.id}&isCreator=true`
            })
          }
        })
      }, err => {
        showErr(err.toString())
        wx.hideLoading()
      })
    },
    auth () {
      store.dispatch('auth', { userCallback: this.login })
    }
  }
}
</script>

<style lang="less">
@import './style.less';
</style>
