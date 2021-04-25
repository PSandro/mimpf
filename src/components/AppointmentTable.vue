<template>
  <div>
    <p>{{ totalRows }} ausstehende Termine</p>
  </div>
  <el-button-group>
    <el-button
      type="primary"
      icon="el-icon-arrow-left el-icon-left"
      @click="handlePrev"
    >
      vorherige Seite
    </el-button>
    <el-button
      type="primary"
      :disabled="nextDisabled"
      @click="handleNext"
    >
      nächste Seite
      <i class="el-icon-arrow-right el-icon-right" />
    </el-button>
  </el-button-group>
  <el-table
    v-loading="loading"
    :data="appointments"
    style="width: 100%"
    empty-text="keine Termine geladen"
    :lazy="lazyLoad"
    :row-key="rowKey"
  >
    <el-table-column
      fixed
      prop="date"
      label="Uhrzeit"
      width="130"
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
import { computed, onMounted } from 'vue'

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

    const handleNext = () => {
      store.dispatch('appointment/updatePage', { previous: false });
    };
    const handlePrev = () => {
      store.dispatch('appointment/updatePage', { previous: true });
    };

    const fetchAppointments = () => {
      store.dispatch('appointment/updatePage', {key: {} });
    };

    onMounted(fetchAppointments);


    return {
      appointments: computed(() => store.getters['appointment/getAppointmentSelection']),
      handleEnqueue: enqueueAppointment,
      handleNext,
      handlePrev,
      loading: computed(() => store.getters['appointment/isLoading']),
      rowKey: "_id",
      lazyLoad: true,
      nextDisabled: computed(() => store.getters['appointment/isNextDisabled']),
      totalRows: computed(() => store.getters['appointment/getTotalRows']),

    }
  }
}
</script>
