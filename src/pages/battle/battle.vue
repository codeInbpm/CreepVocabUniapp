<template>
  <view class="battle-container">
    <view class="header">
      <text>Battle</text>
    </view>
    <view class="question-area">
      <text class="word">abandon</text>
      <text class="timer">10s</text>
    </view>
    <view class="options">
      <button class="option-btn">A. 放弃</button>
      <button class="option-btn">B. 坚持</button>
      <button class="option-btn">C. 快乐</button>
      <button class="option-btn">D. 悲伤</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useWsStore } from '@/store/ws'
import { useUserStore } from '@/store/user'

const wsStore = useWsStore()
const userStore = useUserStore()

const roomId = ref('')
const currentRound = ref(1)
const totalRound = ref(10)
const countdown = ref(10 * 1000)
const currentWord = ref({
  word: 'Example',
  options: ['示例', '测试', '代码', '程序']
})
const score = ref(0)
const opponentScore = ref(0)
const selectedOption = ref(-1) // -1 none, 0-3 index
const showResult = ref(false) // temporary for round result

onLoad((options: any) => {
    if (options.roomId) {
        roomId.value = options.roomId
        joinBattle()
    } else {
        uni.showToast({ title: '房间号错误', icon: 'none' })
        setTimeout(() => uni.navigateBack(), 1500)
    }
})

const joinBattle = () => {
    if (!wsStore.isConnected) {
        wsStore.connect()
    }
    
    // Subscribe to Room Topic
    wsStore.subscribeRoom(roomId.value, (msg: any) => {
        console.log('Battle Message:', msg)
        handleMessage(msg)
    })
    
    // Send Ready/Join Action
    wsStore.sendMessage('/app/battle.action', {
        type: 'ready',
        roomId: roomId.value,
        payload: { userId: userStore.userInfo?.id } // simplified
    })
}

const handleMessage = (msg: any) => {
    // Determine message type and update state
    // In MVP, backend just echoes 'ready' or 'answer'
    // Real implementation would have 'round_start', 'round_end' types
    
    if (msg.type === 'answer') {
        // Handle opponent answer animation
        if (msg.payload.userId !== userStore.userInfo?.id) {
             uni.showToast({ title: '对方已作答', icon: 'none' })
             // Update opponent score if provided
        }
    }
}

const handleOptionClick = (index: number) => {
    if (selectedOption.value !== -1) return
    selectedOption.value = index
    
    // Send Answer
    wsStore.sendMessage('/app/battle.action', {
        type: 'answer',
        roomId: roomId.value,
        payload: { 
            userId: userStore.userInfo?.id,
            answerIndex: index,
            timeRemaining: countdown.value 
        }
    })
    
    // Vibrate
    uni.vibrateShort({})
}

onUnmounted(() => {
    // Leave room
    if (roomId.value) {
        wsStore.sendMessage('/app/battle.action', {
            type: 'leave',
            roomId: roomId.value,
            payload: {}
        })
    }
    // Note: Don't disconnect globally if we want to keep generic connection, 
    // but usually beneficial to unsubscribe. 
    // wsStore.unsubscribe... (Need to implement unsubscribe in store if strict)
})
</script>

<style lang="scss" scoped>
.battle-container {
  padding: 20px;
  height: 100vh;
  display: flex;
  flex-direction: column;
  .question-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    .word {
      font-size: 30px;
      margin-bottom: 20px;
    }
    .timer {
      font-size: 20px;
      color: red;
    }
  }
  .options {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}
</style>
