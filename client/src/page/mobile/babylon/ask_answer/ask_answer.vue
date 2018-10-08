<template>
    <div class="ask_answer" id="ask_answer" v-cloak>
        <div class="welcome" v-if="isWelcome">
            <div class="title">欢迎来到</div>
            <div class="big-title">巴比伦</div>
            <ul>
                <li>
                    <p class="info-title">检查症状</p>
                    <p class="desc">描述您的症状并接受评估</p>
                </li>
                <li>
                    <p class="info-title">理解健康状况</p>
                    <p class="desc">理解您的生活方式如何影响您的健康</p>
                </li>
            </ul>
            <div class="btns">
                <div class="btn">检查症状<a class="btn-link" href="javascript:void(0)" @click="isWelcome=false"></a></div>
                <div class="btn">进行健康测评<a class="btn-link" href="javascript:void(0)" tourl="/babylon/redirect.html?env=1"></a></div>
            </div>
        </div>
        <template v-else>
            <div class="ask-list" :style="{paddingBottom:paddingBottom+'px'}">
                <template v-for="item in askList" v-if="!item.hide">
                    <!-- <transition name="slide-fade"> -->
                    <div class="diagnosis" v-if="item.type===3">
                        <template v-if="item.triage">
                            <div class="triage" v-if="item.triage.title">
                                <div class="title">{{item.triage.title}}</div>
                                <div class="desc">{{item.triage.text}}</div>
                            </div>
                            <div class="evidence" v-if="item.triage.explanation">
                                <div class="title">为什么如此推荐？</div>
                                <div class="desc">{{item.triage.explanation}}</div>
                            </div>
                        </template>
                        <div class="possible-causes">
                            可能原因
                            <i class="icon" @click="showPossible"></i>
                        </div>
                        <div class="disease-list">
                            <div class="disease" v-for="item in item.vec_conditions" @click="name=item.name">
                                <div class="name">{{item.name}}</div>
                                <div class="likely">
                                    <div class="likely-name">{{item.label}}</div>
                                    <ul><li v-for="itemi in getActiveNum(item.stars)" :class="{active:itemi==='active'}"></li></ul>
                                </div>
                                <div class="desc">{{item.text}}</div>
                            </div>
                        </div>
                        <!-- <div class="item" v-if="item.vec_conditions&&item.vec_conditions[0]">
                            <div class="title">跟您病症相似的人通常会有以下情况</div>
                            <div class="card">
                                <div class="disease">
                                    <div class="name">{{item.vec_conditions[0].name}}</div>
                                    <div class="likely">
                                        <div class="likely-item" v-for="item in getActiveNum(item.vec_conditions[0].stars)" :class="{active:item==='active'}"></div>
                                    </div>
                                    <div class="weui-progress">
                                        <div class="weui-progress__bar">
                                            <div class="weui-progress__inner-bar js_progress" :style="{width:vec_conditions[0].probability+'%'}"></div>
                                        </div>
                                        <div class="ratio">{{vec_conditions[0].probability+'%'}}</div>
                                    </div>
                                </div>
                                <div class="desc">{{item.vec_conditions[0].text}}</div>
                                <ul class="list">
                                    <li>不要惊慌，这只是一个可能性诊断结果。</li>
                                    <li>有80%的人都会有这些症状（病毒感染脑和脊髓的内层）,这通常需要到急诊科就诊。</li>
                                </ul>
                            </div>
                        </div>
                        <div class="item" v-if="item.vec_conditions&&item.vec_conditions.length>1">
                            <div class="title">这些症状的其他可能原因包括</div>
                            <div class="card" v-for="item in item.vec_conditions.slice(1)">
                                <div class="disease">
                                    <div class="name">{{item.name}}</div>
                                    <div class="likely">
                                        <div class="likely-item" v-for="itemi in getActiveNum(item.stars)" :class="{active:itemi==='active'}"></div>
                                    </div>
                                    <div class="weui-progress">
                                        <div class="weui-progress__bar">
                                            <div class="weui-progress__inner-bar js_progress" :style="{width:item.probability+'%'}"></div>
                                        </div>
                                        <div class="ratio">{{item.probability+'%'}}</div>
                                    </div>
                                </div>
                                <div class="desc">{{item.text}}</div>
                            </div>
                        </div> -->
                        <!-- <div class="record" @click="showRecord">回答记录</div> -->
                    </div>
                    <div class="ask-item" v-if="item.type===1">
                        <img :src="require('src/assets/images/mobile/babylon/logo.png')">
                        <div class="ask-item-wrap" v-for="itemi in item.list">
                            <div class="item">
                                {{itemi}}
                            </div>
                        </div>
                        <!-- <div class="result" v-if="item.result" @click="getDiagnosis">
                            <p class="title">您的诊断结果</p>
                            <p class="view">点击查看具体的症状分析结果</p>
                        </div> -->
                    </div>
                    <div class="answer-item" v-else>
                        <div class="item" v-for="itemi in item.list">
                            {{itemi}}
                        </div>
                    </div>
                    <!-- </transition> -->
                </template>
                <!-- <p class="time">星期一  12:30</p> -->
            </div>
            <transition name="fade">
                <div class="mask" v-if="overviewData" @click="name = ''"></div>
            </transition>
            <transition name="slide-fade">
                <div class="overview" v-if="overviewData">
                    <div class="back" @click="name = ''">返回</div>
                    <template v-for="item in overviewData">
                        <div class="title">{{name}}</div>
                        <div class="info">
                            <div class="info-title">{{item.title}}</div>
                            <ul v-if="item.items&&item.items.length">
                                <li v-for="itemi in item.items">{{itemi}}</li>
                            </ul>
                        </div>
                    </template>
                </div>
            </transition>
            <div class="fix-bottom pagenav" id="fixBottom">
                <div class="single-select" v-if="!ageSel">
                    <div class="item">自己（大于16岁）<a class="btn-link" href="javascript:void(0)" @click="ageSel=1"></a></div>
                    <div class="item">孩子（0到15岁）<a class="btn-link" href="javascript:void(0)"  @click="ageSel=2"></a></div>
                </div>
                <div class="single-select" v-else-if="!gender">
                    <div class="item">女<a class="btn-link" href="javascript:void(0)" @click="setGender('female')"></a></div>
                    <div class="item">男<a class="btn-link" href="javascript:void(0)"  @click="setGender('male')"></a></div>
                </div>
                <div class="btn top-line" v-else-if="!age">选择生日<a class="btn-link" href="javascript:void(0)" @click="setDate()"></a></div>
                <transition name="feedback" mode="out-in" v-else-if="isRating">
                    <div>
                        <div class="feedback">
                            <!-- <img v-show="star > -1" @click="closeFeedback" :ptag="'commernt_close:' + page" class="close" :src="require('src/assets/images/mobile/actionbar/close.png')" /> -->
                            <p class="title">请您对此次诊断结果进行评价</p>
                            <p class="star-text" v-show="star>0">{{starText[star-1]}}</p>
                            <div class="star-list">
                                <span v-for="(item, index) in starText" class="star" :class="{active: star > index}" @click="clickStar(index)"></span>
                            </div>
                        </div>
                        <div class="btn top-line">确定<a class="btn-link" href="javascript:void(0)" @click="caseRating()"></a></div>
                    </div>
                </transition>
                <div class="weui-search-bar ft32" id="searchBar" v-else-if="isInput">
                    <form class="weui-search-bar__form" action="javascript:void(0);" @submit="submitInput">
                        <div class="weui-search-bar__box">
                            <input type="text" class="weui-search-bar__input" placeholder="请输入" required="" v-model="inputVal">
                            <a href="javascript:" class="weui-icon-clear"></a>
                        </div>
                        <label class="weui-search-bar__label">
                            <span>请输入</span>
                        </label>
                    </form>
                    <a href="javascript:" class="weui-search-bar__cancel-btn">取消</a>
                </div>
                <template v-else-if="selectedList.length>1">
                    <div class="multi-select ft32" >
                        <div class="weui-cells weui-cells_checkbox">
                            <div class="item-list">
                                <label class="weui-cell weui-check__label" v-for="(item,index) in selectedList" :for="'selected_'+index">
                                    <div class="weui-cell__hd multiple" v-if="item.type===1">
                                        <input type="checkbox" class="weui-check" :id="'selected_'+index" :value="item.eid" v-model="multiChecked">
                                        <i class="weui-icon-checked"></i>
                                    </div>
                                    <div class="weui-cell__hd" v-else>
                                        <input type="radio" class="weui-check" name="selected_radio" :id="'selected_'+index" :value="item.eid" v-model="singleChecked">
                                        <i class="weui-icon-checked"></i>
                                    </div>
                                    <div class="weui-cell__bd">
                                        <p>{{item.value}}</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="btn top-line">确定<a class="btn-link" href="javascript:void(0)" @click="selectClk"></a></div>
                </template>
                <div class="single-select" v-else-if="distress.show">
                    <div class="item">{{distress.phoneValue||'拨打 120'}}<a class="btn-link" href="tel:120"></a></div>
                    <div class="item">{{distress.value}}<a class="btn-link" href="javascript:void(0)"  @click="specialContinue()"></a></div>
                </div>
                <!-- <template v-else-if="multiList.length>1">
                    <div class="multi-select ft32" >
                        <div class="weui-cells weui-cells_checkbox">
                            <div class="item-list">
                                <label class="weui-cell weui-check__label" v-for="(item,index) in multiList" :for="'multi_'+index">
                                    <div class="weui-cell__hd">
                                        <input type="checkbox" class="weui-check" :id="'multi_'+index" :value="item.eid" v-model="multiChecked">
                                        <i class="weui-icon-checked"></i>
                                    </div>
                                    <div class="weui-cell__bd">
                                        <p>{{item.value}}</p>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="btn top-line">确定<a class="btn-link" href="javascript:void(0)" @click="multiClk"></a></div>
                </template>
                <template v-else-if="singleList.length>1">
                    <div class="single-select ft32" >
                        <div class="weui-cells weui-cells_radio">
                            <div class="item-list">
                                <label class="weui-cell weui-check__label" v-for="(item,index) in singleList" :for="'single_'+index">
                                    <div class="weui-cell__bd">
                                        <p>{{item.value}}</p>
                                    </div>
                                    <div class="weui-cell__ft">
                                        <input type="radio" class="weui-check" :id="'single_'+index" :value="item.eid" v-model="singleChecked">
                                        <span class="weui-icon-checked"></span>
                                    </div>
                                </label>
                            </div>
                        </div>
                    </div>
                    <div class="btn top-line">确定<a class="btn-link" href="javascript:void(0)" @click="singleClk"></a></div>
                </template> -->
                <div class="btn top-line" v-else-if="btnName">{{btnName.value}}<a class="btn-link" href="javascript:void(0)" @click="btnClk(btnName.eid,btnName.value)"></a></div>
            </div>
            <div class="weui-toast ft32" v-show="loading.show">
                <i class="weui-loading weui-icon_toast"></i>
                <p class="weui-toast__content">{{loading.tip}}</p>
            </div>
        </template>
    </div>
</template>

<script>
  import ask_answer from './ask_answer'
  export default ask_answer
</script>

<style lang="scss" scoped>
  @import './ask_answer.scss'
</style>
