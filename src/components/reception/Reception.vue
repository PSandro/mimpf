<template>
  <div>
    <p>Blub!</p>
  </div>
  <button @click="addAppointment">
    add an empty appointment
  </button>
  <AppointmentTable />
</template>

<script>
import { useStore } from 'vuex'

import AppointmentTable from '@/components/AppointmentTable';

export default {
  name: 'Reception',
  components: {
    AppointmentTable,
  },
  setup() {
    const store = useStore();

    return {
      addAppointment: () => store.dispatch('appointment/addAppointment'),
    }
  }
}
</script>
