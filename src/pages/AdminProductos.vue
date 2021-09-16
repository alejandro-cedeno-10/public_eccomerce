<template>
  <q-page class="column dark full-heigth">
    <RegistrarProducto/>

    <q-dialog v-model="dialogActualizar" transition-show="slide-down" transition-hide="slide-up">
      <ActualizarProducto :updProducto="updProducto" v-on:cerrarActualizar="closeActualizar"/>
    </q-dialog>

    <div class="text-h4 text-center text-bold q-pa-sm q-mt-md">
      Lista de Productos
        <q-select
          item-aligned
          v-model="categoriaFiltro"
          option-value="id"
          option-label="nombre"
          :options="categoriasFiltro"
          label="Categoría Filtro"
        />
        <q-table
          :grid="$q.screen.sm || $q.screen.xs"
          title="Categorías"
          :data="filtroProductos"
          :columns="columns"
          row-key="id"
          selection="multiple"
          :selected.sync="selected"
          :filter="filter"
          @focusin.native="activateNavigation"
          @focusout.native="deactivateNavigation"
          @keydown.native="onKey"
          :loading="loadingCategorias"
        >
        <template v-slot:top>
          <q-btn color="primary" dense flat :disable="loadingProductos || !(selected.length == 1)" icon="edit" @click="intentarActualizar"/>
          <q-btn color="red-5" dense flat :disable="loadingProductos || !(selected.length > 0)" icon="delete" @click="intentarEliminar"/>
          <q-space />
          <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search"/>
            </template>
          </q-input>
        </template>
      <template v-slot:pagination="scope">
          <q-btn
            v-if="scope.pagesNumber > 2"
            icon="first_page"
            color="grey-8"
            round
            dense
            flat
            :disable="scope.isFirstPage"
            @click="scope.firstPage"
          />

          <q-btn
            icon="chevron_left"
            color="grey-8"
            round
            dense
            flat
            :disable="scope.isFirstPage"
            @click="scope.prevPage"
          />

          <q-btn
            icon="chevron_right"
            color="grey-8"
            round
            dense
            flat
            :disable="scope.isLastPage"
            @click="scope.nextPage"
          />

          <q-btn
            v-if="pagesNumber > 2"
            icon="last_page"
            color="grey-8"
            round
            dense
            flat
            :disable="scope.isLastPage"
            @click="scope.lastPage"
          />
        </template>
      </q-table>
    </div>
    <q-dialog v-model="modalUpdTamano">
      <q-card class="q-pa-sm">
        <div class="add-tamano" v-if="updTamanoProducto">
          <q-input
            ref="nuPrecioTamano"
            v-model="updTamanoProducto.precio"
            mask="#.##"
            :rules="[ val => val && val.length > 0 || 'No debe estar vacío']"
            lazy-rules="ondemand"
            filled
            input-class="text-right"
            type="text"
            fill-mask="0"
            reverse-fill-mask
            label="Precio"/>
          <q-input
            ref="nuStockTamano"
            :rules="[ val => val && val.length > 0 || 'No debe estar vacío']"
            lazy-rules="ondemand"
            input-class="text-right"
            v-model.number="updTamanoProducto.stock"
            type="number"
            filled
            label="Stock"/>
          <q-btn dense color="primary" icon="check" @click="cerrarUpdateTamano()"/>
        </div>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirmEliminar" persistent transition-show="jump-down" transition-hide="jump-up">
      <q-card>
        <q-card-section>
          <div class="text-h6">Alerta</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          ¿Estás seguro de que quieres Eliminar?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancelar" flat color="primary" v-close-popup />
          <q-btn label="Sí, Eliminar" color="primary" v-close-popup @click="eliminar"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="errorModal" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-red-5 text-white">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Error</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-pt-none">
          Verifica que los datos estén correctos
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="loading" persistent>
      <q-spinner-pie color="primary" size="5rem"/>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import RegistrarProducto from '../components/producto/RegistrarProducto'
import ActualizarProducto from '../components/producto/ActualizarProducto'

