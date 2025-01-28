<script setup>
import { RouterLink, RouterView } from 'vue-router'
import MenuKevh from './views/menukevh.vue'
import SidebarMenu from './views/sidebarMenu.vue'


</script>

<template>
  <MenuKevh />
  <div class="grid">
    <!-- <SidebarMenu /> -->
    <RouterView />
  </div>
  <Toast />
</template>