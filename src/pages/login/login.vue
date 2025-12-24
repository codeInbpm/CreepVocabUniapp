<template>
  <view class="login-container">
    <!-- Top Section: Illustration & Background -->
    <view class="header">
      <view class="bg-circle"></view>
      <image class="illustration" src="/static/login_illustration.png" mode="aspectFit"></image>
      <view class="welcome-text">
        <text class="title">加入单词对战</text>
        <text class="subtitle">领新人积分</text>
      </view>
    </view>

    <!-- Bottom Section: Buttons -->
    <view class="footer">
      <wd-button 
        type="primary" 
        size="large" 
        custom-class="login-btn wx-btn" 
        :loading="isLoggingIn"
        @click="handleWxLogin"
      >
        微信一键登录
      </wd-button>
      
      <wd-button type="info" plain size="large" custom-class="login-btn guest-btn" @click="handleGuestLogin">
        游客快速开始
      </wd-button>
      
      <view class="agreement">
        登录即代表同意 <text class="link">《用户协议》</text> 和 <text class="link">《隐私政策》</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/store/user'
import request from '@/utils/request'

const userStore = useUserStore()
const isLoggingIn = ref(false)

const handleWxLogin = () => {
  if (isLoggingIn.value) return
  isLoggingIn.value = true
  
  uni.showLoading({ title: '登录中...' })
  
  // 1. Get WeChat Code
  uni.login({
    provider: 'weixin',
    success: (loginRes) => {
      // 2. Call Backend
      // Note: We use /auth/wx-login. Since context-path is /api and VITE_BASE_URL has /api,
      // request.ts usually prepends BASE_URL.
      // If VITE_BASE_URL = http://localhost:5687/api
      // Then url = http://localhost:5687/api/auth/wx-login
      // This matches the backend: context-path=/api + controller=/auth/wx-login
      request({
        url: '/auth/wx-login',
        method: 'POST',
        withoutToken: true,
        data: {
          code: loginRes.code
        }
      }).then((res: any) => {
        uni.hideLoading()
        console.log('Login Success:', res)
        
        // 3. Save Data
        // Backend returns Result<LoginVO> -> { code: 200, data: { token, userInfo } }
        // request.ts returns res.data (the body), so res = { code: 200, data: { ... } }
        
        // Access token from res.data.token
        const loginData = res.data;
        
        if (loginData && loginData.token) {
            const { token, userInfo } = loginData
            userStore.saveToken(token)
            userStore.saveUserInfo(userInfo)
            
            if (userInfo.needBindPhone) {
                uni.showToast({ title: '请绑定手机号', icon: 'none' })
                setTimeout(() => {
                    uni.navigateTo({ url: '/pages/login/bind-phone' })
                }, 1000)
            } else {
                const msg = userInfo.isNewUser ? '欢迎新用户！' : '欢迎回来！'
                uni.showToast({ title: msg, icon: 'success' })
                
                // 4. Navigate
                setTimeout(() => {
                  uni.switchTab({ url: '/pages/home/home' })
                }, 1000)
            }
        } else {
             console.error('Login Data Error:', res);
             uni.showToast({ title: '登录返回数据异常', icon: 'none' })
             isLoggingIn.value = false
        }

      }).catch(err => {
        uni.hideLoading()
        isLoggingIn.value = false
        console.error('Login Failed:', err)
        uni.showToast({ title: '登录失败: ' + (err.msg || '网络错误'), icon: 'none' })
      })
    },
    fail: (err) => {
      uni.hideLoading()
      isLoggingIn.value = false
      console.error('uni.login failed:', err)
      uni.showToast({ title: '微信登录失败', icon: 'none' })
    }
  })
}

const handleGuestLogin = () => {
  uni.switchTab({ url: '/pages/home/home' })
}
</script>

<style lang="scss" scoped>
.login-container {
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
  overflow: hidden;

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
    width: 600rpx;
    height: 500rpx;
    margin-bottom: 40rpx;
    z-index: 1;
  }

  .welcome-text {
    text-align: center;
    z-index: 1;
    .title {
      font-size: 56rpx;
      font-weight: bold;
      color: #0d47a1; // Dark Blue
      display: block;
      margin-bottom: 10rpx;
      letter-spacing: 2rpx;
    }
    .subtitle {
      font-size: 32rpx;
      color: #546e7a;
    }
  }
}

.footer {
  padding: 40rpx 60rpx;
  background-color: #fff;
  padding-bottom: calc(env(safe-area-inset-bottom) + 40rpx);
  
  .login-btn {
    margin-bottom: 30rpx !important;
    border-radius: 50rpx !important;
    font-weight: bold;
    font-size: 32rpx;
    height: 90rpx !important;
    line-height: 90rpx !important;
  }
  
  .wx-btn {
    background-color: #0062ff !important; // Luckin Blue
    border-color: #0062ff !important;
    color: #fff !important;
  }
  
  .guest-btn {
    color: #999 !important;
    border-color: #eee !important;
  }

  .agreement {
    margin-top: 20rpx;
    display: flex;
    justify-content: center;
    font-size: 24rpx;
    color: #999;
    
    .link {
      color: #0062ff;
    }
  }
}
</style>
