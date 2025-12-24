<template>
  <view class="study-container">
    <view class="header">
      <text class="title">书籍封面</text>
    </view>
    
    <view class="book-grid">
        <view class="book-card" v-for="(book, index) in books" :key="index" :style="{ background: book.color }" @click="selectBook(book)">
            <view class="close-icon"><wd-icon name="close" size="16px" color="#fff" /></view>
            <view class="book-title">{{ book.title }}</view>
            <view class="book-tag">{{ book.tag }}</view>
            <view class="footer-text">单词天天斗</view>
        </view>
        
        <!-- Add Book Card -->
        <view class="book-card add-card" @click="addBook">
            <wd-icon name="add" size="40px" color="#fff" />
            <view class="add-text">添加词书</view>
        </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCourseList, selectCourse as apiSelectCourse } from '@/api/course'

const books = ref<any[]>([])

const loadCourses = async () => {
    try {
        const res = await getCourseList()
        // Map backend data to UI format if needed, or just use directly
        // Backend: { id, title, subTitle, coverColor, ... }
        // Frontend expects: { title, tag, color }
        books.value = res.data.map((item: any) => ({
            id: item.id,
            title: item.title,
            tag: item.subTitle, // Map subTitle to tag
            color: item.coverColor || 'linear-gradient(135deg, #64B5F6 0%, #42A5F5 100%)'
        }))
    } catch (e) {
        console.error('Failed to load courses', e)
        // Fallback to empty or error state
    }
}

onMounted(() => {
    loadCourses()
})

const selectBook = async (book: any) => {
    try {
        await apiSelectCourse(book.id)
        uni.showToast({ title: '已选择: ' + book.title, icon: 'success' })
    } catch (e) {
         uni.showToast({ title: '选择失败', icon: 'none' })
    }
}

const addBook = () => {
    uni.showToast({ title: '去书城添加', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.study-container {
  padding: 20px;
  background-color: #F5F7FA;
  min-height: 100vh;
}

.header {
  margin-bottom: 20px;
  .title {
    font-size: 24px;
    font-weight: bold;
    color: #333;
  }
}

.book-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
    
    .book-card {
        height: 180px; // Aspect ratio ~ 3:4
        border-radius: 12px;
        padding: 15px;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        justify-content: center; // Center vertically like design
        align-items: center;
        position: relative;
        color: #fff;
        box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        
        .close-icon {
            position: absolute;
            top: 10px;
            left: 10px;
            background: rgba(255,255,255,0.2);
            border-radius: 50%;
            padding: 2px;
        }
        
        .book-title {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 8px;
        }
        
        .book-tag {
            font-size: 10px;
            background: rgba(255,255,255,0.2);
            padding: 2px 8px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        
        .footer-text {
            font-size: 10px;
            opacity: 0.8;
            position: absolute;
            bottom: 10px;
        }
        
        &.add-card {
            background: #E0E0E0 !important;
            border: 2px dashed #999;
            .add-text { color: #666; font-size: 14px; margin-top: 10px; }
        }
    }
}
</style>
