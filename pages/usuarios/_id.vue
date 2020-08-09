<template lang="pug">
  div
    v-snackbar(v-model="snackbar" :color="color") {{ message }}
    v-card(:loading="$fetchState.pending" class="rounded-lg" :elevation="12")
      v-card-title Editar usuario
      v-card-text
        v-form(ref="form" v-model="valid" lazy-validation)
          v-row
            v-col(cols="12" md="6")
              v-text-field(
                label="Id"
                v-model="user.id"
                disabled
              )
            v-col(cols="12" md="6")
              v-text-field(
                label="Nombre de usuario"
                v-model="user.username"
                :rules="[rules.required, rules.counter]"
                autofocus
              )
            v-col(cols="12" md="6")
                v-select(
                  label="Roles"
                  :items="roles"
                  item-text="name"
                  item-value="id"
                  v-model="user.roles"
                  multiple
                )
      v-card-actions
        v-spacer
        v-btn(outlined @click="$router.go(-1)") Volver
        v-btn(outlined @click="save" :loading="loading") Guardar
</template>
<script>
export default {
  name: 'UsuariosId',
  async fetch() {
    const { id } = this.$route.params
    const { user } = await this.$axios.$get(`usuarios/${id}`)
    const { roles } = await this.$axios.$get(`roles`)
    this.user = user
    this.roles = roles
  },
  data: () => ({
    user: {},
    roles: [],
    valid: false,
    snackbar: false,
    color: 'green',
    message: '',
    rules: {
      required: (value) => !!value || 'Requerido.',
      counter: (value) => value?.length <= 20 || '20 caracteres máximo.',
    },
    loading: false,
  }),
  methods: {
    async save() {
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          const { message } = await this.$axios.$put(
            `usuarios/${this.user.id}`,
            {
              username: this.user.username,
            }
          )
          this.snack(message)
        } catch (error) {
          this.snack(error.response.data.message, 'error')
        }
        this.loading = false
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
