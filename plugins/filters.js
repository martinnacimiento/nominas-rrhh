import Vue from 'vue'
import moment from 'moment'

moment.locale('es')
const dateL = (value) => {
  return moment(value).format('L')
}

Vue.filter('dateL', dateL)
