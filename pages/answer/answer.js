// pages/answer/answer.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    answerArr:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var listenedNum = options.listenedNum
    for (var i = 0; i < listenedNum;i++){
      var problem = wx.getStorageSync('problemTxt' + i);
      var a;
      
      if (problem.indexOf("加")!=-1){
        var arr =problem.split("加")
        var a = arr[0]
        var b = arr[1]
        var result = parseInt(a) + parseInt(b)
        var newArray = [
          {
            id: i + 1,
            content: this.padLeft(a, 2, "&nbsp;&nbsp;") + "+" + this.padLeft(b, 2, "&nbsp;&nbsp;") + "=" + result
          }
        ]
      } else if (problem.indexOf("减") != -1){
        var arr = problem.split("减")
        var a = arr[0]
        var b = arr[1]
        var result = parseInt(a) - parseInt(b)
        var newArray = [
          {
            id: i + 1,
            content: this.padLeft(a, 2, "&nbsp;&nbsp;") + "-" + this.padLeft(b, 2, "&nbsp;&nbsp;") + "=" + result
          }
        ]
      } else if (problem.indexOf("乘") != -1) {
        var arr = problem.split("乘")
        var a = arr[0]
        var b = arr[1]
        var result = parseInt(a) * parseInt(b)
        var newArray = [
          {
            id: i + 1,
            content: this.padLeft(a, 2, "&nbsp;&nbsp;") + "*" + this.padLeft(b, 2, "&nbsp;&nbsp;") + "=" + result
          }
        ]
      }

      this.setData({
        'answerArr': this.data.answerArr.concat(newArray)
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  
  /**
  * 左补位，右对齐
  * @param oriStr 原字符串
  * @param len 目标字符串长度
  * @param alexin 补位字符
  * @return 目标字符串
  */
  padLeft: function(oriStr, len, alexin){
    var strlen = oriStr.length;
    var str=""
    if(strlen <len) {
      for (var i = 0; i < len - strlen; i++){
       str = str + alexin;
      }
    }
    str = oriStr + str;
    return str;
  },
  problemTypeOnChange:function(){
    
  }
})