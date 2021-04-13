import { nanoid } from 'nanoid'


// initial state
const state = () => ({
	appointments: []
})

// getters
const getters = {}


// mutations
const mutations = {
	addAppointment(state, appointment) {
		state.appointments.push(appointment);
	},
	editAppointment(state, editAppointment) {
		let appointment = state.appointments.find(appointment => editAppointment._id === appointment.id);
		let index = state.appointments.indexOf(appointment);
		state.appointments.splice(index, 1, editAppointment);
	},
	removeAppointment(state, appointment) {
		let index = state.appointments.indexOf(appointment);
		state.appointments.splice(index, 1);
	},
	cleanNewAppointment(state) {
		state.appointment = '';
	},
	setAppointments (state, appointments) {
		state.appointments = appointments;
	}
}

// actions
const actions = {
	addAppointment(ctx) {
		let appointment = {
			_id: 'appointment:' + nanoid(),
			date: new Date().toISOString(),
			firstName: 'Max',
			lastName: 'Musterimpfling',
			stage: 1,
			vaccine: 'Comirnate - BioNTech/Pfizer'
		}
		ctx.rootState.db.put(appointment).then((res) => {
			appointment._rev = res.rev;
			ctx.commit('addAppointment', appointment);
			ctx.commit('cleanNewAppointment', appointment);
		}).catch(() => {
			console.log('error adding appointment');
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
