<script setup>
defineProps({
  name: { type: String, required: true },
})
</script>

<template>
  <svg
    class="icon"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.8"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path v-if="name === 'arrow'" d="M4 12h15m-6-6 6 6-6 6" />
    <path v-else-if="name === 'check'" d="m5 12 4 4L19 6" />
    <path v-else-if="name === 'cross'" d="m6 6 12 12M18 6 6 18" />
    <path v-else-if="name === 'chevron'" d="m6 9 6 6 6-6" />
    <g v-else-if="name === 'info'">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5m0-8h.01" />
    </g>
  </svg>
</template>
