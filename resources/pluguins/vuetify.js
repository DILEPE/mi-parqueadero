import Vuetify from 'vuetify'
import '@mdi/font/css/materialdesignicons.css' 
import 'vuetify/dist/vuetify.min.css'
import Vue from 'vue'

Vue.use(Vuetify)

const opts = {}

//export default new Vuetify(opts)
export default new Vuetify({
  
    icons: {
      iconfont: ['mdi'] //|| 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
    },
  })