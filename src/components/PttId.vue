<template>
  <v-container>
    <v-row class="text-center">
      <!-- <v-col cols="12">
        <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        />
      </v-col> -->

      <v-col class="mb-4">
        <h1 class="display-2 font-weight-bold mb-3">歡迎來到 ptt ID</h1>

        <p class="subheading font-weight-regular">
          輸入 ptt 上的 id, 即列出其最近上站的 10 個 IP
          地址、時間、國家與是否為跳板。
        </p>
      </v-col>

      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-3">工商：ptt IP</h2>

        <v-row justify="center">
          <p class="subheading font-weight-regular">
            一款 userscript, 令您只要雙擊選取 ptt 上 IP 便可即時取得相關資訊。
          </p>
          <a
            href="https://gist.github.com/nevikw39/d7a08f637919348106f6a35d35a62d3f"
            lass="subheading mx-3"
            target="_blank"
            >前往了解</a
          >
        </v-row>
      </v-col>

      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-3">輸入</h2>

        <v-row justify="center">
          <v-col cols="12" sm="6" md="3">
            <input placeholder="ID" v-model.lazy="id" />
          </v-col>
        </v-row>
      </v-col>

      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-3">輸出</h2>

        <v-alert prominent type="error" v-if="error">{{ rrore }}</v-alert>

        <v-row justify="center">
          <v-data-table :headers="headers" :items="spur" class="elevation-8">
            <template slot="item.rank" scope="props">
              {{ props.index }}
            </template>
            <template v-slot:item.context="{ item }">
              <v-chip
                :color="color(item.context)"
                light
                v-html="context(item.context, item.ip)"
              >
              </v-chip>
            </template>
            <template v-slot:item.last_seen_at="{ item }">
              {{ date(item.last_seen_at) }}
            </template>
          </v-data-table>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "PttId",

  data: () => ({
    id: "",
    plytic: [],
    spur: [],
    headers: [
      { text: "#", value: "rank" },
      { text: "IP", value: "ip" },
      { text: "國家", value: "country" },
      { text: "時間", value: "last_seen_at" },
      { text: "Context", value: "context" },
    ],
    error: null,
  }),

  watch: {
    id: function (id) {
      const parser = new window.DOMParser();
      fetch(
        "https://thingproxy.freeboard.io/fetch/https://www.plytic.com/api/v1/authors/" +
          id.toLowerCase() +
          "/source_ips"
      )
        .then((r) => r.json())
        .then((j) => {
          this.plytic = j.recent_source_ips;
          this.plytic
            .forEach((element) => {
              element.context = "--";
              if (element.country != "TW")
                fetch(
                  "https://thingproxy.freeboard.io/fetch/https://spur.us/context/" +
                    element.ip
                )
                  .then((r) => r.text())
                  .then((t) => {
                    element.context = parser.parseFromString(
                      t,
                      "text/html"
                    ).title;
                    this.spur = this.plytic;
                  });
              element.country =
                String.fromCodePoint(
                  ...element.country
                    .toUpperCase()
                    .split("")
                    .map((char) => 127397 + char.charCodeAt())
                ) + element.country;
              element.last_seen_at = new Date(element.last_seen_at);
            })
            .catch((e) => (this.error = e));
        });
    },
  },

  computed: {
    //
  },

  methods: {
    color: function (x) {
      return x.includes("esidential") || x.includes("ikely")
        ? "danger"
        : x.includes("VPN") || x.includes("roxy")
        ? "error"
        : "info";
    },
    context: function (x, y) {
      if (/\(.*\)/.test(x))
        return (
          '<a target="_blank" href="https://spur.us/context/' +
          y +
          '">' +
          x.match(/\(.*\)/)[0].slice(2, -2) +
          "</a>"
        );
      else return "--";
    },
    date: function (x) {
      return new Intl.DateTimeFormat("zh-TW", {
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour12: false,
        timeZone: "Asia/Taipei",
      }).format(x);
    },
  },
};
</script>
