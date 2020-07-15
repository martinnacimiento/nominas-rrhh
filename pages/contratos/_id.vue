<template lang="pug">
  div
    v-snackbar(v-model="snackbar" :color="color") {{ message }}
    v-card(:loading="$fetchState.pending" class="rounded-lg" :elevation="12")
      v-card-title Editar contrato
      v-card-text
        v-form(ref="form" v-model="valid" lazy-validation)
          v-row
            v-col(cols="12" md="6")
              v-text-field(
                label="Id"
                v-model="contract.id"
                disabled
              )
            v-col(cols="12" md="6")
              v-menu(ref='menu1' v-model='menu1' :close-on-content-click='false' :return-value.sync='contract.date_from' transition='scale-transition' offset-y min-width='290px')
                template(v-slot:activator='{ on, attrs }')
                  v-text-field(disabled v-model='contract.date_from' label='Desde' prepend-icon='mdi-calendar' readonly v-bind='attrs' v-on='on')
                v-date-picker(v-model='contract.date_from' no-title scrollable)
                  v-spacer
                  v-btn(text color='primary' @click='menu1 = false') Cancel
                  v-btn(text color='primary' @click='$refs.menu1.save(contract.date_from)') OK
            v-col(cols="12" md="6")
              v-menu(ref='menu2' v-model='menu2' :close-on-content-click='false' :return-value.sync='contract.date_until' transition='scale-transition' offset-y min-width='290px')
                template(v-slot:activator='{ on, attrs }')
                  v-text-field(disabled v-model='contract.date_until' label='Hasta' prepend-icon='mdi-calendar' readonly v-bind='attrs' v-on='on')
                v-date-picker(v-model='contract.date_until' no-title scrollable)
                  v-spacer
                  v-btn(text color='primary' @click='menu2 = false') Cancel
                  v-btn(text color='primary' @click='$refs.menu2.save(contract.date_until)') OK
            v-col(cols="12" md="6")
              v-menu(ref='menu3' v-model='menu3' :close-on-content-click='false' :return-value.sync='contract.date_order' transition='scale-transition' offset-y min-width='290px')
                template(v-slot:activator='{ on, attrs }')
                  v-text-field(v-model='contract.date_order' label='Fecha de disposición' prepend-icon='mdi-calendar' readonly v-bind='attrs' v-on='on')
                v-date-picker(v-model='contract.date_order' no-title scrollable)
                  v-spacer
                  v-btn(text color='primary' @click='menu3 = false') Cancel
                  v-btn(text color='primary' @click='$refs.menu3.save(contract.date_order)') OK

            v-col(cols="12" md="6")
              v-text-field(
                label="Numero de disposición"
                v-model="contract.number_order"
                :rules="[]"
              )
            v-col(cols="12" md="6")
              v-textarea(
                label="Razón"
                v-model="contract.reason"
                :rules="[]"
                auto-grow
                rows="1"
              )
            v-col(cols="12" md="6")
              v-file-input(
                label="Anexo"
              )
            v-col(cols="12" md="6")
              v-select(
                  disabled
                  :items="states"
                  item-text="state"
                  item-value="id"
                  v-model="contract.state_id"
              )
            v-col(cols="12" md="6")
              v-select(
                  disabled
                  :items="applicants"
                  item-text="applicant"
                  item-value="id"
                  v-model="contract.applicant_id"
              )
            v-col(cols="12" md="6")
              v-select(
                  disabled
                  :items="objects"
                  item-text="object"
                  item-value="id"
                  v-model="contract.object_id"
              )
            v-col(cols="12" md="6")
              v-select(
                  disabled
                  :items="persons"
                  item-text="surname"
                  item-value="id"
                  v-model="contract.person_id"
              )
      v-card-actions
        v-spacer
        v-btn(outlined @click="$router.go(-1)") Volver
        v-btn(outlined @click="save" :loading="loading") Guardar
</template>
<script>
import api from '@/api'
export default {
  name: 'contratos-id',
  async fetch() {
    const { id } = this.$route.params
    const { data: contract } = await api.get(`contratos/${id}`)
    const { data: applicants } = await api.get(`solicitantes`)
    const { data: objects } = await api.get(`objetos`)
    const { data: persons } = await api.get(`personas`)
    const { data: states } = await api.get(`estados`)
    this.contract = contract.contract
    this.applicants = applicants.applicants
    this.objects = objects.objects
    this.persons = persons.persons
    this.states = states.states
  },
  data: () => ({
    contract: {},
    applicants: [],
    objects: [],
    persons: [],
    states: [],
    valid: false,
    snackbar: false,
    color: 'green',
    message: '',
    rules: {
      required: (value) => !!value || 'Requerido.',
      counter: (value) => value.length <= 50 || '50 caracteres máximo.',
    },
    menu1: false,
    menu2: false,
    menu3: false,
    loading: false,
  }),
  methods: {
    async save() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          const { data } = await api.put(`contratos/${this.contract.id}`, {
            date_order: this.contract.date_order,
            number_order: this.contract.number_order,
            reason: this.contract.reason,
          })
          this.snack(data.message)
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
