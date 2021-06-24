<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>ptt ID</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <PttId />
    </v-main>

    <v-footer color="primary lighten-1" padless>
      <v-row justify="center" no-gutters>
        <v-col class="primary lighten-2 py-4 text-center white--text" cols="12">
          {{ new Date().getFullYear() }} — <strong>nevikw39</strong>
        </v-col>
      </v-row>
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
