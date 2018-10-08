<template id="tpl_paper">
  <div v-if="paperlist&&paperlist.length>0" class="paper">
    <!--v1.22运营，如果采用文章形式进行配置，变成文章样式-->
    <template v-for="(item, index) in toplist" v-if="[0, 2, 3].indexOf(parseInt(showMode)) !== -1 && toplist.length && item">
      <template v-if="item.docid">
        <div v-if="item.docinfo.tid === 25" :key="'toplist' + index" class="qa-item">
          <div v-if="ishotqa" class="hot-qa">
            <div class="title">
              <i v-if="index>=0&&index<3" class="hot-icon" />
              <span class="desc">{{ item.text || item.docinfo.tid25.title }}</span>
            </div>
            <template v-if="item.author">
              <author :item="{image: item.image, source: item.author}" :doctorid="doctorid" />
            </template>
            <template v-else>
              <author :item="item.docinfo.tid25" :doctorid="doctorid" />
            </template>
            <div class="content">
              {{ item.docinfo.tid25.md_text }}
            </div>
            <ul v-if="item.docinfo.tid25.op_keyword&&item.docinfo.tid25.op_keyword.length>0">
              <li v-for="itemi in item.docinfo.tid25.op_keyword" :key="itemi">{{ itemi }}</li>
            </ul>
            <a href="javascript:;" class="btn-link" @click="toActive(item.type, item.docid, item.h5url, index, item.text || item.docinfo.tid25.text)" />
          </div>
          <div v-else class="normal-qa">
            <p class="title">
              <em class="qa-icon">问答</em>
              <span class="desc">{{ item.text || item.docinfo.tid25.title }}</span>
            </p>
            <template v-if="item.author">
              <author :item="{image: item.image, source: item.author}" :doctorid="doctorid" />
            </template>
            <template v-else>
              <author :item="item.docinfo.tid25" :doctorid="doctorid" />
            </template>
            <a href="javascript:;" class="btn-link" @click="toArticle(item, index, 'qa')" />
          </div>
          <!-- 搜索框 -->
          <div v-if="item.docinfo.tid25.searchtitle" class="search-item">
            <div class="tip">{{ item.docinfo.tid25.searchtitle || '没找到想要的内容？' }}</div>
            <a class="search" href="javascript:;">搜一下</a>
            <a href="javascript:;" class="btn-link" @click="toSearch()" />
          </div>
        </div>
        <div v-else-if="item.docinfo.tid===10" :key="'toplist' + index" :class="drid?'article':''" class="video-item">
          <template v-if="drid">
            <div :style="'background:url('+ (item.images && item.images[0] && item.images[0]) || item.docinfo.tid10.image + ') no-repeat center center;background-size:cover;'" class="img">
              <span v-if="item.docinfo.tid10.duration>0" class="time">{{ item.docinfo.tid10.duration | formatTime }}</span>
            </div>
            <div class="video-info">
              <p class="title">{{ item.text || item.docinfo.tid10.title }}</p>
              <p class="text">{{ item.docinfo.tid10.text || item.docinfo.tid10.md_text }}</p>
            </div>
            <a href="javascript:;" class="btn-link" @click="toActive(item.type, item.docid, item.h5url, index, item.text || item.docinfo.tid10.text)" />
          </template>
          <template v-else>
            <p class="title">{{ item.text || item.docinfo.tid10.title }}</p>
            <div class="img">
              <img v-if="(item.images && item.images[0]) || item.docinfo.tid10.image" :src="(item.images[0] && item.images[0]) || item.docinfo.tid10.image">
              <span v-if="item.docinfo.tid10.duration>0" class="time">{{ item.docinfo.tid10.duration | formatTime }}</span>
            </div>
            <tag :tags="item.docinfo.tid10.op_keyword" />
            <div class="source">{{ item.docinfo.tid10.source }}</div>
            <a href="javascript:;" class="btn-link" @click="toActive(item.type, item.docid, item.h5url, index, item.text || item.docinfo.tid10.text)" />
          </template>
        </div>
        <div v-else v-show="item.docinfo.tid4.title!='' || item.docinfo.tid4.text!=''" :key="'toplist' + index" :class="{'no-img':!(item.images && item.images[0]) && !item.docinfo.tid4.op_image}" class="item">
          <div class="content-detail">
            <div class="info">
              <div v-if="item.docinfo.tid4.type===1||item.docinfo.tid4.isTop||item.docinfo.tid4.newflag" class="title">
                <span class="desc">{{ item.text || item.docinfo.tid4.title }}</span>
                <i v-if="item.docinfo.tid4.isTop||item.docinfo.tid4.newflag" :class="{top : item.docinfo.tid4.isTop, new: item.docinfo.tid4.newflag}" />
              </div>
              <div v-else class="title no-desc">{{ item.text || item.docinfo.tid4.title }}</div>
              <tag v-if="item.docinfo.tid4.op_keyword && item.docinfo.tid4.op_keyword.length" :tags="item.docinfo.tid4.op_keyword" />
              <template v-if="item.author">
                <author :item="{image: item.image, source: item.author}" :doctorid="doctorid" />
              </template>
              <template v-else>
                <author :item="item.docinfo.tid4" :doctorid="doctorid" />
              </template>
            </div>
            <div v-if="(item.images && item.images[0]) || item.docinfo.tid4.op_image" class="img">
              <img :src="(item.images[0] && item.images[0]) || item.docinfo.tid4.op_image">
            </div>
          </div>
          <a href="javascript:;" class="btn-link" @click="toActive(item.type, item.docid, item.h5url, index, item.text || index,item.docinfo.tid4.text)" />
        </div>
      </template>
      <!--运营内容链接展示-->
      <template v-else>
        <div v-if="item.images&&item.images.length>2" :key="'toplist' + index" class="threeimg-item">
          <div class="title">
            <span class="desc">{{ item.text }}</span>
            <span class="hot">热</span>
          </div>
          <div class="imgs">
            <img v-for="(itemj, itemjIdx) in item.images.slice(0,3)" v-if="itemj" :key="itemjIdx" :src="itemj" :style="{width:threeImgWidth>0?(threeImgWidth+'rem'):'',height:threeImgWidth>0?(threeImgWidth*144/232+'rem'):''}">
          </div>
          <author v-if="item.author" :item="{image: item.logoflag === 1 ? '//s.pc.qq.com/tdf/baike/source_wicon.png' : '', source: item.author}" :doctorid="doctorid"/>
          <a href="javascript:;" class="btn-link" @click="toActive(item.type, item.docid, item.h5url, index, item.text)" />
        </div>
        <div v-else-if="item.text" :key="'toplist' + index" :class="{'no-img':item.images && item.images.length < 1}" class="item">
          <div class="content-detail">
            <div class="info">
              <div class="title">
                <span class="desc">{{ item.text }}</span>
                <i v-if="item.isTop||item.newflag" :class="{top : item.isTop, new: item.newflag}" />
              </div>
              <author v-if="item.author" :item="{image: item.logoflag === 1 ? '//s.pc.qq.com/tdf/baike/source_wicon.png' : '', source: item.author}" :doctorid="doctorid"/>
            </div>
            <div v-if="item.images && item.images.length === 1&&item.images[0]" class="img">
              <img :src="item.images && item.images[0]">
            </div>
          </div>
          <a href="javascript:;" class="btn-link" @click="toActive(item.type, item.docid, item.h5url, index, item.text)" />
        </div>
      </template>
    </template>
    <template v-for="(item,index) in paperlist">
      <!-- 运营banner类 -->
      <div v-if="item.isAd && item.image && item.h5url" :key="index" class="advertisement">
        <img :src="item.image">
        <a href="javascript:;" class="btn-link" @click="toActive(item.type, item.docid, item.h5url, index, item.text)" />
      </div>
      <!-- 运营文章、运营问答类 -->
      <div v-else-if="item.isHot" :key="index" :class="{'no-img':item.images.length < 1}" class="item">
        <div class="content-detail">
          <div class="info">
            <div class="title">
              <span class="desc">{{ item.text }}</span>
              <i v-if="item.isTop||item.newflag" :class="{top : item.isTop, new: item.newflag}" />
            </div>
            <author :item="{image: item.logoflag === 1 ? '//s.pc.qq.com/tdf/baike/source_wicon.png' : '', source: item.author}" :doctorid="doctorid"/>
          </div>
          <div v-if="item.images.length === 1" class="img">
            <img :src="item.images[0]">
          </div>
        </div>
        <a href="javascript:;" class="btn-link" @click="toActive(item.type, item.docid, item.h5url, index, item.text)" />
      </div>
      <!-- 文章分类 -->
      <div v-else-if="item.isTag && item.tag && item.tag.length > 0" :key="index" class="tag-item">
        <div class="tag-related">
          <p class="title">相关文章分类</p>
          <ul class="tag-list">
            <template v-for="(tag, i) in item.tag">
              <li :key="i" :class="{'not-interested':tag.notInterested}" class="ellipsis">
                <span class="name">{{ tag.name }}</span>
                <span class="ignore" @click.stop="ignore('tag', tag)" />
                <a href="javascript:;" class="btn-link" @click="toTag(tag.title, tag.name)" />
              </li>
            </template>
          </ul>
        </div>
        <!-- 搜索框 -->
        <div v-if="item.searchtitle" class="search-item">
          <div class="tip">{{ item.searchtitle || '没找到想要的内容？' }}</div>
          <a class="search" href="javascript:;">搜一下</a>
          <a href="javascript:;" class="btn-link" @click="toSearch()" />
        </div>
      </div>
      <!-- 急救 -->
      <div v-else-if="item.isEmergency && item.emergency && item.emergency.length" :key="index" class="emergency-item">
        <p class="title">日常要留意</p>
        <ul class="tag-list">
          <template v-for="(tag, i) in item.emergency">
            <li :class="{'not-interested':tag.notInterested}" :key="i">
              <span class="name">{{ tag.name }}</span>
              <span class="ignore" @click.stop="ignore('emergency', tag)" />
              <a href="javascript:;" class="btn-link" @click="toArticle(tag,i)" />
            </li>
          </template>
        </ul>
      </div>
      <!-- 疾病 -->
      <div v-else-if="item.isDisease && item.diseases && item.diseases.length" :key="index" class="disease-item">
        <p class="title">当季预防疾病</p>
        <div class="diseases">
          <div v-for="disease in item.diseases" :key="disease.name" :class="{'not-interested': disease.notInterested}" class="disease">
            <span class="ignore" @click.stop="ignore('disease', disease)" />
            <p class="name ellipsis">{{ disease.name }}</p>
            <p class="desc ellipsis">{{ disease.summary }}</p>
            <a href="javascript:;" class="btn-link" @click="toOverview(disease.name, disease.type)" />
          </div>
        </div>
      </div>
      <!-- 医生 -->
      <div v-else-if="item.isDoctor && item.doctors && item.doctors.length" :key="index" class="doctor-item">
        <p class="title">推荐医生</p>
        <div class="wrapper" @touchmove.stop>
          <ul class="experts">
            <template v-for="(expert, expertIdx) in item.doctors">
              <li :key="expertIdx">
                <div class="expert">
                  <div class="personal">
                    <img :src="expert.hand?expert.hand: require('src/assets/images/mobile/mydoctor/avatar.png')" class="avatar">
                    <div class="info">
                      <p class="name">{{ expert.name }}<img :src="require('src/assets/images/mobile/common/expert.png')"></p>
                      <p class="title">
                        {{ expert.op_vt_teachtitle.length ? expert.doctitle + ' | ' + expert.op_vt_teachtitle.join('，') : expert.doctitle }}
                      </p>
                    </div>
                  </div>
                  <p class="depart">{{ expert.main_depart }}
                  <span class="circle" />{{ expert.hospital_shortname }}</p>
                  <p class="goodat">{{ expert.diseases_desc }}</p>
                  <div :class="['follow', {followed: expert.follow}]" :ptag="expert.follow===0?'ydd_dochome_follow':'ydd_dochome_followcancel'" @click.stop="fClick(expert)">{{ expert.follow == 1 ? '已关注' : '＋关注' }}</div>
                  <a href="javascript:;" class="btn-link" @click="toDoctor(expert)" />
                </div>
              </li>
            </template>
          </ul>
        </div>
      </div>
      <!-- 关注 -->
      <div v-else-if="item.isFocus && item.focus && item.focus.length" :key="index" class="focus-item">
        <p class="title">推荐关注健康资讯</p>
        <div class="focus-tags">
          <div v-for="tag in item.focus" :key="tag.title" class="focus-tag">
            <span :class="{focus: tag.focus}" class="label">
            <span v-show="!tag.focus" class="add">+</span><img v-show="tag.focus" :src="require('src/assets/images/mobile/health/tick.png')" class="tick">{{ tag.title }}</span>
            <a href="javascript:;" class="btn-link" @click="focusHealthTag(tag)" />
          </div>
        </div>
      </div>
      <!-- 专题 -->
      <div v-else-if="item.isTopic" :key="index" class="topic-item" @click="toTopic(item.h5url)">
        <img v-if="item.image" :src="item.image">
      </div>
      <!-- 问答 -->
      <div v-else-if="item.tid === 25" :key="index" class="qa-item">
        <div v-if="ishotqa||listqa" :class="{'list-qa':listqa}" class="hot-qa">
          <div class="title">
            <i v-if="ishotqa&&index>=0&&index<3" class="hot-icon" />
            <span class="desc">{{ item.title }}</span>
          </div>
          <author :item="item" :doctorid="doctorid"/>
          <div class="content">
            {{ item.md_text }}
          </div>
          <ul v-if="item.op_keyword&&item.op_keyword.length>0">
            <li v-for="itemi in item.op_keyword" :key="itemi">{{ itemi }}</li>
          </ul>
          <a href="javascript:;" class="btn-link" @click="toArticle(item, index, 'qa')" />
        </div>
        <div v-else class="normal-qa">
          <p class="title">
            <em class="qa-icon">问答</em>
            <span class="desc">{{ item.title }}</span>
          </p>
          <author :item="item" :doctorid="doctorid"/>
          <a href="javascript:;" class="btn-link" @click="toArticle(item, index, 'qa')" />
        </div>
        <!-- 搜索框 -->
        <div v-if="item.searchtitle" class="search-item">
          <div class="tip">{{ item.searchtitle || '没找到想要的内容？' }}</div>
          <a class="search" href="javascript:;">搜一下</a>
          <a href="javascript:;" class="btn-link" @click="toSearch()" />
        </div>
        <!-- 疾病标签 -->
        <papertag-multiLine v-if="item.hometags && item.hometags.length" :tags="item.hometags.map(tag => {return {name: tag}})" :index="-1" @tagclick="(tagIdx) => {toQaList(item, tagIdx)}" />
      </div>
      <!-- 视频 -->
      <div v-else-if="item.tid===10" :key="index" :class="drid||listvideo?'article':''" class="video-item">
        <template v-if="drid||listvideo">
          <div :style="'background:url('+ item.image+ ') no-repeat center center;background-size:cover;'" class="img">
            <!-- <img :src="item.image"> -->
            <span v-if="item.duration>0" class="time">{{ item.duration | formatTime }}</span>
          </div>
          <div class="video-info">
            <p class="title">{{ item.title }}</p>
            <p class="text">{{ item.text || item.md_text }}</p>
          </div>
          <a href="javascript:;" class="btn-link" @click="toArticle(item,index)" />
        </template>
        <template v-else>
          <p class="title">
            <span v-if="item.showHot" class="icon-hot">热</span>
          <span v-if="item.showRelated" class="icon-related">相关</span>{{ item.title }}</p>
          <div class="img">
            <img v-if="item.image" :src="item.image">
            <span v-if="item.duration>0" class="time">{{ item.duration | formatTime }}</span>
          </div>
          <tag :tags="item.op_keyword" />
          <div class="source">{{ item.source }}</div>
          <a href="javascript:;" class="btn-link" @click="toArticle(item,index)" />
        </template>
      </div>
      <!-- 三图文章 -->
      <div v-else-if="item.op_thumbs&&item.op_thumbs.length>2" :key="index" class="threeimg-item">
        <div class="title">
          <span v-if="item.showHot" class="icon-hot">热</span>
          <span v-if="item.showRelated" class="icon-related">相关</span>
          <span class="desc">{{ item.title }}</span>
        </div>
        <div class="imgs">
          <img v-for="(itemj, itemjIdx) in item.op_thumbs.slice(0,3)" v-if="itemj" :key="itemjIdx" :src="itemj" :style="{width:threeImgWidth>0?(threeImgWidth+'rem'):'',height:threeImgWidth>0?(threeImgWidth*144/232+'rem'):''}">
        </div>
        <tag :tags="item.op_keyword" />
        <author :item="item" :doctorid="doctorid"/>
        <a href="javascript:;" class="btn-link" @click="toArticle(item,index)" />
      </div>
      <!-- 动图文章 -->
      <div v-else-if="item.op_image&&(/.gif/i.test(item.op_image))" :key="index" class="gif-item">
        <p class="title">
          <span v-if="item.showHot" class="icon-hot">热</span>
        <span v-if="item.showRelated" class="icon-related">相关</span>{{ item.title }}</p>
        <div class="img">
          <img :src="item.op_image">
        </div>
        <tag :tags="item.op_keyword" />
        <author :item="item" :doctorid="doctorid" />
        <a href="javascript:;" class="btn-link" @click="toArticle(item,index)" />
      </div>
      <!-- 无图、单图文章 -->
      <div v-else v-show="item.title!='' || item.text!=''" :key="index" :class="{'no-img':!item.op_image}" class="item">
        <!-- 语音 -->
        <div v-if="item.url" class="audio-detail">
          语音文章 时长 {{ item.duration | formatTime }}
        </div>
        <div class="content-detail">
          <div class="info">
            <div v-if="item.type===1||item.isTop||item.newflag" class="title">
              <em v-if="item.type===1" class="patient-story">患者故事</em>
              <span class="desc">{{ item.title }}</span>
              <i v-if="item.isTop||item.newflag" :class="{top : item.isTop, new: item.newflag}" />
            </div>
            <div v-else class="title no-desc">
              <span v-if="item.showHot" class="icon-hot">热</span>
            <span v-if="item.showRelated" class="icon-related">相关</span>{{ item.title }}</div>
            <tag v-if="item.op_keyword && item.op_keyword.length" :tags="item.op_keyword" />
            <author v-else :item="item" :doctorid="doctorid" />
          </div>
          <div v-if="item.op_image" class="img">
            <img :src="item.op_image">
          </div>
        </div>
        <author v-if="item.op_keyword && item.op_keyword.length" :item="item" :doctorid="doctorid" />
        <a href="javascript:;" class="btn-link" @click="toArticle(item,index)" />
      </div>
    </template>

    <p v-if="!noloading" class="loading">
      <span v-show="!loaded" class="dotting">
        <i/>
        <i/>
        <i/>
    </span>{{ loaded?'更多专业内容，陆续更新':'正在加载更多' }}</p>
  </div>
  <div v-else-if="!noempty" class="paper-empty">{{ loaded?'暂无匹配的内容':'数据加载中...' }}</div>
</template>

<script>
import paper from './paper'
export default paper
</script>

<style lang="scss" src="./paper.scss" />
