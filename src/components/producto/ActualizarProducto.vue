<template>
  <div class="bg-white" style="width: 700px; max-width: 90vw;">
    <q-card v-if="updProducto">
      <q-card-section>
        <div class="flex justify-between">
          <div class="text-h6">Actualizar Producto</div>
          <q-btn color="positive" icon="save" @click="actualizar"/>
        </div>
        <div class="nueva-cat-body">
          <q-file
            style="display:none"
            filled
            ref="imgAc"
            bg-color="primary"
            label-color="white"
            color="white"
            v-model="updProducto.imgNueva"
            @input="img_selected"
            counter
            label="Imagen de la Categoria"
            accept=".jpg, .png, image/*"
          />
          <q-img
            v-if="nuevoProdImg"
            :src="nuevoProdImg"
            :ratio="1"
            spinner-color="primary"
            spinner-size="36px"
            @click="$refs['imgAc'].pickFiles()"
            class="shadow-4 cursor-pointer"
          >
            <div class="absolute-bottom text-subtittle flex justify-between">
              ( {{ (updProducto.imgNueva.size/1024).toFixed(2) }} ) KB
              <q-icon name="fas fa-times" size="20px" @click.stop.prevent="quitarImgNuevoProd"/>
            </div>
          </q-img>
          <q-img
            v-else-if="updProducto.img"
            :src="apiUrl + '/images/productos/' + updProducto.img"
            :ratio="1"
            spinner-color="primary"
            spinner-size="36px"
            @click="$refs['imgAc'].pickFiles()"
            class="shadow-4 cursor-pointer"
          >
            <div class="absolute-bottom text-bold text-h6 flex justify-between">
              Cambiar
              <q-icon name="fas fa-upload" size="20px"/>
            </div>
          </q-img>
          <q-card v-else @click="$refs['imgAc'].pickFiles()" rounded class="bg-primary img-preview cursor-pointer">
            <q-icon name="fas fa-upload" color="white" style="font-size: 6rem;"/>
          </q-card>
          <div>
            <q-select
              disable
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
              class="q-pl-md"
              ref="aNombre"
              v-model="updProducto.nombre"
              :rules="[ val => val && val.length > 0 || 'No debe estar vacío']"
              lazy-rules="ondemand"
              type="text"
              label="Nombre"/>
            <q-input
              class="q-pl-md"
              ref="aDescripcion"
              v-model="updProducto.descripcion"
              type="text"
              label="Descripción"/>
          </div>
        </div>
        <q-expansion-item
          class="q-mt-sm"
          expand-separator
          icon="view_carousel"
          label="Presentaciones"
          header-class="text-bold text-h6"
        >
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
                ref="uTamanoProducto"
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
                  ref="uPrecioTamano"
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
                  ref="uStockTamano"
                  v-model.number="nuevoTamano.stock"
                  :rules="[ val => val && val.length > 0 || 'No debe estar vacío']"
                  lazy-rules="ondemand"
                  input-class="text-right"
                  type="number"
                  filled
                  label="Stock"/>
                <q-btn dense color="primary" icon="add" @click="addTamano"/>
              </div>
            </div>
          </div>
          <q-list class="q-mt-md" bordered>
            <q-item v-for="(tam, index) in updProducto.tamanos" v-bind:key="index" v-ripple>
              <q-item-section avatar>
                <q-img
                  v-if="tam.Url_imagen"
                  :src="apiUrl + '/images/tamano_productos/' + tam.Url_imagen"
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
                  <div class="text-bold">{{tam.Tamano}}</div>
                  <div>
                    {{tam.Stock ? tam.Stock : 0}} x <b>$ {{tam.Precio}}</b>
                  </div>
                </div>
              </q-item-section>
              <q-item-section side>
                <div class="btns-opc-tamano">
                  <q-btn flat dense color="primary" icon="edit" @click="verUpdateTamano(tam.Id_tamano)"/>
                  <q-btn flat dense color="red" icon="delete" @click="verConfirmEliminar(tam.Id_tamano)"/>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>
      </q-card-section>
    </q-card>

    <q-dialog v-model="modalUpdTamano">
      <q-card class="q-pa-sm">
        <div class="flex justify-between">
          <div class="text-h6">Modificar Presentación</div>
          <q-btn color="positive" icon="save" @click="updateTamano"/>
        </div>
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
          <div v-if="updTamanoProducto">
            <div class="text-bold q-pb-sm">
              {{ updTamanoProducto.nombre }}
            </div>
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
              :rules="[ val => val || 'No debe estar vacío']"
              lazy-rules="ondemand"
              input-class="text-right"
              v-model.number="updTamanoProducto.stock"
              type="number"
              filled
              label="Stock"/>
          </div>
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
  name: 'ActualizarProducto',
  props: {
    updProducto: Object
  },
  data () {
    return {
      loading: false,
      nuevoTamano: {
        tamano: '',
        precio: 0,
        stock: 0,
        img: null,
        imgNueva: null
      },
      apiUrl: process.env.API_URL,
      nuevoProdImg: null,
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
    ...mapActions('tamanoProductos', [
      'getTamanosDe',
      'registrarTamanoProducto',
      'actualizarTamanoProducto',
      'eliminarTamanoProducto'
    ]),
    ...mapActions('productos', ['listarProductos', 'actualizarProducto']),
    img_selected (file) {
      this.nuevoProdImg = URL.createObjectURL(file)
    },
    img_selected_pres (file) {
      this.nuevoTamano.imgNueva = URL.createObjectURL(file)
    },
    qutarImgNuevaPres () {
      this.nuevoTamano.img = null
      this.nuevoTamano.imgNueva = null
    },
    quitarImgNuevoProd () {
      this.updProducto.imgNueva = null
      this.nuevoProdImg = null
    },
    validarNuevoTamano () {
      let flag = true
      this.$refs.uPrecioTamano.validate()
      this.$refs.uTamanoProducto.validate()

      if (this.$refs.uPrecioTamano.hasError || this.$refs.uTamanoProducto.hasError) {
        flag = false
      }
      return flag
    },
    validarUpdTamano () {
      let flag = true
      this.$refs.nuPrecioTamano.validate()
      this.$refs.nuStockTamano.validate()

      if (this.$refs.nuPrecioTamano.hasError || this.$refs.nuStockTamano.hasError) {
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
      if (this.updProducto.tamanos.find(e => e.id === this.updProducto.tamanoProducto.id).length > 0) {
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
        id_producto: this.updProducto.id,
        id_tamano: this.nuevoTamano.tamano.id,
        precio: this.nuevoTamano.precio,
        stock: this.nuevoTamano.stock,
        url_imagen: this.nuevoTamano.img
      }
      this.loading = true
      this.registrarTamanoProducto({ axios: this.$axios, tamanoProducto: pres })
        .then(res => {
          this.loading = false
          this.getTamanosDe({ axios: this.$axios, id: this.updProducto.id })
            .then(res => {
              this.dialogActualizar = true
              this.updProducto.tamanos = res.data.Tamanos_disponibles ? res.data.Tamanos_disponibles : []
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
              console.log(err)
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
    },
    formatDoubleToString (valor) {
      let valorS = valor.toString()
      // if (valorS.length === 1 || valorS.length === 2) {
      if (!valorS.includes('.')) {
        valorS += '.00'
      } else if (valorS.length === 3) {
        if (valorS.includes('.')) {
          valorS += '0'
        }
      }
      return valorS
    },
    verUpdateTamano (id) {
      this.modalUpdTamano = true
      const tamPro = this.updProducto.tamanos.find(e => e.Id_tamano === id)
      const tamProd = {
        id_producto: this.updProducto.id,
        id_tamano: tamPro.Id_tamano,
        nombre: tamPro.Tamano,
        stock: tamPro.Stock,
        precio: this.formatDoubleToString(tamPro.Precio)
      }
      this.updTamanoProducto = tamProd
    },
    cerrarUpdateTamano (id) {
      this.modalUpdTamano = false
      this.updTamanoProducto = null
    },
    updateTamano () {
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
      /* const pres = {
        id_producto: this.updProducto.id,
        id_tamano: this.updProducto.tamanoProducto.id,
        nombre: this.updProducto.tamanoProducto.nombre,
        precio: this.updProducto.precioTamano,
        stock: this.updProducto.stockTamano
      } */
      // this.updProducto.tamanos.push(tamano)
      this.loading = true
      this.actualizarTamanoProducto({ axios: this.$axios, tamanoProducto: this.updTamanoProducto })
        .then(res => {
          this.loading = false
          this.getTamanosDe({ axios: this.$axios, id: this.updProducto.id })
            .then(res => {
              this.$q.notify({
                type: 'positive',
                message: 'Se actualizó con éxito',
                position: 'center',
                actions: [
                  { label: 'X', color: 'white', handler: () => { } }
                ]
              })

              this.updProducto.tamanos = res.data.Tamanos_disponibles ? res.data.Tamanos_disponibles : []
              this.cerrarUpdateTamano()
            })
            .catch(err => {
              console.log(err)
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
    },
    verConfirmEliminar (id) {
      this.idTamanoEliminar = id
      this.confirmEliminar = true
    },
    removeTamano () {
      this.loading = true
      console.log(this.idTamanoEliminar)
      console.log(this.updProducto.id)
      this.eliminarTamanoProducto({ axios: this.$axios, idTamano: this.idTamanoEliminar, idProducto: this.updProducto.id })
        .then(res => {
          this.loading = false
          this.getTamanosDe({ axios: this.$axios, id: this.updProducto.id })
            .then(res => {
              this.$q.notify({
                type: 'positive',
                message: 'Se eliminó con éxito',
                position: 'center',
                actions: [
                  { label: 'X', color: 'white', handler: () => { } }
                ]
              })

              this.updProducto.tamanos = res.data.Tamanos_disponibles ? res.data.Tamanos_disponibles : []
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(err => {
          this.loading = false
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

      if (this.$refs.nNombre.hasError || this.$refs.nCategoria.hasError) {
        val = false
      }
      return val
    },
    closeActualizar () {
      this.$emit('cerrarActualizar')
    },
    actualizar () {
      if (!this.validarUpdProducto()) {
        this.errorModal = true
      } else {
        const prod = {
          id: this.updProducto.id,
          nombre: this.updProducto.nombre,
          descripcion: this.updProducto.descripcion,
          url_img: this.updProducto.url_img
        }
        this.loading = true
        this.actualizarProducto({ axios: this.$axios, producto: prod })
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
            console.log(res)
            this.selected = []
            this.dialogActualizar = false
            this.listarProductos(this.$axios)
            this.closeActualizar()
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
    intentarEliminar () {
      this.confirmEliminar = true
    },
    validarUpdProducto () {
      let val = true
      this.$refs.aNombre.validate()
      this.$refs.aCategoria.validate()

      if (this.$refs.aNombre.hasError || this.$refs.aCategoria.hasError) {
        val = false
      }
      return val
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
      if (this.updProducto.tamanos.find(e => e.Id_tamano === this.nuevoTamano.tamano.id)) {
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
        id_tamano: this.nuevoTamano.tamano.id,
        id_producto: this.updProducto.id,
        precio: this.nuevoTamano.precio,
        stock: this.nuevoTamano.stock,
        img: this.nuevoTamano.img
      }
      this.loading = true
      this.registrarTamanoProducto({ axios: this.$axios, tamanoProducto: pres })
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
          console.log(res)
          this.selected = []
          this.dialogActualizar = false
          this.updProducto = null
          this.listarProductos(this.$axios)
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
