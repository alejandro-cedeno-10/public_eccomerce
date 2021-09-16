<template>
  <q-page class="dark-page flex justify-center full-heigth">
    <q-card class="producto shadow-4" v-if="producto">
      <!-- <q-btn color="primary q-mb-sm" icon="arrow_back" @click="$router.go(-1)" flat dense/> -->
      <div>
        <q-img v-if="presentacionSeleccionada && presentacionSeleccionada.Url_imagen != null" :ratio="1" v-bind:src="apiUrl + '/images/tamano_productos/' + presentacionSeleccionada.Url_imagen"/>
        <q-img v-else :ratio="1" v-bind:src="apiUrl + '/images/productos/' + producto.url_imagen"/>
        <div style="min-width: 100%" v-if="productosSeleccionados.length > 1">
          <q-icon
            rounded
            color="black"
            class="btn-move cursor-pointer"
            style="left: 0;"
            name="fas fa-chevron-left"
            @click="goLast"
          />
          <q-icon
            rounded
            color="black"
            class="btn-move cursor-pointer"
            style="right: 0;"
            name="fas fa-chevron-right"
            @click="goNext"
          />
        </div>
        <q-card-section>
          <div class="text-h4 text-bold"> {{producto.nombre}} </div>
          <div class="text-subtitle2">{{producto.descripcion}}</div>
        </q-card-section>
        <q-card-section v-if="presentaciones.length != 0">
          <div class="flex justify-between items-center">
            <div class="col-xs-3 text-h4 text-bold text-center"> $ {{(presentacionSeleccionada.Precio).toFixed(2)}} </div>
            <q-select
              class="col-xs-9 text-h6"
              style="min-width:12rem"
              v-model="presentacionSeleccionada"
              :options="presentaciones"
              option-label="Tamano"
              filled
            />
          </div>
        </q-card-section>
        <q-card-section v-else>
          <q-card class="bg-red-5 text-white">
            <div class=" q-pa-sm row justify-between items-center">
              <q-icon class="col-xs-2" name="error" size="xl"/>
              <div class="col-xs-10 q-pl-sm text-h6">Este producto aún no tiene presentaciones disponibles</div>
            </div>
          </q-card>
        </q-card-section>
      </div>
      <q-card-actions class="q-pa-xs q-pb-sm flex justify-around items-center">
        <!-- <q-btn color="primary" icon="fas fa-arrow-left" @click="$router.go(-1)" flat dense/> -->
        <q-btn color="primary" icon="fas fa-arrow-left" @click="$router.push('/')" flat dense/>
        <q-separator inset vertical/>
        <q-chip
          v-if="presentacionSeleccionada"
          square
          class="text-h6"
        >
          $ {{ (presentacionSeleccionada.Precio * cantidad).toFixed(2) }}
        </q-chip>
        <q-input
          v-model.number="cantidad"
          input-class="text-h6 text-center"
          type="number"
          mask="##"
          style="max-width:8rem"
          borderless
          :disable="!presentacionSeleccionada"
        >
          <template v-slot:prepend>
            <q-btn color="primary" icon="chevron_left" flat dense @click="menosCant"/>
          </template>
          <template v-slot:append>
            <q-btn color="primary" icon="chevron_right" flat dense @click="masCant"/>
          </template>
        </q-input>
        <q-btn
          :disable="!presentacionSeleccionada || cantidad == 0"
          flat
          color="primary"
          icon-right="fas fa-cart-plus"
          @click="addToCart"
        />
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'ProductosDe',
  data () {
    return {
      splitterWidth: 40,
      addProducto: false,
      producto: null,
      presentaciones: [],
      presentacionSeleccionada: null,
      cantidad: 0,
      apiUrl: process.env.API_URL
    }
  },
  mounted () {
    this.initialize()
  },
  computed: {
    ...mapState('productos', ['productoSeleccionado', 'productosSeleccionados'])
  },
  methods: {
    initialize () {
      this.getProducto({ axios: this.$axios, id: this.$route.params.id_producto })
        .then(res => {
          this.producto = res.data[0]
          this.getTamanosDe({ axios: this.$axios, id: this.$route.params.id_producto })
            .then(res => {
              if (res.data.message !== null) {
                this.presentaciones = res.data.Tamanos_disponibles
                this.presentacionSeleccionada = res.data.Tamanos_disponibles[0]
              }
              this.productosDeCategoria({ axios: this.$axios, id: res.data.Producto.id_categoria })
                .then((res2) => {
                  const productos = []
                  if (res2.data.Productos) {
                    const totalProd = res2.data.Productos.length
                    if (totalProd === 1) {
                      res2.data.Productos[0].nextProducto = res2.data.Productos[0].id
                      res2.data.Productos[0].lastProducto = res2.data.Productos[0].id
                      productos.push(res2.data.Productos[0])
                    } else {
                      res2.data.Productos.forEach((e, i) => {
                        if (i + 1 < totalProd) {
                          e.nextProducto = res2.data.Productos[i + 1].id
                        }
                        if (i > 0) {
                          e.lastProducto = res2.data.Productos[i - 1].id
                        }
                        if (i === 0 && totalProd > 1) {
                          e.lastProducto = res2.data.Productos[totalProd - 1].id
                        }
                        if (i === totalProd - 1 && totalProd > 1) {
                          e.nextProducto = res2.data.Productos[0].id
                        }
                        productos.push(e)
                      })
                    }
                  }
                  this.setProductosSeleccionados(productos)
                  this.setProductoSeleccionado(productos.find(e => e.id === parseInt(this.$route.params.id_producto)))
                })
                .catch(err => {
                  this.loading = false
                  console.log(err)
                })
            })
        })
    },
    ...mapActions('tamanoProductos', ['getTamanosDe']),
    ...mapActions('productos', ['productosDeCategoria', 'getProducto', 'setProductoSeleccionado', 'setProductosSeleccionados']),
    ...mapActions('cart', ['addCompra']),
    goNext () {
      this.$router.push('/producto/' + this.productoSeleccionado.nextProducto)
      this.initialize()
    },
    goLast () {
      this.$router.push('/producto/' + this.productoSeleccionado.lastProducto)
      this.initialize()
    },
    masCant () {
      /* if (parseInt(this.cantidad.trim()) > 99) {
        this.cantidad = parseInt(this.cantidad.trim()) + 1
      } */
      if (this.cantidad < 99) {
        this.cantidad++
      }
    },
    menosCant () {
      /* if (!parseInt(this.cantidad.trim()) < 0) {
        this.cantidad = parseInt(this.cantidad.trim()) - 1
      } */
      if (this.cantidad > 0) {
        this.cantidad--
      }
    },
    addToCart () {
      if (this.cantidad <= 0) {
        this.$q.notify({
          type: 'negative',
          message: 'No haz especificado una cantidad',
          position: 'bottom',
          actions: [
            { label: 'X', color: 'white', handler: () => { } }
          ]
        })
        return
      }
      const productoCart = {
        id_producto: this.producto.id,
        id_presentacion: this.presentacionSeleccionada.Id_tamano,
        nombre: this.producto.nombre,
        descripcion: this.producto.descripcion,
        presentacion: this.presentacionSeleccionada.Tamano,
        precio: this.presentacionSeleccionada.Precio,
        img: this.presentacionSeleccionada.Url_imagen
      }
      this.addCompra({ prod: productoCart, cant: this.cantidad })
      this.$q.notify({
        type: 'positive',
        message: 'Producto Añadido',
        position: 'center',
        actions: [
          { label: 'X', color: 'white', handler: () => { } }
        ]
      })
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scopped>
.dark-page{
  background-color: rgb(18, 18, 18);
}

.producto {
  /* margin-bottom: 4rem; */
  min-width: 100vw;
  /* min-height: 100vh; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.producto .q-img {
  max-height: 55vh !important;
}

  /* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
}

.btn-move {
  position: absolute;
  transform: translateY(-50%);
  font-size: 16px;
  z-index:1000 !important;
  background-color: rgba(255, 255, 255, 0.4);
  border-radius: 50%;
  font-size: 1.5rem;
  padding: 1.5rem;
}

.btn-move:hover {
  background-color: rgba(255, 255, 255, 0.5);
}

@media (min-width: $breakpoint-md-min) {
  .producto {
    min-width: 500px;
    max-width: 500px;
  }
}
</style>
