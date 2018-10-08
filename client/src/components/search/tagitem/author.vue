<template id="tpl_author">
  <div v-if="item.op_author&&item.op_author.op_doctor&&item.op_author.op_doctor[0]" class="author">
    <div v-if="item.op_author.op_doctor[0].icon" class="author-img">
      <img :src="item.op_author.op_doctor[0].icon">
    </div>
    <div class="author-info">{{ item.op_author.op_doctor[0].name+((item.op_sole===1||item.op_author.op_doctor[0].position)?(' '+(item.op_sole===1?'特约作者':item.op_author.op_doctor[0].position)):'')+(item.op_author.op_doctor[0].hospital?('丨'+item.op_author.op_doctor[0].hospital):'') }}</div>
  </div>
  <div v-else-if="item.op_author&&item.op_author.op_hospital&&item.op_author.op_hospital.hpid == 1000" class="author webmd">
    <div v-if="item.op_author&&item.op_author.op_doctor.length&&item.op_author.op_doctor[0]&&item.op_author.op_doctor[0].sole ===1" class="sole" />
    <div class="webmd-img">
      <img :src="require('src/assets/images/mobile/authority_wm/webmd_logo.png')">
    </div>
    <div class="author-info">中文版独家授权</div>
  </div>
  <div v-else-if="item.op_author&&item.op_author.op_hospital&&item.op_author.op_hospital.hpid == 47" class="author healthwise">
    <div v-if="item.op_author&&item.op_author.op_doctor.length&&item.op_author.op_doctor[0]&&item.op_author.op_doctor[0].sole ===1" class="sole" />
    <div class="healthwise-img">
      <img :src="require('src/assets/images/mobile/authority_hw/hw_logo_rect.png')">
    </div>
    <div class="author-info">中文版独家授权</div>
  </div>
  <div v-else-if="item.op_author&&item.op_author.op_hospital&&item.op_author.op_hospital.name" class="author">
    <div v-if="item.op_author.op_hospital.icon" class="author-img">
      <img :src="item.op_author.op_hospital.icon">
    </div>
    <div class="author-info">{{ item.op_author.op_hospital.name }}</div>
  </div>
  <div v-else class="author">
    <div class="author-img">
      <img src="//s.pc.qq.com/tdf/baike/source_wicon.png">
    </div>
    <div class="author-info">{{ item.source }}</div>
  </div>
</template>

<script>
export default {
  props: {
    item: {
      type: Object,
      default: null
    }
  }
}
</script>

<style lang="scss" scoped>
.author {
  margin-top: 0.3rem;
  display: flex;

  &.webmd {
    align-items: center;
    .webmd-img {
      margin-right: 0.08rem;
      font-size: 0;
      img {
        width: 0.74rem;
        height: 0.17rem;
      }
    }
  }

  &.healthwise {
    align-items: center;
    .healthwise-img {
      margin-right: 0.08rem;
      font-size: 0;
      img {
        width: 1.31rem;
        height: 0.25rem;
      }
    }
  }

  .author-img {
    margin-right: 0.08rem;
    font-size: 0;

    img {
      height: 0.28rem;
      width: 0.28rem;
      border-radius: 50%;
      position: relative;
    }
  }

  .author-info {
    font-size: 0.24rem;
    color: #b8bfc4;
    flex: 1;
    line-height: 0.32rem;
  }
}
</style>
