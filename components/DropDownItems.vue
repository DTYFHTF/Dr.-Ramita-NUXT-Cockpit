<template>
  <div>
    <li  class="dropdown-divider"></li>
    <li>
      <NuxtLink to="/" class="dropdown-item d-flex align-items-center gap-2">
        <LucideIcon icon="mdi:home" /> Home
      </NuxtLink>
    </li>
    <li>
      <NuxtLink to="/settings" class="dropdown-item d-flex align-items-center gap-2">
        <LucideIcon icon="mdi:settings" /> Settings
      </NuxtLink>
    </li>
    <li>
      <a href="#" class="dropdown-item d-flex align-items-center gap-2">
        <LucideIcon icon="mdi:smartphone" /> Download App
      </a>
    </li>
  </div>
</template>
