<template lang="pug">
div
  v-snackbar(v-model='snackbar', :color='color') {{ message }}
  v-card.rounded-lg(:loading='$fetchState.pending', :elevation='12')
    v-card-title Editar solicitud
    v-card-text
      v-form(ref='form', v-model='valid', lazy-validation)
        v-row
          v-col(cols='12', md='6')
            v-menu(
              ref='menu1',
              v-model='menu1',
              :close-on-content-click='false',
              :return-value.sync='item.fecha',
              transition='scale-transition',
              offset-y,
              min-width='290px'
            )
              template(v-slot:activator='{ on, attrs }')
                v-text-field(
                  outlined,
                  v-model='item.fecha',
                  label='Desde',
                  prepend-icon='mdi-calendar',
                  readonly,
                  v-bind='attrs',
                  v-on='on',
                  :rules='[rules.required]'
                )
              v-date-picker(v-model='item.fecha', scrollable)
                v-spacer
                v-btn(text, color='primary', @click='menu1 = false') Cancel
                v-btn(
                  text,
                  color='primary',
                  @click='$refs.menu1.save(item.fecha)'
                ) OK

        v-col(cols='12', md='6')
          v-text-field(label='Nombre', v-model='item.nombre', outlined)
        v-col(cols='12', md='6')
          v-select(
            outlined,
            label='Empleado',
            :items='employees',
            item-text='apellido',
            item-value='id',
            v-model='item.empleado.id',
            :rules='[rules.required]',
            :loading='$fetchState.pending'
          )
        v-col(cols='12', md='6')
          v-select(
            outlined,
            label='Tipo de solicitud',
            :items='requestTypes',
            item-text='nombre',
            item-value='id',
            v-model='item.tipoSolicitud.id',
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
    const { id } = this.$route.params
    const { data: requestData } = await this.$axios.$get(`solicitudes/${id}`)
    const { data: employeesData } = await this.$axios.$get(`empleados`)
    const { data: requestTypesData } = await this.$axios.$get(`tiposSolicitud`)
    this.employees = employeesData
    this.requestTypes = requestTypesData
    this.item = requestData
  },
  data: () => ({
    item: {
      empleado: {},
      tipoSolicitud: {},
    },
    employees: [],
    requestTypes: [],
    valid: false,
    snackbar: false,
    color: 'green',
    message: '',
    rules: {
      required: (value) => !!value || 'Requerido.',
      counter: (value) => value.length <= 50 || '50 caracteres máximo.',
    },
    menu1: false,
    loading: false,
  }),
  methods: {
    async save() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          await this.$axios.$put(`solicitudes/${this.item.id}`, {
            ...this.item,
            empleado_id: this.item.empleado.id,
            tipo_solicitud_id: this.item.tipoSolicitud.id,
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
