
const state = () => ({
  selected: [],
})

// getters
const getters = {
  getSelection: (state) => {
    return state.selected;
  },
}


// mutations
const mutations = {
  selectAppointment(state, appointment) {
    let idMatchqueueEntry = state.selected.find(el => el._id === appointment._id);
    if (idMatchqueueEntry) {
      return;
    }

    state.selected.push(appointment);
  },
  clearSelection(state) {
    state.selected = [];
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
