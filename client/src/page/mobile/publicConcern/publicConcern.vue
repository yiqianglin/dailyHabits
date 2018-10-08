<template>
  <div v-cloak class="container">
    <div v-cloak id="concern-container">
      <tmenu :zindex="100" name="大家在看" @callback="tmenuCb" />
      <div class="list-block">
        <div class="list-block-lib">
          <ul v-if="diseaseList.length" class="list-block-diseases">
            <template v-for="(item, index) in diseaseList">
              <li v-if="item.building === 0" :key="index" class="list-block-disease">
                <a :data-name="item.name" :data-type="item.type" href="javascript:;" @click="toOverview(item.name, item.type)">{{ item.name }}</a>
              </li>
              <li v-else :class="['list-block-disease', {building: item.building}]" :key="index">
                <a :data-name="item.name" :data-type="item.type" href="javascript:;" @click="toBuilding(item.name)">{{ item.name }}</a>
                <span>建设中</span>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import publicConcern from './publicConcern'
export default publicConcern
</script>

<style lang="scss" scoped>
@import "./publicConcern.scss";
</style>
