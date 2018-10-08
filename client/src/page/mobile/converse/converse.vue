<template>
  <div v-cloak class="container">
    <div v-cloak id="main">
      <div class="session">
        <div class="row">
          <div class="left">
            <img :src="require('src/assets/images/mobile/converse/logo.png')" class="logo" alt="">
          </div>
        </div>
        <div v-for="(item, index) in session" :key="index">
          <div v-if="item.type == 'answer'" class="row" >
            <div class="left answer slideInLeft animated" v-html="item.content">
              <span v-html="item.content"/>
            </div>
          </div>

          <div v-if="item.type == 'ask'" class="row" >
            <div class="right ask slideInRight animated">
              <span v-html="item.content"/><i class="edit" @click="edit(index)"/>
            </div>
          </div>

          <div v-if="item.type == 'loading'" class="row" >
            <div class="left res-box">
              <div class="">
                <div class="head">关键词:{{ item.keywork }}</div>
                <div class="content">
                  <div class="loading">
                    <img :src="require('src/assets/images/mobile/converse/loading.gif')" alt="">
                    <p class="t1">正在努力搜索中 ...</p>
                    <p class="t2">可能: <span class="key">{{ item.num_relevant }}</span>&nbsp;&nbsp;&nbsp;过滤:{{ item.num_irrelevant }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="item.type == 'loaded'" class="row" >
            <div class="left res-box">
              <div class="">
                <div class="head">关键词:头晕，口腔溃疡，肚子疼</div>
                <div class="content">
                  <div class="result">
                    搜索出{{ item.num_relevant }}个相关结果<a href="javascript:;" class="btn-check">查看</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="item.type == 'reslist'" class="row" >
            <div class="left res-box">
              <div class="">
                <div class="head txt-center">搜到以下5条相关结果供参考</div>
                <div class="content">
                  <div class="item">
                    <span class="points">
                      <i class="active"/>
                      <i/>
                      <i/>
                      <i/>
                      <i/>
                    </span>
                    <div class="t1">急性上呼吸道感染</div>
                    <div class="t2">口腔溃疡，<span class="key">咽喉疼痛</span>，咳嗽，眼睛红</div>
                  </div>
                  <div class="item">
                    <span class="points">
                      <i class="active"/>
                      <i/>
                      <i/>
                      <i/>
                      <i/>
                    </span>
                    <div class="t1">急性上呼吸道感染</div>
                    <div class="t2 ">口腔溃疡，<span class="key">咽喉疼痛</span>，咳嗽，眼睛红</div>
                  </div>
                  <div class="item">
                    <span class="points">
                      <i class="active"/>
                      <i/>
                      <i/>
                      <i/>
                      <i/>
                    </span>
                    <div class="t1">急性上呼吸道感染</div>
                    <div class="t2">口腔溃疡，<span class="key">咽喉疼痛</span>，咳嗽，眼睛红</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        <!--<div class="row">-->
        <!--<div class="left answer">-->
        <!--欢迎体验差症状测试版，部分内容还在建设中，结果仅供参考-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="row">-->
        <!--<div class="left answer">-->
        <!--支持多选和输入你想搜的症状,点击“发送”开始搜索-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="row">-->
        <!--<div class="right ask">-->
        <!--头晕，口腔溃疡，肚子疼-->
        <!--<i class="edit"></i>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="row">-->
        <!--<div class="left res-box">-->
        <!--<div class="">-->
        <!--<div class="head">关键词:头晕，口腔溃疡，肚子疼</div>-->
        <!--<div class="content">-->
        <!--&lt;!&ndash;<div class="result">&ndash;&gt;-->
        <!--&lt;!&ndash;搜索出45个相关结果<a href="javascript:;" class="btn-check">查看</a>&ndash;&gt;-->
        <!--&lt;!&ndash;</div>&ndash;&gt;-->
        <!--<div class="loading">-->
        <!--<img  :src="require('src/assets/images/mobile/converse/loading.gif')" alt="">-->
        <!--<p class="t1">正在努力搜索中 ...</p>-->
        <!--<p class="t2">可能: <span class="key">14</span>&nbsp;&nbsp;&nbsp;过滤:96</p>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="row">-->
        <!--<div class="left res-box">-->
        <!--<div class="">-->
        <!--<div class="head">关键词:头晕，口腔溃疡，肚子疼</div>-->
        <!--<div class="content">-->
        <!--<div class="result">-->
        <!--搜索出45个相关结果<a href="javascript:;" class="btn-check">查看</a>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="row">-->
        <!--<div class="left res-box">-->
        <!--<div class="">-->
        <!--<div class="head txt-center">搜到以下5条相关结果供参考</div>-->
        <!--<div class="content">-->
        <!--<div class="item">-->
        <!--<span class="points">-->
        <!--<i class="active"></i>-->
        <!--<i></i>-->
        <!--<i></i>-->
        <!--<i></i>-->
        <!--<i></i>-->
        <!--</span>-->
        <!--<div class="t1">急性上呼吸道感染</div>-->
        <!--<div class="t2">口腔溃疡，<span class="key">咽喉疼痛</span>，咳嗽，眼睛红</div>-->
        <!--</div>-->
        <!--<div class="item">-->
        <!--<span class="points">-->
        <!--<i class="active"></i>-->
        <!--<i></i>-->
        <!--<i></i>-->
        <!--<i></i>-->
        <!--<i></i>-->
        <!--</span>-->
        <!--<div class="t1">急性上呼吸道感染</div>-->
        <!--<div class="t2 ">口腔溃疡，<span class="key">咽喉疼痛</span>，咳嗽，眼睛红</div>-->
        <!--</div>-->
        <!--<div class="item">-->
        <!--<span class="points">-->
        <!--<i class="active"></i>-->
        <!--<i></i>-->
        <!--<i></i>-->
        <!--<i></i>-->
        <!--<i></i>-->
        <!--</span>-->
        <!--<div class="t1">急性上呼吸道感染</div>-->
        <!--<div class="t2">口腔溃疡，<span class="key">咽喉疼痛</span>，咳嗽，眼睛红</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->
        <!--<div class="row">-->
        <!--<div class="left answer">-->
        <!--是否还有以下症状想补充？-->
        <!--</div>-->
        <!--</div>-->
      </div>
      <div v-show="isShowAskInput" class="input">
        <ul class="choose-tip">
          <template v-for="item in symptoms">
            <li :key="item" @click="topSytmClick(item)" v-html="setkey(item)"/>
            <!--<li v-html="item|key"><span class="key">头</span>痛</li>-->
          </template>
        </ul>
        <div class="inputer">
          <div class="textare">
            <textarea v-model="inputVal" @input="sytmInput"/>
          </div>
          <a href="javascript:;" class="btn-send" @click="sendSymptom">发送</a>
        </div>
      </div>
      <div class="mask hidden" style="display: none"/>
      <div class="res-layer hidden" style="display: none">
        <div class="">
          <div class="head txt-center">
            搜到以下45条相关结果供参考
            <a href="javascript:;" class="btn-close"/>
          </div>
          <div class="content">
            <div class="item">
              <span class="points">
                <i class="active"/>
                <i/>
                <i/>
                <i/>
                <i/>
              </span>
              <div class="t1">急性上呼吸道感染</div>
              <div class="t2">口腔溃疡，<span class="key">咽喉疼痛</span>，咳嗽，眼睛红</div>
            </div>
            <div class="item">
              <span class="points">
                <i class="active"/>
                <i/>
                <i/>
                <i/>
                <i/>
              </span>
              <div class="t1">急性上呼吸道感染</div>
              <div class="t2 ">口腔溃疡，<span class="key">咽喉疼痛</span>，咳嗽，眼睛红</div>
            </div>
            <div class="item">
              <span class="points">
                <i class="active"/>
                <i/>
                <i/>
                <i/>
                <i/>
              </span>
              <div class="t1">急性上呼吸道感染</div>
              <div class="t2">口腔溃疡，<span class="key">咽喉疼痛</span>，咳嗽，眼睛红</div>
            </div>
            <div class="item">
              <span class="points">
                <i class="active"/>
                <i/>
                <i/>
                <i/>
                <i/>
              </span>
              <div class="t1">急性上呼吸道感染</div>
              <div class="t2">口腔溃疡，<span class="key">咽喉疼痛</span>，咳嗽，眼睛红</div>
            </div>
            <div class="item">
              <span class="points">
                <i class="active"/>
                <i/>
                <i/>
                <i/>
                <i/>
              </span>
              <div class="t1">急性上呼吸道感染</div>
              <div class="t2">口腔溃疡，<span class="key">咽喉疼痛</span>，咳嗽，眼睛红</div>
            </div>
            <div class="item">
              <span class="points">
                <i class="active"/>
                <i/>
                <i/>
                <i/>
                <i/>
              </span>
              <div class="t1">急性上呼吸道感染</div>
              <div class="t2">口腔溃疡，<span class="key">咽喉疼痛</span>，咳嗽，眼睛红</div>
            </div>
          </div>
        </div>
      </div>
      <div v-show="isShowAskChoose" class="chooser">
        <p class="t1">请选择</p>
        <div class="sytms">
          <template v-for="(item, index) in rel_symptoms">
            <span :key="index" class="item">
              <input :id="'s'+index" v-model="chooseVal" :value="item" type="checkbox" name="symptom">
              <label :for="'s'+index" @click="chooseItemClick(false)">{{ item }}</label>
            </span>
          </template>
          <!--<span class="item">
                    <input type="checkbox" id="s2" name="symptom" value="1">
                    <label for="s2">头晕</label>
                </span>

                <span class="item">
                    <input type="checkbox" id="s3" name="symptom" value="1">
                    <label for="s3">咽喉疼</label>
                </span>

                <span class="item">
                    <input  type="checkbox" id="s4" name="symptom" value="1">
                    <label for="s4">口腔溃烂</label>
                </span>

                <span class="item">
                    <input type="checkbox" id="s5" name="symptom" value="1">
                    <label for="s5">看不清东西</label>
                </span>-->
          <span class="item">
            <input id="s_not" type="checkbox" value="没有这些症状">
            <label for="s_not" @click="chooseItemClick(true)">没有这些症状</label>
          </span>
        </div>
        <a href="javascript:;" class="btn-send" @click="chooserClick">发 送</a>
      </div>
    </div>
  </div>
</template>

<script>
import converse from './converse'
export default converse
</script>

<style lang="scss" scoped>
  @import './converse.scss'
</style>
