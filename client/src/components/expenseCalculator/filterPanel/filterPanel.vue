<template id="tpl_select_panel">
  <div class="select-panel-wrp">
    <!-- transition 这里可以加一些简单的动画效果 -->
    <transition name="fadeIn">
      <div
        v-if="isShow"
        class="select-panel">
        <div v-if="type === 0" class="title title-type-0">
          <span
            v-if="showBackBtn"
            class="back-btn"
            @click="backBtnClick"/>
          {{ title }}
          <span
            v-if="showClosekBtn"
            class="close-btn"
            @click="closeBtnClick"/>
          <span
            v-if="showResetBtn"
            class="reset-btn"
            @click="resetBtnClick">
            重置
          </span>
        </div>
        <div v-else-if="type === 1" class="title title-type-1">
          <span
            v-if="showBackBtn"
            class="back-btn"
            @click="backBtnClick"/>
          <span
            v-if="showResetBtn && type === 1"
            class="reset-btn"
            @click="backBtnClick"/>
          <span class="title-inner">
            <span class="p-title">{{ title }}</span>
            <span class="p-remark">{{ remark }}</span>
          </span>
          <span
            v-if="showClosekBtn"
            class="close-btn"
            @click="closeBtnClick"/>
          <span
            v-if="showResetBtn"
            class="reset-btn"
            @click="resetBtnClick">
            重置
          </span>
        </div>
        <div class="panel-content">
          <slot name="content">
            <div class="content">
              选择内容面板
            </div>
          </slot>
        </div>

        <slot v-if="type === 0" name="btn-group">
          <div class="btn-wrp">
            <a
              href="javascript:;"
              class="sure-btn btn-link"
              @click="sureBtnClick">查询</a>
          </div>
        </slot>

      </div>
    </transition>
  </div>
</template>

<script>
import filterPanel from './filterPanel'
export default filterPanel
</script>

<style lang="scss" scoped src="./filterPanel.scss" />
