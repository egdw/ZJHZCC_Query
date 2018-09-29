//index.js
//获取应用实例
const app = getApp()
var database = require("../../utils/data.js")

Page({
  data: {
    article: {},
    array: ['无'],
    data_get_complete: false,
    hiddenmodalput: true,
    searchInput: ''
  },
  onShow: function () {
    var self = this;
    wx.getStorage({
      key: 'lastFresh',
      success: function(res) {
        if (((new Date()).valueOf() - parseInt(res.data))/1000 > 10){
          wx.getStorage({
            key: 'myclass',
            success: function (res) {
              wx.showLoading({
                title: '加载中..',
              })
              database.getMessageByName(res.data).then(function (data) {
                if (data.result == null || data.result == undefined) {
                  wx.showToast({
                    title: '获取数据错误',
                    icon: 'none'
                  })
                } else {
                  let markdown = app.towxml.toJson(data.result.review, 'markdown');
                  data.theme = 'dark';
                  self.setData({
                    article: markdown
                  });
                }
                wx.setStorage({
                  key: 'lastFresh',
                  data: (new Date()).valueOf(),
                })
                wx.hideLoading();
              })
            },
            fail: function () {
              wx.showToast({
                title: '还没有选择班级!',
                icon: 'none'
              })
            }
          })
        }
      },fail:function(){
        wx.setStorage({
          key: 'lastFresh',
          data: (new Date() - 100000).valueOf(),
        })
        self.onShow();
      }
    })
  },
  changeClass: function () {
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
          data_get_complete: true
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

  }, onLoad: function () {
    this.changeClass();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '在杭商院想快速查询自习教室?用这个!',
      desc: '在杭商院想快速查询自习教室?用这个!',
      path: 'pages/index/index'
    }
  },
  modalinput: function () {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },
  //取消按钮  
  cancel: function () {
    this.setData({
      hiddenmodalput: true,
      searchInput: ''
    });
  },
  //确认  
  confirm: function () {
    this.setData({
      hiddenmodalput: true
    })
    wx.showLoading({
      title: '搜索中..',
    })
    var flag = false;
    var self =this;
    for (var i = 0; i < this.data.array.length; i++) {
      if (this.data.array[i] == this.data.searchInput.toUpperCase() || this.data.array[i] == this.data.searchInput.toLowerCase()) {
        flag = true;
        wx.setStorage({
          key: 'myclass',
          data: this.data.searchInput,
        })
        self.setData({
          selectd: this.data.searchInput
        });
        wx.setStorage({
          key: 'isSave',
          data: true,
        })
        self.setData({
          searchInput:''
        })
        wx.removeStorage({
          key: 'lastFresh',
          success: function(res) {
            console.log("移除成功")
            self.onShow();
          },
        })
        break;
      }
    }
    if (!flag){
        wx.showToast({
          title: '没有找到班级',
          icon:'none'
        })
    }
    wx.hideLoading();
  },
  userInput: function (e) {
    this.setData({
      searchInput: e.detail.value.toLowerCase().replace(/\s+/g, "")
    })
  }
})
