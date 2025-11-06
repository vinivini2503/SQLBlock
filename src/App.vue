<template>
  <main>
    <router-view />
  </main>
</template>

<script setup>
// Router view irá renderizar o componente da rota atual
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  overflow: hidden;
}

#app {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

main {
  width: 100%;
  height: 100%;
}
</style>
