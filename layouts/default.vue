<template lang="pug">
  v-app(dark)
    CoModalLogin(v-model="modal")
    v-navigation-drawer(v-if="isAuth" v-model='drawer' :mini-variant='miniVariant' :clipped='clipped' fixed app)
      v-list
        v-list-item(v-for='(item, i) in items' :key='i' :to='item.to' router exact)
          v-list-item-action
            v-icon {{ item.icon }}
          v-list-item-content
            v-list-item-title(v-text='item.title')
              
              
    v-app-bar(app color="transparent" flat absolute)
      v-btn(fab small @click.stop='drawer = !drawer').mr-2
        v-icon mdi-dots-vertical

      v-toolbar-title(v-text='title')
      v-spacer
      v-fade-transition
        v-tooltip(v-if="!isAuth" bottom)
          template(#activator="{on}")
            v-btn(fab small @click="modal = !modal" v-on="on").mr-2
              v-icon mdi-login
          span Iniciar sesión
      v-fade-transition
        CoMenuUser(v-if="isAuth")
      v-tooltip(bottom)
        template(#activator="{on}")
          v-btn(fab small @click='modeDark = !modeDark' v-on="on").mr-2
            v-icon mdi-theme-light-dark
        span Modo noche

    v-main
      v-container(fluid)
        nuxt
          
    v-footer(:fixed='fixed' app)
      span Nacimiento Martin © {{ new Date().getFullYear() }}
</template>

<script>
import { mapGetters } from 'vuex'
import CoModalLogin from '@/components/CoModalLogin'
import CoMenuUser from '@/components/CoMenuUser'
export default {
  components: { CoModalLogin, CoMenuUser },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      modeDark: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Bienvenido',
          to: '/',
        },
        {
          icon: 'mdi-file-document',
          title: 'Contratos',
          to: '/contratos',
        },
        {
          icon: 'mdi-account-tie-outline',
          title: 'Personas',
          to: '/personas',
        },
        {
          icon: 'mdi-gender-non-binary',
          title: 'Sexos',
          to: '/sexos',
        },
        {
          icon: 'mdi-state-machine',
          title: 'Estados',
          to: '/estados',
        },
        {
          icon: 'mdi-account-arrow-left',
          title: 'Solicitantes',
          to: '/solicitantes',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Objetos',
          to: '/objetos',
        },
        {
          icon: 'mdi-account',
          title: 'Usuarios',
          to: '/usuarios',
        },
        {
          icon: 'mdi-account-supervisor',
          title: 'Roles',
          to: '/roles',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Contratos',
      modal: false,
    }
  },
  computed: {
    ...mapGetters(['can', 'isAuth']),
  },
  watch: {
    modeDark(value) {
      this.$vuetify.theme.dark = value
    },
  },
}
</script>
