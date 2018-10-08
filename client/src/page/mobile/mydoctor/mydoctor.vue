<template>
  <div v-cloak id="main" class="container">
    <div v-cloak id="mydoctor">
      <tmenu name="关注的人" @callback="tmenuCb" />
      <!--  <div class="searcher-box" id="searcher">
                <div class="searcher">
                    <div class="tab-list">
                        <i class="search-menu" @click="goBack"></i>
                        我的医生
                    </div>
                </div>
            </div> -->
      <div class="list">
        <div v-for="item in doctors" :key="item.name">
          <div class="border-bottom" />
          <div class="item">
            <img :src="item.hand || require('src/assets/images/mobile/mydoctor/avatar.png')" class="avatar">
            <div class="info">
              <div class="name">{{ item.name }}</div>
              <div>{{ item.op_vt_teachtitle && item.op_vt_teachtitle.length ? item.doctitle + ' | ' + item.op_vt_teachtitle.join('，') : item.doctitle }}</div>
              <div>{{ item.main_depart && item.hospital ? item.main_depart + '，' + item.hospital : (item.main_depart || item.hospital) }}</div>
            </div>
            <img :src="require('src/assets/images/mobile/mydoctor/arrow-right.png')" class="arrow-right">
            <a class="btn-link" @click="toDoctor(item.doctor_id)" />
          </div>
        </div>
      </div>
      <div v-if="!isShow" class="empty">您还没有关注的人</div>
    </div>
  </div>
</template>

<script>
import mydoctor from './mydoctor'
export default mydoctor
</script>

<style lang="scss" scoped>
@import "./mydoctor.scss";
</style>
