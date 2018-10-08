<template>
  <div v-cloak class="container">
    <div v-cloak v-if="isShow" id="main">
      <tmenu :name="topic + ' - ' + name" @callback="tmenuCb" />
      <div class="detail" @click="showActionbar">
        <div v-if="tlist.length" class="article">
          <div class="list">
            <div v-for="(item, index) in tlist.slice(0, 35)" :key="item.title">
              <div v-if="index !== 0" class="border">
              <div class="border-bottom" /></div>
              <div class="item">
                <div>
                  <div class="title">
                    {{ item.title }}
                  </div>
                  <div class="refer">
                    <template v-if="item.op_author && item.op_author.op_doctor && item.op_author.op_doctor.length > 0">
                      <div v-for="itemi in item.op_author.op_doctor" :key="itemi.name">
                        {{ itemi.name+' '+[itemi.position,itemi.department].filter(function(s){return s;}).join(' | ') }}<br>
                      </div>
                      <div>
                        {{ item.op_author.op_doctor[0].hospital||'' }}
                      </div>
                    </template>
                    <div v-else>
                      {{ (item.op_author&&item.op_author.op_hospital&&item.op_author.op_hospital.name)||item.source }}
                    </div>
                  </div>
                </div>
                <img v-if="item.op_image || item.image" :src="item.op_image || item.image" class="img">
                <a class="btn-link" @click="toArticle('hot', item.docid, index + 1)" />
              </div>
            </div>
          </div>
        </div>
        <div v-else class="block">
          <div v-if="block.baseinfo" class="tpl-14">
            <div class="banner">
              <img :src="block.baseinfo.image">
              <div class="desc">{{ block.baseinfo.title }}
                <span class="zt">专题</span>
              </div>
            </div>
            <div v-if="block.baseinfo.v_md_text" class="sumary md" v-html="block.baseinfo.v_md_text" />
          </div>
          <div v-for="item in block.topicinfo" :key="item.title">
            <div class="grayBlock" />
            <div class="topicinfo">
              <div class="title">{{ item.title }}</div>
              <div v-for="(subItem, subIndex) in item.list" :key="subItem.title">
                <template v-if="subItem.tid === 15">
                  <div :class="subIndex === item.list.length - 1 ? 'last' : ''" class="tpl-15">
                    <div class="row r1"><img :src="subItem.icon" class="icon">{{ subItem.title }}</div>
                    <div class="row r2">{{ subItem.text }}</div>
                    <div class="row r3">
                      <template v-for="icons in subItem.list">
                        <div :key="icons.name" class="col">
                          <img :src="icons.icon">
                          <span>{{ icons.name }}</span>
                        </div>
                      </template>
                    </div>
                  </div>
                </template>
                <template v-if="subItem.tid === 16">
                  <div :class="!subItem.op_list ? 'center' : ''" class="tpl-16">
                    <img :src="subItem.icon" class="pic">
                    <span class="t1">{{ subItem.title }}</span>
                    <template v-if="!!subItem.op_list_desc">
                      <span class="t2">{{ subItem.op_list_desc }}</span>
                    </template>
                    <div class="arrow" />
                    <a class="btn-link" @click="toArticle('related', subItem.docid, subIndex)" />
                  </div>
                </template>
              </div>
              <template v-for="subItem in item.op_related">
                <div :key="subItem.title" class="related">
                  <div class="circle" /> {{ subItem.title }}
                  <a class="btn-link" @click="toArticle('related', subItem.docid)" />
                </div>
              </template>
            </div>
          </div>
          <template v-for="(item, index) in block.list">
            <div :key="item.title" class="doclist">
              <div class="title">{{ item.title }}</div>
              <div v-for="(subItem, subIndex) in item.list" :key="subItem.title">
                <div v-if="subIndex !== 0" class="border">
                <div class="border-bottom" /></div>
                <div class="item">
                  <div>
                    <div class="title">
                      {{ subItem.title }}
                    </div>
                    <div class="refer">
                      <template v-if="subItem.op_author && subItem.op_author.op_doctor && subItem.op_author.op_doctor.length > 0">
                        <div v-for="itemi in subItem.op_author.op_doctor" :key="itemi.name">
                          {{ itemi.name+' '+[itemi.position,itemi.department].filter(function(s){return s;}).join(' | ') }}<br>
                        </div>
                        <div>
                          {{ subItem.op_author.op_doctor[0].hospital||'' }}
                        </div>
                      </template>
                      <div v-else>
                        {{ (subItem.op_author&&subItem.op_author.op_hospital&&subItem.op_author.op_hospital.name)||subItem.source }}
                      </div>
                    </div>
                  </div>
                  <img v-if="subItem.op_image || subItem.image" :src="subItem.op_image || subItem.image" class="img">
                  <a class="btn-link" @click="toArticle('related', subItem.docid, index + 1)" />
                </div>
              </div>
            </div>
          </template>
          <div v-if="block.doclist" class="doclist">
            <div class="grayBlock" />
            <div v-for="(item, index) in block.doclist" :key="item.title">
              <div v-if="index !== 0" class="border">
              <div class="border-bottom" /></div>
              <div class="item">
                <div>
                  <div class="title">
                    {{ item.title }}
                  </div>
                  <div class="refer">
                    <template v-if="item.op_author && item.op_author.op_doctor && item.op_author.op_doctor.length > 0">
                      <div v-for="itemi in item.op_author.op_doctor" :key="itemi.name">
                        {{ itemi.name+' '+[itemi.position,itemi.department].filter(function(s){return s;}).join(' | ') }}<br>
                      </div>
                      <div>
                        {{ item.op_author.op_doctor[0].hospital||'' }}
                      </div>
                    </template>
                    <div v-else>
                      {{ (item.op_author&&item.op_author.op_hospital&&item.op_author.op_hospital.name)||item.source }}
                    </div>
                  </div>
                </div>
                <img v-if="item.op_image || item.image" :src="item.op_image || item.image" class="img">
                <a class="btn-link" @click="toArticle('related', item.docid, index + 1)" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <actionbar v-if="actionOps" v-show="!isHot" ref="actionbar" :options="actionOps" @callback="actionCb" />
      <source-disclaimer :sourceid="jinpin ? 2 : 3" />
    </div>
  </div>
</template>

<script>
import topic from './topic'
export default topic
</script>

<style lang="scss" scoped>
@import "./topic.scss";
</style>
