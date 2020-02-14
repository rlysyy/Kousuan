// pages/index/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    a:0,
    b:0,
    symbol:"+",
    result:""
  },

  /**
   * 生成加法
   */
  make_jiafa:function(){
    var min = 2; 
    var max = 100;
    var a = Math.floor(Math.random() * (max - min)) + min;
    max = 100 - a;
    var b = Math.floor(Math.random() * (max - min)) + min;
    this.setData({
      a:a,
      b:b,
      result:a+b
    })
  },

  delLastLetter:function(e){
    var s = this.data.result;
    s = s.substring(0, s.length - 1)
    this.setData({
      result: s
    })
  },

  inputResult:function(e){
    var temp = this.data.result + e.currentTarget.dataset.num;
    this.setData({
      result:temp
    })
  },
  /**
   * 点击下一题
   */
  clickNext:function(){
    this.make_jiafa();
  },

  /**
   * 生命周期函数--监听页面加
   */
  onLoad: function (options) {

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

  }
})