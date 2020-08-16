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
        v-card-text Estas seguro que desea eliminar el contrato {{item.id}}?
        v-card-actions
          v-spacer
          v-btn(text @click="resetDialog") Cancelar
          v-btn(text @click="destroy(item.id)") Eliminar
    v-card(class="rounded-lg" :elevation="12")
      v-data-table(
        :headers='headers'
        :items='contracts'
        :search="search"
        :loading="$fetchState.pending"
        sort-by='id'
      )
        template( v-slot:top)
          v-toolbar(flat)
            v-toolbar-title Contratos
            v-divider(inset vertical).mx-4
            v-text-field(v-model="search" append-icon="mdi-table-search" label="Buscar" single-line hide-details)
            v-spacer
            v-btn(v-if="can('create.contract')" color="primary" small :to="{name: 'contratos-nuevo'}")
              v-icon mdi-plus-circle-outline
        template( v-slot:item.date_from="{ item }")
          |{{ item.date_from | dateL }}
        template( v-slot:item.date_until="{ item }")
          |{{ item.date_until | dateL }}
        template(v-if="can('edit.contract') || can('destroy.contract')" v-slot:item.actions="{ item }")
          v-icon(v-if="can('edit.contract')" small @click="$router.push({name: 'contratos-id', params: { id: item.id}})").mr-2 mdi-pencil
          v-icon(v-if="can('destroy.contract')" small @click="confirmation(item)").mr-2 mdi-delete
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  async fetch() {
    const { contracts } = await this.$axios.$get('contratos')
    this.contracts = contracts
  },
  data: () => ({
    contracts: [],
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Desde', value: 'date_from' },
      { text: 'Hasta', value: 'date_until' },
      { text: 'Estado', value: 'state.state' },
      { text: 'Solicitante', value: 'applicant.applicant' },
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
      const { contracts } = await this.$axios.$get(`contratos`)
      this.contracts = contracts
    },
    confirmation(item) {
      this.item = item
      this.dialog = true
    },
    resetDialog() {
      this.item = { contract: '' }
      this.dialog = false
    },
    async destroy(id) {
      await this.$axios.$delete(`contratos/${id}`)
      this.get()
      this.resetDialog()
      this.snack('El contrato ha sido eliminado.')
    },
    snack(message, color = 'green') {
      this.color = color
      this.message = message
      this.snackbar = true
    },
  },
}
</script>
