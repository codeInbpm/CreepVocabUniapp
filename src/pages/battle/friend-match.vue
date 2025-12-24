<template>
  <view class="friend-match-container">
      <view class="nav-bar">
          <wd-icon name="arrow-left" size="24px" color="#333" @click="goBack" />
          <text class="title">天天斗单词 - CET4</text>
          <view class="right-actions">
              <wd-icon name="more" size="24px" color="#333" />
          </view>
      </view>
      
      <view class="split-view">
          <!-- Left Player (User) -->
          <view class="player-side left">
              <image class="avatar" :src="userStore.userInfo.avatarUrl || '/static/logo.png'" />
              <view class="name">{{ userStore.userInfo.nickname }}</view>
              <view class="stat">词力值: {{ userStore.userInfo.wordPower || 999 }}</view>
              <view class="stat">斗胜率: {{ winRate }}%</view>
          </view>
          
          <!-- Right Player (Friend/Guest) -->
          <view class="player-side right">
              <image class="avatar placeholder" src="/static/logo.png" />
              <view class="name">神秘嘉宾</view>
              <view class="stat">词力值: 0</view>
              <view class="stat">斗胜率: 0</view>
          </view>
          
          <!-- VS Badge/Swords -->
          <view class="vs-badge">
              <wd-icon name="close-bold" size="40px" color="#fff" /> <!-- Using close as cross swords placeholder -->
          </view>
      </view>
      
      <!-- Actions -->
      <view class="action-area">
          <wd-button type="primary" class="main-btn" round block @click="inviteFriend">邀请好友 / 加入对战 / 开始</wd-button>
          
          <view class="toggles">
              <view class="toggle-item">
                  <text>对战背景音乐</text>
                  <wd-switch v-model="settings.bgm" size="20px" active-color="#4D80F0" />
              </view>
              <view class="toggle-item">
                  <text>播放单词发音</text>
                  <wd-switch v-model="settings.pronunciation" size="20px" active-color="#4D80F0" />
              </view>
              <view class="toggle-item">
                  <text>错词加入生词</text>
                  <wd-switch v-model="settings.autoAddToWordbook" size="20px" active-color="#4D80F0" />
              </view>
          </view>
      </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()
const settings = ref({
    bgm: true,
    pronunciation: true,
    autoAddToWordbook: true
})

const winRate = computed(() => {
    const total = userStore.userInfo.totalBattles || 0
    const wins = userStore.userInfo.winCount || 0
    if (total === 0) return 0
    return Math.floor((wins / total) * 100)
})

const goBack = () => uni.navigateBack()
const inviteFriend = () => {
    uni.share({
        provider: "weixin",
        scene: "WXSceneSession",
        type: 0,
        href: "http://uniapp.dcloud.io/",
        title: "来和我大战三百回合！",
        summary: "我正在天天斗单词等你，快来！",
        imageUrl: "/static/logo.png"
    });
}
</script>

<style lang="scss" scoped>
.friend-match-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #fff;
}

.nav-bar {
    height: 44px;
    padding-top: var(--status-bar-height);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 15px;
    padding-right: 15px;
    background: #fff; // Transparent in design but white for header
    z-index: 10;
    
    .title {
        font-weight: bold;
        font-size: 16px;
    }
}

.split-view {
    flex: 1;
    display: flex;
    position: relative;
    
    .player-side {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: #fff;
        padding-bottom: 100px; // make room for button
        
        .avatar {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            border: 4px solid rgba(255,255,255,0.3);
            margin-bottom: 20px;
            background: #fff;
        }
        .name { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
        .stat { font-size: 12px; opacity: 0.8; margin-bottom: 4px; }
        
        &.left {
            background-color: #F8BBD0; // Pink
        }
        &.right {
            background-color: #B3E5FC; // Blue
        }
    }
    
    .vs-badge {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 60px;
        height: 60px;
        // background: url... simple icon for now
        z-index: 5;
    }
}

.action-area {
    position: absolute;
    bottom: 50px;
    left: 0;
    right: 0;
    padding: 20px 40px;
    
    .main-btn {
        margin-bottom: 40px;
        box-shadow: 0 4px 10px rgba(77, 128, 240, 0.3);
    }
    
    .toggles {
        .toggle-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            color: #fff; // Issue: text color depends on background
            // Design shows text is white on bottom area? 
            // Actually the background split goes all the way down.
            // We need a clever way to handle text color or wrapper.
            // Let's assume action area has a transparent bg.
            
            // Text color hack: White with shadow for readability
            text-shadow: 0 1px 2px rgba(0,0,0,0.2);
            font-size: 14px;
        }
    }
}
</style>
