<template>

<v-app>
  <v-navigation-drawer app>
    <!-- -->
    <side-menu></side-menu>
  </v-navigation-drawer>

  <v-app-bar app>
    <!-- -->
  </v-app-bar>

  <!-- Sizes your content based upon application components -->
  <v-main>

    <!-- Provides the application the proper gutter -->
    <v-container fluid>

      <!-- If using vue-router -->
      <router-view></router-view>
    </v-container>
  </v-main>

  <v-footer app>
    <!-- -->
  </v-footer>
</v-app>
</template>
<script>
import SideMenu from './layouts/SideMenu.vue';

export default {
  components: { SideMenu },};

</script>