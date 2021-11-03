import { createLogger, createStore } from 'vuex';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import PouchDBAuth from 'pouchdb-authentication';

import appointment from './modules/appointment';
import queue from './modules/queue';
import enqueue from './modules/enqueue';

//TODO: disable in production
const debug = true;
PouchDB.plugin(PouchDBFind);
PouchDB.plugin(PouchDBAuth);

const LOCAL_DB_NAME = "mimpf";
const LOCAL_DB_PARAMS = {auto_compaction: true};

let db = new PouchDB(LOCAL_DB_NAME, LOCAL_DB_PARAMS);
let remoteDB;
let sync = undefined;

export default createStore({
  state: {
    conAttrs: {
      ssl: false,
      host: "localhost:5984",
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
      return prefix + state.conAttrs.host + "/" + state.conAttrs.dbName;
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
    },
  },
  actions: {
    async findDocs(context, options) {
      return db.find(options);
    },
    async initRemoteDB({getters}) {
      remoteDB = new PouchDB(getters['getSyncURL']);
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
    async resetLocalDB(context) {
      await db.destroy();
      context.commit('appointment/clearAppointmentSelection');
      context.commit('queue/clearQueueEntries');
      context.commit('enqueue/clearSelection');

      db = new PouchDB(LOCAL_DB_NAME, LOCAL_DB_PARAMS);
    },
    async resetRemoteDB() {
      if (remoteDB) {
        await db.allDocs().then(function (result) {
          return Promise.all(result.rows.map(function (row) {
            return db.remove(row.id, row.value.rev);
          }));
        });
      }
    },
    async putDoc(context, doc){
      return db.put(doc);
    },
    async bulkDocs(context, docs){
      return db.bulkDocs(docs);
    },
    async fetchDocs(context, idPrefix) {
      return db.allDocs({
        include_docs: true,
        startkey: idPrefix
      });
    },
    async disconnect(context) {
      if (sync) {
        await sync.cancel();
        sync = null;
      }
      if (remoteDB) {
        await remoteDB.logout();
        await remoteDB.close();
        remoteDB = undefined;
      }
      await context.commit('setStatus', 'disconnected');
    },
    async login(context, {username, password}) {
      if (!remoteDB) {
        await context.dispatch('initRemoteDB');
      }
      return remoteDB.login(username, password);
    },
    async syncDB(context) {

      await context.commit('setStatus', 'notsyncing');
      if (sync) {
        await sync.cancel();
        sync = null;
      }
      if (!remoteDB) {
        await context.dispatch('initRemoteDB');
      }
      await context.commit('setStatus', 'syncing');
      sync = db
        .sync(remoteDB, { live: true, retry: true })
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
        .on('denied', function(err) {
          // a document failed to replicate (e.g. due to permissions)
          context.commit('setStatus', 'syncerror');
          console.log('[syncDB()]: Error (1):' + JSON.stringify(err));
        })
        .on('error', function(err) {
          // handle error
          context.commit('setStatus', 'syncerror');
          console.log('[syncDB()]: Error (2):' + JSON.stringify(err));
        })
    },
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
});
