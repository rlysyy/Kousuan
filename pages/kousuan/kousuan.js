
// pages/kousuan/kousuan.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    upperLimit:20,
    problemNum:20,
    timeInterval:1,
    message:"",
    audioList:[],
    tingsuanButtonisDisabled: false,
    repeatButtonisDisabled:true,
    anwserButtonisDisabled: true,
    firstShow: true
  },

  /**
   * 生命周期函数--监听页面加载
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
    console.log('onShow')
    this.enableButton();
    try {
      var value = wx.getStorageSync('upperLimit')
      if (value) {
        this.setData({
          upperLimit: value
        })
      } else {
        wx.setStorageSync('upperLimit', this.data.upperLimit);
      }
      var value = wx.getStorageSync('problemNum')
      if (value) {
        this.setData({
          problemNum: value
        })
      } else {
        wx.setStorageSync('problemNum', this.data.problemNum);
      }
      var value = wx.getStorageSync('timeInterval')
      if (value) {
        this.setData({
          timeInterval: value
        })
      } else {
        wx.setStorageSync('timeInterval', this.data.timeInterval);
      }
    } catch (e) {
      console.log(e)
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide');
    this.enableButton();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('onUnload');
    this.enableButton();
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
   * 开始听算前初始化缓存
   */
  mySetStorge:function(){
    try {
      wx.clearStorageSync();
      wx.setStorageSync('upperLimit', this.data.upperLimit);
      wx.setStorageSync('problemNum', this.data.problemNum);
      wx.setStorageSync('timeInterval', this.data.timeInterval);
    } catch (e) {
      // Do something when catch error
    }
  },
  /**
   * 开始听算
   */
  tts:function(e){
    try {
      var grant_type = "client_credentials";
      var client_id = "GpGj38fPbQNL1XzB4TOVZwac";
      var client_secret = "6WEE6tvnPC9hzpE2GVCEiCMOV34vqzVx";
      var url ="https://openapi.baidu.com/oauth/2.0/token";
      var token =""
      var that = this
      //无效化按钮
      this.disableButton();
      //初始化缓存
      this.mySetStorge();
      this.setData({
        firstShow:false
      })
      wx.request({
        url: url,
        data:{
          grant_type: grant_type,
          client_id: client_id,
          client_secret, client_secret
        },
        method: "GET",
        header: {
          'content-type': 'application/json' // 默认值
        },
        success(res) {
          token = res.data.access_token;
          that.make_problems(token,0);
        }
      })
    }catch(err){
      this.enableButton();
      console.log(err)
    }
  },

  /**
   * 开始听算
   */
  make_problems: function (token,i){
    var problemType = this.randomInt(1,4);
    var max = this.data.upperLimit + 1;
    var problem = "";

    if (problemType == 1) {
      problem = this.createAddition(max);
    } else if (problemType == 2) {
      problem = this.createSubtraction(max);
    } else if (problemType == 3) {
      problem = this.createMultiplication();
    }

    this.compose(token, problem,i);
  },

  /**
   * 混合合成
   */
  compose: function (token,text,i){
    try{
      var that = this
      var lan="zh";
      var ctp=1;
      var cuid = "abcdxxx"
      //语速，取值0 - 9，默认为5中语速
      var spd = 2;
      // 音调，取值0 - 9，默认为5中语调
      var pit = 5;
      // 音量，取值0-15，默认为5中音量
      var vol = 9;
      // 	度小宇=1，度小美=0，度逍遥=3，度丫丫=4
      var per = 0;
      // 	3为mp3格式(默认)； 4为pcm-16k；5为pcm-8k；6为wav（内容同pcm-16k）; 
      var aue = 3;
      var tex = encodeURIComponent(encodeURIComponent(text))
      var url = "https://tsn.baidu.com/text2audio?lan=" + lan + "&ctp=" + ctp + "&cuid=" + cuid + "&tok=" + token + "&tex=" + tex + "&vol=" + vol + "&per=" + per + "&spd=" + spd + " &pit=" + pit + "&aue=" + aue
      wx.downloadFile({
        url:url,
        success:function(res){
          var filePath = res.tempFilePath;
          if(res.statusCode === 200){
            that.read_question(filePath, token,i,0);
          }
        }
      })
    }
    catch(err){
      console(err)
      this.enableButton();
    }
  },
  
  /**
   * 读题目
   * type: 0：听算 1：重听
   */
  read_question: function (filePath, token, i,type){
    try{
      var that = this
      var problemNum = this.data.problemNum + 1
      const innerAudioContext = wx.createInnerAudioContext();
      innerAudioContext.autoplay = true;
      innerAudioContext.src = filePath;
      wx.setStorageSync('problem' + i, filePath);
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      })
      innerAudioContext.onError((res) => {
        console.log(res.errMsg)
        innerAudioContext.destroy()
        that.enableButton();
      })
      innerAudioContext.onEnded(() => {
        console.log('播放结束')
        innerAudioContext.destroy()
        i = parseInt(i) + 1
        var timerName = setTimeout(function () {
          if (i < problemNum) {
            if (type == 0) {
              that.make_problems(token, i)
            } else if (type == 1) {
              console.log("repeatAudio:" + 1)
              that.repeatAudio(i)
            }
          } else {
            that.enableButton();
          }
        }, that.data.timeInterval*1000)
      })
    }catch(err){
      console.log(err)
      that.enableButton();
    }
  },
  /**
   * 重听按钮点击事件
   */
  clickRepeat:function(e){
    this.enableButton();
    var i = e.currentTarget.dataset.i;
    this.repeatAudio(i);
  },

  /**
   * 重听
   */
  repeatAudio:function(i){
    try{
      var filePath = wx.getStorageSync('problem' + i)
      this.read_question(filePath,"",i,1)
    }catch(err){
      console.log(err)
    }
  },

  /**
   * 生成随机整数
   * min最小值，max最大值
   */
  randomInt:function(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  },

  /**
   * 检查是否是数字
   */
  isRealNum:function(val){
    // isNaN()函数 把空串 空格 以及NUll 按照0来处理 所以先去除
    if(val === "" || val == null){
      return false;
    }
    if (!isNaN(val)) {
      return true;
    } else {
      return false;
    }
  },

  /**
   * 生成加法
   */
  createAddition:function(max) {
    var a = this.randomInt(2,max-1);
    var b = this.randomInt(1, max - a);
    var problem = String(a) + "+" + String(b);

    return problem;
  },
  /**
   * 减法
   */
  createSubtraction:function(max) {
    var a = this.randomInt(2, max - Math.floor(max/4));
    var b = this.randomInt(a, max);
    var problem = String(b) + "减" + String(a);

    return problem;
  },
  /**
   * 乘法
   */
  createMultiplication:function(){
    var a = this.randomInt(2, 10);
    var b = this.randomInt(2, 10);
    var problem = String(b) + "乘" + String(a);

    return problem;
  },

  /**
   * 计算上限
   */
  upperLimitOnChange(e) {
    this.setData({
      upperLimit: e.detail
    })
    wx.setStorageSync('upperLimit', e.detail);
  },
  /**
   * 出题数
   */
  problemsOnChange(e) {
    this.setData({
      problemNum: e.detail
    })
    wx.setStorageSync('problemNum', e.detail);
  },
  /**
   * 时间间隔
   */
  timeIntervalOnChange(e){
    this.setData({
      timeInterval: e.detail
    })
    wx.setStorageSync('timeInterval', e.detail);
  },
  /**
   * 激活按钮
   */
  enableButton(e){
    if (this.data.firstShow){
      this.setData({
        tingsuanButtonisDisabled: false,
        repeatButtonisDisabled: true,
        anwserButtonisDisabled: true
      })
    }else{
      this.setData({
        tingsuanButtonisDisabled: false,
        repeatButtonisDisabled: false,
        anwserButtonisDisabled: false
      })
    }
  },
  /**
   * 无效按钮
   */
  disableButton(e){
    this.setData({
      tingsuanButtonisDisabled: true,
      repeatButtonisDisabled: true,
      anwserButtonisDisabled:true
    })
  },
  gotoAnswer:function(){
    wx.navigateTo({
      url: '/pages/answer/answer'
    })
  }
})