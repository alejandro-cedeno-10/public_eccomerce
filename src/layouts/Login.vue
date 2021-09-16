<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container class="bg-grey-10">
      <q-page class="flex flex-center">
        <div class="column justify-around items-center">
          <q-separator spaced color="transparent" size="2rem"/>
          <div class="text-h3 text-white">
            Login
          </div>
          <q-separator spaced color="transparent" size="2rem"/>
          <div class="col-12">
            <q-input ref="email" v-model="email" type="email" placeholder="Correo" color="grey-2" dark filled>
              <template v-slot:prepend>
                <q-icon
                  name="person_outline"
                  size="25px"
                />
              </template>
            </q-input>
            <q-separator spaced color="transparent" size=".5rem"/>
            <q-input v-on:keyup.13="loginBtn" ref="pass" v-model="password" placeholder="Contraseña" color="grey-2" dark filled :type="isPwd ? 'password' : 'text'">
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
          <q-separator spaced color="transparent" size="1rem"/>
          <q-btn color="primary" label="Ingresar" @click="loginBtn"/>
          <!-- <q-btn color="green-8" label="Ingresar"/> -->
          <q-separator spaced color="transparent" size="1rem"/>
          <div class="text-white">O</div>
          <q-separator spaced color="transparent" size="1rem"/>

          <div class="text-white row justify-around">
            <q-btn color="blue-8" icon="fab fa-facebook-f"/>
            <q-separator spaced vertical color="transparent" size="1rem"/>
            <q-btn color="yellow-9" icon="fab fa-google"/>
          </div>

          <q-separator spaced color="transparent" size="2rem"/>

          <div class="text-white">¿No tienes una cuenta?, <q-btn to="registrar" dense class="text-capitalize" flat color="orange" label="Regístrate"/><!-- <span class="text-orange cursor-pointer">Regístrate</span> --></div>
        </div>
      </q-page>
      <q-dialog v-model="errorModal" persistent transition-show="flip-down" transition-hide="flip-up">
        <q-card class="bg-grey-10 text-white">
          <q-card-section>
            <div class="text-h6">Error</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            Usuario o Contraseña Incorrecta
          </q-card-section>
          <q-card-actions align="right">
            <q-btn label="Ok" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>

      <q-dialog v-model="loading" persistent>
        <q-spinner-ball color="primary" size="5rem"/>
      </q-dialog>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'Login',
  data () {
    return {
      email: '',
      password: '',
      rememberMe: false,
      isPwd: true,
      errorModal: false,
      loading: false
    }
  },
  computed: {
    ...mapState('auth', ['mensajeError'])
  },
  methods: {
    ...mapActions('auth', ['login']),
    loginBtn: function () {
      const loginData = {
        email: this.email,
        password: this.password,
        remember_me: this.rememberMe
      }
      this.loading = true
      this.login({ axios: this.$axios, loginData: loginData })
        .then(() => {
          this.loading = false
          this.$router.replace('/index')
        })
        .catch((error) => {
          this.loading = false
          this.errorModal = true
          console.log(error)
        })
    }
  }
}
</script>
