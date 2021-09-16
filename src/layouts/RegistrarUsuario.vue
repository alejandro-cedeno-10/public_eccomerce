<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container class="bg-grey-10 text-white">
      <q-page class="login-form">
        <div>
          <q-btn to="login" dense class="text-capitalize text-left" flat color="orange" label="Iniciar Sesión"/>
        </div>
        <div class="text-h4 text-center">
          Registro de Usuario
        </div>
        <div>
          <q-linear-progress
            :value="(pagina+1)/3"
            size="lg"
            color="primary"
            track-color="white"
            class="q-mt-md"
          />
        </div>
        <transition
          enter-active-class="animated fadeInRight"
        >
        <div class="form" v-if="pagina == 0">
          <q-input
            v-model="nuevoUsuario.apellidos"
            :rules="[ val => val && val.length > 0 || 'Obligatorio']"
            type="text"
            label="Apellidos"
            color="grey-2"
            dark
            filled
          >
            <template v-slot:prepend>
              <q-icon
                name="text_fields"
                size="25px"
              />
            </template>
          </q-input>
          <q-input
            v-model="nuevoUsuario.nombre"
            :rules="[ val => val && val.length > 0 || 'Obligatorio']"
            type="text"
            label="Nombres"
            color="grey-2"
            dark
            filled
          >
            <template v-slot:prepend>
              <q-icon
                name="text_fields"
                size="25px"
              />
            </template>
          </q-input>
          <q-input
            v-model="nuevoUsuario.fechaNac"
            type="text"
            label="Fecha Nacimiento"
            color="grey-2"
            :rules="['date']"
            dark
            filled
          >
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="nuevoUsuario.fechaNac" @input="() => $refs.qDateProxy.hide()" />
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="nuevoUsuario.fechaNac" @input="() => $refs.qDateProxy.hide()" />
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-btn :disable="nuevoUsuario.apellidos === '' || nuevoUsuario.nombre === '' || nuevoUsuario.fechaNac === ''" color="primary" icon-right="fas fa-arrow-right" label="Siguiente" @click="moveTo(1)"/>
        </div>
        </transition>
        <transition
          enter-active-class="animated fadeInRight"
        >
        <div class="form" v-if="pagina == 1">
          <q-input
          v-model="nuevoUsuario.telefono"
          :rules="[ val => val && val.length == 10 || 'Obligatorio']"
          type="tel"
          mask="##########"
          label="Teléfono"
          color="grey-2"
          dark
          filled
        >
            <template v-slot:prepend>
              <q-icon
                name="phone"
                size="25px"
              />
            </template>
          </q-input>
          <q-input
            v-model="nuevoUsuario.direccion"
            :rules="[ val => val && val.length > 0 || 'Obligatorio']"
            type="text"
            label="Dirección"
            color="grey-2"
            dark
            filled
          >
            <template v-slot:prepend>
              <q-icon
                name="location_on"
                size="25px"
              />
            </template>
          </q-input>
          <q-btn color="green-8" icon="location_on" label="Ubicacion con GoogleMaps" @click="show" />
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
                <!-- <gmap-marker v-for="(marker) in markers"
                  :clickable="true"
                  :key="marker.key"
                  :position="marker"
                /> -->
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
          <div class="flex justify-between">
            <q-btn color="primary" icon="fas fa-arrow-left" @click="moveTo(0)"/>
            <q-btn  :disable="nuevoUsuario.telefono == '' || nuevoUsuario.direccion == ''" color="primary" icon-right="fas fa-arrow-right" label="Siguiente" @click="moveTo(2)"/>
          </div>
        </div>
        </transition>
        <transition
          enter-active-class="animated fadeInRight"
        >
        <div class="form" v-if="pagina == 2">
          <q-input
            v-model="nuevoUsuario.email"
            :rules="[ val => val && val.length > 0 || 'Obligatorio', isValidEmail]"
            type="email"
            label="Correo"
            color="grey-2"
            dark
            filled
          >
            <template v-slot:prepend>
              <q-icon
                name="mail"
                size="25px"
              />
            </template>
          </q-input>
          <q-input
            v-model="nuevoUsuario.contrasena"
            label="Contraseña"
            :rules="[ val => val && val.length > 0 || 'Obligatorio']"
            color="grey-2" dark filled :type="isPwd ? 'password' : 'text'"
          >
            <template v-slot:prepend>
              <q-icon
                name="lock"
                class="cursor-pointer"
              />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>
          <q-checkbox dark v-model="acepto" color="green" label="Estoy de Acuerdo con las Políticas de Privacidad" />
          <div class="flex justify-between">
            <q-btn color="primary" icon="fas fa-arrow-left" @click="moveTo(1)"/>
            <q-btn color="primary" icon-right="fas fa-check" label="Finalizar" :disable="!acepto" @click="registrar()"/>
          </div>
        </div>
        </transition>
      </q-page>
    </q-page-container>
    <q-dialog v-model="isLoading" class="loading" persistent>
      <q-spinner-ball color="primary" size="5rem"/>
    </q-dialog>
    <q-dialog v-model="error" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-red-5 text-white">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Error</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <q-card-section class="q-pt-none">
          Error en el registro, Verifica que los datos estén correctos
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'
import { mapActions } from 'vuex'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAB7BUr9Whexr1AJPgzHWgD_Pk9jHtw290',
    libraries: 'places'
  }
})

