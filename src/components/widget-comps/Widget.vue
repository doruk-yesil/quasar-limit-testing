<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'
import { QBtn, QIcon } from 'quasar'

const props = defineProps<{
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'custom'
  showLockIcon?: boolean
}>()

const emit = defineEmits<{
  (e: 'settings'): void
  (e: 'toggleLock'): void
}>()
</script>

<template>
  <div class="widget-wrapper q-pa-md fit bg-white overflow-hidden rounded shadow-sm">
    <div class="widget-header flex justify-between items-center q-pb-sm">
      <div v-if="props.title" class="widget-title text-h6">{{ props.title }}</div>
    </div>
    <div class="settings-icon">
    <q-icon
      v-if="props.showLockIcon"
      name="lock"
      color="grey-7"
      size="18px"
      class="q-mr-xs"
      @click="emit('toggleLock')"
    />
    <q-btn
        dense
        flat
        round
        icon="more_vert"
        @click="emit('settings')"
      />
    </div>
    <div class="widget-content">
      <div class="content-inner">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.widget-wrapper {
  position: relative;
}
.widget-header {
  position: sticky;
  top: 0;
  background: white;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.widget-content {
  height: calc(100% - 48px);
  overflow-y: auto;
  overflow-x: hidden;
}
.settings-icon {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 999;
  margin: 5px 3px;
}
.content-inner {
  box-sizing: border-box;
}
</style>