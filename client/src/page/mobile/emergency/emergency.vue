<template>
  <div v-cloak class="container">
    <div v-cloak id="emergency" class="emergency">
      <template v-if="show">
        <tmenu name="日常急救" @callback="tmenuCb" />
        <div class="top-search">
          <div class="search-input">
            <input :class="{active: showAidSearch}" v-model="searchInput" type="text" placeholder="搜急救" ptag="ydd_emergency_home_rearch" @click="setAidSearch">
            <i v-show="searchInput" class="del" @click="clearInput" />
          </div>
          <div v-show="showAidSearch" class="tip" @click="closeSearch">取消</div>
        </div>
        <div v-show="block == 'home'" class="home">
          <active-banner v-if="activeOps" :options="activeOps" />
          <div v-if="emergDocs.length" class="more-list">
            <ul>
              <template v-for="(item, index) in emergDocs">
                <li :key="index" class="more-item">
                  <a href="javascript:;" @click="toArticle('图片', item.title, item.docid, index + 1)"><img :src="item.image?item.image:require('src/assets/images/mobile/authority_hw/AboutHealthwise.jpg')">
                    <!-- <span class="item-title">{{item.desc}}</span> -->
                  </a>
                </li>
              </template>

              <!--                    <li><a href="javascript:;" onclick="location.href=baike.getUrl('/mobile/emerg_articles.html');;MtaH5.clickStat('YDD_Emergency_MoreArti')">
     <span class="item-title">更多文章</span>
 </a></li> -->

            </ul>
          </div>
          <div class="cates">
            <template v-for="cate in cates">
              <div :key="cate.title" class="cate">
                <div class="title">{{ cate.title }}</div>
                <div class="list">
                  <template v-for="(item, index) in cate.list">
                    <div v-if="cate.bg" :key="item.title" :style="{backgroundImage: 'url(' + item.image + ')'}" class="bg-item" @click="toArticle(cate.title, item.title, item.docid, index + 1)">
                      <p>{{ item.title }}</p>
                      <p class="desc">{{ item.desc }}</p>
                    </div>
                    <template v-else>
                      <div :key="item.title" class="item" @click="toArticle(cate.title, item.title, item.docid, index + 1)">{{ item.title }}</div>
                    </template>
                  </template>
                </div>
              </div>
            </template>
          </div>
          <div class="emergency-tel">
            <p class="desc">如果情况严重危及生命，请立即拨打急救电话</p>
            <div class="tel">拨打
              <span>120</span> 急救电话
              <a href="tel:120" class="btn-link" />
            </div>
          </div>
        </div>
        <!-- <div class="search-content" v-if="showAidSearch">
                <div class="history" v-if="history.length && !searchRes.length && !searchInput">
                    <p class="title">历史<span @click="clearHistory">清空历史</span></p>
                    <ul class="list">
                        <li v-for="(item, index) in history" class="item">
                            {{item.name}}
                            <a href="javascript:;" class="btn-link" @click="toArticle(item.docid, index)"></a>
                        </li>
                    </ul>
                </div>
              <div class="search-list" v-else>
                <template v-if="!showEmpty">
                        <ul class="list">
                            <li class="item" v-for="(item, index) in searchRes">
                                <div class="name" v-html="item.html_name"></div>
                                <a href="javascript:;" class="btn-link" @click="toSearch(item.name, item.docid, index)"></a>
                            </li>
                        </ul>
                </template>
                <div class="empty" v-else>暂时没有相关文章</div>
              </div>
            </div> -->
        <div v-show="showAidSearch && history.length && !searchRes.length && !searchInput" class="search-content s1">
          <div class="history">
            <p class="title">历史
              <span @click="clearHistory">清空历史</span>
            </p>
            <ul class="list">
              <li v-for="(item, index) in history" :key="index" class="item">
                {{ item.name }}
                <a href="javascript:;" class="btn-link" @click="toSearch(item.name, item.docid, index + 1)" />
              </li>
            </ul>
          </div>
        </div>
        <div v-show="showAidSearch && searchInput" class="search-content s2">
          <div class="search-list">
            <template v-if="!showEmpty">
              <ul class="list">
                <li v-for="(item, index) in searchRes" :key="index" class="item">
                  <div class="name" v-html="$options.filters.highLight(item.name, keywords)" />
                  <a href="javascript:;" class="btn-link" @click="toSearch(item.name, item.docid, index + 1)" />
                </li>
              </ul>
            </template>
            <div v-else class="empty">暂时没有相关文章</div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="hint">请在微信浏览器中打开</div>
      </template>
    </div>
  </div>
</template>

<script>
import emergency from './emergency'
export default emergency
</script>

<style lang="scss" scoped>
@import "./emergency.scss";
</style>
