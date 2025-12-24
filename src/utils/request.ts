import { useUserStore } from '@/store/user';

// 硬编码的 BASE_URL
const BASE_URL = import.meta.env.VITE_BASE_URL as string;

// WebSocket URL
export const WS_URL = import.meta.env.VITE_WS_URL as string;

interface RequestOptions extends UniApp.RequestOptions {
    withoutToken?: boolean;
}

const request = <T = any>(options: RequestOptions): Promise<T> => {
    return new Promise((resolve, reject) => {
        const userStore = useUserStore();

        // Inject token
        if (!options.withoutToken && userStore.token) {
            options.header = {
                ...options.header,
                'Authorization': `Bearer ${userStore.token}`,
            };
        }

        options.url = BASE_URL + options.url;

        uni.request({
            ...options,
            success: async (res) => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(res.data as T);
                } else if (res.statusCode === 401) {
                    // Token expired or invalid
                    userStore.logout();

                    try {
                        // Dynamically import to avoid circular dependency if possible, or just assume it works
                        const { useWsStore } = await import('@/store/ws');
                        useWsStore().disconnect();
                    } catch (e) {
                        console.error("Failed to disconnect WS", e);
                    }

                    uni.showToast({ title: '请重新登录', icon: 'none' });
                    uni.reLaunch({ url: '/pages/login/login' });
                    reject(res);
                } else {
                    uni.showToast({ title: '请求失败', icon: 'none' });
                    reject(res);
                }
            },
            fail: (err) => {
                uni.showToast({ title: '网络错误', icon: 'none' });
                reject(err);
            },
        });
    });
};

export default request;
