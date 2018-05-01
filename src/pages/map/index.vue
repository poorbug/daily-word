<template>
  <div class="map">
    <map
      :markers="markers"
      :polyline="polylines"
      :include-points="markers"
    />
  </div>
</template>

<script>
import { TABLE_ID } from '@/constant/'
import { showErr, calcCenter, calcLines, getCoordinates } from '@/utils/'

export default {
  data () {
    return {
      markers: [],
      polylines: [],
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
    this.getActivity(this.$root.$mp.query.id)
    this.getActivityMembers(this.$root.$mp.query.id)
  },
  methods: {
    getActivity (id) {
      let Product = new wx.BaaS.TableObject(TABLE_ID.ACTIVITY)
      Product.get(id).then(res => {
        this.name = res.data.name
        wx.setNavigationBarTitle({
          title: res.data.name
        })
        this.people = res.data.people_amount
      }, () => { showErr('获取活动出错') })
    },
    getActivityMembers (id) {
      let query = new wx.BaaS.Query()
      query.compare('activity_id', '=', id)
      let Product = new wx.BaaS.TableObject(TABLE_ID.ACTIVITY_MEMBER)
      Product.setQuery(query).find().then(res => {
        const members = res.data.objects
        const coors = getCoordinates(members)
        const center = calcCenter(coors)
        this.markers = coors.length === 1 ? coors : coors.concat(center)
        this.polylines = calcLines(coors, center)
      }, () => { showErr('获取成员出错') })
    }
  }
}
</script>

<style lang="less">
@import './style.less';
</style>
