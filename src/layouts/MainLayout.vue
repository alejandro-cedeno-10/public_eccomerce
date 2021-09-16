<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>

        <q-toolbar-title>
          Producto App
        </q-toolbar-title>

        <q-btn
          v-if="$q.dark.isActive"
          flat
          dense
          round
          icon="fas fa-sun"
          aria-label="Menu"
          @click="setLight"
        />
        <q-btn
          v-else
          flat
          dense
          round
          icon="fas fa-moon"
          aria-label="Menu"
          @click="setDark"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      :mini="miniState"
      @mouseover="miniState = false"
      @mouseout="miniState = true"
      :breakpoint="814"
    >
      <LeftDrawer/>
    </q-drawer>

    <q-page-container>
      <router-view />
      <q-page-sticky v-if="$q.screen.width<=800" position="bottom-right" :offset="[16, 16]">
        <q-fab color="primary" icon="keyboard_arrow_up" direction="up" vertical-actions-align="right">
          <q-fab-action external-label color="primary" label-position="left" @click="$router.push({ path: '/index'})"  icon="fas fa-store" label="Home" label-class="text-h6"/>
          <!-- <q-fab-action external-label color="primary" label-position="left" @click="$router.push({ path: '/metodos_pago'})"  icon="fas fa-money-check-alt" label="Métodos de Pago" label-class="text-h6"/> -->

          <q-fab-action external-label color="primary" label-position="left" @click="$router.push({ path: '/info_personal'})"  icon="person" label="Información Personal" label-class="text-h6"/>

          <q-fab-action external-label color="primary" label-position="left" @click="$router.push({ path: '/admin_panel'})"  icon="fas fa-window-restore" label="Panel Administrador" label-class="text-h6"/>
          <q-fab-action external-label color="primary" label-position="left" @click="$router.push({ path: '/user_panel'})"  icon="fas fa-users" label="Administrar Usuarios" label-class="text-h6"/>
          <!-- <q-fab-action external-label color="primary" label-position="left" @click="$router.push({ path: '/index'})"  icon="fas fa-chart-line" label="Estadísticas del Negocio" label-class="text-h6"/> -->

          <q-fab-action external-label color="primary" label-position="left" @click="confirmExit = true"  icon="exit_to_app" label="Salir" label-class="text-h6"/>
        </q-fab>
      </q-page-sticky>
      <q-page-sticky v-if="$q.screen.width<=800 && $route.path !== '/mi_compra' && $route.path !== '/factura'"  position="bottom-left" :offset="[16, 16]">
        <q-btn fab icon="fas fa-shopping-cart" color="positive" @click="$router.push({ path: '/mi_compra'})">
          <q-badge v-if="productos.length > 0" color="red" floating> {{productos.length}} </q-badge>
        </q-btn>
      </q-page-sticky>
    </q-page-container>
    <q-dialog v-model="confirmExit" persistent transition-show="flip-down" transition-hide="flip-up">
      <q-card>
        <q-card-section>
          <div class="text-h6">Alerta</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          ¿Estás seguro de cerrar la sesión?
        </q-card-section>
        <q-card-actions align="right">
          <q-btn label="Cancelar" flat color="primary" v-close-popup />
          <q-btn label="Sí, Cerrar Sesión" color="primary" v-close-popup @click="logoutBtn"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import LeftDrawer from '../components/LeftDrawer'

export default {
  name: 'MainLayout',

  components: {
    LeftDrawer
  },
  data () {
    return {
      leftDrawerOpen: false,
      miniState: true,
      confirmExit: false
    }
  },
  mounted () {
    if (this.theme === 'dark') {
      this.$q.dark.set(true)
    }
  },
  computed: {
    ...mapState('cart', ['productos']),
    ...mapState('darkTheme', ['theme'])
  },
  methods: {
    ...mapActions('darkTheme', ['setTheme']),
    ...mapActions('auth', ['logout']),
    logoutBtn: function () {
      this.logout(this.$axios)
        .then(() => {
          this.$router.replace('/login')
        })
        .catch((error) => {
          console.log(error)
        })
    },
    setDark () {
      this.setTheme('dark')
      this.$q.dark.set(true)
    },
    setLight () {
      this.setTheme('light')
      this.$q.dark.set(false)
    }
  }
}
</script>

<style lang="scss" scoped>
  /* .q-page{
    background-color: rgb(27, 25, 25);
  } */

  #profile {
    height: 10;
    display: grid;
    grid-template-columns: 80px auto;
    padding: 1rem;
    row-gap: .5rem;
  }
  #user-actions {
    grid-column: span 2;
    display: flex;
    justify-content: space-around;
  }
</style>
