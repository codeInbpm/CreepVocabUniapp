<template>
  <view class="result-container">
    <view class="result-header">
      <text class="title">胜利 / 失败</text>
    </view>
    <view class="scores">
      <view class="score-card">
        <text class="label">我方</text>
        <text class="value">100</text>
      </view>
      <view class="score-card">
        <text class="label">对手</text>
        <text class="value">80</text>
      </view>
    </view>
    <view class="actions">
      <wd-button type="primary" @click="restart">再来一局</wd-button>
      <wd-button @click="goHome">返回首页</wd-button>
    </view>
  </view>
</template>

<script setup lang="ts">
const restart = () => {
  uni.redirectTo({ url: '/pages/match/match' })
}

const goHome = () => {
  uni.reLaunch({ url: '/pages/home/home' })
}
</script>

<style lang="scss" scoped>
.result-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .result-header {
    margin-top: 50px;
    font-size: 30px;
    font-weight: bold;
  }
  .scores {
    display: flex;
    justify-content: space-around;
    width: 100%;
    margin: 50px 0;
    .score-card {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
  .actions {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
}
</style>
