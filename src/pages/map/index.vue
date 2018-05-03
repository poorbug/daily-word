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
      isJoined: undefined
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
    this.getActivity()
    this.getActivityMembers()
  },
  computed: {
    ...mapState([ 'user' ])
  },
  methods: {
    getActivity () {
      console.log('getActivity')
      console.log(this)
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
      console.log('getActivityMember')
      const query = new wx.BaaS.Query()
      query.compare('activity_id', '=', this.$root.$mp.query.id)
      new wx.BaaS.TableObject(TABLE_ID.ACTIVITY_MEMBER).setQuery(query).find().then(res => {
        const members = res.data.objects
        this.isJoined = members.some(e => (e.user_id === this.user.openid))
        this.renderControls(members.some(e => (e.user_id === this.user.openid)))
        console.log('isJoined: ', members.some(e => (e.user_id === this.user.openid)))
        const coors = getCoordinates(members)
        const center = calcCenter(coors)
        this.markers = coors.length === 1 ? coors : coors.concat(center)
        this.polylines = calcLines(coors, center)
      }, () => { showErr('获取成员出错') })
    },
    join () {
      store.dispatch('saveMember', {
        activityId: this.$root.$mp.query.id,
        callback: () => {
          this.isJoined = true
          this.renderControls(true)
        }
      })
    },
    unjoin () {
      if (this.isCreator) {
        showErr('你是创建者!')
        return
      }
      store.dispatch('delMember', {
        activityId: this.$root.$mp.query.id,
        callback: () => {
          this.isJoined = false
          this.renderControls(false)
          wx.navigateBack()
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
    renderControls (val) {
      console.log('render: ', val)
      wx.getSystemInfo({
        success: (res) => {
          this.controls = [{
            id: val ? 2 : 1,
            iconPath: val ? unjoinImg : joinImg,
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
  // watch: {
  //   isJoined: function (val) {
  //     console.log('watch: ', val)
  //     wx.getSystemInfo({
  //       success: (res) => {
  //         console.log('watch res: ', res)
  //         console.log('watch this: ', this)
  //         this.controls = [{
  //           id: val ? 2 : 1,
  //           iconPath: val ? unjoinImg : joinImg,
  //           position: {
  //             left: res.windowWidth - 20 - 40,
  //             top: res.windowHeight - 20 - 40,
  //             width: 40,
  //             height: 40
  //           },
  //           clickable: true
  //         }]
  //       }
  //     })
  //   }
  // }
}
</script>

<style lang="less">
@import './style.less';
</style>
