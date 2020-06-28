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
        v-card-text Estas seguro que desea eliminar el estado {{item.state}}?
        v-card-actions
          v-spacer
          v-btn(text @click="resetDialog") Cancelar
          v-btn(text @click="destroy(item.id)") Eliminar
    v-card(raised)
      v-data-table.elevation-1(:headers='headers' :items='states' :search="search" sort-by='id')
        template( v-slot:top)
          v-toolbar(flat)
            v-toolbar-title Estados
            v-divider(inset vertical).mx-4
            v-text-field(v-model="search" append-icon="mdi-table-search" label="Buscar" single-line hide-details)
            v-spacer
            v-btn(color="primary" small :to="{name: 'estados-nuevo'}")
              v-icon mdi-plus-circle-outline
        template( v-slot:item.actions="{ item }")
          v-icon(small @click="$router.push({name: 'estados-id', params: { id: item.id}})").mr-2 mdi-pencil
          v-icon(small @click="confirmation(item)").mr-2 mdi-delete
</template>
<script>
import api from '@/api'
export default {
  async asyncData({ params }) {
    const { data } = await api.get('estados')
    return { states: data.states }
  },
  data: () => ({
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Estado', value: 'state' },
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
  methods: {
    async get() {
      const { data } = await api.get(`estados`)
      this.states = data.states
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
      await api.delete(`estados/${id}`)
      this.get()
      this.resetDialog()
      this.snack('El estado ha sido eliminado.')
    },
    snack(message, color = 'green') {
      this.color = color
      this.message = message
      this.snackbar = true
    },
  },
}
</script>
