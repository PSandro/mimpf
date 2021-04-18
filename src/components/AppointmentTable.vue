<template>
  <el-table
    :data="appointments"
    style="width: 100%"
    empty-text="keine Termine geladen"
    :default-sort="{prop: 'date', order: 'ascending'}"
  >
    <el-table-column
      fixed
      prop="_id"
      label="ID"
      width="200"
    />
    <el-table-column
      fixed
      prop="date"
      label="Uhrzeit"
      width="150"
    />
    <el-table-column
      fixed
      prop="firstName"
      label="Vorname"
      width="120"
    />
    <el-table-column
      fixed
      prop="lastName"
      label="Nachname"
      min-width="120"
    />
    <el-table-column
      prop="stage"
      label="Erst-/Zweitimpfung"
      width="100"
      align="center"
    />
    <el-table-column
      prop="vaccine"
      label="Impfstoff"
      width="200"
    />
    <el-table-column
      fixed="right"
      width="120"
      label="Aktion"
    >
      <template #default="scope">
        <el-button
          size="small"
          type="primary"
          @click="handleEnqueue(scope.row)"
        >
          Einreihen
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { useStore } from 'vuex'
import { onMounted, computed } from 'vue'

export default {
  name: 'AppointmentTable',
  components: {
  },
  setup() {
    const store = useStore();

    const enqueueAppointment = (appointment) => {
      const editAppointment= {
        ...appointment,
        state: 'enqueued'
      }
      store.dispatch('appointment/editAppointment', editAppointment);
    }

    const fetchPendingAppointments = () => {
      store.dispatch('appointment/fetchPendingAppointments');
    };

    onMounted(fetchPendingAppointments);

    return {
      appointments: computed(() => store.getters['appointment/getAppointmentSelection']),
      handleEnqueue: enqueueAppointment,
      fetchPendingAppointments

    }
  }
}
</script>
