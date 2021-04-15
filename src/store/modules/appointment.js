import { customAlphabet } from 'nanoid'
import { alphanumeric } from 'nanoid-dictionary';
const nanoid = customAlphabet(alphanumeric, 11);


// initial state
const state = () => ({
  appointments: []
})

// getters
const getters = {
  getAppointmentById: (state) => (id) => {
    return state.appointments.find(appointment => id === appointment._id);
  }
}


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
  setAppointments (state, appointments) {
    state.appointments = appointments;
  },
  clearAppointments(state) {
    state.appointments = [];
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
    }).catch(() => {
      console.log('error adding appointment');
    });
			
  },
  fetchAppointments(ctx) {
    ctx.rootState.db.allDocs({
      include_docs: true,
      startkey: 'appointment:',
    }).then( (appointments) => {
      ctx.commit('setAppointments', appointments.rows.map(el => el.doc));
    })

  }

}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
