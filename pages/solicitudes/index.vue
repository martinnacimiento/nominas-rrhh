<template lang="pug">
div
  v-snackbar(v-model='snackbar', :color='color') {{ message }}
  v-dialog(v-model='dialog', @click:outside='resetDialog', width='500')
    v-card.rounded-lg
      v-card-title
      v-card-text Estas seguro que desea eliminar la solicitud {{ item.nombre }}?
      v-card-actions
        v-spacer
        v-btn(text, @click='resetDialog') Cancelar
        v-btn(text, @click='destroy(item.id)') Eliminar
  v-card.rounded-lg(:elevation='12')
    v-data-table(
      :headers='headers',
      :items='items',
      :search='search',
      :loading='$fetchState.pending',
      sort-by='id'
    )
      template(v-slot:top)
        v-toolbar(flat)
          v-toolbar-title Solicitudes
          v-divider.mx-4(inset, vertical)
          v-text-field(
            v-model='search',
            append-icon='mdi-table-search',
            label='Buscar',
            single-line,
            hide-details
          )
          v-spacer
          v-btn(
            v-if='can("*")',
            color='primary',
            small,
            :to='{ name: "solicitudes-nuevo" }'
          )
            v-icon mdi-plus-circle-outline
      template(v-slot:item.date_from='{ item }')
        | {{ item.date_from | dateL }}
      template(v-slot:item.date_until='{ item }')
        | {{ item.date_until | dateL }}
      template(v-if='can("*") || can("*")', v-slot:item.actions='{ item }')
        v-icon.mr-2(
          v-if='can("*")',
          small,
          @click='$router.push({ name: "solicitudes-id", params: { id: item.id } })'
        ) mdi-pencil
        v-icon.mr-2(v-if='can("*")', small, @click='confirmation(item)') mdi-delete
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  async fetch() {
    const { data } = await this.$axios.$get('solicitudes')
    this.items = data
  },
  data: () => ({
    items: [],
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Nombre', value: 'nombre' },
      { text: 'Fecha', value: 'fecha' },
      { text: 'Empleado', value: 'empleado.apellido' },
      { text: 'Cargo', value: 'cargo.nombre' },
      { text: 'Tipo de solicitud', value: 'tipoSolicitud.nombre' },
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
      const { data } = await this.$axios.$get(`solicitudes`)
      this.items = data
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
      try {
        await this.$axios.$delete(`solicitudes/${id}`)
        this.get()
        this.resetDialog()
        this.snack('La solicitud ha sido eliminada.')
      } catch (error) {
        this.snack('Ups! No es posible esta accion', 'error')
      }
    },
    snack(message, color = 'green') {
      this.color = color
      this.message = message
      this.snackbar = true
    },
  },
}
</script>
