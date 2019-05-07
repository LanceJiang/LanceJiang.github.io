<template>
  <div class="wrap">
    <div class="search">
      <input type="text" class="content" placeholder="请输入关键字进行搜索" v-model="keyword"/>
      <i class="iconfont ty-sousuo" @tap="searchList"></i>
    </div>
    <div class="list">
      <template v-if="list.length">
        <div class="item" v-for="item in list" :key="item">
          <header>
            {{item.ReportDate || '- -'}}
            <span v-if="item.EventState" :class="['btn', item.EventState == 2 && 'success']">{{item.EventStateStr}}</span>
            <!--<template v-if="true">
              <span class="btn success">处理完成</span>
            </template>
            <template v-else>
              <span class="btn">处理中</span>
            </template>-->
          </header>
          <div class="detail">
            <p>{{item.node}}</p>
            <ul v-if="item.eventFiles.length">
              <li v-for="(img, $index) in item.eventFiles" :key="$index"><img :src="img.FilePath" :class="[($index+1)%4 == 0 ? 'no-margin' : '']" /></li>
            </ul>
          </div>
          <footer>
              <span class="place">{{item.addess}}</span>
              <i class="iconfont ty-htmal5icon14"></i>
          </footer>
          <div v-if="item.Reply" class="reply">
            系统回复：{{item.Reply}}
          </div>
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
import { formatTime } from '@/utils/index'
import {request} from '@//api/request'
import {mapState, mapMutations} from 'vuex'

export default {
  components: {
  },

  data () {
    return {
      logs: [],
      // start
      keyword: '',
      list: []
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ]),
  },
  mounted () {
    // console.log(this.$data, 'this.userInfo', this.userInfo)
  },
  onShow () {
    this.searchList()
    // let logs
    // if (mpvuePlatform === 'my') {
    //   logs = mpvue.getStorageSync({key: 'logs'}).data || []
    // } else {
    //   logs = mpvue.getStorageSync('logs') || []
    // }
    // this.logs = logs.map(log => formatTime(new Date(log)))
  },
  methods: {
    searchList () {
      console.log('搜索 keyword, openid', this.keyword, this.userInfo.openid)
      request({
        data: {
          action: 'getconvenientlies',
          wechatId: this.userInfo.openid, // 小程序id
          keyword: this.keyword
        }
      }).then(res => {
        // console.error(res, 'res..................')
        this.list = res.Data
      })
    },
  }
}
</script>

<style lang="less" scoped>
  @import "../../common/less/variable";
  .wrap {
    height: 100vh;
    background: #fafafa;
    color: @color-3;
    font-size: 14px;
  }
  .search {
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
  .ty-pengyouquan, .ty-sousuo {
    color: @color-2;
    font-size: 25px;
    width: 25px;
    height: 25px;
    line-height: 25px;
    padding-right: 6px;
  }
  .list {
    .item {
      background: #fff;
      margin-top: 10px;
      display: flex;
      flex-direction: column;
      header, .reply {
        padding: 5px 15px;
        border-bottom: 1px solid #e4e4e4;
      }
      .btn {
        float: right;
        display: inline-block;
        width: 64px;
        height: 24px;
        line-height: 24px;
        background: @color-1;
        border-radius: 3px;
        color: #fff;
        font-size: 12px;
        text-align: center;
        &.success {
          background: #00c164;
        }
      }
      .detail {
        padding: 0 15px;
        p {
          word-break: break-word;
          line-height: 24px;
        }
        ul {
          display: flex;
          padding-top: 5px;
          flex-wrap:wrap;
        }
        img {
          display:block;
          width:79px;
          height:79px;
          margin-right: 11px;
          padding-bottom: 10px;
          &.no-margin {
            margin: 0;
          }
        }
      }
      footer {
        border-top: 1px solid #e4e4e4;
        border-bottom: 1px solid #e4e4e4;
        height: 40px;
        line-height: 40px;
        padding: 5px 0;
        background: #fff;
        .place {
          display: inline-block;
          max-width: 80%;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
        }
      }
      .reply {
        color: @color-1;
        font-weight: bold;
      }
    }
  }
  .ty-htmal5icon14 {
    font-size: 25px;
    width: 28px;
    padding-left: 4px;
    float: left;
    color: @color-2;
  }
</style>
