<template>
  <OfflineBanner />
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue'
import OfflineBanner from './components/OfflineBanner.vue';
import { useAppStore } from '@/stores/appStore'

const appStore = useAppStore()
onMounted(appStore.inicializarTema)
</script>

<style>
</style>
