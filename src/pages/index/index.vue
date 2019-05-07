<template>
  <div class="indexWrap">
    <!-- 图片上传 -->
    <ImageUploader
      :url="url"
      :hideHeader="true"
      @uploadSuccess="uploadSuccess"
      @uploadFail="uploadFail"
      :finallyCallback="ImgsUploadFinallyCallback"
      :isWrapUpload="true"
      ref="imgUpload"
    />
    <!-- 位置定位 -->
    <div class="title">
      <span class="place">{{formattedPlace}}</span>
      <i class="iconfont ty-htmal5icon14" @tap="openMapLink"></i>
    </div>
    <!-- 录音/文字输入 -->
    <div class="recordingWrap">
      <!-- 录音列表 -->
      <!--<div class="list">
        <RecordingList :list="list"/>
      </div>-->
      <textarea class="textarea" v-model="textarea" placeholder="请输入问题描述（1-100字） 例如：某某街道某某大厦楼下有烧烤摆摊现象" maxlength="100"></textarea>
    </div>
    <!-- 录音提交 按钮 -->
<!-- <RecordingBtn @updateList="updateList"/> -->
    <div class="btn" @tap="formSubmit">上报</div>
  </div>
</template>

<script>
import ImageUploader from '@/components/ImageUploader'
import RecordingList from '@/components/RecordingList'
import RecordingBtn from '@/components/RecordingBtn'
import {request} from '../../api/request'
import {reverseGeocoder, getDeepData, showToast} from '../../utils/index'
import {mapState, mapMutations} from 'vuex'
import {QQ_MAP_key} from '../../common/constant/constant'
import QQMapWX from '../../common/lib/qqmap-wx-jssdk.js'

