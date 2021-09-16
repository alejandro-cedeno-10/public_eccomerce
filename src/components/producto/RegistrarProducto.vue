<template>
  <div class="column q-pa-md">
    <q-card>
      <q-card-section>
        <div class="flex justify-between">
          <div class="text-h6">Agregar Producto</div>
          <div class="flex center">
            <!-- <q-btn flat color="primary" icon="visibility">
              <q-tooltip
                transition-show="flip-right"
                transition-hide="flip-left"
              >
                Vista Previa
              </q-tooltip>
            </q-btn> -->
            <q-separator color="transparent" size=".5rem" vertical/>
            <q-btn color="positive" icon="save" @click="registrar"/>
          </div>
        </div>
        <div class="nueva-cat-body">
          <q-img
            v-if="nuevoProdImg"
            :src="nuevoProdImg"
            :ratio="1"
            spinner-color="primary"
            spinner-size="36px"
            @click="$refs['imgN'].pickFiles()"
            class="shadow-4 cursor-pointer"
          >
            <div class="absolute-bottom text-subtittle flex justify-between">
              ( {{ (nuevoProducto.img.size/1024).toFixed(2) }} ) KB
              <q-icon name="fas fa-times" size="20px" @click.stop.prevent="qutarImgNuevoProd"/>
            </div>
          </q-img>
          <q-card v-else @click="$refs['imgN'].pickFiles()" rounded class="bg-primary img-preview cursor-pointer">
            <q-icon name="fas fa-upload" color="white" style="font-size: 6rem;"/>
          </q-card>
          <div>
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
              class="q-pl-md"
              label="Nombre"/>
            <q-input
              v-model="nuevoProducto.descripcion"
              type="text"
              class="q-pl-md"
              label="Descripción"/>
            <q-separator inset vertical color="transparent"/>
            <q-file
              filled
              bg-color="primary"
              label-color="white"
              color="white"
              ref="imgN"
              v-model="nuevoProducto.img"
              @input="img_selected"
              counter
              class="q-pl-md"
              label="Imagen del Producto"
              accept=".jpg, .png, image/*"
              style="display:none"
            />
          </div>
        </div>
        <q-expansion-item
          class="q-mt-sm"
          expand-separator
          icon="view_carousel"
          label="Presentaciones"
          header-class="text-bold text-h6"
        >
          <div>
            <div class="nueva-cat-body">
              <q-file
                filled
                bg-color="primary"
                label-color="white"
                color="white"
                ref="imgNPres"
                v-model="nuevoTamano.img"
                @input="img_selected_pres"
                counter
                class="q-pl-md"
                label="Imagen del Producto"
                accept=".jpg, .png, image/*"
                style="display:none"
              />
              <q-img
                v-if="nuevoTamano.imgNueva"
                :src="nuevoTamano.imgNueva"
                :ratio="1"
                spinner-color="primary"
                spinner-size="36px"
                @click="$refs['imgNPres'].pickFiles()"
                class="shadow-4 cursor-pointer"
              >
                <div class="absolute-bottom text-subtittle flex justify-between">
                  ( {{ (nuevoTamano.img.size/1024).toFixed(2) }} ) KB
                  <q-icon name="fas fa-times" size="20px" @click.stop.prevent="qutarImgNuevaPres"/>
                </div>
              </q-img>
              <q-card v-else @click="$refs['imgNPres'].pickFiles()" rounded class="bg-primary img-preview cursor-pointer">
                <q-icon name="fas fa-upload" color="white" style="font-size: 6rem;"/>
              </q-card>
              <div>
                <q-select
                  ref="nTamanoProducto"
                  item-aligned
                  v-model="nuevoTamano.tamano"
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
                    v-model="nuevoTamano.precio"
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
                    v-model.number="nuevoTamano.stock"
                    type="number"
                    filled
                    label="Stock"/>
                  <q-btn dense color="primary" icon="add" @click="addTamano"/>
                </div>
              </div>
            </div>
          </div>
          <q-list bordered class="q-mt-md">
            <q-item v-for="(tam, index) in nuevoProducto.tamanos" v-bind:key="index" v-ripple>
              <q-item-section avatar>
                <q-img
                  v-if="tam.imgNueva"
                  :src="tam.imgNueva"
                  :ratio="1"
                  spinner-color="primary"
                  spinner-size="36px"
                  class="shadow-4"
                />
                <q-card v-else class="bg-primary img-preview cursor-pointer">
                  <q-icon name="photo" color="white" style="font-size: 1.5rem; padding: 1rem;"/>
                </q-card>
              </q-item-section>
              <q-item-section>
                <div class="tamano-descr">
                  <div class="text-bold">{{tam.nombre}}</div>
                  <div>
                    {{tam.stock ? tam.stock : 0}} x <b>$ {{tam.precio}}</b>
                  </div>
                </div>
              </q-item-section>
              <q-item-section side>
                <div class="btns-opc-tamano">
                  <q-btn dense flat color="primary" icon="edit" @click="verUpdateTamano(tam.id)"/>
                  <q-btn dense flat color="red" icon="delete" @click="verConfirmEliminar(tam.id)"/>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
      </q-card-section>
    </q-card>

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
          <q-btn label="Sí, Eliminar" color="primary" v-close-popup @click="removeTamano"/>
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
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'RegistrarProducto',
  data () {
    return {
      loading: false,
      nuevoProdImg: null,
      nuevoProducto: {
        categoria: '',
        nombre: '',
        descripcion: '',
        img: null,
        tamanos: []
      },
      nuevoTamano: {
        tamano: '',
        precio: 0,
        stock: 0,
        img: null,
        imgNueva: null
      },
      idTamanoEliminar: 0,
      updTamanoProducto: null,
      errorModal: false,
      modalUpdTamano: false,
      confirmEliminar: false
    }
  },
  mounted () {
    this.listarCategorias(this.$axios)
    this.listarTamanos(this.$axios)
    this.listarProductos(this.$axios)
  },
  computed: {
    ...mapState('categorias', ['categorias', 'loadingCategorias']),
    ...mapState('tamanos', ['tamanos'])
  },
  methods: {
    ...mapActions('categorias', ['listarCategorias']),
    ...mapActions('tamanos', ['listarTamanos']),
    ...mapActions('tamanoProductos', ['registrarTamanoProducto']),
    ...mapActions('productos', ['listarProductos', 'registrarProducto']),
    img_selected (file) {
      this.nuevoProdImg = URL.createObjectURL(file)
    },
    img_selected_pres (file) {
      this.nuevoTamano.imgNueva = URL.createObjectURL(file)
    },
    qutarImgNuevoProd () {
      this.nuevoProducto.img = null
      this.nuevoProdImg = null
    },
    qutarImgNuevaPres () {
      this.nuevoTamano.img = null
      this.nuevoTamano.imgNueva = null
    },
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
      if (this.nuevoProducto.tamanos.find(e => e.id === this.nuevoTamano.tamano.id)) {
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
        id: this.nuevoTamano.tamano.id,
        nombre: this.nuevoTamano.tamano.nombre,
        precio: this.nuevoTamano.precio,
        stock: this.nuevoTamano.stock,
        img: this.nuevoTamano.img,
        imgNueva: this.nuevoTamano.imgNueva
      }
      this.nuevoProducto.tamanos.push(tamano)
      this.nuevoTamano = {
        tamano: '',
        precio: 0,
        stock: 0,
        img: null,
        imgNueva: null
      }
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
      if (this.nuevoProducto.tamanos.find(e => e.id === this.nuevoTamano.tamano.id)) {
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
        id: this.nuevoTamano.tamano.id,
        nombre: this.nuevoTamano.tamano.nombre,
        precio: this.nuevoTamano.precio,
        stock: this.nuevoTamano.stock
      }
      this.nuevoProducto.tamanos.push(tamano)
    },
    verConfirmEliminar (id) {
      this.idTamanoEliminar = id
      this.confirmEliminar = true
    },
    removeTamano () {
      this.nuevoProducto.tamanos = this.nuevoProducto.tamanos.filter(e => e.id !== this.idTamanoEliminar)
    },
    limpiarNuevoProducto () {
      this.nuevoProducto = {
        categoria: '',
        nombre: '',
        descripcion: '',
        url_img: '',
        precioTamano: 0,
        stockTamano: 0,
        tamanoProducto: '',
        tamanos: []
      }
      this.nuevoProdImg = null
    },
    validarNuevoProducto () {
      let val = true
      this.$refs.nCategoria.validate()
      this.$refs.nNombre.validate()

      if (this.$refs.nNombre.hasError || this.$refs.nCategoria.hasError) {
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
          img: this.nuevoProducto.img
        }

        this.loading = true

        this.registrarProducto({ axios: this.$axios, producto: prod })
          .then(res => {
            this.loading = false
            if (this.nuevoProducto.tamanos.length !== 0) {
              this.registrarPresentaciones(res.data.data.id)
            }
            this.limpiarNuevoProducto()
            this.listarProductos(this.$axios)

            this.$q.notify({
              type: 'positive',
              message: 'Se registró con éxito',
              position: 'center',
              actions: [
                { label: 'X', color: 'white', handler: () => { } }
              ]
            })
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
    intentarEliminar () {
      this.confirmEliminar = true
    },
    registrarPresentaciones (id) {
      const peticiones = []
      this.nuevoProducto.tamanos.forEach(e => {
        const pres = {
          id_tamano: e.id,
          id_producto: id,
          precio: e.precio,
          stock: e.stock,
          url_imagen: e.img
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
          console.log(err)
          this.$q.notify({
            type: 'negative',
            message: 'Hubieron errores durante el registro de las Presentaciones del Producto',
            position: 'center',
            actions: [
              { label: 'X', color: 'white', handler: () => { } }
            ]
          })
          /* err.forEach(item => {
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
          }) */
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
          this.updProducto = null
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
  }
}
</script>

<style lang="scss">
.nueva-cat-body {
    display: grid;
    grid-template-columns: 200px auto;
    column-gap: 1rem;
    row-gap: .5rem;
    margin-top: .5rem;
  }

  .img-preview {
    display: grid;
    grid-template-columns: auto;
    align-items: center;
    justify-items: center;
  }

  @media (max-width: $breakpoint-xs-max) {
  .nueva-cat-body {
    grid-template-columns: auto;
    grid-template-rows: 200px auto;
  }
}

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
