import { customAlphabet } from 'nanoid'
import { alphanumeric } from 'nanoid-dictionary';
const nanoid = customAlphabet(alphanumeric, 11);


// initial state
const state = () => ({
  appointmentSelection: [],
  status: 'pending',
  loading: true,
  limit: 5,
  totalRows: 0,
  prevDisabled: false,
  nextDisabled: false,
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
  getTotalRows: (state) => {
    return state.totalRows;
  },
  isPrevDisabled: (state) => {
    return state.prevDisabled;
  },
  isNextDisabled: (state) => {
    return state.nextDisabled;
  },
}


// mutations
const mutations = {
  addAppointment(state, appointment) {
    if (state.status && !state.status === appointment.status) {
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
  },
  setTotalRows(state, totalRows) {
    state.totalRows = totalRows;
  },
  setPrevDisabled(state, disabled = true) {
    state.prevDisabled = disabled;
  },
  setNextDisabled(state, disabled = true) {
    state.nextDisabled = disabled;
  },

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
      dispatch('fetchPendingCount');
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
      dispatch('fetchPendingCount');
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
            if (typeof doc['status'] !== 'undefined' && doc['status'] === 'pending') {
              let type = doc['_id'].match('^[^\:]+\:');
              if (type !== null && type[0] === 'appointment:') {
                emit([doc['date'], doc['lastName'], doc['firstName']], null);
              }
            }
          }.toString(),

          reduce: '_count',
          /* eslint-enable no-useless-escape */
          /* eslint-enable no-undef */
        }
      }
    }, { root: true });
  },
  fetchPendingCount({dispatch, commit}) {
    dispatch('createIndex').then(() => { // TODO: check if index already exists, see def. of buildQueryIndex
      dispatch(
        'queryDocs',
        {
          index: 'index-appointment-pending-sorted/by_status',
          options: {
            reduce: true
          }
        },
        { root: true }
      ).then((result) => {
        commit('setTotalRows', result.rows[0].value);
      });
    });
  },
  fetchPage({getters, state, dispatch, commit}, { previous = false, keyAppointment} = {}) {
    commit('setLoading', true);
    let key;
    let skip = 1;

    if (keyAppointment !== undefined) {
      key = keyAppointment;
      skip = 0;
    } else {
      key = previous ? getters['getStartelement'] : getters['getEndelement'];
    }
    dispatch('createIndex').then(() => { // TODO: check if index already exists, see def. of buildQueryIndex
      dispatch(
        'queryDocs',
        {
          index: 'index-appointment-pending-sorted/by_status',
          options: {
            include_docs: true,
            limit: state.limit,
            startkey: (Object.keys(key) <= 0) ? [] : [key.date, key.lastName, key.firstName],
            startkey_docid: (Object.keys(key) <= 0) ? {} :  key._id,
            skip: skip,
            descending: previous,
            reduce: false
          }
        },
        { root: true }
      ).then((appointments) => {
        commit('setTotalRows', appointments.total_rows);

        // No more appointments. Skip updating current appointmentSelection
        if (appointments.rows.length <= 0) { 
          commit('setLoading', false);
        } else {
          let result = appointments.rows.map(el => el.doc);
          if (previous) {
            result.reverse()
          }
          commit('setAppointmentSelection', result);
          commit('setLoading', false)
        }
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
