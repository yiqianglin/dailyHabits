<template id="tpl_filter_sort_panel">

  <!-- transition 这里可以加一些简单的动画效果 -->
  <transition name="fadeIn">
    <!--筛选面板 A-Z排序-->
    <filter-panel
      :is-show="isShow"
      :title="title"
      :show-back-btn="showBackBtn"
      :show-closek-btn="showClosekBtn"
      :show-reset-btn="showResetBtn"
      :ref="domId"
      @onBack="backBtnClick"
      @onClose="closeBtnClick"
      @onReset="resetBtnClick">
      <template slot="content">
        <div
          ref="filter-sort-content"
          class="filter-sort-content">
          <div :id="domId" class="sort-content">
            <template v-if="data.data.length>0" >
              <template v-for="(item, index) in data.data" >
                <p :id="`alphaLoc-${characterCapsLook(item.name, 1)}`" :key="`p_${index}`"
                   :ref="`alphaLoc-${characterCapsLook(item.name, 1)}`"
                   class="sort-title">{{ characterCapsLook(item.name, 1) }}</p>
                <ul :key="`ul_${index}`" class="sort-ul">
                  <li v-for="(itemi, indexi) in item[dataKey]" :key="`li_${indexi}`" @click="filterSelect(itemi)">{{ itemi.name }}</li>
                </ul>
              </template>
            </template>
            <template v-else>
              <p class="sort-title">#</p>
              <ul class="sort-ul">
                <li @click="filterSelect(null)">无</li>
              </ul>
            </template>
            <!-- <p :id="`alphaLoc-A`" :ref="`alphaLoc-A`" class="sort-title">A</p>
            <ul class="sort-ul">
              <li>a药品</li>
              <li>a药品</li>
              <li>a药品</li>
            </ul> -->

          </div>
          <ul class="alpha-fixed" @touchmove.stop.prevent="alphaFixedTouchmove">
            <li><a href="javascript:;" >#</a></li>
            <li v-for="(item, index) in alphaData" :class="{ 'on': alphaDataActive === item }" :key="index"><a href="javascript:;" @click="alphaFixedBtnClick(item)">{{ item }}</a></li>
          </ul>
        </div>
      </template>
      <template slot="btn-group">
        <div/>
      </template>
    </filter-panel>
  </transition>

</template>

<script>
import filterSortPanel from './filterSortPanel'
export default filterSortPanel
</script>

<style lang="scss" scoped src="./filterSortPanel.scss" />
