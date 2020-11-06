<template>
  <span class="logo">
    <slot />
  </span>
</template>

<style scoped>
@font-face {
  font-family: 'ConcertOne';
  src: url('../assets/ttf/ConcertOne-Regular.ttf');
}

.logo {
  font-family: ConcertOne;
  @apply flex items-center;
}
</style>
