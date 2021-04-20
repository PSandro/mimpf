import { customAlphabet } from 'nanoid'
import { alphanumeric } from 'nanoid-dictionary';
const nanoid = customAlphabet(alphanumeric, 11);


// initial state
const state = () => ({
  appointmentSelection: [],
  status: 'pending',
  loading: true,
  limit: 15
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
  createIndex({dispatch}) {
    return dispatch('buildQueryIndex', {
      _id: '_design/index-appointment-pending-sorted',
      views: {
        by_status: {
          /* eslint-disable no-useless-escape */
          /* eslint-disable no-undef */
          map: function (doc) {
            if (typeof doc.status !== 'undefined') {
              let type = doc['_id'].match('^[^\:]+\:');
              if (type !== null && type[0] === 'appointment:') {
                emit([type, doc['status'], doc['date'], doc['lastName'], doc['firstName']], null);
              }
            }
          }.toString(),
          /* eslint-enable no-useless-escape */
          /* eslint-enable no-undef */
        }
      }
    }, { root: true });
  },
  fetchByState({state, dispatch, commit}) {
    commit('setLoading', true);
    dispatch('createIndex').then(() => { // TODO: check if index already exists, see def. of buildQueryIndex
      dispatch(
        'queryDocs',
        {
          index: 'index-appointment-pending-sorted/by_status',
          options: {
            include_docs: true,
            limit: state.limit
          }
        },
        { root: true }
      ).then((appointments) => {
        commit('setAppointmentSelection', appointments.rows.map(el => el.doc));
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
