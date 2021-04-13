// initial state
const state = () => ({
	appointments: [
          {id: '1', time: '8:30 Uhr', firstName: 'Max', lastName: 'Musterimpfling', stage: '1', vaccine: 'Comirnaty (BioNTech/Pfizer)'},
          {id: '2', time: '8:30 Uhr', firstName: 'Maxima', lastName: 'Musterimpfling', stage: '2', vaccine: 'Comirnaty (BioNTech/Pfizer)'},
          {id: '3', time: '8:45 Uhr', firstName: 'Helga', lastName: 'Schmitt', stage: '2', vaccine: 'Comirnaty (BioNTech/Pfizer)'},
	]
})

// getters
const getters = {}


// actions
const actions = {}

// mutations
const mutations = {
	setAppointments (state, appointments) {
		state.appointments = appointments;
	}
}

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}
