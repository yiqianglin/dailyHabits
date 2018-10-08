<template id="tpl_topicdocs_c">
  <div v-if="isShow" id="topicWrap" class="topicdocs">
    <papertag-twoline :tags="topic.slice(0,tabFixed?topic.length:8)" :index="currentIndex" :parent-dom="'.topicdocs'" :top-minus-dom="'.tmenu'" @tagclick="topicTabClickAndReport" />

    <paper :name="name" :paperlist="paperList" :toplist="toplist" :show-mode="mode" :loaded="loaded" :noempty="true" :three-img-width="2.1" :rkey="reportkey" :listqa="currentTitle==='热门问答'" :listvideo="currentTitle==='名家之声'"/>
  </div>
</template>

<script>
import topicdocsC from './topicdocs_c'
export default topicdocsC
</script>

<style lang="scss" scoped src="./topicdocs_c.scss" />