const qqmapsdk = new QQMapWX({
  key: QQ_MAP_key
})
const baseUrl = 'http://abc.topevery.com/djg/EventHandler.ashx?action=convenientlyUpload&evtId=';// 提交图片的 接口
export default {
  data () {
    return {
      textarea: '',
      fileId: '',
      uploadResult: true, // 上传图片列表 的返回值
      // audio temptemptemp todo...
      list: [{
        id: 1,
        timing: 0,
        percent: 0,
        src: 'http://ws.stream.qqmusic.qq.com/M500001VfvsJ21xFqb.mp3?guid=ffffffff82def4af4b12b3cd9337d5e7&uin=346897220&vkey=6292F51E1E384E06DCBDC9AB7C49FD713D632D313AC4858BACB8DDD29067D3C601481D36E62053BF8DFEAF74C0A5CCFADD6471160CAF3E6A&fromtag=46',
        duration: 2000
      }]
    }
  },
  computed: {
    url () {
      console.log(baseUrl + this.fileId, 'error url拼接.... 案件id')
      return baseUrl + this.fileId
    },
    ...mapState([
      'formattedPlace', // 定位地点
      'userInfo',
      'position', // 经纬度
    ])
  },
  components: {
    ImageUploader,
    // RecordingList,
    // RecordingBtn
  },

  methods: {
    getFormattedPlace () {
      /*const res = await request({url:'/comments'})*/
      mpvue.showLoading({ mask: true, title: '加载中' })
      wx.getLocation({
        type: 'gcj02',
        success: (res) => {
          // console.log(res, 'res getLocation')
          // res.latitude, res.longitude  获取经度 纬度
          this.GLOBAL.location = res;
          this.setPosition([res.latitude, res.longitude]);
          reverseGeocoder(qqmapsdk, res).then(res => {
            if (res.result) {
              this.setPlaceAddress(res.result.address)
              this.setFormattedPlace(res.result.formatted_addresses.recommend)
            }
          }).finally(() => {
            mpvue.hideLoading()
          })
        },
        fail: () => {
          mpvue.hideLoading();
          this.setFormattedPlace('- -')
        }
      })
    },
    /**
     * 图片上传成功，组装待上传字符串
     */
    uploadSuccess: function (res, index) {
      console.warn('uploadSuccess 图片上传 成功   处理', res, index)
      let data = JSON.parse(res.data)
      if (!data.IsSuc) { // 每一张图片都有回调
        showToast(`第${index}图片上传失败`)
        this.uploadResult = false;
      }
    },
    uploadFail (err, index) {
      console.error(err, '上传失败 uploadFail', index)
      this.uploadResult = false;
      let errMsg = err.errMsg;
      if (errMsg) {
        showToast(errMsg)
      }
    },
    formSubmit: function() {
      // 提交页面的 图片信息  以及  textarea 信息
      const [ lat, lng ] = this.position;
      request({
        data: {
          action: 'conveniently', // 案件上报接口
          evtRptType: 5,
          wechatId: this.userInfo.openid, // 小程序openid
          evtDesc: this.textarea, // 问题描述
          evtAddr: this.formattedPlace, // 地址
          lng, // 经度
          lat // 纬度
        }// 返回案件 id
      }).then((res) => {
        console.error(res, '返回案件 id: res.Data')
        this.fileId = res.Data;
        // 集体上传图片
        this.$refs['imgUpload'].uploadImages(baseUrl + res.Data);
      })
    },
    ImgsUploadFinallyCallback () {
      console.warn('上报完成后的 回调被触发....ImgsUploadFinallyCallback')
      if (this.uploadResult) {
        this.textarea = ''; // 清空textarea
        this.$refs['imgUpload'].files = []; // 清空图片列表数组
        showToast('相关数据上传成功');
      } else {
        this.uploadResult = true; // 点击提交 默认上传 数据成功
      }
    },
    openMapLink () {
      wx.navigateTo({
        url: '/pages/map/main'
      })
    },
    // 添加语音列表
    updateList (obj) {
      this.list.push(obj)
    },
    ...mapMutations({
      setPlaceAddress: 'SET_PLACE_ADDRESS',
      setFormattedPlace: 'SET_FORMATTED_PLACE',
      setPosition: 'SET_POSITION',
    })
  },
  created () {
    // let app = getApp()
    this.getFormattedPlace()
  },
  mounted() {
    // console.log('mounted', this.$refs)
  },
  onShow () {
    const _this = this
    if (this.GLOBAL.isFirstGetLocation) {
      this.GLOBAL.isFirstGetLocation = false;
    } else {
      mpvue.getSetting({
        success (res) {
          if (!res.authSetting['scope.userLocation']) { // 未授权
            mpvue.showModal({
              title: '授权提示',
              content: '您还未授权获取地理位置，点击确定前往开启授权',
              success: function (res) {
                if (res.confirm) {
                  mpvue.openSetting({
                    success: function (result) {
                      var authSetting = result.authSetting
                      // 判断是否授权
                      if (authSetting['scope.userLocation']) { // 首次授权
                        _this.getFormattedPlace()
                      }
                    }
                  })
                }
              }
            })
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import "../../common/less/variable";

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}
// start
.indexWrap {
  height: 100vh;
  background: #fafafa;
  color: @color-3;
  font-size: 14px;
}
.title {
  height: 40px;
  line-height: 40px;
  margin: 5px 0;
  background: #fff;
  padding-left: 15px;
  .place {
    display: inline-block;
    max-width: 80%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space: nowrap;
  }
}
.ty-htmal5icon14 {
  font-size: 25px;
  float: right;
  color: @color-2;
}
.recordingWrap {
  border-top: 1px solid #e4e4e4;
  border-bottom: 1px solid #e4e4e4;
  background: #fff;
  .list {
    border-bottom: 1px solid #e4e4e4;
    padding: 10px 0 10px 15px;
  }
  .textarea {
    padding: 6px 15px;
    height: 78px;
    overflow-y: auto;
  }
}
.btn {
  margin: 0 20px;
  margin-top: 20px;
  background: @color-1;
  color: #fff;
  border: 1px solid #0ba1e4;
  text-align:center;
  line-height:36px;
  height:36px;
  font-size:16px;
  border-radius:3px;
}
</style>
