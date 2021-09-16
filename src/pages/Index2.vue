<template>
  <q-page class="column dark">
    <div class="column bg-primary ">
      <div class="col-xs-12 q-ma-md">
        <q-input rounded standout dark color="white" type="text" placeholder="¿Qué deseas Hoy?">
          <template v-slot:append>
            <q-btn rounded color="primary" icon="search"/>
          </template>
        </q-input>
      </div>
    </div>
    <div class="column full-height text-center">
      <div v-for="categoria in categorias" :key="categoria.id">
        <SliderCategoria :categoria="categoria"/>
        <!-- <q-virtual-scroll
          v-if="productos[categoria.id]"
          :items="productos[categoria.id]"
          virtual-scroll-horizontal
        >
          <template v-slot="{ item, index }">
            <q-card class="shadow-12 cursor-pointer" @click="verProducto(item.id)">
              <q-img aspect-ratio="10/2" src="https://cdn.quasar.dev/img/mountains.jpg">
                <div class="absolute-bottom text-h5 text-bold text-center">
                  {{item.nombre}} {{index}}
                </div>
              </q-img>
            </q-card>
          </template>
        </q-virtual-scroll> -->
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SliderCategoria from '../components/categoria/SliderCategoria'

export default {
  name: 'PageIndex',
  components: {
    SliderCategoria
  },
  data () {
    return {
      productos: []
    }
  },
  mounted () {
    this.listarCategorias(this.$axios)
      .then(e => {
        this.categorias.forEach(e => {
          this.productosDeCategoria({ axios: this.$axios, id: e.id })
            .then((res) => {
              // console.log(res)
              // this.productos[e.id] = res.data.Productos
              this.productos.push({ id: e.id, productos: res.data.Productos })
              console.log(this.productos)
            })
            .catch(err => {
              console.log(err)
            })
        })
      })

    /* this.listarCategorias(this.$axios)
      .then(e => {
        const peticiones = []
        this.categorias.forEach(e => {
          peticiones.push(this.productosDeCategoria({ axios: this.$axios, id: e.id }))
        })

        Promise.all(peticiones)
          .then((res) => {
            //
          })
          .catch(err => {
            console.log(err)
          })
      }) */
  },
  computed: {
    ...mapState('categorias', ['categorias'])
  },
  methods: {
    ...mapActions('categorias', ['listarCategorias']),
    ...mapActions('productos', ['productosDeCategoria']),
    verProducto (id) {
      this.$router.push({ path: '/producto/' + id })
    }
  }
}
</script>

<style lang="scss" scoped>
  .busqueda{
    min-height: 13rem;
    max-height: 13rem;
    width: 100vw;
    border-radius: 0 0 50% 50%;
  }

  .categorias{
    display: grid;
    grid-template-columns: 48% 48%;
    padding: 1rem;
    gap:1rem;
    justify-content: space-around;
  }
</style>
