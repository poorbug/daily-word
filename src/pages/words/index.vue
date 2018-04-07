<template>
  <div class="home">
    <div v-if="list.length === 0" class="userinfo">
      <img :src="user.avatarUrl" background-size="cover" />
      <p>快来写一个吧～</p>
    </div>
    <ul class="word-list" v-else>
        <li v-for="(o, i) in list" :key="i">
          <word :text="o.txt" :date="o.created_at" :classes="sameClasses(i)" />
        </li>
    </ul>
    <a href="/pages/edit/main" class="write" >+</a>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import word from '@/components/word'

import store from '../../store'
import { TABLE_ID, SAME_YESTODAY } from '../../constant/'

export default {
  store,
  components: {
    word
  },
  data () {
    return {
    }
  },
  created () {
    let query = new wx.BaaS.Query()
    query.compare('openid', '=', wx.BaaS.storage.get('userinfo').openid)
    let Product = new wx.BaaS.TableObject(TABLE_ID)
    Product.setQuery(query).find().then(res => {
      store.commit('setList', res.data.objects)
    }, () => {
      wx.showToast({
        title: '请求失败',
        duration: 2000
      })
    })
  },
  computed: {
    ...mapState([ 'list', 'user' ])
  },
  methods: {
    sameClasses (todayIndex) { // mapState 则不能用箭头表达式，否则取不到 this.list
      if (todayIndex === 0) return SAME_YESTODAY.NEITHER // 年的第一天，也是月的第一天
      const prev = new Date(this.list[todayIndex - 1].created_at * 1000)
      const today = new Date(this.list[todayIndex].created_at * 1000)
      if (prev.getFullYear() !== today.getFullYear()) return SAME_YESTODAY.NEITHER
      if (prev.getMonth() !== today.getMonth()) return SAME_YESTODAY.YEAR
      return SAME_YESTODAY.BOTH
    }
  }
}
</script>

<style lang="less">
@import './style.less';
</style>
