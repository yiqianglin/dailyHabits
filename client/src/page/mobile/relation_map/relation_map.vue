<template>
  <div v-cloak class="container">
    <div id="mylegend">loading……</div>
    <div id="relation-map" class="instance">
      <div :class="{'show':showMother}" class="map_bottom_tab">
        <div class="map_name" @click="testClick()">{{ mapName }}知识图谱</div>
        <div class="map_desc">{{ mapDesc }}</div>
      </div>
      <div v-cloak :class="{'show':showChild}" class="map_bottom_tab" @toushstart.prevent.stop>
        <div class="map_name">{{ mapChildren.name }}
          <span class="more-articles" @click.prevent.stop="tabClick(mapName,mapChildren.name,mapChildren.category,mapChildren.name)">{{ mapChildren.count }}篇专业文章</span>
        </div>
        <div class="map_desc">{{ mapChildren.desc }}</div>
        <div class="map_related">
          <span>相关阅读：</span>
          <ul>
            <template v-for="(item, index) in mapChildren.list">
              <li v-if="mapChildren.list" :key="index" class="more-item" @click="tabClick(mapName,item.name,mapChildren.category,mapChildren.name)">
                <a href="javascript:;">{{ item.name }}</a>
              </li>
            </template>

          </ul>
        </div>
      </div>
      <!--          <div class="map_bottom_tab" v-cloak :class="{'hide':showChild}" @toushstart.prevent.stop="">
    <div class="map_name">{{mapChildren.name}}<span class="more-articles" @click.prevent.stop="testClick()">300篇专业文章</span></div>
    <div class="map_desc">{{mapChildren.desc}}</div>
    <div class="map_related"><span>相关阅读：</span>
        <ul>
   <li class="more-item"><a href="javascript:;">超声</a></li>
   <li class="more-item"><a href="javascript:;">超声</a></li>
   <li class="more-item"><a href="javascript:;">超声</a></li>
   <li class="more-item"><a href="javascript:;">超声</a></li>
   <li class="more-item"><a href="javascript:;">超声</a></li>
   <li class="more-item"><a href="javascript:;">超声</a></li>
   <li class="more-item"><a href="javascript:;">超声</a></li>
        </ul>
    </div>
</div> -->
      <div v-show="showMask" class="mask-guide" @click="clearMask()">
        <div class="top-line">

          <div class="line-main" />
          <div class="line-cap" />
          <div class="line-text">返回上一节点</div>
        </div>
        <div class="bottom-line">
          <div class="line-text">相关文章阅读</div>
          <div class="line-cap" />
          <div class="line-main" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import relationMap from './relation_map'
export default relationMap
</script>

<style scoped>
html,
body,
div,
form,
img,
ul,
ol,
li,
dl,
dt,
dd,
p,
h1,
h2,
h3,
h4,
h5,
h6,
button,
input,
textarea {
  margin: 0;
  padding: 0;
}

img {
  border: 0;
  display: block;
}

ul,
ol,
li {
  list-style: none;
}
/* 添加html5标签的reset */

address,
article,
aside,
canvas,
details,
summary,
section,
header,
footer,
hgroup,
figure,
figcaption,
menu,
nav {
  display: block;
  margin: 0;
  padding: 0;
}

audio,
canvas,
progress,
video {
  display: inline-block;
  /* 1 */
  vertical-align: baseline;
  /* 2 */
}

[hidden],
template {
  display: none;
}

a:active,
a:hover {
  outline: 0;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

td,
th {
  padding: 0;
}

#mylegend {
  font-size: 0;
  line-height: 0;
  canvas {
    margin: 0 auto;
  }
}
</style>

<style lang="scss" scoped>
@import "./relation_map.scss";
</style>
