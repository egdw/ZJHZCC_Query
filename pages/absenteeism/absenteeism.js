// absenteeism.js
var database = require("../../utils/data.js")
const app = getApp()

Page({

  data: {
    article: {}
  },

  onShow: function () {
    var self = this;
    wx.getStorage({
      key: 'lastFresh2',
      success: function(res) {
        if (((new Date()).valueOf() - parseInt(res.data)) / 1000 > 10) {
          //十秒内不能多次刷新
          wx.getStorage({
            key: 'myabs',
            success: function (res) {
              wx.showLoading({
                title: '加载中..',
              })
              database.getAbsenteeismMessageByName(res.data).then(function (data) {
                if (data.result == null || data.result == undefined) {
                  wx.showToast({
                    title: '获取数据错误',
                    icon: 'none'
                  })
                } else {
                  let markdown = app.towxml.toJson(data.result.message, 'markdown');
                  data.theme = 'dark';
                  self.setData({
                    article: markdown
                  });
                }
                wx.setStorage({
                  key: 'lastFresh2',
                  data: (new Date()).valueOf(),
                })
                wx.hideLoading();
              })
            }, fail: function () {
              wx.showToast({
                title: '还没有选择分院!',
                icon: 'none'
              })
            }
          })
        }
      },fail:function(){
        wx.setStorage({
          key: 'lastFresh2',
          data: (new Date() - 100000).valueOf(),
        })
        self.onShow();
      }
    })
    
  },

  onShareAppMessage: function () {
    return {
      title: '在杭商院想快速查询缺勤?用这个!',
      desc: '在杭商院想快速查询缺勤?用这个!',
      path: 'pages/absenteeism/absenteeism'
    }
  }, changeClass: function () {
    var self = this;
    database.getAllAbsenteeismMessage().then(function (data) {
      if (data.result == null || data.result == undefined) {
        wx.showToast({
          title: '获取数据错误',
          icon: 'none'
        })
      } else {
        var arr = [];
        for (var i = 0; i < data.result.length; i++) {
          arr[i] = data.result[i].branch_courts;
        }
        self.setData({
          array: arr,
        });
        self.onShow();
      }
      wx.hideLoading();
    })
  }, bindPickerChange: function (e) {
    var self = this;
    var newClass = this.data.array[(e.detail.value)]
    if (newClass != undefined && newClass != null) {
      wx.setStorage({
        key: 'myabs',
        data: newClass,
      })
      wx.setStorage({
        key: 'isSave2',
        data: true,
      })
      self.setData({
        selectd2: newClass
      });
      wx.removeStorage({
        key: 'lastFresh2',
        success: function (res) {
          self.onShow();
        },
      })
      self.onShow();
    }

  }, onLoad: function () {
    this.changeClass();
  }
})