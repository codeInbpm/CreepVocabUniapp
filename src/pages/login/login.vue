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
      <!-- 替换原来的 wd-button 为原生 button（wd-button 可能不支持 open-type） -->
      <button
          class="login-btn wx-btn"
          open-type="getPhoneNumber"
          @getphonenumber="handleWxPhoneLogin"
          :loading="isLoggingIn"
      >
        微信一键登录（含手机号授权）
      </button>

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

// 新增这个方法，替换原来的 handleWxLogin
const handleWxPhoneLogin = (e: any) => {
  if (isLoggingIn.value) return
  isLoggingIn.value = true
  uni.showLoading({ title: '登录中...' })

  if (e.detail.errMsg !== 'getPhoneNumber:ok') {
    uni.hideLoading()
    isLoggingIn.value = false
    uni.showToast({ title: '需授权手机号才能登录', icon: 'none' })
    return
  }

  // 先获取登录 code（必须，先调用 uni.login）
  uni.login({
    provider: 'weixin',
    success: (loginRes) => {
      // 调用你已有的 /wx-login-phone 接口（它支持 code + encryptedData + iv）
      request({
        url: '/auth/wx-login-phone',
        method: 'POST',
        withoutToken: true,
        data: {
          code: loginRes.code,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        }
      }).then((res: any) => {
        uni.hideLoading()
        const loginData = res.data // { token, userInfo }

        if (loginData && loginData.token) {
          const { token, userInfo } = loginData
          userStore.saveToken(token)
          userStore.saveUserInfo(userInfo)

          // 这里手机号已绑定，无需 needBindPhone 判断
          uni.showToast({
            title: userInfo.isNewUser ? '欢迎新用户！' : '欢迎回来！',
            icon: 'success'
          })
          setTimeout(() => {
            uni.switchTab({ url: '/pages/home/home' })
          }, 1000)
        } else {
          uni.showToast({ title: '登录数据异常', icon: 'none' })
          isLoggingIn.value = false
        }
      }).catch(err => {
        uni.hideLoading()
        isLoggingIn.value = false
        uni.showToast({ title: '登录失败: ' + (err.msg || '网络错误'), icon: 'none' })
      })
    },
    fail: () => {
      uni.hideLoading()
      isLoggingIn.value = false
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
