<!-- 本页面若不带docid参数将被nginx重定向至enter.html-->
<template>
  <div v-cloak id="article" class="container">
    <tmenu :name="tname" :zindex="100" :stag="name" @callback="tmenuCb">
      <template slot="title">
        <span v-if="showDiseaseEntry" @click="toOverview(docDisease.name, docDisease.type, docDisease.released, 'YDD_Details_NavbarDisease')">
          <span class="disease-entry-title">{{ docDisease.name }}</span><br>
          <span v-if="docnum" class="disease-entry-count">{{ docnum + '篇文章 >' }}</span>
        </span>
        <span v-else>{{ title || tidName }}</span>
      </template>
    </tmenu>
    <loading :show="!show" />
    <template v-show="show">
      <div v-if="tid === 6" class="tpl tpl-6">
        <div v-if="info_type" :class="{'has-show': info_type_has_show}" class="type-info-notice">
          <div v-if="info_type === 2" class="frontier">以下内容涉及本领域前沿进展，有不确定性并会动态更新。不能代替专业的诊疗意见，具体决策请遵医嘱。</div>
          <div v-if="info_type === 1" class="deep">以下内容涉及临床决策等专业知识，由医学专家根据现行临床指南和专家共识撰写，不能代替专业的诊疗意见，具体决策请遵医嘱。</div>
          <span class="close-btn" @click="closeTypeInfoNotice" />
        </div>
        <div :class="{'has-notice': info_type && !info_type_has_show}" class="header">
          <div v-if="articleSrc !== 'recruit' && sourceid != null && copyright_head" class="article-source">
            <span v-if="sourceid == 2" class="authorized webmd-authorized">{{ copyright_head }}</span>
            <span v-else-if="sourceid == 1 || sourceid == 3" class="authorized hos-authorized">{{ copyright_head }}</span>
            <span v-else-if="sourceid == 0 || sourceid == 4 || sourceid == 5" class="authorized doc-authorized">{{ copyright_head }}</span>
          </div>
          <div class="title">{{ title }}</div>
          <div v-if="articleSrc==='recruit'" class="src-recruit">声明：发布相关信息的临床试验登记和公示并非是对所持临床批件是否有效的承认和确认，本平台无法确认其批件有效性。以下信息（入组条件、信息）需要根据具体医院/科室实际情况为准。</div>
          <template v-else-if="articleSrc!=='szph'">
            <!--临床招募-->
            <div v-if="showRecruitInfo" class="recruit-detail">
              <p class="recruit-disease">
                <span class="label">试验对象:</span>
                <span class="info">{{ formatRecruitDisease }}</span>
              </p>
              <p class="recruit-investigator">
                <span class="label">主要研究者:</span>
                <span class="info">{{ formatRecruitInvestigator }}</span>
              </p>
              <p class="recruit-area">
                <span class="label">试验地点:</span>
                <span class="info">{{ formatRecruitArea }}</span>
              </p>
            </div>
            <author v-else :author="author" :release-time="releasetime" :article-src="articleSrc" :from="from" />
          </template>
        </div>
        <div v-if="showRecruitInfo" class="recruit-remark">
          <span class="doc" />
          <span>声明：以下信息需要根据具体医院/科室实际情况为准</span>
          <span class="recruit-icon" />
        </div>
        <div class="content" @click="showActionbar">
          <div v-if="articleSrc!=='szph'&&op_text" class="article-src">本文由{{ op_text }}并推荐阅读</div>
          <div class="md" v-html="v_md_text" />
        </div>
      </div>
      <div v-if="tid === 17" class="tpl tpl-17">
        <div class="video-wrapper">
          <div v-if="isAutoPlay" id="video" :class="{fixed: videoFixed}" :style="{backgroundImage:image?('url('+image+')'):''}" class="video" />
          <div v-if="!isAutoPlay" :class="{fixed: videoFixed}" :style="{backgroundImage:image?('url('+image+')'):''}" class="net-tip">
            <div class="desc" @click="play">{{ isAutoPlayText }}
              <span>{{ size | formatSize }}M</span>
            </div>
          </div>
          <div v-if="curVideoStatus === 2 && extraVideo.length" class="video-ending">
            <p class="video-title-next">{{ endingMiddleVideo && endingMiddleVideo.title }}</p>
            <!--箭头底下内容-->
            <div :style="{transform: `translate3d(${endingTranslate}, 0, 0)`}" class="video-item-list">
              <template v-for="(item, index) in extraVideo">
                <div v-if="index === (endingMiddleVideoIndex >= extraVideo.length ? (endingMiddleVideoIndex - 3) : (endingMiddleVideoIndex - 2))" :key="item.docid" :style="{backgroundImage:item.image?('url('+item.image+')'):''}" class="video-item video-item-prev video-item-prev-2" />
                <div v-else-if="index === (endingMiddleVideoIndex >= extraVideo.length ? (endingMiddleVideoIndex - 2) : (endingMiddleVideoIndex - 1))" :key="item.docid" :style="{backgroundImage:item.image?('url('+item.image+')'):''}" class="video-item video-item-prev video-item-prev-1" />
                <div v-else-if="index === (endingMiddleVideoIndex >= extraVideo.length ? (endingMiddleVideoIndex - 1) : endingMiddleVideoIndex)" :key="item.docid" :style="{backgroundImage:item.image?('url('+item.image+')'):''}" class="video-item video-item-cur" />
                <div v-else-if="index === endingMiddleVideoIndex + 1" :key="item.docid" :style="{backgroundImage:item.image?('url('+item.image+')'):''}" class="video-item video-item-next video-item-prev-1" />
                <div v-else-if="index === endingMiddleVideoIndex + 2" :key="item.docid" :style="{backgroundImage:item.image?('url('+item.image+')'):''}" class="video-item video-item-next video-item-prev-2" />
                <div v-else :key="item.docid" :style="{backgroundImage:item.image?('url('+item.image+')'):''}" class="video-item other" />
              </template>
            </div>
            <!--箭头-->
            <div class="icon-wrp">
              <div class="icon-inner-wrp">
                <div :class="{'unvisiable': endingMiddleVideoIndex === 0}" class="video-item video-item-prev" @click="endingIconClick(0)" />
                <div class="video-item video-item-cur">
                  <div class="inner" @click="endingPlayClick">
                    <div v-if="continueInterval" class="circle-progress-outter-wrp">
                      <circle-progress :width="convertRemToPixels(1.36)" :stroke-width="convertRemToPixels(0.05)" :bg-color="'rgba(255,255,255,0)'" :progress-color="'#fff'" :progress="progress" />
                    </div>
                    <span class="play-icon" />
                    <p v-if="continueInterval" class="time-counter">{{ videoContinueCountdown }}s后即将播放</p>
                  </div>
                </div>
                <div :class="{'unvisiable': endingMiddleVideoIndex >= extraVideo.length - 1}" class="video-item video-item-next" @click="endingIconClick(1)" />
              </div>
            </div>
          </div>
        </div>
        <div class="title title-top">
          <p class="three-clamp">{{ title }}</p>
          <div v-if="extraVideo&&extraVideo.length" class="video-relate">相关视频
            <span v-if="isNewVideoCategory!==null" :tourl="videoCompilationTopic">{{ isNewVideoCategory ? `${disease ? disease : name}视频合集` : `${name}名家之声视频合集` }}</span>
          </div>
          <!-- <div class="t2 md" @click="showActionbar" v-html="v_md_text" /> -->
        </div>
        <template v-if="doctor.drid || doctor.name">
          <doctor :doctorinfo="doctor" :showfollow="doctor.drid" />
        </template>
      </div>
      <div v-if="tid === 24" class="tpl tpl-24">
        <div class="header">
          <div v-if="articleSrc!=='recruit' && sourceid != null && copyright_head" class="article-source">
            <span v-if="sourceid == 2" class="authorized webmd-authorized">{{ copyright_head }}</span>
            <span v-else-if="sourceid == 1 || sourceid == 3" class="authorized hos-authorized">{{ copyright_head }}</span>
            <span v-else-if="sourceid == 0 || sourceid == 4 || sourceid == 5" class="authorized doc-authorized">{{ copyright_head }}</span>
          </div>
          <div class="title">{{ title }}</div>
          <author v-if="author" :author="author" :release-time="releasetime" :article-src="articleSrc" :from="from" />
        </div>
        <div v-show="showFixTitle" class="fixTitle">
          {{ curSectionTitle }}
          <span class="stepinfo">{{ curStepTitle }}</span>
        </div>
        <div class="sections" @click="showActionbar">
          <template v-for="(section, sectionIndex) in sections">
            <div :key="sectionIndex" :class="[section.type === 0 ? 'noindex' : 'normal', {forbidden: section.title === '常见误区' || section.title === '错误处理'}]" class="section">
              <div class="section-title">{{ section.title }}</div>
              <template v-for="(step, index) in section.v_md_text">
                <div :key="index" :data-section="sectionIndex" :data-step="index" class="step">
                  <span v-if="section.type" class="icon">{{ index + 1 }}</span>
                  <div class="content md" v-html="step" />
                </div>
              </template>
            </div>
          </template>
        </div>
      </div>
      <div v-if="tid === 26" class="tpl tpl-26">
        <template v-for="(qa, index) in question">
          <div :key="index" class="qa-item">
            <div class="header">
              <div v-if="articleSrc!=='recruit' && sourceid != null && copyright_head" class="article-source">
                <span v-if="sourceid == 2" class="authorized webmd-authorized">{{ copyright_head }}</span>
                <span v-else-if="sourceid == 1 || sourceid == 3" class="authorized hos-authorized">{{ copyright_head }}</span>
                <span v-else-if="sourceid == 0 || sourceid == 4 || sourceid == 5" class="authorized doc-authorized">{{ copyright_head }}</span>
              </div>
              <div v-if="!index" class="title">{{ title }}</div>
              <author v-if="qa.author" :author="qa.author" :release-time="qa.time" :article-src="articleSrc" :from="from" />
            </div>
            <div class="content" @click="showActionbar">
              <div v-if="articleSrc!=='szph'&&op_text" class="article-src">本文由{{ op_text }}并推荐阅读</div>
              <div class="md" v-html="qa.v_md_text" />
            </div>
            <div v-if="qa.related && qa.related.length" class="recommend">
              <p class="recommend-title">全面理解请查看企鹅医典推荐</p>
              <paper :paperlist="qa.related" :noloading="true" :rkey="{article:'qadetail_relatedarticlex'}" />
            </div>
          </div>
        </template>
      </div>
      <div v-if="tid===17 && tid!==0 && curVideo.abs" class="video-abs tpl">
        <div class="video-abs-inner">
          <p class="video-abs-title">视频简介</p>
          <div class="video-abs-content md" v-html="curVideo.md_text" />
        </div>
      </div>
      <div class="doc-data-related">
        <div class="section">
          <div v-if="references && references.length" class="reference-doc">
            <p class="references-title">
              <span class="name">参考文献</span>
              <span class="count">（{{ references.length }}篇）</span>
              <span v-if="references.length > 1" :ptag="!allReferences ? 'reference_close' : 'reference_open'" class="action" @click="toggleReference">展开全部</span>
            </p>
            <p v-for="(item, index) in (allReferences ? references : references.slice(0, 1))" :key="index" :class="{ellipsis: !allReferences}">
              <span class="reference-index">[{{ index + 1 }}]</span>{{ item }}
            </p>
          </div>
        </div>
        <div v-if="tid!==17&&extraDiseases && extraDiseases.length && !(from==='tanyi')" class="disease-related">
          <span class="header">相关疾病</span>
          <span v-for="(item, index) in extraDiseases.slice(0, 3)" :key="index" class="disease" @click="toOverview(item.name, item.type, item.released)">
            {{ item.name }}
          </span>
        </div>
        <div v-if="tid!==0" class="actionbar-static">
          <actionbar ref="actionbar" :options="actionOps" @callback="actionCb" />
        </div>
        <div v-if="op_copyright" :style="{paddingTop:tid === 17?'.34rem':'',paddingBottom:tid===17?'.3rem':''}" :class="{line:tid===17}" class="sole-copyright">{{ op_copyright }}</div>
        <div v-if="tid === 17 && doctor && extraVideo && extraVideo.length" class="section">
          <div class="header">{{ '系列视频 (' + extraVideo.length +')' }}</div>
          <div class="related-video-wrap">
            <video-ul :list="extraVideo" :name="name" :curindex="curVideoIndex" :type="isNewVideoCategory ? 2 : 1" :disease="disease" ptag="ydd_contentsearch_article" @video-item-click="videoItemClick" />
          </div>
        </div>
        <!-- <div v-if="!noArtTags&&artTags && artTags.length > 0" class="article-belong">
          <p class="article-belong-title">本文收录在</p>
          <template v-for="(tag, index) in artTags">
            <div :key="index" class="article-catalog">
              <span v-for="(ttag,tindex) in tag.tag" :key="tindex">
                <em :class="'tag-'+tindex" @click="toTagContnet(ttag.type,index,ttag.id,tindex)">{{ ttag.label | tagFormat(ttag.type) }}</em>
                <img v-if="tindex < tag.tag.length -1 " :src="require('src/assets/images/mobile/doctor/arrow-up.png')">
              </span>
            </div>
          </template>
        </div> -->
        <!-- <div v-if="!(artTags && artTags.length > 0) && tags && tags.length" class="tags">
          <div class="header">相关标签</div>
          <p class="tag-list">
            <span v-for="(item,index) in tags.slice(0, 3)" :key="index" class="item" @click="searchByTag(item,index)">{{ item }}</span>
          </p>
        </div> -->
        <depressiontest :show="depressionShow" />
        <active-banner v-if="from !== 'tanyi' && activeOps" :options="activeOps" />
        <div v-if="articleSrc !== 'szph' && relatedTags && relatedTags.length && !(from==='tanyi')" class="section section-tag-docs">
          <!-- <div class="header">相关阅读</div> -->
          <papertag-multiline v-if="relatedTags && relatedTags.length" :tags="relatedTags" :index="relatedTagIdx" :parent-dom="'.section-tag-docs'" :top-minus-dom="'.tmenu'" :need-scroll-fixed="true" :one-line="true" @tagclick="(tagIdx) => { clickRelatedTag(tagIdx, true, 'YDD_Details_RecommendLableX') }" />
          <paper :paperlist="relatedTags[relatedTagIdx].docs.filter(doc => doc.docid !== docid)" :rkey="{article: 'YDD_Details_RecommendArticleX'}" :loaded="relatedTags[relatedTagIdx].loaded" :noloading="true" />
          <p v-if="!(relatedTags[relatedTagIdx].loaded || relatedTags[relatedTagIdx].docs.length < 6)" class="view-more">查看更多
            <a href="javascript:;" class="btn-link" @click="clickRelatedTag(relatedTagIdx, false, 'YDD_Details_RecommendMore')" />
          </p>
        </div>
        <div v-if="tid === 26 && extraQuestion && extraQuestion.length && !(from==='tanyi')" class="section qa-related">
          <div class="header">相似问答</div>
          <paper :paperlist="extraQuestion" :rkey="{article: 'qadetail_similarqax'}" :noloading="true" />
        </div>
        <div v-if="(relateset&&relateset.length)||nextstage" class="video-next">
          <div v-if="relateset&&relateset.length" class="more-video">
            <div class="title">更多{{ disease ? disease : name }}视频</div>
            <div class="more-wrap">
              <ul>
                <li v-for="item in relateset" :key="item.set" :tourl="videoCompilationTopic+'&stage='+item.stage+'&childset='+item.set">{{ item.set }}</li>
              </ul>
            </div>
          </div>
          <div v-if="nextstage" :tourl="videoCompilationTopic+'&stage='+nextstage" :style="{marginTop:relateset&&relateset.length?'':0}" class="next-step">下一阶段：{{ nextstage }}</div>
        </div>
      </div>
      <template v-if="audio">
        <div class="audio-container">
          <a :class="{on: showAudioPlayer}" :ptag="showAudioTip ? 'ydd_audiodoc_play' : 'ydd_audiodoc_playnball'" class="audio-btn" href="javascript:void(0);" @click="audioClk" />
          <p v-show="showAudioTip" class="audio-tip">点这里开始语音朗读</p>
          <div v-show="showAudioHint" class="audio-hint-mask" @touchstart.stop @touchend.stop @touchmove.prevent/>
          <div v-show="showAudioHint" :class="{'net-no': !wifiTestable}" class="audio-hint-wifi" @touchstart.stop @touchend.stop @touchmove.prevent>
            <span v-if="wifiTestable" class="wifi-no" />
            <p v-if="wifiTestable" class="wifi-hint">当前为非Wi-Fi环境，是否使用流量播放（{{ audio.size | formatSize }}M）</p>
            <p v-else class="wifi-hint">该语音大小为（{{ audio.size | formatSize }}M），是否允许播放？</p>
            <p class="wifi-btns">
              <span class="btn-no" ptag="ydd_audiodoc_wifino" @click="showAudioHint = false">暂不</span>
              <span class="btn-play" ptag="ydd_audiodoc_wifiallow" @click="audioPlay">允许</span>
            </p>
          </div>
        </div>
        <player v-show="showAudioPlayer" ref="audioPlayer" :audio="audio" :options="audioOps" @callback="audioCb" />
      </template>

      <annotation :setannotation="setannotation" :references="references" :article-title="title" :article-docid="docid" dom="" topnav=".tmenu" />
      <fixedcollectiontips :show-type="2" :reach-endof-aritle="reachEndofAritle" />
      <source-disclaimer v-if="!(from==='tanyi')" :sourceid="sourceid" :is-cancer="isCancer" />
      <template v-if="quickReturnStatus && quickReturnData">
        <div class="quick-return-wrp fixed">
          <div :class="{'big': quickReturnStatus === 1, 'small': quickReturnStatus === 2}" class="inner-wrp" @click="quickReturnArticle">
            {{ quickReturnStatus === 1 ? `上一篇：${quickReturnData.title}` : `回到上一篇` }}
          </div>
        </div>
      </template>
    </template>
  </div>
</template>

<script>
import article from './article'
export default article
</script>

<style lang="scss" scoped>
@import "./article.scss";
</style>
