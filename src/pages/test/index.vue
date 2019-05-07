<template>
  <div>
    <div class="record">
      <!--<div class="start">
        <span @touchstart="start" @touchend="touchEnd">radio.png 录音</span>
        <span>语音录入，录制时间最长为3分钟</span>
      </div>-->
      <RecordingList :list="list"/>
      <RecordingBtn @updateList="updateList"/>
    </div>
  </div>
</template>

<script>
  import RecordingList from '@/components/RecordingList'
  import RecordingBtn from '@/components/RecordingBtn'

  export default {
    components: {
      RecordingList,
      RecordingBtn
    },

    data () {
      let src = 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46';
        return {
        src: src,
        list: [{
          id: 1,
          timing: 0,
          percent: 0,
          src: src,
          duration: 2000
        }, {
          id: 2,
          timing: 0,
          percent: 0,
          src: src,
          duration: 3000
        }]
      }
    },

    mounted () {
      this.recorderManager = wx.getRecorderManager() // 录音管理器 暂存器
      // const innerAudioContext = wx.createInnerAudioContext()  // 音频播放 （一段视频一个实例）
    },
    methods: {
      /*// 开始录音的时候
      start () {
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
          // this.src = tempFilePath; // todo...
          this.list.push({
            id: 44,
            timing: 0,
            percent: 0,
            src: tempFilePath,
            duration: duration
          })
        })
      },*/
      // 播放声音
      play (i) {
        let $this = this
        const innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.autoplay = true
        // innerAudioContext.src = this.src
        // console.error(this.list[i], 'this.list[i]', i)
        innerAudioContext.src = i.src
        innerAudioContext.onPlay(() => {
          let times = 0
          let timer = setInterval(() => {
            times += 1000
            i.percent = parseInt(times / i.duration * 100)
            i.timing = $this.tempToTime(times)
            if (times > i.duration) {
              innerAudioContext.stop()
              i.timing = 0
              i.percent = 0
              clearInterval(timer)
            }
          }, 1000)
        })
      },
      del (i, idx) {
        this.list.splice(idx, 1)
      },
      tempToTime (s) {
        if (s < 60000) {
          return `00:${formatNumber(s / 1000)}`
        } else if (s < 120000) {
          return `01:${formatNumber((s - 6000) / 1000)}`
        } else if (s < 180000) {
          return `02:${formatNumber((s - 12000) / 1000)}`
        } else {
          return `03:00`
        }
      },
      updateList (obj) {
        this.list.push(obj)
      }
    }
  }
  function formatNumber(n) {
    const str = n.toString()
    return str[1] ? str : `0${str}`
  }
</script>

<style scoped lang="less">
  @import "../../common/less/variable";
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
