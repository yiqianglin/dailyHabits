<template id="tpl_popdialog">
  <div v-show="isShowPop" class="dialog-wrap">
    <div class="main-dialog">
      <div class="dialog-title">{{ dialogTitle||'' }}</div>
      <div class="dialog-content">{{ dialogContent||'' }}</div>
      <div class="dialog-buttons"><a href="javascript:;" class="cancel" @click="cancelDialog()">{{ cancelBtnText||'取消' }}</a><a href="javascript:;" class="ok" @click="confirmDialog()">{{ confirmBtnText||'确认' }}</a></div>
    </div>
  </div>
</template>

<script>
import popdialog from './popdialog'
export default popdialog
</script>

<style lang="scss" scoped src="./popdialog.scss" />
