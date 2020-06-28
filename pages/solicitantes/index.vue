<template lang="pug">
  div
    v-snackbar(v-model="snackbar" :color="color") {{ message }}
    v-dialog(
      v-model="dialog"
      @click:outside="resetDialog"
      width="500"
    )
      v-card
        v-card-title
        v-card-text Estas seguro que desea eliminar el solicitante {{item.applicant}}?
        v-card-actions
          v-spacer
          v-btn(text @click="resetDialog") Cancelar
          v-btn(text @click="destroy(item.id)") Eliminar
    v-card(raised)
      v-data-table.elevation-1(:headers='headers' :items='applicants' :search="search" sort-by='id')
        template( v-slot:top)
          v-toolbar(flat)
            v-toolbar-title Solicitantes
            v-divider(inset vertical).mx-4
            v-text-field(v-model="search" append-icon="mdi-table-search" label="Buscar" single-line hide-details)
            v-spacer
            v-btn(color="primary" small :to="{name: 'solicitantes-nuevo'}")
              v-icon mdi-plus-circle-outline
        template( v-slot:item.actions="{ item }")
          v-icon(small @click="$router.push({name: 'solicitantes-id', params: { id: item.id}})").mr-2 mdi-pencil
          v-icon(small @click="confirmation(item)").mr-2 mdi-delete
</template>
<script>
import api from '@/api'
export default {
  async asyncData({ params }) {
    const { data } = await api.get('solicitantes')
    return { applicants: data.applicants }
  },
  data: () => ({
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Solicitantes', value: 'applicant' },
      {
        text: 'Acciones',
        align: 'right',
        value: 'actions',
        sortable: false,
        filterable: false,
      },
    ],
    dialog: false,
    item: { solicitante: '' },
    message: '',
    snackbar: false,
    color: 'green',
    search: '',
  }),
  methods: {
    async get() {
      const { data } = await api.get(`solicitantes`)
      this.applicants = data.applicants
    },
    confirmation(item) {
      this.item = item
      this.dialog = true
    },
    resetDialog() {
      this.item = { solicitante: '' }
      this.dialog = false
    },
    async destroy(id) {
      await api.delete(`solicitantes/${id}`)
      this.get()
      this.resetDialog()
      this.snack('El solicitante ha sido eliminado.')
    },
    snack(message, color = 'green') {
      this.color = color
      this.message = message
      this.snackbar = true
    },
  },
}
</script>
