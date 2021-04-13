import { nanoid } from 'nanoid'


// initial state
const state = () => ({
	appointments: [
          {_id: 'appointment:1', date: '8:30 Uhr', firstName: 'Max', lastName: 'Musterimpfling', stage: '1', vaccine: 'Comirnaty (BioNTech/Pfizer)'},
          {_id: 'appointment:2', date: '8:30 Uhr', firstName: 'Maxima', lastName: 'Musterimpfling', stage: '2', vaccine: 'Comirnaty (BioNTech/Pfizer)'},
          {_id: 'appointment:3', date: '8:45 Uhr', firstName: 'Helga', lastName: 'Schmitt', stage: '2', vaccine: 'Comirnaty (BioNTech/Pfizer)'},
	]
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
			date: 'null',
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
