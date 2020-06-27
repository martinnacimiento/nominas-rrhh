<template lang="pug">
  v-data-table.elevation-1(:headers='headers' :items='persons' sort-by='id')
</template>
<script>
import api from '@/api'
export default {
  async asyncData({ params }) {
    const { data } = await api.get('personas')
    return { persons: data.persons }
  },
  data: () => ({
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Apellido', value: 'surname' },
      { text: 'Nombre', value: 'name' },
      { text: 'Dni', value: 'dni' },
    ],
  }),
}
</script>
