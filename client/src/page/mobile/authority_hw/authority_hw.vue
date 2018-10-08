<template>
  <div v-cloak class="container">
    <div v-cloak id="authority_hw" class="authority_hw">
      <tmenu name="Healthwise" stag="Healthwise" @callback="tmenuCb" />
      <header>
        <img class="logo" src="http://public-30017.sz.gfp.tencent-cloud.com/47-logo.png?timestamp=1510822313">
        <p class="name-title">Healthwise</p>
        <p class="name-desc">美国42年历史的权威医疗健康信息提供机构</p>
        <p class="view-more" @click="toExclusive">查看Healthwise独家内容<img :src="require('src/assets/images/mobile/doctor/green-arrow.png')"></p>
      </header>
      <div class="items">
        <div class="item">
          <div class="title">公司介绍</div>
          <p class="content">Healthwise是一家以帮助大众更好形成健康决策行为己任的非盈利组织。作为独立公司，专注于提供中立不偏颇的健康医疗信息。我们制作的健康科普信息不但有着医学上的严谨准确性，同时也兼顾着大众的阅读便利性，同时我们也提供相应的技术来确保这些信息能够被容易准确地被用户找到。我们的公司宗旨，结合我们创新的精神，一起塑造了帮助解决患者和希望改变自己健康状况人群问题的高标准解决方案。</p>
        </div>
        <div class="item">
          <div class="title">发展历史及成果</div>
          <img src="//s.pc.qq.com/tdf/baike/AboutHealthwise.jpg">
          <p class="content">我们顶尖的疾病教育内容集中于健康领域的消费者所需要的信息。我们提供的信息互动性强、帮助人们成功的做更好的健康决策、执行和改变行为习惯。在我们网站的信息都是以易于理解的、较为简单的语言撰写。同时，我们还会对我们的健康内容进行测试，看这些信息是否满足了那些需要这部分相关信息的人群的需求。我们清晰易懂的语句和有效的消息展示已经获得业内的广泛认可与诸多嘉奖。</p>
        </div>
        <div class="item">
          <div class="title">质量保证</div>
          <p class="content">在Healthwise开发内容的过程中，这些内容经过我们医学、内容和研究团队的审核以保证其可信度、医学准确性和时效性。上述团队在科学研究、以患者为中心的医学决策、医学读写指南和医学写作领域有着丰富的经验。在此基础上，美国专业医生和医学人员对内容再次审核以确保符合基于循证证据的医学指南和临床实践标准。在内容开发之后，我们的医学内容专业人员会采用先进的技术持续观察医药领域的变化，通过研究理解变化，并且快速更新所有受影响的内容。</p>
        </div>
        <div class="item">
          <div class="title">价值主张</div>
          <p class="content">我们主张使人们更容易在自己的健康和保健中发挥更积极的作用，从人们可以不受限制的地获得最准确的的信息为起点。我们参与各种组织和倡议来推进这一理念。</p>
        </div>
        <div class="item">
          <div class="title">品牌认证</div>
          <p class="content">美国顶尖健康计划和卫生系统使用我们的会员计划和患者教育方案。通过这些组织，成千上万的人们通过他们的医疗保健提供方来访问Healthwise信息。此外，还有顶级的客户健康门户网站，包括WebMD, 也嵌入使用了Healthwise 的内容和工具。领先的健康应用程序开发人员运用我们的内容来丰富他们的应用程序的内容。</p>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import authorityHw from './authority_hw'
export default authorityHw
</script>

<style lang="scss" scoped>
@import "./authority_hw.scss";
</style>
