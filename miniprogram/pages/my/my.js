// miniprogram/pages/my/my.js

import { Address } from '../../utils/address.js';
import { Order } from '../order/order-model.js';
import { My } from '../my/my-model.js';

var address = new Address();
var order = new Order();
var my = new My();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageIndex: 1,
    isLoadedAll: false,
    loadingHidden: false,
    orderArr: [],
    addressInfo: null
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData();
    this._getAddressInfo();
  },

  _loadData: function() {
    my.getUserInfo((data) => {
      this.setData({
        userInfo: data
      });
    });

    this._getOrders();
    order.execSetStorageSync(false);  //更新标志位    
  },

  
  /**地址信息**/
  _getAddressInfo: function () {
    var that = this;
    address.getAddress((addressInfo) => {
      that._bindAddressInfo(addressInfo);
    });
  },

  /*绑定地址信息*/
  _bindAddressInfo: function (addressInfo) {
    this.setData({
      addressInfo: addressInfo
    });
  },

  /*订单信息*/
  _getOrders: function () {
    var that = this;
    order.getOrders(this.data.pageIndex, (res) => {
      var data = res.current_page;

      if(data.length>0) {
        that.data.orderArr.push.apply(this.data.orderArr, data);
        that.setData({
          orderArr: this.data.orderArr
        })
      } else {
        that.data.isLoadedAll = true;
        that,data,pageIndex = 1;
      }
      
    })
  
    
  },


  /*显示订单的具体信息*/
  showOrderDetailInfo: function (event) {
    var id = order.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../order/order?from=order&id=' + id
    });
  },

  /*未支付订单再次支付*/
  rePay: function (event) {
    var id = order.getDataSet(event, 'id'),
      index = order.getDataSet(event, 'index');

    //online 上线实例，屏蔽支付功能
    if (order.onPay) {
      this._execPay(id, index);
    } else {
      this.showTips('支付提示', '本产品仅用于演示，支付系统已屏蔽');
    }
  },

  /*支付*/
  _execPay: function (id, index) {
    var that = this;
    order.execPay(id, (statusCode) => {
      if (statusCode > 0) {
        var flag = statusCode == 2;

        //更新订单显示状态
        if (flag) {
          that.data.orderArr[index].status = 2;
          that.setData({
            orderArr: that.data.orderArr
          });
        }

        //跳转到 成功页面
        wx.navigateTo({
          url: '../pay-result/pay-result?id=' + id + '&flag=' + flag + '&from=my'
        });
      } else {
        that.showTips('支付失败', '商品已下架或库存不足');
      }
    });
  },

  /*
     * 提示窗口
     * params:
     * title - {string}标题
     * content - {string}内容
     * flag - {bool}是否跳转到 "我的页面"
     */
  showTips: function (title, content) {
    wx.showModal({
      title: title,
      content: content,
      showCancel: false,
      success: function (res) {

      }
    });
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
    //更新订单,相当自动下拉刷新,只有  非第一次打开 “我的”页面，且有新的订单时 才调用。
    var newOrderFlag = order.hasNewOrder();
    if (this.data.loadingHidden && newOrderFlag) {
      this.onPullDownRefresh();
    }
  },

  /*修改或者添加地址信息*/
  editAddress: function () {
    var that = this;
    wx.chooseAddress({
      success: function (res) {
        var addressInfo = {
          name: res.userName,
          mobile: res.telNumber,
          totalDetail: address.setAddressInfo(res)
        };
        if (res.telNumber) {
          that._bindAddressInfo(addressInfo);
          //保存地址
          address.submitAddress(res, (flag) => {
            if (!flag) {
              that.showTips('操作提示', '地址信息更新失败！');
            }
          });
        }
        //模拟器上使用
        else {
          that.showTips('操作提示', '地址信息更新失败,手机号码信息为空！');
        }
      }
    })
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
    var that = this;
    this.data.orderArr = [];  //订单初始化
    this._getOrders(() => {
      that.data.isLoadedAll = false;  //是否加载完全
      that.data.pageIndex = 1;
      wx.stopPullDownRefresh();
      order.execSetStorageSync(false);  //更新标志位
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.isLoadedAll) {
      this.data.pageIndex++;
      this._getOrders();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})