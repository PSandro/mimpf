<template>
  <el-table
    v-loading="loading"
    :data="appointments"
    style="width: 100%"
    empty-text="keine Termine geladen"
    :default-sort="{prop: 'date', order: 'ascending'}"
  >
    <el-table-column
      fixed
      prop="date"
      label="Uhrzeit"
      width="100"
    />
    <el-table-column
      fixed
      prop="firstName"
      label="Vorname"
      min-width="100"
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
import { computed } from 'vue'

export default {
  name: 'AppointmentTable',
  components: {
  },
  setup() {
    const store = useStore();

    const enqueueAppointment = (appointment) => {
      store.dispatch('appointment/editAppointmentStatus', {
        appointment: appointment,
        status: 'enqueued'
      });
    }



    return {
      appointments: computed(() => store.getters['appointment/getAppointmentSelection']),
      handleEnqueue: enqueueAppointment,
      loading: computed(() => store.getters['appointment/isLoading'])

    }
  }
}
</script>
