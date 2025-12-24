<template>
  <view class="home-container">
    <!-- Header: User Info -->
    <view class="header">
        <view class="user-card" @click="toProfile">
            <image class="avatar" :src="userStore.userInfo.avatarUrl || '/static/logo.png'" mode="aspectFill" />
            <view class="info">
                <view class="name">{{ userStore.userInfo.nickname || '未登录' }}</view>
                <view class="stats">
                    <view class="stat-item">
                        <wd-icon name="chart-bar" size="14px" color="#F4A261" />
                        <text>词力值: {{ userStore.userInfo.wordPower || 0 }}</text>
                    </view>
                </view>
                <view class="stats-sub">
                    <text>对战: {{ userStore.userInfo.totalBattles || 0 }}局</text>
                    <text class="ml">胜利: {{ userStore.userInfo.winCount || 0 }}局</text>
                </view>
            </view>
            <view class="weather-icon">
                <!-- Placeholder for sun/weather icon -->
                <wd-icon name="loading" size="24px" color="#F4A261" />
            </view>
        </view>
        
        <!-- Tools Row -->
        <view class="tools-row">
            <view class="tool-item">
                <wd-icon name="tips" size="28px" color="#333" />
                <view class="label">提示卡</view>
                <view class="value">999</view>
            </view>
            <view class="divider"></view>
            <view class="tool-item" @click="toWordBook">
                <wd-icon name="read" size="28px" color="#333" />
                <view class="label">单词书</view>
                <view class="value">随机</view>
            </view>
        </view>
    </view>

    <!-- Main Content -->
    <view class="main-content">
        <!-- Random Match -->
        <view class="action-card random-match" @click="toMatch">
            <view class="content-left">
                <wd-icon name="filter" size="32px" color="#fff" />
                <view class="text-group">
                    <text class="title">随机匹配</text>
                    <text class="subtitle">Random match</text>
                </view>
            </view>
            <view class="tag">HOT</view>
        </view>
        
        <!-- Friend Match -->
        <view class="action-card friend-match" @click="toFriendMatch">
            <view class="content-left">
                <wd-icon name="user-group" size="32px" color="#fff" />
                <view class="text-group">
                    <text class="title">好友对战</text>
                    <text class="subtitle">Challenge a friend</text>
                </view>
            </view>
        </view>
        
        <!-- Bottom Row -->
        <view class="bottom-row">
            <view class="small-card challenge" @click="toChallenge">
                <view class="title">词汇挑战</view>
                <view class="subtitle">选择错误，结束游戏</view>
                <image class="mascot" src="/static/logo.png" mode="widthFix" />
            </view>
            <view class="small-card review" @click="toWrongBook">
                <view class="title">生词本</view>
                <view class="subtitle">Review Words!</view>
                <wd-icon class="icon" name="notebook" size="40px" color="#F4A261" />
            </view>
        </view>
    </view>
    
    <!-- Footer Links -->
    <view class="footer">
        <view class="link-item" @click="toRank">
            <wd-icon name="chart" size="16px" color="#4D80F0" />
            <text>排行榜</text>
        </view>
        <view class="link-item">
            <wd-icon name="chat" size="16px" color="#4D80F0" />
            <text>建议反馈</text>
        </view>
        <view class="link-item">
             <wd-icon name="money-circle" size="16px" color="#FF6B6B" />
            <text>打赏作者</text>
        </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const toMatch = () => uni.navigateTo({ url: '/pages/match/match' })
const toFriendMatch = () => uni.navigateTo({ url: '/pages/battle/friend-match' })
const toWordBook = () => uni.navigateTo({ url: '/pages/wordbook/wordbook' })
const toWrongBook = () => uni.navigateTo({ url: '/pages/wrongbook/wrongbook' })
const toChallenge = () => uni.showToast({ title: '挑战模式开发中', icon: 'none' })
const toRank = () => uni.navigateTo({ url: '/pages/rank/rank' })
const toProfile = () => uni.switchTab({ url: '/pages/profile/profile' })
</script>

