<template>
  <q-page class="column dark full-heigth">
    <div class="text-h4 text-center text-bold q-pa-sm q-mt-md">Registrar Cliente</div>
    <div class="column q-pa-md">
      <q-stepper
        v-model="step"
        ref="stepper"
        color="primary"
        animated
        contracted
      >
        <q-step
          :name="1"
          title="Datos Personales"
          icon="person"
          active-icon="person"
          :done="step > 1"
        >
          <div class="form">
            <q-input
              v-model="nuevoUsuario.apellidos"
              :rules="[ val => val && val.length > 0 || 'Obligatorio']"
              type="text"
              ref="apellidos"
              label="Apellidos"
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
              ref="nombres"
              label="Nombres"
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
              ref="fechaNacimiento"
              label="Fecha Nacimiento"
              :rules="['date']"
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
            <!-- <q-btn :disable="nuevoUsuario.apellidos === '' || nuevoUsuario.nombre === '' || nuevoUsuario.fechaNac === ''" color="primary" icon-right="fas fa-arrow-right" label="Siguiente" @click="moveTo(1)"/> -->
          </div>
        </q-step>
        <q-step
          :name="2"
          title="Contacto"
          icon="place"
          active-icon="place"
          :done="step > 2"
        >
          <div class="form">
            <q-input
              v-model="nuevoUsuario.telefono"
              :rules="[ val => val && val.length == 10 || 'Obligatorio']"
              type="tel"
              mask="##########"
              ref="telefono"
              label="Teléfono"
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
              ref="direccion"
              label="Dirección"
              filled
            >
              <template v-slot:prepend>
                <q-icon
                  name="location_on"
                  size="25px"
                />
              </template>
            </q-input>
            <div class="row justify-center">
              <q-btn color="green-8" icon="location_on" label="Ubicacion con GoogleMaps" @click="show" />
            </div>
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
            <div class="row justify-around q-pt-md">
              <q-input type="text" v-if="markerSelected" v-model="markerSelected.lat" label="Latitud" dense filled disable>
                <template v-slot:prepend>
                  <q-icon
                    name="location_on"
                    size="25px"
                  />
                </template>
              </q-input>
              <q-input type="text" v-if="markerSelected" v-model="markerSelected.lng" label="Longitud" dense filled disable>
                <template v-slot:prepend>
                  <q-icon
                    name="location_on"
                    size="25px"
                  />
                </template>
              </q-input>
            </div>
          </div>
        </q-step>
        <q-step
          :name="3"
          title="Datos Usuario"
          icon="email"
          active-icon="email"
          :done="step > 2"
        >
          <div class="form">
            <q-input
              v-model="nuevoUsuario.email"
              :rules="[ val => val && val.length > 0 || 'Obligatorio', isValidEmail]"
              type="email"
              ref="correo"
              label="Correo"
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
              ref="contrasena"
              label="Contraseña"
              :rules="[ val => val && val.length > 0 || 'Obligatorio']"
              filled :type="isPwd ? 'password' : 'text'"
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
          </div>
        </q-step>
        <template v-slot:navigation>
          <q-stepper-navigation>
            <q-btn @click="$refs.stepper.next()" color="primary" v-if="step < 3" :disable="disableButton" label="Continuar" />
            <q-btn @click="registrar" color="primary" v-if="step === 3" label="Registrar" />
            <q-btn v-if="step > 1" flat color="primary" @click="$refs.stepper.previous()" label="Atrás" class="q-ml-sm" />
          </q-stepper-navigation>
        </template>
      </q-stepper>

      <div class="text-h4 text-center text-bold q-pa-sm q-mt-md">Lista de Clientes</div>
      <q-table
        :grid="$q.screen.sm || $q.screen.xs"
        title="Usuarios"
        :data="clientes"
        :columns="columns"
        row-key="id"
        selection="multiple"
        :selected.sync="selected"
        :filter="filter"
        @focusin.native="activateNavigation"
        @focusout.native="deactivateNavigation"
        @keydown.native="onKey"
      >
        <template v-slot:top>
          <q-btn color="primary" dense flat icon="edit"/>
          <q-btn color="red-5" dense flat icon="delete"/>
          <q-space />
          <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
        </template>
        <template v-slot:pagination="scope">
          <q-btn
            v-if="scope.pagesNumber > 2"
            icon="first_page"
            color="grey-8"
            round
            dense
            flat
            :disable="scope.isFirstPage"
            @click="scope.firstPage"
          />

          <q-btn
            icon="chevron_left"
            color="grey-8"
            round
            dense
            flat
            :disable="scope.isFirstPage"
            @click="scope.prevPage"
          />

          <q-btn
            icon="chevron_right"
            color="grey-8"
            round
            dense
            flat
            :disable="scope.isLastPage"
            @click="scope.nextPage"
          />

          <q-btn
            v-if="pagesNumber > 2"
            icon="last_page"
            color="grey-8"
            round
            dense
            flat
            :disable="scope.isLastPage"
            @click="scope.lastPage"
          />
        </template>
      </q-table>
    </div>
    <q-dialog v-model="loading" persistent>
      <q-spinner-pie color="primary" size="5rem"/>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapActions } from 'vuex'
import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyAB7BUr9Whexr1AJPgzHWgD_Pk9jHtw290',
    libraries: 'places'
  }
})

