/**
 * Created by cc on 2017/8/24.
 */
class Product {
  constructor(
    {
      productId = '***',
      productName = '商品名字',
      productDesc = '商品介绍',
      needScore = 0,
      stock = 0,
      createTime = +new Date(),
      updateTime = +new Date(),
      productPic = 'http://ov2y8mbyy.bkt.clouddn.com/icon-xunlei.png'
    }
  ) {
    this.productId = productId;
    this.productName = productName;
    this.productDesc = productDesc;
    this.needScore = needScore;
    this.stock = stock;
    this.createTime = createTime;
    this.updateTime = updateTime;
    this.productPic = productPic;
  }
}

export default Product;
