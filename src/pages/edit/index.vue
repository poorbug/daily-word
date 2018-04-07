<template>
  <div class="edit">
      <div class="head">
          <div>{{formatWeek}}</div>
          <div>{{formatTime}}</div>
      </div>
      <textarea v-model="txt"/>
      <button @click="send" :disabled="!txt">发送</button>
  </div>
</template>

<script>
import { formatTime, formatWeek } from '../../utils/index.js'

import store from '../../store'
import { TABLE_ID } from '../../constant'

export default {
  components: {
  },

  data () {
    return {
      txt: '',
      today: Math.floor(new Date().getTime() / 1000)
    }
  },

  computed: {
    formatWeek () {
      return formatWeek(this.today)
    },
    formatTime () {
      return formatTime(this.today, false)
    }
  },

  created () {
  },

  methods: {
    send () {
      const Product = new wx.BaaS.TableObject(TABLE_ID)
      const word = Product.create()

      const today = {
        openid: wx.BaaS.storage.get('userinfo').openid,
        txt: this.txt
      }

      word.set(today).save().then((res) => {
        this.txt = ''
        store.commit('push', res.data)
        wx.navigateTo({ url: '../words/main' })
      }, () => {
        wx.showToast({
          title: '提交失败',
          duration: 2000
        })
      })
    }
  }
}
</script>

<style lang="less">
@import './style.less';
</style>
