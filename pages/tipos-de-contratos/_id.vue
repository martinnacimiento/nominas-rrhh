<template lang="pug">
div
  v-snackbar(v-model='snackbar', :color='color') {{ message }}
  v-card.rounded-lg(:loading='$fetchState.pending', :elevation='12')
    v-card-title Editar tipo de contrato
    v-card-text
      v-form(ref='form', v-model='valid', lazy-validation)
        v-row
          v-col(cols='12', md='6')
            v-text-field(
              label='Nombre',
              v-model='item.nombre',
              :rules='[rules.required, rules.counter]',
              autofocus,
              outlined
            )
    v-card-actions
      v-spacer
      v-btn(outlined, @click='$router.go(-1)') Volver
      v-btn(outlined, @click='save', :loading='loading') Guardar
</template>
<script>
export default {
  name: 'TiposContratoId',
  async fetch() {
    const { id } = this.$route.params
    const { data } = await this.$axios.$get(`tiposContrato/${id}`)
    this.item = data
  },
  data: () => ({
    item: { area: '' },
    valid: false,
    snackbar: false,
    color: 'green',
    message: '',
    rules: {
      required: (value) => !!value || 'Requerido.',
      counter: (value) => value?.length <= 50 || '50 caracteres máximo.',
    },
    loading: false,
  }),
  methods: {
    async save() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          await this.$axios.$put(`tiposContrato/${this.item.id}`, {
            nombre: this.item.nombre,
          })
          this.snack('Se ha editado con exito.')
        } catch (error) {
          this.snack('Ups! No es posible esta accion ahora.', 'error')
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
