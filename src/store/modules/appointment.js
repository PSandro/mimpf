import { customAlphabet } from 'nanoid'
import { alphanumeric } from 'nanoid-dictionary';
const nanoid = customAlphabet(alphanumeric, 11);


// initial state
const state = () => ({
  appointmentSelection: [],
  status: 'pending',
  loading: true,
  limit: 5,
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
  },
  getEndelement: (state) => {
    if (state.appointmentSelection.length < 1) {
      return {};
    }
    return state.appointmentSelection[state.appointmentSelection.length - 1];
  },
  getStartelement: (state) => {
    if (state.appointmentSelection.length < 1) {
      return {};
    }
    return state.appointmentSelection[0];
  },

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
      commit('addCount');
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
                emit([doc['status'], doc['date'], doc['lastName'], doc['firstName']], null);
              }
            }
          }.toString(),
          /* eslint-enable no-useless-escape */
          /* eslint-enable no-undef */
        }
      }
    }, { root: true });
  },
  fetchPreviousPage({getters, state, dispatch, commit}) {
    commit('setLoading', true);
    dispatch('createIndex').then(() => { // TODO: check if index already exists, see def. of buildQueryIndex
      let key = getters['getStartelement'];
      dispatch(
        'queryDocs',
        {
          index: 'index-appointment-pending-sorted/by_status',
          options: {
            include_docs: true,
            limit: state.limit,
            startkey: [state.status, key.date, key.lastName, key.firstName],
            startkey_docid: key._id,
            skip: (key === {} ) ? 0 : 1,
            descending: true,
          }
        },
        { root: true }
      ).then((appointments) => {
        commit('setAppointmentSelection', appointments.rows.map(el => el.doc).reverse());
        commit('setLoading', false)
      });
    });
  },
  fetchNextPage({getters, state, dispatch, commit}) {
    commit('setLoading', true);
    dispatch('createIndex').then(() => { // TODO: check if index already exists, see def. of buildQueryIndex
      let key = getters['getEndelement'];
      dispatch(
        'queryDocs',
        {
          index: 'index-appointment-pending-sorted/by_status',
          options: {
            include_docs: true,
            limit: state.limit,
            startkey: [state.status, key.date, key.lastName, key.firstName],
            startkey_docid: key._id,
            skip: (key === {} ) ? 0 : 1,
          }
        },
        { root: true }
      ).then((appointments) => {
        commit('setAppointmentSelection', appointments.rows.map(el => el.doc));
        commit('setLoading', false)
      });
    });
  },
  fetchAppointments({state, dispatch, commit}) {
    commit('setLoading', true);
    dispatch('createIndex').then(() => { // TODO: check if index already exists, see def. of buildQueryIndex
      dispatch(
        'queryDocs',
        {
          index: 'index-appointment-pending-sorted/by_status',
          options: {
            include_docs: true,
            limit: state.limit,
          }
        },
        { root: true }
      ).then((appointments) => {
        commit('setAppointmentSelection', appointments.rows.map(el => el.doc));
        commit('setLoading', false)
      });
    });
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
