<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Be-Katalog</v-toolbar-title>
      <v-spacer />
      <v-btn text to="/">Home</v-btn>
      <v-btn text to="/sellers">Sellers</v-btn>
    </v-app-bar>

    <v-main>
      <v-container class="pa-4">
        <slot />
      </v-container>
    </v-main>

    <v-footer app padless>
      <v-sheet class="pa-3" elevation="0" width="100%">
        <div class="text-center">© 2025 Be-Katalog</div>
      </v-sheet>
    </v-footer>
  </v-app>
</template>

<script setup>
// layout uses Vuetify components provided by module
</script>
