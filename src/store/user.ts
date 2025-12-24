import { defineStore } from 'pinia';

interface UserState {
    token: string;
    userInfo: {
        id?: number;
        nickname?: string;
        avatarUrl?: string; // mapped from avatar
        avatar?: string;    // raw field
        openid?: string;
        phone?: string;
        coins?: number;
        streak?: number;
        level?: number;
        wordPower?: number;
        winCount?: number;
        totalBattles?: number;
        isNewUser?: boolean;
    };
}

export const useUserStore = defineStore('user', {
    state: (): UserState => ({
        token: uni.getStorageSync('token') || '',
        userInfo: uni.getStorageSync('userInfo') || {},
    }),
    actions: {
        // Actions matching the request
        saveToken(token: string) {
            this.setToken(token);
        },
        saveUserInfo(info: any) {
            // Adapt backend format (avatar vs avatarUrl)
            if (info.avatar && !info.avatarUrl) {
                info.avatarUrl = info.avatar;
            }
            this.setUserInfo(info);
        },
        loginSuccess(token: string, userInfo: any) {
            this.saveToken(token);
            this.saveUserInfo(userInfo);
        },

        setToken(token: string) {
            this.token = token;
            uni.setStorageSync('token', token);
        },
        setUserInfo(info: UserState['userInfo']) {
            this.userInfo = info;
            uni.setStorageSync('userInfo', info);
        },
        logout() {
            this.token = '';
            this.userInfo = {};
            uni.removeStorageSync('token');
            uni.removeStorageSync('userInfo');
        },
    },
});
