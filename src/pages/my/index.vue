<template>
  <div class="my">

    <div class="weui-cell user">
      <template v-if="userInfo.avatarUrl">
        <img :src="userInfo.avatarUrl" alt="暂无图片">
        <p>{{userInfo.nickName || '- -'}}</p>
      </template>
      <template v-else>
        <button class="userInfoBtn" open-type="getUserInfo" lang="zh_CN" @getuserinfo="setUserInfoCallBack">获取用户信息</button>
      </template>
    </div>
    <div class="list">
      <template v-if="userInfo.avatarUrl">
        <div class="item" @tap="navigateLink">
          <i class="iconfont ty-pengyouquan"></i>
          <span class="content">历史发现</span>
          <i class="iconfont ty-youjiantou2 "></i>
        </div>
      </template>
      <template v-else>
        <div class="no-msg">
          暂无记录
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'

export default {
  components: {
  },
  data () {
    return {
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
    }
  },
  computed: {
    ...mapState([
      'userInfo', // 用户信息
    ]),
  },
  methods: {
    // 首次授权  用户信息.... 操作的回调（是否给权限 都会走回调）
    setUserInfoCallBack (e) {
      const userInfo = e.mp.detail.userInfo
      // console.error(userInfo, 'userInfo...................... 设置后触发...')
      const resultInfo = {
        ...this.userInfo,
        ...userInfo
      }
      if (userInfo) {
        this.setUserInfo(resultInfo);
      }
    },
    // 请求  用户信息....(需要 用户授权 获取用户权限)
    getUserInfo () {
      const _this = this;
      mpvue.showLoading({ mask: true, title: '加载中' })
      wx.getUserInfo({
        success: res => {
          // console.error(res, 'res getUserInfo')
          mpvue.hideLoading();
          const resultInfo = {
            ...this.userInfo,
            ...res.userInfo
          }
          this.setUserInfo(resultInfo)
        },
        fail: () => {
          mpvue.hideLoading();
        }
      })
    },
    navigateLink () {
      wx.navigateTo({
        url: '/pages/logs/main'
      })
    },
    ...mapMutations({
      setUserInfo: 'SET_USER_INFO',
    })
  },
  mounted () {
    // console.log('GLOBAL', this.GLOBAL, this.$data)
  },
  onShow () {
    // 获取用户信息
    const _this = this
    /*mpvue.getSetting({
      success (res) {
        console.log(res, '获取用户信息...')
        if (!res.authSetting['scope.userInfo']) { // 未授权
          /!*mpvue.showModal({
            title: '授权提示',
            content: '您还未授权获取用户信息，点击确定前往开启授权',
            success: function (res) {
              if (res.confirm) {
                mpvue.openSetting({
                  success: function (result) {
                    console.error(result, 'result ....')
                    var authSetting = result.authSetting
                    // 判断是否授权
                    if (authSetting['scope.userInfo']) { // 已授权
                      // _this.setUserInfoCallBack()
                    }
                  }
                })
              }
            }
          })*!/
        } else { // 已授权
          _this.getUserInfo()
        }
      }
    })*/
  }
}
</script>

<style lang="less" scoped>
@import "../../common/less/variable";
.my {
  height: 100vh;
  background: #fafafa;
  color: @color-3;
}
.user {
  display: flex;
  align-items:flex-start;
  font-size: 15px;
  background: #fff;
  border-bottom: 1px solid #e4e4e4;
  img { // .no-img
    width: 40px;
    height: 40px;
    border-radius: 3px;
    margin-right: 10px;
  }
  .userInfoBtn {
    width: 80px;
    height: 40px;
    line-height:40px;
    padding: 0;
    margin: 0;
    box-sizing:border-box;
    font-size:12px;
    text-align:center;
    text-decoration:none;
    border-radius:0;
    -webkit-tap-highlight-color:transparent;
    overflow:hidden;
    color: @color-3;
    background-color: transparent;
  }
}
.list {
  margin-top: 10px;
  .item {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 40px;
    line-height: 40px;
    margin: 5px 0;
    background: #fff;
    padding-left: 15px;
    font-size: 15px;
    .content {
      flex: 1 0 auto;
      max-width: 90%;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }
}
.ty-pengyouquan, .ty-youjiantou2 {
  color: @color-2;
  font-size: 25px;
  width: 25px;
  height: 25px;
  line-height: 25px;
}
.ty-pengyouquan {
  margin-right:8px;
  color: @color-1;
}
</style>
