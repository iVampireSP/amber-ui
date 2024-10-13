<template>
  <n-config-provider :theme="theme">
    <n-layout>
      <div class="container">
        <!-- Spotlight 区域 -->
        <n-card class="spotlight" :bordered="false">
          <div class="background-pattern"></div>
          <div class="background-text">Leaflow <span class="background-amber">Amber</span></div>
          <div class="spotlight-content">
            <h1 class="title">
              Leaflow <span class="amber-text">Amber</span>
            </h1>
            <p class="subtitle">
              下一代智能体平台，为您的数字生活带来革命性变化 
              <br class="mobile-break">
              <a href="#" class="cta-link">立即体验 🚀</a>
            </p>
            <div class="stats" v-if="siteUsage.month_tokens && siteUsage.month_tool_calls">
              <div class="stat-item">
                <n-statistic tabular-nums>
                  <n-number-animation
                    ref="tokenAnimationRef"
                    :from="siteUsage.month_tokens < 1000 ? 0 : siteUsage.month_tokens - 800"
                    :to="siteUsage.month_tokens"
                  />
                  <template #suffix> Tokens </template>
                </n-statistic>
                <div class="stat-label">本月处理 Tokens</div>
              </div>
              <div class="stat-item">
                <n-statistic tabular-nums>
                  <n-number-animation
                    ref="callsAnimationRef"
                    :from="siteUsage.month_tool_calls < 1000 ? 0 : siteUsage.month_tool_calls - 800"
                    :to="siteUsage.month_tool_calls"
                  />
                  <template #suffix> Calls </template>
                </n-statistic>
                <div class="stat-label">本月工具调用</div>
              </div>
            </div>
            <div class="button-group">
              <n-button class="transparent-button spotlight-button" ghost tag="a" href="https://github.com/ivampiresp/wp-amber" target="_blank">
                WordPress 插件
              </n-button>
              <n-button class="transparent-button spotlight-button" ghost tag="a" href="http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=e6RgLkc7pXr57968mYSg5X7H3puFi79b&authKey=xbG43mkYovgs%2BNW3BOG7oo%2BJZK0dbXjzyIfwW9a8himqRC6AlXOkCmb3G%2FcwOt6Y&noverify=0&group_code=439747955" target="_blank">
                加入官方 QQ 群
              </n-button>
              <n-button class="transparent-button spotlight-button" ghost tag="a" href="https://amber-api.leaflow.cn/swagger/index.html" target="_blank">
                Amber API 文档
              </n-button>
            </div>
          </div>
        </n-card>

        <!-- 功能特点展示 -->
        <div class="features-section">
          <h2 class="section-title">Amber 核心特性</h2>
          <n-grid :cols="3" :x-gap="24" :y-gap="24" responsive="screen">
            <n-gi span="3 m:1" v-for="(feature, index) in features" :key="index">
              <div class="feature-card" @click="toggleFeatureDescription(feature)">
                <div class="feature-content">
                  <div class="feature-icon">{{ feature.icon }}</div>
                  <div class="feature-title">{{ feature.title }}</div>
                  <transition name="fade-height" mode="out-in">
                    <p class="feature-description" :key="feature.showLong">
                      {{ feature.showLong ? feature.longDescription : feature.shortDescription }}
                    </p>
                  </transition>
                </div>
              </div>
            </n-gi>
          </n-grid>
        </div>

        <!-- 合作伙伴板块 -->
        <div class="partners-section">
          <h2 class="section-title">合作伙伴</h2>
          <div class="partner-grid">
            <div v-for="partner in partners" :key="partner.name" class="partner-card">
              <div class="partner-logo-container">
                <img :src="partner.logo" :alt="partner.name" class="partner-logo">
              </div>
              <h3 class="partner-name">{{ partner.name }}</h3>
              <p class="partner-description">{{ partner.description }}</p>
              <a :href="partner.link" target="_blank" class="partner-link">了解更多</a>
            </div>
          </div>
        </div>
      </div>
    </n-layout>
  </n-config-provider>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useOsTheme, darkTheme, NConfigProvider, NLayout, NButton, NCard, NStatistic, NNumberAnimation } from 'naive-ui';
import { SchemaSiteUsageResponse } from "@/api";
import getApi from "@/plugins/api";
import grouppng from "@/assets/images/group.png";

const osTheme = useOsTheme();
const theme = computed(() => (osTheme.value === 'dark' ? darkTheme : null));

const siteUsage = ref<SchemaSiteUsageResponse>({});

const features = ref([
  // ... 你的 features 数据 ...
]);

const partners = ref([
  {
    name: 'HiMCBBS 我的世界中文论坛',
    logo: 'https://www.himcbbs.com/data/assets/logo/wxmc_logo_text_blue.svg',
    link: 'https://www.himcbbs.com/',
    description: '中国最大的我的世界玩家社区，提供游戏资讯、模组下载和创意分享。'
  }
  // 可以在这里添加更多合作伙伴
]);

const toggleFeatureDescription = (feature) => {
  feature.showLong = !feature.showLong;
};

