<template>
  <el-form
    label-width="120px"
  >
    <el-form-item label="Ankunftszeit">
      <el-col :span="11">
        <el-time-picker
          v-model="arrival"
          placeholder="Zeit auswählen"
          style="width: 100%;"
        />
      </el-col>
    </el-form-item>
    <el-form-item label="Pager/Piepser">
      <el-switch v-model="pagerEnabled" />
      <el-input-number
        v-model="pager"
        :disabled="pagerEnabled === false"
        :min="1"
      />
    </el-form-item>
    <el-form-item label="Prioritätsboost">
      <el-radio-group v-model="boost">
        <el-radio
          label="0%"
          name="boost"
        />
        <el-radio
          label="25%"
          name="boost"
        />
        <el-radio
          label="50%"
          name="boost"
        />
        <el-radio
          label="75%"
          name="boost"
        />
        <el-radio
          label="100%"
          name="boost"
        />
      </el-radio-group>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        @click="handleEnqueue"
      >
        Einreihen
      </el-button>
      <el-button>Abbrechen</el-button>
    </el-form-item>
  </el-form>
  <el-row>
    <el-col
      v-for="(appointment, index) in appointments"
      :key="appointment._id"
      :span="9"
      :offset="index > 0 ? 2 : 0"
    >
      <el-card class="box-card">
        <template #header>
          <div class="card-header">
            <span> {{ appointment.firstName + ' ' + appointment.lastName }} </span>
            <el-button
              @click="handleUnselect(appointment)"
            >
              entfernen
            </el-button>
          </div>
        </template>
        <div>
          {{ appointment.vaccine }}
          {{ appointment.stage }}
          {{ appointment.date }}
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { useStore } from 'vuex';
import { computed, ref } from 'vue';
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
        ],
        pager: (pagerEnabled.value ? pager.value : -1),
        arrival

      }).then(() => {
        store.commit('enqueue/clearSelection');
      });
    }

    const formatDate = (row, column, cellValue) => {
      let timestamp = new Number(cellValue);
      return dayjs(timestamp)
        .format('HH:mm') + ' Uhr';
    };

    const arrival = ref(new Date());
    const pager = ref(1);
    const pagerEnabled = ref(false);
    const boost = ref("0%");
    
    return {
      handleEnqueue: enqueueAppointment,
      handleUnselect: (appointment) => store.commit('enqueue/unselectAppointment', appointment),
      appointments,
      formatDate,
      arrival,
      pager,
      pagerEnabled,
      boost
    }
  }
}
</script>
