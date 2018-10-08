<template id="tpl_actionbar" style="display:none;height:0;">
  <div class="actionbox">
    <transition name="actionbar" mode="out-in">
      <div v-show="showActionbar" :class="{fixed: fixed}" class="actionbar" @touchmove="touchAction('actionbar', $event)">
        <div v-show="options.showDoubt" class="doubt-item" @click="dClick">
          <div class="bar"><p>您有什么想问的</p></div>
        </div>
        <div v-show="options.showHelp" :ptag="hStatus === 0 ? 'ydd_details_support' : 'ydd_details_supportcancel'" class="item" @click="hClick">
          <transition name="helptext">
            <div v-show="!hStatus&&showHelpText&&options.showAnimation&&showAnimationNum<3" class="help-text"/>
          </transition>
          <div v-show="!hStatus&&options.showAnimation" id="help-animation" class="help-animation"/>
          <img v-show="!hStatus&&!options.showAnimation" :src="require('src/assets/images/mobile/actionbar/help.png')" >
          <img v-show="hStatus" :src="require('src/assets/images/mobile/actionbar/helped.png')" >
          <span v-show="showPlus" class="plus">+1</span>
          <p class="ellipsis">{{ hCount ? '有帮助 ' + hCount: '有帮助' }}</p>
        </div>
        <div v-show="options.showFavor" :ptag="fStatus === 0 ? 'ydd_details_collect' : 'ydd_details_collectcancel'" class="item" @click="fClick">
          <img v-show="!fStatus" :src="require('src/assets/images/mobile/actionbar/favorite.png')" >
          <img v-show="fStatus" :src="require('src/assets/images/mobile/actionbar/favorited.png')" >
          <p class="ellipsis">{{ fStatus ? '已收藏' : '收藏' }}</p>
        </div>
        <div v-show="options.showFdbk" class="item" @click="fbClick">
          <img v-show="!fbStatus && !showFeedback" :src="require('src/assets/images/mobile/actionbar/feedback.png')" >
          <img v-show="!fbStatus && showFeedback" :src="require('src/assets/images/mobile/actionbar/feedbackon.png')" >
          <img v-show="fbStatus" :src="require('src/assets/images/mobile/actionbar/feedbacked.png')" >
          <p class="ellipsis">{{ fbStatus ? '已评价' : '评价' }}</p>
        </div>
      </div>
    </transition>
    <transition name="mask" mode="out-in">
      <div v-show="showFeedback || showDoubtArea" class="mask" @click="clickMask" @touchmove="touchAction('mask', $event)"/>
    </transition>
    <transition name="feedback" mode="out-in">
      <div v-show="showFeedback" class="feedback" @touchmove="touchAction('feedback', $event)">
        <div class="header">
          <img :ptag="'commernt_close:' + page" :src="require('src/assets/images/mobile/actionbar/close.png')" class="close" @click="closeFeedback">
          <p class="title">{{ star >= 0 ? starText[star] : options.tid === 4 ? '请您评价：' + name + '-' + tab + '章节' : '请您对这篇文章进行评价' }}</p>
          <p>
            <template v-for="(item, index) in starText">
              <span :key="index" :class="{active: star >= index}" class="star" @click="clickStar(index)"/>
            </template>
          </p>
        </div>
        <div class="content">
          <div class="info">
            <div :class="{maskon: predefined.length > 9}" class="predefined">
              <div>
                <div v-for="item in predefined" :key="item" class="item">
                  <input :value="item" v-model="selected" type="checkbox">
                  <span class="label">{{ item }}</span>
                </div>
              </div>
            </div>
            <textarea id="feedbackArea" v-model.trim="other" class="other" maxlength="300" placeholder="其他建议请在此填写，谢谢" @input="feedbackHeight"/>
            <input :class="{enabled:star>-1}" class="submit" type="submit" value="提交"
                   @click.prevent="feedback">
          </div>
        </div>
      </div>
    </transition>
    <transition name="feedback" mode="out-in">
      <div v-show="showDoubtArea" class="doubt-area" @touchmove="touchAction('doubt', $event)">
        <div class="content">
          <p class="title">{{ options.tid === 17 ? '对该视频有疑问' : '您有什么想问的' }}</p>
          <div class="doubt-nput">
            <textarea v-model.trim="doubtInput" maxlength="150" placeholder="任何疑问请在此填写，谢谢"/>
            <span class="num">{{ doubtInput.length+'/150' }}</span>
          </div>
          <div class="submit-wrap">
            <div v-show="showFollow" :class="{off: follow}" :ptag="follow ? 'YDD_ask_cancel|' + (docid ? name + '文章' : postKey) : ''" class="focus" @click="follow = !follow">关注该疾病</div>
            <div class="tip">最新回复可在我的关注中查看</div>
            <button :ptag="'YDD_ask_up|' + (docid ? name + '文章' : postKey)" class="btn" @click="submitDoubt">提 交</button>
          </div>
          <i class="close" @click="closeDoubt"/>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import actionbar from './actionbar'
export default actionbar
</script>

<style lang="scss" scoped src="./actionbar.scss" />
