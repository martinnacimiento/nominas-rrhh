<template lang="pug">
  div
    v-snackbar(v-model="snackbar" :color="color") {{ message }}
    v-card(class="rounded-lg" :elevation="12")
      v-card-title Nuevo contrato
      v-card-text
        v-form(ref="form" v-model="valid" lazy-validation)
          v-row
            v-col(cols="12" md="6")
              v-menu(ref='menu1' v-model='menu1' :close-on-content-click='false' :return-value.sync='contract.date_from' transition='scale-transition' offset-y min-width='290px')
                template(v-slot:activator='{ on, attrs }')
                  v-text-field(v-model='contract.date_from' label='Desde' prepend-icon='mdi-calendar' readonly v-bind='attrs' v-on='on' :rules="[rules.required]")
                v-date-picker(v-model='contract.date_from' no-title scrollable)
                  v-spacer
                  v-btn(text color='primary' @click='menu1 = false') Cancel
                  v-btn(text color='primary' @click='$refs.menu1.save(contract.date_from)') OK
            v-col(cols="12" md="6")
              v-menu(ref='menu2' v-model='menu2' :close-on-content-click='false' :return-value.sync='contract.date_until' transition='scale-transition' offset-y min-width='290px')
                template(v-slot:activator='{ on, attrs }')
                  v-text-field(v-model='contract.date_until' label='Hasta' prepend-icon='mdi-calendar' readonly v-bind='attrs' v-on='on' :rules="[rules.required]")
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
                counter="8"
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
                  label="Estado"
                  :items="states"
                  item-text="state"
                  item-value="id"
                  v-model="contract.state_id"
                  :rules="[rules.required]"
                  :loading="$fetchState.pending"
              )
            v-col(cols="12" md="6")
              v-select(
                  label="Solicitante"
                  :items="applicants"
                  item-text="applicant"
                  item-value="id"
                  v-model="contract.applicant_id"
                  :rules="[rules.required]"
                  :loading="$fetchState.pending"
              )
            v-col(cols="12" md="6")
              v-select(
                  label="Objeto"
                  :items="objects"
                  item-text="object"
                  item-value="id"
                  v-model="contract.object_id"
                  :rules="[rules.required]"
                  :loading="$fetchState.pending"
              )
            v-col(cols="12" md="6")
              v-select(
                  label="Persona"
                  :items="persons"
                  item-text="surname"
                  item-value="id"
                  v-model="contract.person_id"
                  :rules="[rules.required]"
                  :loading="$fetchState.pending"
              )
      v-card-actions
        v-spacer
        v-btn(outlined @click="$router.go(-1)") Volver
        v-btn(outlined @click="save" :loading="loading") Guardar
</template>
<script>
export default {
  name: 'ContratosId',
  async fetch() {
    const { applicants } = await this.$axios.$get(`solicitantes`)
    const { objects } = await this.$axios.$get(`objetos`)
    const { persons } = await this.$axios.$get(`personas`)
    const { states } = await this.$axios.$get(`estados`)
    this.applicants = applicants
    this.objects = objects
    this.persons = persons
    this.states = states
  },
  data: () => ({
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
      counter8: (value) => value?.length <= 8 || '8 caracteres máximo.',
    },
    menu1: false,
    menu2: false,
    menu3: false,
    contract: {
      date_from: null,
      date_until: null,
      date_order: null,
      number_order: null,
      reason: null,
      state_id: null,
      applicant_id: null,
      object_id: null,
      person_id: null,
    },
    loading: false,
  }),
  methods: {
    async save() {
      if (this.$refs.form.validate()) {
        this.loading = true
        try {
          const { message } = await this.$axios.$post(`contratos`, {
            date_from: this.contract.date_from,
            date_until: this.contract.date_until,
            date_order: this.contract.date_order,
            number_order: this.contract.number_order,
            reason: this.contract.reason,
            state_id: this.contract.state_id,
            applicant_id: this.contract.applicant_id,
            object_id: this.contract.object_id,
            person_id: this.contract.person_id,
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
