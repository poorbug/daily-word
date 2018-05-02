<template>
  <div class="map">
    <map
      :markers="markers"
      :polyline="polylines"
      :controls="controls"
      :include-points="markers"
      @controltap="controlTap"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import store from '@/store'
import { TABLE_ID } from '@/constant/'
import { showErr, calcCenter, calcLines, getCoordinates } from '@/utils/'
const joinImg = require('@/static/image/join.png')
const unjoinImg = require('@/static/image/unjoin.png')

export default {
  store,
  data () {
    return {
      markers: [],
      polylines: [],
      controls: [],
      people: 0,
      name: '',
      isCreator: false,
      isJoined: false
    }
  },
  onShareAppMessage (res) {
    return {
      title: `[ ${this.name} ] 来聚不`,
      path: `/pages/map/main?id=${this.$root.$mp.query.id}`,
      success: (res) => {
      },
      fail: (res) => {
      }
    }
  },
  mounted () {
    this.getActivity()
    this.getActivityMembers()
  },
  computed: {
    ...mapState([ 'user' ])
  },
  methods: {
    getActivity () {
      let Product = new wx.BaaS.TableObject(TABLE_ID.ACTIVITY)
      Product.get(this.$root.$mp.query.id).then(res => {
        this.name = res.data.name
        if (this.user.openid === res.data.creator_id) this.isCreator = true
        wx.setNavigationBarTitle({
          title: res.data.name
        })
        this.people = res.data.people_amount
      }, () => { showErr('获取活动出错') })
    },
    getActivityMembers (id) {
      let query = new wx.BaaS.Query()
      query.compare('activity_id', '=', this.$root.$mp.query.id)
      let Product = new wx.BaaS.TableObject(TABLE_ID.ACTIVITY_MEMBER)
      Product.setQuery(query).find().then(res => {
        const members = res.data.objects
        this.renderControl(members)
        const coors = getCoordinates(members)
        const center = calcCenter(coors)
        this.markers = coors.length === 1 ? coors : coors.concat(center)
        this.polylines = calcLines(coors, center)
      }, () => { showErr('获取成员出错') })
    },
    async renderControl (members) {
      this.isJoined = await members.some(e => (e.user_id === this.user.openid))
      this.rerenderControls()
    },
    join () {
      this.saveMyActivity()
      this.saveActivityMember()
    },
    unjoin () {
      if (this.isCreator) {
        showErr('你是创建者!')
        return
      }
      // 删除
    },
    saveMyActivity () {
      const activityId = this.$root.$mp.query.id
      const myActivityTable = new wx.BaaS.TableObject(TABLE_ID.MY_ACTIVITY)
      const myActivity = {
        user_id: this.user.openid,
        activity_id: activityId
      }
      myActivityTable.create().set(myActivity).save().then(res => {
        console.log(1, res)
      }, err => { showErr(err.toString()) })
    },
    saveActivityMember () {
      wx.getLocation({
        type: 'gcj02',
        success: (res) => {
          const latitude = res.latitude
          const longitude = res.longitude

          const activityId = this.$root.$mp.query.id
          const activityMemberTable = new wx.BaaS.TableObject(TABLE_ID.ACTIVITY_MEMBER)
          const activityMember = {
            user_id: this.user.openid,
            activity_id: activityId,
            coordinate: new wx.BaaS.GeoPoint(longitude, latitude)
          }
          activityMemberTable.create().set(activityMember).save().then(res => {
            this.isJoined = true
            this.rerenderControls()
          }, err => { showErr(err.toString()) })
        }
      })
    },
    controlTap (e) {
      switch (e.mp.controlId) {
        case 1:
          this.join()
          break
        case 2:
          this.unjoin()
          break
        default:
      }
    },
    rerenderControls () {
      wx.getSystemInfo({
        success: (res) => {
          this.controls = [{
            id: this.isJoined ? 2 : 1,
            iconPath: this.isJoined ? unjoinImg : joinImg,
            position: {
              left: res.windowWidth - 20 - 40,
              top: res.windowHeight - 20 - 40,
              width: 40,
              height: 40
            },
            clickable: true
          }]
        }
      })
    }
  }
}
</script>

<style lang="less">
@import './style.less';
</style>
