<template id="tpl_drugs_price">
  <div class="drugs-price-wrp">
    <div class="drugs-price-inner">
      <!--顶部选择项-->
      <div class="drugs-price-filter">
        <ul class="filter-ul">
          <li class="filter-li" @click="filterOptionsClick(1)">
            <span class="label">疾病名</span>
            <span class="value">{{ diseasePanelData.selected || '请选择' }}</span>
            <span class="right-arrow"/>
            <a
              href="javascript:;"
              class="btn-link"/>
          </li>
          <li class="filter-li" @click="filterOptionsClick(2)">
            <span class="label">城市</span>
            <span class="value">{{ locationPanelData.selected || '请选择' }}</span>
            <span class="right-arrow"/>
            <a
              href="javascript:;"
              class="btn-link"/>
          </li>
          <li class="filter-li" @click="filterOptionsClick(6)">
            <span class="label">药品名</span>
            <span class="value">{{ tradeShowName || '请选择' }}</span>
            <span class="right-arrow"/>
            <a
              href="javascript:;"
              class="btn-link"/>
          </li>
          <li class="filter-li" @click="filterOptionsClick(5)">
            <span class="label">厂商</span>
            <span class="value">{{ enterprisePanelData.selected || '请选择' }}</span>
            <span class="right-arrow"/>
            <a
              href="javascript:;"
              class="btn-link"/>
          </li>
        </ul>
        <div class="change-filter-wrp">
          <a
            href="javascript:;"
            class="change-filter btn-link"
            @click="getDrugCostBtnClick"
          >查询</a>
        </div>
      </div>

      <div :class="{fade:drugsDataUpdated}" class="drugs-price-panel-wrp">
        <div v-for="(itemi, indexi) in drugsDataSorted" :key="indexi" class="drugs-price-panel">
          <div class="top">
            <span class="drugs-name">{{ itemi.common_name }}</span><span v-if="itemi.insured" class="medical-insurance-flag">医保</span>
            <span v-if="itemi.price_max" class="price-max">{{ `${itemi.price_max && itemi.item.length > 1 ? '最高' : ''}` }}{{ itemi.price_max | fen2yuan }}元</span>
          </div>
          <table class="drugs-table" border="none" rules="none" cellpadding="0" cellspacing="0">
            <tr><th><span>商品名<br>制药厂商</span></th><th><span>规格<br><!--剂型-->&nbsp;</span></th><th class="price-sort-th" @click="priceSort(indexi, $event)"><span>价格<br>&nbsp;</span></th></tr>
            <tr v-for="(itemj, indexj) in itemi.item" :key="indexj">
              <td><span>{{ itemj.trade_name || '--' }}<br>{{ itemj.enterprise || '--' }}</span></td>
              <td><span>{{ itemj.specification || '--' }}<br><!--{{ itemj.dosage_forms || '&nbsp;' }}-->&nbsp;</span></td>
              <td><span>{{ itemj.price|fen2yuan }}元<br>&nbsp;</span></td>
            </tr>
          </table>
        </div>
      </div>

      <div v-if="drugsDataSorted.length" class="bottom-remark">
        <p>以上数据报告来自各省市药品招标部门公示</p>
      </div>
    </div>

    <div class="pop-wrp">
      <div
        v-if="isShowMask"
        class="mask"
        @click="maskClick"/>

      <!--筛选面板 疾病-->
      <!-- <filter-disease-panel
        :is-show="isShowDiseasePanel"
        :title="'疾病名'"
        :show-back-btn="false"
        :show-closek-btn="false"
        :data="diseasePanelData"
        @diseasePanelOnBack="diseasePanelOnBack"
        @diseasePanelOnClose="diseasePanelOnClose"
        @diseaseSelectionClick="diseaseSelectionClick"
      /> -->
      <filter-sort-panel
        :is-show="isShowDiseasePanel"
        :title="'疾病名'"
        :show-reset-btn="false"
        :dom-id="'disease'"
        :data="diseasePanelData"
        :data-key="'disease'"
        @onFilterSelect="diseaseSelectionClick"
        @onClose="diseasePanelOnClose"
      />

      <!--城市选择面板-->
      <filter-sort-panel
        :is-show="isShowLocationPanel"
        :title="'城市选择'"
        :dom-id="'location'"
        :data="locationPanelData"
        :data-key="'city'"
        @onFilterSelect="onLocationPanelSelect"
        @onClose="locationPanelOnClose"
      />

      <!--厂商选择面板-->
      <filter-sort-panel
        :is-show="isShowEnterprisePanel"
        :title="'厂商'"
        :show-reset-btn="true"
        :dom-id="'enterprise'"
        :data="enterprisePanelData"
        :data-key="'item'"
        @onFilterSelect="onEnterprisePanelSelect"
        @onClose="enterprisePanelOnClose"
        @onReset="enterprisePanelOnReset"
      />

      <!--商品、药品联合-->
      <drugs-production-trade-panel ref="drugs-production-trade-panel" :is-show="isShowProductionAndTradePanel" :common-name-data="commonNamePanelData" :trade-name-data="tradeNamePanelData"
                                    @onProductionNameSelect="onCommonNamePanelSelect"
                                    @onTradeNameSelect="onTradeNamePanelSelect"
                                    @onSearchFormClick="onSearchFormClick"
                                    @onReset="onProductionAndTradePanelReset"
      />
    </div>

    <transition name="fade" mode="out-in">
      <div v-if="isShowSearchPanel" class="search-wrp">
        <!-- 搜索框 -->
        <div class="search-bar">
          <div class="search-input-wrapper">
            <i class="search-icon" />
            <form action="javascript:void(0);">
              <input id="searchInput" v-model="productionAndTradeSearchPanelData.searchInput" placeholder="搜药品名" type="search">
            </form>
            <img v-show="productionAndTradeSearchPanelData.searchInput" :src="require('src/assets/images/mobile/search_new/del.png')" class="del-img" @click="cleanSearchInput">
          </div>
          <!-- <span v-show="productionAndTradeSearchPanelData.searchAble" class="search-btn" @click="">搜索</span> -->
          <span v-show="!productionAndTradeSearchPanelData.searchAble" class="cancel" @click="cancelSearchPanel">取消</span>
        </div>
        <!--结果-->
        <div v-show="productionAndTradeSearchPanelData.searchInput && productionAndTradeSearchPanelData.resultList.length > 0" class="search-smartbox">
          <ul class="search-plain-list">
            <li v-for="(item, index) in productionAndTradeSearchPanelData.resultList" :key="index" class="item search-common-item">
              <div class="name ellipsis" v-html="highLight(item.common_name, item.trade_name)" />
              <a href="javascript:;" class="btn-link" @click="searchItemSelect(item.common_name, item.trade_name)" />
            </li>
          </ul>
        </div>
        <div v-show="!productionAndTradeSearchPanelData.searchInput" class="empty-search">
          <p class="empty-search-remark">请输入药品名关键词</p>
        </div>
        <div v-show="productionAndTradeSearchPanelData.searchInput && productionAndTradeSearchPanelData.resultList.length === 0 && !productionAndTradeSearchPanelData.isSearching" class="empty-result-list">
          <p class="empty-result-list-remark">暂无该药品名相关信息</p>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import drugsPrice from './drugsPrice'
export default drugsPrice
</script>

<style lang="scss" scoped src="./drugsPrice.scss" />
