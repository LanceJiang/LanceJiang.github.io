export default class Mangom {
  /**
   * 图片上传方法
   * url: 图片上传地址
   * tempFilePath:待上传本地图片地址
   */
  static uploadFile = (url, tempFilePath, success, fail) => {
    let filename = tempFilePath.substr(tempFilePath.lastIndexOf('/') + 1);
    console.log("上传信息" + JSON.stringify({ "url": url, "tempFilePath": tempFilePath, "filename": filename }))
    wx.uploadFile({
      url: url,
      filePath: tempFilePath,
      name: 'Filedata',
      formData: {
      },
      success: function (res) {
        success && success(res)
      },
      fail: function (res) {
        fail && fail(res)
      }
    })
  }


  /**
   * 处理下拉刷新行为
   */

  /**
   * 开始刷新
   */
  static beginRefresh = () => {
    wx.showNavigationBarLoading() //在标题栏中显示加载
  }

  /**
   * 刷新结束
   */
  static overRefresh = () => {
    //耗时任务处理
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  }

  /**
   * 开始加载更多
   */
  static beginLoadMore = (cnx) => {
    if (!cnx.data.showLoadMore) {
      cnx.setData({
        showLoadMore: true, //显示加载更多
      })
      cnx.loadData()
    }
  }

}
