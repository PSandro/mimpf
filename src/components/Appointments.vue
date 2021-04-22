<template>
  <button @click="addAppointment">
    add an empty appointment
  </button>
  <Suspense>
    <template #default>
      <AppointmentTable />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<script>
import { useStore } from 'vuex';
import { defineAsyncComponent } from 'vue';


export default {
  name: 'Appointment',
  components: {
    AppointmentTable: defineAsyncComponent(() => import('@/components/AppointmentTable')),
  },
  setup() {
    const store = useStore();
    return {
      addAppointment: () => store.dispatch('appointment/addAppointment'),
    }
  }
}
</script>
