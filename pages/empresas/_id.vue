<template lang="pug">
div
  v-snackbar(v-model='snackbar', :color='color') {{ message }}
  v-card.rounded-lg(:loading='$fetchState.pending', :elevation='12')
    v-card-title Editar empresa
    v-card-text
      v-form(ref='form', v-model='valid', lazy-validation)
        v-row
          v-col(cols='12', md='6')
            v-text-field(
              label='Denominacion social',
              v-model='company.denominacion_social',
              :rules='[rules.required, rules.counter]',
              outlined,
              autofocus
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
  name: 'EstadosId',
  async fetch() {
    const { id } = this.$route.params
    const { data } = await this.$axios.$get(`empresas/${id}`)
    this.company = data
  },
  data: () => ({
    company: {},
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
    async get() {
      const { id } = this.$route.params
      const { data } = await this.$axios.$get(`empresas/${id}`)
      this.company = data
    },
    async save() {
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          await this.$axios.$put(`empresas/${this.company.id}`, this.company)
          this.snack('Empresa actualizada.')
        } catch (error) {
          this.snack(
            'Ups! No se puede realizar esta accion en este momento.',
            'error'
          )
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
