<template>
  <q-page class="column dark full-heigth">
    <div v-if="!$q.screen.lt.sm" class="row bg-primary justify-center text-center items-center text-white text-h5" style="min-height: 56px;">
      <div>¡Ya casi terminas!, Completa tu orden</div>
    </div>
    <div class="column full-height text-center">
      <div class="compras">
        <div v-if="productos.length == 0">
          <q-icon name="far fa-frown-open" size="64px"/>
          <div class="q-pt-md">
            Aún no tienes ningún pedido, busca nuestros productos <router-link class="cursor-pointer text-bold text-primary" to="/index"><q-btn color="primary" no-caps small label="Aquí"/></router-link>
          </div>
        </div>
        <q-card v-for="(item,index) in productos" :key="index">
          <div class="producto-2">
            <div class="img-producto">
              <q-img
                :src=" apiUrl + '/images/tamano_productos/' + item.img"
                :ratio="1"
                rounded
                class="rounded"
                width="8rem"
              />
            </div>
            <div class="column q-pa-sm text-left">
              <div class="row text-h4 text-bold precio justify-between">
                {{ item.nombre }}
                <q-btn rounded dense flat color="red-4" icon="delete" @click="eliminarProducto(item)"/>
              </div>
              <div class="text-h6"> {{ item.presentacion }} </div>
              <div class="text-h6">$ {{ (item.precio).toFixed(2) }} </div>
            </div>
          </div>
          <div class="options">
            <q-btn color="primary" icon="remove" @click="restSome(item)"/>
            <q-btn color="white" class="text-black" :label="item.cantidad"/>
            <q-btn color="primary" icon="add" @click="addMore(item)"/>
          </div>
        </q-card>
      </div>
    </div>
    <q-footer reveal elevated bordered class="q-pa-sm">
      <div class="row justify-between q-pb-sm text-h5 text-bold">
        <div>Total</div>
        <div>$ {{ (total).toFixed(2) }}</div>
      </div>
      <q-btn class="bg-positive" :disable="productos.length == 0" @click="$router.push('factura')" style="width: 100%; height: 3rem;">
        <div class="text-h6 text-bold">Pagar Ahora</div>
      </q-btn>
    </q-footer>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'PageIndex',
  data () {
    return {
      splitterWidth: 40,
      apiUrl: process.env.API_URL
    }
  },
  computed: {
    ...mapState('cart', ['productos']),
    total () {
      let total = 0
      this.productos.forEach(p => {
        total += p.precio * p.cantidad
      })
      return total
    }
  },
  methods: {
    ...mapActions('cart', ['addCompra', 'restCompra', 'eliminarCompra']),
    addMore (prod) {
      this.addCompra({ prod: prod, cant: 1 })
    },
    restSome (prod) {
      this.restCompra({ prod: prod, cant: 1 })
    },
    eliminarProducto (prod) {
      this.eliminarCompra(prod)
    }
  }
}
</script>

<style lang="scss" scopped>
  .compras{
    padding: 1rem;
    border-radius: 2rem 2rem 0 0;
    display: grid;
    row-gap: 2rem;
    height: 100%;
    padding-bottom: 6rem;
  }

  .producto{
    border-radius: 1.5rem;
    -webkit-box-shadow: 0px 1px 3px 2px rgb(201, 201, 201);
    -moz-box-shadow: 0px 1px 3px 2px rrgb(201, 201, 201);
    box-shadow: 0px 1px 3px 2px rgb(201, 201, 201);
    // display: grid;
  }

  .producto-2{
    border-radius: 1.5rem;
    -webkit-box-shadow: 0px 1px 3px 2px rgb(201, 201, 201);
    -moz-box-shadow: 0px 1px 3px 2px rrgb(201, 201, 201);
    box-shadow: 0px 1px 3px 2px rgb(201, 201, 201);
    display: grid;
    grid-template-columns: 8rem auto;
  }

  .img-producto{
    overflow: hidden;
    /* border-radius: 1.5rem 0 0 1.5rem; */
  }

  .options{
    display: block;
    max-width: 12rem;
    min-width: 12rem;
    position: absolute;
    bottom: -1rem;
    right: 0;
  }

  .precio{
    margin-bottom: 0;
    padding-bottom: 0;
  }

  .confirmar{
    position: fixed;
    bottom: 0;
    width: 100%;
    display: grid;
    padding: .5rem 1rem .5rem 1rem;
    grid-template-columns: 40% auto;
  }
</style>
