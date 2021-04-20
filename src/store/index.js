import { createLogger, createStore } from 'vuex';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';

import appointment from './modules/appointment';

//TODO: disable in production
const debug = true;
PouchDB.plugin(PouchDBFind);
const db = new PouchDB('mimpf');

export default createStore({
  state: {
    syncState: false,
    syncURL: 'http://admin:admin@localhost:5984/mimpf'
  },
  modules: {
    appointment
  },
  methods: {
  },
  mutations: {
  },
  actions: {
    async findDocs(context, options) {
      return db.find(options);
    },
    async queryDocs(context, options) {
      return db.query(options.index, options.options);
    },
    async buildQueryIndex(context, doc){
      return new Promise((accept, reject) => {
        db.put(doc, (err, resp) => {
          if (err && err.status !== 409) { //TODO. update index if different
            reject(err);
          } else {
            accept(resp);
          }
        });
      });
    },
    async createIndex(context, options) {
      return db.createIndex(options);
    },
    async putDoc(context, doc){
      return db.put(doc);
    },
    async fetchDocs(context, idPrefix) {
      return db.allDocs({
        include_docs: true,
        startkey: idPrefix
      });
    },
    async syncDB(context) {
      db
        .sync(context.state.syncURL, { live: true, retry: true })
        .on('change', function(info) {
          // NOTICE: multiple tabs use the same IndexedDB -> no regular
          // vuex mutations. Maybe also accept 'push' changes?
          if (info.direction == 'pull' && info.change && info.change.docs) {
            // loop through all the changes
            for(let i in info.change.docs) {
              let change = info.change.docs[i];

              if (change._id.match(/^appointment:/)) {
                let match = context.getters['appointment/getAppointmentById'](change._id);

                if (match) {
                  // and it's a deletion
                  if (change._deleted == true) {
                  // remove it
                    context.commit('appointment/removeAppointment', match);
                  } else {
                  // modify it
                    context.commit('appointment/editAppointment', change);
                  }
                } else {
                // add it
                  if (!change._deleted) {
                    context.commit('appointment/addAppointment', change);
                  }
                }
              }
            }
          }
        })
        .on('paused', function() {
          // replication paused (e.g. replication up to date, user went offline)
        })
        .on('active', function() {
          // replicate resumed (e.g. new changes replicating, user went back online)
        })
        .on('denied', function() {
          // a document failed to replicate (e.g. due to permissions)
        })
        .on('complete', function() {
          // handle complete
        })
        .on('error', function() {
          // handle error
        })
    },
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
});
