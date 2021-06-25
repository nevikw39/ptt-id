<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>ptt ID</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <PttId />
    </v-main>

    <v-footer color="primary lighten-1">
      <v-card
        flat
        tile
        width="100%"
        class="primary lighten-2 py-1 text-center white--text"
      >
        <v-card-text>
          <v-btn href="" class="mx-4" icon>
            <v-icon size="32px"> mdi-github </v-icon>
          </v-btn>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-title class="white--text justify-center">
          {{ new Date().getFullYear() }} — <strong>nevikw39</strong>
        </v-card-title>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import PttId from "./components/PttId";

export default {
  name: "App",

  components: {
    PttId,
  },

  data: () => ({
    //
  }),
};
</script>
