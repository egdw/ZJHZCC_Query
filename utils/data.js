var Bmob = require('bmob.js');
Bmob.initialize("6f98898341f7328bd38e708289c7836b", "7979d5a5467bc8b3b80a77ccb44de034");

/**
 * 通过登录获取当前用户的班级和学院
 */
function login(userId) {
  return new Promise((resolve, reject) => {
    const query = Bmob.Query('mUser');
    query.equalTo("openid", "==", userId);
    query.find().then(res => {
      if (res[0] == null || res[0] == undefined) {
        resolve({
          result: null
        })
      } else {
        resolve({
          result: res[0]
        })
      }
    }).catch(err => {
      resolve({
        result: null
      })
    })
  })
}


/**
 * 获取所有班级的自习信息
 */
function getAllMessage() {
  return new Promise((resolve, reject) => {
    const query = Bmob.Query('school_class');
    query.order("-createdAt");
    query.find().then(res => {
      if (res[0] == null || res[0] == undefined) {
        resolve({
          result: null
        })
      } else {
        var arr = [];
        for (var i = 0; i < res.length; i++) {
          arr[i] = res[i]
        }
        resolve({
          result: arr
        })
      }
    }).catch(err => {
      resolve({
        result: null
      })
    })
  })
}

/**
 * 获取所有缺勤的信息
 */
function getAllAbsenteeismMessage() {
  return new Promise((resolve, reject) => {
    const query = Bmob.Query('absenteeism');
    query.order("-createdAt");
    query.find().then(res => {
      if (res[0] == null || res[0] == undefined) {
        resolve({
          result: null
        })
      } else {
        var arr = [];
        for (var i = 0; i < res.length; i++) {
          arr[i] = res[i]
        }
        resolve({
          result: arr
        })
      }
    }).catch(err => {
      resolve({
        result: null
      })
    })
  })
}


/**
 * 获取班级的自习信息
 */
function getMessageByName(className) {
  return new Promise((resolve, reject) => {
    const query = Bmob.Query('school_class');
    query.equalTo("class_name", "==", className);
    query.find().then(res => {
      if (res[0] == null || res[0] == undefined) {
        resolve({
          result: null
        })
      } else {
        resolve({
          result: res[0]
        })
      }
    }).catch(err => {
      resolve({
        result: null
      })
    })
  })
}

/**
 * 获取缺勤的信息
 */
function getAbsenteeismMessageByName(className) {
  return new Promise((resolve, reject) => {
    const query = Bmob.Query('absenteeism');
    query.equalTo("branch_courts", "==", className);
    query.find().then(res => {
      if (res[0] == null || res[0] == undefined) {
        resolve({
          result: null
        })
      } else {
        resolve({
          result: res[0]
        })
      }
    }).catch(err => {
      resolve({
        result: null
      })
    })
  })
}





module.exports.getAllMessage = getAllMessage
exports.getAllAbsenteeismMessage = getAllAbsenteeismMessage
exports.getMessageByName = getMessageByName
exports.getAbsenteeismMessageByName = getAbsenteeismMessageByName
