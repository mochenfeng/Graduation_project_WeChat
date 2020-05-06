import { Base } from '../../utils/base.js'

class Home extends Base {
  constructor() {
    super();
  }

  // Banner
  getBannerData(id,callback) {
    var params = {
      url: 'banner/' + id,
      sCallback: function(data) {
        callback && callback(data.items);
      }
    }
    this.request(params);
  }

  // 首页主题
  getThemeData(callback) {
    var params = {
      url: 'theme?ids=1,2,3',
      sCallback: function (data) {
        // console.log(data);
        callback && callback(data);
      }
    }
    this.request(params);
  }

  /*首页部分商品*/
  getProductsData(callback) {
    var param = {
      url: 'product/recent',
      sCallback: function (data) {
        // console.log(data);
        callback && callback(data);
      }
    };
    this.request(param);
  }

}

export { Home };