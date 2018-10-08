<template>
  <div v-cloak class="container">
    <div v-cloak v-show="show" id="main">
      <tmenu :name="name" @callback="tmenuCb" />
      <div class="header">
        <p class="title">{{ name + ' 临床招募' }}</p>
        <p class="description">国内最新的临床试验招募信息</p>
        <!-- <ul class="tags stage-list">
                <li :class="{active: stage === '全部'}" @click="clickTag('stage', '全部')">全部</li>
                <li v-for="(tag, index) in stageList" :class="{active: stage === tag}" @click="clickTag('stage', tag)">{{tag}}</li>
            </ul>
            <ul class="tags kind-list">
                <li :class="{active: kind === '全部'}" @click="clickTag('kind', '全部')">全部</li>
                <li v-for="(tag, index) in kindList" :class="{active: kind === tag}" @click="clickTag('kind', tag)">{{tag}}</li>
            </ul> -->
        <template v-for="(tagList, listIdx) in allTagList">
          <ul :key="tagList.category" class="tags">
            <li :class="{active: filterTags[listIdx] === '全部'}" @click="clickTag(listIdx, '全部')">{{ tagList.category }}</li>
            <li v-for="tag in tagList.tagsitem" :key="tag" :class="{active: filterTags[listIdx] === tag}" @click="clickTag(listIdx, tag)">{{ tag }}</li>
          </ul>
        </template>
      </div>
      <div class="list">
        <template v-for="item in recruits">
          <div :key="item.title" class="item" @click="toRecruit(item)">
            <p class="title">{{ item.title }}</p>
            <ul class="tags">
              <!-- <li v-for="tag in item.op_keyword" :class="{active: stage === tag || kind === tag}">{{tag}}</li> -->
              <li v-for="tag in item.op_keyword" :key="tag" :class="{active: filterTags.indexOf(tag) !== -1}">{{ tag }}</li>
            </ul>
          </div>
        </template>
        <div v-show="!recruits.length" class="empty">{{ loaded ? '敬请期待...' : '数据加载中...' }}</div>
        <div v-show="recruits.length" class="loading">
          <span v-show="!loaded" class="dotting">
            <i/>
            <i/>
            <i/>
        </span>{{ loaded ? '已经没有更多' : '正在加载更多' }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import recruit from './recruit'
export default recruit
</script>

<style lang="scss" scoped>
@import "./recruit.scss";
</style>
