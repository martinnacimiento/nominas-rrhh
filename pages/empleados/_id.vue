<template lang="pug">
div
  v-snackbar(v-model='snackbar', :color='color') {{ message }}
  v-card.rounded-lg(:loading='$fetchState.pending', :elevation='12')
    v-card-title Editar empleado
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
          v-col(cols='12', md='6')
            v-text-field(
              label='Apellido',
              v-model='item.apellido',
              :rules='[rules.required, rules.counter]',
              outlined
            )
          v-col(cols='12', md='6')
            v-text-field(
              label='Legajo',
              v-model='item.legajo',
              :rules='[rules.required, rules.counter]',
              outlined
            )
          v-col(cols='12', md='6')
            v-text-field(
              label='DNI',
              v-model='item.dni',
              :rules='[rules.required, rules.counter]',
              outlined
            )
          v-col(cols='12', md='6')
            v-text-field(
              label='Domicilio',
              v-model='item.domicilio',
              :rules='[rules.required, rules.counter]',
              outlined
            )
          v-col(cols='12', md='6')
            v-text-field(
              label='Email',
              v-model='item.email',
              :rules='[rules.required, rules.counter]',
              outlined
            )
          v-col(cols='12', md='6')
            v-text-field(
              label='Telefono',
              v-model='item.telefono',
              :rules='[rules.required, rules.counter]',
              outlined
            )
          v-col(cols='12', md='6')
            v-text-field(
              label='Telefono de emergencia',
              v-model='item.telefono_emergencia',
              :rules='[rules.required, rules.counter]',
              outlined
            )
          v-col(cols='12', md='6')
            v-text-field(
              label='Sexo',
              v-model='item.sexo',
              :rules='[rules.required, rules.counter]',
              outlined
            )
          v-col(cols='12', md='6')
            v-text-field(
              label='Estado civil',
              v-model='item.estado_civil',
              :rules='[rules.required, rules.counter]',
              outlined
            )
          v-col(cols='12', md='6')
            v-text-field(
              label='Documentacion',
              v-model='item.documentacion',
              :rules='[rules.required, rules.counter]',
              outlined
            )
          v-col(cols='12', md='6')
            v-menu(
              ref='menu1',
              v-model='menu1',
              :close-on-content-click='false',
              :return-value.sync='item.fecha_nacimiento',
              transition='scale-transition',
              offset-y,
              min-width='290px'
            )
              template(v-slot:activator='{ on, attrs }')
                v-text-field(
                  v-model='item.fecha_nacimiento',
                  label='Fecha de nacimiento',
                  outlined,
                  prepend-icon='mdi-calendar',
                  readonly,
                  v-bind='attrs',
                  v-on='on',
                  :rules='[rules.required]'
                )
              v-date-picker(
                v-model='item.fecha_nacimiento',
                :show-current="true"
                scrollable
              )
                v-spacer
                v-btn(text, color='primary', @click='menu1 = false') Cancel
                v-btn(
                  text,
                  color='primary',
                  @click='$refs.menu1.save(item.fecha_nacimiento)'
                ) OK
          v-col(cols='12', md='6')
            v-menu(
              ref='menu2',
              v-model='menu2',
              :close-on-content-click='false',
              :return-value.sync='item.fecha_ingreso',
              transition='scale-transition',
              offset-y,
              min-width='290px'
            )
              template(v-slot:activator='{ on, attrs }')
                v-text-field(
                  v-model='item.fecha_ingreso',
                  label='Fecha de ingreso',
                  outlined,
                  prepend-icon='mdi-calendar',
                  readonly,
                  v-bind='attrs',
                  v-on='on',
                  :rules='[rules.required]'
                )
              v-date-picker(v-model='item.fecha_ingreso', :show-current="true", scrollable)
                v-spacer
                v-btn(text, color='primary', @click='menu2 = false') Cancel
                v-btn(
                  text,
                  color='primary',
                  @click='$refs.menu2.save(item.fecha_ingreso)'
                ) OK
    v-card-actions
      v-spacer
      v-btn(outlined, @click='$router.go(-1)') Volver
      v-btn(outlined, @click='save', :loading='loading') Guardar
</template>
<script>
export default {
  name: 'EmpleadosId',
  async fetch() {
    const { id } = this.$route.params
    const { data } = await this.$axios.$get(`empleados/${id}`)
    this.item = data
  },
  data: () => ({
    item: {},
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
          await this.$axios.$put(`empleados/${this.item.id}`, this.item)
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
