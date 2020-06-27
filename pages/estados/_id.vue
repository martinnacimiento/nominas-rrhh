<template lang="pug">
  div
    v-snackbar(v-model="snackbar" :color="color") {{ message }}
    v-card(raised)
      v-card-title Editar estado
      v-card-text
        v-form(ref="form" v-model="valid" lazy-validation)
          v-row
            v-col(cols="12" md="6")
              v-text-field(
                label="Id"
                v-model="state.id"
                disabled
              )
            v-col(cols="12" md="6")
              v-text-field(
                label="Objeto"
                v-model="state.state"
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
  name: 'estados-id',
  async asyncData({ params }) {
    const { id } = params
    const { data } = await api.get(`estados/${id}`)
    return { state: data.state }
  },
  data: () => ({
    valid: false,
    snackbar: false,
    color: 'green',
    message: '',
    rules: {
      required: (value) => !!value || 'Requerido.',
      counter: (value) => value.length <= 20 || '20 caracteres máximo.',
    },
  }),
  methods: {
    async save() {
      if (this.$refs.form.validate()) {
        try {
          const { data } = await api.put(`estados/${this.state.id}`, {
            state: this.state.state,
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
