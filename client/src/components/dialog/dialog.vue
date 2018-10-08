<template id="tpl_dialog">
  <div class="dialog-wrap">
    <div class="main-dialog">
      <div class="dialog-title">{{ dialogTitle }}</div>
      <div class="dialog-content">{{ dialogContent }}</div>
      <div class="dialog-buttons"><a href="javascript:;" class="cancel" @click="cancelDialog()">取消</a><a href="javascript:;" class="ok" @click="confirmDialog()">确认</a></div>
    </div>
  </div>
</template>

<script>
import dialog from './dialog'
export default dialog
</script>

<style lang="scss" scoped src="./dialog.scss" />
