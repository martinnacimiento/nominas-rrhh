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
      div
        v-row
          h3 Puestos
        v-row
          v-expansion-panels(popout, focusable)
            v-expansion-panel(
              v-if='company.areas.length > 0',
              v-for='(a, index1) in company.areas',
              :key='index1',
              @click='getDepartments(a, index1)'
            )
              v-expansion-panel-header {{ a.nombre }}
              v-expansion-panel-content
                v-expansion-panels(popout, focusable)
                  v-expansion-panel(
                    v-if='a.departamentos.length > 0',
                    v-for='(d, index2) in a.departamentos',
                    :key='index2',
                    @click='getPositions(d, index1, index2, a.departamentos)'
                  )
                    v-expansion-panel-header {{ d.nombre }}
                    v-expansion-panel-content {{ d.cargos ? d.cargos.length : "0" }}
        v-row
          v-col(cols='12', md='3')
            v-combobox(
              label='Cargo',
              v-model='position',
              :items='positions',
              item-text='nombre',
              item-value='nombre',
              :rules='[rules.required, rules.counter]',
              outlined
            )
          v-col(cols='12', md='3')
            v-combobox(
              label='Departamento',
              v-model='department',
              :items='departments',
              item-text='nombre',
              item-value='nombre',
              :rules='[rules.required, rules.counter]',
              outlined
            )
          v-col(cols='12', md='3')
            v-combobox(
              label='Area',
              v-model='area',
              :items='areas',
              item-text='nombre',
              item-value='nombre',
              :rules='[rules.required, rules.counter]',
              outlined
            )
          v-col(cols='12', md='3')
            v-btn(:disabled='!addBtn', @click='addData', color='primary') Agregar
    v-card-actions
      v-spacer
      v-btn(outlined, @click='$router.go(-1)') Volver
      v-btn(outlined, @click='save', :loading='loading') Guardar
</template>
<script>
import dayjs from 'dayjs'

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

    positions: [],
    areas: [],
    departments: [],

    searchArea: '',
    searchDepartment: '',
    searchPosition: '',

    position: '',
    area: '',
    department: '',
  }),
  computed: {
    addBtn() {
      return this.position && this.area && this.department
    },
  },
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
          const { message } = await this.$axios.$put(
            `estados/${this.state.id}`,
            {
              state: this.state.state,
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
    async addData() {
      if (!this.position.id && !this.department.id && !this.area.id) {
        const { data: areaCreated } = this.area.id
          ? { data: this.area }
          : await this.$axios.post('areas', {
              nombre: this.area.nombre || this.area,
              empresa_id: this.company.id,
            })

        const { data: departmentCreated } = this.department.id
          ? { data: this.department }
          : await this.$axios.post('departamentos', {
              nombre: this.department.nombre || this.department,
              area_id: areaCreated.data.id,
            })

        await this.$axios.post('cargos', {
          nombre: this.position.nombre || this.position,
          departamento_id: departmentCreated.data.id,
          fecha: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        })
      }

      await this.get()
      this.position = ''
      this.department = ''
      this.area = ''
    },
    async getDepartments(area, index) {
      const { data } = await this.$axios.get(`areas/${area.id}`)
      this.$set(this.company.areas, index, data.data)
    },
    async getPositions(department, index1, index2, arr) {
      const { data } = await this.$axios.get(`departamentos/${department.id}`)
      this.$set(this.company.areas[index1].departamentos, index2, data.data)
    },
  },
}
</script>
