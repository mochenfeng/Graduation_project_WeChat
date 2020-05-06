// miniprogram/pages/category/category.js
import { Category } from 'category-model.js';
var category = new Category();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentMenuIndex: 0,
    loadedData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadData();
  },

  _loadData: function() {
    category.getCategoryType((categoryData) => {
        
        this.setData({
          categoryTypeArr: categoryData
        });

      // 一定在回调函数里再进行获取分类详情的方法调用
      category.getProductsByCategory(categoryData[0].id, (data) => {

        var dataObj = {
          products: data,
          topImgUrl: categoryData[0].img.url,
          title: categoryData[0].name
        }

        this.setData({
          'categoryProducts': dataObj
        });
      });
    });
  
  },

  onProductsItemTap: function (event) {
    // console.log(event);
    var id = category.getDataSet(event, 'id');
    wx.navigateTo({
      url: '../product/product?id=' + id,
    })
  },

/*切换分类*/
  changeCategory: function(event) {
    var index = category.getDataSet(event, 'index');
    
    //获取data-set
    var id = category.getDataSet(event, 'id');
    
    this.setData({
      currentMenuIndex: index
    });

    if(!this.isLoadedData(index)) {
      // 如果没有加载过当前分类的商品数据
      category.getProductsByCategory(id, (data) => {
        var dataObj = {
          products: data,
          topImgUrl: this.data.categoryTypeArr[index].img.url,
          title: this.data.categoryTypeArr[index].name
        };

        this.setData({
          categoryProducts: dataObj
        });

        this.data.loadedData[index] = dataObj;
      });
    } else {
      // 已经加载过，直接读取
      this.setData({
        categoryProducts: this.data.loadedData[index]
      });
    }
  },

  // 判断当前分类下的商品数据是否已经被加载过了
  isLoadedData: function(index) {
    if (this.data.loadedData[index]) {
      return true;
    }
    return false;
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