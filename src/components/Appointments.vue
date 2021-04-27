<template>
  <button @click="addAppointment">
    add an empty appointment
  </button>
  <router-view v-slot="{ Component }">
    <template v-if="Component">
      <keep-alive>
        <suspense>
          <component :is="Component" />
          <template #fallback>
            <div>Loading...</div>
          </template>
        </suspense>
      </keep-alive>
    </template>
  </router-view>
</template>

<script>
import { useStore } from 'vuex';


export default {
  name: 'Appointment',
  components: {
  },
  setup() {
    const store = useStore();

    return {
      addAppointment: () => store.dispatch('appointment/addAppointment'),
    }
  }
}
</script>
