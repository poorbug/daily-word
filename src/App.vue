<script>
import store from './store'
import { CLIENT_ID } from './constant'

export default {
  created () {
    wx.BaaS = requirePlugin('minapp')
    wx.BaaS.wxExtend(wx.login, wx.getUserInfo)
    wx.BaaS.init(CLIENT_ID)
    wx.BaaS.login().then(res => {
      store.commit('setUser', res)
    })
  }
}
</script>

<style>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
