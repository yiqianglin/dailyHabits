<template>
  <div class="card-container">
    <div class="card-wrapper">
      <!-- 完全命中商品名；部分命中商品名、化学名、厂商名，有唯一药品搜索结果 -->
      <p v-if="item.common_name && item.trade_name.length === 1" class="drug-names">
        <!-- 商品名 -->
        <span class="name-bold" v-html="$options.filters.highLight(item.trade_name[0], keywords)" />
        <!-- 化学名 -->
        <span class="name-light" v-html="$options.filters.highLight('（' + item.common_name + '）', keywords)" />
      </p>
      <!-- 完全命中化学名，有多个商品名；部分命中化学名；有唯一药品搜索结果 -->
      <p v-if="item.common_name && item.trade_name.length !== 1" class="drug-names">
        <!-- 化学名 -->
        <span class="name-bold" v-html="$options.filters.highLight(item.common_name, keywords)" />
      </p>
      <div class="drug-info-list">
        <!-- 完全命中化学名，有多个商品名；部分命中化学名，有唯一药品搜索结果 -->
        <!-- 商品名 -->
        <div v-if="item.trade_name && item.trade_name.length > 1" class="drug-info-item">
          <div class="title">商品名：</div>
          <div class="content">
            <!-- <div v-html="$options.filters.highLight(item.trade_name.slice(0, 2).join('、') + (item.trade_name.length > 1 ? '等' + item.trade_name.length + '种商品' : ''), keywords)" /> -->
            <div v-html="$options.filters.highLight(item.trade_name.slice(0, 2).join('、') + (item.trade_name.length > 1 ? '等' : ''), keywords)" />
          </div>
        </div>
        <!-- 药品信息 -->
        <div v-if="item.enterprise" class="drug-info-item">
          <div class="title">制药厂商：</div>
          <div class="content">
            <div v-html="$options.filters.highLight(item.enterprise, keywords)" />
          </div>
        </div>
        <div v-if="item.indication" class="drug-info-item">
          <div class="title">适用症：</div>
          <div class="content two-clamp">
            <div v-html="$options.filters.highLight(item.indication, keywords)" />
          </div>
        </div>
        <div v-if="item.effect" class="drug-info-item">
          <div class="title">不良反应：</div>
          <div class="content two-clamp">
            <div v-html="$options.filters.highLight(item.effect, keywords)" />
          </div>
        </div>
        <div v-if="item.price_min && item.price_max" class="drug-info-item">
          <div class="title">参考价格：</div>
          <div class="content">
            <div v-if="item.price_min !== item.price_max">约{{ item.price_min | convertUnit(1 / 100, 1) }}~{{ item.price_max | convertUnit(1 / 100, 1) }}元</div>
            <div v-else>约{{ item.price_min | convertUnit(1 / 100, 1) }}元</div>
          </div>
        </div>
        <div v-if="item.diseases && item.diseases.length" class="drug-info-item">
          <div class="title">适用疾病：</div>
          <div class="content">
            <div v-html="$options.filters.highLight(item.diseases.join('、'), keywords)" />
          </div>
        </div>
        <div v-if="item.recruitdesc" class="drug-info-item">
          <div class="title">试验对象：</div>
          <div class="content">
            <div v-html="$options.filters.highLight(item.recruitdesc, keywords)" />
          </div>
        </div>
      </div>
      <!-- 入口 -->
      <div class="drug-action-list">
        <div v-if="item.discostflag" class="drug-action-item" @click="clickEntry(0)"><img :src="require('src/assets/images/mobile/search/price_check.png')">价格查询
          <a href="javascript:" class="btn-link" />
        </div>
        <div v-if="item.druginstrucflag" class="drug-action-item" @click="clickEntry(1)"><img :src="require('src/assets/images/mobile/search/drug_instruction.png')">药品说明
          <a href="javascript:" class="btn-link" />
        </div>
        <div v-if="item.recruitflag" class="drug-action-item" @click="clickEntry(2)"><img :src="require('src/assets/images/mobile/search/clinical_trial.png')">临床试验
          <a href="javascript:" class="btn-link" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cardDrug from './card_drug'
export default cardDrug
</script>

<style lang="scss" scoped>
@import "./card_drug.scss";
</style>
