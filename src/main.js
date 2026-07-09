import { registerSW } from 'virtual:pwa-register';

import { createApp } from 'vue';
import { createPinia } from 'pinia';

import "@fontsource/unbounded";
import "@fontsource/urbanist";
import "@fontsource/imbue";

import App from './App.vue';
import router from './router';

import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// IMPORTAÇÕES DO FONTAWESOME
import {
  faUserPen,
  faTrashCan,
  faHouse,             // Para Página Inicial
  faCalendarDays,      // Para Calendário
  faUtensils,          // Para Cardápio
  faBoxesStacked,      // Para Estoque
  faUsers,             // Para Funcionários
  faFileInvoiceDollar  // Para Orçamento
} from '@fortawesome/free-solid-svg-icons';

import { faGithub, faWhatsapp } from '@fortawesome/free-brands-svg-icons';

// Font Awesome - Adicionando todos à biblioteca
library.add(
  faUserPen,
  faTrashCan,
  faGithub,
  faWhatsapp,
  faHouse,
  faCalendarDays,
  faUtensils,
  faBoxesStacked,
  faUsers,
  faFileInvoiceDollar
);

// PWA
registerSW({
  immediate: true,
  onRegisteredSW(swUrl, registration) {
    if (registration) {
      setInterval(() => {
        registration.update();
      }, 60 * 1000);
    }
  },
});

// Vue App
const app = createApp(App);

app.use(createPinia());
app.use(router);

app.component('font-awesome-icon', FontAwesomeIcon);

app.mount('#app');
