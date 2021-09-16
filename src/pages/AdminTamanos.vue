<template>
  <q-page class="column dark full-heigth">
    <div class="column q-pa-md">
      <q-card>
        <q-card-section>
          <div class="flex justify-between">
            <div class="text-h6">Agregar Presentación</div>
            <q-btn color="positive" icon="save" @click="registrar"/>
          </div>
          <q-input
          ref="nNombre"
          v-model="NuevoTamano.nombre"
          type="text"
          :rules="[ val => val && val.length > 0 || 'No debe estar vacío']"
          lazy-rules="ondemand"
          label="Nombre" />
        </q-card-section>
      </q-card>

      <div class="text-h4 text-center text-bold q-pa-sm q-mt-md">Lista de Presentaciones</div>
      <q-table
        :grid="$q.screen.sm || $q.screen.xs"
        title="Presentaciones"
        :data="tamanos"
        :columns="columns"
        row-key="id"
        selection="multiple"
        :selected.sync="selected"
        :filter="filter"
        @focusin.native="activateNavigation"
        @focusout.native="deactivateNavigation"
        @keydown.native="onKey"
        :loading="loadingTamanos"
      >
        <template v-slot:top>
          <q-btn color="primary" dense flat :disable="loadingTamanos || !(selected.length == 1)" icon="edit" @click="intentarActualizar"/>
          <q-btn color="red-5" dense flat :disable="loadingTamanos || !(selected.length > 0)" icon="delete" @click="intentarEliminar"/>
          <q-space />
          <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search" />
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
    <q-dialog v-model="dialogActualizar" transition-show="slide-down" transition-hide="slide-up">
      <q-card v-if="updCategoria" class="bg-white" style="width: 700px; max-width: 90vw;">
        <q-card-section>
          <div class="flex justify-between">
            <div class="text-h6">Actualizar Categoría</div>
            <q-btn color="positive" icon="save" @click="actualizar"/>
          </div>
          <q-input
          ref="aNombre"
          v-model="updCategoria.nombre"
          type="text"
          :rules="[ val => val && val.length > 0 || 'No debe estar vacío']"
          lazy-rules="ondemand"
          label="Nombre" />
        </q-card-section>
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

export default {
  name: 'AdminTamanos',
  data () {
    return {
      loading: false,
      NuevoTamano: {
        nombre: ''
      },
      updCategoria: null,
      errorModal: false,
      confirmEliminar: false,
      dialogActualizar: false,
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
        { name: 'nombre', align: 'center', label: 'Nombre', field: 'nombre', sortable: true }
      ]
    }
  },
  mounted () {
    this.listarTamanos(this.$axios)
  },
  computed: {
    ...mapState('tamanos', ['tamanos', 'loadingTamanos']),
    pagesNumber () {
      return Math.ceil(this.tamanos.length / this.pagination.rowsPerPage)
    }
  },
  methods: {
    ...mapActions('tamanos', [
      'listarTamanos',
      'registrarTamano',
      'actualizarTamano',
      'eliminarTamano'
    ]),
    limpiarNuevoTamano () {
      this.NuevoTamano = {
        nombre: ''
      }
    },
    validarNuevoTamano () {
      let val = true
      this.$refs.nNombre.validate()

      if (this.$refs.nNombre.hasError) {
        val = false
      }
      return val
    },
    validarUpdTamano () {
      let val = true
      this.$refs.aNombre.validate()

      if (this.$refs.aNombre.hasError) {
        val = false
      }
      return val
    },
    registrar () {
      if (!this.validarNuevoTamano()) {
        this.errorModal = true
      } else {
        this.loading = true
        this.registrarTamano({ axios: this.$axios, tamano: this.NuevoTamano })
          .then(res => {
            this.loading = false
            this.$q.notify({
              type: 'positive',
              message: 'Se registró con éxito',
              position: 'center',
              actions: [
                { label: 'X', color: 'white', handler: () => { } }
              ]
            })
            this.limpiarNuevoTamano()
            this.listarTamanos(this.$axios)
          })
          .catch(err => {
            this.loading = false
            console.log(err)
            this.$q.notify({
              type: 'negative',
              message: 'Hubieron errores durante el registro',
              position: 'center',
              actions: [
                { label: 'X', color: 'white', handler: () => { } }
              ]
            })
          })
      }
    },
    actualizar () {
      if (!this.validarUpdTamano()) {
        this.errorModal = true
      } else {
        this.loading = true
        this.actualizarTamano({ axios: this.$axios, tamano: this.updCategoria })
          .then(res => {
            this.loading = false
            this.$q.notify({
              type: 'positive',
              message: 'Se actualizó con éxito',
              position: 'center',
              actions: [
                { label: 'X', color: 'white', handler: () => { } }
              ]
            })
            this.selected = []
            this.dialogActualizar = false
            this.updCategoria = null
            this.listarTamanos(this.$axios)
          })
          .catch(err => {
            this.loading = false
            console.log(err)
            this.$q.notify({
              type: 'negative',
              message: 'Hubieron errores durante la actualización',
              position: 'center',
              actions: [
                { label: 'X', color: 'white', handler: () => { } }
              ]
            })
          })
      }
    },
    intentarActualizar () {
      this.updCategoria = {
        id: this.selected[0].id,
        nombre: this.selected[0].nombre,
        descripcion: this.selected[0].descripcion
      }
      this.dialogActualizar = true
    },
    eliminar () {
      const peticiones = []
      this.selected.forEach(e => {
        peticiones.push(this.eliminarTamano({ axios: this.$axios, id: e.id }))
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
            this.listarTamanos(this.$axios)
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
            this.listarTamanos(this.$axios)
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

</style>
