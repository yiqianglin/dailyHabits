<template id="tpl_medicalrefer">
  <div class="medicalrefer" @click="hideTip($event)">
    <!--         <ul class="banner-list" v-if="activeList&&activeList.length>0">
    <li v-for="item in activeList">
        <a :href="item.h5url">
            <img :src="item.image">
        </a>
    </li>
</ul> -->
    <div v-if="activeList&&activeList.length>0" class="top-banner">
      <a href="javascript:void(0);" @click="toActive(activeList[0].h5url)">
        <img :src="activeList[0].image">
      </a>
    </div>
    <div class="item hospital">
      <div class="item-wrap">
        <div class="title">
          <span class="title-tip">就医信息</span>
          <i class="icon" @click="showTip($event,'hospital')"/>
          <!-- <span class="all" @click="toHospitalInfo">查看全部</span> -->
        </div>
        <div class="desc">此名单仅供参考，排名不分先后 </div>
        <ul v-if="hospitalList&&hospitalList.length>0" class="hospital-list">
          <li v-for="item in hospitalList" :key="item.name">
            <img :src="item.op_logo">
            <div class="detail">
              <div class="name"><span v-if="isThree(item.vt_typeinfo)" class="name-tag">三甲</span><span class="name-desc">{{ item.name }}</span></div>
              <div class="detail-desc">
                <p v-if="item.doctor_list&&item.doctor_list.length>0" class="doctor-info">{{ item.doctor_list.join('、') }}</p>
                <div class="address">{{ item.address }}</div>
                <!--   <div class="telephone" v-if="item.tel">{{item.tel}}</div> -->
              </div>
            </div>
            <a href="javascript:void(0);" class="btn-link margin28" @click="toHospital(item.hospital_id)"/>
          </li>
        </ul>
        <div class="bottom-more" @click="toHospitalInfo"><span>查看全部</span></div>
      </div>

    </div>
    <div v-if="recruitList&&recruitList.length>0" class="item recruit">
      <div class="item-wrap">
        <div class="title">
          <span class="title-tip">临床招募</span>
          <span class="statement" @click="showTip($event,'recruit')">声明</span>
          <!-- <span class="all" @click="toRecruit">查看全部</span> -->
        </div>
        <div class="desc">信息来源于国家药物临床试验登记与信息公示平台公示信息</div>
        <ul class="recruit-list">
          <li v-for="item in getTidArr(recruitList)" :key="item.title" class="recruit-item">
            <div class="recruit-title">{{ item.title }}</div>
            <ul v-if="item.op_keyword&&item.op_keyword.length>0">
              <li v-for="itemi in item.op_keyword" :key="itemi">{{ itemi }}</li>
            </ul>
            <a href="javascript:void(0);" class="btn-link margin28" @click="toArticle(item.docid)"/>
          </li>
        </ul>
        <div class="bottom-more" @click="toRecruit"><span>查看全部</span></div>
      </div>
    </div>
    <div v-if="helpList&&helpList.length>0" class="item help">
      <div class="item-wrap">
        <div class="title">
          <span class="title-tip">疾病帮助</span>
        </div>
        <div class="desc">公益性的疾病救治帮扶项目</div>
        <ul class="action-list">
          <li v-for="item in helpList" :key="item.title">
            <img :src="item.image">
            <div class="action-info">
              <p class="action-title">{{ item.title }}</p>
              <p class="action-desc">{{ item.desc }}</p>
            </div>
            <a href="javascript:void(0);" class="btn-link" @click="toActive(item.h5url,item.title)"/>
          </li>
        </ul>
        <div class="expect">敬请期待更多帮助 …</div>
      </div>
      <div v-show="iconTip.isShow" :style="{top:iconTip.top+'px',left:iconTip.left+'rem'}" class="icon-tip">{{ iconTip.tip }}</div>
    </div>
  </div>
</template>

<script>
import medicalrefer from './medicalrefer'
export default medicalrefer
</script>

<style lang="scss" src="./medicalrefer.scss" />
