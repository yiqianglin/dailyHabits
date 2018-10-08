<template>
  <div v-cloak id="clinical_recruitment" :class="{'category-drug': queryDrugName}" class="container">
    <tmenu :stag="stag" name="临床试验信息" @callback="tmenuCb" />
    <div v-if="queryDrugName && category === 'drug'" class="cagetory-drugs">
      <div id="content-wrp" class="content-wrp">
        <div class="remark">
          声明：以下信息均转载自国家药品监督管理局药品审评中心网站，具体以实际情况为准
        </div>
        <!-- <paper :paperlist="feedsContent.data" :loaded="feedsContent.loaded" :rkey="'sss'"></paper>
              -->

        <div id="paper1" class="paper">
          <template v-for="(item,index) in feedsContent.data">
            <div v-show="item.title!='' || item.text!=''" :key="index" :class="{'no-img':!item.op_image}" class="item">
              <div class="content-detail">
                <div class="info">
                  <div class="title no-desc">{{ item.title }}</div>
                  <ul v-if="item.op_keyword && item.op_keyword.length" class="item-tags">
                    <li v-for="item in item.op_keyword.slice(0,3)" :key="item">{{ item }}</li>
                  </ul>
                  <p class="releasetime">{{ item.releasetime }}</p>
                </div>
                <div v-if="item.op_image" class="img">
                  <img :src="item.op_image">
                </div>
              </div>
              <a href="javascript:;" class="btn-link" @click="toArticle(item,index)" />
            </div>
          </template>
          <div v-if="!feedsContent.isEmpty" class="check-all-btn" @click="goAllBtnClick">
            查看全部临床试验
            <a href="javascript:;" class="btn-link" />
          </div>
          <div v-if="feedsContent.isEmpty" class="paper-empty">{{ feedsContent.loaded?'暂时没有符合的临床试验':'数据加载中...' }}</div>
        </div>
      </div>
    </div>
    <div v-else class="cagetory-diseases">
      <div v-show="false&&showMask" class="mask" @click.prevent="clickMask" @touchmove.prevent/>
      <div class="tabs-row">
        <div :class="{active: filterSelected === 0}" class="item" @click="filterSelect(0)">全部</div>
        <div v-for="(item, index) in filterData" :key="index" :class="{active: index === filterSelected - 1}" class="item" @click="filterSelect(index+1)">
          {{ item.name }}
          <a href="javascript:;" class="btn-link" />
        </div>
      </div>
      <div id="content-wrp" class="content-wrp">
        <div class="remark">
          声明：以下信息均转载自国家药品监督管理局药品审评中心网站，具体以实际情况为准
        </div>
        <!-- <paper :paperlist="feedsContent.data" :loaded="feedsContent.loaded" :rkey="'sss'"></paper>
              -->

        <div id="paper2" class="paper">
          <template v-for="(item,index) in feedsContent.data">
            <div v-show="item.title!='' || item.text!=''" :key="index" :class="{'no-img':!item.op_image}" class="item">
              <div class="content-detail">
                <div class="info">
                  <div class="title no-desc">{{ item.title }}</div>
                  <ul v-if="item.op_keyword && item.op_keyword.length" class="item-tags">
                    <li v-for="item in item.op_keyword.slice(0,3)" :key="item">{{ item }}</li>
                  </ul>
                  <p class="releasetime">{{ item.releasetime }}</p>
                </div>
                <div v-if="item.op_image" class="img">
                  <img :src="item.op_image">
                </div>
              </div>
              <a href="javascript:;" class="btn-link" @click="toArticle(item,index)" />
            </div>
          </template>
          <p v-if="!feedsContent.isEmpty" class="loading">
            <span v-show="!feedsContent.loaded" class="dotting">
              <i/>
              <i/>
              <i/>
          </span>{{ feedsContent.loaded?'已经到底了':'正在加载更多' }}</p>
          <div v-if="feedsContent.isEmpty" class="paper-empty">{{ feedsContent.loaded?'暂时没有符合的临床试验':'数据加载中...' }}</div>
        </div>
      </div>

      <!--招募通道按钮-->
      <fixed-entrance-btn @btnClick="fixedEntranceBtnClick" />
      <!--招募/加群面板-->
      <select-panel :is-show="selectPanelIsShow" :positon-site="[1.42, 0, 1.07, 0]" @closePanel="selectPanelClose" @selectionClick="selectionClick" />

      <!--招募通道协议对话框-->
      <confirm-dialog :is-show="confirmIsShow" :height-num="10" :positon-site="[0,0,0,0]">
        <template slot="header">
          <div class="header">
            药物临床试验信息查询须知
          </div>
        </template>
        <template slot="main">
          <div ref="confirm_main" class="confirm_main">
            <div ref="confirm_main_inner">
              <!-- <p class="p1">招募须知：</p> -->
              <p class="p2">欢迎您使用由深圳腾爱医疗科技有限公司（以下简称本平台）提供的药物临床试验信息查询服务（以下简称本服务）。</p>
              <p class="p2">本服务所展示的药物临床试验信息均来源于国家药品监督管理局药品审评中心（http://www.cde.org.cn/）。药物临床试验（以下简称临床试验）是指通过人体志愿者/受试者进行的药物有效性、安全性和质量等问题的生物学科学研究，以证实或发现试验药物的临床、药理和/或其他药效学方面的作用、不良反应和/或吸收、分布、代谢及排泄等情况，目的是确定试验药物的安全性和有效性。药物临床试验的申办者一般为药品生产企业，开展药物临床试验的机构是已通过国家药品监督管理局的药物临床试验机构资格认定的医疗机构。药物临床试验的具体信息可在本平台的相关界面中进行查询、浏览。</p>
              <p class="p2">药物临床试验（以下简称临床试验）是指通过人体志愿者/受试者进行的药物有效性、安全性和质量等问题的生物学科学研究，以证实或发现试验药物的临床、药理和/或其他药效学方面的作用、不良反应和/或吸收、分布、代谢及排泄，目的是确定试验药物的安全性和有效性。药物临床试验的申办者一般为药品生产企业，开展药物临床试验的机构是已通过国家药品监督管理局的药物临床试验机构资格认定的医疗机构。药物临床试验的具体信息可在本平台的相关界面中进行查询、浏览。</p>
              <p class="p2">参与本服务，您需要向本平台提供您的真实个人信息（包括但不限于姓名、疾病种类、联系电话等），以便于本平台跟您建立联系并向您提供尽可能匹配的药物临床试验招募信息。本平台承诺，您提供的信息不会用于本服务以外的目的。</p>
              <p class="p2">您理解并同意，本平台仅向您提供中立的、免费的平台及信息查询服务，并非药物临床试验的申办者或开展者，本平台不参与临床试验的开展过程，不对临床试验过程中发生的任何结果负责。您在参与具体临床试验前，应当充分向申办者及药物临床试验机构了解该试验可能带来的后果及风险（具体参考问题列表详见附件）。您具有完全的权利决定您是否需要参与药物临床试验，本平台建议您在参与药物临床试验前应当与您的家人及主治医师进行充分的沟通协商。本平台无法保证一定会帮您检索到匹配的药物临床试验信息，并无法保证您是否可以成功入组参与药物临床试验。</p>
              <p class="p2">您参与本服务即视为您已理解并同意上述须知！</p>
            </div>
          </div>
        </template>
        <template slot="btn-gourp">
          <div class="btn-wrp">
            <a href="javascript:;" class="cancel-btn" @click="cancelBtnClick">返回</a>
            <a :class="['sure-btn', {unable: dialogAchieveEnd===false}]" href="javascript:;" @click="sureBtnClick">{{ dialogAchieveEnd ? '同意': '请完成阅读' }}</a>
          </div>
        </template>
      </confirm-dialog>

      <!--重复报名确认框-->
      <confirm-dialog :is-show="registrationRepeatIsShow" :height-num="3.8" @onSure="registrationRepeatSure" @onaClose="registrationRepeatClose" @onCancel="registrationRepeatClose">
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
      </confirm-dialog>

      <!--微信加群面板-->
      <communication-panel :is-show="communicationIsShow" :positon-site="[1.42, 0, 1.07, 0]" @closePanel="communicationClose" />
    </div>

  </div>
</template>

<script>
import clinicalRecruitment from './clinical_recruitment'
export default clinicalRecruitment
</script>

<style lang="scss" scoped>
@import "./clinical_recruitment.scss";
</style>
