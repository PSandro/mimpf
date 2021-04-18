import { customAlphabet } from 'nanoid'
import { alphanumeric } from 'nanoid-dictionary';
const nanoid = customAlphabet(alphanumeric, 11);


// initial state
const state = () => ({
  appointmentSelection: []
})

// getters
const getters = {
  getAppointmentById: (state) => (id) => {
    return state.appointmentSelection.find(appointment => id === appointment._id);
  },
  getAppointmentSelection: (state) => {
    return state.appointmentSelection;
  }
}


// mutations
const mutations = {
  addAppointment(state, appointment) {
    state.appointmentSelection.push(appointment);
  },
  editAppointment(state, editAppointment) {
    let appointment = state.appointmentSelection.find(appointment => editAppointment._id === appointment._id);
    let index = state.appointmentSelection.indexOf(appointment);
    if (index !== -1) {
      state.appointmentSelection.splice(index, 1, editAppointment);
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
  }
}

// actions
const actions = {
  addAppointment({dispatch, commit}) {
    let appointment = {
      _id: 'appointment:' + nanoid(),
      date: new Date().toISOString(),
      firstName: 'Max',
      lastName: 'Musterimpfling',
      stage: 1,
      vaccine: 'Comirnate - BioNTech/Pfizer',
      state: 'pending'
    }
    dispatch('putDoc', appointment, { root: true }).then((res) => {
      appointment._rev = res.rev;
      commit('addAppointment', appointment);
    }).catch(() => {
      console.log('error adding appointment');
    });
			
  },
  editAppointment({dispatch, commit}, appointment) {
    dispatch('putDoc', appointment, { root: true }).then((res) => {
      appointment._rev = res.rev;
      commit('editAppointment', appointment);
    }).catch(() => {
      console.log('error adding appointment');
    });
			
  },
  fetchAppointments({dispatch, commit}) {
    dispatch('fetchDocs', 'appointments:', { root: true }).then( (appointments) => {
      commit('setAppointmentSelection', appointments.rows.map(el => el.doc));
    })

  },
  fetchPendingAppointments({dispatch, commit}) {
    dispatch('createIndex', {
      index: {
        fields: ['_id', 'state']
      }
    }, { root: true }).then(() => {
      dispatch('findDocs', {
        selector: {
          _id: {
            $gt: 'appointment:',
            $lte: 'appointment:\uffff' //TODO: is this endkey already high enough?
          },
          state: 'pending'
        }
      }, { root: true }).then((appointments) => {
        commit('setAppointmentSelection', appointments.docs);
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
