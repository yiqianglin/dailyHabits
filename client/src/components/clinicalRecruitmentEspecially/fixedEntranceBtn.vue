<template id="tpl_fixed_entrance_btn">
  <a class="entrance-btn" href="javascript:;" @click="btnClick">
    试验查询通道
  </a>
</template>

<script>
export default {
  methods: {
    btnClick () {
      this.$emit('btnClick')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~src/assets/style/common-util";
.entrance-btn{
    width: 2.56rem;
    height: .72rem;
    display: block;
    background-image: linear-gradient(-133deg, #00C79B 0%, #0DB6A4 100%);
    line-height: .72rem;
    text-align: center;
    border-radius: .36rem;
    position: fixed;
    bottom: .56rem;
    right: .28rem;
    color:  #fff;
    z-index: 1;
    @include setTouchBackground;
}
</style>
