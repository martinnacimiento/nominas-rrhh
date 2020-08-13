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
        v-card-text Estas seguro que desea eliminar el usuario {{item.username}}?
        v-card-actions
          v-spacer
          v-btn(text @click="resetDialog") Cancelar
          v-btn(text @click="destroy(item.id)") Eliminar
    v-card(class="rounded-lg" :elevation="12")
      v-data-table(
        :headers='headers'
        :items='users'
        :search="search"
        :loading="$fetchState.pending"
        sort-by='id'
      )
        template( v-slot:top)
          v-toolbar(flat)
            v-toolbar-title Usuarios
            v-divider(inset vertical).mx-4
            v-text-field(v-model="search" append-icon="mdi-table-search" label="Buscar" single-line hide-details)
            v-spacer
            v-btn(v-if="can('create.user')" color="primary" small :to="{name: 'usuarios-nuevo'}")
              v-icon mdi-plus-circle-outline
        template(v-if="can('edit.user') || can('destroy.user')" v-slot:item.actions="{ item }")
          v-icon(v-if="can('edit.user')" small @click="$router.push({name: 'usuarios-id', params: { id: item.id}})").mr-2 mdi-pencil
          v-icon(v-if="can('destroy.user')" small @click="confirmation(item)").mr-2 mdi-delete
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  async fetch() {
    try {
      const { users } = await this.$axios.$get('usuarios')
      this.users = users
    } catch (error) {
      this.snack('No se pueden cargar los usuarios.', 'red')
    }
  },
  data: () => ({
    users: [],
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Nombre de usuario', value: 'username' },
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
      try {
        const { users } = await this.$axios.$get(`usuarios`)
        this.users = users
      } catch (error) {
        this.snack('No se pueden cargar los usuarios.', 'red')
      }
    },
    confirmation(item) {
      this.item = item
      this.dialog = true
    },
    resetDialog() {
      this.item = { user: '' }
      this.dialog = false
    },
    async destroy(id) {
      await this.$axios.$delete(`usuarios/${id}`)
      this.get()
      this.resetDialog()
      this.snack('El usuario ha sido eliminado.')
    },
    snack(message, color = 'green') {
      this.color = color
      this.message = message
      this.snackbar = true
    },
  },
}
</script>
