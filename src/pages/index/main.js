import Vue from 'vue'
import App from './index'
import store from '@/store/index'

Vue.prototype.$store = store
Vue.config.errorHandler = function (err) {
  if (console && console.error) {
    console.error(err)
  }
}

const app = new Vue(App)
app.$mount()
