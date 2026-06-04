/** 获取问候语 */
export function getGreeting(): string {
  const hour = new Date().getHours()

  if (hour < 6) return '夜深了，注意休息'
  if (hour < 9) return '早上好，新的一天开始了'
  if (hour < 12) return '上午好，专注高效'
  if (hour < 14) return '中午好，记得吃饭'
  if (hour < 18) return '下午好，继续加油'
  if (hour < 22) return '晚上好，放松一下'

  return '夜深了，注意休息'
}

/** 格式化日期 */
export function formatDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  const weekDay = weekDays[date.getDay()]

  return `${year}年${month}月${day}日 星期${weekDay}`
}

/** 格式化时间 */
export function formatTime(date: Date): string {
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')

  return `${hours}:${minutes}:${seconds}`
}
