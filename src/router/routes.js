const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { name: 'home', path: '', component: () => import('pages/home/HomeView.vue') },
      { name: 'signin', path: 'signin', component: () => import('pages/user/SignView.vue') },
      
      // cms related
      { name: 'blog', path: 'blog', component: () => import('pages/blog/BlogView.vue') },
      { name: 'blog_detail', path: 'blog_detail', component: () => import('pages/blog/BlogDetailView.vue') },
      { name: 'blog_writer', path: 'blog_writer', component: () => import('pages/blog/BlogWriterView.vue') },
      { name: 'profile', path: 'profile', component: () => import('pages/user/ProfileView.vue') },
      { name: 'message', path: 'message', component: () => import('pages/user/MessageView.vue') },
      { name: 'message_detail', path: 'message_detail', component: () => import('pages/user/MessageDetailView.vue') },
      { name: 'portfolio_detail', path: 'portfolio_detail', component: () => import('pages/portfolio/PortfolioDetailView.vue') },
      
      { name: 'asset_index', path: '/asset_index', component: () => import('pages/asset/AssetIndexView.vue') },
      { name: 'asset', path: '/asset', component: () => import('pages/asset/AssetView.vue') },
      { name: 'asset_detail', path: '/asset_detail', component: () => import('pages/asset/AssetDetailView.vue') },
      { name: 'assetqa', path: '/assetqa', component: () => import('pages/assetqa/AssetQAView.vue') },
      { name: 'assetreview', path: '/assetreview', component: () => import('pages/assetreview/AssetReviewView.vue') },
      { name: 'assetqa_detail', path: '/assetqa_detail', component: () => import('pages/assetqa/AssetQADetailView.vue') },
      { name: 'assetqa_answer_writer', path: '/assetqa_answer_writer', component: () => import('pages/assetqa/AnswerWriterView.vue') },
      { name: 'assetqa_question_writer', path: '/assetqa_question_writer', component: () => import('pages/assetqa/QuestionWriterView.vue') },

      //{ name: 'portfolio', path: 'portfolio', component: () => import('pages/user/PortfolioView.vue') },
      //{ name: 'portfolio', path: 'portfolio', component: () => import('pages/user/PortfolioView.vue') },

      // market related
      { name: 'trend', path: 'trend', component: () => import('pages/trend/TrendView.vue') },
      { name: 'cwatch', path: 'cwatch', component: () => import('pages/cwatch/CWatchView.vue') },
      { path: 'world', component: () => import('pages/world/WorldView.vue') },
      { name: 'sector', path: 'sector', component: () => import('pages/sector/SectorView.vue') },
      { path: 'risk', component: () => import('pages/risk/RiskView.vue') },
      
      //research menus
      { name:'cryptovc', path: 'cryptovc', component: () => import('pages/cryptovc/CryptovcView.vue') },
      { name: 'vcportfolio', path: 'vcportfolio', component: () => import('pages/vcportfolio/VCPortfolioView.vue') },
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
