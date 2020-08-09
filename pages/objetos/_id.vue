<template lang="pug">
  div
    v-snackbar(v-model="snackbar" :color="color") {{ message }}
    v-card(:loading="$fetchState.pending" class="rounded-lg" :elevation="12")
      v-card-title Editar objeto
      v-card-text
        v-form(ref="form" v-model="valid" lazy-validation)
          v-row
            v-col(cols="12" md="6")
              v-text-field(
                label="Id"
                v-model="object.id"
                disabled
              )
            v-col(cols="12" md="6")
              v-text-field(
                label="Objeto"
                v-model="object.object"
                :rules="[rules.required, rules.counter]"
                autofocus
              )
      v-card-actions
        v-spacer
        v-btn(outlined @click="$router.go(-1)") Volver
        v-btn(outlined @click="save" :loading="loading") Guardar
</template>
<script>
export default {
  name: 'ObjetosId',
  async fetch() {
    const { id } = this.$route.params
    const { object } = await this.$axios.$get(`objetos/${id}`)
    this.object = object
  },
  data: () => ({
    object: {},
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
          const { message } = await this.$axios.$put(
            `objetos/${this.object.id}`,
            {
              object: this.object.object,
            }
          )
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
  },
}
</script>
