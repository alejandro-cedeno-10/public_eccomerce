<template>
  <q-card class="producto" v-if="producto">
    <!-- <q-btn color="primary q-mb-sm" icon="arrow_back" @click="$router.go(-1)" flat dense/> -->
    <q-img :ratio="1" src="https://cdn.quasar.dev/img/mountains.jpg"/>
    <q-card-section>
      <div class="text-h4 text-bold"> {{producto.nombre}} </div>
      <div class="text-subtitle2">{{producto.descripcion}}</div>
    </q-card-section>
    <q-card-section v-if="presentaciones.length != 0">
      <div class="flex justify-between items-center">
        <div class="col-xs-3 text-h4 text-bold text-center"> $ {{presentacionSeleccionada.Precio}} </div>
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
    <q-card-actions>
      <div class="q-pa-xs flex justify-around items-center">
        <q-btn color="primary" icon="fas fa-arrow-left" @click="$emit('close')" flat dense/>
        <q-separator inset vertical/>
        <q-chip
          v-if="presentacionSeleccionada"
          square
          class="text-h6"
        >
          $ {{presentacionSeleccionada.Precio * cantidad}}
        </q-chip>
        <q-input
          v-model.number="cantidad"
          input-class="text-h6 text-center"
          type="number"
          mask="##"
          style="max-width:7rem"
          borderless
        >
          <template v-slot:prepend>
            <q-btn color="primary" icon="chevron_left" flat dense @click="menosCant"/>
          </template>
          <template v-slot:append>
            <q-btn color="primary" icon="chevron_right" flat dense @click="masCant"/>
          </template>
        </q-input>
        <q-btn flat color="primary" icon-right="fas fa-cart-plus"/>
      </div>
    </q-card-actions>
  </q-card>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'VerProductoCard',
  props: {
    producto: Object
  },
  data () {
    return {
      splitterWidth: 40,
      addProducto: false,
      presentaciones: [],
      presentacionSeleccionada: null,
      cantidad: 0
    }
  },
  mounted () {
    this.getTamanosDe({ axios: this.$axios, id: this.producto.id })
      .then(res => {
        if (!res.data.message) {
          this.presentaciones = res.data.Tamanos_disponibles
          this.presentacionSeleccionada = res.data.Tamanos_disponibles[0]
        }
      })
  },
  computed: {
  },
  methods: {
    ...mapActions('tamanoProductos', ['getTamanosDe']),
    ...mapActions('productos', ['getProducto']),
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
    }
  }
}
</script>

<style lang="scss">
.producto {
  margin-bottom: 10rem;
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
</style>
