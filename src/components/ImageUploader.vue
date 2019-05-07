<template>
  <div class="img-list">
    <div class="weui-cells">
      <div class="weui-cell">
        <div class="weui-cell__bd">
          <div class="weui-uploader">
            <!--头部信息  -->
            <div class="weui-uploader__hd" v-if="!hideHeader">
              <div class="weui-uploader__title">图片上传</div>
              <div class="weui-uploader__info">{{files.length}}/9</div>
            </div>
            <!-- 功能区域 -->
            <div class="weui-uploader__bd">
              <div class="weui-uploader__files" id="uploaderFiles">
                <block v-for="(file, index) in files" :key="file">
                  <div :class="['weui-uploader__file', {'weui-uploader__file_status': filesErrorStatus[index]}]" @tap="previewImage" :id="file">
                    <div v-if="filesErrorStatus[index]" class="weui-uploader__file-content">
                      <!-- 上传出错icon -->
                      <i class="weui-icon-warn"></i>
                    </div>
                    <span class="weui-icon-clear delete" v-if="filesErrorStatus[index] === undefined" @tap.stop="deleteImg(index)"></span>
                    <img class="weui-uploader__img" :src="file" mode="aspectFill" />
                  </div>
                </block>
              </div>
              <div class="weui-uploader__input-box" v-if="files.length<9">
                <div class="weui-uploader__input" @tap="chooseImage"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mangom from '@/utils/mangom'

export default {
  /**
   * 组件的属性列表
   */
  props: {
    //上传图片的地址
    url: {
      type: String,
      value: ""
    },
    //是否隐藏头部
    hideHeader: {
      type: Boolean,
      value: false
    },
    // 若把 上传图片的操作 交给父级， wrapUpload函数需要 获取该组件的 实例 把对应的 uploadImages 拿出去执行
    isWrapUpload: {
      type: Boolean,
      value: false
    },
    finallyCallback: {
      type: Function,
      default: () => {
        console.log('finallyCallback： 图片列表上传结束回调执行')
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data () {
    return {
      files: [],
      // 上传出错icon 数组
      filesErrorStatus: []
    }
  },
  mounted () {
    // setInterval(() => {
    //   console.error('当前的 url 为：', this.$attrs, this.url)
    // }, 400)
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 选择图片
     */
    chooseImage: function (e) {
      let that = this;
      wx.chooseImage({
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
          console.log(res, 'res  chooseImage')
          // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
          let tempFilePaths = res.tempFilePaths,
            _newIndex = that.files.length; // 用于列表是否 上传成功的 index起始位
          if (that.files.length < 9) {
            that.files = that.files.concat(tempFilePaths)
          }
          // 如果上传组件 外部不可以调用上传功能的操作 才默认 提交后台
          if (!that.isWrapUpload) {
            that.uploadImages(that.url, tempFilePaths, _newIndex)
          }
        }
      })
    },

    previewImage: function (e) {
      wx.previewImage({
        current: e.currentTarget.id, // 当前显示图片的http链接
        urls: this.files // 需要预览的图片http链接列表
      })
    },
    uploadImages(requestUrl, filePaths, fileIndexStart = 0) {
      const { files } = this;
      const _requestUrl = requestUrl || this.url;
      console.warn('开始上传图片了.........', requestUrl, '请求接口的url 是否有案件id')
      let _fileIndex = fileIndexStart,
        tempFilePaths = filePaths || files;
        if (files.length) {
          for (let i = 0; i < tempFilePaths.length;i++){
            // console.log(i, 'index....................')
            const _index = _fileIndex + i;
            mangom.uploadFile(_requestUrl, tempFilePaths[i], (res) => { // 成功回调
              this.$set(this.filesErrorStatus, _index, false)
              this.$emit('uploadSuccess', res, _index)
              console.warn('图片上传 第 index 个 成功了', _index)
              if (_index + 1 === files.length) {
                this.finallyCallback()
              }
            }, (res) => { // 失败回调
              this.$set(this.filesErrorStatus, _index, true)
              this.$emit('uploadFail', res, _index)
              console.warn('图片上传 第 index 个 失败了', _index)
              if (_index + 1 === files.length) {
                this.finallyCallback()
              }
            })
          }
        } else { // 如果没有图片上传 直接走 请求成功的 回调
          this.finallyCallback()
        }
    },
    deleteImg(index) {
      console.log('delete', index);
      this.files.splice(index, 1)
    }
  }
}
</script>

<style scoped lang="less">
  .img-list {
  }
  .weui-uploader__img{
    display:block;
    width:79px;
    height:79px
  }
  .delete {
    font-size:18px;
    color:#f00;
    padding:0;
    width: 22px;
    height: 22px;
  }
  .weui-uploader__file {
    position: relative;
  }
  .weui-cells {
    margin-top: 0;
    &:after, &:before {
      border: 0;
    }
  }
</style>
