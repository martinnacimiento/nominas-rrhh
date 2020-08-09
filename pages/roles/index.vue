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
        v-card-text Estas seguro que desea eliminar el rol {{item.name}}?
        v-card-actions
          v-spacer
          v-btn(text @click="resetDialog") Cancelar
          v-btn(text @click="destroy(item.id)") Eliminar
    v-card(class="rounded-lg" :elevation="12")
      v-data-table(
        :headers='headers'
        :items='roles'
        :search="search"
        :loading="$fetchState.pending"
        sort-by='id'
      )
        template( v-slot:top)
          v-toolbar(flat)
            v-toolbar-title Roles
            v-divider(inset vertical).mx-4
            v-text-field(v-model="search" append-icon="mdi-table-search" label="Buscar" single-line hide-details)
            v-spacer
            v-btn(color="primary" small :to="{name: 'roles-nuevo'}")
              v-icon mdi-plus-circle-outline
        template( v-slot:item.actions="{ item }")
          v-icon(small @click="$router.push({name: 'roles-id', params: { id: item.id}})").mr-2 mdi-pencil
          v-icon(small @click="confirmation(item)").mr-2 mdi-delete
</template>
<script>
export default {
  async fetch() {
    try {
      const { roles } = await this.$axios.$get('roles')
      this.roles = roles
    } catch (error) {
      this.snack('No se pueden cargar los roles.', 'red')
    }
  },
  data: () => ({
    roles: [],
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Nombre de rol', value: 'name' },
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
      try {
        const { roles } = await this.$axios.$get(`roles`)
        this.roles = roles
      } catch (error) {
        this.snack('No se pueden cargar los roles.', 'red')
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
      await this.$axios.$delete(`roles/${id}`)
      this.get()
      this.resetDialog()
      this.snack('El rol ha sido eliminado.')
    },
    snack(message, color = 'green') {
      this.color = color
      this.message = message
      this.snackbar = true
    },
  },
}
</script>
