<template id="tpl_fixed_entrance_btn">
  <div v-if="isShow" class="communication-wrp">
    <div class="mask" @click="closePanel"/>
    <div :style="{top: `${positonSite[0]}rem`, right: `${positonSite[1]}rem`, bottom: `${positonSite[2]}rem`, left: `${positonSite[3]}rem`}" class="communication-panel"
    >
      <span class="close-btn" @click="closePanel"/>
      <p class="communication-title">加入微信群</p>
      <div class="qrcode-wrp">
        <a href="javascript:;" class="left-icon"/>
        <img :src="require('src/assets/images/mobile/clinical_recruitment/qrcode.jpg')" class="qrcode" alt="">
        <a href="javascript:;" class="right-icon"/>
      </div>
      <p class="remark">保存并在微信中识别二维码</p>
      <p class="remark">加管理员邀请入群</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false,
      required: true
    },
    positonSite: {
      // 定位
      type: Array,
      default () {
        return [0, 0, 0, 0]
      }
    }
  },
  methods: {
    closePanel () {
      this.$emit('closePanel')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~src/assets/style/common-util";
.communication-wrp{
    * {
        box-sizing: border-box;
    }
    .mask{
        background: rgba(0, 0, 0, 0.8);
        position: fixed;
        z-index: 4;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
    }
    .communication-panel{
        background: #fff;
        height: 5.5rem;
        width: 6.62rem;
        border-radius: .08rem;
        position: fixed;
        overflow: hidden;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        // top: 45%;
        // left: 50%;
        // transform: translate(-50%, -50%);
        z-index: 5;
        padding: .45rem .36rem .5rem;
        .close-btn{
            display: block;
            width: .52rem;
            height: .52rem;
            position: absolute;
            top: .3rem;
            right: .3rem;
            background: url(~src/assets/images/mobile/player/close.png) no-repeat center;
            background-size: contain;
        }
        .communication-title{
            text-align: center;
            font-size: .4rem;
            color: #000000;
            font-weight: 700;
        }
        .qrcode-wrp{
            width: 100%;
            height: 2.42rem;
            margin: .5rem 0 .36rem;
            .qrcode{
                height: 2.42rem;
                margin: 0 auto;
                display: block;
            }
        }
        .remark{
            font-size: .26rem;
            text-align: center;
            color: #3F3F42;
            line-height: 1.7;
        }
    }

}
</style>
