<template>
  <div class="starting-page">
    <map class="map-didi"
         id="map-didi"
         :latitude="latitude"
         :longitude="longitude"
         :markers="markers"
         @regionchange="regionChange"
         @begin="begin"
         @end="end"
         show-location
    >

      <cover-image class="location-marker"
                   src="/static/img/location.png"
                   @click.stop="onclickLocation">
      </cover-image>

      <cover-view class="center-marker">
        <!-- <cover-view class="text-center">test test test</cover-view>-->
        <cover-image src="/static/img/marker.png" class="img-center"></cover-image>
      </cover-view>

      <cover-view class="address">
        <cover-image src="/static/img/marker.png" class="img-address"></cover-image>
        <cover-view class="address-desc">
          <cover-view class="blur">{{tempPlaceAddress}}</cover-view>
          <cover-view class="detail">{{tempFormattedPlace}}</cover-view>
        </cover-view>
        <cover-view class="btn-address" @click.stop="setStartPlace">确定</cover-view>
      </cover-view>
    </map>
  </div>
</template>

<script type="text/ecmascript-6">
  import {QQ_MAP_key} from '@/common/constant/constant'
  import QQMapWX from '../../common/lib/qqmap-wx-jssdk.js'
  import {reverseGeocoder, getDeepData} from '../../utils/index'
  import {mapState, mapMutations} from 'vuex'

  const qqmapsdk = new QQMapWX({
    key: QQ_MAP_key
  });

  let touchTimeStamp = 0

  export default{
    data(){
      return {
        latitude: 0,
        longitude: 0,
        markers: [],
        // addresses: [],

        tempPlaceAddress: '', // 临时定位地点
        tempFormattedPlace: '', // 临时人性化定位地点
      }
    },
    computed: {
      ...mapState([
        'placeAddress', // 定位地点
        'formattedPlace', // 人性化定位地点
        'position', // 经纬度
      ])
    },
    watch: {
      formattedPlace (val, oldVal) {
        if (val != this.tempFormattedPlace) {
          this.tempFormattedPlace = val;
          this.tempPlaceAddress = this.placeAddress
        }
      }
    },
    onShow(){
//     保证后面可以拿到经纬度
      this.initLocation()
      this.mapCtx = wx.createMapContext("map-didi"); // 地图组件的id
    },
    onUnload(){
      this.clearData()
    },
    methods: {
      initLocation(){
        if (this.position.length) {
          this.latitude = this.position[0]
          this.longitude = this.position[1]
        } else {
          wx.getLocation({
            type: "gcj02",
            success: (res) => {
              this.latitude = res.latitude
              this.longitude = res.longitude
            }
          })
        }
      },
      clearData(){
        this.addresses = []
      },
      onclickLocation(e){
        this.mapCtx.moveToLocation()
      },
      regionChange(){
        console.log('regionChange', e)
      },
      begin({timeStamp}){
        touchTimeStamp = timeStamp
      },
      end({timeStamp}){
//       加入时间判断
//       解决修改data内数据导致地图在拖动开始时闪回原位的bug
        if (timeStamp - touchTimeStamp > 50) {
          this.mapCtx.getCenterLocation({
            success: (res) => {
              reverseGeocoder(qqmapsdk, res).then(res => {
                const result = res.result;
                this.tempPlaceAddress = result.address;
                this.tempFormattedPlace = result.formatted_addresses.recommend;
              })
              const lon_distance = res.longitude - this.longitude
              const lat_distance = res.latitude - this.latitude
              // 更新当前位置坐标
              this.longitude = res.longitude
              this.latitude = res.latitude
              //判断屏幕移动的距离，如果超过阀值
              /*if (Math.abs(lon_distance) >= 0.0022 || Math.abs(lat_distance) >= 0.0022) {
                //刷新附近的车
              }*/
            }
          })
        }
      },
      setStartPlace(){
        //这里只需要再保存位置就好了
        // 写一个 保存 位置的 操作函数
        this.setPosition([this.latitude, this.longitude])
        this.setPlaceAddress(this.tempPlaceAddress);
        this.setFormattedPlace(this.tempFormattedPlace)
        wx.switchTab({
          url: "/pages/index/main",
        })
      },
      ...mapMutations({
        setPlaceAddress: 'SET_PLACE_ADDRESS',
        setFormattedPlace: 'SET_FORMATTED_PLACE',
        setPosition: 'SET_POSITION',
      })
    },
  }
</script>

<style lang="less" scoped>
  @import '../../common/less/mixin';
  @import '../../common/less/variable';
  .starting-page {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    .map-didi {
      width: 100%;
      height: 100%;
      .location-marker {
        position: fixed;
        left: 12px;
        bottom: 95px;
        width: 32px;
        height: 32px;
      }
      .center-marker {
        position: fixed;
        left: 50%;
        top: calc(50% - 47px);
        transform: translateX(-50%);
        width: 110px;
        height: 70px;
        text-align: center;
        .text-center {
          padding: 0 4px;
          position: relative;
          height: 25px;
          line-height: 25px;
          color: #f5f5f5;
          background-color: #616161;
          font-size: 12px;
          border-radius: 12px;
          box-sizing: border-box;
        }
        .inverted-triangle {
          position: absolute;
          left: 45px;
          top: 16px;
          width: 20px;
          height: 20px;
        }
        .img-center {
          display: inline-block;
          margin-top: 8px;
          width: 38px;
          height: 40px;
          /*font-size: 25px;
          color: #f00;*/
        }
      }
      .address {
        display: flex;
        align-items: center;
        position: absolute;
        bottom: 20px;
        left: 12px;
        right: 12px;
        height: 60px;
        box-sizing: border-box;
        overflow: hidden;
        background-color: #fff;
        .img-address {
          padding-left: 4px;
          flex: 0 0 40px;
          width: 40px;
          height: 40px;
          /*font-size: 35px;
          color: @color-1;*/
        }
        .address-desc {
          margin-left: 5px;
          flex: 1;
          height: 40px;
          .blur {
            font-size: 14px;
            color: #333333;
            .no-wrap();
          }
          .detail {
            padding-top: 6px;
            .no-wrap();
            font-size: 12px;
            color: #c7c7c7;
          }
        }
        .btn-address {
          padding: 20px;
          letter-spacing: 4px;
          flex: 0 0 40px;
          text-align: center;
          font-size: 18px;
          color: #333;
        }
      }
    }
  }
</style>
