<script>
import { CLIENT_ID } from './constant'

export default {
  created () {
    wx.BaaS = requirePlugin('minapp')
    wx.BaaS.wxExtend(wx.login, wx.getUserInfo)
    wx.BaaS.init(CLIENT_ID)
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
</style>
