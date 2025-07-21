import { createApp } from 'vue'
import router from './router'
import App from './App.vue'
import { Quasar, Notify, ClosePopup } from 'quasar'
import quasarLang from 'quasar/lang/en-US'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/dist/quasar.css'

const app = createApp(App)

app.use(Quasar, {
  plugins: {
    Notify
  },
  directives: {
    ClosePopup
  },
  lang: quasarLang
})
app.use(router)
app.mount('#app')
