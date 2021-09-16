<template>
  <q-page class="column full-heigth">
    <div class="q-pa-lg">
        <q-card class="q-mb-xl">
            <q-card-section>
              <div class="text-h6 text-center q-pb-md">Cambiar Contraseña</div>
              <q-input
                v-model="contrasena"
                label="Contraseña Actual"
                :rules="[ val => val && val.length > 0 || 'Obligatorio']"
                color="grey-2" filled :type="isPwd ? 'password' : 'text'"
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
              <q-input
                v-model="contrasena_n"
                label="Contraseña Nueva"
                :rules="[ val => val && val.length > 0 || 'Obligatorio']"
                color="grey-2" filled :type="isPwd ? 'password' : 'text'"
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
    <q-dialog v-model="loading" persistent>
      <q-spinner-pie color="primary" size="5rem"/>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'InfoPersonal',
  data () {
    return {
      tabs: 'cambiar_pass',
      isPwd: false,
      contrasena: '',
      contrasena_n: '',
      usuario: {},
      loading: false
    }
  },
  mounted () {
    console.log(this.user)
    this.usuario = {
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
    ...mapActions('auth', ['cambiarPass']),
    actualizar () {
      console.log(this.usuario)

      if (this.contrasena === '') {
        this.$q.notify({
          type: 'negative',
          message: 'Contraseña Actual Vacía',
          position: 'center',
          actions: [
            { label: 'X', color: 'white', handler: () => { } }
          ]
        })
        return
      }

      if (this.contrasena_n === '') {
        this.$q.notify({
          type: 'negative',
          message: 'Contraseña Nueva Vacía',
          position: 'center',
          actions: [
            { label: 'X', color: 'white', handler: () => { } }
          ]
        })
        return
      }

      const datos = {
        id: this.user.id,
        old_password: this.contrasena,
        password: this.contrasena_n,
        password_confirmation: this.contrasena_n
      }

      this.loading = true
      this.cambiarPass({ axios: this.$axios, datos: datos })
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
      /*
         ruta: /users/actualizar
        {
          "id":3,
          "nombre": "a",
          "apellido": "cedeno",
          "direccion": "au",
          "fecha_nacimiento": "2019-11-12",
          "telefono": "84684",
          "email": "nareto_22@gmail.com",
          "admin": 0,
          "latitud":0,
          "longitud":0,
          "password": 123456,
          "c_password":123456
        }
      */
    },
    navTo (ruta) {
      this.$router.push('/' + ruta)
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
