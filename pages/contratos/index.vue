<template lang="pug">
  v-data-table.elevation-1(:headers='headers' :items='contracts' sort-by='id')
</template>
<script>
import api from '@/api'
export default {
  async asyncData({ params }) {
    const { data } = await api.get('contratos')
    return { contracts: data.contracts }
  },
  data: () => ({
    headers: [
      { text: 'ID', value: 'id' },
      { text: 'Desde', value: 'date_from' },
      { text: 'Hasta', value: 'date_until' },
      { text: 'Estado', value: 'state_id' },
      { text: 'Solicitante', value: 'applicant_id' },
    ],
  }),
}
</script>
