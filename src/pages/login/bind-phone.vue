<template>
  <view class="bind-container">
    <view class="header">
      <view class="bg-circle"></view>
      <image class="illustration" src="/static/login_illustration.png" mode="aspectFit"></image>
      <view class="text-area">
        <text class="title">绑定手机号</text>
        <text class="subtitle">绑定后即可开始对战</text>
      </view>
    </view>

      <button 
        class="bind-btn" 
        open-type="getPhoneNumber" 
        @getphonenumber="handleBindPhone"
        :loading="isBinding"
      >
        一键绑定手机号
      </button>
      
      <button 
        class="switch-btn" 
        @click="handleLogout"
      >
        切换账号 / 返回登录
      </button>

      <view class="tips">为了您的账号安全，请完成手机号验证</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/store/user'
import request from '@/utils/request'

const userStore = useUserStore()
const isBinding = ref(false)

const handleBindPhone = (e: any) => {
  if (isBinding.value) return
  
  if (e.detail.errMsg === 'getPhoneNumber:ok') {
    isBinding.value = true
    uni.showLoading({ title: '绑定中...' })
    
    request({
      url: '/auth/bind-phone',
      method: 'POST',
      data: {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      }
    }).then((res: any) => {
      console.log('Bind Success:', res)
      // Update user info in store
      userStore.saveUserInfo(res) // Endpoint returns updated UserInfo
      
      uni.showToast({ title: '绑定成功', icon: 'success' })
      
      setTimeout(() => {
        uni.switchTab({ url: '/pages/home/home' })
      }, 1500)
      
    }).catch(err => {
      console.error('Bind Failed:', err)
      uni.showToast({ title: '绑定失败: ' + (err.msg || '请重试'), icon: 'none' })
      isBinding.value = false
    }).finally(() => {
        uni.hideLoading()
    })
  } else {
    // User denied
    uni.showToast({ title: '请授权手机号以继续', icon: 'none' })
  }
}

const handleLogout = () => {
  userStore.clearToken()
  userStore.clearUserInfo()
  // Navigate back to login
  uni.reLaunch({ url: '/pages/login/login' })
}
</script>

<style lang="scss" scoped>
.bind-container {
  min-height: 100vh;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.header {
  flex: 1;
  position: relative;
  background: linear-gradient(180deg, #e3f2fd 0%, #ffffff 100%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 50rpx;

  .bg-circle {
    position: absolute;
    top: -100rpx;
    right: -100rpx;
    width: 400rpx;
    height: 400rpx;
    border-radius: 50%;
    background: rgba(33, 150, 243, 0.1);
  }

  .illustration {
    width: 500rpx;
    height: 400rpx;
    margin-bottom: 40rpx;
  }

  .text-area {
    text-align: center;
    .title {
      font-size: 48rpx;
      font-weight: bold;
      color: #0d47a1;
      display: block;
      margin-bottom: 16rpx;
    }
    .subtitle {
      font-size: 28rpx;
      color: #546e7a;
    }
  }
}

.footer {
  padding: 60rpx;
  padding-bottom: calc(env(safe-area-inset-bottom) + 60rpx);
  
  .bind-btn {
    background-color: #0062ff; // Luckin Blue
    color: #fff;
    border-radius: 50rpx;
    font-size: 32rpx;
    font-weight: bold;
    height: 90rpx;
    line-height: 90rpx;
    border: none;
    &::after { border: none; }
    &:active { opacity: 0.9; }
  }

  .tips {
    text-align: center;
    margin-top: 30rpx;
    color: #999;
    font-size: 24rpx;
  }
  
  .switch-btn {
      margin-top: 30rpx;
      background-color: #f5f5f5;
      color: #666;
      border-radius: 50rpx;
      font-size: 28rpx;
      height: 80rpx;
      line-height: 80rpx;
      border: none;
      &::after { border: none; }
  }
}
</style>
