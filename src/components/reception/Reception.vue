<template>
  <el-menu
    :default-active="activeIndex"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect"
  >
    <el-menu-item index="1">
      Termine
    </el-menu-item>
    <el-menu-item index="2">
      Warteschlange
    </el-menu-item>
  </el-menu>
  <Suspense>
    <template #default>
      <router-view />
    </template>
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<script>
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';


export default {
  name: 'Reception',
  setup() {
    const router = useRouter();
    const store = useStore();

    const handleSelect = (key) => {
      if (key === '1') {
        router.push({name: 'appointments'});
      }
    };
    return {
      addAppointment: () => store.dispatch('appointment/addAppointment'),
      activeIndex: '1',
      handleSelect
    }
  }
}
</script>
