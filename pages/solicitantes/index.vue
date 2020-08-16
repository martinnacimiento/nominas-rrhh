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
        v-card-text Estas seguro que desea eliminar el solicitante {{item.applicant}}?
        v-card-actions
          v-spacer
          v-btn(text @click="resetDialog") Cancelar
          v-btn(text @click="destroy(item.id)") Eliminar
    v-card(class="rounded-lg" :elevation="12")
      v-data-table(
        :headers='headers'
        :items='applicants'
        :search="search"
        :loading="$fetchState.pending"
        sort-by='id'
      )
        template( v-slot:top)
          v-toolbar(flat)
            v-toolbar-title Solicitantes
            v-divider(inset vertical).mx-4
            v-text-field(v-model="search" append-icon="mdi-table-search" label="Buscar" single-line hide-details)
            v-spacer
            v-btn(v-if="can('create.applicant')" color="primary" small :to="{name: 'solicitantes-nuevo'}")
              v-icon mdi-plus-circle-outline
        template(v-if="can('edit.applicant') || can('destroy.applicant')" v-slot:item.actions="{ item }")
          v-icon(v-if="can('edit.applicant')" small @click="$router.push({name: 'solicitantes-id', params: { id: item.id}})").mr-2 mdi-pencil
          v-icon(v-if="can('destroy.applicant')" small @click="confirmation(item)").mr-2 mdi-delete
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  async fetch() {
    const { applicants } = await this.$axios.$get('solicitantes')
    this.applicants = applicants
  },
  data: () => ({
    applicants: [],
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
  computed: {
    ...mapGetters(['can']),
  },
  methods: {
    async get() {
      const { applicants } = await this.$axios.$get(`solicitantes`)
      this.applicants = applicants
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
      await this.$axios.$delete(`solicitantes/${id}`)
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
