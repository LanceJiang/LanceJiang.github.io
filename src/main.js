import Vue from 'vue'
import App from './App'
import '@/common/css/weui.css'
import '@/common/icon/weui-icon_font.less'
import '@/common/theme/iconfont.css'
import {global} from "@/common/constant/constant"
import store from '@/store/index'

Vue.prototype.$store = store
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue(App)
app.$mount()
Vue.prototype.GLOBAL = global

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，会自动把 webpack entry 里面的入口页面加进去
    pages: ['^pages/index/main'],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#2db7f5',
      navigationBarTitleText: '福田随手拍',
      navigationBarTextStyle: 'white'
    },
    tabBar: {
      color: '#d4d4d4',
      backgroundColor: '#fff',
      selectedColor: '#2db7f5',
      borderStyle: 'black',

      list: [{
        text: '发现',
        pagePath: 'pages/index/main',
        iconPath: 'static/tabs/photo.png',
        selectedIconPath: 'static/tabs/photo-1.png'
      }, {
        text: '我的',
        pagePath: 'pages/my/main',
        iconPath: 'static/tabs/my.png',
        selectedIconPath: 'static/tabs/my-1.png'
      }],

      position: 'bottom'
    },
    permission: {
      'scope.userLocation': {
        desc: '你的位置信息将用于小程序位置接口的效果展示'
      }
    }

  }
}
