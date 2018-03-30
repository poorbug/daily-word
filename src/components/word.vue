<template>
  <div class="word-container">
    <div class="date">
      <p>{{formatWeek}}</p>
      <p>{{formatDay}}</p>
    </div>
    <div class="text">
      {{text}}
    </div>
  </div>
</template>

<script>
import { formatWeek } from '../utils/index.js'

export default {
  props: [
    'text',
    'date'
  ],
  computed: {
    formatWeek () {
      return formatWeek(new Date(this.date * 1000))
    },
    formatDay () {
      return new Date(this.date * 1000).getDate()
    }
  },
  created () {
  }

}
</script>

<style lang="less">
.word-container {
  border: 1rpx solid #ccc;
  display: flex;
  > div {
    display: inline-block;
    width: 100%;
    height: 96rpx;
    box-sizing: border-box;
    &.date {
      flex-basis: 96rpx;
      flex-shrink: 0;
      border-right: 1rpx solid #ccc;
      text-align: center;
      > p:first-child {
        font-size: 24rpx;
        line-height: 38rpx;
        border-bottom: 1rpx solid #ccc;
      }
      > p:last-child {
        font-size: 42rpx;
        line-height: 58rpx;
        font-weight: bolder;
      }
    }
    &.text {
      flex-basis: 0;
      flex-grow: 1;
      font-size: 32rpx;
      padding: 0 16rpx;
      line-height: 96rpx;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>
