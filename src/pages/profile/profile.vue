<template>
  <view class="profile-container">
    <view class="user-card">
      <text>个人信息</text>
    </view>
    <view class="stats">
      <text>胜率: 60%</text>
      <text>场次: 20</text>
    </view>
    <wd-button class="logout-btn" type="error" @click="handleLogout">退出登录</wd-button>
  </view>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

const handleLogout = () => {
  userStore.logout()
  uni.reLaunch({ url: '/pages/login/login' })
}
</script>

<style lang="scss" scoped>
.profile-container {
  padding: 20px;
  .logout-btn {
    margin-top: 50px;
  }
}
</style>
