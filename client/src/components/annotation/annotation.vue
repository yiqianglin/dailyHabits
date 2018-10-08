
<template id="tpl_annotation">
  <div :class="{show:show}" class="annotation-box">
    <div class="mask" @click="hideAnnotation" />
    <div id="tplAnnotation" class="annotation">
      <div v-show="direction.v === 'down'" :style="arrowStyle" class="arrow-up" />
      <div :class="direction.h" :style="wrapperStyle" class="wrapper">
        <template v-if="isRef">
          <div class="annotation-title">
          <span class="ref-index">[{{ refIndex }}]</span>参考文献</div>
          <div class="annotation-desc">{{ refDetail }}</div>
        </template>
        <template v-else>
          <!-- <div class="annotation-title">{{name+(alias?('('+alias+')'):'')}}<i class="del" @click="hideAnnotation"></i></div> -->
          <div class="annotation-title">{{ name+(alias?('('+alias+')'):'') }}</div>
          <div class="annotation-desc" v-html="contentHtml" />
          <div v-show="viewMore" class="view-entry" @click="viewAnnotation()">{{ viewMore&&viewMore.title }}</div>
        </template>
      </div>
      <div v-show="direction.v === 'up'" :class="{lighter: viewMore}" :style="arrowStyle" class="arrow-down" />
    </div>
  </div>
</template>

<script>
import annotation from './annotation'
export default annotation
</script>

<style lang="scss" src="./annotation.scss" />
