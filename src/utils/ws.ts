import { useUserStore } from '@/store/user'

const WS_URL = import.meta.env.VITE_WS_URL

class WebSocketClient {
    private socketTask: UniApp.SocketTask | null = null
    private isConnected = false
    private reconnectAttempts = 0
    private maxReconnectAttempts = 5
    private heartbeatInterval: any = null
    private subscriptions: Map<string, (payload: any) => void> = new Map()

    // Singleton instance
    private static instance: WebSocketClient

    public static getInstance(): WebSocketClient {
        if (!WebSocketClient.instance) {
            WebSocketClient.instance = new WebSocketClient()
        }
        return WebSocketClient.instance
    }

    public connect() {
        if (this.isConnected) return

        const userStore = useUserStore()
        const url = `${WS_URL}?access_token=${userStore.token}`

        this.socketTask = uni.connectSocket({
            url,
            success: () => console.log('WebSocket connecting...'),
            fail: (err) => console.error('WebSocket connection failed:', err)
        })

        this.socketTask.onOpen(() => {
            console.log('WebSocket Connected')
            this.isConnected = true
            this.reconnectAttempts = 0
            this.startHeartbeat()

            // Send CONNECT frame
            this.sendStompFrame('CONNECT', {
                'accept-version': '1.2',
                'heart-beat': '10000,10000',
                'login': userStore.token,  // 或直接用 header 传 token
                // 或者直接用查询参数传 token（你已经在 url 里传了 access_token，这也够了）
            })
        })

        this.socketTask.onMessage((res) => {
            this.handleMessage(res.data)
        })

        this.socketTask.onClose(() => {
            console.log('WebSocket Closed')
            this.isConnected = false
            this.stopHeartbeat()
            this.retryConnect()
        })

        this.socketTask.onError((err) => {
            console.error('WebSocket Error:', err)
            this.isConnected = false
        })
    }

    private sendStompFrame(command: string, headers: Record<string, string> = {}, body: string = '') {
        if (!this.isConnected) return

        let frame = `${command}\n`
        for (const [key, value] of Object.entries(headers)) {
            frame += `${key}:${value}\n`
        }
        frame += '\n' + body + '\0'

        this.socketTask?.send({
            data: frame,
            fail: (err) => console.error('Send failed:', err)
        })
    }

    private handleMessage(data: string | ArrayBuffer) {
        if (typeof data !== 'string') return

        // 累积缓冲（防止粘包）
        if (!this.buffer) this.buffer = ''
        this.buffer += data

        let index
        while ((index = this.buffer.indexOf('\0')) !== -1) {
            const frame = this.buffer.substring(0, index)
            this.buffer = this.buffer.substring(index + 1)

            this.parseStompFrame(frame)
        }
    }

// 新增 buffer 属性
    private buffer = ''

    private parseStompFrame(frame: string) {
        if (!frame.trim()) return // heartbeat

        const lines = frame.split('\n')
        const command = lines[0].trim()

        if (command === 'CONNECTED') {
            console.log('STOMP CONNECTED')
            // 可以在这里重新订阅之前丢失的订阅
        } else if (command === 'MESSAGE') {
            const headers: Record<string, string> = {}
            let bodyStartLine = 1
            for (let i = 1; i < lines.length; i++) {
                if (lines[i].trim() === '') {
                    bodyStartLine = i + 1
                    break
                }
                const [k, v] = lines[i].split(':')
                if (k && v) headers[k.trim()] = v.trim()
            }

            const body = lines.slice(bodyStartLine).join('\n').trim()

            const dest = headers['destination']
            if (dest) {
                const callback = this.subscriptions.get(dest)
                if (callback) {
                    try {
                        callback(JSON.parse(body))
                    } catch {
                        callback(body)
                    }

                }
            }
        }
        // 可加 ERROR 帧处理
    }

    public subscribe(destination: string, callback: (payload: any) => void) {
        if (!this.isConnected) return
        this.subscriptions.set(destination, callback)
        const id = 'sub-' + Math.floor(Math.random() * 10000)
        this.sendStompFrame('SUBSCRIBE', { id, destination })
    }

    public send(destination: string, body: object) {
        if (!this.isConnected) return
        this.sendStompFrame('SEND', { destination }, JSON.stringify(body))
    }

    public close() {
        this.stopHeartbeat()
        this.socketTask?.close({})
        this.isConnected = false
        this.subscriptions.clear()
    }

    private startHeartbeat() {
        this.stopHeartbeat()
        this.heartbeatInterval = setInterval(() => {
            // Send a newline as heartbeat (often sufficient for simple STOMP)
            // Or send PING frame if server requires strict
            this.socketTask?.send({ data: '\n' })
        }, 20000)
    }

    private stopHeartbeat() {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval)
            this.heartbeatInterval = null
        }
    }

    private retryConnect() {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++
            setTimeout(() => {
                console.log(`Reconnecting attempt ${this.reconnectAttempts}...`)
                this.connect()
            }, 5000)
        }
    }
}

export default WebSocketClient.getInstance()
