<template>
  <div v-cloak class="container">
    <div v-cloak id="doctor_team" class="doctor_team">
      <tmenu name="企鹅医典医学团队" @callback="tmenuCb" />
      <header>
        <div class="img" />
        <p class="title">企鹅医典医学团队</p>
        <p class="desc">由具备丰富经验的资深医学编辑组成<br>覆盖各细分领域，为用户提供科学、易读的医学科普内容 </p>
        <p class="email">联系方式：MedInfo@tencent.com </p>
      </header>
      <div class="team">
        <div class="title">主要团队成员</div>
        <ul class="list">
          <li class="doctor">
            <div class="doctor-img">
              <div class="img">
                <img src="http://s.pc.qq.com/tdf/baike/zhangfengxin.png">
              </div>
              <div class="doctor-desc">
                <p class="name">张凤新</p>
                <p class="desc">总编丨腾讯医疗资讯产品中心</p>
              </div>
            </div>
            <div class="profession">
              <p class="title-name">专业资历</p>
              <ul>
                <li>从事医学期刊和中、英文图书编辑工作15年</li>
                <li>负责医学图书、期刊编辑出版管理工作10余年 </li>
              </ul>
            </div>
            <div class="introduce">
              <p class="title-name">个人简介</p>
              <p class="desc">
                中国医科大学外科学专业硕士学位。曾先后担任人民卫生出版社期刊编辑出版中心主任、国际出版中心主任，负责书刊编辑出版管理工作。完成千余篇医学论文和数百本医学专业及科普图书的策划和审稿工作，精通医学内容编辑管理，熟悉临床医学各学科常见疾病国内外诊治规范和前沿进展。
              </p>
            </div>
          </li>
          <li class="doctor">
            <div class="doctor-img">
              <div class="img">
                <img src="http://s.pc.qq.com/tdf/baike/wangbo.png">
              </div>
              <div class="doctor-desc">
                <p class="name">王波</p>
                <p class="desc">主编丨腾讯医疗资讯产品中心</p>
              </div>
            </div>
            <div class="profession">
              <p class="title-name">专业资历</p>
              <ul>
                <li>中国医师协会循证医学专业委员会委员</li>
                <li>中华预防医学会流行病学分会青年委员</li>
                <li>中国药学会药物流行病学专业委员会青年委员</li>
                <li>教育部人文社会科学专家委员会委员</li>
                <li>《中华流行病学杂志》审稿人</li>
                <li>国际流行病学会会员</li>
                <li>Cochrane协作网成员</li>
              </ul>
            </div>
            <div class="introduce">
              <p class="title-name">个人简介</p>
              <p class="desc">
                2009年于北京大学获得医学博士（流行病学）学位，原中国医学科学院／北京协和医学院副研究员、中国协和医科大学出版社副社长（主持工作），长期从事循证医学、营养流行病学研究和专业医学百科的编纂。
              </p>
            </div>
          </li>
          <li class="doctor">
            <div class="doctor-img">
              <div class="img">
                <img src="http://s.pc.qq.com/tdf/baike/wangdi.png">
              </div>
              <div class="doctor-desc">
                <p class="name">王娣</p>
                <p class="desc">主编丨腾讯医疗资讯产品中心</p>
              </div>
            </div>
            <div class="profession">
              <p class="title-name">专业资历</p>
              <ul>
                <li>山东医科大学临床医学本科（英语班）</li>
                <li>北京大学医学部临床医学博士（皮肤性病学专业）</li>
              </ul>
            </div>
            <div class="introduce">
              <p class="title-name">个人简介</p>
              <p class="desc">
                担任《中国医学论坛报》医学编辑9年，《循环周刊》主编6年；“心在线”（北京）科技有限公司内容中心总监1年。对心血管、脑血管、糖尿病领域学术选题和活动策划、国内外学术会议报道和专家采访、专题文章撰写有丰富经验。
              </p>
            </div>
          </li>
          <li class="doctor">
            <div class="doctor-img">
              <div class="img">
                <img src="http://s.pc.qq.com/tdf/baike/qiaojing.png">
              </div>
              <div class="doctor-desc">
                <p class="name">乔静</p>
                <p class="desc">主编丨腾讯医疗资讯产品中心</p>
              </div>
            </div>
            <div class="profession">
              <p class="title-name">专业资历</p>
              <ul>
                <li>中国药科大学药理学本科</li>
                <li>上海医药工业研究院药理学硕士</li>
              </ul>
            </div>
            <div class="introduce">
              <p class="title-name">个人简介</p>
              <p class="desc">
                曾在外资咨询公司担任医学编辑8年，负责过各类医学教育和患者教育项目，在医学撰写和内容策划方面有着丰富的经验。
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import doctorTeam from './doctor_team'
export default doctorTeam
</script>

<style lang="scss" scoped>
@import "./doctor_team.scss";
</style>
