<template>
  <div class="map">
    <map
      :markers="markers"
      :polyline="polylines"
      :include-points="markers"
    >
      <cover-view class="controls">
        <cover-view class="control" @tap="toHome"><cover-image :src="homeImg" /></cover-view>
        <cover-view class="control" @tap="refresh"><cover-image :src="refreshImg" /></cover-view>
        <cover-view v-if="!isJoined" class="control" @tap="join"><cover-image :src="joinImg" /></cover-view>
        <cover-view v-else class="control" @tap="unjoin"><cover-image :src="unjoinImg" /></cover-view>
      </cover-view>
    </map>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import store from '@/store'
import { TABLE_ID } from '@/constant/'
import { showErr, calcCenter, calcLines, getCoordinates } from '@/utils/'
import joinImg from '@/static/image/join.png'
import unjoinImg from '@/static/image/unjoin.png'
import refreshImg from '@/static/image/refresh.png'
import homeImg from '@/static/image/home.png'

export default {
  store,
  data () {
    return {
      markers: [],
      polylines: [],
      people: 0,
      name: '',
      isCreator: undefined,
      isJoined: undefined,
      reject: true,

      joinImg,
      unjoinImg,
      refreshImg,
      homeImg
    }
  },
  onShareAppMessage (res) {
    return {
      title: `[ ${this.name} ] 来聚不`,
      path: `/pages/map/main?id=${this.$root.$mp.query.id}`,
      success: (res) => {},
      fail: (res) => {}
    }
  },
  mounted () {
    this.isCreator = this.$root.$mp.query.isCreator === 'true'
    this.isJoined = this.$root.$mp.query.isCreator === 'true'
    store.dispatch('firstBlood', { callback: this.login })
  },
  computed: {
    ...mapState([ 'user' ])
  },
  methods: {
    login () {
      store.commit('login', {
        success: () => {
          this.reject = false
          this.getActivity()
          this.getActivityMembers()
        },
        fail: this.auth
      })
    },
    getActivity () {
      new wx.BaaS.TableObject(TABLE_ID.ACTIVITY).get(this.$root.$mp.query.id).then(res => {
        this.name = res.data.name
        if (this.user.openid === res.data.creator_id) this.isCreator = true
        wx.setNavigationBarTitle({
          title: res.data.name
        })
        this.people = res.data.people_amount
      }, () => { showErr('获取活动出错') })
    },
    async getActivityMembers () {
      const query = new wx.BaaS.Query()
      query.compare('activity_id', '=', this.$root.$mp.query.id)
      new wx.BaaS.TableObject(TABLE_ID.ACTIVITY_MEMBER).setQuery(query).find().then(res => {
        const members = res.data.objects
        this.isJoined = members.some(e => (e.user_id === this.user.openid))
        console.log(this.user.openid)
        console.log(members)
        console.log(this.isJoined)
        const coors = getCoordinates(members)
        const center = calcCenter(coors)
        this.markers = coors.length <= 1 ? coors : coors.concat([center])
        this.polylines = coors.length <= 1 ? [] : calcLines(coors, center)
      }, () => { showErr('获取成员出错') })
    },
    auth () {
      store.dispatch('auth', { userCallback: this.login })
    },
    join () {
      if (this.reject) {
        this.auth()
        return
      }
      wx.showLoading({ title: '提交中...', mask: true })
      store.dispatch('saveMember', {
        activityId: this.$root.$mp.query.id,
        callback: () => {
          wx.hideLoading()
          this.isJoined = true
          this.getActivityMembers()
        }
      })
    },
    unjoin () {
      if (this.isCreator) {
        showErr('你是创建者!')
        return
      }
      wx.showLoading({ title: '提交中...', mask: true })
      store.dispatch('delMember', {
        activityId: this.$root.$mp.query.id,
        callback: () => {
          wx.hideLoading()
          this.isJoined = false
          wx.navigateBack()
          this.getActivityMembers()
        }
      })
    },
    refresh () {
      if (this.reject) {
        this.auth()
        return
      }
      this.getActivity()
      this.getActivityMembers()
    },
    toHome () {
      wx.redirectTo({ url: '/pages/index/main' })
    }
  }
}
</script>

<style lang="less">
@import './style.less';
</style>
