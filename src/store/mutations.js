import * as types from './mutation-types'

const mutations = {
  [types.SET_PLACE_ADDRESS](state, placeAddress){
    state.placeAddress = placeAddress
  },
  [types.SET_FORMATTED_PLACE](state, formattedPlace){
    state.formattedPlace = formattedPlace
  },
  [types.SET_POSITION](state, position){
    state.position = position
  },
  [types.SET_USER_INFO](state, userInfo){
    state.userInfo = userInfo
  },
}

export default mutations
