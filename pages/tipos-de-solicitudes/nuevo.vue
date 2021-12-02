<template lang="pug">
div
  v-snackbar(v-model='snackbar', :color='color') {{ message }}
  v-card.rounded-lg(:elevation='12')
    v-card-title Nuevo tipo de solicitud
    v-card-text
      v-form(ref='form', v-model='valid', lazy-validation)
        v-row
          v-col(cols='12', md='6')
            v-text-field(
              label='Nombre',
              v-model='item.nombre',
              :rules='[rules.required, rules.counter]',
              outlined
            )
    v-card-actions
      v-spacer
      v-btn(outlined, @click='$router.go(-1)') Volver
      v-btn(outlined, @click='save', :loading='loading') Guardar
</template>
<script>
export default {
  name: 'TiposSolicitudesNuevo',
  data: () => ({
    valid: false,
    snackbar: false,
    color: 'green',
    message: '',
    rules: {
      required: (value) => !!value || 'Requerido.',
      counter: (value) => value?.length <= 50 || '50 caracteres máximo.',
    },
    item: { nombre: '' },
    loading: false,
  }),
  methods: {
    async save() {
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          await this.$axios.$post(`tiposSolicitud`, this.item)
          this.snack('Tipo de solicitud creado con exito.')
          this.$refs.form.reset()
        } catch (error) {
          this.snack('Ups! No es posible realizar esta accion ahora.', 'error')
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
