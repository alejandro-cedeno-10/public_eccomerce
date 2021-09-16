<template>
  <div>
    <div class="row q-pa-sm items-center">
      <q-avatar size="55px" class="q-mb-sm">
        <q-img :ratio="1" v-bind:src="apiUrl + '/images/categorias/' + categoria.url_imagen"/>
      </q-avatar>
      <div class="text-h5 text-left text-bold q-ml-sm"> {{categoria.nombre}} </div>
    </div>
    <div v-if="productos.length === 0" class="full-height">
      <div v-if="loading">
        aqui va el esqueleton
      </div>
      <div v-else class="row justify-center items-center q-mb-md">
        <q-icon name="far fa-frown" color="primary" size="24px"/>
        <div class="text-primary q-ml-sm">
          No existen Productos Registrados
        </div>
      </div>
    </div>
    <q-virtual-scroll
      v-if="productos"
      :items="productos"
      virtual-scroll-horizontal
      style="max-width:100vw"
    >
      <template v-slot="{ item }">
        <div class="prod q-ma-sm">
          <q-card class="shadow-4 cursor-pointer">
            <q-img @click="verProducto(item.id)" :ratio="1" v-bind:src="apiUrl + '/images/productos/' + item.url_imagen"/>
            <q-card-section>
              <q-btn
                dense
                rounded
                color="positive"
                icon="fas fa-cart-plus"
                class="absolute q-pa-sm"
                style="top: 0; right: 0; transform: translateY(-50%); font-size: 12px;"
                @click="getTamanos(item.id)"
              >
                <q-menu fit>
                  <q-list style="min-width: 100px">
                    <q-item v-for="(tam, i) in tamanosProd" @click="addToCart(item, tam)" v-bind:key="i" clickable v-close-popup>
                      <q-item-section> {{tam.Tamano}} </q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
              <div class="text-bold" @click="verProducto(item.id)">
                {{item.nombre}}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </q-virtual-scroll>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'SliderCategoria',
  props: {
    categoria: Object
  },
  data () {
    return {
      productos: [],
      loading: true,
      tamanosProd: [],
      apiUrl: process.env.API_URL
    }
  },
  mounted () {
    this.productosDeCategoria({ axios: this.$axios, id: this.categoria.id })
      .then((res) => {
        this.loading = false
        this.productos = []
        if (res.data.Productos) {
          const totalProd = res.data.Productos.length
          if (totalProd === 1) {
            res.data.Productos[0].nextProducto = res.data.Productos[0].id
            res.data.Productos[0].lastProducto = res.data.Productos[0].id
            this.productos.push(res.data.Productos[0])
          } else {
            res.data.Productos.forEach((e, i) => {
              if (i + 1 < totalProd) {
                e.nextProducto = res.data.Productos[i + 1].id
              }
              if (i > 0) {
                e.lastProducto = res.data.Productos[i - 1].id
              }
              if (i === 0 && totalProd > 1) {
                e.lastProducto = res.data.Productos[totalProd - 1].id
              }
              if (i === totalProd - 1 && totalProd > 1) {
                e.nextProducto = res.data.Productos[0].id
              }
              this.productos.push(e)
            })
          }
        }
      })
      .catch(err => {
        this.loading = false
        console.log(err)
      })
  },
  computed: {
    ...mapState('productos', ['productoSeleccionado', 'productosSeleccionados'])
  },
  methods: {
    ...mapActions('productos', ['productosDeCategoria', 'setProductoSeleccionado', 'setProductosSeleccionados']),
    ...mapActions('tamanoProductos', ['getTamanosDe']),
    ...mapActions('cart', ['addCompra']),
    verProducto (id) {
      console.log(this.productos)
      this.setProductoSeleccionado(this.productos.find(e => e.id === id))
      this.setProductosSeleccionados(this.productos)
      this.$router.push({ path: '/producto/' + id })
    },
    getTamanos (id) {
      this.getTamanosDe({ axios: this.$axios, id: id })
        .then(res => {
          if (!res.data.message) {
            this.tamanosProd = res.data.Tamanos_disponibles
          }
        })
    },
    addToCart (producto, presentacion) {
      const productoCart = {
        id_producto: producto.id,
        id_presentacion: presentacion.Id_tamano,
        nombre: producto.nombre,
        descripcion: producto.descripcion,
        presentacion: presentacion.Tamano,
        precio: presentacion.Precio,
        img: presentacion.Url_imagen
      }
      this.addCompra({ prod: productoCart, cant: 1 })
      this.$q.notify({
        type: 'positive',
        message: 'Producto Añadido',
        position: 'center',
        actions: [
          { label: 'X', color: 'white', handler: () => { } }
        ]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.prod {
  display: block;
  min-width: 8rem;
  min-height: 12rem;
  max-width: 8rem;
  max-height: 12rem;
}
</style>
