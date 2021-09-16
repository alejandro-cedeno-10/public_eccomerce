<template>
  <q-page class="column full-heigth">
    <div class="q-pa-lg">
        <q-card class="q-mb-xl">
            <q-card-section>
                <div class="text-h6 text-center">Datos Personales</div>
                <q-input v-model="usuario.apellido" type="text" class="text-h6" label="Apellidos" />
                <q-input v-model="usuario.nombre" type="text" class="text-h6" label="Nombres" />
                <q-input v-model="usuario.fecha_nacimiento" type="date" class="text-h6" label="Fecha de Nacimiento" />
            </q-card-section>
            <q-card-section>
              <div class="text-h6 text-center">Datos de Contacto</div>
                <q-input v-model="usuario.telefono" type="text" class="text-h6" label="Celular" />
                <q-input v-model="usuario.direccion" type="text" class="text-h6" label="Direccion" />
                <q-btn class="q-mt-md" style="min-width:100%;" color="primary" icon="location_on" label="Ubicacion con GoogleMaps" @click="show" />
                <q-dialog ref="dialog" :hide="onDialogHide">
                  <q-card class="q-dialog-plugin">
                    <div class="q-pa-sm">
                      <gmap-autocomplete
                        class="q-field__native shadow-4 q-pl-sm q-pr-sm"
                        v-bind:class="{ 'text-black' : !$q.dark.isActive, 'text-white' : $q.dark.isActive }"
                        @place_changed="setPlace">
                      </gmap-autocomplete>
                    </div>
                    <gmap-map
                      ref="mapRef"
                      :options="mapOptions"
                      @click="markPlace"
                      :center="center"
                      :zoom="zoom"
                      style="width: 100%; height: 450px;">
                      <gmap-marker
                      v-if="markerSelected"
                      :clickable="true"
                      :draggable="true"
                      :key="0"
                      :position="markerSelected"
                      />
                    </gmap-map>
                    <q-card-actions align="stretch">
                      <div class="row justify-between items-center" style="width:100%">
                        <div class="col-xs-8">
                            <q-chip class="glossy" icon="directions" :label="markerSelected ? markerSelected.lat:'-'" />
                            <q-chip class="glossy" icon="directions" :label="markerSelected ? markerSelected.lng:'-'" />
                        </div>
                        <div class="col-xs-4">
                            <q-btn color="primary" @click="hide">Seleccionar</q-btn>
                        </div>
                        </div>
                        </q-card-actions>
                    </q-card>
                </q-dialog>
                <div class="q-mt-md row justify-around" v-if="usuario.latitud !== 0 && usuario.longitud !== 0" >
                  <q-input type="text" v-model="usuario.latitud" label="Latitud" color="grey-2" dense filled disable>
                    <template v-slot:prepend>
                    <q-icon
                        name="location_on"
                        size="25px"
                    />
                    </template>
                  </q-input>
                  <q-input type="text" v-model="usuario.longitud" label="Longitud" color="grey-2" dense filled disable>
                      <template v-slot:prepend>
                      <q-icon
                          name="location_on"
                          size="25px"
                      />
                      </template>
                  </q-input>
                </div>
                <!-- <div v-else>
                  <q-input type="text" v-if="markerSelected" v-model="markerSelected.lat" label="Latitud" color="grey-2" dense dark filled disable>
                    <template v-slot:prepend>
                    <q-icon
                        name="location_on"
                        size="25px"
                    />
                    </template>
                  </q-input>
                  <q-input type="text" v-if="markerSelected" v-model="markerSelected.lng" label="Longitud" color="grey-2" dense dark filled disable>
                      <template v-slot:prepend>
                      <q-icon
                          name="location_on"
                          size="25px"
                      />
                      </template>
                  </q-input>
                </div> -->
            </q-card-section>
            <q-card-actions>
              <q-btn style="min-width: 100%;" color="positive" icon="save" label="Actualizar Datos" @click="actualizar"/>
            </q-card-actions>
        </q-card>
    </div>
    <q-footer
      bordered
      class="text-primary"
      v-bind:class = "{ 'bg-white': !$q.dark.isActive, 'q-dark': $q.dark.isActive }"
    >
      <q-tabs v-model="tabs" no-caps active-bg-color="primary" active-color="white" indicator-color="primary" class="text-grey-8">
        <q-tab name="info_personal" label="Información de Cuenta" @click="navTo('info_personal')"/>
        <q-tab name="cambiar_pass" label="Cambiar Contraseña" @click="navTo('cambiar_pass')"/>
      </q-tabs>
    </q-footer>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAB7BUr9Whexr1AJPgzHWgD_Pk9jHtw290',
    libraries: 'places'
  }
})

export default {
  name: 'InfoPersonal',
  data () {
    return {
      tabs: 'info_personal',
      mapOptions: {
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        disableDefaultUi: false
      },
      mapDialog: false,
      center: {
        lat: -0.180653,
        lng: -78.467834
      },
      zoom: 6,
      markerSelected: null,
      usuario: {}
    }
  },
  mounted () {
    console.log(this.user)
    this.usuario = {
      id: this.user.id,
      apellido: this.user.apellido,
      nombre: this.user.nombre,
      direccion: this.user.direccion,
      email: this.user.email,
      fecha_nacimiento: this.user.fecha_nacimiento,
      telefono: this.user.telefono,
      latitud: this.user.latitud,
      longitud: this.user.longitud
    }
  },
  computed: {
    ...mapState('auth', ['user'])
  },
  methods: {
    ...mapActions('auth', ['actualizarDatos']),
    actualizar () {
      this.loading = true
      const datos = {
        id: this.usuario.id,
        apellido: this.usuario.apellido,
        nombre: this.usuario.nombre,
        direccion: this.usuario.direccion,
        fecha_nacimiento: this.usuario.fecha_nacimiento,
        telefono: this.usuario.telefono,
        latitud: this.usuario.latitud,
        longitud: this.usuario.longitud
      }
      this.actualizarDatos({ axios: this.$axios, datos: datos })
        .then(res => {
          this.loading = false
          this.$q.notify({
            type: 'positive',
            message: 'Se actualizó con éxito',
            position: 'center',
            actions: [
              { label: 'X', color: 'white', handler: () => { } }
            ]
          })
        })
        .catch(err => {
          this.loading = false
          console.log(err)
          this.$q.notify({
            type: 'negative',
            message: 'Hubieron errores durante la actualización',
            position: 'center',
            actions: [
              { label: 'X', color: 'white', handler: () => { } }
            ]
          })
        })
    },
    markPlace (event) {
      this.markerSelected = { lat: event.latLng.lat(), lng: event.latLng.lng() }
      console.log(event.latLng)
    },
    setPlace (place) {
      this.center = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }
    },
    navTo (ruta) {
      this.$router.push('/' + ruta)
    },
    show () {
      navigator.geolocation.getCurrentPosition(
        position => {
          this.zoom = 12
          this.markerSelected = { lat: position.coords.latitude, lng: position.coords.longitude }
          this.center = { lat: position.coords.latitude, lng: position.coords.longitude }
        },
        error => {
          console.log(error.message)
        },
        {
          enableHighAccuracy: true
        }
      )
      this.$refs.dialog.show()
    },

    hide () {
      this.$refs.dialog.hide()
    },

    onDialogHide () {
      this.$emit('hide')
    },

    onOKClick () {
      this.$emit('ok')
      this.hide()
    },

    onCancelClick () {
      this.hide()
    }
  }
}
</script>

<style lang="scss">
  .opciones-top {
    min-height: 55px;
  }

  .pac-container {
    z-index: 8000;
  }

</style>
