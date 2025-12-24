import request from "@/utils/request";

/**
 * Identify user data structure
 */
export interface UserProfile {
    id: number;
    nickname: string;
    avatar: string;
    phone?: string;
    openid?: string;
    coins?: number;
    streak?: number;
    level?: number;
    wordPower?: number;
    totalBattles?: number;
    winCount?: number;
}

/**
 * Get current user profile
 */
export function getUserProfile() {
    return request<UserProfile>({
        url: "/user/profile",
        method: "GET",
    });
}

/**
 * Update user profile
 */
export function updateUserProfile(data: { nickname?: string; avatar?: string }) {
    return request<boolean>({
        url: "/user/update",
        method: "POST",
        data,
    });
}
