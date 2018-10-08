<template id="tpl_topicdocs">
  <div id="topicWrap" class="topicdocs">
    <!-- <div v-if="topic&&topic.length>1" id="tabWrap" :class="tabFixed?'tabs-row':'tabs'">
      <div v-for="(item, index) in topic.slice(0,tabFixed?topic.length:8)" :key="index" :ptag="(index>0?'YDD_Content_TopicTabX:' : 'ydd_content_recoartitab:')+item.title" :class="{ active: currentIndex === index, update: !item.readflag}" class="item" @click="topicTabClick(index)">
        <span>{{ (item.title||'').substr(0,5) }}</span>
        <a href="javascript:;" class="btn-link"/>
      </div>
    </div> -->
    <papertag-twoline v-if="topic.length" :tags="topic.slice(0,tabFixed?topic.length:8)" :index="currentIndex" :parent-dom="'.topicdocs'" :top-minus-dom="'.tmenu'" @tagclick="topicTabClick" />

    <paper :paperlist="paperList" :rkey="rkey||{article:(currentIndex===0?'ydd_content_recoartix':'ydd_content_topicartix')}" :loaded="loaded" :noempty="true" :three-img-width="2.1" :listqa="currentTitle==='热门问答'" :listvideo="currentTitle==='名家之声'"/>
  </div>
</template>

<script>
import topicdocs from './topicdocs'
export default topicdocs
</script>

<style lang="scss" scoped src="./topicdocs.scss" />
