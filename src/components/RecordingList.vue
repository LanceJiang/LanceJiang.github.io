<template>
  <div class="radioList">
    <div class="item" v-for="(item,index) in list" :key="item.id">
      <!-- 播放 / 暂停 icon -->
      <span @click="play(item)" v-if="!item.timing" class="iconfont ty-yuyin">播放</span>
      <span v-else  class="iconfont ty-yuyin">暂停</span>
      <span class="time">{{item.timing || '0'}}s</span>
      <span class="weui-icon-clear delete" @tap.stop="del(item, index)"></span>
    </div>
  </div>
</template>

<script>

export default {
  /**
   * 组件的属性列表
   */
  props: {
    // 录音列表
    list: {
      type: Array,
      value: []
      // [{id: 2,
      // timing: 0,
      // percent: 0,
      // src: this.src,
      // duration: 3000}]
    },
  },
  /**
   * 组件的初始数据
   */
  data () {
    return {
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 播放声音
    play (item) {
      let $this = this
      const innerAudioContext = wx.createInnerAudioContext()
      innerAudioContext.autoplay = true
      // innerAudioContext.src = this.src
      // console.error(this.list[i], 'this.list[i]', i)
      innerAudioContext.src = item.src
      innerAudioContext.onPlay(() => {
        let times = 0
        let timer = setInterval(() => {
          times += 1000
          // item.percent = parseInt(times / item.duration * 100)
          item.timing = times
          if (times > item.duration) {
            innerAudioContext.stop()
            item.timing = 0
            // item.percent = 0
            clearInterval(timer)
          }
        }, 1000)
      })
    },
    del (item, index) {
      this.list.splice(index, 1)
    },
    /*tempToTime (s) {
      if (s < 60000) {
        return `00:${formatNumber(s / 1000)}`
      } else if (s < 120000) {
        return `01:${formatNumber((s - 6000) / 1000)}`
      } else if (s < 180000) {
        return `02:${formatNumber((s - 12000) / 1000)}`
      } else {
        return `03:00`
      }
    }*/
  },
  mounted () {
    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.autoplay = true
  }
}
/*function formatNumber(n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}*/
</script>

<style scoped lang="less">
  @import "../common/less/variable";
  .radioList {
    display: flex;
    .item {
      width: 75px;
      height: 30px;
      line-height: 30px;
      border: 1px solid #999;
      border-radius: 3px;
      color: #999;
      background: #fafafa;
      position: relative;
      margin-right: 10px;
    }
  }
  .delete {
    font-size:18px;
    color:#f00;
    padding:0;
    width: 20px;
  }
</style>
