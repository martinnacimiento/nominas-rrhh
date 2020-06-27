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
    v-main
      v-container(fluid)
        nuxt
          
    v-footer(:fixed='fixed' app)
      span Nacimiento Martin © {{ new Date().getFullYear() }}
</template>

<script>
export default {
  created() {
    this.$vuetify.theme.dark = true
  },
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-apps',
          title: 'Bienvenido',
          to: '/',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Contratos',
          to: '/contratos',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Personas',
          to: '/personas',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Sexos',
          to: '/sexos',
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Estados',
          to: '/estados',
        },
        {
          icon: 'mdi-chart-bubble',
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
}
</script>
