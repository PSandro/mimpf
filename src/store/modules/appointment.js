import { customAlphabet } from 'nanoid'
import { alphanumeric } from 'nanoid-dictionary';
const nanoid = customAlphabet(alphanumeric, 11);


// initial state
const state = () => ({
  appointmentSelection: []
})

// getters
const getters = {
  getAppointmentById: (state) => (id) => {
    return state.appointmentSelection.find(appointment => id === appointment._id);
  }
}


// mutations
const mutations = {
  addAppointment(state, appointment) {
    state.appointmentSelection.push(appointment);
  },
  editAppointment(state, editAppointment) {
    let appointment = state.appointmentSelection.find(appointment => editAppointment._id === appointment.id);
    let index = state.appointmentSelection.indexOf(appointment);
    state.appointmentSelection.splice(index, 1, editAppointment);
  },
  removeAppointment(state, appointment) {
    let index = state.appointmentSelection.indexOf(appointment);
    state.appointmentSelection.splice(index, 1);
  },
  setAppointmentSelection (state, appointmentSelection) {
    state.appointmentSelection = appointmentSelection;
  },
  clearAppointmentSelection(state) {
    state.appointmentSelection = [];
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
      ctx.commit('setAppointmentSelection', appointments.rows.map(el => el.doc));
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
