<template>
  <view class="match-container">
    <view class="loading">
      <view class="spinner"></view>
      <text class="status">{{ statusText }}</text>
    </view>
    <button class="cancel-btn" @click="cancelMatch">取消匹配</button>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import request from '@/utils/request'
import { useWsStore } from '@/store/ws'

const statusText = ref('正在寻找对手...')
const wsStore = useWsStore()
const isMatching = ref(true)

const startMatch = async () => {
  try {
    // Ensure WS is connected
    if (!wsStore.isConnected) {
        wsStore.connect()
    }
    
    // Call API to join queue
    await request({
        url: '/battle/room/match/join',
        method: 'POST',
        data: { mode: 'random' }
    })
    
    // In a real app, we would listen for a "MATCH_FOUND" event via WebSocket
    // For this MVP, we might poll or wait for server push. 
    // Since backend isn't fully pushing match success yet in the simple implementation,
    // we will simulate a "success" after a short delay OR listen to a specific user topic.
    // Assuming the backend pushes to /topic/user/{userId}, but we haven't implemented that fully.
    
    // For MVP demonstration purposes: call create room directly if match takes too long (or simulate)
    // Actually, let's just create a room for testing "AI Mode" or "Random" immediately if queue logic is complex
    /*
    const res = await request({
        url: '/battle/room/create',
        method: 'POST',
        data: { type: 'random', aiMode: true }
    })
    if(res) {
        uni.redirectTo({ url: `/pages/battle/battle?roomId=${res.id}` })
    }
    */
   
   // Listening to specific user queue is better. 
   // For now, let's simulate success to enter Battle Page where the real WS action happens.
   // Ideally: wsStore.subscribe('/topic/user/' + userId, onMatchFound)
   
  } catch (e) {
    statusText.value = '匹配失败，请重试'
    isMatching.value = false
  }
}

// Temporary: Direct jump to battle for testing flow (Mocking the "Match Found" event)
onMounted(() => {
    // Connect WS globally if not already
    wsStore.connect()
    startMatch()
    
    // Mock match success
    setTimeout(async () => {
        // Create a room so we have a valid Room ID
        try {
             // For testing: Create an AI room so we can play immediately
             const res: any = await request({
                url: '/battle/room/create?type=random&aiMode=true',
                method: 'POST'
             })
             
             statusText.value = '匹配成功！'
             setTimeout(() => {
                uni.redirectTo({ url: `/pages/battle/battle?roomId=${res.id}` })
             }, 1000)
        } catch(e) {
            statusText.value = '创建对战失败'
        }
    }, 2000)
})

const cancelMatch = () => {
  isMatching.value = false
  uni.navigateBack()
}
</script>

<style lang="scss" scoped>
.match-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  .status {
    margin-top: 20px;
    font-size: 18px;
  }
  .cancel-btn {
    margin-top: 50px;
  }
}
</style>
