<template id="tpl_select_panel">
  <div v-if="isShow" class="select-panel-wrp">
    <div class="mask" @click="closePanel"/>
    <div :style="{top: `${positonSite[0]}rem`, right: `${positonSite[1]}rem`, bottom: `${positonSite[2]}rem`, left: `${positonSite[3]}rem`}" class="select-panel">
      <span class="close-btn" @click="closePanel"/>
      <p class="panel-title">招募通道</p>
      <div class="selection-wrp">
        <a class="selection submit-info" href="javascript:;" @click="selectionClick(1)">
          <span class="icon submit-info-icon-01"/>
          <p class="selection-remark">提交个人信息</p>
        </a>
        <a class="selection submit-info" href="javascript:;" @click="selectionClick(2)">
          <span class="icon submit-info-icon-02"/>
          <p class="selection-remark">加入微信群</p>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
/* global baike */
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
    },
    selectionClick (type) {
      if (type === 1) {
        baike.mtaReport('trialtool_personal')
      } else if (type === 2) {
        baike.mtaReport('trialtool_scan')
      }
      this.$emit('selectionClick', type)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~src/assets/style/common-util";
.select-panel-wrp{
    * {
        box-sizing: border-box;
    }
    z-index: 6;
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
    .select-panel{
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
        .panel-title{
            text-align: center;
            font-size: .4rem;
            color: #000000;
            font-weight: 700;
        }
        .selection-wrp{
            margin: 1.05rem auto 0;
            text-align: center;
            .selection{
                width: 2rem;
                height: 2.1rem;
                display: inline-block;
                margin-right: .58rem;
                &:last-of-type{
                    margin-right: 0;
                }
                .icon {
                    width: 100%;
                    height: 1.5rem;
                    display: block;
                    &.submit-info-icon-01{
                        background: url(~src/assets/images/mobile/clinical_recruitment/icon-01.png) no-repeat center;
                        background-size: 1.5rem;
                    }
                    &.submit-info-icon-02{
                        background: url(~src/assets/images/mobile/clinical_recruitment/icon-02.png) no-repeat center;
                        background-size: 1.5rem;
                    }
                }
                .selection-remark{
                    font-size: .26rem;
                    color: #757575;
                    text-align: center;
                    margin-top: .12rem;
                }
            }
        }
    }

}
</style>
