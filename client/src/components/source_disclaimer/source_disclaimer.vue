<template>
  <div>
    <div class="mp-collection">
      <p class="qrcode">
        <img :src="`${isCancer ? require('src/assets/images/mobile/common/qrcode_cancer.jpg') : require('src/assets/images/mobile/common/qrcode.png')}`" alt="qrcode">
        <span class="qrcode-hint">长按识别二维码</span>
      </p>
      <p class="remark">{{ isCancer ? '关注企鹅医典肿瘤篇公众号，了解更多肿瘤科普' : '关注企鹅医典公众号，可了解更多医疗资讯' }}</p>
    </div>
    <div v-if="sourceid === 3" class="disclaimer disclaimer-webmd">
      <img :src="require('src/assets/images/mobile/authority_wm/webmd_logo.png')">
      <p>此信息不能代替医生的建议，对您使用该信息的行为WebMD LLC.</p>
      <p>声明不作任何担保和不承担任何责任受版权保护的材料，且获得</p>
      <p>WebMD LLC.的任何授权© 2005-2018 WebMD LLC.</p>
      <p class="t1">本站内容仅供医学知识科普使用</p>
      <p>不能替代执业医师当面诊断，请谨慎参阅</p>
    </div>
    <div v-else-if="sourceid === 1" class="disclaimer disclaimer-authority">
      <div class="b1">
        <img :src="require('src/assets/images/mobile/ddetail/healthwise.png')">
        <p>此信息不能代替医生的建议，对您使用该信息的行为</p>
        <p>Healthwise, Incorporated声明不作任何担保和不承担任何责任</p>
      </div>
      <p>受版权保护的材料，且获得Healthwise, Incorporated的授权</p>
      <p>© 1995-2018Healthwise, Incorporated</p>
      <div class="line" />
      <p>本站内容仅供医学知识科普使用不能替代执业医师当面诊断</p>
      <p>请谨慎参阅</p>
    </div>
    <div v-else class="disclaimer disclaimer-common">
      <p class="t2">本站内容仅供医学知识科普使用</p>
      <p class="t3">不能替代执业医师当面诊断，请谨慎参阅</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sourceid: {
      type: Number,
      default: 0
    },
    isCancer: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~src/assets/style/common-util";
.disclaimer-common {
  color: #ccd2d6;
  text-align: center;
  padding: 0.7rem 0 1.2rem 0;
  font-size: 0.22rem;
  .t1 {
    font-size: 0.26rem;
  }
  .t2 {
    margin-top: 0.52rem;
  }
  .t3 {
    margin-top: 0.1rem;
  }
}

.disclaimer-webmd {
  color: #c3c3c5;
  font-size: 0.22rem;
  padding: 0.78rem 0.12rem 0.63rem 0.12rem;
  text-align: center;
  img {
    width: 1.04rem;
    height: 0.24rem;
    margin-bottom: 0.25rem;
  }
  .t1 {
    margin-top: 0.3rem;
  }
}

.disclaimer-authority {
  color: #b8bfc4;
  font-size: 0.22rem;
  padding: 0.78rem 0.32rem 1.2rem 0.32rem;
  text-align: left;
  .b1 {
    padding-left: 0.7rem;
    position: relative;
    margin-bottom: 0.14rem;
    &.noimg {
      padding-left: 0;
    }
    img {
      width: 0.52rem;
      height: 0.52rem;
      margin: auto;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
    }
  }
  .line {
    width: 6.86rem;
    height: 0.02rem;
    margin: 0.36rem auto;
  }
}

.mp-collection {
  width: 100%;
  padding: 0.55rem 0 0.36rem;
  margin: 0 auto;
  font-size: 0.26rem;
  text-align: center;
  color: #ccd2d6;
  position: relative;
  &:after {
    @include setBottomLine(#d8d8d8, 0.62rem, 0.62rem);
  }
  .qrcode {
    text-align: center;
    img,
    span {
      background: #fff;
      display: block;
      width: 2.24rem;
      margin: 0 auto;
    }
  }
  .qrcode-hint {
    font-size: 0.28rem;
    color: #0d1119;
    padding: 0.08rem 0;
    opacity: 0.8;
  }
  .remark {
    margin-top: 0.3rem;
    color: #b8bfc4;
  }
}
</style>

<style lang="scss">
.miniprogram {
  .mp-collection {
    display: none;
  }
}
</style>
