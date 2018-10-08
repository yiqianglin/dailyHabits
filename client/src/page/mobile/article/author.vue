<template>
  <div class="author">
    <div v-if="author.doctors && author.doctors.length === 1" :class="{expert: author.doctors[0].weight === 2}" class="doctor-single">
      <img v-if="author.doctors[0].icon" :src="author.doctors[0].icon" class="avatar">
      <div class="info">
        <p class="ellipsis">
          <span class="name">{{ author.doctors[0].name }}</span>{{ author.doctors[0].department + author.doctors[0].position | connectDivider(' | ', author.doctors[0].hospital) }}
        </p>
        <p>
          <span v-if="author.doctors[0].sole" class="flag-sole">特约作者</span>
          <span v-if="releaseTime" class="release-time">更新于{{ releaseTime.substr(0, 10) }}</span>
        </p>
      </div>
      <a v-if="author.doctors[0].doctor_clickable && !(from === 'tanyi')" class="btn-link" @click="toDoctor(author.doctors[0])" />
    </div>
    <ul v-else-if="author.doctors && author.doctors.length > 1">
      <li v-for="(item,index) in author.doctors" :key="index" class="doctor-multi" @click="toDoctor(item)">
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span class="ellipsis"> {{ item.department + item.position | connectDivider(' | ', item.hospital) }} </span>
          <span v-if="articleSrc !== 'szph' && item.sole" class="flag-sole">特约作者</span>
        </div>
        <a v-if="author.doctors[0].doctor_clickable && !(from === 'tanyi')" class="btn-link" @click="toDoctor(item)" />
      </li>
      <li>
        <span v-if="releaseTime" class="release-time">更新于 {{ releaseTime.substr(0, 10) }}</span>
      </li>
    </ul>
    <div v-else-if="author.hospital" :class="{webmd: author.hospital.hpid === 1000}" class="hospital">
      <img v-if="author.hospital.icon" :src="author.hospital.icon" class="avatar">
      <div class="info">
        <div>
          <span class="name">{{ author.hospital.name }}</span>
        </div>
        <div>
          <span v-if="author.hospital.desc">{{ author.hospital.desc }}</span>
          <span v-else-if="releaseTime">更新于 {{ releaseTime.substr(0, 10) }}</span>
          <span v-else>提供</span>
        </div>
      </div>
      <a v-if="author.hospital.clickable" class="btn-link" @click="toHospital(author.hospital)" />
    </div>
  </div>
</template>

<script>
/* global baike */
import filters from 'src/js/filters'
export default {
  filters: {
    connectDivider: filters.connectDivider
  },
  props: {
    author: {
      type: Object,
      default () { return {} }
    },
    releaseTime: {type: String, default: ''},
    articleSrc: {type: String, default: ''},
    from: {type: String, default: ''}
  },
  data () {
    return {
    }
  },
  methods: {
    toDoctor (doctor) {
      if (doctor.doctor_clickable) {
        baike.goToUrl('/mobile/doctor.html?doctor_id=' + doctor.drid + '&ptag=ydd_content_doctorname')
      }
    },
    toHospital ({url, clickable, hpid}) {
      url = url || (clickable ? `/mobile/hospital.html?hospital_id=${hpid}&ptag=ydd_content_hospital` : '')
      if (url) {
        baike.goToUrl(url)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~src/assets/style/common-util";
li {
  list-style-type: none;
}

.author {
  overflow: hidden;
}

.flag-sole {
  border-radius: 0.04rem;
  background: #ffb83a;
  padding: 0.04rem 0.1rem;
  color: #fff;
  font-size: 0.2rem;
  line-height: 0.3rem;
  font-weight: $font-medium;
}

.release-time {
  font-size: 0.22rem;
  color: #b8bfc4;
}

.doctor-single,
.hospital {
  position: relative;
  display: flex;
  font-size: 0.24rem;
  color: #b8bfc4;
  .avatar {
    width: 0.76rem;
    height: 0.76rem;
    border-radius: 50%;
    margin-right: 0.12rem;
  }
  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    .name {
      color: #0d0d0f;
      margin-right: 0.1rem;
    }
    .flag-sole {
      margin-right: 0.1rem;
    }
  }
}

.expert {
  .info::after {
    content: " ";
    position: absolute;
    bottom: 0;
    left: -0.45rem;
    width: 0.36rem;
    height: 0.36rem;
    background: url(~src/assets/images/mobile/doctor/expert.png) no-repeat
      center;
    background-size: contain;
  }
}

.doctor-multi {
  position: relative;
  font-size: 0.24rem;
  color: #b8bfc4;
  .info {
    max-width: 100%;
    display: inline-flex;
    line-height: 0.4rem;
    .name {
      color: #0d0d0f;
    }
    .ellipsis {
      flex: 1;
      margin: 0 0.1rem;
    }
    .flag-sole {
      width: 1rem;
    }
  }
}
</style>
