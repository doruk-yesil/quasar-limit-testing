<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>My Demo</q-toolbar-title>
        <q-btn flat icon="notifications" />
        <q-btn flat icon="settings" />
        <q-btn flat icon="email" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="drawer" bordered>
      <q-list>
        <q-item clickable to="/dashboard">
          <q-item-section avatar><q-icon name="dashboard" /></q-item-section>
          <q-item-section>Dashboard</q-item-section>
        </q-item>
        <q-item clickable to="/employees">
          <q-item-section avatar><q-icon name="table_chart" /></q-item-section>
          <q-item-section>Grid</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const drawer = ref(true)
</script>
