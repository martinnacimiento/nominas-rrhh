<template lang="pug">
div
  v-snackbar(v-model='snackbar', :color='color') {{ message }}
  v-card.rounded-lg(:elevation='12')
    v-card-title Nuevo contrato
    v-card-text
      v-form(ref='form', v-model='valid', lazy-validation)
        v-row
          v-col(cols='12', md='6')
            v-menu(
              ref='menu1',
              v-model='menu1',
              :close-on-content-click='false',
              :return-value.sync='contract.fecha',
              transition='scale-transition',
              offset-y,
              min-width='290px'
            )
              template(v-slot:activator='{ on, attrs }')
                v-text-field(
                  outlined
                  v-model='contract.fecha',
                  label='Desde',
                  prepend-icon='mdi-calendar',
                  readonly,
                  v-bind='attrs',
                  v-on='on',
                  :rules='[rules.required]'
                )
              v-date-picker(
                v-model='contract.fecha',
                scrollable
              )
                v-spacer
                v-btn(text, color='primary', @click='menu1 = false') Cancel
                v-btn(
                  text,
                  color='primary',
                  @click='$refs.menu1.save(contract.fecha)'
                ) OK

          v-col(cols='12', md='6')
            v-text-field(label='Nombre', v-model='contract.nombre' outlined)
          v-col(cols='12', md='6')
            v-select(
              outlined
              label='Empleado',
              :items='employees',
              item-text='apellido',
              item-value='id',
              v-model='contract.empleado_id',
              :rules='[rules.required]',
              :loading='$fetchState.pending'
            )
          v-col(cols='12', md='6')
            v-select(
              outlined
              label='Tipo de contrato',
              :items='contractTypes',
              item-text='nombre',
              item-value='id',
              v-model='contract.tipo_contrato_id',
              :rules='[rules.required]',
              :loading='$fetchState.pending'
            )
          v-col(cols='12', md='6')
            v-select(
              outlined
              label='Cargo',
              :items='positions',
              item-text='nombre',
              item-value='id',
              v-model='contract.cargo_id',
              :rules='[rules.required]',
              :loading='$fetchState.pending'
            )
    v-card-actions
      v-spacer
      v-btn(outlined, @click='$router.go(-1)') Volver
      v-btn(outlined, @click='save', :loading='loading') Guardar
</template>
<script>
export default {
  name: 'ContratosId',
  async fetch() {
    const { data: positionsData } = await this.$axios.$get(`cargos`)
    const { data: employeesData } = await this.$axios.$get(`empleados`)
    const { data: contractTypeData } = await this.$axios.$get(`tiposContrato`)
    this.positions = positionsData
    this.employees = employeesData
    this.contractTypes = contractTypeData
  },
  data: () => ({
    positions: [],
    employees: [],
    contractTypes: [],
    valid: false,
    snackbar: false,
    color: 'green',
    message: '',
    rules: {
      required: (value) => !!value || 'Requerido.',
      counter8: (value) => value?.length <= 8 || '8 caracteres máximo.',
    },
    menu1: false,
    contract: {
      fecha: null,
      empleado_id: null,
      tipo_contrato_id: null,
      cargo_id: null,
    },
    loading: false,
  }),
  methods: {
    async save() {
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          await this.$axios.$post(`contratos`, this.contract)
          this.snack('Se ha creado con exito!')
        } catch (error) {
          this.snack('Ups! No se puede ahora', 'error')
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
