<template>
  <button @click="handleEnqueue">
    enqueue
  </button>
  <button @click="clearSelection">
    clear
  </button>
  <div> {{ appointments }} </div>
</template>

<script>
import { useStore } from 'vuex';
import { computed } from 'vue';
import dayjs from 'dayjs';

export default {
  name: 'EnqueueForm',
  components: {
  },
  setup() {
    const store = useStore();
    
    const appointments = computed(() => store.getters['enqueue/getSelection']);

    const enqueueAppointment = () => {

      appointments.value.forEach(appo => { //TODO: instead of forEach, use bulk operation (with pouchdb)
        store.dispatch('appointment/editAppointmentStatus', {
          appointment: appo,
          status: 'enqueued'
        });
      });
      store.dispatch('queue/addQueueEntry', {
        persons: [
          ...appointments.value
        ],
        issue: [
          ...appointments.value.map(el => el.stage),
        ]
      });
    }

    const formatDate = (row, column, cellValue) => {
      let timestamp = new Number(cellValue);
      return dayjs(timestamp)
        .format('HH:mm') + ' Uhr';
    };


    return {
      handleEnqueue: enqueueAppointment,
      clearSelection: () => store.commit('enqueue/clearSelection'),
      appointments,
      formatDate,

    }
  }
}
</script>
