<template id="tpl_disease_cost">
  <div class="disease-cost-v2-wrp">
    <div class="expense-calculator">

      <!--头部-->
      <div :class="{'big': insuredExpendCost}" class="calculator-peper-top">
        <div class="top">
          <span class="name">{{ diseaseShow || diseasePanelData.selected }}</span>
          <ul v-show="locationPanelData.selected" class="tag-ul">
            <li class="tag-li">{{ locationShow }}</li>
            <li class="tag-li">三甲</li>
          </ul>
          <span class="change-selection"><a href="javascript:;" class="btn-link" @click="filterPanelShow">修改</a></span>
        </div>
        <div v-show="chartData.totalAverage" class="data-detail">
          <template v-if="!insuredExpendCost">
            <p class="p1">{{ isShowCustomizationCost ? '个人治疗费用' : '平均治疗费用' }}</p>
            <p class="p2">约<span class="fontNum">{{ chartData.totalAverage }}</span>万元<span class="deviation-btn" @click="feedBackBtnClick">纠错</span></p>
          </template>
          <template v-else>
            <p class="p1">您需自己支付</p>
            <p class="p2">约<span class="fontNum">{{ personalCost }}</span>万元<span class="deviation-btn" @click="feedBackBtnClick">纠错</span></p>
            <p class="p3">医保报销约<span class="fontNum">{{ insuredExpendCost }}</span>万元、总费用约<span class="fontNum">{{ chartData.totalAverage }}</span>万元</p>
          </template>
        </div>
      </div>

      <!--中部治疗明细和环图绘制区域-->
      <div class="calculator-paper-middle">
        <div class="top">
          <span class="title">{{ chartAreaTitle }}</span>
          <template v-if="!dataEmpty && canvasInited">
            <a v-if="customizationCollapse === false" href="javascript:;" class="collapse open btn-link" @click="collapseBtnClick(0)">修改</a>
            <a v-else href="javascript:;" class="collapse close btn-link" @click="collapseBtnClick(1)">收起</a>
          </template>
          <span v-if="chartAreaTitle === '平均治疗明细'" class="remark">总费用随具体方案不同而变化，请根据个人情况选择</span>
        </div>
        <!--个人明细选择区域-->
        <div v-show="customizationCollapse === true" class="frequency-selection-are show">
          <ul class="selection-ul">

            <li v-for="(item, index) in customizationData" :key="index" class="selection-li">
              <a herf="javascript:;" class="btn-link" @click="modifyFrequency(item)">
                <span :style="{background: item.color}" class="item-decoration"/>
                <span class="item-name">{{ item.name }}</span>
                <span v-if="item.slot" class="frequency">
                  <template v-if="item.name !== '放疗'">
                    <!--计算对应次数的每项总价-->
                    <span v-if="getCustomizationItemCost(item.name, item.slot[0].values[item.slot[0].defaultIndex])" class="avg-cost fontNum">
                      {{ getCustomizationItemCost(item.name, item.slot[0].values[item.slot[0].defaultIndex]) }}
                    </span>
                    <template v-if="item.slot[0].currentValue === '请选择次数'">
                      <span class="gray">请选择</span>
                    </template>
                    <template v-else>
                      <span class="fontNum">
                        {{ item.slot[0].values[item.slot[0].defaultIndex] | frequencyFormate }}次
                      </span>
                    </template>
                  </template>
                  <template v-else>
                    <span v-if="getCustomizationItemCost(item.name, item.slot[1].values[item.slot[1].defaultIndex], item.slot[0].currentValue)" class="avg-cost fontNum">
                      {{ getCustomizationItemCost(item.name, item.slot[1].values[item.slot[1].defaultIndex], item.slot[0].currentValue) }}
                    </span>
                    <template v-if="item.slot[1].currentValue === '请选择次数'">
                      <span class="gray">请选择</span>
                    </template>
                    <template v-else>
                      <span class="fontNum">
                        {{ item.slot[1].values[item.slot[1].defaultIndex] | frequencyFormate }}次
                      </span>
                    </template>

                  </template>
                </span>
                <span v-if="item.slot" class="right-arrow"/>
                <span v-if="item.value" class="other-count"><span class="fontNum">{{ item.value }}</span>万元</span>
              </a>
            </li>
          </ul>
        </div>
        <!--ve-pie-area-->
        <div v-show="customizationCollapse === false" class="ve-pie-area show">
          <div class="ve-pie-area-inner">
            <ve-ring
              ref="chartRing"
              :settings="chartSettings"
              :data="chartData"
              :width="chartSettings.width"
              :height="chartSettings.height"
              :legend-visible="false"
              :loading="canvasLoading"
              :colors="chartSettings.color"
              :tooltip-visible="false"
              :lenged="chartSettings.legend"
              :extend="chartExtend"
              :events="chartSettings.chartEvents"
              :grid="chartSettings.grid"
            >
              <div
                v-if="dataEmpty"
                class="data-empty">暂无数据</div>
            </ve-ring>
          </div>
        </div>
      </div>

      <!--底部医保选择-->
      <div class="calculator-paper-footer">
        <div class="other-selection">
          <div class="top">
            <span class="label">医保报销计算</span>
            <span v-if="!isShowInsuredRemark && insuredExpendCost" :class="{'zero': insuredExpendCost}" class="num">可报销<span class="fontNum">{{ insuredExpendCost }}</span>万元</span>
            <span v-if="isShowInsuredRemark" class="remark">请选择参保类型</span>
          </div>
          <div class="selection">
            <a herf="javascript:;" class="btn-link" @click="modifySBType">
              <span class="selection-label">医保类型</span>
              <span class="selection-value">{{ SBTypePickerPanelData.slot[0].currentValue }}</span>
              <span class="right-arrow"/>
            </a>
          </div>
          <div class="selection">
            <a herf="javascript:;" class="btn-link" @click="modifyCBType">
              <span class="selection-label">参保类型</span>
              <span class="selection-value">{{ CBTypePickerPanelData.slot[0].currentValue }}</span>
              <span class="right-arrow"/>
            </a>
          </div>
        </div>
      </div>

      <div class="bottom-remark">
        <p>费用明细来自LinkDoc，报销数据来自各地报销政策</p>
        <p>实际产生费用和报销情况可能与结果存在差异，该工具仅供参考</p>
      </div>
    </div>

    <div class="pop-wrp">
      <div
        v-if="isShowMask"
        class="mask"
        @click="maskClick"/>
      <!--筛选面板-->
      <filter-panel
        :is-show="isShowFilterPanel"
        :title="'筛选条件'"
        :show-back-btn="false"
        :show-closek-btn="true"
        @onBack="filterPanelOnBack"
        @onClose="filterPanelOnClose"
        @onSure="filterPanelOnSure"
      >
        <template slot="content">
          <div
            ref="filter-panel-content"
            class="filter-panel-content">
            <filter-li
              :data-label="'疾病名称'"
              :data-value="diseasePanelData.selected"
              @optionsClick="filterOptionsClick"/>
            <filter-li
              :data-label="'所在城市'"
              :data-value="locationPanelData.selected || '正在定位中'"
              @optionsClick="filterOptionsClick"/>
            <filter-li
              :unable="true"
              :data-label="'治疗方式'"
              :data-value="'所有'"/>
            <filter-li
              :unable="true"
              :data-label="'就医医院等级'"
              :data-value="'三甲'"/>
          </div>
        </template>
      </filter-panel>
      <!--筛选面板 疾病-->
      <filter-disease-panel
        :is-show="isShowDiseasePanel"
        :title="'疾病名'"
        :show-back-btn="true"
        :show-closek-btn="false"
        :data="diseasePanelData"
        @diseasePanelOnBack="diseasePanelOnBack"
        @diseaseSelectionClick="diseaseSelectionClick"
      />
      <!--筛选面板 城市-->
      <filter-sort-panel
        :is-show="isShowLocationPanel"
        :title="'城市选择'"
        :show-back-btn="true"
        :show-closek-btn="false"
        :dom-id="'location'"
        :data="locationPanelData"
        :data-key="'city'"
        @onFilterSelect="onLocationPanelSelect"
        @onBack="locationPanelOnBack"
        @onClose="locationPanelOnClose"
      />
      <!--次数面板 picker-->
      <picker
        :is-show="isShowCustomizationPickerPanel"
        :data="customizationPickerPanelData && customizationPickerPanelData.slot" :title="customizationPickerPanelData && customizationPickerPanelData.name"
        :reset-after-select-parent-slots="true"
        @onCancel="customizationPickerCancel"
        @onConfirm="customizationPickerConfirm"
        @onChange="customizationPickerOnChange"
      />
      <!--社保类型面板 picker-->
      <picker
        :is-show="isShowSBTypePickerPanel"
        :data="SBTypePickerPanelData && SBTypePickerPanelData.slot" :title="SBTypePickerPanelData && SBTypePickerPanelData.name"
        @onCancel="SBTypePickerCancel"
        @onConfirm="SBTypePickerConfirm"
      />
      <!--参保类型面板 picker-->
      <picker
        :is-show="isShowCBTypePickerPanel"
        :data="CBTypePickerPanelData && CBTypePickerPanelData.slot" :title="CBTypePickerPanelData && CBTypePickerPanelData.name"
        @onCancel="CBTypePickerCancel"
        @onConfirm="CBTypePickerConfirm"
      />

      <!--反馈面板-->
      <filter-panel
        :type="1"
        :is-show="isShowFeedbackPanel"
        :title="'提供您实际的费用区间'"
        :remark="'帮助更多患者查询治疗费用'"
        :show-back-btn="false"
        :show-reset-btn="true"
        :show-closek-btn="true"
        @onReset="feedbackPanelRest"
        @onClose="feedbackPanelClose"
      >
        <template slot="content">
          <div
            ref="feedback-panel-content"
            class="feedback-panel-content">
            <div class="fast-choice">
              <p class="title">快速选择</p>
              <ul class="fast-choice-ul">
                <li v-for="(item, index) in feedbackPanelData.fastChoice" :key="index"
                    :class="{ 'active': index === feedbackPanelData.fastChoiceSelectedIndex }" class="fast-choice-li fontNum"
                    @click="feedBackFastChoiceClick(index)"
                >
                  {{ item | fastChoiceFormate }}
                  <a
                    href="javascript:;"
                    class="btn-link"/>
                </li>
              </ul>
            </div>
            <div class="accurate-choice">
              <p class="title">手动输入更准确（万）</p>
              <div class="input-wrp">
                <!-- <input v-number-only:min v-model="feedbackPanelData.accurateChoice.min" class="input min-input" type="text" pattern="^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$" placeholder="最低价"> -->
                <input v-model="feedbackPanelData.accurateChoice.min" class="input min-input fontNum" type="tel" maxlength="5" placeholder="最低价">
                <span class="separator">~</span>
                <input v-model="feedbackPanelData.accurateChoice.max" class="input max-input fontNum" type="tel" maxlength="5" placeholder="最高价">
                <!-- <span class="input min-input">1212121212</span>
                <span class="separator">~</span>
                <span class="input max-input">1</span> -->
              </div>
            </div>
            <div :class="{'active': feedbackBtnStatus}" class="sure-btn" @click="feedbackBtnClick">确定<a href="javascript:;" class="btn-link" /></div>
          </div>
        </template>
      </filter-panel>
    </div>
  </div>
</template>

<script>
import diseaseCostV2 from './diseaseCostV2'
export default diseaseCostV2
</script>

<style lang="scss" scoped src="./diseaseCostV2.scss" />
