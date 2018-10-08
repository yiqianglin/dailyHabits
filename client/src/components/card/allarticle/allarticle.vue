<template id="tpl_allarticle">
  <div :class="{show: show}" class="allarticle">
    <div class="allarticle-hot">
      <div class="hot-header">推荐</div>
      <div class="hot-list">
        <template v-for="(cate,index) in hotList">
          <div :key="cate.title" class="hot-item" @click="toTag(cate.title,'',index)">
            <p class="hot-title">{{ cate.title }}</p>
            <p class="hot-tags">
              <template v-for="tag in cate.tags">
                <span :key="tag.name" class="hot-tag">{{ tag.name }}</span>
              </template>
              <!-- {{cate.tags.join(' ')}} -->
            </p>
          </div>
        </template>
      </div>
    </div>
    <div class="allarticle-cate">
      <div class="cate-header">全部</div>
      <div class="cate-list">
        <template v-for="(cate,index) in cateList">
          <div :key="index" class="cate-item">
            <p class="cate-title">{{ cate.title }}</p>
            <div class="cate-sublist">
              <template v-for="tag in cate.tags">
                <div :key="tag.name" :class="{longer: (tag.name && tag.name.length > 8) || (tag.hot && tag.name.length > 7)}" class="cate-subitem" @click="toTag(cate.title, tag.name,index)">
                  <p class="cate-name">{{ tag.name && tag.name.length > 18 ? tag.name.substr(0, 18) + '...' : tag.name }}<span v-if="tag.hot" class="hot">热</span></p>
                  <p class="cate-count">{{ tag.count + '篇' }}</p>
                </div>
              </template>
            </div>
          </div>
        </template>
        <div class="cate-item bottom"><p class="cate-title">就医参考</p><div class="cate-sublist"><div class="cate-subitem" @click="toMedicalrefer"><p class="cate-name">就医参考</p></div></div></div>
      </div>
    </div>
    <div v-show="name === '乳腺癌'" class="allarticle-knowledge">
      <div :style="pullUpStyle" class="knowledge">
        上拉进入<span class="disease">{{ name + '知识图谱' }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import allarticle from './allarticle'
export default allarticle
</script>

<style lang="scss" src="./allarticle.scss" />
