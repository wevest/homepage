const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/home/HomeView.vue') },
      { path: 'trend', component: () => import('pages/trend/TrendView.vue') },
      { path: 'cwatch', component: () => import('pages/cwatch/CWatchView.vue') },
      { path: 'world', component: () => import('pages/world/WorldView.vue') },
      { path: 'sector', component: () => import('pages/sector/SectorView.vue') },
      { path: '/asset', name:'asset', component: () => import('pages/asset/AssetView.vue') },
      { path: 'risk', component: () => import('pages/risk/RiskView.vue') },
      { path: 'cryptovc', component: () => import('pages/cryptovc/CryptovcView.vue') },
      
      { path: 'kbeater', component: () => import('pages/kbeater/BeaterView.vue') },
      { path: 'kinstrument', component: () => import('pages/instrument/InstrumentView.vue') },
      { path: 'wkospi', component: () => import('pages/kstockw/WeeklyView.vue') },
      { path: 'dkospi', component: () => import('pages/kstockd/DailyView.vue') },
    ],    
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
