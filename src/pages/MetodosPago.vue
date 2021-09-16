<template>
  <q-page class="column dark full-heigth">
    <q-card class="q-ma-sm bg-primary text-white">
      <q-card-section>
        <div class="text-h5 text-bold q-mb-sm">Métodos de Pago</div>
      </q-card-section>
    </q-card>
    <div class="opcs">
      <q-card>
        <q-card-section>
          <q-select :options="['1','2']" label="Método de Pago" filled />
        </q-card-section>
        <q-card-actions vertical align="center">
          <q-btn style="min-width: 100%;" color="positive" icon="save" label="Guardar"/>
        </q-card-actions>
      </q-card>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'MetodosPago',
  data () {
    return {
      splitterWidth: 40,
      selected: [],
      navigationActive: false,
      filter: '',
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 2,
        rowsPerPage: 3
        // rowsNumber: xx if getting data from a server
      },
      columns: [
        {
          name: 'id',
          required: true,
          label: 'Id',
          align: 'center',
          field: 'id',
          sortable: true
        },
        { name: 'nombre', align: 'center', label: 'Nombre', field: 'nombre', sortable: true },
        { name: 'descripcion', align: 'center', label: 'Descripción', field: 'descripcion', sortable: true }
      ]
    }
  },
  methods: {
    navTo (ruta) {
      this.$router.push('/' + ruta)
    }
  }
}
</script>

<style lang="scss">
  .opcs{
    display: grid;
    padding: 1rem;
    grid-template-columns: repeat(auto-fit,minmax(300px, auto));
    gap: 1rem;
  }
</style>
