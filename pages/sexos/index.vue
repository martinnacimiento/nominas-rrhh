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
        v-card-text Estas seguro que desea eliminar el sexo {{item.sex}}?
        v-card-actions
          v-spacer
          v-btn(text @click="resetDialog") Cancelar
          v-btn(text @click="destroy(item.id)") Eliminar
    v-card(class="rounded-lg" :elevation="12")
      v-data-table(
        :headers='headers'
        :items='sexes'
        :search="search"
        :loading="$fetchState.pending"
        sort-by='id'
      )
        template( v-slot:top)
          v-toolbar(flat)
            v-toolbar-title Sexos
            v-divider(inset vertical).mx-4
            v-text-field(v-model="search" append-icon="mdi-table-search" label="Buscar" single-line hide-details)
            v-spacer
            v-btn(v-if="can('create.sex')" color="primary" small :to="{name: 'sexos-nuevo'}")
              v-icon mdi-plus-circle-outline
        template(v-if="can('edit.sex') || can('destroy.sex')" v-slot:item.actions="{ item }")
          v-icon(v-if="can('edit.sex')" small @click="$router.push({name: 'sexos-id', params: { id: item.id}})").mr-2 mdi-pencil
          v-icon(v-if="can('destroy.sex')" small @click="confirmation(item)").mr-2 mdi-delete
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  async fetch() {
    const { sexes } = await this.$axios.$get('sexos')
    this.sexes = sexes
  },
  data: () => ({
    sexes: [],
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Sexo', value: 'sex' },
      {
        text: 'Acciones',
        align: 'right',
        value: 'actions',
        sortable: false,
        filterable: false,
      },
    ],
    dialog: false,
    item: { sex: '' },
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
      const { sexes } = await this.$axios.$get(`sexos`)
      this.sexes = sexes
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
      await this.$axios.$delete(`sexos/${id}`)
      this.get()
      this.resetDialog()
      this.snack('El sexo ha sido eliminado.')
    },
    snack(message, color = 'green') {
      this.color = color
      this.message = message
      this.snackbar = true
    },
  },
}
</script>
