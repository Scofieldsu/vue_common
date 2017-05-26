export const INCREMENT = state => {
  state.count++
}
export const DECREMENT = state => {
  state.count--
}
export const CENTERIGHTWIDTH = state => {
  state.centerRightWidth = state.centerRightWidth ? 0 : 230
}
export const ADDPAGETYPE = (state, payload) => {
  state.addPageType = payload.addPageType
}
export const SAVESWARMPAGE = (state, payload) => {
  state.swarmInfo = payload.saveSwarmInfo
}
