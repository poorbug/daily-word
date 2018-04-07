<template>
  <div class="word-container" :class="{ 'year-same': classes[0], 'month-same': classes[1]}">
    <p v-if="!classes[0]" class="year">{{formatYear}}</p>
    <p v-if="!classes[1]" class="month">{{formatMonth}}</p>
    <div>
      <div class="date">
        <p>{{formatWeek}}</p>
        <p>{{formatDay}}</p>
      </div>
      <div class="text">
        {{text}}
      </div>
    </div>
  </div>
</template>

<script>
import { formatWeek, formatMonth, formatYear } from '../utils/index.js'

export default {
  props: [
    'text',
    'date',
    'classes'
  ],
  computed: {
    formatWeek () {
      return formatWeek(this.date)
    },
    formatDay () {
      return new Date(this.date * 1000).getDate()
    },
    formatClass () {
      return `${this.classes[0] && 'year-same'} ${this.classes[1]} word-container`
    },
    formatMonth () {
      return formatMonth(this.date)
    },
    formatYear () {
      return formatYear(this.date)
    }
  }
}
</script>

<style lang="less">
.word-container {
  position: relative;
  margin-top: 40rpx;
  &.year-same:not(.month-same) {
    margin-top: 0rpx;
  }
  &.year-same.month-same > div::before {
    content: '';
    border-left: 1px solid #ccc;
    height: 40rpx;
    position: absolute;
    top: -40rpx;
    left: 48rpx;
  }
  > .year {
    text-align: center;
    font-size: 48rpx;
    font-weight: bolder;
  }
  > .month {
    width: 96rpx;
    text-align: center;
    font-size: 32rpx;
    padding: 8rpx 0;
  }
  > div {
    border: 1rpx solid #ccc;
    display: flex;
    > div {
      display: inline-block;
      width: 100%;
      // height: 96rpx;
      box-sizing: border-box;
      &.date {
        flex-basis: 96rpx;
        flex-shrink: 0;
        border-right: 1rpx solid #ccc;
        text-align: center;
        > p {
          &:first-child {
            font-size: 24rpx;
            line-height: 38rpx;
            border-bottom: 1rpx solid #ccc;
          }
          &:last-child {
            font-size: 42rpx;
            line-height: 58rpx;
            font-weight: bolder;
          }
        }
      }
      &.text {
        flex-basis: 0;
        flex-grow: 1;
        font-size: 32rpx;
        padding: 24rpx 16rpx;
        line-height: 36rpx;
      }
    }
  }
}
</style>
