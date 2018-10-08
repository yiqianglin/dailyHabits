<template>
  <div v-cloak class="container">
    <div class="authority">
      <tmenu name="企鹅医典" @callback="tmenuCb" />
      <header>
        {{ title }}<br> {{ title_intro }}
      </header>
      <div v-if="organ_info&&organ_info.list&&organ_info.list.length" class="oversea">
        <div class="title">{{ organ_info.title }}</div>
        <div class="list-wrapper">
          <ul>
            <li v-for="(item,index) in organ_info.list" :key="item.hospital_id" :tourl="toHospital(item.hospital_id,index)" :ptag="'ydd_authority_hospitalx:'+(index+1)">
              <div class="institution">
                <img :src="item.op_bgpic">
                <div class="organ">
                  <div class="logo">
                    <!-- <img :src="item.op_logo"> -->
                  </div>
                  <div class="desc">
                    {{ item.title }}<br> {{ item.title_intro }}
                  </div>
                </div>
              </div>
              <div v-if="item.editor" class="editor">
                <div class="info">
                  <img v-if="item.editor.hand" :src="item.editor.hand">
                  <div class="name ellipsis">{{ item.editor.name }} | {{ item.editor.title }}</div>
                </div>
                <div class="desc">{{ item.editor.desc }}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="doctor_info&&doctor_info.list&&doctor_info.list.length" class="expert">
        <div class="title">{{ doctor_info.title }}
          <span tourl="/mobile/cancer_committee.html?type=1">查看更多</span>
        </div>
        <div class="title-desc">{{ doctor_info.title_intro }}</div>
        <div class="list-wrapper">
          <ul>
            <li v-for="(item,index) in doctor_info.list" :key="item.doctor_id" :tourl="'/mobile/doctor.html?doctor_id='+item.doctor_id" :ptag="'ydd_authority_expertsx:'+(index+1)">
              <div class="img">
                <img v-if="item.auth_hand" :src="item.auth_hand">
              </div>
              <div class="info">
                <p class="name">{{ item.name }}</p>
                <p v-if="item.op_vt_diseases_tag&&item.op_vt_diseases_tag.length" class="desc ellipsis">研究领域：{{ item.op_vt_diseases_tag.join('、') }}</p>
                <p class="hospital">{{ item.socialtitle }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div v-if="hospital_info&&hospital_info.list&&hospital_info.list.length" class="cooperation">
        <div class="title">{{ hospital_info.title }}</div>
        <div class="list-wrapper">
          <ul>
            <li v-for="(item,index) in hospital_info.list" :key="index">
              <div class="list">
                <div v-for="(itemi,indexi) in item" :key="itemi.hospital_id" :tourl="toHospital(itemi.hospital_id)" :ptag="'ydd_authority_hospitalx:'+(index*3+indexi+1)" class="item">
                  <img :src="itemi.op_logo">
                  <div class="info">
                    <p class="name ellipsis">{{ itemi.name }}</p>
                    <p class="desc ellipsis">{{ itemi.ename }}</p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="policy">
        <div class="title">内容政策</div>
        <div class="content">
          <p>企鹅医典由腾讯公司出品，面向公众提供科学、客观、值得信赖的医学资讯。</p>
          <p>我们努力让产品所提供的内容和相关服务符合业内最高的编辑和道德标准。</p>
          <p>本内容政策涵盖了企鹅医典所有数据、内容（包括视频、音频、图表、图片）。</p>
          <p>在任何情况下，我们力求引用数据的准确性和清晰性，并力求所有内容均建立在科学的基础上，遵循循证原则。</p>
        </div>
        <div class="more" @click="toPolicy">
          <span>原则和标准</span>
        </div>
      </div>
      <footer>联系方式：MedInfo@tencent.com</footer>
    </div>
  </div>
</template>

<script>
import authority from './authority'
export default authority
</script>

<style lang="scss" scoped>
@import "./authority.scss";
</style>
