function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime (date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export function showToast(title) {
  wx.showToast({
    title: title,
    icon: 'none'
  })
}

export function debounce(func, delay) {
  let timer
  return function () {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this)
    }, delay)
  }
}

// 将位置转换为地址
export function reverseGeocoder(qqmapsdk, {latitude, longitude}) {
  return new Promise((resolve, reject) => {
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude,
      },
      success: (res) => resolve(res),
      fail: (res) => reject(res)
    })
  })
}
// 获取深入的对象的具体值
export const getDeepData = function (source, keyList, nullValue = null){
  return keyList.reduce((result, value) => {
    return (result && result[value]) ? result[value] : nullValue
  }, source)
}
export default {
  formatNumber,
  formatTime
}
