import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
    theme: {
        dark: true,
        default: 'dark',
        themes: {
            dark: {
                primary: colors.teal,
                secondary: colors.cyan,
                accent: colors.amber,
                error: '#E9693D',
                info: '#8DD4E8',
                success: '#198964',
                warning: '#F0E87D',
            },
        },
    },
});