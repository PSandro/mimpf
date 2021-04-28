
const state = () => ({
  selected: [],
})

// getters
const getters = {
  getSelection: (state) => {
    return state.selected;
  },
  getSelectionCount: (state) => {
    return state.selected.length;
  },
  isSelectedID: (state) => (id) => {
    let match = state.selected.find(el => el._id === id);
    return (match !== undefined);

  }
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
  unselectAppointment(state, appointment) {
    let match = state.selected.find(el => el._id === appointment._id);
    if (match === undefined) {
      return;
    }
    let index = state.selected.indexOf(match);
    state.selected.splice(index, 1);
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
