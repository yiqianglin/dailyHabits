<template>
  <div v-cloak class="container">
    <div v-cloak id="depression_test" class="depression-test">
      <div class="slider-wrap">
        <div v-if="questionLen>0" :style="{transform:'translateX(-'+curIndex*100+'%)'}" class="slider">
          <div v-for="(item,index) in questions" :key="index" :style="{height:pageHeight+'px',left:index>0?(index*100+'%'):0}" class="question">
            <div class="title">
              <span class="num">{{ (index+1+'/'+questionLen) }}</span>{{ item.title }}
            </div>
            <div class="subtitle">{{ item.subtitle }}</div>
            <ul class="options">
              <li v-for="(itemi,indexi) in item.choice" :key="indexi" @click="setChoice(indexi,index)">
                <input :name="'option'+index" :value="answer[indexi]" v-model="item.answer" type="radio">
                <label :for="'option'+index">
                  <div class="option-text">
                    {{ answer[indexi]+'. '+itemi }}
                    <a href="javascript:;" class="btn-link"/>
                  </div>
                </label>
              </li>
            </ul>
            <div class="question-src">本抑郁量表【PHQ-9】由美国精神疾病诊断与统计手册的9条症状学标准发展而来。中华医学会神经病学分会推荐用于综合医院的抑郁快速筛查和评估。</div>
          </div>
          <div id="result" :style="{left:questionLen*100+'%',height:pageHeight+'px'}" class="result">
            <div :class="['index',result.className]">
              <p class="title">抑郁指数</p>
              <p class="desc">{{ result.desc||'' }}</p>
              <p class="info">{{ result.info||'' }}</p>
            </div>
            <div class="definition">
              <div class="def-title">
                什么是抑郁指数：
              </div>
              <p class="def-desc">抑郁指数能帮助您判断自身情况，发现潜在的抑郁症症状，以及评估症状的严重程度。尽管不能替代医生专业的诊断，但可以提示您关注自己的心理健康状况，以及是否应寻求专业人士的帮助。</p>
              <div class="def-title mtp5">
                抑郁指数不代表抑郁症程度：
              </div>
              <p class="def-desc">抑郁指数不是抑郁症的严重程度，不能做诊断用。评分较高并一定不意味着患有抑郁症，评分较低也不一定意味着没有患病指数。抑郁症是一种让人感到悲伤或无趣的情绪障碍疾病。</p>
              <span class="def-know" @click="knowDepression()">了解抑郁症</span>
            </div>
            <div class="definition basis">
              <div class="def-title">
                评估依据：
              </div>
              <p class="def-desc">本评估依据国际通用的患者健康问卷抑郁量表<a href="javascript:void(0)" title="PHQ-9">【PHQ-9】</a>，此量表由美国精神疾病诊断与统计手册（DSM-IV）的9条症状学标准发展而来，经过信效度验证，已在国内外临床实验中常规使用。中华医学会神经病学分会推荐将PHQ-9量表用于综合医院的抑郁快速筛查和评估。</p>
            </div>
            <div class="qrcode-container"><img :src="require('src/assets/images/mobile/ddetail/qrcode.png')"
                                               alt="" class="qrcode"></div>
            <p class="source">
              本问卷由 Robert L. Spitzer博士、Janet B.W. Williams博士、Kurt Kroenke博士及同事用辉瑞公司提供的教育基金设计。
            </p>
          </div>
        </div>
      </div>
      <div class="btns">
        <button v-show="curIndex>0" :class="{'result-btn':curIndex===questionLen}" class="btn" @click="preClk()">{{ curIndex===questionLen?'分享工具':'上一题' }}
          <a href="javascript:;" class="btn-link"/>
        </button>
        <button :class="{active:curIndex<questionLen-1,'result-btn':curIndex===questionLen||curIndex===questionLen-1}" class="btn" @click="nextClk()">{{ curIndex>=(questionLen-1)?(curIndex===questionLen-1?'完成测试':'重新开始'):'下一题' }}
          <a href="javascript:;" class="btn-link"/>
        </button>
      </div>
      <div :class="{show:shareShow}" class="share" @click="hideShare()">
        <div :class="isXcx?'xcx':''" class="share-img">
          <img src="https://s.pc.qq.com/tdf/baike/share-icon.png">
        </div>
        <div class="share-desc">分享出去帮助更多人吧！</div>
      </div>
      <annotation :setannotation="setannotation" :rkeys="{clicked:'ydd_tools_phq9'}"
                  dom=""/>
      <div :class="{show:popup.show}" class="popup" @click="hidePopup">
        <div class="popup-content">
          <div v-if="popup.isTip" class="popup-desc">您需要选择一个结果后才能进行下一题</div>
          <template v-else>
            <div class="popup-desc line">
              {{ popup.title }}：<br>
              {{ popup.desc }}
            </div>
            <div class="popup-btn" @click="popupKnow()">知道了</div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import depressionTest from './depression_test'
export default depressionTest
</script>

<style lang="scss" scoped>
  @import './depression_test.scss'
</style>
