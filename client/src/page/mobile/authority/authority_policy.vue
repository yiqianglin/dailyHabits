<template>
  <div v-cloak class="container">
    <div class="authority_policy">
      <tmenu :name="list[curIndex]||'内容编辑政策'" :backact="backact" @callback="tmenuCb" />
      <ul v-if="curIndex<0">
        <li v-for="(item,index) in list" :key="index" @click="curIndex=index">{{ item }}
          <a href="javascript:void(0);" class="btn-link" />
        </li>
      </ul>
      <div v-else-if="curIndex===0" class="content">
        <div class="item">
          <div class="title">以患者为中心</div>
          <div class="desc">在内容建设中，企鹅医典会与医学专业学会、公立医疗机构、知名临床专家、医学版权内容提供方、患者组织等进行合作和咨询，我们始终将患者利益放在首位。</div>
        </div>
        <div class="item">
          <div class="title">科学性</div>
          <div class="desc">力求内容的科学性，提供的信息基于现有的最佳科学证据和数据来源（遵循循证原则），符合现代医学进展与共识。</div>
        </div>
        <div class="item">
          <div class="title">适用性</div>
          <div class="desc">企鹅医典始终把用户的需求放在第一位，在内容编辑上我们将专业的医学内容通俗化、并为重点医学名词进行注释，必要时配以图片来帮助用户进行理解。</div>
        </div>
        <div class="item">
          <div class="title">无商业干扰</div>
          <div class="desc">企鹅医典产出的所有医学科普内容均不包含任何商业植入信息。</div>
        </div>
      </div>
      <div v-else-if="curIndex===1" class="content">
        <div class="item">
          <div class="desc nomargin">1. 我们通过用户浏览数据、访谈、现场调查、文献查阅等方式初步确定用户关心的健康问题。再筛选出用户最关心的问题，及医生认为用户最需要知道的问题，组织临床医生参与编写。</div>
        </div>
        <div class="item">
          <div class="desc">2. 企鹅医典拥有专业的医学编辑团队，所有内容均由三甲医院中国临床专家直接进行撰写或审校。</div>
        </div>
        <div class="item">
          <div class="desc">3. 考虑到患者对专业医学内容的接受能力，企鹅医典力求把复杂的医学内容制作成简单、明确、通俗、易懂的内容。我们会在文章上线后邀请一定数量的用户进行阅读体验测试，让内容可以被大部分患者所理解、接受。也会通过个人访谈、小组访谈、问卷调查等形式开展调研。</div>
        </div>
        <div class="item">
          <div class="desc">4. 团队会对内容进行风险评估，以确保内容发布后，不会与法律法规、社会规范、伦理道德、权威信息冲突，导致负面社会舆论；不会因词语表达不够科学准确或有歧义，引起社会混乱和公众恐慌或对公众造成健康伤害。</div>
        </div>
        <div class="item">
          <div class="desc">5. 我们会持续修改完善内容。根据各渠道获得的反馈结果，对内容进行及时的修正和调整。</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import tmenu from 'components/tmenu/tmenu.vue'
export default {
  components: {
    tmenu
  },
  data () {
    return {
      list: ['原则', '编辑过程'],
      curIndex: -1
    }
  },
  computed: {
    backact: function () {
      var that = this
      if (that.curIndex === -1) {
        return false
      }
      return function () {
        that.curIndex = -1
      }
    }
  },
  created () {
  },
  methods: {
    tmenuCb (action) {
      if (action === 'search_clk') {
        this.$store.dispatch('showMiniSearch')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./authority_policy.scss";
</style>
