<template id="tpl_fixedcollectiontips">
  <transition name="bottom-fixed-tips" mode="out-in">

    <div v-if="isShow"
         v-cloak id="bottom-fixed-tips" class="bottom-fixed-tips"
         @click.stop.prevent="closeTips()">
      <div class="inner-wrp">
        <div v-if="showType == 1" class="tips">
          <span class="art">
            添加到书签，快速访问医疗健康资讯
          </span>
          <span class="close-btn"/>
        </div>
        <div v-if="showType == 2" class="tips">
          <span class="art">
            觉得我们内容不错，可以
          </span>
          <span class="collect"/>
          <span class="art">
            收藏到书签
          </span>
          <span class="close-btn"/>
        </div>
      </div>
    </div>

  </transition>
</template>

<script>
import fixedcollectiontips from './fixedcollectiontips'
export default fixedcollectiontips
</script>

<style lang="scss" scoped src="./fixedcollectiontips.scss" />