export default {
  name: 'Login',
  data () {
    return {
      mapOptions: {
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        disableDefaultUi: false
      },
      isLoading: false,
      error: false,
      pagina: 0,
      isPwd: true,
      nuevoUsuario: {
        apellidos: '',
        nombre: '',
        fechaNac: '',
        telefono: '',
        direccion: '',
        email: '',
        contrasena: '',
        latitud: '',
        longitud: ''
      },
      search: '',
      url: '',
      date: '',
      acepto: false,
      mapDialog: false,
      center: {
        lat: -0.180653,
        lng: -78.467834
      },
      zoom: 6,
      markerSelected: null
      /* markers: [
        { lat: 36.71395099999999, lng: -4.432000000000016 },
        { lat: 36.51007199999999, lng: -4.882447400000046 }
      ] */
    }
  },
  methods: {
    ...mapActions('auth', ['register']),
    setPlace (place) {
      this.center = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }
    },
    validar1: function () {
      let val = true
      if (this.nuevoUsuario.apellidos === '' || this.nuevoUsuario.nombre === '' || this.nuevoUsuario.fechaNac === '') {
        val = false
        this.$q.notify({
          type: 'negative',
          message: 'Debe cumplir con los campos obligatorios',
          position: 'center',
          actions: [
            { label: 'X', color: 'white', handler: () => { } }
          ]
        })
      }
      return val
    },
    isValidEmail (val) {
      const emailPattern = /^(?=[a-zA-Z0-9@._%+-]{6,254}$)[a-zA-Z0-9._%+-]{1,64}@(?:[a-zA-Z0-9-]{1,63}\.){1,8}[a-zA-Z]{2,63}$/
      return emailPattern.test(val) || 'Email no válido'
    },
    validar2: function () {
      let val = true
      if (this.nuevoUsuario.telefono === '' || this.nuevoUsuario.direccion === '') {
        val = false
        this.$q.notify({
          type: 'negative',
          message: 'Debe cumplir con los campos obligatorios',
          position: 'center',
          actions: [
            { label: 'X', color: 'white', handler: () => { } }
          ]
        })
      }
      if (!this.nuevoUsuario.telefono.length === 10) {
        val = false
        this.$q.notify({
          type: 'negative',
          message: 'Inválido número de caractéres en el # celular',
          position: 'center',
          actions: [
            { label: 'X', color: 'white', handler: () => { } }
          ]
        })
      }
      return val
    },
    validar3: function () {
      let val = true
      if (this.nuevoUsuario.email === '' || this.nuevoUsuario.contrasena === '') {
        val = false
        this.$q.notify({
          type: 'negative',
          message: 'Debe cumplir con los campos obligatorios',
          position: 'center',
          actions: [
            { label: 'X', color: 'white', handler: () => { } }
          ]
        })
      }
      if (!this.isValidEmail(this.nuevoUsuario.email)) {
        val = false
        this.$q.notify({
          type: 'negative',
          message: 'El correo no es válido',
          position: 'center',
          actions: [
            { label: 'X', color: 'white', handler: () => { } }
          ]
        })
      }
      return val
    },
    validar: function () {
      let val = true
      if (!this.validar1()) {
        val = false
      }
      if (!this.validar2()) {
        val = false
      }
      if (!this.validar3()) {
        val = false
      }
      return val
    },
    registrar: function () {
      if (!this.validar()) {
        return
      }
      this.isLoading = true
      const usuario = {
        nombre: this.nuevoUsuario.nombre,
        apellido: this.nuevoUsuario.apellidos,
        direccion: this.nuevoUsuario.direccion,
        fecha_nacimiento: this.nuevoUsuario.fechaNac,
        admin: 0,
        telefono: this.nuevoUsuario.telefono,
        email: this.nuevoUsuario.email,
        latitud: this.markerSelected ? this.markerSelected.lat : 0,
        longitud: this.markerSelected ? this.markerSelected.lng : 0,
        password: this.nuevoUsuario.contrasena,
        c_password: this.nuevoUsuario.contrasena
      }
      this.register({ axios: this.$axios, user: usuario })
        .then((res) => {
          this.$router.replace('/login')
          this.$q.notify({
            type: 'positive',
            message: 'Se registró el usuario con éxito',
            position: 'center',
            actions: [
              { label: 'X', color: 'white', handler: () => { } }
            ]
          })
          this.isLoading = false
        })
        .catch((error) => {
          console.log(error.response)
          this.isLoading = false
          this.error = true
        })
    },

    moveTo: function (pag) {
      if (pag === 1) {
        if (!this.validar1()) {
          return
        }
      } else if (pag === 2) {
        if (!this.validar2()) {
          return
        }
      }
      this.pagina = pag
    },

    markPlace (event) {
      this.markerSelected = { lat: event.latLng.lat(), lng: event.latLng.lng() }
      console.log(event.latLng)
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
  },
  computed: {
  }
}
</script>

<style lang="scss" scoped>
  .login-form{
    padding-top: 10vh;
    display: grid;
    grid-template-columns: auto;
    gap: 1rem;
    justify-content: center;
    align-content: start;
    min-height: 100vh;
  }

  .form{
    display: grid;
    grid-template-columns: auto;
    gap: 1rem;
    //justify-content: center;
    align-items: start;
  }

  .tag-navs{
    display: flex;
    justify-content: space-around;
  }

  .pac-container {
    z-index: 8000;
  }
</style>
