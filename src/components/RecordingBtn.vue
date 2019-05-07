<template>
  <div class="recordingAction">
    <i class="iconfont ty-luyin" @touchstart="touchStart" @touchend="touchEnd"></i>
    <p>按住语言输入</p>
  </div>
</template>

<script>

export default {
  /**
   * 组件的属性列表
   */
  props: {
    // 录音列表
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
    // 开始录音的时候
    touchStart () {
      const options = {
        duration: 10000, // 指定录音的时长，单位 ms
        sampleRate: 16000, // 采样率
        numberOfChannels: 1, // 录音通道数
        encodeBitRate: 96000, // 编码码率
        format: 'mp3', // 音频格式，有效值 aac/mp3
        frameSize: 50 // 指定帧大小，单位 KB
      }
      // 开始录音
      this.recorderManager.start(options)
      this.recorderManager.onStart(() => {
        console.log('recorder start')
      })
    },
    // 停止录音
    touchEnd () {
      console.log("触摸结束")
      this.recorderManager.onStop((res) => {
        console.log('recorder stop', res)
        const {tempFilePath, duration} = res
        // this.src = tempFilePath; // temptemptemp todo...
        var id = +new Date();
        console.error("触发... updateList")
        this.$emit("updateList", {
          id,
          src: tempFilePath,
          duration: duration,
          timing: 0,
          percent: 0
        })
      })
    },
  },
  mounted () {
      this.recorderManager = wx.getRecorderManager() // 录音管理器 暂存器
  }
}
function formatNumber(n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}
</script>

<style scoped lang="less">
  @import "../common/less/variable";
  .recordingAction {
    font-size: 14px;
    display: flex;
    flex-direction: column;
    align-items:center;
    color: @color-2;
    padding:5px 0 15px 0;
    .ty-luyin {
      color: @color-1;
      font-size: 50px;
      height: 50px;
      line-height: 50px;
    }
  }
</style>
