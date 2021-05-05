import { createLogger, createStore } from 'vuex';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';

import appointment from './modules/appointment';
import queue from './modules/queue';
import enqueue from './modules/enqueue';

//TODO: disable in production
const debug = true;
PouchDB.plugin(PouchDBFind);
const db = new PouchDB('mimpf');
let sync = undefined;

export default createStore({
  state: {
    syncState: false,
    ssl: false,
    host: "localhost:5984",
    user: "admin",
    pass: "admin",
    dbName: "mimpf",
  },
  modules: {
    appointment,
    queue,
    enqueue
  },
  getters: {
    getConnectionAttributes: (state) => {
      return {
        ssl: state.ssl,
        host: state.host,
        user: state.user,
        pass: state.pass,
        dbName: state.dbName
      }
    },
    getSyncURL: (state) => {
      const prefix = state.ssl ? "https://" : "http://";
      //TODO: maybe prevent some "injections"?
      return prefix + state.user + ":" + state.pass + "@" + state.host + "/" + state.dbName;
    },
  },
  mutations: {
    setConnectionAttributes: (state, attrs={}) => {
      state.ssl = attrs.ssl;
      state.host = attrs.host;
      state.user = attrs.user;
      state.pass = attrs.pass;
      state.dbName = attrs.dbName;
    },
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
      if (sync) {
        await sync.cancel();
      }
      console.log(context.getters['getSyncURL']);
      sync = db
        .sync(context.getters['getSyncURL'], { live: true, retry: true })
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
                    context.dispatch('appointment/receiveAppointmentEdit', change);
                  }
                } else {
                // add it
                  if (!change._deleted) {
                    context.commit('appointment/addAppointment', change);
                  }
                }
                context.dispatch('appointment/fetchPendingCount');
              } else if (change._id.match(/^queueEntry:/)) {
                let match = context.getters['queue/getQueueEntryById'](change._id);

                if (match) {
                  // and it's a deletion
                  if (change._deleted == true) {
                  // remove it
                    context.commit('queue/removeQueueEntry', match);
                  } else {
                  // modify it
                    context.dispatch('queue/receiveQueueEntryEdit', change);
                  }
                } else {
                // add it
                  if (!change._deleted) {
                    context.commit('queue/addQueueEntry', change);
                  }
                }
                context.dispatch('queue/fetchPendingCount');
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
