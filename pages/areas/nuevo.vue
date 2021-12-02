<template lang="pug">
  div
    v-snackbar(v-model="snackbar" :color="color") {{ message }}
    v-card(class="rounded-lg" :elevation="12")
      v-card-title Nuevo area
      v-card-text
        v-form(ref="form" v-model="valid" lazy-validation)
          v-row
            v-col(cols="12" md="6")
              v-text-field(
                label="Nombre"
                v-model="item.nombre"
                :rules="[rules.required, rules.counter]"
                outlined
              )
            v-col(cols="12" md="6")
              v-select(
                  label="Empresa"
                  :items="companies"
                  item-text="denominacion_social"
                  item-value="id"
                  v-model="item.empresa_id"
                  :rules="[rules.required]"
                  :loading="$fetchState.pending"
                  outlined
              )
      v-card-actions
        v-spacer
        v-btn(outlined @click="$router.go(-1)") Volver
        v-btn(outlined @click="save" :loading="loading") Guardar
</template>
<script>
export default {
  name: 'AreasNuevo',
  async fetch() {
    const { data } = await this.$axios.$get('empresas')
    this.companies = data
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
    item: { nombre: '', empresa_id: '' },
    loading: false,
    companies: [],
  }),
  methods: {
    async save() {
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          const { message } = await this.$axios.$post(`areas`, this.item)
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
  },
}
</script>
