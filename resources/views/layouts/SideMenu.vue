<template>
  

<div id="app">
  <v-app id="inspire">
    <v-card
      class="mx-auto"
      height="300"
      width="300"
    >
      <v-navigation-drawer
        absolute
        dark
        src="https://cdn.vuetifyjs.com/images/backgrounds/bg-2.jpg"
        width="100%"
        permanent
      >
        <v-list>
          
          <v-list-item
            v-for="([icon, text,link], i) in items"
            
            :key="i"
            :to="link"
          >
            <v-list-item-icon>
              <v-icon>{{ icon }}</v-icon>
            </v-list-item-icon>
  
            <v-list-item-content>
              <v-list-item-title>{{ text }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </v-card>
  </v-app>
</div>
</template>
<script>
export default {
  data: () => ({
    items: [
      ['mdi-home-city', 'Inicio','/dashboard' ],
      ['mdi-account-group-outline', 'Clientes','/clients'],
      ['mdi-clock-start', 'Tarifas','/tariffs'],
      ['mdi-fireplace-off','Estacionamientos','/parking-lots'],
      ['mdi-database-clock','Transacciones','/transactions'],
    ],
  }),

}
</script>