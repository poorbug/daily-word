<template>
  <div class="map">
    <map
      :markers="markers"
      :polyline="polylines"
      :controls="controls"
      :include-points="markers"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import store from '@/store'
import { TABLE_ID } from '@/constant/'
import { showErr, calcCenter, calcLines, getCoordinates } from '@/utils/'

export default {
  store,
  data () {
    return {
      markers: [],
      polylines: [],
      controls: [],
      people: 0,
      name: ''
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
        if (members.some(e => (e.user_id === this.user.openid))) {
          wx.getSystemInfo({
            success: (res) => {
              this.controls = [{
                id: 1,
                iconPath: require('@/static/image/join.png'),
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
        const coors = getCoordinates(members)
        const center = calcCenter(coors)
        this.markers = coors.length === 1 ? coors : coors.concat(center)
        this.polylines = calcLines(coors, center)
      }, () => { showErr('获取成员出错') })
    }
  },
  controltap (e) {
    console.log(e.controlId)
  }
}
</script>

<style lang="less">
@import './style.less';
</style>
