import { createLogger, createStore } from 'vuex';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';

import appointment from './modules/appointment';
import queue from './modules/queue';
import enqueue from './modules/enqueue';

//TODO: disable in production
const debug = true;
PouchDB.plugin(PouchDBFind);
let db = new PouchDB("mimpf");
let sync = undefined;

export default createStore({
  state: {
    conAttrs: {
      ssl: false,
      host: "localhost:5984",
      user: "admin",
      pass: "admin",
      dbName: "mimpf",
    },
    status: 'notsyncing',
  },
  modules: {
    appointment,
    queue,
    enqueue
  },
  getters: {
    getConnectionAttributes: (state) => {
      return state.conAttrs;
    },
    getStatus: (state) => {
      return state.status;
    },
    getSyncURL: (state) => {
      const prefix = state.conAttrs.ssl ? "https://" : "http://";
      //TODO: maybe prevent some "injections"?
      return prefix + state.conAttrs.user + ":" + state.conAttrs.pass + "@" + state.conAttrs.host + "/" + state.conAttrs.dbName;
    },
  },
  mutations: {
    setConnectionAttributes: (state, attrs={}) => {
      state.conAttrs = {
        ssl: attrs.ssl,
        host: attrs.host,
        user: attrs.user,
        pass: attrs.pass,
        dbName: attrs.dbName,
      }
    },
    setStatus: (state, status) => {
      state.status = status;
    }
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

      await context.commit('setStatus', 'notsyncing');
      if (sync) {
        await sync.cancel();
        sync = null;
      }
      await context.commit('setStatus', 'syncing');
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
                    context.commit('appointment/decreaseTotalRows');
                  } else {
                  // modify it
                    context.dispatch('appointment/receiveAppointmentEdit', change);
                  }
                } else {
                // add it
                  if (!change._deleted) {
                    context.commit('appointment/addAppointment', change);
                    context.commit('appointment/increaseTotalRows');
                  } else {
                    context.commit('appointment/decreaseTotalRows');
                  }
                }
              } else if (change._id.match(/^queueEntry:/)) {
                let match = context.getters['queue/getQueueEntryById'](change._id);

                if (match) {
                  // and it's a deletion
                  if (change._deleted == true) {
                  // remove it
                    context.commit('queue/removeQueueEntry', match);
                    context.commit('queue/decreaseTotalRows');
                  } else {
                  // modify it
                    context.dispatch('queue/receiveQueueEntryEdit', change);
                  }
                } else {
                // add it
                  if (!change._deleted) {
                    context.commit('queue/addQueueEntry', change);
                    context.commit('queue/increaseTotalRows');
                  }
                }
              }
            }
          }
        })
        .on('paused', function(e) {
          // replication paused (e.g. replication up to date, user went offline)
          if (e) 
            context.commit('setStatus', 'syncerror');
        })
        .on('denied', function() {
          // a document failed to replicate (e.g. due to permissions)
          context.commit('setStatus', 'syncerror');
        })
        .on('error', function() {
          // handle error
          context.commit('setStatus', 'syncerror');
        })
    },
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
});
