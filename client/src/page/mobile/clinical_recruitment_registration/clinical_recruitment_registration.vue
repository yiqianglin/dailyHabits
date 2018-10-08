<template>
  <div v-cloak id="registration" class="container">
    <tmenu name="招募通道" @callback="tmenuCb" />
    <div class="h-title">个人信息</div>
    <div class="information">
      <p class="top-remark">请
      <span class="underline">真实</span>填写个人信息完成申请：</p>
      <div class="form-li">
        <label for="name" class="form-label">姓名：</label>
        <input id="name" v-model="formData.name.data" class="form-input" type="text" maxlength="8">
        <p class="judge-remark">{{ judgeName }}</p>
      </div>
      <div class="form-li">
        <label for="name" class="form-label">癌症种类：</label>
        <multi-select v-model="value" :options="options" :searchable="false" :close-on-select="true" :show-labels="false" :allow-empty="false" placeholder="" />
        <p class="judge-remark" />
      </div>
      <div class="form-li">
        <label for="name" class="form-label">联系电话(+86)：</label>
        <input id="name" v-model="formData.phone.data" class="form-input" type="phone" maxlength="11">
        <p class="judge-remark">{{ judgePhone }}</p>
      </div>
    </div>
    <div class="sumit-wrp">
      <a class="submit-btn" href="javascript:;" @click="submit">提交申请</a>
      <p class="sumit-remark">该信息仅限于用户沟通使用，不会用于商业目的</p>
    </div>

    <transition name="toast-fade">
      <div v-if="toast.isShow" class="toast-msg">
        <p class="msg">{{ toast.msg }}</p>
      </div>
    </transition>
    <!-- <confirm-dialog :isShow="false" :heightNum="3.8">
            <template slot="header">
                <div class="header">
                    重复提交
                </div>
            </template>
            <template slot="main">
                <div class="main">
                    已经提交过本试验的申请，确定要重新提交？
                </div>
            </template>
        </confirm-dialog> -->
  </div>
</template>

<script>
import clinicalRecruitmentRegistration from './clinical_recruitment_registration'
export default clinicalRecruitmentRegistration
</script>

<style lang="scss" scoped>
@import "./clinical_recruitment_registration.scss";
.multiselect {
  min-height: 0.4rem;
  font-size: 0.26rem;
  line-height: 0.26rem;
  /deep/ .multiselect__select {
    display: none;
  }
  /deep/ .multiselect__tags {
    min-height: auto;
    padding: 0.25rem 0.12rem;
    border-radius: 0;
    font-size: 0.26rem;
    line-height: 0.26rem;
    background: #f3f3f3;
    border: 1px solid #e0e0e0;
  }
  /deep/ .multiselect__single {
    min-height: 0.26rem !important;
    line-height: 0.26rem !important;
    height: 0.26rem !important;
    margin-bottom: 0;
    background: transparent;
    padding: 0 !important;
    font-size: 0.26rem;
    border: none;
    vertical-align: baseline !important;
    border-radius: 0;
  }
  /deep/ .multiselect__option--highlight {
    background: #fff;
    color: #35495e;
  }
  /deep/ .multiselect__option--selected {
    background: #fff;
    color: #35495e;
  }
}
</style>
