import _ from "lodash";

export default betterDefineNuxtConfig(
    {
        app: {
            head: {
                title: "Charades",
            },
        },
        devtools: { enabled: true },
        modules: [
            "@nuxt/ui",
            "@nuxt/devtools",
            "@nuxtjs/tailwindcss",
            "@vueuse/nuxt",
            "nuxt-typed-router",
            "@vue-macros/nuxt",
            "@pinia/nuxt",
            "nuxt-lodash",

            // "@nuxtjs/i18n",
        ],
        tailwindcss: {
            viewer: false,
        },
        typescript: {
            strict: true,
            shim: false,
            typeCheck: true,
        },
        nitro: {
            static: true,
        },
        devServer: {
            https: {
                key: "./localhost-key.pem",
                cert: "./localhost.pem",
            },
        },

        // i18n: {
        //     locales: [
        //         { code: "en", iso: "en-US", name: "English", icon: "i-twemoji-flag-united-states" },
        //         { code: "es", iso: "es-ES", name: "Español", icon: "i-twemoji-flag-peru" },
        //     ],
        //     defaultLocale: "en",
        // },
    },
);

/**
 * Define Nuxt config from multiple configs
 *
 * @see https://lodash.com/docs/#mergeWith
 */
function betterDefineNuxtConfig(...configs: Parameters<typeof defineNuxtConfig>[0][]) {
    return _.mergeWith({}, ...configs, (obj: unknown, src: unknown) => _.isArray(obj) ? obj.concat(src) : undefined);
}
