<template lang="pug">
  div
    v-snackbar(v-model="snackbar" :color="color") {{ message }}
    v-card(:loading="$fetchState.pending" class="rounded-lg" :elevation="12")
      v-card-title Editar rol
      v-card-text
        v-form(ref="form" v-model="valid" lazy-validation)
          v-row
            v-col(cols="12" md="6")
              v-text-field(
                label="Id"
                v-model="role.id"
                disabled
              )
            v-col(cols="12" md="6")
              v-text-field(
                label="Nombre"
                v-model="role.name"
                :rules="[rules.required, rules.counter]"
              )
            v-col(cols="12" md="6")
              v-text-field(
                label="Slug"
                v-model="role.slug"
                :rules="[rules.required, rules.counter]"
              )
            v-col(cols="12" md="6")
                v-textarea(
                    label="Descripción"
                    auto-grow
                    clearable
                    rows="1"
                    v-model="role.description"
                )
            v-col(cols="12" md="6")
                v-select(
                  label="Permisos"
                  :items="permissions"
                  item-text="name"
                  item-value="id"
                  v-model="role.permissions"
                  multiple
                )
                    template(#prepend-item)
                        v-list-item(ripple @click="toggle")
                            v-list-item-action
                                v-icon(
                                    :color="role.permissions.length > 0 ? 'indigo darken-4': ''"
                                ) {{ icon }}
                            v-list-item-content
                                v-list-item-title Seleccionar todo
                        v-divider.mt-2
                    template(#selection="{item , index}")
                        v-chip(v-if="index === 0")
                            span {{ item.name }}
                        span(v-if="index === 1" class="grey--text caption") (Otros +{{ role.permissions.length - 1 }})
      v-card-actions
        v-spacer
        v-btn(outlined @click="$router.go(-1)") Volver
        v-btn(outlined @click="save" :loading="loading") Guardar
</template>
<script>
export default {
  name: 'RolesId',
  async fetch() {
    const { id } = this.$route.params
    const { role } = await this.$axios.$get(`roles/${id}`)
    const { permissions } = await this.$axios.$get(`permisos`)
    this.role = role
    this.permissions = permissions
  },
  data: () => ({
    role: { permissions: [] },
    valid: false,
    snackbar: false,
    color: 'green',
    message: '',
    rules: {
      required: (value) => !!value || 'Requerido.',
      counter: (value) => value?.length <= 10 || '10 caracteres máximo.',
    },
    loading: false,
    permissions: [],
  }),
  computed: {
    selectedAllPermissions() {
      return this.role.permissions.length === this.permissions.length
    },
    selectedSomePermission() {
      return this.role.permissions.length > 0 && !this.selectedAllPermissions
    },
    icon() {
      if (this.selectedAllPermissions) return 'mdi-close-box'
      if (this.selectedSomePermission) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
  },
  methods: {
    async save() {
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          const { message } = await this.$axios.$put(`roles/${this.role.id}`, {
            name: this.role.name,
            slug: this.role.slug,
            description: this.role.description,
            permissions: this.role.permissions,
          })
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
    toggle() {
      this.$nextTick(() => {
        if (this.selectedAllPermissions) {
          this.role.permissions = []
        } else {
          this.role.permissions = this.permissions.map((p) => p.id)
        }
      })
    },
  },
}
</script>
