<template>
  <q-card>
    <q-card-section>
      <q-img aspect-ratio="16/9" src="https://cdn.quasar.dev/img/mountains.jpg"/>
    </q-card-section>
    <q-card-section>
      <div class="text-h6">Nombre</div>
      <div class="text-subtitle2">Detalles</div>
    </q-card-section>
    <q-card-section>
      <div class="flex around">
        $ precio
        <q-select v-model="model" :options="tamanos" label="Standard" filled />
      </div>
      <div class="flex around">
        <div class="options">
          <q-btn color="primary" icon="remove"/>
          <q-btn color="white" class="text-black" label="cant"/>
          <q-btn color="primary" icon="add"/>
        </div>
        <q-btn color="primary" icon="add"/>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {
  name: 'AddProducto',
  data () {
    return {
      tamanos: [
        'pequeño', 'mediano', 'grande'
      ],
      model: ''
    }
  }
}
</script>
