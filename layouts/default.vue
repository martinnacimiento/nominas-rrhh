<template lang="pug">
  v-app(dark)
    v-navigation-drawer(v-model='drawer' :mini-variant='miniVariant' :clipped='clipped' fixed app)
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
      v-btn(fab small @click='modeDark = !modeDark').mr-2
        v-icon mdi-theme-light-dark

    v-main
      v-container(fluid)
        nuxt
          
    v-footer(:fixed='fixed' app)
      span Nacimiento Martin © {{ new Date().getFullYear() }}
</template>

<script>
export default {
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
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: 'Contratos',
    }
  },
  watch: {
    modeDark(value) {
      this.$vuetify.theme.dark = value
    },
  },
}
</script>
