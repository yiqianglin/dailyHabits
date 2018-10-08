<!--普通文章作者-->
<template id="tpl_author">
  <div v-if="opDoctor" class="author">
    <div v-if="opDoctor.icon" class="author-img">
      <img :src="opDoctor.icon">
    </div>
    <div class="author-info">{{ opDoctor.name+((opDoctor.sole ===1||opDoctor.position)?(' '+(opDoctor.sole ===1?'特约作者':opDoctor.position)):'')+(opDoctor.hospital?('丨'+opDoctor.hospital):'') }}</div>
  </div>
  <div v-else-if="item.op_author&&item.op_author.op_hospital&&item.op_author.op_hospital.hpid == 1000" class="author webmd">
    <div v-if="opDoctor&&opDoctor.sole ===1" class="sole" />
    <div class="webmd-img">
      <img :src="require('src/assets/images/mobile/authority_wm/webmd_logo.png')">
    </div>
    <div class="author-info">中文版独家授权</div>
  </div>
  <div v-else-if="item.op_author&&item.op_author.op_hospital&&item.op_author.op_hospital.hpid == 47" class="author healthwise">
    <div v-if="opDoctor&&opDoctor.sole ===1" class="sole" />
    <div class="healthwise-img">
      <img :src="require('src/assets/images/mobile/authority_hw/hw_logo_rect.png')">
    </div>
    <div class="author-info">中国区独家授权</div>
  </div>
  <div v-else-if="item.op_author&&item.op_author.op_hospital&&item.op_author.op_hospital.hpid == 10174" class="author">
    <div class="author-info">美国国家癌症研究所</div>
  </div>
  <div v-else-if="item.op_author&&item.op_author.op_hospital&&item.op_author.op_hospital.name" class="author">
    <div v-if="opDoctor&&opDoctor.sole ===1" class="sole" />
    <div v-else-if="item.op_author.op_hospital.icon" class="author-img">
      <img :src="item.op_author.op_hospital.icon">
    </div>
    <div class="author-info">{{ item.op_author.op_hospital.name }}</div>
  </div>
  <div v-else class="author">
    <div v-if="(opDoctor&&opDoctor.sole !==1)||item.source==='企鹅医典医学团队'" class="author-img">
      <img src="//s.pc.qq.com/tdf/baike/source_wicon.png">
    </div>
    <div v-else-if="item.image" class="author-img">
      <img :src="item.image">
    </div>
    <div class="author-info">{{ item.source }}</div>
  </div>
</template>

<script>
export default {
  // props: ['item']
  props: {
    item: {
      type: Object,
      default () {
        return {}
      }
    },
    doctorid: {
      type: String,
      default () {
        return ''
      }
    }
  },
  computed: {
    opDoctor: function () {
      var item = this.item
      var opDoctor = item.op_author && item.op_author.op_doctor
      if (opDoctor && opDoctor.length) {
        if (this.doctorid) { // 作者只显示传入的医生，防止多个医生，在医生主页显示其他医生文章
          var doctorid = +this.doctorid
          opDoctor = opDoctor.filter(itemi => itemi.drid === doctorid)[0]
        } else {
          opDoctor = opDoctor[0]
        }
      } else {
        opDoctor = null
      }
      return opDoctor
    }
  }
}
</script>

<style lang="scss" scoped>
.author {
  margin-top: 0.2rem;
  display: flex;
  .author-img {
    margin-right: 0.08rem;
    font-size: 0;
    img {
      height: 0.36rem;
      width: 0.36rem;
      border-radius: 0.18rem;
      position: relative;
      top: -0.04rem;
    }
  }
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
  .author-info {
    font-size: 0.24rem;
    color: #b8bfc4;
    flex: 1;
    line-height: 0.32rem;
  }
}
</style>
