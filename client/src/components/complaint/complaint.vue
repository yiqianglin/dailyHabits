<template id="tpl_complaint">
  <div v-show="(name==='哮喘'||name==='乳腺癌'||name==='腰椎间盘突出症')&&false"
       v-cloak :style="{right:showAll?'':'-.7rem'}" :ptag="'YDD_question_in|'+name+version" class="complaint" @click="toComplaint">有奖反馈</div>
</template>

<script>
import complaint from './complaint'
export default complaint
</script>

<style lang="scss" scoped src="./complaint.scss" />