<style lang="scss" scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #E0F2FF 0%, #FFFFFF 100%);
  padding: 20rpx;
  box-sizing: border-box;
}

.header {
    padding-top: 40rpx;
    margin-bottom: 40rpx;
    
    .user-card {
        display: flex;
        align-items: center;
        margin-bottom: 40rpx;
        position: relative;
        
        .avatar {
            width: 100rpx;
            height: 100rpx;
            border-radius: 50%;
            margin-right: 20rpx;
            border: 4rpx solid #fff;
        }
        
        .info {
            .name {
                font-size: 32rpx;
                font-weight: bold;
                margin-bottom: 10rpx;
            }
            .stats {
                display: flex;
                align-items: center;
                margin-bottom: 6rpx;
                .stat-item {
                    display: flex;
                    align-items: center;
                    font-size: 24rpx;
                    color: #666;
                    margin-right: 20rpx;
                    text { margin-left: 4rpx; }
                }
            }
            .stats-sub {
                font-size: 20rpx;
                color: #999;
                .ml { margin-left: 20rpx; }
            }
        }
        
        .weather-icon {
            position: absolute;
            right: 0;
            top: 0;
        }
    }
    
    .tools-row {
        display: flex;
        justify-content: space-around;
        align-items: center;
        background: rgba(255,255,255,0.6);
        border-radius: 20rpx;
        padding: 20rpx;
        
        .tool-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            .label { font-size: 24rpx; color: #666; margin: 6rpx 0; }
            .value { font-size: 28rpx; font-weight: bold; }
        }
        .divider {
            width: 2rpx;
            height: 60rpx;
            background: #ddd;
        }
    }
}

.main-content {
    .action-card {
        height: 160rpx;
        border-radius: 20rpx;
        margin-bottom: 24rpx;
        display: flex;
        align-items: center;
        padding: 0 40rpx;
        position: relative;
        color: #fff;
        box-shadow: 0 8rpx 16rpx rgba(0,0,0,0.1);
        
        .content-left {
            display: flex;
            align-items: center;
            .text-group {
                margin-left: 20rpx;
                display: flex;
                flex-direction: column;
                .title { font-size: 36rpx; font-weight: bold; }
                .subtitle { font-size: 24rpx; opacity: 0.8; }
            }
        }
        
        .tag {
            position: absolute;
            top: 20rpx;
            right: 20rpx;
            background: #FF4D4F;
            color: #fff;
            padding: 4rpx 12rpx;
            font-size: 20rpx;
            border-radius: 8rpx;
        }
    }
    
    .random-match {
        background: linear-gradient(135deg, #81D4FA 0%, #4FC3F7 100%);
    }
    .friend-match {
        background: linear-gradient(135deg, #FFAB91 0%, #FF8A65 100%);
    }
    
    .bottom-row {
        display: flex;
        justify-content: space-between;
        
        .small-card {
            width: 48%;
            height: 200rpx;
            border-radius: 20rpx;
            padding: 20rpx;
            box-sizing: border-box;
            position: relative;
            
            .title { font-size: 32rpx; font-weight: bold; color: #fff; }
            .subtitle { font-size: 20rpx; color: #fff; opacity: 0.9; }
            
            &.challenge {
                background: linear-gradient(135deg, #9575CD 0%, #7986CB 100%);
                .mascot { width: 80rpx; position: absolute; bottom: 10rpx; right: 10rpx; }
            }
            &.review {
                background: linear-gradient(135deg, #4DB6AC 0%, #26A69A 100%);
                .icon { position: absolute; bottom: 10rpx; right: 10rpx; }
            }
        }
    }
}

.footer {
    margin-top: 60rpx;
    display: flex;
    justify-content: space-around;
    padding-bottom: 40rpx;
    
    .link-item {
        display: flex;
        align-items: center;
        font-size: 24rpx;
        color: #666;
        text { margin-left: 8rpx; }
    }
}
</style>
