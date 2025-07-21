<script setup lang="ts">
import { computed, defineProps } from 'vue'
import Widget from '../widget-comps/Widget.vue';
import { type WidgetItem } from '../widget-comps/widgetRegistry';
import { QAvatar } from 'quasar';

const props = defineProps<{
  widget: WidgetItem,
  size?: 'sm' | 'md' | 'lg' | 'custom'
}>()

const birthdays = [
  { name: 'Ali Y.', date: '20 Temmuz' },
  { name: 'Fatma T.', date: '23 Temmuz' },
  { name: 'Zeynep K.', date: '27 Temmuz' },
  { name: 'Mert A.', date: '30 Temmuz' },
  { name: 'Selin K.', date: '2 Ağustos' },
  { name: 'Ahmet D.', date: '5 Ağustos' },
  { name: 'Deniz B.', date: '8 Ağustos' },
  { name: 'Yasemin E.', date: '11 Ağustos' },
  { name: 'Umut G.', date: '13 Ağustos' },
  { name: 'Emine H.', date: '15 Ağustos' },
  { name: 'Can K.', date: '17 Ağustos' },
  { name: 'Serkan Z.', date: '19 Ağustos' },
  { name: 'Derya M.', date: '21 Ağustos' },
  { name: 'Mehmet R.', date: '23 Ağustos' },
  { name: 'Tuğba C.', date: '25 Ağustos' },
  { name: 'Seda T.', date: '27 Ağustos' },
  { name: 'Kerem L.', date: '29 Ağustos' },
  { name: 'Aylin S.', date: '31 Ağustos' },
  { name: 'Barış F.', date: '2 Eylül' },
  { name: 'Gülşah V.', date: '4 Eylül' },
  { name: 'Ege B.', date: '6 Eylül' },
  { name: 'Melis N.', date: '8 Eylül' },
  { name: 'Onur K.', date: '10 Eylül' },
  { name: 'Cem T.', date: '12 Eylül' },
  { name: 'Betül A.', date: '14 Eylül' },
  { name: 'Nihat Y.', date: '16 Eylül' },
  { name: 'Elif P.', date: '18 Eylül' },
  { name: 'Bora M.', date: '20 Eylül' },
  { name: 'Şeyma İ.', date: '22 Eylül' },
  { name: 'Hakan J.', date: '24 Eylül' }
]

const sizeLevel = computed(() => {
  const w = props.widget.w
  const h = props.widget.h

  if (w >= 6 && h >= 4) return 'lg'
  if (w >= 4 && h >= 3) return 'md'
  return 'sm'
})

const visibleBirthdays = computed(() => {
  if (sizeLevel.value === 'lg') return birthdays
  if (sizeLevel.value === 'md') return birthdays.slice(0, 7)
  return birthdays.slice(0, 4)
})
</script>

<template>
  <Widget :title="widget.name">
    <div class="row q-col-gutter-md">
      <div :class="sizeLevel === 'sm' ? 'col-12' : 'col-6'">
        <ul>
          <li
            v-for="(b, i) in visibleBirthdays"
            :key="i"
            class="text-body2 q-mb-xs"
          >
            {{ b.name }} – {{ b.date }}
          </li>
        </ul>
        <div
          v-if="sizeLevel !== 'sm' && birthdays.length > visibleBirthdays.length"
          class="text-caption q-mt-sm text-grey"
        >
          +{{ birthdays.length - visibleBirthdays.length }} kişi daha
        </div>
        <div
          v-else-if="sizeLevel === 'sm'"
          class="text-caption q-mt-sm text-grey"
        >
          +{{ birthdays.length - 1 }} kişi daha
        </div>
        <div
          v-if="sizeLevel !== 'sm'"
          class="text-caption q-mt-xs text-positive"
        >
          🎉 Kutlama zamanı yaklaşıyor!
        </div>
      </div>
      <div class="col-6" v-if="sizeLevel !== 'sm'">
        <div class="row q-col-gutter-sm q-gutter-y-sm">
          <div
            v-for="(b, i) in (sizeLevel === 'md' ? birthdays.slice(0, 4) : birthdays.slice(0, 14))"
            :key="'mini-' + i"
            class="col-6"
          >
            <div class="birthday-card q-pa-sm bg-grey-1 rounded text-center">
              <q-avatar size="40px" icon="cake" color="pink-4" text-color="white" class="q-mb-xs" />
              <div class="text-bold text-body2">{{ b.name }}</div>
              <div class="text-caption text-grey">{{ b.date }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Widget>
</template>


<style scoped>
.birthday-card {
  box-shadow: 0 2px 5px rgba(0,0,0,0.06);
}
</style>
