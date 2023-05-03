export type BotCheckinDto = {
    socketId?: string
    wanIp?: string
    lanIp?: string
    os?: string
    username?: string
    hostname?: string
    processName?: string
    processId?: number
    architecture?: string
    integrity?: string
    country?: string
    hwid?: string
    type?: string
    version?: string
    tag?: string
}