<template lang="pug">
div
  v-snackbar(v-model='snackbar', :color='color') {{ message }}
  v-card.rounded-lg(:loading='$fetchState.pending', :elevation='12')
    v-card-title Editar cargo
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
          v-col(cols='12', md='6')
            v-select(
              label='Departamento',
              :items='departments',
              item-text='nombre',
              item-value='id',
              v-model='item.departamento.id',
              :rules='[rules.required]',
              :loading='$fetchState.pending',
              outlined
            )
    v-card-actions
      v-spacer
      v-btn(outlined, @click='$router.go(-1)') Volver
      v-btn(outlined, @click='save', :loading='loading') Guardar
</template>
<script>
export default {
  name: 'CargosId',
  async fetch() {
    const { id } = this.$route.params
    const { data } = await this.$axios.$get(`cargos/${id}`)
    const { data: departmentData } = await this.$axios.$get('departamentos')
    this.item = data
    this.departments = departmentData
  },
  data: () => ({
    item: { departamento: '' },
    valid: false,
    snackbar: false,
    color: 'green',
    message: '',
    rules: {
      required: (value) => !!value || 'Requerido.',
      counter: (value) => value?.length <= 50 || '50 caracteres máximo.',
    },
    loading: false,
    departments: [],
  }),
  methods: {
    async save() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          const { message } = await this.$axios.$put(`cargos/${this.item.id}`, {
            nombre: this.item.nombre,
            departamento_id: this.item.departamento.id,
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
  },
}
</script>
