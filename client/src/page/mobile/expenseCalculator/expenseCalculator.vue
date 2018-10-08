<template>
  <div v-cloak class="container">
    <tmenu :stag="diseasePanelData.selected || name" name="计费工具" @callback="tmenuCb" />

    <ul class="tab-header-ul">
      <li :class="{active: pageComponent === 'diseaseCount'}" class="tab-header-li" @click="tabHeaderClick('diseaseCount')">
        <span>治疗费用</span>
        <a href="javascript:;" class="tab-header-a btn-link" />
      </li>
      <li :class="{active: pageComponent === 'drugsPrice'}" class="tab-header-li" @click="tabHeaderClick('drugsPrice')">
        <span>药品价格</span>
        <a href="javascript:;" class="tab-header-a btn-link" />
      </li>
    </ul>
    <!-- component -->
    <component :is="pageComponent" :ref="pageComponent" @toast="toastShow" />
    <!-- <disease-count v-show="pageComponent === 'diseaseCount'" :ref="'diseaseCount'" @toast="toastShow" />
    <drugsPrice v-show="pageComponent === 'drugsPrice'" :ref="'drugsPrice'" @toast="toastShow" /> -->
    <!--toast-->
    <transition name="toast-fade">
      <div v-if="toast.isShow" class="toast-msg">
        <span v-if="toast.type === 1" class="success-btn" /><p class="msg">{{ toast.msg }}</p>
      </div>
    </transition>
  </div>
</template>

<script>
import expenseCalculator from './expenseCalculator'
export default expenseCalculator
</script>

<style lang="scss" scoped>
@import "./expenseCalculator.scss";
</style>