export default {
  name: 'AdminClientes',
  data () {
    return {
      loading: true,
      isPwd: true,
      step: 1,
      errorModal: false,
      splitterWidth: 40,
      selected: [],
      navigationActive: false,
      clientes: [],
      filter: '',
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
      mapDialog: false,
      center: {
        lat: -0.180653,
        lng: -78.467834
      },
      mapOptions: {
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: true,
        disableDefaultUi: false
      },
      zoom: 6,
      markerSelected: null,
      pagination: {
        sortBy: 'desc',
        descending: false,
        page: 2,
        rowsPerPage: 3
        // rowsNumber: xx if getting data from a server
      },
      columns: [
        {
          name: 'id',
          required: true,
          label: 'Id',
          align: 'center',
          field: 'id',
          sortable: true
        },
        { name: 'apellidos', align: 'center', label: 'Apellidos', field: 'apellido', sortable: true },
        { name: 'nombre', align: 'center', label: 'Nombres', field: 'nombre', sortable: true },
        { name: 'fecha_nacimiento', align: 'center', label: 'Fecha de Nacimiento', field: 'fecha_nacimiento', sortable: true },
        { name: 'email', align: 'center', label: 'Email', field: 'email', sortable: true },
        { name: 'telefono', align: 'center', label: 'Teléfono', field: 'telefono', sortable: true }
      ]
    }
  },
  mounted () {
    this.listarClientes(this.$axios)
      .then((response) => {
        console.log(response.data)
        this.clientes = response.data
      })
      .catch((error) => {
        console.log(error.response)
      })
  },
  computed: {
    pagesNumber () {
      return Math.ceil(this.clientes.length / this.pagination.rowsPerPage)
    },
    disableButton () {
      if (this.step === 1) {
        /* this.$refs.apellidos.validate()
        this.$refs.nombres.validate()
        this.$refs.fechaNacimiento.validate()
        if (this.$refs.apellidos.hasError || this.$refs.nombres.hasError || this.$refs.fechaNacimiento.hasError) { */
        if (this.nuevoUsuario.apellidos === '' || this.nuevoUsuario.nombre === '' || this.nuevoUsuario.fechaNac === '') {
          return true
        } else { return false }
      }
      if (this.step === 2) {
        if (this.nuevoUsuario.telefono === '' || this.nuevoUsuario.direccion === '') {
          return true
        } else { return false }
      }
      if (this.step === 3) {
        if (this.nuevoUsuario.email === '' || this.nuevoUsuario.contrasena === '') {
          return true
        } else { return false }
      }
      return false
    }
  },
  methods: {
    ...mapActions('users', ['listarClientes']),
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
    limpiarDatos () {
      this.nuevoUsuario = {
        apellidos: '',
        nombre: '',
        fechaNac: '',
        telefono: '',
        direccion: '',
        email: '',
        contrasena: '',
        latitud: '',
        longitud: ''
      }
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
    },
    activateNavigation () {
      this.navigationActive = true
    },
    deactivateNavigation () {
      this.navigationActive = false
    },
    onKey (evt) {
      if (
        this.navigationActive !== true ||
          [33, 34, 35, 36, 38, 40].indexOf(evt.keyCode) === -1 ||
        this.$refs.myTable === undefined
      ) {
        return
      }

      evt.preventDefault()

      const { computedRowsNumber, computedRows } = this.$refs.myTable

      if (computedRows.length === 0) {
        return
      }

      const currentIndex = this.selected.length > 0 ? computedRows.indexOf(this.selected[0]) : -1
      const currentPage = this.pagination.page
      const rowsPerPage = this.pagination.rowsPerPage === 0 ? computedRowsNumber : this.pagination.rowsPerPage
      const lastIndex = computedRows.length - 1
      const lastPage = Math.ceil(computedRowsNumber / rowsPerPage)

      let index = currentIndex
      let page = currentPage

      switch (evt.keyCode) {
        case 36: // Home
          page = 1
          index = 0
          break
        case 35: // End
          page = lastPage
          index = rowsPerPage - 1
          break
        case 33: // PageUp
          page = currentPage <= 1 ? lastPage : currentPage - 1
          if (index < 0) {
            index = 0
          }
          break
        case 34: // PageDown
          page = currentPage >= lastPage ? 1 : currentPage + 1
          if (index < 0) {
            index = rowsPerPage - 1
          }
          break
        case 38: // ArrowUp
          if (currentIndex <= 0) {
            page = currentPage <= 1 ? lastPage : currentPage - 1
            index = rowsPerPage - 1
          } else {
            index = currentIndex - 1
          }
          break
        case 40: // ArrowDown
          if (currentIndex >= lastIndex) {
            page = currentPage >= lastPage ? 1 : currentPage + 1
            index = 0
          } else {
            index = currentIndex + 1
          }
          break
      }

      if (page !== this.pagination.page) {
        this.pagination = {
          ...this.pagination,
          page
        }

        this.$nextTick(() => {
          const { computedRows } = this.$refs.myTable
          this.selected = [computedRows[Math.min(index, computedRows.length - 1)]]
        })
      } else {
        this.selected = [computedRows[index]]
      }
    }
  }
}
</script>

<style lang="scss">
  .pac-container {
    z-index: 8000;
  }
</style>
