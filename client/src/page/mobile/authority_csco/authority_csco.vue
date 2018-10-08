<template>
  <div v-cloak class="container">
    <div v-cloak id="authority_csco" class="authority_csco">
      <tmenu name="CSCO" stag="CSCO" @callback="tmenuCb" />
      <header>
        <img :src="require('src/assets/images/mobile/authority_csco/csco-logo.png')" class="logo">
        <div class="name-info">
          <p class="title">中国临床肿瘤协会</p>
          <span class="desc">我国最专业的临床肿瘤学术团体</span>
        </div>
      </header>
      <div class="items-wrap">
        <div :class="{'introExpanded': introExpanded}" class="items">
          <div class="item">
            <div class="title">学会简介</div>
            <div class="content">中国临床肿瘤学会（CSCO）是由临床肿瘤专业工作者和有关的企事业单位自愿组成的全国性专业学术团体。始终倡导“学术、公益、奉献”，践行“服务、协调、引导”的工作理念。</div>
          </div>
          <div class="item">
            <div class="title">腾讯合作</div>
            <div class="content">CSCO与腾讯公司达成了战略合作意向，双方合作成立专家委员会，推动“企鹅医典”建设，是强强联合，以实际行动积极响应和实践党中央、国务院提出的“健康中国”的宏伟战略，利用双方的资源，优势互补，共同开展公益性学术活动，大力宣传和普及科学的防癌抗癌知识，实施患者教育和服务，帮助寻医问药，同时，必将促进全国肿瘤学诊治和研究的规范化蓬勃发展。</div>
          </div>
        </div>
        <div class="footer" @click="introExpanded=!introExpanded">
          {{ introExpanded ? '点击收起' : '点击展开' }}
          <!-- <img class="arrow" :src="introExpanded ? require('src/assets/images/mobile/doctor/arrow-up.png') : require('src/assets/images/mobile/doctor/arrow-down.png')" /> -->
          <a class="btn-link" href="javascript:void(0);" />
        </div>
      </div>
      <div class="cancer-members">
        <p class="max-title">CSCO理事会主要成员</p>
        <template v-for="(item, itemIdx) in members">
          <div v-if="item.type!==3&&item.list&&item.list.length>0" :key="itemIdx" class="member-item-01">
            <div class="title">{{ item.title }}
              <span v-if="item.titleDesc">（{{ item.titleDesc }}）</span>
            </div>
            <ul :class="item.ulClass">
              <li v-for="itemi in item.collapse ? item.list.slice(0,item.clamp):item.list" :key="itemi.name">
                <img :src="itemi.hand?itemi.hand:require('src/assets/images/mobile/cancer_committee/avatar.png')">
                <div class="info">
                  <div class="name ellipsis">{{ itemi.name }}
                    <span v-if="itemi.doctitle" class="ellipsis">{{ itemi.doctitle }}</span>
                  </div>
                  <div class="desc ellipsis">{{ item.type===0?itemi.hospital:(itemi.hospital_shortname||itemi.hospital) }}</div>
                </div>
                <a href="javascript:;" class="btn-link" @click="toDoctor(itemi, item.type < 3)" />
              </li>
            </ul>
            <p v-if="item.clamp && item.list.length > item.clamp" :class="{expand: !item.collapse}" class="load-more-arrow" @click="item.collapse = !item.collapse" />
          </div>
          <div v-else-if="item.type===3&&item.list&&item.list.length>0" :key="itemIdx" class="member-list avatar-hide">
            <div class="member-item-02">
              <div class="title">{{ item.title }}
                <span v-if="item.titleDesc">（{{ item.titleDesc }}）</span>
              </div>
              <ul :class="item.ulClass">
                <li v-for="itemi in (item.collapse ? item.list.slice(0, item.clamp) : item.list)" :key="itemi.name" @click="toDoctor(itemi, itemi.type < 3)">
                  <div class="info">
                    <p class="name">{{ itemi.name }}</p>
                    <p>{{ itemi.doctitle }}</p>
                    <p>{{ itemi.hospital }}</p>
                  </div>
                </li>
              </ul>
              <p v-if="item.clamp && item.list.length > item.clamp" :class="{expand: !item.collapse}" class="load-more-arrow" @click="item.collapse = !item.collapse" />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import authorityCsco from './authority_csco'
export default authorityCsco
</script>

<style lang="scss" scoped>
@import "./authority_csco.scss";
</style>
