<template id="tpl_player">
  <div class="player-container">
    <div v-show="mode === 1 && fixed" class="mask" @click="closeFull"/>
    <div v-show="mode === 0" :class="{fixed: fixed}" class="player-container-mini">
      <div class="player-ctrl-button">
        <span :class="play ? 'pause' : 'play'" :ptag="play ? 'ydd_audiodoc_pause' : 'ydd_audiodoc_play'" @click="togglePlay"/>
        <span v-show="!play" class="close" ptag="ydd_audiodoc_stop" @click="closeMini"/>
        <span v-show="play" class="arrow-up" ptag="ydd_audiodoc_more" @click="showFull"/>
      </div>
    </div>
    <div v-show="mode === 1" :class="{fixed: fixed}" class="player-container-full">
      <div class="player-controller">
        <div class="player-ctrl-button">
          <span class="arrow-down" ptag="ydd_audiodoc_close" @click="closeFull"/>
        </div>
        <!-- <div class="player-hint-title">
          <p class="title">{{title}}</p>
          <p class="sub-title">{{subTitle}}</p>
        </div> -->
        <div class="player-ctrl-bar">
          <!-- 数据缓冲进度 -->
          <div class="player-bar-progress">
            <span v-for="(item, index) in progress" :key="index" :style="item.style" class="bar-progress-item"/>
          </div>
          <!-- 音频播放进度 -->
          <div class="player-bar-time">
            <vue-slider :show="mode === 1" v-model="currentTime" v-bind="sliderOps" @drag-start="dragCtrl" @callback="updateFromCtrl"/>
          </div>
        </div>
        <div class="player-hint-time">
          <span>{{ currentTime | formatTime }}</span>
          <span>{{ maxTime | formatTime }}</span>
        </div>
        <div class="player-ctrl-button">
          <span class="prev" ptag="ydd_audiodoc_back"/>
          <span :class="play ? 'pause' : 'play'" :ptag="play ? 'ydd_audiodoc_pause' : 'ydd_audiodoc_play'" @click="togglePlay"/>
          <span class="next" ptag="ydd_audiodoc_next"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import player from './player'
export default player
</script>

<style lang="scss" src="./player.scss" />
