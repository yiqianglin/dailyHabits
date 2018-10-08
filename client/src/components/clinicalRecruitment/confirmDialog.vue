<template id="tpl_confirm_dialog">
  <div class="dialog-wrp">
    <div v-if="isShow" class="mask" @click="closeConfirm"/>
    <!-- transition 这里可以加一些简单的动画效果 -->
    <transition name="drop">
      <div v-if="isShow" :style="{width: `${widthNum}rem`, height: heightNum ? `${heightNum}rem` : 'auto', top: `${positonSite[0]}rem`, right: `${positonSite[1]}rem`, bottom: `${positonSite[2]}rem`, left: `${positonSite[3]}rem`}" class="dialog-panel">
        <div class="dialog-content">
          <div class="dialog_head">
            <!--弹窗头部 title-->
            <slot name="header">
              <div class="header">
                提示信息
              </div>
            </slot>
          </div>
          <div class="dialog_main ">
            <!--弹窗的内容-->
            <slot name="main">
              <div class="main">
                弹窗内容
              </div>
            </slot>
          </div>
          <div class="dialog_confirm_btn_wrp">
            <slot name="btn-gourp">
              <div class="btn-wrp">
                <a href="javascript:;" class="cancel-btn" @click="cancelBtnClick">返回</a>
                <a href="javascript:;" class="sure-btn" @click="sureBtnClick">同意</a>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import confirmDialog from './confirmDialog'
export default confirmDialog
</script>

<style lang="scss" scoped src="./confirmDialog.scss" />
