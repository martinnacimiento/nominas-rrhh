<template lang="pug">
  v-app(dark)
    CoModalLogin(v-model="modal")
    v-navigation-drawer(v-if="isAuth" v-model='drawer' :mini-variant='miniVariant' :clipped='clipped' fixed app)
      v-list
        template(v-for='(item, i) in items' v-if="can(item.scope)")
          v-list-item(:key='i' :to='item.to' router exact)
            v-list-item-action
              v-icon {{ item.icon }}
            v-list-item-content
              v-list-item-title(v-text='item.title')
              
              
    v-app-bar(app color="transparent" flat absolute)
      v-slide-x-transition
        v-btn(v-if="isAuth" fab small @click.stop='drawer = !drawer').mr-2
          v-icon mdi-dots-vertical

      v-toolbar-title(v-text='title')
      v-spacer
      v-slide-x-transition
        v-tooltip(v-if="!isAuth" bottom)
          template(#activator="{on}")
            v-btn(fab small @click="modal = !modal" v-on="on").mr-2
              v-icon mdi-login
          span Iniciar sesión
      v-slide-x-transition
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
      span Nóminas © {{ new Date().getFullYear() }}
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
          scope: '*',
        },
        {
          icon: 'mdi-file-document',
          title: 'Contratos',
          to: '/contratos',
          scope: 'index.contract',
        },
        {
          icon: 'mdi-account-tie-outline',
          title: 'Personas',
          to: '/personas',
          scope: 'index.person',
        },
        {
          icon: 'mdi-gender-non-binary',
          title: 'Sexos',
          to: '/sexos',
          scope: 'index.sex',
        },
        {
          icon: 'mdi-state-machine',
          title: 'Estados',
          to: '/estados',
          scope: 'index.state',
        },
        {
          icon: 'mdi-account-arrow-left',
          title: 'Solicitantes',
          to: '/solicitantes',
          scope: 'index.applicant',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Empresas',
          to: '/empresas',
          scope: '*',
        },
        {
          icon: 'mdi-account',
          title: 'Usuarios',
          to: '/usuarios',
          scope: 'index.user',
        },
        {
          icon: 'mdi-account-supervisor',
          title: 'Roles',
          to: '/roles',
          scope: 'index.role',
        },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Nóminas',
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
