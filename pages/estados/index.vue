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
        v-card-text Estas seguro que desea eliminar el estado {{item.state}}?
        v-card-actions
          v-spacer
          v-btn(text @click="resetDialog") Cancelar
          v-btn(text @click="destroy(item.id)") Eliminar
    v-card(class="rounded-lg" :elevation="12")
      v-data-table(
        :headers='headers'
        :items='states'
        :search="search"
        :loading="$fetchState.pending"
        sort-by='id'
      )
        template( v-slot:top)
          v-toolbar(flat)
            v-toolbar-title Estados
            v-divider(inset vertical).mx-4
            v-text-field(v-model="search" append-icon="mdi-table-search" label="Buscar" single-line hide-details)
            v-spacer
            v-btn(v-if="can('create.state')" color="primary" small :to="{name: 'estados-nuevo'}")
              v-icon mdi-plus-circle-outline
        template(v-if="can('edit.state') || can('destroy.state')" v-slot:item.actions="{ item }")
          v-icon(v-if="can('edit.state')" small @click="$router.push({name: 'estados-id', params: { id: item.id}})").mr-2 mdi-pencil
          v-icon(v-if="can('destroy.state')" small @click="confirmation(item)").mr-2 mdi-delete
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  async fetch() {
    const { states } = await this.$axios.$get('estados')
    this.states = states
  },
  data: () => ({
    states: [],
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
  computed: {
    ...mapGetters(['can']),
  },
  methods: {
    async get() {
      const { states } = await this.$axios.$get(`estados`)
      this.states = states
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
      await this.$axios.$delete(`estados/${id}`)
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
