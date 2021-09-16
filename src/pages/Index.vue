<template>
  <q-page class="column dark full-height">
    <div v-if="$q.screen.width>=800" class="bg-primary row justify-between opciones-top">
      <div>
        <q-btn
          v-if="!buscando"
          class="q-ma-sm"
          rounded
          dense
          icon="search"
          @click="buscando = true"
          v-bind:class="{ 'bg-dark text-white' : $q.dark.isActive, 'bg-white text-dark' : !$q.dark.isActive}"
        />
        <q-btn
          v-else
          class="q-ma-sm"
          rounded
          dense
          icon="clear"
          @click="buscando = false"
          v-bind:class="{ 'bg-dark text-white' : $q.dark.isActive, 'bg-white text-dark' : !$q.dark.isActive}"
        />
      </div>
      <div v-if="buscando" class="col-8 q-pb-sm q-pl-md q-pr-md">
        <q-input rounded dense standout dark color="white" type="text" placeholder="¿Qué deseas Hoy?">
          <template v-slot:append>
            <q-btn rounded dense color="primary" icon="search"/>
          </template>
        </q-input>
      </div>
      <q-tabs
        v-if="!buscando"
        v-model="tab"
        inline-label
        align="justify"
        :active-bg-color="!$q.dark.isActive ? 'white' : 'dark'"
        :active-color="$q.dark.isActive ? 'white' : 'dark'"
        indicator-color="transparent"
        active
        class="bg-primary text-white"
        style="min-height:50px"
      >
        <q-tab name="productos" label="Productos" />
        <q-tab name="categorias" label="Categorías" />
        <!-- <q-tab name="combos" label="Combos" />
        <q-tab name="nosotros" label="Nosotros" /> -->
      </q-tabs>
      <div>
        <q-btn
          rounded
          fab
          color="positive"
          style="bottom: 0; right: 10px; transform: translateY(50%); font-size: 12px; z-index:1000 !important;"
          icon="fas fa-shopping-cart"
          @click="$router.push({ path: '/mi_compra'})"
        >
          <q-badge v-if="productos.length > 0" color="red" floating> {{productos.length}} </q-badge>
        </q-btn>
      </div>
    </div>
    <div v-if="$q.screen.width <= 800" class="row justify-end">
      <q-icon
        dense
        size="24px"
        color="white"
        style="position: fixed; top: .9rem; right: 4rem; z-index:8000 !important;"
        @click="buscando = true"
        name="search"/>
    </div>

    <q-tab-panels v-model="tab" class="paneles">
      <q-tab-panel class="q-pa-none full-height" name="productos">
        <div class="column text-center">
          <div v-if="categorias.length === 0">
            <div v-if="loadingCategorias">
              <q-spinner-tail color="primary" size="5rem"/>
            </div>
            <div v-else class="no-categorias">
              <div class="text-h3 text-primary">
                No existen Categorias Registradas
              </div>
              <div><q-icon name="far fa-frown" color="primary" size="8rem"/></div>
            </div>
          </div>
          <div v-for="categoria in categorias" :key="categoria.id">
            <SliderCategoria :categoria="categoria"/>
          </div>
        </div>
      </q-tab-panel>

      <q-tab-panel name="categorias" class="full-height">
        <div class="text-h4 text-center text-bold" v-if="$q.screen.width <= 800">Categorías</div>
        <div class="categorias-gallery">
          <q-card @click="navTo(item.id)" v-for="item in categorias" :key="item.id" class="shadow-4 cursor-pointer">
            <q-img :ratio="1" v-bind:src="apiUrl + '/images/categorias/' + item.url_imagen"/>
            <q-card-section>
              <div class="text-bold">
                {{item.nombre}}
              </div>
            </q-card-section>
          </q-card>
        </div>
      </q-tab-panel>

      <q-tab-panel class="q-pa-none" name="combos">
        <div class="text-h4 text-center text-bold">Combos</div>
        {{combos}}
        <!-- <div class="categorias-gallery">
          <q-card @click="navTo(item.id)" v-for="item in categorias" :key="item.id" class="shadow-4 cursor-pointer">
            <q-img :ratio="1" v-bind:src="apiUrl + '/images/categorias/' + item.url_imagen"/>
            <q-card-section>
              <div class="text-bold">
                {{item.nombre}}
              </div>
            </q-card-section>
          </q-card>
        </div> -->
      </q-tab-panel>

      <q-tab-panel class="q-pa-none" name="nosotros">
        <div class="text-h6">Movies</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>
    </q-tab-panels>

    <q-dialog v-if="$q.screen.width <= 800" v-model="buscando">
      <q-card>
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Menú</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-actions>
          <q-list>
            <q-input
              class="q-ma-xs"
              rounded
              :standout="$q.dark.isActive? 'bg-grey-10 text-white': 'bg-grey-1'"
              :input-class="$q.dark.isActive? 'text-white': 'text-black'"
              type="text"
              label="¿Qué deseas Hoy?">
              <template v-slot:append>
                <q-btn rounded color="primary" icon="search"/>
              </template>
            </q-input>
            <q-item clickable v-ripple @click="selectOpt('productos')">
              <q-item-section class="text-h6">Productos</q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="selectOpt('categorias')">
              <q-item-section class="text-h6">Categorías</q-item-section>
            </q-item>
            <!-- <q-item clickable v-ripple @click="selectOpt('combos')">
              <q-item-section class="text-h6">Combos</q-item-section>
            </q-item>
            <q-item clickable v-ripple @click="selectOpt('nosotros')">
              <q-item-section class="text-h6">Nosotros</q-item-section>
            </q-item> -->
          </q-list>
        </q-card-actions>
      </q-card>
    </q-dialog>
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
      loadingCategorias: true,
      buscando: false,
      tab: 'productos',
      apiUrl: process.env.API_URL
    }
  },
  mounted () {
    // this.getCombos(this.$axios)
    this.listarCategorias(this.$axios)
      .then(e => {
        this.loadingCategorias = false
        /* this.categorias.forEach(e => {
          this.productosDeCategoria({ axios: this.$axios, id: e.id })
            .then((res) => {
              // console.log(res)
              // this.productos[e.id] = res.data.Productos
              this.productos.push({ id: e.id, productos: res.data.Productos })
              console.log(this.productos)
            })
            .catch(err => {
              this.loadingCategorias = false
              console.log(err)
            })
        }) */
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
    ...mapState('categorias', ['categorias']),
    ...mapState('cart', ['productos']),
    ...mapState('productos', ['combos'])
  },
  methods: {
    ...mapActions('categorias', ['listarCategorias']),
    ...mapActions('productos', ['productosDeCategoria']),
    // ...mapActions('productos', ['getCombos']),
    navTo (idCategoria) {
      this.$router.push('productos_de/' + idCategoria)
    },
    selectOpt (opt) {
      this.tab = opt
      this.buscando = false
    }
  }
}
</script>

<style lang="scss" scoped>
  /* .q-tab--active{
    border-radius: 1rem 1rem 0 0
  } */
  .opciones-top {
    position: fixed;
    top: 50px;
    width: calc(100vw - 55px);
    z-index: 5000;
  }

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

  .categorias-gallery{
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 200px));
    padding: 1rem;
    gap:1rem;
  }

  .no-categorias{
    display: grid;
    grid-template-columns: auto;
    padding: 2rem;
    gap:1rem;
    align-content: center;
    justify-content: center;
    align-items: center;
    min-width: 100%;
  }

  .paneles {
    background-color: transparent;
    min-height: calc(100vh - 106px);
    margin-top:56px;
  }

  @media (max-width: 800px) {
    .paneles {
      margin-top: 0
    }
  }
</style>
