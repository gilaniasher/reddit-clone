import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

export const formatLikes = (num: number) => Math.abs(num) > 999 ? Math.sign(num) * Math.round(Math.abs(num) / 100) / 10 + 'k' : Math.sign(num) * Math.abs(num)
export const formatTime = (timestamp: string) => dayjs(timestamp).fromNow()
