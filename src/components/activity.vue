<template>
  <li class="activity" @click="toActivity">
      <h1>{{name}}</h1>
      <p v-if="people">{{people}} 人</p>
  </li>
</template>

<script>
export default {
  props: [
    'name',
    'people',
    'id'
  ],
  methods: {
    toActivity () {
      wx.navigateTo({
        url: `/pages/map/main?id=${this.id}`
      })
    }
  }
}
</script>

<style lang="less">
.activity {
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 8rpx;
  padding: 20rpx 40rpx;
  margin: 20rpx 0;
  box-sizing: border-box;
  font-size: 32rpx;
  // display: flex;
  justify-content: space-between;
  h1 {
    text-align: center;
  }
}
</style>
