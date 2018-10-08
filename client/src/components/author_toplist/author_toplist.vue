<template id="tpl_author_toplist">
  <div v-if="item.op_author&&item.op_author.op_doctor.length&&item.op_author.op_doctor[0]" class="author">
    <div v-if="item.op_author.op_doctor[0].icon" class="author-img">
      <img :src="item.op_author.op_doctor[0].icon">
    </div>
    <div class="author-info">{{ item.op_author.op_doctor[0].name+((item.op_author.op_doctor[0].sole ===1||item.op_author.op_doctor[0].position)?(' '+(item.op_author.op_doctor[0].sole ===1?'特约作者':item.op_author.op_doctor[0].position)):'')+(item.op_author.op_doctor[0].hospital?('丨'+item.op_author.op_doctor[0].hospital):'') }}</div>
  </div>
  <div v-else-if="item.op_author&&item.op_author.op_hospital&&item.op_author.op_hospital.hpid == 1000" class="author">
    <div v-if="item.op_author&&item.op_author.op_doctor.length&&item.op_author.op_doctor[0]&&item.op_author.op_doctor[0].sole ===1" class="sole"/>
    <div class="author-img-webmd">
      <img :src="require('src/assets/images/mobile/authority_wm/webmd_logo.png')" >
    </div>
    <div class="author-info">中文版独家授权</div>
  </div>
  <div v-else-if="item.op_author&&item.op_author.op_hospital&&item.op_author.op_hospital.name" class="author">
    <div v-if="item.op_author&&item.op_author.op_doctor.length&&item.op_author.op_doctor[0]&&item.op_author.op_doctor[0].sole ===1" class="sole"/>
    <div v-else-if="item.op_author.op_hospital.icon" class="author-img">
      <img :src="item.op_author.op_hospital.icon">
    </div>
    <div class="author-info">{{ item.op_author.op_hospital.name }}</div>
  </div>
  <div v-else class="author">
    <div v-if="item.op_author&&item.op_author.op_doctor.length&&item.op_author.op_doctor[0].sole !==1" class="author-img">
      <img src="//s.pc.qq.com/tdf/baike/source_wicon.png">
    </div>
    <div class="author-info">{{ item.source }}</div>
  </div>
</template>

<script>
import authorToplist from './author_toplist'
export default authorToplist
</script>
