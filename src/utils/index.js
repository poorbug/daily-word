function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date, withTime) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('.')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return withTime ? `${t1} ${t2}` : t1
}

export function formatWeek (date) {
  const WEEK = ['', '一', '二', '三', '四', '五', '六', '日']
  return `周${WEEK[new Date(date * 1000).getDay()]}`
}

export function formatMonth (date) {
  const MONTH = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
  return `${MONTH[new Date(date * 1000).getMonth()]}月`
}

export function formatYear (date) {
  return new Date(date * 1000).getFullYear()
}
