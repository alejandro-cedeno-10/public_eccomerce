<template>
  <q-page class="column dark full-heigth bg-primary">
    <div class="productos">
      <!-- <q-card @click="navTo(producto.id)" class="cursor-pointer shadow-12" v-for="producto in productos" :key="producto.id">
        <img v-if="producto.url_imagen" v-bind:src="apiUrl + '/images/productos/' + producto.url_imagen">
        <img v-else src="https://cdn.quasar.dev/img/mountains.jpg">
        <q-card-section>
          <div class="text-h6"> {{producto.nombre}} </div>
          <div> {{producto.descripcion}} </div>
        </q-card-section>
      </q-card> -->
      <q-card v-for="item in productos" :key="item.id" class="shadow-4 cursor-pointer">
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
  </q-page>
</template>

<script>
import { mapActions } from 'vuex'
// import productos from '../store/productos'
// import AddProducto from '../components/AddProducto'

export default {
  name: 'ProductosDe',
  components: {
    // AddProducto
  }, /*
  params: {
    idCat: 'number'
  }, */
  data () {
    return {
      splitterWidth: 40,
      addProducto: false,
      categoria: null,
      productos: [],
      tamanosProd: [],
      apiUrl: process.env.API_URL
    }
  },
  mounted () {
    this.productosDeCategoria({ axios: this.$axios, id: this.$route.params.categoria })
      .then(res => {
        this.categoria = res.data.Categoria
        this.productos = res.data.Productos
      })
  },
  methods: {
    ...mapActions('productos', ['listarProductos', 'productosDeCategoria']),
    ...mapActions('tamanoProductos', ['getTamanosDe']),
    ...mapActions('tamanos', ['listarTamanos']),
    ...mapActions('cart', ['addCompra']),
    verProducto (id) {
      this.$router.push({ path: '/producto/' + id })
    },
    navTo (idCategoria) {
      this.$router.push('productos_de/' + idCategoria)
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

<style lang="scss">
  .productos {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px,200px));
    padding: 1rem;
    gap:1rem;
  }

</style>
