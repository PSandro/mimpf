import { createStore, createLogger } from 'vuex';
import PouchDB from 'pouchdb';

import appointment from './modules/appointment';

const debug = process.env.NODE_env !== 'production';

const db = new PouchDB('mimpf');
// TODO: PouchDB.sync('mimpf', 'http://....', {live:true});

export default createStore({
	state: {
		db
	},
	modules: {
		appointment
	},
	strict: debug,
	plugins: debug ? [createLogger()] : []
});
