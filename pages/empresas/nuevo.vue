<template lang="pug">
div
  v-snackbar(v-model='snackbar', :color='color') {{ message }}
  v-card.rounded-lg(:elevation='12')
    v-card-title Nueva empresa
    v-card-text
      v-form(ref='form', v-model='valid', lazy-validation)
        v-row
          v-col(cols='12', md='6')
            v-text-field(
              label='Denominacion social',
              v-model='company.denominacion_social',
              :rules='[rules.required, rules.counter]',
              outlined
            )
          v-col(cols='12', md='6')
            v-text-field(
              label='Clasificacion',
              v-model='company.clasificacion',
              :rules='[rules.required, rules.counter]',
              outlined
            )
          v-col(cols='12', md='6')
            v-text-field(
              label='Domicilio',
              v-model='company.domicilio',
              :rules='[rules.required, rules.counter]',
              outlined
            )
          v-col(cols='12', md='6')
            v-text-field(
              label='Telefono',
              v-model='company.telefono',
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
  name: 'EstadosNuevo',
  data: () => ({
    valid: false,
    snackbar: false,
    color: 'green',
    message: '',
    rules: {
      required: (value) => !!value || 'Requerido.',
      counter: (value) => value?.length <= 20 || '20 caracteres máximo.',
    },
    company: { denominacion_social: '' },
    loading: false,
  }),
  methods: {
    async save() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          await this.$axios.$post(`empresas`, this.company)
          this.snack('Empresa creada con exito!')
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
