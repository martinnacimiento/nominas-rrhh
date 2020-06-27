<template lang="pug">
  div
    v-snackbar(v-model="snackbar" :color="color") {{ message }}
    v-card(raised)
      v-card-title Nuevo objeto
      v-card-text
        v-form(ref="form" v-model="valid" lazy-validation)
          v-row
            v-col(cols="12" md="6")
              v-text-field(
                label="Objeto"
                v-model="object.object"
                :rules="[rules.required, rules.counter]"
              )
      v-card-actions
        v-spacer
        v-btn(outlined @click="$router.go(-1)") Volver
        v-btn(outlined @click="save") Guardar
</template>
<script>
import api from '@/api'
export default {
  name: 'objetos-nuevo',
  data: () => ({
    valid: false,
    snackbar: false,
    color: 'green',
    message: '',
    rules: {
      required: (value) => !!value || 'Requerido.',
      counter: (value) => value?.length <= 50 || '50 caracteres máximo.',
    },
    object: { object: '' },
  }),
  methods: {
    async save() {
      if (this.$refs.form.validate()) {
        try {
          const { data } = await api.post(`objetos`, {
            object: this.object.object,
          })
          this.snack(data.message)
          this.$refs.form.reset()
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
