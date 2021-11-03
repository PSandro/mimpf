import { customAlphabet } from 'nanoid'
import { alphanumeric } from 'nanoid-dictionary';
const nanoid = customAlphabet(alphanumeric, 11);


// initial state
const state = () => ({
  queueEntries: [],
  status: 'open',
  loading: true,
  totalRows: 0,
})

// getters
const getters = {
  getQueueEntryById: (state) => (id) => {
    return state.queueEntries.find(queueEntry => id === queueEntry._id);
  },
  getQueueEntries: (state) => {
    return state.queueEntries;
  },
  isLoading: (state) => {
    return state.loading;
  },
  getTotalRows: (state) => {
    return state.totalRows;
  },
}


// mutations
const mutations = {
  addQueueEntry(state, queueEntry) {
    if (state.status && state.status !== queueEntry.status) {
      return;
    }
    let idMatchqueueEntry = state.queueEntries.find(el => el._id === queueEntry._id);
    if (idMatchqueueEntry) {
      return;
    }

    state.queueEntries.push(queueEntry);
  },

  updateQueueEntry(state, editqueueEntry) {
    let queueEntry = state.queueEntries.find(queueEntry => editqueueEntry._id === queueEntry._id);
    let index = state.queueEntries.indexOf(queueEntry);
    if (index !== -1) {
      state.queueEntries.splice(index, 1, editqueueEntry);
    }
  },
  removeQueueEntry(state, queueEntry) {
    let idMatchqueueEntry = state.queueEntries.find(el => el._id === queueEntry._id);
    let index = state.queueEntries.indexOf(idMatchqueueEntry);
    state.queueEntries.splice(index, 1);
  },
  setQueueEntries (state, queueEntries) {
    state.queueEntries = queueEntries;
  },
  clearQueueEntries(state) {
    state.queueEntries = [];
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
  decreaseTotalRows(state) {
    if (state.totalRows > 0)
      state.totalRows--;
  },
}

// actions
const actions = {
  addQueueEntry({dispatch, commit}, {
    date = new Date().getTime(),
    pager = -1,
    persons = [],
    status = 'open',
    issue = []
  }) {
    let queueEntry = {
      _id: 'queueEntry:' + nanoid(),
      date,
      priority: new Date().getTime(),
      pager,
      persons,
      status,
      issue,
    }
    dispatch('putDoc', queueEntry, { root: true }).then((res) => {
      queueEntry._rev = res.rev;
      commit('addQueueEntry', queueEntry);
      commit('increaseTotalRows');
    })
			
  },
  editQueueEntryStatus({dispatch}, { queueEntry, status }) {
    const editQueueEntry= {
      ...queueEntry,
      status: status
    }
    dispatch('editQueueEntry', editQueueEntry);
  },
  receiveQueueEntryEdit({state, commit}, queueEntry) {
    if (state.status && state.status !== queueEntry.status) {
      commit('removeQueueEntry', queueEntry);
      commit('decreaseTotalRows');
    } else {
      commit('updateQueueEntry', queueEntry);
    }
  },
  editQueueEntry({dispatch}, queueEntry) {
    dispatch('putDoc', queueEntry, { root: true }).then((res) => {
      queueEntry._rev = res.rev;
      dispatch('receiveQueueEntryEdit', queueEntry);
    });
			
  },
  createIndex({dispatch}) {
    return dispatch('buildQueryIndex', {
      _id: '_design/index-queueEntry-open-sorted',
      views: {
        by_status: {
          /* eslint-disable no-useless-escape */
          /* eslint-disable no-undef */
          map: function (doc) {
            if (typeof doc['status'] !== 'undefined' && doc['status'] === 'open') {
              let type = doc['_id'].match('^[^\:]+\:');
              if (type !== null && type[0] === 'queueEntry:') {
                emit([doc['priority'], doc['_id']], null);
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
          index: 'index-queueEntry-open-sorted/by_status',
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
  fetchQueueEntrys({dispatch, commit}) {

    let selector = 
          {
            index: 'index-queueEntry-open-sorted/by_status',
            options: {
              include_docs: true,
              reduce: false
            }
          };
    return new Promise((accept) => {
      dispatch('createIndex').then(() => { // TODO: check if index already exists, see def. of buildQueryIndex
        dispatch(
          'queryDocs',
          selector,
          { root: true }
        ).then((queueEntrys) => {
          commit('setTotalRows', queueEntrys.total_rows);
          accept(queueEntrys.rows);
        });
      });
    });
  },
  updatePage({dispatch, commit}, payload) {
    commit('setLoading', true);
    dispatch('fetchQueueEntrys', payload).then((queueEntrys) => {
      // No more queueEntrys. Skip updating current queueEntries
      if (queueEntrys.length <= 0) { 
        commit('setLoading', false);
      } else {
        let result = queueEntrys.map(el => el.doc);
        commit('setQueueEntries', result);
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
