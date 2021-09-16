<template>
  <q-page class="column dark">
    <div class="column bg-primary ">
      <div class="col-xs-12 q-ma-md">
        <q-input rounded standout dark color="white" type="text" placeholder="¿Qué deseas Hoy?">
          <template v-slot:append>
            <!-- <q-icon name="search" /> -->
            <q-btn rounded color="primary" icon="search"/>
          </template>
        </q-input>
      </div>
      <!-- <div class="col-xs-12 q-ma-md flex justify-center">
        <q-btn color="primary" icon-right="search" label="Buscar"/>
      </div> -->
    </div>
    <div class="row full-height text-center">
      <div class="categorias">
        <q-card class="cursor-pointer shadow-12" v-for="categoria in categorias" :key="categoria.id" @click="navTo(categoria.id)">
          <img src="https://cdn.quasar.dev/img/mountains.jpg">
          <q-card-section>
            <div class="text-h6"> {{categoria.nombre}} </div>
            <div> {{categoria.descripcion}} </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Categorias',
  data () {
    return {
      //
    }
  },
  mounted () {
    this.listarCategorias(this.$axios)
  },
  computed: {
    ...mapState('categorias', ['categorias'])
  },
  methods: {
    ...mapActions('categorias', ['listarCategorias']),
    navTo: function (id) {
      this.$router.push('productos_de/' + id)
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
