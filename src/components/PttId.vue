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
          地址、日期、國家與是否為跳板。
        </p>
      </v-col>

      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-3">工商：ptt IP</h2>

        <v-row justify="center">
          <p class="subheading font-weight-regular">
            一款 userscript, 令您只要雙擊選取 ptt 上 IP 便可即時取得相關資訊。
          </p>
        </v-row>
        <v-row justify="center">
          <v-btn
            href="https://gist.github.com/nevikw39/d7a08f637919348106f6a35d35a62d3f"
            lass="subheading mx-3"
            target="_blank"
            color="success"
          >
            前往了解
          </v-btn>
        </v-row>
      </v-col>

      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-3">輸入</h2>

        <v-row justify="center">
          <v-col cols="12" sm="6" md="3">
            <v-text-field
              label="ID"
              hint="輸入完畢請按 Enter 或點擊外部"
              :value="id"
              @change="(x) => (id = x)"
              @focus="() => (loading = true)"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-col>

      <v-col class="mb-5" cols="12">
        <h2 class="headline font-weight-bold mb-3">輸出</h2>

        <v-alert type="warning" v-if="!Intl.DisplayNames" class="grey--text">
          您的瀏覽器並不支援 <code>Intl.DisplayNames</code>,
          因此恕無法將國家代碼轉換為名稱。建議您可以更新至最新版本，以獲得更佳體驗。
        </v-alert>
        <v-alert prominent type="error" v-if="error">{{ error }}</v-alert>

        <v-row justify="center">
          <v-data-table
            :loading="loading"
            :headers="headers"
            :caption="caption"
            :items="items"
            sort-by="ord"
            class="elevation-8 my-3"
            mobile-breakpoint="0"
            id="capture"
          >
            <template v-slot:item.ctx="{ item }">
              <v-btn
                rounded
                outlined
                target="_blank"
                :color="color(item.ctx)"
                :href="
                  item.ctx != '--'
                    ? 'https://spur.us/context/' + item.ip
                    : undefined
                "
              >
                {{ item.ctx }}
              </v-btn>
            </template>
            <template v-slot:item.date="{ item }">
              {{ date(item.date) }}
            </template>
          </v-data-table>
        </v-row>

        <v-row justify="center" v-if="id && !error">
          <v-btn
            :href="'https://www.pttbrain.com/ptt/user/' + id"
            class="mx-1"
            target="_blank"
            color="info"
          >
            PTT Brain
          </v-btn>
          <v-btn
            :href="'https://www.plytic.com/authors/' + id"
            class="mx-1"
            target="_blank"
            color="success"
          >
            Plytic
          </v-btn>
          <v-btn
            class="mx-1 gray--text"
            target="_blank"
            color="warning"
            @click="capture"
            outlined
          >
            Capture
          </v-btn>
          <v-dialog v-model="dialog" max-width="540">
            <v-card>
              <img :src="src" width="100%" />
              <v-card-actions class="justify-center">
                <v-btn color="error" @click="() => (dialog = false)">
                  Close
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import html2canvas from "html2canvas";

export default {
  name: "PttId",

  data: () => ({
    id: "",
    items: [],
    headers: [
      { text: "#", value: "ord" },
      { text: "IP", value: "ip" },
      { text: "國家", value: "country" },
      { text: "日期", value: "date" },
      { text: "Context", value: "ctx" },
    ],
    error: null,
    loading: true,
    dialog: false,
    src: null,
  }),

  watch: {
    id: function (id) {
      this.items = [];
      if (!id) {
        this.error = null;
        return;
      }
      document.activeElement.blur();
      const parser = new window.DOMParser();
      fetch("plytic/" + id.toLowerCase() + "/source_ips")
        .then((r) => r.json())
        .then((j) => {
          this.error = null;
          if (!j || !j.recent_source_ips) throw new Error("找不到使用者！！");
          let queue = [];
          j.recent_source_ips.forEach((element, index) => {
            if (element.country != "TW")
              queue.push(
                fetch("spur/" + element.ip)
                  .then((r) => r.text())
                  .then((t) =>
                    this.push(
                      element,
                      index,
                      this.context(parser.parseFromString(t, "text/html").title)
                    )
                  )
              );
            else this.push(element, index, "--");
          });
          Promise.all(queue).then(() => (this.loading = false));
        })
        .catch((e) => {
          this.items = [];
          this.error = e;
          this.loading = false;
        });
    },
  },

  computed: {
    caption: function () {
      return this.id && !this.error
        ? `${this.id} 在 ptt 上的 IP 資訊 @ «ptt.nevikw39.cf»`
        : null;
    },
  },

  methods: {
    color: function (x) {
      return x.includes("Resident") || x.includes("Likely") || x.includes("Tor")
        ? "warning"
        : x.includes("VPN") || x.includes("Proxy")
        ? "error"
        : "info";
    },
    context: function (x) {
      if (/\(.*\)/.test(x)) return x.match(/\(.*\)/)[0].slice(2, -2);
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
    push: function (element, index, ctx) {
      this.items.push({
        ord: index,
        ip: element.ip,
        date: new Date(element.last_seen_at),
        country:
          String.fromCodePoint(
            ...element.country
              .toUpperCase()
              .split("")
              .map((char) => 127397 + char.charCodeAt())
          ) +
          (Intl.DisplayNames
            ? new Intl.DisplayNames(["zh-TW"], { type: "region" }).of(
                element.country
              )
            : element.country),
        ctx: ctx,
      });
    },
    capture: function () {
      let that = this;
      html2canvas(document.getElementById("capture"), {
        backgroundColor: null,
        scrollX: -window.screenX,
        scrollY: -window.scrollY,
      }).then(function (canvas) {
        that.src = canvas.toDataURL();
        that.dialog = true;
      });
    },
  },
};
</script>
