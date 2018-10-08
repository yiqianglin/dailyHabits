<template>
  <div v-cloak class="container">
    <div v-cloak id="authority_wm" class="authority_wm">
      <tmenu name="WebMD" stag="WebMD" @callback="tmenuCb" />
      <header>
        <img :src="require('src/assets/images/mobile/authority_wm/webmd_logo-big.png')" class="logo">
        <div class="name-info">
          <p class="title">美国专业的医疗健康信息服务商</p>
          <span class="desc">腾讯享有 WebMD 中文独家授权</span>
        </div>
      </header>
      <div class="items">
        <div class="item">
          <div class="title">公司介绍</div>
          <div class="content">WebMD成立于1996年，是美国最大的医疗健康服务网站之一，拥有全美最丰富的健康医疗资讯。WebMD为患者和医生建立了一个通过网络了解、交流医疗信息的渠道，所提供的医疗资讯与服务皆是业界的佼佼者。
          </div>
        </div>
        <div class="item">
          <div class="title">腾讯合作</div>
          <div class="content">2018年8月2日，腾讯与WebMD在京召开发布会，宣布双方达成中国独家战略合作，为腾讯旗下的“企鹅医典”提供更多权威内容。在合作后，腾讯将获得WebMD超过60000篇医学科普文章的中文版授权。
          </div>
        </div>
        <div v-show="introExpanded" class="item">
          <div class="title">公司服务</div>
          <div class="content">
            WebMD通过在线网站、手机平台及健康出版物，为患者、大众、医生、健康专业人士提供专业的健康资讯服务。用户在这里可以找到最可靠、最新的原创健康资讯。在内容展现上有多种形式，包括文字内容、医学插图、医学视频等。在WebMD上不仅仅有医学资讯，还有患者社区、专家评论以及医学评论等栏目，可以满足用户的多种需求。<br> WebMD以为用户提供最准确、最可靠的医学信息为己任；并希望把艰涩难懂的医学理论知识用通俗易懂的语言表现出来，让医学知识触手可及。
            <br> 在未来，WebMD将会不断完善网站，发布更多的健康资讯，帮助用户在面临医疗健康决策时找到适合自己的方式，以及更好地了解自己和家人的健康状况。
          </div>
        </div>
      </div>
      <div class="footer" @click="introExpanded=!introExpanded">
        {{ introExpanded ? '点击收起' : '点击展开' }}
        <!-- <img class="arrow" :src="introExpanded ? require('src/assets/images/mobile/doctor/arrow-up.png') : require('src/assets/images/mobile/doctor/arrow-down.png')" /> -->
        <a class="btn-link" href="javascript:void(0);" />
      </div>
      <div v-if="diseases&&diseases.length" class="exclusive-content">
        <div class="title">
          <p class="name">独家内容</p>
          <p class="desc">企鹅医典已上线</p>
        </div>
        <div class="num-list">
          <div class="item">
            <div class="info">
              <span class="num">{{ diseaseNum||'' }}</span>
              <div class="desc">
                <p>个</p>
                <p>疾病</p>
              </div>
            </div>
          </div>
          <div class="item">
            <div class="info">
              <span class="num">{{ docNum||'' }}</span>
              <div class="desc">
                <p>篇</p>
                <p>文章</p>
              </div>
            </div>
          </div>
        </div>
        <ul class="list">
          <li v-for="(item,index) in diseases" :key="index">
            <p>{{ item.name }}</p>
            <div class="num">{{ item.count||0 }}篇</div>
            <a :tourl="'/mobile/overview_wm.html?name='+item.name+'&type='+item.type+'&released='+item.released" :ptag="'YDD_WebMD_DiseaseX:'+(index+1)" class="btn-link" href="javascript:void(0);" />
          </li>
        </ul>
        <div class="more-disease">
          更多独家内容
          <a class="btn-link" href="javascript:void(0);" tourl="/mobile/disease_list.html?lib=WebMD" ptag="ydd_webmd_more" />
        </div>
      </div>
      <!-- <div class="webmd-article">
                <p class="header">独家授权文章</p>
                <div class="doclist">
                    <div >
                        <paper :paperlist="docsList"  :loaded="loaded"></paper>
                    </div>
                </div>
            </div> -->
    </div>
  </div>
</template>

<script>
import authorityWm from './authority_wm'
export default authorityWm
</script>

<style lang="scss" scoped>
@import "./authority_wm.scss";
</style>
