<template>
  <q-page class="column dark full-heigth">
    <div class="column q-pa-md">
      <q-card>
        <q-card-section>
          <div class="flex justify-between">
            <div class="text-h6">Agregar Producto</div>
            <div class="flex center">
              <q-btn flat color="primary" icon="visibility">
                <q-tooltip
                  transition-show="flip-right"
                  transition-hide="flip-left"
                >
                  Vista Previa
                </q-tooltip>
              </q-btn>
              <q-separator color="transparent" size=".5rem" vertical/>
              <q-btn color="primary" icon="add" @click="registrar"/>
            </div>
          </div>
          <q-select
            ref="nCategoria"
            item-aligned
            v-model="nuevoProducto.categoria"
            option-value="id"
            option-label="nombre"
            :rules="[ val => val || val === '' && val.length > 0 || 'Debe elegir una categoría']"
            lazy-rules="ondemand"
            :options="categorias"
            label="Categoría"
            />
          <q-input
            ref="nNombre"
            v-model="nuevoProducto.nombre"
            :rules="[ val => val && val.length > 0 || 'No debe estar vacío']"
            lazy-rules="ondemand"
            type="text"
            label="Nombre"/>
          <q-input
            ref="nDescripcion"
            v-model="nuevoProducto.descripcion"
            :rules="[ val => val && val.length > 0 || 'No debe estar vacío']"
            lazy-rules="ondemand"
            type="text"
            label="Descripción"/>
          <q-expansion-item
            expand-separator
            icon="view_carousel"
            label="Presentaciones"
            header-class="text-bold text-h6"
          >
            <div>
              <q-select
                ref="nTamanoProducto"
                item-aligned
                v-model="nuevoProducto.tamanoProducto"
                option-value="id"
                option-label="nombre"
                :rules="[ val => val || val === '' && val.length > 0 || 'Debe elegir una categoría']"
                lazy-rules="ondemand"
                :options="tamanos"
                label="Presentación"
                />
              <div class="add-tamano">
                <q-input
                  ref="nPrecioTamano"
                  v-model="nuevoProducto.precioTamano"
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
                  ref="nStockTamano"
                  :rules="[ val => val && val.length > 0 || 'No debe estar vacío']"
                  lazy-rules="ondemand"
                  input-class="text-right"
                  v-model.number="nuevoProducto.stockTamano"
                  type="number"
                  filled
                  label="Stock"/>
                <q-btn dense color="primary" icon="add" @click="addTamano"/>
              </div>
            </div>
            <q-list bordered>
              <q-item v-for="(tam, index) in nuevoProducto.tamanos" v-bind:key="index" v-ripple>
                <q-item-section>
                  <div class="tamano-descr">
                    <div class="text-bold">{{tam.nombre}}</div>
                    <div>
                      {{tam.stock}} x <b>$ {{tam.precio}}</b>
                    </div>
                  </div>
                  </q-item-section>
                <q-item-section side>
                  <div class="btns-opc-tamano">
                    <q-btn dense flat color="primary" icon="edit" @click="verUpdateTamano(tam.id)"/>
                    <q-btn dense flat color="red" icon="delete" @click="removeTamano(tam.id)"/>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>
        </q-card-section>
      </q-card>

      <div class="text-h4 text-center text-bold q-pa-sm q-mt-md">Lista de Productos</div>
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
    <q-dialog v-model="dialogActualizar" transition-show="slide-down" transition-hide="slide-up">
      <q-card v-if="updProducto" class="bg-white" style="width: 700px; max-width: 90vw;">
        <q-card-section>
          <div class="flex justify-between">
            <div class="text-h6">Actualizar Producto</div>
            <q-btn color="primary" icon="check" @click="actualizar"/>
          </div>
          <q-select
            ref="aCategoria"
            item-aligned
            v-model="updProducto.categoria"
            option-value="id"
            option-label="nombre"
            :rules="[ val => val || val === '' && val.length > 0 || 'Debe elegir una categoría']"
            lazy-rules="ondemand"
            :options="categorias"
            label="Categoría"
            />
          <q-input
            ref="aNombre"
            v-model="updProducto.nombre"
            :rules="[ val => val && val.length > 0 || 'No debe estar vacío']"
            lazy-rules="ondemand"
            type="text"
            label="Nombre"/>
          <q-input
            ref="aDescripcion"
            v-model="updProducto.descripcion"
            :rules="[ val => val && val.length > 0 || 'No debe estar vacío']"
            lazy-rules="ondemand"
            type="text"
            label="Descripción"/>
          <q-expansion-item
            expand-separator
            icon="view_carousel"
            label="Presentaciones"
            header-class="text-bold text-h6"
          >
            <div>
              <q-select
                ref="uTamanoProducto"
                item-aligned
                v-model="updProducto.tamanoProducto"
                option-value="id"
                option-label="nombre"
                :rules="[ val => val || val === '' && val.length > 0 || 'Debe elegir una categoría']"
                lazy-rules="ondemand"
                :options="tamanos"
                label="Presentación"
                />
              <div class="add-tamano">
                <q-input
                  ref="uPrecioTamano"
                  v-model="updProducto.precioTamano"
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
                  ref="uStockTamano"
                  v-model="updProducto.stockTamano"
                  mask="#.##"
                  :rules="[ val => val && val.length > 0 || 'No debe estar vacío']"
                  lazy-rules="ondemand"
                  filled
                  input-class="text-right"
                  type="text"
                  fill-mask="0"
                  reverse-fill-mask
                  label="Stock"/>
                <q-btn dense color="primary" icon="add" @click="addTamano"/>
              </div>
            </div>
            <q-list bordered>
              <q-item v-for="(tam, index) in updProducto.tamanos" v-bind:key="index" v-ripple>
                <q-item-section>
                  <div>
                    {{tam.Tamano}}: <b class="">${{tam.Precio}}</b> , stock: {{tam.Stock? tamStock : 0}}
                  </div>
                  </q-item-section>
                <q-item-section side>
                  <div class="btns-opc-tamano">
                    <q-btn flat dense color="primary" icon="edit" @click="intentarActualizarPresentacion(tam.id)"/>
                    <q-btn flat dense color="red" icon="delete" @click="eliminarPresentacion(tam.id)"/>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </q-expansion-item>
        </q-card-section>
      </q-card>
    </q-dialog>
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
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'AdminProductos',
  data () {
    return {
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
        { name: 'nombre', align: 'center', label: 'Nombre', field: 'nombre', sortable: true },
        { name: 'descripcion', align: 'center', label: 'Descripción', field: 'descripcion', sortable: true },
        { name: 'url_imagen', align: 'center', label: 'Imagen', field: 'url_imagen', sortable: true }
      ]
    }
  },
  mounted () {
    this.listarCategorias(this.$axios)
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
    ...mapActions('categorias', ['listarCategorias']),
    ...mapActions('tamanos', ['listarTamanos']),
    ...mapActions('tamanoProductos', [
      'registrarTamanoProducto',
      'actualizarTamanoProducto',
      'eliminarTamanoProducto',
      'getTamanosDe'
    ]),
    ...mapActions('productos', [
      'listarProductos',
      'registrarProducto',
      'actualizarProducto',
      'eliminarProducto'
    ]),
    validarNuevoTamano () {
      let flag = true
      this.$refs.nPrecioTamano.validate()
      this.$refs.nTamanoProducto.validate()

      if (this.$refs.nPrecioTamano.hasError || this.$refs.nTamanoProducto.hasError) {
        flag = false
      }
      return flag
    },
    validarUpdTamano () {
      let flag = true
      this.$refs.uPrecioTamano.validate()
      this.$refs.uTamanoProducto.validate()

      if (this.$refs.uPrecioTamano.hasError || this.$refs.uTamanoProducto.hasError) {
        flag = false
      }
      return flag
    },
    addTamano () {
      if (!this.validarNuevoTamano()) {
        this.$q.notify({
          type: 'negative',
          message: 'Debe Corregir los errores de la Presentación',
          position: 'center',
          actions: [
            { label: 'X', color: 'white', handler: () => { } }
          ]
        })
        return
      }
      if (this.nuevoProducto.tamanos.find(e => e.id === this.nuevoProducto.tamanoProducto.id)) {
        this.$q.notify({
          type: 'negative',
          message: 'Ya existe esa Presentación',
          position: 'center',
          actions: [
            { label: 'X', color: 'white', handler: () => { } }
          ]
        })
        return
      }
      const tamano = {
        id: this.nuevoProducto.tamanoProducto.id,
        nombre: this.nuevoProducto.tamanoProducto.nombre,
        precio: this.nuevoProducto.precioTamano,
        stock: this.nuevoProducto.stockTamano
      }
      this.nuevoProducto.tamanos.push(tamano)
    },
    verUpdateTamano (id) {
      this.modalUpdTamano = true
      this.updTamanoProducto = this.nuevoProducto.tamanos.find(e => e.id === id)
    },
    cerrarUpdateTamano (id) {
      this.modalUpdTamano = false
      this.updTamanoProducto = null
    },
    updateTamano () {
      if (!this.validarNuevoTamano()) {
        this.$q.notify({
          type: 'negative',
          message: 'Debe Corregir los errores de la Presentación',
          position: 'center',
          actions: [
            { label: 'X', color: 'white', handler: () => { } }
          ]
        })
        return
      }
      if (this.nuevoProducto.tamanos.find(e => e.id === this.nuevoProducto.tamanoProducto.id)) {
        this.$q.notify({
          type: 'negative',
          message: 'Ya existe esa Presentación',
          position: 'center',
          actions: [
            { label: 'X', color: 'white', handler: () => { } }
          ]
        })
        return
      }
      const tamano = {
        id: this.nuevoProducto.tamanoProducto.id,
        nombre: this.nuevoProducto.tamanoProducto.nombre,
        precio: this.nuevoProducto.precioTamano,
        stock: this.nuevoProducto.stockTamano
      }
      this.nuevoProducto.tamanos.push(tamano)
    },
    removeTamano (id) {
      this.nuevoProducto.tamanos = this.nuevoProducto.tamanos.filter(e => e.id !== id)
    },
    limpiarNuevoProducto () {
      this.nuevoProducto = {
        categoria: '',
        nombre: '',
        descripcion: '',
        url_img: ''
      }
    },
    validarNuevoProducto () {
      let val = true
      this.$refs.nCategoria.validate()
      this.$refs.nNombre.validate()
      this.$refs.nDescripcion.validate()

      if (this.$refs.nNombre.hasError || this.$refs.nDescripcion.hasError || this.$refs.nCategoria.hasError) {
        val = false
      }
      return val
    },
    validarUpdProducto () {
      let val = true
      this.$refs.aNombre.validate()
      this.$refs.aDescripcion.validate()

      if (this.$refs.aNombre.hasError || this.$refs.aDescripcion.hasError || this.$refs.aCategoria.hasError) {
        val = false
      }
      return val
    },
    registrar () {
      if (!this.validarNuevoProducto()) {
        this.errorModal = true
      } else {
        const prod = {
          id_categoria: this.nuevoProducto.categoria.id,
          nombre: this.nuevoProducto.nombre,
          descripcion: this.nuevoProducto.descripcion,
          url_img: this.nuevoProducto.url_img
        }
        this.registrarProducto({ axios: this.$axios, producto: prod })
          .then(res => {
            this.$q.notify({
              type: 'positive',
              message: 'Se registró con éxito',
              position: 'center',
              actions: [
                { label: 'X', color: 'white', handler: () => { } }
              ]
            })
            // console.log(res)
            if (this.nuevoProducto.tamanos.length !== 0) {
              this.registrarPresentaciones(res.data.data.id)
            }
            this.limpiarNuevoProducto()
            this.listarProductos(this.$axios)
          })
          .catch(err => {
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
      if (!this.validarUpdProducto()) {
        this.errorModal = true
      } else {
        const prod = {
          id: this.updProducto.categoria.id,
          nombre: this.updProducto.nombre,
          descripcion: this.updProducto.descripcion,
          url_img: this.updProducto.url_img
        }
        this.actualizarProducto({ axios: this.$axios, producto: prod })
          .then(res => {
            this.$q.notify({
              type: 'positive',
              message: 'Se actualizó con éxito',
              position: 'center',
              actions: [
                { label: 'X', color: 'white', handler: () => { } }
              ]
            })
            console.log(res)
            this.selected = []
            this.dialogActualizar = false
            this.updProducto = null
            this.listarProductos(this.$axios)
          })
          .catch(err => {
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
      // llamar al loading
      this.getTamanosDe({ axios: this.$axios, id: this.selected[0].id })
        .then(res => {
          // cerrar loading
          console.log(res)
          this.updProducto = {
            id: this.selected[0].id,
            categoria: this.categorias.find(e => e.id === this.selected[0].id_categoria),
            nombre: this.selected[0].nombre,
            descripcion: this.selected[0].descripcion,
            precioTamano: 0,
            tamanoProducto: '',
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

      Promise.all(peticiones)
        .then((res) => {
          res.forEach(item => {
            this.listarProductos(this.$axios)
            this.selected = []

            this.$q.notify({
              type: 'positive',
              message: 'Se eliminó con éxito los registros',
              position: 'center',
              actions: [
                { label: 'X', color: 'white', handler: () => { } }
              ]
            })
          })
        })
        .catch(err => {
          err.forEach(item => {
            this.listarProductos(this.$axios)
            this.selected = []
            this.$q.notify({
              type: 'negative',
              message: 'Hubieron errores durante la eliminación',
              position: 'center',
              actions: [
                { label: 'X', color: 'white', handler: () => { } }
              ]
            })
          })
        })
    },
    intentarEliminar () {
      this.confirmEliminar = true
    },
    intentarEliminarTamano () {
      this.confirmEliminarTamano = true
    },
    registrarPresentaciones (id) {
      const peticiones = []
      this.nuevoProducto.tamanos.forEach(e => {
        const pres = {
          id_tamano: e.id,
          id_producto: id,
          precio: e.precio
        }
        peticiones.push(this.registrarTamanoProducto({ axios: this.$axios, tamanoProducto: pres }))
      })

      Promise.all(peticiones)
        .then((res) => {
          res.forEach(item => {
            this.listarProductos(this.$axios)
            this.selected = []
            this.$q.notify({
              type: 'positive',
              message: 'Se Registraron con éxito las Presentaciones del Producto',
              position: 'center',
              actions: [
                { label: 'X', color: 'white', handler: () => { } }
              ]
            })
          })
        })
        .catch(err => {
          err.forEach(item => {
            this.listarProductos(this.$axios)
            this.selected = []
            this.$q.notify({
              type: 'negative',
              message: 'Hubieron errores durante el registro de las Presentaciones del Producto',
              position: 'center',
              actions: [
                { label: 'X', color: 'white', handler: () => { } }
              ]
            })
          })
        })
    },
    registrarPresentacion () {
      if (!this.validarUpdTamano()) {
        this.$q.notify({
          type: 'negative',
          message: 'Debe Corregir los errores de la Presentación',
          position: 'center',
          actions: [
            { label: 'X', color: 'white', handler: () => { } }
          ]
        })
        return
      }
      if (this.updProducto.tamanos.find(e => e.id === this.updProducto.tamanoProducto.id)) {
        this.$q.notify({
          type: 'negative',
          message: 'Ya existe esa Presentación',
          position: 'center',
          actions: [
            { label: 'X', color: 'white', handler: () => { } }
          ]
        })
        return
      }
      const pres = {
        id_tamano: this.updProducto.tamanoProducto.id,
        id_producto: this.updProducto.id,
        precio: this.updProducto.precioTamano
      }
      this.registrarTamanoProducto({ axios: this.$axios, tamanoProducto: pres })
        .then(res => {
          console.log(res)
          this.selected = []
          this.dialogActualizar = false
          this.updProducto = null
          this.listarProductos(this.$axios)
          this.$q.notify({
            type: 'positive',
            message: 'Se actualizó con éxito',
            position: 'center',
            actions: [
              { label: 'X', color: 'white', handler: () => { } }
            ]
          })
        })
        .catch(err => {
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
    },
    intentarActualizarPresentacion (id) {
      this.actualizarTamanoProducto({ axios: this.$axios, tamanoProducto: this.updTamanoProducto })
        .then(res => {
          console.log(res)
          this.llenarTamanosProducto()
          this.$q.notify({
            type: 'positive',
            message: 'Se actualizó con éxito',
            position: 'center',
            actions: [
              { label: 'X', color: 'white', handler: () => { } }
            ]
          })
        })
        .catch(err => {
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
    },
    actualizarPresentacion () {
      this.actualizarTamanoProducto({ axios: this.$axios, tamanoProducto: this.updTamanoProducto })
        .then(res => {
          console.log(res)
          this.llenarTamanosProducto()
          this.$q.notify({
            type: 'positive',
            message: 'Se actualizó con éxito',
            position: 'center',
            actions: [
              { label: 'X', color: 'white', handler: () => { } }
            ]
          })
        })
        .catch(err => {
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
    },
    llenarTamanosProducto () {
      this.getTamanosDe({ axios: this.$axios, id: this.updProducto.id })
        .then(res => {
          console.log(res)
          this.updProducto.tamanos = res.data.Tamanos_disponibles ? res.data.Tamanos_disponibles : []
        })
        .catch(err => {
          console.log(err)
        })
    },
    eliminarPresentacion (id) {
      this.eliminarTamanoProducto({ axios: this.$axios, id: id })
        .then(res => {
          console.log(res)
          this.llenarTamanosProducto()
          this.$q.notify({
            type: 'positive',
            message: 'Se eliminó con éxito',
            position: 'center',
            actions: [
              { label: 'X', color: 'white', handler: () => { } }
            ]
          })
        })
        .catch(err => {
          console.log(err)
          this.$q.notify({
            type: 'negative',
            message: 'Hubieron errores durante la eliminación',
            position: 'center',
            actions: [
              { label: 'X', color: 'white', handler: () => { } }
            ]
          })
        })
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
