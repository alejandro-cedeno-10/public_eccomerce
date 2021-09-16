<template>
  <div>
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

    <q-list v-if="user" class="text-white">
      <q-item style="min-height:106px" class="bg-primary">
        <q-item-section avatar>
          <q-icon name="fas fa-user" />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h6">{{user.nombre}}</q-item-label>
          <q-item-label caption lines="1" class="text-white">{{user.email}}</q-item-label>
          <div id="user-actions" class="q-pt-sm">
            <q-btn color="primary" @click="$router.push({ path: '/info_personal'})" dense icon="person"/>
            <q-btn color="primary" @click="$router.push({ path: '/cambiar_pass'})" dense icon="lock"/>
            <q-btn color="primary" dense icon="exit_to_app" @click="confirmExit = true"/>
          </div>
        </q-item-section>
      </q-item>
    </q-list>
    <q-list>
      <q-item clickable v-ripple to="/index">
        <q-item-section avatar>
          <q-icon name="fas fa-store" />
        </q-item-section>
        <q-item-section>
          Home
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/mi_compra">
        <q-item-section avatar>
          <q-icon name="fas fa-shopping-cart" />
        </q-item-section>
        <q-item-section>
          Mi Compra
        </q-item-section>
      </q-item>
      <!-- <q-item clickable v-ripple to="/metodos_pago">
        <q-item-section avatar>
          <q-icon name="fas fa-money-check-alt" />
        </q-item-section>
        <q-item-section>
          Métodos de Pago
        </q-item-section>
      </q-item> -->
      <q-separator spaced inset/>
      <q-item clickable v-ripple to="/admin_panel">
        <q-item-section avatar>
          <q-icon name="fas fa-window-restore" />
        </q-item-section>
        <q-item-section>
          Panel Administrador
        </q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/user_panel">
        <q-item-section avatar>
          <q-icon name="fas fa-users" />
        </q-item-section>
        <q-item-section>
          Administrar Usuarios
        </q-item-section>
      </q-item>
      <!-- <q-item clickable v-ripple to="/add_producto">
        <q-item-section avatar>
          <q-icon name="fas fa-chart-line"/>
        </q-item-section>
        <q-item-section>
          Estadísticas del Negocio
        </q-item-section>
      </q-item> -->
    </q-list>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'LeftDrawer',
  data () {
    return {
      confirmExit: false
    }
  },
  computed: {
    ...mapState('auth', ['user'])
  },
  methods: {
    ...mapActions('auth', ['logout']),
    logoutBtn: function () {
      this.logout(this.$axios)
        .then(() => {
          this.$router.replace('/login')
        })
        .catch((error) => {
          console.log(error)
        })
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