onMounted(async () => {
  const r = (await getApi().Usage.apiV1UsageGet()).data.data;
  if (r) {
    siteUsage.value = r;
  }
});
</script>

<style scoped>
:root {
  --primary-color: #4ebbc0;
  --text-color: v-bind('theme ? "#ffffff" : "#333333"');
  --background-color: v-bind('theme ? "#1a1a1a" : "#f5f5f5"');
  --card-background: v-bind('theme ? "rgba(255, 255, 255, 0.1)" : "rgba(255, 255, 255, 0.8)"');
}

body {
  font-family: 'Arial', sans-serif;
  color: var(--text-color);
  background-color: var(--background-color);
  transition: background-color 0.3s ease;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.spotlight {
  background-color: v-bind('theme ? "rgba(0, 0, 0, 0.5)" : "rgba(78, 187, 192, 0.1)"');
  backdrop-filter: blur(10px);
  height: 70vh;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2rem 0;
  position: relative;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: v-bind('theme ? "0 4px 6px rgba(0, 0, 0, 0.1)" : "0 4px 6px rgba(78, 187, 192, 0.2)"');
}

.background-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-30deg);
  font-size: 20vw;
  font-weight: bold;
  color: transparent;
  -webkit-text-stroke: 1px v-bind('theme ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)"');
  white-space: nowrap;
  z-index: 1;
}

.background-amber {
  -webkit-text-stroke: 1px v-bind('theme ? "rgba(78, 187, 192, 0.2)" : "rgba(78, 187, 192, 0.3)"');
}

.spotlight-content {
  text-align: center;
  color: v-bind('theme ? "white" : "rgba(0, 0, 0, 0.8)"');
  padding: 2rem;
  width: 100%;
  max-width: 1000px;
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.title {
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: bold;
  margin-bottom: 1rem;
  color: v-bind('theme ? "white" : "rgba(0, 0, 0, 0.8)"');
  width: 100%;
  text-align: center;
}

.amber-text {
  color: #4ebbc0;
}

.subtitle {
  font-size: clamp(1rem, 2vw, 1.25rem);
  opacity: 0.9;
  margin-bottom: 2rem;
  max-width: 600px;
}

.cta-link {
  color: #4ebbc0;
  font-weight: bold;
  text-decoration: underline;
}

.stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: bold;
  color: #4ebbc0;
}

.stat-label {
  font-size: 1rem;
  opacity: 0.8;
}

.transparent-button {
  background-color: v-bind('theme ? "rgba(255, 255, 255, 0.2)" : "rgba(78, 187, 192, 0.1)"');
  border: 1px solid v-bind('theme ? "rgba(255, 255, 255, 0.5)" : "rgba(78, 187, 192, 0.3)"');
  color: v-bind('theme ? "white" : "rgba(0, 0, 0, 0.7)"');
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
  margin: 0.5rem;
}

.spotlight-button {
  position: relative;
  overflow: hidden;
}

.spotlight-button::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background-color: rgba(78, 187, 192, 0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.6s ease, height 0.6s ease;
}

.spotlight-button:hover::before {
  width: 300px;
  height: 300px;
}

.spotlight-button:hover {
  background-color: v-bind('theme ? "rgba(255, 255, 255, 0.3)" : "transparent"');
  border-color: #4ebbc0;
  color: v-bind('theme ? "white" : "#4ebbc0"');
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(78, 187, 192, 0.2);
}

:root[data-theme="dark"] .spotlight-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
  color: white;
}

.features-section {
  margin-top: 4rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 3rem;
  color: v-bind('theme ? "white" : "rgba(0, 0, 0, 0.8)"');
}

.feature-card {
  background-color: var(--card-background);
  border-radius: 10px;
  padding: 2rem;
  height: 100%;
  transition: all 0.3s ease;
  cursor: pointer;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(78, 187, 192, 0.2);
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #4ebbc0;
}

.feature-description {
  font-size: 1rem;
  line-height: 1.6;
}

.fade-height-enter-active,
.fade-height-leave-active {
  transition: all 0.3s;
  max-height: 1000px;
  opacity: 1;
}

.fade-height-enter-from,
.fade-height-leave-to {
  max-height: 0;
  opacity: 0;
}

.partners-section {
  margin-top: 4rem;
  text-align: center;
}

.partner-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.partner-card {
  background-color: var(--card-background);
  border-radius: 15px;
  padding: 2rem;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.partner-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(78, 187, 192, 0.2);
}

.partner-logo-container {
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  background-color: white;
  border-radius: 50%;
  padding: 1rem;
}

.partner-logo {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.partner-name {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: var(--primary-color);
}

.partner-description {
  font-size: 0.9rem;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.partner-link {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: bold;
  transition: all 0.3s ease;
}

.partner-link:hover {
  text-decoration: underline;
}

@media (max-width: 768px) {
  .spotlight {
    height: auto;
    padding: 4rem 1rem;
  }

  .background-text {
    font-size: 15vw;
  }

  .stats {
    flex-direction: column;
    gap: 1rem;
  }

  .transparent-button {
    margin: 0.5rem 0;
  }

  .partner-grid {
    grid-template-columns: 1fr;
  }
}
</style>
