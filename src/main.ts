import { createApp } from 'vue'
import App from './App.vue'
import { Quasar, ClosePopup } from 'quasar'
import quasarLang from 'quasar/lang/en-US'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/dist/quasar.css'

const app = createApp(App)

app.use(Quasar, {
  plugins: {},
  directives: {
    ClosePopup
  },
  lang: quasarLang
})

app.mount('#app')
