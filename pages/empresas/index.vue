<template lang="pug">
  div
    v-snackbar(v-model="snackbar" :color="color") {{ message }}
    v-dialog(
      v-model="dialog"
      @click:outside="resetDialog"
      width="500"
    )
      v-card(class="rounded-lg")
        v-card-title
        v-card-text Estas seguro que desea eliminar la empresa {{item.denominacion_social}}?
        v-card-actions
          v-spacer
          v-btn(text @click="resetDialog") Cancelar
          v-btn(text @click="destroy(item.id)") Eliminar
    v-card(class="rounded-lg" :elevation="12")
      v-data-table(
        :headers='headers'
        :items='companies'
        :search="search"
        :loading="$fetchState.pending"
        sort-by='id'
      )
        template( v-slot:top)
          v-toolbar(flat)
            v-toolbar-title Empresas
            v-divider(inset vertical).mx-4
            v-text-field(v-model="search" append-icon="mdi-table-search" label="Buscar" single-line hide-details)
            v-spacer
            v-btn(v-if="can('*')" color="primary" small :to="{name: 'empresas-nuevo'}")
              v-icon mdi-plus-circle-outline
        template(v-if="can('*') || can('*')" v-slot:item.actions="{ item }")
          v-icon(v-if="can('*')" small @click="$router.push({name: 'empresas-id', params: { id: item.id}})").mr-2 mdi-pencil
          v-icon(v-if="can('*')" small @click="confirmation(item)").mr-2 mdi-delete
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  async fetch() {
    const { data } = await this.$axios.$get('empresas')
    this.companies = data
  },
  data: () => ({
    companies: [],
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Denominación social', value: 'denominacion_social' },
      { text: 'Clasificacion', value: 'clasificacion' },
      { text: 'Domicilio', value: 'domicilio' },
      { text: 'Telefono', value: 'telefono' },
      {
        text: 'Acciones',
        align: 'right',
        value: 'actions',
        sortable: false,
        filterable: false,
      },
    ],
    dialog: false,
    item: { object: '' },
    message: '',
    snackbar: false,
    color: 'green',
    search: '',
  }),
  computed: {
    ...mapGetters(['can']),
  },
  methods: {
    async get() {
      const { data } = await this.$axios.$get(`empresas`)
      this.companies = data
    },
    confirmation(item) {
      this.item = item
      this.dialog = true
    },
    resetDialog() {
      this.item = { state: '' }
      this.dialog = false
    },
    async destroy(id) {
      await this.$axios.$delete(`empresas/${id}`)
      this.get()
      this.resetDialog()
      this.snack('La empresa ha sido eliminado.')
    },
    snack(message, color = 'green') {
      this.color = color
      this.message = message
      this.snackbar = true
    },
  },
}
</script>
