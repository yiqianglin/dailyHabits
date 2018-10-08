<template id="tpl_tagitem">
  <div class="tagitem">
    <ul v-if="item.nav==='疾病'||item.nav==='文章'" :class="item.nav==='疾病'?'disease-list':'paper-list'">
      <li v-for="(itemi,indexi) in getList()" :key="indexi" :class="{building:item.nav==='疾病'&&itemi.released!==1}" class="item">
        <!-- 语音 -->
        <div v-if="itemi.url" class="audio-detail">
          语音文章 时长 {{ itemi.duration | formatTime }}
        </div>
        <p class="name" v-html="$options.filters.highLight(item.nav==='疾病'?(itemi.name+(itemi.alias&&itemi.alias.length?('(' + itemi.alias.join('、') + ')'):'')):itemi.title, keywords)" />
        <p v-if="itemi.summary" class="desc two-clamp" v-html="$options.filters.highLight(itemi.summary, keywords)" />
        <ul v-if="getTags(item.nav,itemi).length>0" :style="{WebkitLineClamp:itemi.summary?1:2}">
          <li v-for="(itemi, itemiIdx) in getTags(item.nav,itemi)" :key="itemiIdx" v-html="$options.filters.highLight(itemi, keywords)" />
        </ul>
        <span v-if="item.nav==='疾病'&&itemi.released!==1" class="tag">建设中</span>
        <a href="javascript:;" class="btn-link margin36" @click="item.nav==='疾病'?toOverview(itemi.name,itemi.type,indexi,item.nav==='疾病'&&itemi.released!==1):toArticle(itemi,indexi)" />
      </li>
    </ul>
    <div v-else-if="item.nav === '相关疾病知识'" class="disease-related-wrapper">
      <ul class="disease-related">
        <li v-for="(mixDN, mixDNIdx) in getList()" :key="mixDNIdx" @click="toMixDN(mixDN, mixDNIdx)" v-html="$options.filters.highLight(mixDN.type === 1 ? mixDN.disease.name : mixDN.note.name, keywords)" />
      </ul>
    </div>
    <ul v-else-if="item.nav==='视频'" class="paper-list">
      <li v-for="(itemi,indexi) in getList()" v-if="itemi.duration" :key="indexi" class="video-item">
        <div class="info">
          <div class="title two-clamp" v-html="$options.filters.highLight(itemi.title, keywords)" />
          <ul v-if="itemi.tags&&itemi.tags.length>0">
            <li v-for="(itemi, itemiIdx) in itemi.tags" :key="itemiIdx" v-html="$options.filters.highLight(itemi, keywords)" />
          </ul>
        </div>
        <div v-if="itemi.image" class="img">
          <img :src="itemi.image">
          <span>{{ itemi.duration | formatTime }}</span>
        </div>
        <a href="javascript:;" class="btn-link margin36" @click="toArticle(itemi,indexi,'YDD_search_videoclkX')" />
      </li>
    </ul>
    <ul v-else-if="item.nav==='问答'" class="ask-list">
      <li v-for="(itemi,indexi) in getList()" :key="indexi" class="item">
        <p class="name" v-html="$options.filters.highLight(itemi.title, keywords)" />
        <p v-if="itemi.md_text" class="desc two-clamp" v-html="$options.filters.highLight(itemi.md_text, keywords)" />
        <author :item="itemi" />
        <a href="javascript:;" class="btn-link margin36" @click="toArticle(itemi,indexi,'YDD_search_QAX_clk')" />
      </li>
    </ul>
    <ul v-if="item.nav==='疾病'&&item.list.length===1&&item.questions&&item.questions.length>0" class="problem-list">
      <li v-for="(itemi,indexi) in item.questions" :key="indexi">
        <div v-html="$options.filters.highLight(itemi.question, keywords)" />
        <a href="javascript:;" class="btn-link margin36" @click="toQuestion(itemi.disease,itemi.entry,indexi)" />
      </li>
    </ul>
    <ul v-else-if="item.nav==='医院'" class="logo-list">
      <li v-for="(itemi,indexi) in getList()" :key="indexi" class="item align-center">
        <div class="img">
          <img :src="itemi.logo||require('src/assets/images/mobile/mydoctor/avatar.png')">
        </div>
        <div class="info">
          <div class="name ellipsis" v-html="$options.filters.highLight(itemi.name, keywords)" />
          <div v-if="itemi.doctors&&itemi.doctors.length>0" class="desc ellipsis" v-html="'包含医生：'+$options.filters.highLight(itemi.doctors.join('、'), keywords)" />
          <ul v-else-if="itemi.tags&&itemi.tags.length>0">
            <li v-for="(itemj, itemjIdx) in itemi.tags" :key="itemjIdx" v-html="$options.filters.highLight(itemj, keywords)" />
          </ul>
        </div>
        <a href="javascript:;" class="btn-link margin36" @click="toHospital(itemi.hospitalId,indexi)" />
      </li>
    </ul>
    <ul v-else-if="item.nav==='医生'" class="logo-list">
      <li v-for="(itemi,indexi) in getList()" :key="indexi" class="item">
        <div class="img">
          <img :src="itemi.avatarUrl||require('src/assets/images/mobile/mydoctor/avatar.png')">
          <img v-if="itemi.adviser===1" :src="require('src/assets/images/mobile/search_new/brd.png')" class="adviser">
        </div>
        <div class="info">
          <div class="name ellipsis" v-html="$options.filters.highLight(itemi.name, keywords)+'&nbsp;' + itemi.jobTitle + '&nbsp;' + itemi.department" />
          <div class="desc">
            <p v-if="itemi.op_vt_diseases_tag&&itemi.op_vt_diseases_tag.length>0" class="ellipsis" v-html="'擅长：'+$options.filters.highLight(itemi.op_vt_diseases_tag.join('、'), keywords)" />
            <p class="ellipsis">{{ itemi.hospital||'' }}</p>
          </div>
        </div>
        <a href="javascript:;" class="btn-link margin36" @click="toDoctor(itemi.doctorId,indexi)" />
      </li>
    </ul>
    <ul v-else-if="item.nav==='混排'" class="mix-list">
      <template v-for="(itemi,indexi) in getList()">
        <li v-if="itemi.type===8" :key="indexi" class="video-item">
          <div class="info">
            <div class="title two-clamp" v-html="$options.filters.highLight(itemi.video.title, keywords)" />
            <ul v-if="itemi.video.tags&&itemi.video.tags.length>0">
              <li v-for="(itemi, itemiIdx) in itemi.video.tags" :key="itemiIdx" v-html="$options.filters.highLight(itemi, keywords)" />
            </ul>
          </div>
          <div v-if="itemi.video.image" class="img">
            <img :src="itemi.video.image">
            <span>{{ itemi.video.duration | formatTime }}</span>
          </div>
          <a href="javascript:;" class="btn-link margin36" @click="toArticle(itemi.video,indexi,'YDD_search_videoclkX')" />
        </li>
        <li v-else :key="indexi" class="item">
          <template v-if="itemi.type == 2">
            <!-- 语音 -->
            <div v-if="itemi.doc.url" class="audio-detail">
              语音文章 时长 {{ itemi.doc.duration | formatTime }}
            </div>
            <p class="name" v-html="$options.filters.highLight(itemi.doc.title, keywords)" />
            <p v-if="itemi.doc.summary" class="desc two-clamp" v-html="$options.filters.highLight(itemi.doc.summary, keywords)" />
            <ul v-if="getTags('文章',itemi.doc).length>0" :style="{WebkitLineClamp:itemi.doc.summary?1:2}">
              <li v-for="(itemi, itemiIdx) in getTags('文章',itemi.doc)" :key="itemiIdx" v-html="$options.filters.highLight(itemi, keywords)" />
            </ul>
            <a href="javascript:;" class="btn-link margin36" @click="toArticle(itemi.doc,indexi)" />
          </template>
          <template v-else-if="itemi.type == 5">
            <p class="name">
              <em class="qa-icon">问答</em>
              <span v-html="$options.filters.highLight(itemi.qa.title, keywords)" />
            </p>
            <p v-if="itemi.qa.md_text" class="desc two-clamp" v-html="$options.filters.highLight(itemi.qa.md_text, keywords)" />
            <author :item="itemi.qa" />
            <a href="javascript:;" class="btn-link margin36" @click="toArticle(itemi.qa,indexi,'YDD_search_QAX_clk')" />
          </template>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import tagitem from './tagitem'
export default tagitem
</script>

<style lang="scss" scoped src="./tagitem.scss"></style>
