import { createApp } from 'vue'
import './style.css'
import './assets/main.css'
import App from './App.vue'
import VueTippy from 'vue-tippy'
import 'tippy.js/dist/tippy.css' // Tippy.jsの基本スタイル

createApp(App)
  .use(VueTippy, {
    directive: 'tippy', // directive can be changed to 'tippy' for consistency
    component: 'tippy', // component can be changed to 'tippy' for consistency
    defaultProps: {
      placement: 'bottom',
      allowHTML: true,
    },
  })
  .mount('#app')