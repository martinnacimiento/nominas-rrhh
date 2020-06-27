<template lang="pug">
  div
    v-snackbar(v-model="snackbar" :color="color") {{ message }}
    v-card(raised)
      v-card-title Editar sexo
      v-card-text
        v-form(ref="form" v-model="valid" lazy-validation)
          v-row
            v-col(cols="12" md="6")
              v-text-field(
                label="Id"
                v-model="sex.id"
                disabled
              )
            v-col(cols="12" md="6")
              v-text-field(
                label="Sexo"
                v-model="sex.sex"
                :rules="[rules.required, rules.counter]"
                autofocus
              )
      v-card-actions
        v-spacer
        v-btn(outlined @click="$router.go(-1)") Volver
        v-btn(outlined @click="save") Guardar
</template>
<script>
import api from '@/api'
export default {
  name: 'sexos-id',
  async asyncData({ params }) {
    const { id } = params
    const { data } = await api.get(`sexos/${id}`)
    return { sex: data.sex }
  },
  data: () => ({
    valid: false,
    snackbar: false,
    color: 'green',
    message: '',
    rules: {
      required: (value) => !!value || 'Requerido.',
      counter: (value) => value.length <= 10 || '10 caracteres máximo.',
    },
  }),
  methods: {
    async save() {
      if (this.$refs.form.validate()) {
        try {
          const { data } = await api.put(`sexos/${this.sex.id}`, {
            sex: this.sex.sex,
          })
          this.snack(data.message)
        } catch (error) {
          this.snack(error.response.data.message, 'error')
        }
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
