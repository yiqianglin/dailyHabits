<template id="tpl_drugs_production_trade_panel">
  <div class="drugs-production-trade-panel-wrp">
    <!-- transition 这里可以加一些简单的动画效果 -->
    <transition name="fadeIn">
      <div
        v-if="isShow"
        class="drugs-production-trade-panel">
        <div class="title">
          <span
            v-if="showBackBtn"
            class="back-btn"
            @click="backBtnClick"/>
          商品名称
          <span
            class="reset-btn"
            @click="resetBtnClick">
            重置
          </span>
        </div>
        <div class="search-wrp">
          <div class="search-bar" @click="searchFormClick">
            <span>搜药品</span>
          </div>
        </div>
        <div class="panel-content">
          <div class="content">
            <div class="selection-title">
              <span class="left">药品名</span>
              <span class="right">商品名</span>
            </div>
            <div class="selection">
              <ul class="selection-production-ul">
                <div class="selection-production-ul-inner">
                  <li :class="{'selected': commonNameData.selected === ''}" class="selection-production-li" @click="onProductionNameSelect({name: ''})">全部</li>
                  <li v-for="(item, index) in commonNameShowList" :key="index" :class="{'selected': item.name === commonNameData.selected}" class="selection-production-li" @click="onProductionNameSelect(item)">
                    {{ item.name }}
                  </li>
                </div>
              </ul>
              <ul class="selection-trade-ul">
                <div class="selection-production-ul-inner">
                  <transition-group name="fade" mode="out-in">
                    <li :class="{'selected': tradeNameData.selected === ''}" :key="0" class="selection-trade-li" @click="onTradeNameSelect({name: ''})">全选</li>
                    <li v-for="(item, index) in tradeNameShowList" :key="index+1" :class="{'selected': item.name === tradeNameData.selected}" class="selection-trade-li" @click="onTradeNameSelect(item)">
                      {{ item.name === '无' ? '其他（无商品名）' : item.name }}
                    </li>
                  </transition-group>
                </div>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import drugsProductionTradePanel from './drugsProductionTradePanel'
export default drugsProductionTradePanel
</script>

<style lang="scss" scoped src="./drugsProductionTradePanel.scss" />
