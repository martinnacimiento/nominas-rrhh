<template lang="pug">
  div
    v-snackbar(v-model="snackbar" :color="color") {{ message }}
    v-card(:loading="$fetchState.pending" class="rounded-lg" :elevation="12")
      v-card-title Editar persona
      v-card-text
        v-form(ref="form" v-model="valid" lazy-validation)
          v-row
            v-col(cols="12" md="6")
              v-text-field(
                label="Id"
                v-model="person.id"
                disabled
              )
            v-col(cols="12" md="6")
              v-text-field(
                label="Apellido"
                v-model="person.surname"
                :rules="[rules.required]"
                autofocus
                counter="20"
              )
            v-col(cols="12" md="6")
              v-text-field(
                label="Nombre"
                v-model="person.name"
                :rules="[rules.required]"
                counter="50"
              )
            v-col(cols="12" md="6")
              v-text-field(
                label="Dni"
                v-model="person.dni"
                :rules="[rules.required]"
                counter="8"
              )
            v-col(cols="12" md="6")
              v-text-field(
                label="Domicilio"
                v-model="person.domicile"
                :rules="[rules.required]"
                counter="100"
              )
            v-col(cols="12" md="6")
              v-text-field(
                label="Email"
                v-model="person.mail"
                :rules="[rules.required]"
                counter="50"
              )
            v-col(cols="12" md="6")
              v-text-field(
                label="Teléfono"
                v-model="person.telephone"
                :rules="[rules.required]"
                counter="20"
              )
            v-col(cols="12" md="6")
              v-text-field(
                label="Cuit"
                v-model="person.cuit"
                :rules="[rules.required]"
                counter="11"
              )
            v-col(cols="12" md="6")
              v-menu(ref='menu' v-model='menu' :close-on-content-click='false' :return-value.sync='person.date_birth' transition='scale-transition' offset-y min-width='290px')
                template(v-slot:activator='{ on, attrs }')
                  v-text-field(v-model='person.date_birth' label='Fecha de nacimiento' prepend-icon='mdi-calendar' readonly v-bind='attrs' v-on='on')
                v-date-picker(v-model='person.date_birth' no-title scrollable)
                  v-spacer
                  v-btn(text color='primary' @click='menu = false') Cancel
                  v-btn(text color='primary' @click='$refs.menu.save(person.date_birth)') OK
            v-col(cols="12" md="6")
              v-select(
                  label="Sexo"
                  :items="sexes"
                  item-text="sex"
                  item-value="id"
                  v-model="person.sex_id"
                  :rules="rules.required"
              )
      v-card-actions
        v-spacer
        v-btn(outlined @click="$router.go(-1)") Volver
        v-btn(outlined @click="save" :loading="loading") Guardar
</template>
<script>
import api from '@/api'
export default {
  name: 'personas-id',
  async fetch() {
    const { id } = this.$route.params
    const { data: person } = await api.get(`personas/${id}`)
    const { data: sexes } = await api.get(`sexos`)
    this.person = person.person
    this.sexes = sexes.sexes
  },
  data: () => ({
    person: {},
    sexes: [],
    valid: false,
    snackbar: false,
    color: 'green',
    message: '',
    rules: {
      required: (value) => !!value || 'Requerido.',
      counter: (value) => value?.length <= 50 || '50 caracteres máximo.',
    },
    menu: false,
    loading: false,
  }),
  methods: {
    async save() {
      if (this.$refs.form.validate()) {
        try {
          this.loading = true
          const { data } = await api.put(`personas/${this.person.id}`, {
            surname: this.person.surname,
            name: this.person.name,
            dni: this.person.dni,
            domicile: this.person.domicile,
            mail: this.person.mail,
            telephone: this.person.telephone,
            date_birth: this.person.date_birth,
            cuit: this.person.cuit,
            sex_id: this.person.sex_id,
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
