import { defineStore } from 'pinia';
import ws from '@/utils/ws';

export const useWsStore = defineStore('ws', {
    state: () => ({
        isConnected: false,
        currentRoomId: '',
    }),
    actions: {
        connect() {
            ws.connect();
            this.isConnected = true;
        },
        disconnect() {
            ws.close();
            this.isConnected = false;
            this.currentRoomId = '';
        },
        subscribeRoom(roomId: string, callback: (msg: any) => void) {
            this.currentRoomId = roomId;
            ws.subscribe(`/topic/room/${roomId}`, callback);
        },
        sendMessage(destination: string, body: object) {
            ws.send(destination, body);
        }
    }
});
