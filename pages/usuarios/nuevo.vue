<template lang="pug">
  div
    v-snackbar(v-model="snackbar" :color="color") {{ message }}
    v-card(class="rounded-lg" :elevation="12")
      v-card-title Nuevo usuario
      v-card-text
        v-form(ref="form" v-model="valid" lazy-validation)
          v-row
            v-col(cols="12" md="6")
              v-text-field(
                label="Nombre de usuario"
                v-model="user.username"
                :rules="[rules.required, rules.counter]"
              )
            v-col(cols="12" md="6")
                v-text-field(
                    v-model="user.password"
                    label="Contraseña"
                    type="password"
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
                    template(#prepend-item)
                        v-list-item(ripple @click="toggle")
                            v-list-item-action
                                v-icon(
                                    :color="user.roles.length > 0 ? 'indigo darken-4': ''"
                                ) {{ icon }}
                            v-list-item-content
                                v-list-item-title Seleccionar todo
                        v-divider.mt-2
                    template(#selection="{item , index}")
                        v-chip(v-if="index === 0")
                            span {{ item.name }}
                        span(v-if="index === 1" class="grey--text caption") (Otros +{{ user.roles.length - 1 }})
      v-card-actions
        v-spacer
        v-btn(outlined @click="$router.go(-1)") Volver
        v-btn(outlined @click="save" :loading="loading") Guardar
</template>
<script>
export default {
  name: 'UsuariosNuevo',
  async fetch() {
    const { roles } = await this.$axios.$get(`roles`)
    this.roles = roles
  },
  data: () => ({
    valid: false,
    snackbar: false,
    color: 'green',
    message: '',
    rules: {
      required: (value) => !!value || 'Requerido.',
      counter: (value) => value?.length <= 50 || '50 caracteres máximo.',
    },
    user: { roles: [] },
    loading: false,
    roles: [],
  }),
  computed: {
    selectedAllRoles() {
      return this.user.roles.length === this.roles.length
    },
    selectedSomeRole() {
      return this.user.roles.length > 0 && !this.selectedAllRoles
    },
    icon() {
      if (this.selectedAllRoles) return 'mdi-close-box'
      if (this.selectedSomeRole) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
  },
  methods: {
    async save() {
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          const { message } = await this.$axios.$post(`usuarios`, {
            username: this.user.username,
            password: this.user.password,
            roles: this.user.roles,
          })
          this.snack(message)
          this.$refs.form.reset()
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
    toggle() {
      this.$nextTick(() => {
        if (this.selectedAllRoles) {
          this.user.roles = []
        } else {
          this.user.roles = this.roles.map((p) => p.id)
        }
      })
    },
  },
}
</script>
