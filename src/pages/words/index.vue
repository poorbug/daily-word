<template>
  <div class="home">
    <ul class="word-list">
        <li v-for="(o, i) in words" :key="i">
          <word :text="o.txt" :date="o.created_at"/>
        </li>
    </ul>
    <a href="/pages/edit/main" class="write" >+</a>
  </div>
</template>

<script>
import word from '@/components/word'

import store from '../../store'
import { TABLE_ID } from '../../constant/'

export default {
  components: {
    word
  },

  data () {
    return {
      // words: store.state.words
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
    words () {
      return store.state.list
    }
  }
}
</script>

<style lang="less">
@import './style.less';

</style>
