<template>
  <div v-cloak class="container">
    <tmenu name="医生主页" @callback="tmenuCb" />
    <loading :show="!isShow"/>
    <div v-show="isShow" id="doctor" :style="{padding:specialDoctor?'.28rem':''}">
      <div v-if="specialDoctor||cancerDoctor" class="expert-cancer">
        <div class="profile">
          <div class="name">{{ name }}
            <span>{{ doctitle+(op_vt_teachtitle&&op_vt_teachtitle[0]?(op_vt_teachtitle[0].indexOf('副教授')>-1?' 副教授':(op_vt_teachtitle[0].indexOf('教授')>-1?' 教授':'')):'') }}</span>
          </div>
          <div class="hospital" @click="toHospital(hospital_id)">{{ (hospital_name.length>16?(hospital_shortname||hospital_name):hospital_name).substr(0,16) }}
            <i v-if="hospital_clickable===1" class="arrow" />
          </div>
          <div class="more">
            <div v-if="cancerDoctor&&(!isFromSearch || (isFromSearch && !inDoctorSearchBlackListFlag))" class="cancer">企鹅医典肿瘤编审委员会委员</div>
            <div v-else-if="editordiseases&&editordiseases.length>0&&(!isFromSearch || (isFromSearch && !inDoctorSearchBlackListFlag))" class="cancer" @click="toCancer()">{{ (editordiseases.length===1?'企鹅医典':'')+editordiseases.join('、')+'编审委员会委员' }}</div>
            <div :class="{followed: follow}" class="follow" ptag="docpage_fol" @click="fClick">{{ follow == 1 ? '已关注' : '＋关注' }}</div>
          </div>
          <img v-if="auth_hand" :src="auth_hand" class="hand">
        </div>
        <div :style="{paddingBottom:v_md_introd && op_md_introd?0:''}" class="info-list">
          <div v-if="depart&&depart.length>0" class="item">
            <div class="title">所属科室</div>
            <ul class="department-list">
              <li v-if="main_depart" :key="main_depart" class="unclickable">{{ main_depart }}</li>
              <li v-for="item in depart" :key="item.name" :class="{unclickable:item.clickable!==1}" @click="toDepart(item)">{{ item.name }}</li>
            </ul>
          </div>
          <div v-if="op_vt_diseases_tag&&op_vt_diseases_tag.length>0" class="item">
            <div class="title">擅长领域</div>
            <p class="field">{{ op_vt_diseases_tag.join(' ') }}</p>
          </div>
          <div v-if="v_md_moretitle" class="item">
            <div class="title">专业资质</div>
            <div :class="{collapse:!introExpanded}" class="qualification md" v-html="v_md_moretitle" />
          </div>
          <template v-if="v_md_introd">
            <div v-show="introExpanded" class="item">
              <div class="title">个人简介</div>
              <div class="self-intro md" v-html="v_md_introd" />
            </div>
          </template>
          <div v-if="v_md_introd && op_md_introd" :ptag="introExpanded ? 'ydd_dochome_foldintro' : 'ydd_dochome_expintro'" class="footer" @click="introClick">
            <img :src="introExpanded ? require('src/assets/images/mobile/doctor/arrow-up.png') : require('src/assets/images/mobile/doctor/arrow-down.png')" class="arrow">
            <a class="btn-link" />
          </div>
        </div>
      </div>
      <div v-else-if="weight == 2" class="expert">
        <div class="profile">
          <div class="personal">
            <!-- <img class="share" :src="require('src/assets/images/mobile/common/share.png')" /> -->
            <span class="avatar">
              <img :src="hand || require('src/assets/images/mobile/mydoctor/avatar.png')">
            </span>
            <p class="name">{{ name }}</p>
            <p class="title">{{ op_vt_teachtitle.length ? doctitle + ' | ' + op_vt_teachtitle.join('，') : doctitle }}</p>
            <p class="hospital">
              {{ main_depart }}
              <span class="circle" />
              <span :class="{active: hospital_id}" @click="toHospital(hospital_id)">{{ hospital_name }}<img v-if="hospital_id" :src="require('src/assets/images/mobile/doctor/green-arrow.png')"></span>
            </p>
            <p v-if="doctorself" class="fans-pv">粉丝数
              <span class="count">{{ followingnum }}</span>浏览数
              <span class="count">{{ pv }}</span>
            </p>
            <div v-else :class="['follow', {followed: follow}]" @click="fClick">{{ follow == 1 ? '已关注' : '＋关注' }}</div>
          </div>
          <div v-if="op_vt_diseases_tag.length" class="forte">
            <span class="fix-text">擅长:</span>
            <template v-for="item in op_vt_diseases_tag">
              <span :key="item" class="tag-text">{{ item }}</span>
            </template>
          </div>
          <div v-if="v_md_moretitle" class="qualifications">
            <div class="header">专业资历</div>
            <div class="content md" v-html="v_md_moretitle" />
          </div>
          <div v-if="op_clinictimepic" class="officeTime">
            <div class="header">坐诊时间</div>
            <img :src="op_clinictimepic" class="item">
            <!-- <div class="list">
                            <img v-for="item in op_clinictimepic" :src="item" class="item" />
                        </div> -->
          </div>
          <div v-if="v_md_introd" :class="introExpanded ? '' : 'collapse'" class="introductions">
            <div class="header">个人简介</div>
            <div class="content md" v-html="v_md_introd" />
          </div>
          <div v-if="v_md_introd && op_md_introd.length > 63" :ptag="introExpanded ? 'ydd_dochome_foldintro' : 'ydd_dochome_expintro'" class="footer" @click="introClick">
            <img :src="introExpanded ? require('src/assets/images/mobile/doctor/arrow-up.png') : require('src/assets/images/mobile/doctor/arrow-down.png')" class="arrow">
            <a class="btn-link" />
          </div>
        </div>
      </div>
      <div v-else class="normal">
        <div class="profile">
          <div class="personal">
            <img :src="hand || require('src/assets/images/mobile/mydoctor/avatar.png')" class="avatar">
            <div class="info">
              <div class="name-depart">
                <span class="name">{{ name }}</span> {{ main_depart }}
              </div>
              <div :class="follow ? 'follow followed' : 'follow'" :ptag="follow ? 'ydd_dochome_followcancel' : 'ydd_dochome_follow'" @click="fClick">{{ follow == 1 ? '已关注' : '＋关注' }}</div>
              <div class="title">
                {{ op_vt_teachtitle.length ? doctitle + ' | ' + op_vt_teachtitle.join('，') : doctitle }}
              </div>
              <div @click="toHospital(hospital_id)">
                <span class="hospital">
                  {{ hospital_name }}
                  <img v-if="hospital_id" :src="require('src/assets/images/mobile/doctor/arrow-right.png')">
                </span>
              </div>
            </div>
          </div>
          <div v-if="diseases_desc" class="forte">
            <!-- <span class="fix-text">擅长:</span>v-if="op_vt_diseases_tag.length" -->
            <!--  <template v-for="item in op_vt_diseases_tag">
                            <span class="tag-text">{{item}}</span>
                        </template> -->
            {{ diseases_desc }}
          </div>
          <div v-if="v_md_moretitle" class="qualifications">
            <div class="header">
              <img :src="require('src/assets/images/mobile/doctor/qualification.png')"> 专业资历
            </div>
            <div class="content md" v-html="v_md_moretitle" />
          </div>
          <div v-if="op_clinictimepic" class="officeTime">
            <div class="header">
              <img :src="require('src/assets/images/mobile/doctor/officetime.png')"> 坐诊时间
            </div>
            <img :src="op_clinictimepic" class="item">
            <!-- <div class="list">
                            <img v-for="item in op_clinictimepic" :src="item" class="item" />
                        </div> -->
          </div>
          <div v-if="v_md_introd" :class="introExpanded ? '' : 'collapse'" class="introductions">
            <div class="header">
              <img :src="require('src/assets/images/mobile/doctor/introduction.png')"> 个人简介
            </div>
            <div class="content md" v-html="v_md_introd" />
          </div>
          <div v-if="v_md_introd && op_md_introd.length > 63" :ptag="introExpanded ? 'ydd_dochome_foldintro' : 'ydd_dochome_expintro'" class="footer" @click="introClick">
            {{ introExpanded ? '点击收起' : '点击展开' }}
            <img :src="introExpanded ? require('src/assets/images/mobile/doctor/arrow-up.png') : require('src/assets/images/mobile/doctor/arrow-down.png')" class="arrow">
            <a class="btn-link" />
          </div>
        </div>
      </div>
      <div class="related-info">
        <div v-if="extraDiseases && extraDiseases.length" class="diseases-related">
          <div class="header">相关疾病</div>
          <div class="diseases">
            <div v-for="(item) in extraDiseases" :key="item.name" class="disease" @click="toOverview(item.name, item.type)">
              <p class="name ellipsis">{{ item.name }}</p>
              <p class="desc ellipsis">{{ item.summary }}</p>
            </div>
          </div>
        </div>
        <template v-if="docByTabs && docByTabs.length">
          <div v-if="specialDoctor" :class="{fixed: fixTab, withSearcher: searcherShow}" class="doctab-list">
            <div v-for="(tab, index) in docByTabs" :key="tab.title" :class="{active: curTab == index}" :ptag="'docpage_tabclick:'+tab.title" class="tab" @click="clickDocTab(index, true)">{{ tab.title }}</div>
          </div>
          <div v-else :class="{fixed: fixTab, withSearcher: searcherShow}" class="docTabs">
            <template v-for="(tab, index) in docByTabs">
              <div :key="tab.title" :class="{active: curTab == index}" :ptag="index === 1 ? 'ydd_dochome_tagrecommand_clk' : index === 2 ? 'ydd_dochome_tagoriginal_clk' : ''" class="tab" @click="clickDocTab(index, true)">{{ tab.title }}</div>
            </template>
          </div>
          <div :style="{paddingTop:fixTab?(specialDoctor?'.96rem':'1.12rem'):''}" class="doclist">
            <paper :paperlist="curDocs" :doctorid="doctorId" :rkey="{article: specialDoctor?'docpage_articleclick':'ydd_dochome_articalx'}" :loaded="curLoaded" />
          </div>
        </template>
      </div>
      <div v-if="showCheckDoctorExpressway && isFromSearch" class="checkDoctorExpressway">
        一键问医生
        <a :href="expresswayUrl" class="btn-link" />
      </div>
    </div>
  </div>
</template>

<script>
import doctor from './doctor'
export default doctor
</script>

<style lang="scss" scoped>
@import "./doctor.scss";
</style>
