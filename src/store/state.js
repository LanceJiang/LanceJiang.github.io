const state = {
  placeAddress: '所在位置', // 所在位置
  formattedPlace: '更具人性化的描述的出发地', // 更具人性化的描述的出发地
  position: [], // 所在位置：  latitude纬度 和 longitude经度
  userInfo: {
    openid: '',
    expires_in: '',
    session_key: '',
    // 以及其他信息 （昵称相关...）
  }, // 设置 user信息
}


export default state
