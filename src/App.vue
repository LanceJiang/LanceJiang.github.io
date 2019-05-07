<script>
  import {request} from '@/api/request'
  import {mapState, mapMutations} from 'vuex'

  export default {
  computed: {
    ...mapState([
      'userInfo', // 定位地点
    ])
  },
  methods: {
    ...mapMutations({
      setUserInfo: 'SET_USER_INFO',
    })
  },
  created () {
    // 调用API从本地缓存中获取数据
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     * 头条：mpvue === tt, mpvuePlatform === 'tt'
     * 百度：mpvue === swan, mpvuePlatform === 'swan'
     * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
     */

    let logs
    if (mpvuePlatform === 'my') {
      logs = mpvue.getStorageSync({key: 'logs'}).data || []
      logs.unshift(Date.now())
      mpvue.setStorageSync({
        key: 'logs',
        data: logs
      })
    } else {
      logs = mpvue.getStorageSync('logs') || []
      logs.unshift(Date.now())
      mpvue.setStorageSync('logs', logs)
    }
  },
  onLaunch: function () {
    console.log('onLaunch...............................')
    var that = this
    const {userInfo} = this;
    // if ((!userInfo.openid || (userInfo.expires_in || Date.now()) < (Date.now() + 600)) && (!userInfo.nickName)){
      wx.login({
        success: function(res){
          if (res.code) {
            request({
              url: 'http://abc.topevery.com/djg/EventHandler.ashx?action=getopenid&code=' + res.code
            }).then((res) => {
              const data = JSON.parse(res.Data)
              let _userInfo = {
                openid: data.openid,
                session_key: data.session_key,
                expires_in: +Date.now()
              }
              const resultInfo = {
                ...userInfo,
                ..._userInfo
              }
              that.setUserInfo(resultInfo)
            });
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });
    // }
  },
  mounted () {
  },
  log () {
    console.log(`log at:${Date.now()}`)
  },
}
</script>

<style lang="less">
  @import "./common/less/variable";
  .container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
/* 没有用scope 可作为全局样式 */
.no-msg {
  line-height: 50vh;
  font-size:15px;
  text-align: center;
  color: @color-2;
}
</style>
