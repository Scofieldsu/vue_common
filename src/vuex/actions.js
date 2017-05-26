export const increment = ({commit}) => {
  commit('INCREMENT')
}
export const decrement = ({commit}) => {
  commit('DECREMENT')
}
export const centerRightWidth = ({commit}) => {
  commit('CENTERIGHTWIDTH')
}
export const addPageType = ({commit}, payload) => {
  commit('ADDPAGETYPE', payload)
}
export const saveSwarmPage = ({ commit }, payload) => {
  commit('SAVESWARMPAGE', payload)
}
