<template>
  <div v-cloak :style="{paddingTop:lib==='Healthwise'||lib==='WebMD'?'.88rem':''}" class="container">
    <tmenu v-show="isShow" v-if="lib==='Healthwise'||lib==='WebMD'" :name="lib || currentFilter" :stag="lib" @callback="tmenuCb" />
    <loading :show="!isShow" top="0"/>
    <div v-show="isShow" class="disease-list-container">
      <div class="list">
        <div v-show="fixAlphaTab" id="fixAlphaTab" :style="{top:lib==='Healthwise'||lib==='WebMD'?'.88rem':''}" class="list-block-tab-alpha">{{ fixAlphaTab }}</div>
        <!-- <template v-if="lib !== 'Healthwise'&&lib!=='WebMD'">
          <div v-if="lib==='cancer'" class="search-area">
            <i class="back" @click="toBack" />
            <div class="search-btn" @click="toSearch">搜疾病／症状／文章</div>
          </div>
          <div v-else class="search-activity">
            <active-banner v-if="activeOps" :options="activeOps" />
            <div class="search-btn" @click="toSearch">搜疾病／症状／文章</div>
          </div>
          <div v-if="mostSearched.length>0&&lib!=='cancer'" class="head-block">
            <div class="head-title">
              深度了解
              <p class="desc">健康要保持，疾病要预防</p>
            </div>
            <ul class="hot-diseases">
              <li v-for="item in mostSearched" :key="item.name">
                <div class="img"><img :src="item.image"></div>
                <p class="desc ellipsis">{{ item.name }}</p>
                <a href="javascript:;" class="btn-link" @click="toOverview(item.name,item.type,'ydd_disease_topx')" />
              </li>
            </ul>
          </div>
          <div v-if="mostVisited.length>0" :class="{'mt16':mostSearched.length>0&&lib!=='cancer'}" class="head-block">
            <div class="head-title">
              大家在看
              <p class="desc">专业、科学的疾病知识</p>
            </div>
            <ul class="look-diseases">
              <li v-for="item in mostVisited.slice(0,lib==='cancer'?11:4)" :key="item.name" :style="{fontSize:item.name.length>7?'.24rem':''}" class="ellipsis">{{ item.name }}
                <a href="javascript:;" class="btn-link" @click="toOverview(item.name,item.type,'ydd_disease_topx')" />
              </li>
              <li class="ellipsis">日常急救
                <a href="javascript:;" class="btn-link" @click="toEmergency" />
              </li>
              <li v-if="mostVisited.length>4&&lib!=='cancer'" class="ellipsis" @click="toVisitedMore()">更多 ...</li>
            </ul>
          </div>
        </template> -->
        <div id="listBlock" :class="{'mt16':((lib !== 'Healthwise'&&lib!=='WebMD')&&(mostSearched>0||mostVisited.length>0))}" :style="{paddingTop:fixCategory?'1.02rem':''}" class="list-block">
          <div v-if="lib === 'Healthwise'" class="healthwise-tab"><img class="hw-logo" src="http://public-30017.sz.gfp.tencent-cloud.com/47-logo.png?timestamp=1510822313">Healthwise 中国区独家授权</div>
          <div v-else-if="lib === 'WebMD'" class="webmd-tab"><img :src="require('src/assets/images/mobile/authority_wm/webmd-banner.png')"></div>
          <div v-else id="allTab" :class="{fixed:fixCategory}" class="list-tab all">
            <span class="back" @click="toBack" /> {{ currentFilter }}
            <span class="filter" @click="showCategory()">筛选</span>
          </div>
          <div :style="{paddingBottom:lib==='WebMD'?0:''}" class="alpha-list">
            <div v-for="item in alphaList" :key="item.name" class="list-block-lib">
              <div :id="'alpha-'+ (item.name === '#' ? '' : item.name)" :style="{visibility: fixAlphaTab === item.name ? 'hidden' : ''}" class="list-block-alpha">{{ item.name }}</div>
              <ul class="list-block-diseases">
                <li v-for="published in item.published" :key="published.name" class="list-block-disease">
                  <div class="name">{{ published.name }}</div>
                  <a href="javascript:;" class="btn-link" @click="toOverview(published.name,published.type)" />
                </li>
                <li v-for="building in item.building" :key="building.name" class="list-block-disease building">
                  <div class="name">{{ building.name }}</div>
                  <span>建设中</span>
                  <a href="javascript:;" class="btn-link" @click="toBuilding(building.name)" />
                </li>
              </ul>
            </div>
          </div>
          <div v-if="lib==='WebMD'" class="webmd-more">更多专业内容，陆续更新</div>
        </div>
        <div class="list-right-alpha" @touchmove.stop.prevent="quickToList">
          <ul>
            <template v-for="item in alphaList">
              <li :key="item.name" :class="{'on':fixAlphaTab === item.name}">
                <a :href="!shouldPreventTouch ? 'javascript:;' : '#alpha-'+ (item.name === '#' ? '' : item.name)" class="right-alpha" @click="scrollTopAlpha">{{ item.name }}</a>
              </li>
            </template>
          </ul>
        </div>
      </div>
      <div v-show="isShowCategory" class="list-filter-types">
        <div class="list-area">
          <i class="close" @click="hideCategory()" />
          <div class="title">疾病筛选</div>
          <div v-if="category&&category.length>0" class="list-disease">
            <div class="type-part">
              <div class="list-tab">按首字拼音</div>
              <div class="all-disease">
                <span :class="{on:currentFilter==='全部疾病'}" @click="doFilter('全部疾病')">全部疾病</span>
              </div>
            </div>
            <div v-for="item in category" v-if="item.types&&item.types.length>0" :key="item.title" class="type-part">
              <div class="list-tab">{{ item.title }}</div>
              <div v-if="item.title==='按科室'">
                <ul v-for="(itemi, itemiIdx) in getGroup(item.types,3)" :key="itemiIdx" class="depart-series">
                  <li v-for="itemj in itemi" :key="itemj.name" @click="doFilter(itemj.name)">
                    <span :class="{on:currentFilter===itemj.name}">{{ itemj.name.substr(0,5) }}</span>
                  </li>
                </ul>
              </div>
              <ul v-else class="part-series">
                <li v-for="itemi in item.types" :key="itemi.name" @click="doFilter(itemi.name)">
                  <span :class="{on:currentFilter===itemi.name}">{{ itemi.name.substr(0,3) }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import diseaseList from './disease_list'
export default diseaseList
</script>

<style lang="scss" scoped>
@import "./disease_list.scss";
</style>
