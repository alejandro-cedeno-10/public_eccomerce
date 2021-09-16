const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') },
      { path: 'index', component: () => import('pages/Index.vue') },
      { path: 'mi_compra', component: () => import('pages/MiCompra.vue') },
      { path: 'productos_de/:categoria', component: () => import('pages/ProductosDe.vue') },
      { path: 'add_producto', component: () => import('pages/AddProducto.vue') },
      { path: 'factura', component: () => import('pages/Factura.vue') },
      { path: 'info_personal', component: () => import('pages/InfoPersonal.vue') },
      { path: 'cambiar_pass', component: () => import('pages/cambiarPass.vue') },
      { path: 'metodos_pago', component: () => import('pages/MetodosPago.vue') }
    ],
    // beforeEnter: guardMyroute
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/',
    component: () => import('layouts/NoBar.vue'),
    children: [
      { path: 'producto/:id_producto', component: () => import('pages/VerProducto.vue') }
    ],
    // beforeEnter: guardMyroute
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/',
    component: () => import('layouts/ReturnLayout.vue'),
    children: [
      { path: 'admin_panel', component: () => import('pages/PanelAdmin.vue') },
      { path: 'user_panel', component: () => import('pages/PanelUsuarios.vue') },
      { path: 'admin_categorias', component: () => import('pages/AdminCategorias.vue') },
      { path: 'admin_productos', component: () => import('pages/AdminProductos.vue') },
      { path: 'admin_tamanos', component: () => import('pages/AdminTamanos.vue') },
      { path: 'admin_empleados', component: () => import('pages/AdminUsuarios.vue') },
      { path: 'admin_clientes', component: () => import('pages/AdminClientes.vue') }
    ],
    // beforeEnter: guardMyroute
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    component: () => import('layouts/Login.vue')
  },
  {
    path: '/registrar',
    component: () => import('layouts/RegistrarUsuario.vue')
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
