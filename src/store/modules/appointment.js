import { customAlphabet } from 'nanoid'
import { alphanumeric } from 'nanoid-dictionary';
import dayjs from 'dayjs'

const nanoid = customAlphabet(alphanumeric, 11);


// initial state
const state = () => ({
  appointmentSelection: [],
  status: 'pending',
  loading: true,
  limit: 5,
  totalRows: 0,
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
  isNextDisabled: (state) => {
    return state.totalRows <= state.limit || state.appointmentSelection.length < state.limit;
  },
}


// mutations
const mutations = {
  addAppointment(state, appointment) {
    if (state.appointmentSelection.length >= state.limit) {
      return;
    }
    if (state.status && state.status !== appointment.status) {
      return;
    }
    let idMatchAppointment = state.appointmentSelection.find(el => el._id === appointment._id);
    if (idMatchAppointment) {
      return;
    }
    state.appointmentSelection.push(appointment);
  },

  updateAppointment(state, editAppointment) {
    let appointment = state.appointmentSelection.find(appointment => editAppointment._id === appointment._id);
    let index = state.appointmentSelection.indexOf(appointment);
    if (index !== -1) {
      state.appointmentSelection.splice(index, 1, editAppointment);
    }
  },
  removeAppointment(state, appointment) {
    let idMatchAppointment = state.appointmentSelection.find(el => el._id === appointment._id);
    let index = state.appointmentSelection.indexOf(idMatchAppointment);
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
  increaseTotalRows(state) {
    state.totalRows++;
  },
  increaseTotalRowsBy(state, count) {
    state.totalRows+=count;
  },
  decreaseTotalRows(state) {
    if (state.totalRows > 0)
      state.totalRows--;
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
      commit('increaseTotalRows');
    })
			
  },
  addAppointments({dispatch, commit}, appointments) {
    for (let index = 0; index < appointments.length; index++){
      let res = appointments[index];

      console.log(res);
      res._id = 'appointment:' + nanoid();
      res.date = dayjs(res.day + ";" + res.time, "YYYY-MM-DD;HH:mm").unix();
      res.status = 'pending';

      delete res.place;
      delete res.day;
      delete res.time;
      continue;
    }
    
    dispatch('bulkDocs', appointments, { root: true}).then((results) => {
      
      commit('increaseTotalRowsBy', results.length);
      console.log("hm?" + results.length === appointments.length)
      for (let index = 0; index < results.length; index++){
        let app = appointments[index];
        app._rev = results[index].rev;
        commit('addAppointment', appointments[index]);
      }
    });
  },
  editAppointmentStatus({dispatch}, { appointment, status }) {
    const editAppointment= {
      ...appointment,
      status: status
    }
    dispatch('editAppointment', editAppointment);
  },
  receiveAppointmentEdit({state, dispatch, commit, getters}, appointment) {
    if (state.status && state.status !== appointment.status) {
      commit('removeAppointment', appointment);
      commit('decreaseTotalRows');

      // fetch following appointments
      dispatch('fetchAppointments', {key: getters['getEndelement'], skip: 1, limit: 1}).then((result) => {
        if (result[0]) {
          commit('addAppointment', result[0].doc);
        }
      });

    } else {
      commit('updateAppointment', appointment);
    }
  },
  editAppointment({dispatch}, appointment) {
    dispatch('putDoc', appointment, { root: true }).then((res) => {
      appointment._rev = res.rev;
      dispatch('receiveAppointmentEdit', appointment);
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
        if (result && result.rows && result.rows.length > 0) {
          commit('setTotalRows', result.rows[0].value);
        }
      });
    });
  },
  fetchAppointments({getters, state, dispatch, commit}, { previous = false, key, skip = 0, limit} = {}) {
    
    if (limit === undefined) {
      limit = state.limit;
    }

    if (key === undefined) {
      skip = 1;
      key = previous ? getters['getStartelement'] : getters['getEndelement'];
    }

    let selector = 
          {
            index: 'index-appointment-pending-sorted/by_status',
            options: {
              include_docs: true,
              limit: limit,
              startkey: (Object.keys(key) <= 0) ? [] : [key.date, key.lastName, key.firstName],
              startkey_docid: (Object.keys(key) <= 0) ? {} :  key._id,
              skip: skip,
              descending: previous,
              reduce: false
            }
          };
    return new Promise((accept) => {
      dispatch('createIndex').then(() => { // TODO: check if index already exists, see def. of buildQueryIndex
        dispatch(
          'queryDocs',
          selector,
          { root: true }
        ).then((appointments) => {
          commit('setTotalRows', appointments.total_rows);
          let result = appointments.rows;
          if (previous) {
            result.reverse();
            
            // if items of the previous pages have been updated, fill page
            if ((result.length < state.limit) && (result.length < state.totalRows)) {
              dispatch('fetchAppointments', {
                previous: false,
                key: (result.length > 0) ? result[result.length-1].doc : {},
                skip: (result.length > 0) ? 1 : 0,
                limit: state.limit - result.length
              }).then((missingResults) => {
                if (missingResults) {
                  result.push(...missingResults);
                }
                accept(result);
              });
            } else {
              accept(result);
            }
          } else { 
            accept(result);
          }
        });
      });
    });
  },
  updatePage({dispatch, commit}, payload) {
    commit('setLoading', true);
    dispatch('fetchAppointments', payload).then((appointments) => {
      // No more appointments. Skip updating current appointmentSelection
      if (appointments.length <= 0) { 
        commit('setLoading', false);
      } else {
        let result = appointments.map(el => el.doc);
        commit('setAppointmentSelection', result);
        commit('setLoading', false)
      }
    }).catch(() => {
      console.log('error while updating page');
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
