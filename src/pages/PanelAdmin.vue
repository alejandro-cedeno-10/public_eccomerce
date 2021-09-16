<template>
  <q-page class="column dark full-heigth">
    <q-card class="q-ma-sm bg-primary text-white">
      <q-card-section>
        <div class="text-h5 text-bold q-mb-sm">Panel de Administración</div>
        <span class="text-italic text-bold">Crea, Modifica y Elimina</span> el contenido de tu tienda virtual,
        las <span class="text-italic text-bold">Categorías</span> que oferta, sus <span class="text-italic text-bold">Productos</span> y <span class="text-italic text-bold">Presentaciones</span>.
      </q-card-section>
    </q-card>
    <div class="opcs">
      <q-card class="cursor-pointer" @click="navTo('admin_categorias')">
        <q-card-section>
          <div class="text-h6">Categorías</div>
          <div class="text-subtitle2">
            Administrar
            <q-icon name="forward"/>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="cursor-pointer" @click="navTo('admin_productos')">
        <q-card-section>
          <div class="text-h6">Productos</div>
          <div class="text-subtitle2">
            Administrar
            <q-icon name="forward"/>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="cursor-pointer" @click="navTo('admin_tamanos')">
        <q-card-section>
          <div class="text-h6">Presentaciones</div>
          <div class="text-subtitle2">
            Administrar
            <q-icon name="forward"/>
          </div>
        </q-card-section>
      </q-card>

      <!-- <q-card class="cursor-pointer" @click="navTo('admin_tamanos')">
        <q-card-section>
          <div class="text-h6">Métodos Pago</div>
          <div class="text-subtitle2">
            Administrar
            <q-icon name="forward"/>
          </div>
        </q-card-section>
      </q-card> -->
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'PanelAdmin',
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