export default {
  name: 'AdminProductos',
  components: {
    RegistrarProducto,
    ActualizarProducto
  },
  data () {
    return {
      loading: false,
      nuevoProducto: {
        categoria: '',
        nombre: '',
        descripcion: '',
        url_img: '',
        precioTamano: 0,
        stockTamano: 0,
        tamanoProducto: '',
        tamanos: []
      },
      updTamanoProducto: null,
      updProducto: null,
      errorModal: false,
      modalUpdTamano: false,
      confirmEliminar: false,
      confirmEliminarTamano: false,
      dialogActualizar: false,
      categoriaFiltro: {
        id: 0, nombre: 'Todas'
      },
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
        { name: 'estado', align: 'center', label: 'Estado', field: 'estado', sortable: true },
        { name: 'nombre', align: 'center', label: 'Nombre', field: 'nombre', sortable: true },
        { name: 'descripcion', align: 'center', label: 'Descripción', field: 'descripcion', sortable: true },
        { name: 'url_imagen', align: 'center', label: 'Imagen', field: 'url_imagen', sortable: true }
      ]
    }
  },
  mounted () {
    this.listarCategoriasAdmin(this.$axios)
    this.listarTamanos(this.$axios)
    this.listarProductos(this.$axios)
  },
  computed: {
    ...mapState('categorias', ['categorias', 'loadingCategorias']),
    ...mapState('tamanos', ['tamanos']),
    ...mapState('productos', ['productos', 'loadingProductos']),
    pagesNumber () {
      return Math.ceil(this.categorias.length / this.pagination.rowsPerPage)
    },
    categoriasFiltro () {
      return this.categorias.concat([{ id: 0, nombre: 'Todos' }])
    },
    filtroProductos () {
      if (this.categoriaFiltro.id || this.categoriaFiltro.id !== 0) {
        return this.productos.filter(e => e.id_categoria === this.categoriaFiltro.id)
      }
      return this.productos
    }
  },
  methods: {
    ...mapActions('categorias', ['listarCategoriasAdmin']),
    ...mapActions('tamanos', ['listarTamanos']),
    ...mapActions('tamanoProductos', ['getTamanosDe']),
    ...mapActions('productos', [
      'listarProductos',
      'eliminarProducto'
    ]),
    closeActualizar () {
      this.dialogActualizar = false
      this.updProducto = null
    },
    intentarActualizar () {
      this.getTamanosDe({ axios: this.$axios, id: this.selected[0].id })
        .then(res => {
          // cerrar loading
          console.log(res)
          this.updProducto = {
            id: this.selected[0].id,
            categoria: this.categorias.find(e => e.id === this.selected[0].id_categoria),
            nombre: this.selected[0].nombre,
            descripcion: this.selected[0].descripcion,
            img: this.selected[0].url_imagen,
            nuevaImg: null,
            precioTamano: 0,
            tamanoProducto: '',
            stockProducto: '',
            tamanos: res.data.Tamanos_disponibles ? res.data.Tamanos_disponibles : []
          }
          this.dialogActualizar = true
        })
        .catch(err => {
          console.log(err)
          // cerrar loading
        })
    },
    eliminar () {
      const peticiones = []
      this.selected.forEach(e => {
        peticiones.push(this.eliminarProducto({ axios: this.$axios, id: e.id }))
      })

      this.loading = true

      Promise.all(peticiones)
        .then((res) => {
          this.loading = false
          res.forEach(item => {
            this.$q.notify({
              type: 'positive',
              message: 'Se eliminó con éxito los registros',
              position: 'center',
              actions: [
                { label: 'X', color: 'white', handler: () => { } }
              ]
            })
            this.listarProductos(this.$axios)
            this.selected = []
          })
        })
        .catch(err => {
          this.loading = false
          err.forEach(item => {
            this.$q.notify({
              type: 'negative',
              message: 'Hubieron errores durante la eliminación',
              position: 'center',
              actions: [
                { label: 'X', color: 'white', handler: () => { } }
              ]
            })
            this.listarProductos(this.$axios)
            this.selected = []
          })
        })
    },
    intentarEliminar () {
      this.confirmEliminar = true
    },
    activateNavigation () {
      this.navigationActive = true
    },
    deactivateNavigation () {
      this.navigationActive = false
    },
    onKey (evt) {
      if (
        this.navigationActive !== true ||
          [33, 34, 35, 36, 38, 40].indexOf(evt.keyCode) === -1 ||
        this.$refs.myTable === undefined
      ) {
        return
      }

      evt.preventDefault()

      const { computedRowsNumber, computedRows } = this.$refs.myTable

      if (computedRows.length === 0) {
        return
      }

      const currentIndex = this.selected.length > 0 ? computedRows.indexOf(this.selected[0]) : -1
      const currentPage = this.pagination.page
      const rowsPerPage = this.pagination.rowsPerPage === 0 ? computedRowsNumber : this.pagination.rowsPerPage
      const lastIndex = computedRows.length - 1
      const lastPage = Math.ceil(computedRowsNumber / rowsPerPage)

      let index = currentIndex
      let page = currentPage

      switch (evt.keyCode) {
        case 36: // Home
          page = 1
          index = 0
          break
        case 35: // End
          page = lastPage
          index = rowsPerPage - 1
          break
        case 33: // PageUp
          page = currentPage <= 1 ? lastPage : currentPage - 1
          if (index < 0) {
            index = 0
          }
          break
        case 34: // PageDown
          page = currentPage >= lastPage ? 1 : currentPage + 1
          if (index < 0) {
            index = rowsPerPage - 1
          }
          break
        case 38: // ArrowUp
          if (currentIndex <= 0) {
            page = currentPage <= 1 ? lastPage : currentPage - 1
            index = rowsPerPage - 1
          } else {
            index = currentIndex - 1
          }
          break
        case 40: // ArrowDown
          if (currentIndex >= lastIndex) {
            page = currentPage >= lastPage ? 1 : currentPage + 1
            index = 0
          } else {
            index = currentIndex + 1
          }
          break
      }

      if (page !== this.pagination.page) {
        this.pagination = {
          ...this.pagination,
          page
        }

        this.$nextTick(() => {
          const { computedRows } = this.$refs.myTable
          this.selected = [computedRows[Math.min(index, computedRows.length - 1)]]
        })
      } else {
        this.selected = [computedRows[index]]
      }
    }
  }
}
</script>

<style lang="scss">
.add-tamano{
  display: grid;
  grid-template-columns: auto auto 2rem;
  /* grid-template-columns: auto 5.5rem 2rem; */
  gap: .5rem;
  align-items: center;
}
.btns-opc-tamano{
  display: grid;
  grid-template-columns: auto auto;
  justify-content: space-between;
  max-width: 5rem;
}
.tamano-descr{
  display: grid;
  grid-template-columns: auto auto;
  justify-content: space-between;
}
</style>
