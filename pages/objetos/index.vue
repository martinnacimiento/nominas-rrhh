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
        v-card-text Estas seguro que desea eliminar el objeto {{item.object}}?
        v-card-actions
          v-spacer
          v-btn(text @click="resetDialog") Cancelar
          v-btn(text @click="destroy(item.id)") Eliminar
    v-card(raised)
      v-data-table.elevation-1(:headers='headers' :items='objects' sort-by='id')
        template( v-slot:top)
          v-toolbar(flat)
            v-toolbar-title Sexos
            v-divider(inset vertical).mx-4
            v-spacer
            v-btn(color="primary" small :to="{name: 'objetos-nuevo'}")
              v-icon mdi-plus-circle-outline
        template( v-slot:item.actions="{ item }")
          v-icon(small @click="$router.push({name: 'objetos-id', params: { id: item.id}})").mr-2 mdi-pencil
          v-icon(small @click="confirmation(item)").mr-2 mdi-delete
</template>
<script>
import api from '@/api'
export default {
  async asyncData({ params }) {
    const { data } = await api.get('objetos')
    return { objects: data.objects }
  },
  data: () => ({
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Objeto', value: 'object' },
      { text: 'Acciones', align: 'right', value: 'actions' },
    ],
    dialog: false,
    item: { object: '' },
    message: '',
    snackbar: false,
    color: 'green',
  }),
  methods: {
    async get() {
      const { data } = await api.get(`objetos`)
      this.objects = data.objects
    },
    confirmation(item) {
      this.item = item
      this.dialog = true
    },
    resetDialog() {
      this.item = { sex: '' }
      this.dialog = false
    },
    async destroy(id) {
      await api.delete(`objetos/${id}`)
      this.get()
      this.resetDialog()
      this.snack('El objeto ha sido eliminado.')
    },
    snack(message, color = 'green') {
      this.color = color
      this.message = message
      this.snackbar = true
    },
  },
}
</script>
