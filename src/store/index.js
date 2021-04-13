import { createStore, createLogger } from 'vuex'
import appointment from './modules/appointment'

const debug = process.env.NODE_env !== 'production'

export default createStore({
	modules: {
		appointment
	},
	strict: debug,
	plugins: debug ? [createLogger()] : []
})
