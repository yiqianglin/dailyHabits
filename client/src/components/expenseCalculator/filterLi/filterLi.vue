<template id="tpl_filter_li">
  <div
    :class="{'unable': unable}"
    class="filter-li-wrp"
    @click="optionsClick"
  >
    <span class="label">{{ dataLabel }}</span>
    <span class="value">{{ dataValue }}</span>
    <span class="right-arrow"/>
    <a
      href="javascript:;"
      class="btn-link"/>
  </div>
</template>

<script>
import filterLi from './filterLi'
export default filterLi
</script>

<style lang="scss" scoped src="./filterLi.scss" />
