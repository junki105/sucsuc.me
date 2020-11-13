<template>
  <div class="w-full">
    <a
      href="/admin/"
      target="_blank"
      class="block w-full border-b text-xl font-semibold text-gray-800 p-4 hover:opacity-75"
    >
      <span
        class="inline-flex items-center justify-center bg-gray-100 text-gray-800 border border-gray-500 rounded-full w-12 h-12 mr-2"
      >
        <font-awesome-icon :icon="[`fas`, 'laptop-code']" />
      </span>
      CMSを開く
      <sup class="text-xs">
        <font-awesome-icon :icon="[`fas`, `external-link-alt`]" />
      </sup>
    </a>
  </div>
</template>
