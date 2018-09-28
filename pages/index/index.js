//index.js
//获取应用实例
const app = getApp()
var database = require("../../utils/data.js")

Page({
  data: {
    article: {},
    array: ['无'],
    data_get_complete:false
  },
  onShow:function(){
    var self = this;
    wx.getStorage({
      key: 'myclass',
      success: function (res) {
        wx.showLoading({
          title: '加载中..',
        })
        database.getMessageByName(res.data).then(function (data) {
          if (data.result == null || data.result == undefined){
              wx.showToast({
                title: '获取数据错误',
                icon:'none'
              })
          }else{
            let markdown = app.towxml.toJson(data.result.review, 'markdown');
            data.theme = 'dark';
            self.setData({
              article: markdown
            });
          }
          wx.hideLoading();
        })
      },
      fail: function () {
        wx.showToast({
          title: '还没有选择班级!',
          icon:'none'
        })
      }
    })
  },
  changeClass:function(){
    var self = this;
    database.getAllMessage().then(function (data) {
      if (data.result == null || data.result == undefined) {
        wx.showToast({
          title: '获取数据错误',
          icon: 'none'
        })
      } else {
        var arr = [];
        for (var i = 0; i < data.result.length; i++) {
          arr[i] = data.result[i].class_name;
        }
        self.setData({
          array: arr,
          data_get_complete:true
        });
        self.onShow();
      }
    })
  }, bindPickerChange: function (e) {
    var self = this;
    var newClass = this.data.array[(e.detail.value)]
    if (newClass != undefined && newClass != null) {
      wx.setStorage({
        key: 'myclass',
        data: newClass,
      })
      self.setData({
        selectd: newClass
      });
      wx.setStorage({
        key: 'isSave',
        data: true,
      })
      self.onShow();
    }

  },onLoad:function(){
    this.changeClass();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '杭商院想快速查询自习教室?用这个!',
      desc: '杭商院想快速查询自习教室?用这个!',
      path: 'pages/index/index'
    }
  }
})
