<template id="tpl_filter_disease_panel">

  <transition name="fadeIn">
    <filter-panel
      :is-show="isShow"
      :title="'疾病名'"
      :show-back-btn="true"
      :show-closek-btn="false"
      @onBack="diseasePanelOnBack"
      @onClose="diseasePanelOnClose">
      <template slot="content">
        <div
          ref="filter-disease-content"
          class="filter-disease-content">
          <a
            v-for="(item, index) in data.data"
            :key="index"
            :class="{'selected': item.name === data.selected, 'unselectable': !item.selectable}"
            href="javascript:;"
            class="disease-selection btn-link"
            @click="diseaseSelectionClick(item)"
          >
            <div class="wrp">
              <span class="disease-name">
                {{ item.name }}
              </span>
              <span v-if="!item.selectable" class="status">建设中</span>
            </div>

            <img
              :src="item.img"
              class="disease-img"
              @click.stop="diseaseSelectionClick(item)">
          </a>
          <a
            href="javascript:;"
            class="disease-selection btn-link update">
            <div class="wrp">
              <span class="disease-name">
                更新中
              </span>
            </div>
            <img
              :src="require('src/assets/images/mobile/expenseCalculator/update.png')"
              class="disease-img">
          </a>
        </div>
      </template>
      <template slot="btn-group">
        <div/>
      </template>
    </filter-panel>
  </transition>

</template>

<script>
import filterDiseasePanel from './filterDiseasePanel'
export default filterDiseasePanel
</script>

<style lang="scss" scoped src="./filterDiseasePanel.scss" />
