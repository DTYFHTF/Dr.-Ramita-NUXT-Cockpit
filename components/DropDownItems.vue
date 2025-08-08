<template>
  <template v-for="(item, idx) in items" :key="idx">
    <li v-if="item.type === 'divider'" class="dropdown-divider"></li>
    <li v-else-if="item.type === 'link'">
      <SmoothLink 
        v-if="item.routeName || item.name"
        :to="item.routeName || item.name" 
        :fallbackRoute="item.fallbackRoute || item.to"
        class="dropdown-item d-flex align-items-center gap-2"
      >
        <LucideIcon v-if="item.icon" :icon="item.icon" />
        {{ item.label }}
      </SmoothLink>
      <NuxtLink 
        v-else
        :to="item.to" 
        class="dropdown-item d-flex align-items-center gap-2"
      >
        <LucideIcon v-if="item.icon" :icon="item.icon" />
        {{ item.label }}
      </NuxtLink>
    </li>
    <li v-else-if="item.type === 'action'">
      <a :href="item.href || '#'" class="dropdown-item d-flex align-items-center gap-2" @click.prevent="item.onClick && item.onClick()">
        <LucideIcon v-if="item.icon" :icon="item.icon" />
        {{ item.label }}
      </a>
    </li>
    <li v-else-if="item.type === 'custom'">
      <slot :name="item.slot" :item="item" />
    </li>
  </template>
</template>

<script setup>
import { defineProps } from 'vue';
import { NuxtLink } from '#components';
import SmoothLink from '@/components/SmoothLink.vue';
import LucideIcon from '@/components/LucideIcon.vue';

defineProps({
  items: {
    type: Array,
    required: false,
    default: () => []
    // Each item: { 
    //   type: 'link'|'action'|'divider'|'custom', 
    //   label, 
    //   to, // Direct path/route
    //   routeName, // Named route for SmoothLink
    //   name, // Alias for routeName  
    //   fallbackRoute, // Fallback for SmoothLink
    //   icon, 
    //   href, 
    //   onClick, 
    //   slot 
    // }
  }
});
</script>