import { customAlphabet } from 'nanoid'
import { alphanumeric } from 'nanoid-dictionary';
const nanoid = customAlphabet(alphanumeric, 11);


// initial state
const state = () => ({
  appointmentSelection: [],
  status: 'pending',
  loading: true,
  limit: 25
})

// getters
const getters = {
  getAppointmentById: (state) => (id) => {
    return state.appointmentSelection.find(appointment => id === appointment._id);
  },
  getAppointmentSelection: (state) => {
    return state.appointmentSelection;
  },
  isLoading: (state) => {
    return state.loading;
  }

}


// mutations
const mutations = {
  addAppointment(state, appointment) {
    if (this.status && !this.status === appointment.status) {
      return;
    }
    state.appointmentSelection.push(appointment);
  },
  editAppointment(state, editAppointment) {
    let appointment = state.appointmentSelection.find(appointment => editAppointment._id === appointment._id);
    let index = state.appointmentSelection.indexOf(appointment);
    if (index !== -1) {
      if (state.status && !(state.status === editAppointment.status)) {
        state.appointmentSelection.splice(index, 1);
      } else {
        state.appointmentSelection.splice(index, 1, editAppointment);
      }
    }
  },
  removeAppointment(state, appointment) {
    let index = state.appointmentSelection.indexOf(appointment);
    state.appointmentSelection.splice(index, 1);
  },
  setAppointmentSelection (state, appointmentSelection) {
    state.appointmentSelection = appointmentSelection;
  },
  clearAppointmentSelection(state) {
    state.appointmentSelection = [];
  },
  setLoading(state, loading) {
    state.loading = loading;
  }

}

// actions
const actions = {
  addAppointment({dispatch, commit}) {
    let appointment = {
      _id: 'appointment:' + nanoid(),
      date: new Date().getTime(),
      firstName: 'Max',
      lastName: 'Musterimpfling',
      stage: 1,
      vaccine: 'Comirnate - BioNTech/Pfizer',
      status: 'pending'
    }
    dispatch('putDoc', appointment, { root: true }).then((res) => {
      appointment._rev = res.rev;
      commit('addAppointment', appointment);
    }).catch(() => {
      console.log('error adding appointment');
    });
			
  },
  editAppointmentStatus({dispatch}, { appointment, status }) {
    const editAppointment= {
      ...appointment,
      status: status
    }
    dispatch('editAppointment', editAppointment);
  },
  editAppointment({dispatch, commit}, appointment) {
    dispatch('putDoc', appointment, { root: true }).then((res) => {
      appointment._rev = res.rev;
      commit('editAppointment', appointment);
    }).catch(() => {
      console.log('error adding appointment');
    });
			
  },
  fetchAppointments({state, dispatch, commit}) {
    if (state.status) {
      dispatch('fetchByState', state.status);
    } else {
      commit('setLoading', true)
      dispatch('fetchDocs', 'appointments:', { root: true }).then( (appointments) => {
        commit('setAppointmentSelection', appointments.rows.map(el => el.doc));
        commit('setLoading', false)
      })
    }

  },
  fetchByState({state, dispatch, commit}) {
    commit('setLoading', true)
    dispatch('createIndex', {
      index: {
        fields: ['_id', 'date', 'status']
      }
    }, { root: true }).then(() => {
      dispatch('findDocs', {
        selector: {
          _id: {
            $gt: 'appointment:',
            $lte: 'appointment:\uffff' //TODO: is this endkey already high enough?
          },
          status: state.status,
          date: {
            $gt: 0,
          }
        },
        limit: state.limit
      }, { root: true }).then((appointments) => {
        commit('setAppointmentSelection', appointments.docs);
        commit('setLoading', false)
      });
    });
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
