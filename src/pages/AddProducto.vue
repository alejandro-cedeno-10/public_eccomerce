<template>
  <q-page class="column dark full-heigth">
    <div class="header-round row justify-center bg-primary text-white text-center text-bold q-pa-sm">
        <q-input rounded standout dark color="white" type="text" placeholder="¿Qué se te antoja comer?">
          <template v-slot:append>
            <q-btn flat rounded class="bg-red-3" icon="search" />
          </template>
        </q-input>
        <q-separator size="6rem" color="transparent"/>
    </div>
    <div class="aditivos text-center bg-white">
      <div class="row items-center justify-around q-pa-xs">
        <div class="cantidad">
          <q-btn dense color="primary" icon="remove"/>
          <q-btn  color="white" class="text-black" label="2"/>
          <q-btn dense color="primary" icon="add"/>
        </div>
        <div class="seccion shadow-4 q-pa-sm q-pr-md q-pl-md">
          $2.00
        </div>
      </div>

      <div class="seccion shadow-4 row justify-start items-center q-pa-sm">
        <div class="col-xs-12 text-h6">Tamaño</div>
        <div class="col-xs-12 flex justify-around items-center">
          <q-btn rounded color="primary" label="Pequeño"/>
          <q-btn rounded color="primary" label="Mediano"/>
          <q-btn rounded color="primary" label="Grande"/>
        </div>
      </div>

      <div class="seccion shadow-4 row justify-start items-center q-pa-sm">
        <div class="col-xs-12 text-h6">Leche</div>
        <div class="col-xs-12 flex justify-around items-center">
          <q-btn rounded color="primary" label="Normal"/>
          <q-btn rounded color="primary" label="Almendra"/>
          <q-btn rounded color="primary" label="Coco"/>
        </div>
      </div>
    </div>

    <div class="confirmar bg-white">
      <q-btn rounded color="red-5" class="btn-bottom">
        <div class="text-h5">Agregar</div>
      </q-btn>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'AddProducto',
  data () {
    return {
      splitterWidth: 40
    }
  }
}
</script>

<style lang="scss">
  .header-round{
    border-radius: 0 0 2rem 2rem;
  }

  .compras{
    padding: 1rem;
    border-radius: 2rem 2rem 0 0;
    display: grid;
    row-gap: 1rem;
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
    grid-template-columns: 40% auto;
    justify-content: center;
  }

  .img-producto2{
    display: grid;
    border-radius: 1rem;
  }

  .img-producto3{
    display: grid;
    border-radius: 1rem;
  }

  .btn-producto2{
    position: relative;
    bottom: 1rem;
    margin-left: 1rem;
    margin-right: 1rem;
  }

  .seccion{
    border-radius: 2rem;
  }

  .aditivos{
    display: grid;
    grid-template-columns: auto;
    row-gap: 1rem;
    padding: .5rem;
    padding-bottom: 5rem;
  }

  .btn-bottom{
    border-radius: 1.5rem 1.5rem 0 0;
    padding: .5rem;
    padding-bottom: 0;
  }
</style>
