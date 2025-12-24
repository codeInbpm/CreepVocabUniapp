<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import { useUserStore } from "@/store/user";
import { getUserProfile } from "@/api/user";

onLaunch(() => {
  console.log("App Launch");
  const userStore = useUserStore();
  if (userStore.token) {
    // Refresh user info
    getUserProfile().then(res => {
        console.log("Synced User Profile:", res);
        userStore.saveUserInfo(res);
        
        // Enforce mandatory phone binding
        if (!res.phone) {
            // Check if we are already on the bind page to avoid loop? 
            // Actually reLaunch clears stack. 
            // But we should check if current page is valid context or just do it.
            // However, onLaunch runs early.
            // Let's rely on the fact that if they have a token but no phone, they go to bind page.
            uni.reLaunch({ url: '/pages/login/bind-phone' });
        }
    }).catch(err => {
        console.error("Sync Profile Failed:", err);
        // Optional: Logout if token invalid? verify request.ts handles 401
    });
  }
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});
</script>
<style>
/* Global Styles */
page {
    background-color: #f5f5f5;
}
</style>
