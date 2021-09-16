<template>
  <q-page class="column dark full-heigth items-center">
    <div class="q-ma-md shadow-10 bg-white">
      <div class="factura">
        <div class="q-pt-xl q-pl-xl q-pr-xl q-pb-md cabecera bg-transparent text-black">
          <div class="flex justify-end">
            <div class="text-h2 text-bold q-mb-xl">Factura</div>
          </div>
          <!-- <div class="cabecera-2"> -->
          <div class="footer-1">
            <div>
              <div class="text-h5 text-bold">Cliente </div>
              <div class="flex">
                <div class="text-bold">
                  <div>Nombre: </div>
                  <div>Dirección: </div>
                  <div>Cédula: </div>
                  <div>N° Célular: </div>
                </div>
                <div class="q-pl-sm">
                  <div> {{user.nombre}} {{user.apellido}} </div>
                  <div> {{user.direccion}} </div>
                  <div>1305664874</div>
                  <div> {{user.telefono}} </div>
                </div>
              </div>
            </div>
            <div class="flex justify-between">
              <div>
                <div class="text-h5 text-bold">Factura N°</div>
                <div class="text-h6 text-bold">Fecha </div>
              </div>
              <div class="text-right">
                <div class="text-h5 text-bold">000001</div>
                <div class="text-h6"> {{ fechaActual }} </div>
              </div>
            </div>
          </div>
        </div>
        <q-table
          class="detalles q-mr-xl q-ml-xl bg-white text-black"
          :data="detalles"
          :columns="columns"
          row-key="id"
          hide-bottom
        />
        <div class="q-pb-md q-pl-xl q-pr-xl q-pt-lg bg-white text-black">
          <div class="footer-1">
            <div>
              <!-- <div class="text-h6 text-bold">Información de Pago: </div>
                <div class="flex q-pl-md">
                  <div class="text-bold">
                    <div>N° Cuenta: </div>
                    <div>Nombre de Cuenta: </div>
                    <div>Datos Bancarios: </div>
                  </div>
                  <div class="q-pl-md">
                    <div>12123213213</div>
                    <div>kfjs ffs sdad</div>
                    <div>adas afaafa d</div>
                  </div>
                </div> -->
              </div>
              <div>
                <div class="flex justify-between q-pa-sm">
                  <div>
                    <div class="text-bold text-h6">SubTotal: </div>
                    <div class="text-bold text-h6">IVA: </div>
                  </div>
                  <div class="text-right q-pl-md">
                    <div class="text-h6">$ {{ (total).toFixed(2) }} </div>
                    <div class="text-h6">$ {{ (total*0.12).toFixed(2) }} </div>
                  </div>
                </div>
                <q-separator color="black"/>
                <div class="flex justify-between q-pa-sm">
                  <div>
                    <div class="text-bold text-h5">Total: </div>
                  </div>
                  <div class="text-right q-pl-md">
                    <div class="text-h5">$ {{ (total + total*0.12).toFixed(2) }} </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        <!-- <div class="footer q-pl-xl q-pr-xl q-pb-xl">
          <div class="text-bold text-h6">Terminos y Condiciones</div>
          <p class="q-pl-md">dlsajdksajdksadasjdlksadjkalsdaskdjasld</p>
        </div> -->
      </div>
    </div>

    <vue-html2pdf
        :show-layout="false"
        :enable-download="false"
        :preview-modal="true"
        :paginate-elements-by-height="1400"
        filename="factura"
        :pdf-quality="2"
        :manual-pagination="false"
        pdf-format="a4"
        pdf-orientation="portrait"
        pdf-content-width="800px"
        ref="html2Pdf"
    >
      <section slot="pdf-content" class="factura">
        <div class="q-pt-xl q-pl-xl q-pr-xl q-pb-md cabecera bg-transparent text-black">
          <div class="flex justify-end">
            <div class="text-h2 text-bold q-mb-xl">Factura</div>
          </div>
          <!-- <div class="cabecera-2"> -->
          <div class="footer-1">
            <div>
              <div class="text-h5 text-bold">Cliente </div>
              <div class="flex">
                <div class="text-bold">
                  <div>Nombre: </div>
                  <div>Dirección: </div>
                  <div>Cédula: </div>
                  <div>N° Célular: </div>
                </div>
                <div class="q-pl-sm">
                  <div> {{user.nombre}} {{user.apellido}} </div>
                  <div> {{user.direccion}} </div>
                  <div>1305664874</div>
                  <div> {{user.telefono}} </div>
                </div>
              </div>
            </div>
            <div class="flex justify-between">
              <div>
                <div class="text-h5 text-bold">Factura N°</div>
                <div class="text-h6 text-bold">Fecha </div>
              </div>
              <div class="text-right">
                <div class="text-h5 text-bold">000001</div>
                <div class="text-h6"> {{ fechaActual }} </div>
              </div>
            </div>
          </div>
        </div>
        <q-table
          class="detalles q-mr-xl q-ml-xl bg-white text-black"
          :data="detalles"
          :columns="columns"
          row-key="id"
          hide-bottom
        />
        <div class="q-pb-md q-pl-xl q-pr-xl q-pt-lg bg-white text-black">
          <div class="footer-1">
            <div>
              <!-- <div class="text-h6 text-bold">Información de Pago: </div>
                <div class="flex q-pl-md">
                  <div class="text-bold">
                    <div>N° Cuenta: </div>
                    <div>Nombre de Cuenta: </div>
                    <div>Datos Bancarios: </div>
                  </div>
                  <div class="q-pl-md">
                    <div>12123213213</div>
                    <div>kfjs ffs sdad</div>
                    <div>adas afaafa d</div>
                  </div>
                </div> -->
              </div>
              <div>
                <div class="flex justify-between q-pa-sm">
                  <div>
                    <div class="text-bold text-h6">SubTotal: </div>
                    <div class="text-bold text-h6">IVA: </div>
                  </div>
                  <div class="text-right q-pl-md">
                    <div class="text-h6">$ {{ (total).toFixed(2) }} </div>
                    <div class="text-h6">$ {{ (total*0.12).toFixed(2) }} </div>
                  </div>
                </div>
                <q-separator color="black"/>
                <div class="flex justify-between q-pa-sm">
                  <div>
                    <div class="text-bold text-h5">Total: </div>
                  </div>
                  <div class="text-right q-pl-md">
                    <div class="text-h5">$ {{ (total + total*0.12).toFixed(2) }} </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        <!-- <div class="footer q-pl-xl q-pr-xl q-pb-xl">
          <div class="text-bold text-h6">Terminos y Condiciones</div>
          <p class="q-pl-md">dlsajdksajdksadasjdlksadjkalsdaskdjasld</p>
        </div> -->
      </section>
    </vue-html2pdf>
    <q-page-sticky position="bottom-left" :offset="[16, 16]">
      <q-fab color="positive" icon="check" direction="up" vertical-actions-align="right">
        <q-fab-action external-label color="primary" label-position="right" @click="generateReport" icon="print" label="Imprimir" label-class="text-h6"/>
        <q-fab-action external-label color="green-8" label-position="right" @click="modalWs = true" icon="fab fa-whatsapp" label="Enviar por WhatsApp" label-class="text-h6"/>
      </q-fab>
    </q-page-sticky>
    <q-dialog v-model="modalWs" persistent>
      <q-card>
        <div class="q-pa-sm row justify-between items-center">
          <div class="text-h6 q-pr-xl">Solicitar por WhatsApp</div>
          <q-btn color="negative" icon="close" dense @click="modalWs = false"/>
        </div>
        <q-card-section>
          <div class="q-mb-sm">Elija un agente para enviar su pedido</div>
          <q-list bordered>
            <q-item @click="enviarWS(p.telefono)" v-for="p in admins" :key="p.id" clickable v-ripple>
              <q-item-section avatar>
                <q-icon color="primary" name="person" />
              </q-item-section>
              <q-item-section> {{p.nombre}} {{p.apellido}} </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { date } from 'quasar'
