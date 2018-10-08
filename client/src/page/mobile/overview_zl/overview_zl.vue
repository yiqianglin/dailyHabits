<template>
  <div v-cloak class="container">
    <div v-cloak id="main">
      <tmenu :name="name" :issearchbar="true" @callback="tmenuCb" />
      <loading :show="!isShow"/>
      <template v-show="isShow">
        <div class="top-card">
          <div v-for="(item, index) in baseinfo" :key="index">
            <div v-if="item.tid === 0" class="disease-intro">
              <p class="h1">
                <span class="name">{{ name }}</span>
                <a v-if="!(from==='tanyi')" class="follow-btn" @click="followClick">{{ followed ? '已关注' : '+关注' }}</a>
              </p>
              <div v-if="item.op_alias.length && !(from==='tanyi')" class="alias ellipsis">又称:{{ item.op_alias.join('、') }}</div>
              <p v-if="item.op_review&&item.op_review.text" class="disease-doctor" @click="toDoctor(item.op_review.doctor_id,item.op_review.clickable)">{{ item.op_review.text }}
                <i v-if="item.op_review.clickable" class="arrow" />
              </p>
              <div class="webmd-text" @click="toWebmd()">
                <div class="webmd"><img :src="require('src/assets/images/mobile/overview_zl/webmd_logo.png')"></div>
                <div class="web-intro">
                  <p :style="{lineHeight:wmdcount == 0 ? '0.64rem':''}">全球领先的医疗科普网站独家授权</p>
                  <p v-if="wmdcount > 0">精选
                  <span> {{ wmdcount }} </span>篇{{ name }}专业文章</p>
                </div>
              </div>
            </div>
            <div v-if="!!item.thumb" class="disease-image" @click="toCommittee()">
              <img :src="item.thumb">
            </div>
          </div>
        </div>
        <div class="list">
          <div v-if="activeList && activeList.length>0" class="hot-list">
            <div class="paper">
              <div v-for="(item,index) in activeList" :key="index" class="hot-list-item">
                <template v-if="item.type == 3">
                  <div class="item-thumb" @click="hotListClick(item.type, { h5url: item.h5url },index)">
                    <div class="pic-wrp">
                      <img :src="item.image || require('src/assets/images/mobile/overview_zl/active-list-default-img-2.png')">
                    </div>
                    <div class="content-wrp">
                      <p class="row-01">
                        <span class="column">{{ item.topic }}</span>
                        <span class="count">(共{{ item.docnum }}篇)</span>
                      </p>
                      <p class="row-02">{{ item.text }}</p>
                    </div>
                  </div>
                </template>
                <template v-else-if="item.type == 1">
                  <div class="item-link" @click="hotListClick(item.type, { h5url: item.h5url },index)">
                    <div class="pic-wrp">
                      <img :src="item.image || require('src/assets/images/mobile/overview_zl/active-list-default-img-1.png')">
                    </div>
                    <div class="content-wrp">
                      <p class="row-01">
                        <span class="column">{{ item.topic }}</span>
                      </p>
                      <p class="row-02">{{ item.text }}</p>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class="item-article" @click="hotListClick(item.type, { docid: item.docid || (item.docinfo[`tid${item.docinfo.tid}`] && item.docinfo[`tid${item.docinfo.tid}`].docid) },index)">
                    <div class="pic-wrp">
                      <img :src="item.image || require('src/assets/images/mobile/overview_zl/active-list-default-img-1.png')">
                    </div>
                    <div class="content-wrp">
                      <p class="row-01">
                        <span class="column">{{ item.topic }}</span>
                      </p>
                      <p class="row-02">{{ item.text || (item.docinfo[`tid${item.docinfo.tid}`] && item.docinfo[`tid${item.docinfo.tid}`].title) || (item.docinfo[`tid${item.docinfo.tid}`] && item.docinfo[`tid${item.docinfo.tid}`].md_text) }}</p>
                    </div>
                  </div>
                </template>
              </div>
            </div>
            <p class="more-btn" @click="toNewCard()">更多精选</p>
          </div>

          <div class="doc-list">
            <div v-if="filterData.length>0" class="filter-label" ptag="onco_listcancer_filter_clk">
              <span class="label" @click="showFilter">{{ hasFilter ? '已为您筛选出以下结果' : '筛选' }}</span>
              <span :class="['icon', {selected: hasFilter}]" @click="showFilter" />
            </div>
            <!--文章多显示标签树-->
            <div v-if="showType == 1" class="contruct-list">
              <template v-for="(item,index) in trees">
                <div :key="item.id" :id="item.id" :class="item.foldflag?'expand':''" class="block" @click.stop.prevent="slideFirst(index,item.id)">
                  <!-- first 一级label start-->
                  <p class="h2">
                    <!-- <span class="h2-1"></span> -->
                    <span class="h2-2">{{ item.label }}</span>
                    <span class="h2-3">({{ item.count }}篇)</span>
                    <span :class="['common-flag', {'expand': item.foldflag}]" />
                    <!-- <span class="common-flag expand"></span> -->
                    <span v-if="lastEid1==item.id && !item.foldflag" ref="readflag1" class="new-icon first" />
                  </p>
                  <!-- 一级label end -->
                  <!-- 一级目录下的文章start -->
                  <template v-if="item.foldflag">
                    <!-- 只有一篇文章展示总论 -->
                    <div v-if="item.docs && item.docs.length == 1 && item.docs[0].summary!=''" class="conclusion" @click.stop.prevent="toArticle(item.docs[0].docid,item.id)">
                      <span>{{ item.docs[0].summary }}</span>
                      <img :src="require('src/assets/images/mobile/doctor/arrow-up.png')">
                      <span v-if="lastEid1==item.id && lastEid2=='' && item.docs[0].docid == cdocid" ref="readflag1" class="new-icon first" />
                    </div>
                    <!-- 多篇文章展示文章标题列表 -->
                    <!-- <template v-if="item.docs && item.docs.length > 1" v-for="(docitem,docindex) in item.docs">
                                          <div class="art-title1"  @click="toArticle(docitem.docid,item.id)" >
                                              <span>{{docitem.title}}</span>
                                              <span class="new-icon first" v-if="lastEid1==item.id && lastEid2=='' && docitem.docid == cdocid" ref="readflag1"></span>
                                          </div>
                                      </template> -->
                  </template>
                  <!-- 一级目录下的文章end -->
                  <!-- second 二级目录 start 展开状态 flodflag标识展开收起状态-->
                  <template v-if="item.foldflag">
                    <template v-for="(item1,index1) in item.second">
                      <div :key="item1.id" :id="item1.id" class="disease-content">
                        <template v-if="item1.third && item1.third.length === 0">
                          <p :style="item1.foldflag || index1==item.second.length-1?'border-bottom:none':''" class="disease-name no-third" @click.stop.prevent="toTagArticle(item.label,item1.label,'',item.id,item1.id)">
                            <!-- <img :src="require('src/assets/images/mobile/overview_zl/arr@3x.png')" class="slideup"> -->
                            {{ item1.label }}
                            <span v-if="lastEid1==item.id && lastEid2 == item1.id" ref="readflag2" class="new-icon second" />
                            <span class="s-num">{{ item1.count }}篇</span>
                          </p>
                        </template>
                        <template v-else>
                          <p :class="lastEid2 == item1.id ? 'cur':''" class="disease-name" @click.stop.prevent="slideSecond(index,index1,item1.id)">
                            <img :src="require('src/assets/images/mobile/overview_zl/arr@3x.png')" :class="!item1.foldflag ? 'slideup' :''"> {{ item1.label }}
                            <span v-if="lastEid1==item.id && lastEid2 == item1.id && !item1.foldflag" ref="readflag2" class="new-icon second" />
                            <span class="s-num">{{ item1.count }}篇</span>
                          </p>
                        </template>

                        <!-- third -->
                        <div v-if="item1.foldflag" class="disease-info">
                          <!-- 二级目录下的文章 一篇展示总论，多篇展示标题列表 start-->
                          <p v-if="item1.docs && item1.docs.length == 1 && item1.docs[0].summary !='' && item1.third && item1.third.length > 0" class="conclusion" @click.stop.prevent="toArticle(item1.docs[0].docid,item.id,item1.id)">
                            <span>{{ item1.docs[0].summary }}</span>
                            <img :src="require('src/assets/images/mobile/doctor/arrow-up.png')">
                            <span v-if="lastEid1==item.id && lastEid2==item1.id && lastEid3=='' && item1.docs[0].docid == cdocid" ref="readflag2" class="new-icon second" />
                          </p>
                          <template v-for="docitem1 in item1.docs">
                            <p v-if="item1.docs && item1.docs.length > 1 && item1.third && item1.third.length > 0" :key="docitem1.docid" class="art-title" @click="toArticle(docitem1.docid,item.id,item1.id)">
                              <span>{{ docitem1.title }}</span>
                              <span v-if="lastEid1==item.id && lastEid2==item1.id && lastEid3=='' && docitem1.docid == cdocid" ref="readflag2" class="new-icon second" />
                            </p>
                          </template>
                          <!-- 二级目录文章end 三级下面的tag下只有一篇文章展示标题 多篇展示tag并显示文章数 start-->
                          <template v-for="item2 in item1.third">
                            <!-- <p class="art-title" @click="toArticle(item2.doc.docid,item.id,item1.id,item2.id)" v-if="item2.count===1">
                                                          <span>{{item2.doc && item2.doc.title ? item2.doc.title : item2.label}}</span>
                                                          <span class="new-icon third" v-if="lastEid1==item.id && lastEid2==item1.id && lastEid3==item2.id && item2.doc.id == cdocid" ref="readflag3"></span>
                                                      </p> -->
                            <p :key="item2.id" class="tag-name" @click.stop.prevent="toTagArticle(item.label,item1.label,item2.label,item.id,item1.id,item2.id)">
                              <span>{{ item2.label }}</span>
                              <span class="art-num">{{ item2.count }}篇</span>
                              <span v-if="lastEid1==item.id && lastEid2==item1.id && lastEid3==item2.id" ref="readflag3" class="new-icon third" />
                            </p>
                          </template>
                          <!-- end -->
                        </div>
                      </div>
                    </template>
                  </template>
                  <!-- 收起状态展示 tag list -->
                  <template v-else>
                    <div class="tags-list">{{ item.desc }}</div>
                  </template>
                  <!-- <template v-for="(item1,index1) in item.second" v-if="index1 < 2">{{item1.label+'&nbsp;&nbsp;'}}</template>
                                  <span>...</span> -->
                  <!-- 二级目录end -->
                  <!-- <span class="new-icon"></span> -->
                </div>
              </template>
            </div>
            <!--文章少-->
            <div v-if="showType == 2" class="tab-docs-list">
              <!-- <papertag :tags="tags" :index="tagSelectedIndex" @tagclick="tagclick"></papertag> -->
              <div v-if="tags&&tags.length>0" class="tag-list">
                <div class="li-outter-wrp">
                  <ul id="tagUl" :class="{'auto-height':tagUp}">
                    <li v-for="(itemi,indexi) in tags" :key="itemi" :class="{on:tagSelectedIndex===indexi}" ptag="search_articletag_clk" @click="tagclick(indexi)">{{ itemi }}</li>
                  </ul>
                </div>
                <i v-show="showArrow" :class="{up:tagUp}" class="arrow" @click="clickArrow()" />
              </div>
              <paper :loaded="true" :paperlist="docsList" />
            </div>
          </div>
        </div>

        <div class="filter-panel-wrp">
          <div v-if="isShowFilter" class="filter-panel-mask" @click="toggleFilter" />
          <transition name="slide-fade">
            <div v-if="isShowFilter" class="filter-panel">
              <div v-for="(filterItem_p, index_p) in filterData" :key="index_p" class="filter-outter">
                <p class="title">{{ filterItem_p.title }}</p>
                <ul class="filter-ul">
                  <li v-for="(filterItem_s, index_s) in filterItem_p.tags" :key="index_s" :class="['filter-li', {'selected': judgeItemStatus(index_p, filterItem_s.name)}]" @click="filterItemClick(index_p, filterItem_s)">
                    {{ filterItem_s.name }}
                    <span v-if="filterItem_s.desc" class="desc">({{ filterItem_s.desc }})</span>
                    <span class="decoration" />
                  </li>
                </ul>
              </div>
              <ul class="btn-group">
                <a href="javascript:void(0);" class="cancel" @click="filterCancel">取消筛选</a>
                <a href="javascript:void(0);" class="submit" ptag="onco_listcancer_filteruse_clk" @click="filterSumbit">确定</a>
              </ul>
            </div>
          </transition>
          <transition name="slide-toast-fade">
            <div v-if="toastShow" class="toast-no-content">
              <span class="icon" />
              <p>无内容</p>
              <p>请修改筛选条件</p>
            </div>
          </transition>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import overviewZl from './overview_zl'
export default overviewZl
</script>

<style lang="scss" scoped>
@import "./overview_zl.scss";
@import "~src/components/paper/paper.scss";
</style>
