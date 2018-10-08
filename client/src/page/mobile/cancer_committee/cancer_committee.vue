<template>
  <div v-cloak id="main" class="container">
    <tmenu :name="type===1?'企鹅医典专家委员会':name + '编审委员会'" :stag="name" @callback="tmenuCb" />
    <div v-if="type===1" class="auth-header">
      企鹅医典专家委员会
    </div>
    <div v-else class="committee-header">
      <p>
        <span class="name">{{ name?name+'编审委员会':'肿瘤编委会' }}</span>
      </p>
    </div>
    <div v-if="type!==1&&webmdNum>0" :tourl="'/mobile/authority_wm.html'+(name?'?name='+name:'')" class="webmd">
      <div class="title">合作组织</div>
      <div v-if="name" class="desc">
        全球领先的医学科普网站独家授权，精选 {{ webmdNum }} 篇 {{ name }} 专业文章
      </div>
      <div v-else class="desc">
        全球领先的医疗科普网站独家授权，已覆盖 {{ webmdDisease }} 个疾病 {{ webmdNum }} 篇专业文章
      </div>
    </div>
    <div v-if="name" class="committee-members">
      <div v-for="member in members" v-if="member.list && member.list.length" :key="member.title" class="committee-member">
        <div class="member-title">{{ member.title }}
          <span v-if="name!=='肺癌'&&member.titleDesc">（{{ member.titleDesc }}）</span>
        </div>
        <div v-if="member.style === 0" class="member-list avatar-large">
          <div v-for="item in (member.collapse ? member.list.slice(0, member.clamp) : member.list)" :key="item.name" class="member-item" @click="toDoctor(item, member.type < 3)">
            <img :src="item.hand?item.hand:require('src/assets/images/mobile/cancer_committee/avatar.png')" class="avatar">
            <div class="info">
              <p class="name">
                <span>{{ item.name }}</span>
                <span>{{ item.doctitle + (item.doctor_id===10501?' 教授 博士生导师':'') }}</span>
              </p>
              <p>{{ item.hospital }}</p>
            </div>
          </div>
        </div>
        <div v-else-if="member.style === 1" class="member-list avatar-small">
          <div v-for="item in (member.collapse ? member.list.slice(0, member.clamp) : member.list)" :key="item.name" class="member-item" @click="toDoctor(item, member.type < 3)">
            <img :src="item.hand?item.hand:require('src/assets/images/mobile/cancer_committee/avatar.png')" class="avatar">
            <div class="info">
              <p class="name">{{ item.name }}</p>
              <p>{{ item.doctitle }}</p>
              <p>{{ item.hospital }}</p>
            </div>
          </div>
        </div>
        <div v-else-if="member.style === 2" class="member-list avatar-hide">
          <div v-for="item in (member.collapse ? member.list.slice(0, member.clamp) : member.list)" :key="item.name" class="member-item" @click="toDoctor(item, member.type < 3)">
            <div class="info">
              <p class="name">{{ item.name }}</p>
              <p>{{ item.doctitle }}</p>
              <p>{{ item.hospital }}</p>
            </div>
          </div>
        </div>
        <p v-if="member.clamp && member.list.length > member.clamp" :class="{expand: !member.collapse}" class="load-more-arrow" @click="member.collapse = !member.collapse" />
      </div>
    </div>
    <div v-else class="cancer-members">
      <template v-for="(item, itemIdx) in members">
        <div v-if="item.type!==3&&item.list&&item.list.length>0" :key="itemIdx" class="member-item">
          <div class="title">{{ item.title }}</div>
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
        <div v-else-if="item.type===3&&item.list&&item.list.length>0" :key="itemIdx" class="committee-wrap">
          <div v-for="(value,key) in item.diseaseObj" :key="key" class="member-item cancer-committee">
            <div class="title">
              <span class="title-name">{{ key }}编委
                <span class="num">（{{ value.length }}）</span>
              </span>
              <span class="detail" @click="toCancer(key)">详情</span>
              <i class="arrow" @click="toCancer(key)" />
            </div>
            <ul class="editor-member">
              <li v-for="itemi in value.slice(0,3)" :key="itemi.name">
                <div class="info">
                  <div class="name ellipsis">{{ itemi.name }}
                    <span v-if="itemi.doctitle" class="ellipsis">{{ itemi.doctitle }}</span>
                  </div>
                  <div class="desc ellipsis">{{ itemi.hospital_shortname||itemi.hospital }}</div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import cancerCommittee from './cancer_committee'
export default cancerCommittee
</script>

<style lang="scss" scoped>
@import "./cancer_committee.scss";
</style>