import VueHtml2pdf from 'vue-html2pdf'

export default {
  name: 'PageIndex',
  components: {
    VueHtml2pdf
  },
  data () {
    return {
      modalWs: false,
      splitterWidth: 40,
      admins: [],
      apiUrl: process.env.API_URL,
      columns: [
        { name: 'detalle', required: true, label: 'Detalle', align: 'center', field: 'detalle', style: 'width: 50px' },
        { name: 'nombre', align: 'center', label: 'Nombre', field: 'nombre' },
        { name: 'descripcion', align: 'center', label: 'Descripción', field: 'descripcion' },
        { name: 'precio', align: 'center', label: 'Precio', field: 'precio', format: (val, row) => (val).toFixed(2), style: 'width: 100px' },
        { name: 'total', align: 'center', label: 'Total', field: 'total', format: (val, row) => (val).toFixed(2), style: 'width: 100px' }
      ]
    }
  },
  mounted () {
    this.listarEmpleados(this.$axios)
      .then((response) => {
        console.log(response.data)
        this.loadingEmpleados = false
        this.admins = response.data
      })
      .catch((error) => {
        console.log(error.response)
      })
  },
  computed: {
    ...mapState('auth', ['user']),
    ...mapState('cart', ['productos']),
    detalles () {
      const detalles = []
      this.productos.forEach((e, i) => {
        const detalle = {
          detalle: i + 1,
          nombre: e.nombre,
          descripcion: e.presentacion,
          precio: e.precio,
          cantidad: e.cantidad,
          total: e.precio * e.cantidad
        }
        detalles.push(detalle)
      })
      return detalles
    },
    total () {
      let total = 0
      this.productos.forEach(p => {
        total += p.precio * p.cantidad
      })
      return total
    },
    fechaActual () {
      return date.formatDate(Date.now(), 'YYYY-MM-DD')
    }
  },
  methods: {
    ...mapActions('users', ['listarEmpleados']),
    generateReport () {
      this.$refs.html2Pdf.generatePdf()
    },
    enviarWS (cell) {
      let url
      const platf = this.$q.platform.is

      if (cell[0] === '0') {
        cell = '593' + cell.substring(1, cell.length)
      }

      let total = 0
      let texto = '*Pedido:* %0D%0A'
      this.productos.forEach((o, i) => {
        texto += '*' + o.nombre + '*' + ' x ' + o.cantidad + '%0D%0A'
        total += o.precio
      })

      total = total + total * 0.12

      texto += '----------------------------------------------' + '%0D%0A'
      texto += '*Total Aproximado* : $' + total

      if (platf.mobile) {
        url = 'https://api.whatsapp.com/send?phone=' + cell + '&text='
        return url
      } else if (platf.desktop) {
        url = 'https://web.whatsapp.com/send?phone=' + cell + '&text='
      }

      url += texto + '*'

      console.log(url)
      this.modalWs = false
      window.open(url, '_blank')
    }
  }
}
</script>

<style lang="scss">
 /*  .cabecera {
    background-image: url('/statics/facctura_header.svg');
    background-repeat: no-repeat;
    background-size: 80%;
  } */

  .cabecera-2 {
    display: grid;
    grid-template-columns: 50% 50%;
  }

  .footer-1 {
    display: grid;
    grid-template-columns: auto 275px;
  }

  /* .footer {
    background-image: url('/statics/facctura_footer.svg');
    background-repeat: no-repeat;
    background-size: 80%;
    background-position: bottom right;
    padding-bottom: 8rem;
  } */

  .factura {
    background-image: url('/statics/bg_factura.svg');
    background-repeat: no-repeat;
    background-size: 100%;

    /* min-height: 3508px;
    min-width: 2480px;
    max-height: 3508px;
    max-width: 2480px; */
    min-width: 800px;
    max-width: 800px;
  }

  .q-table thead, .q-table tr, .q-table th, .q-table td {
    border-color: rgba(0,0,0,0.12) !important;
  }
</style>
