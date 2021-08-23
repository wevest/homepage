//https://orlandster.github.io/vue-page-transition/#/zoom/default

const routes = [
  	{
    	path: "/",
		redirect: 'home',
		component: () => import("layouts/MainLayout.vue"),
    	children: [
			{
				name: "home",
				path: "home",
				component: () => import("pages/home/HomeView.vue"),
				meta: { transition: "zoom" },
			},
			{
				name: "about",
				path: "about",
				component: () => import("pages/about/AboutView.vue"),
				meta: { transition: "zoom" },
			},
			{
				name: "signin",
				path: "signin",
				component: () => import("pages/user/SignView.vue"),
				meta: { transition: "overlay-right" },
			},
			{
				name: "user_activation",
				path: "user_activation",
				component: () => import("pages/user/ActivationView.vue"),
				meta: { transition: "overlay-right" },
			},
			{
				name: "user_activation_notification",
				path: "user_activation_notification",
				component: () => import("pages/user/ActivationNotificationView.vue"),
				meta: { transition: "overlay-right" },
			},
			// cms related
			{
				name: "blog",
				path: "blog",
				component: () => import("pages/blog/BlogView.vue"),
				meta: { transition: "overlay-right" },
			},
			{
				name: "blog_detail",
				path: "blog_detail",
				component: () => import("pages/blog/BlogDetailView.vue"),
				meta: { transition: "overlay-right" },
			},
			{
				name: "blog_writer",
				path: "blog_writer",
				component: () => import("pages/writer/BlogWriterView.vue"),
				meta: { transition: "overlay-right" },
			},
			{
				name: "feeds",
				path: "feeds",
				component: () => import("pages/feed/FeedView.vue"),
				meta: { transition: "overlay-right" },
			},
			{
				name: "profile",
				path: "profile",
				component: () => import("pages/user/ProfileView.vue"),
				meta: { transition: "overlay-right" },
			},
			{
				name: "message",
				path: "message",
				component: () => import("pages/user/MessageView.vue"),
				meta: { transition: "overlay-right" },
			},
			{
				name: "message_detail",
				path: "message_detail",
				component: () => import("pages/user/MessageDetailView.vue"),
				meta: { transition: "overlay-right" },
			},
			{
				name: "portfolio_index",
				path: "portfolio_index",
				component: () => import("pages/portfolio/PortfolioIndexView.vue"),
				meta: { transition: "overlay-right" },
			},
			{
				name: "portfolio_detail",
				path: "portfolio_detail",
				component: () => import("pages/portfolio/PortfolioDetailView.vue"),
				meta: { transition: "overlay-right" },
			},
			{
				name: "asset_index",
				path: "/asset_index",
				component: () => import("pages/asset/AssetIndexView.vue"),
				meta: { transition: "overlay-right" },
			},
			{
				name: "asset",
				path: "/asset",
				component: () => import("pages/asset/AssetView.vue"),
				meta: { transition: "overlay-right" },
			},
			{
				name: "asset_detail",
				path: "/asset_detail",
				component: () => import("pages/asset/AssetDetailView.vue"),
			},
			{
				name: "assetqa",
				path: "/assetqa",
				component: () => import("pages/assetqa/AssetQAView.vue"),
				meta: { transition: "overlay-right" },
			},
			{
				name: "asset_holder",
				path: "/asset_holder",
				component: () => import("pages/asset/AssetHolderView.vue"),
				meta: { transition: "overlay-right" },
			},
			{
				name: "assetreview",
				path: "/assetreview",
				component: () => import("pages/assetreview/AssetReviewView.vue"),
				meta: { transition: "overlay-right" },
			},
			{
				name: "assetqa_detail",
				path: "/assetqa_detail",
				component: () => import("pages/assetqa/AssetQADetailView.vue"),
				meta: { transition: "overlay-right" },
			},
			{
				name: "assetqa_answer_writer",
				path: "/assetqa_answer_writer",
				component: () => import("pages/writer/AnswerWriterView.vue"),
				meta: { transition: "overlay-right" },
			},
			{
				name: "assetqa_question_writer",
				path: "/assetqa_question_writer",
				component: () => import("pages/writer/QuestionWriterView.vue"),
				meta: { transition: "overlay-right" },
			},
			{
				name: "market",
				path: "/market",
				component: () => import("pages/market/MarketView.vue"),
				meta: { transition: "overlay-right" },
			},
			{
				name: "portfolio",
				path: "portfolio",
				component: () => import("pages/portfolio/PortfolioView.vue"),
			},

			// market related
			{
				name: "trend",
				path: "trend",
				component: () => import("pages/trend/TrendView.vue"),
			},
			{
				name: "cwatch",
				path: "cwatch",
				component: () => import("pages/cwatch/CWatchView.vue"),
			},
			{ path: "world", component: () => import("pages/world/WorldView.vue") },
			{
				name: "sector",
				path: "sector",
				component: () => import("pages/sector/SectorView.vue"),
			},
			{ path: "risk", component: () => import("pages/risk/RiskView.vue") },

			//research menus
			{
				name: "cryptovc",
				path: "cryptovc",
				component: () => import("pages/cryptovc/CryptovcView.vue"),
			},
			{
				name: "vcportfolio",
				path: "vcportfolio",
				component: () => import("pages/vcportfolio/VCPortfolioView.vue"),
			},
			{
				name: "tweet_detail",
				path: "tweet_detail",
				component: () => import("pages/tweet/TweetDetailView.vue"),
			},
			{
				name: "tweet_writer",
				path: "tweet_writer",
				component: () => import("pages/writer/TweetWriterView.vue"),
			},
			{
				name: "change_password",
				path: "change_password",
				component: () => import("pages/user/ChangePasswordView.vue"),
			},
			{
				name: "forgot_password",
				path: "forgot_password",
				component: () => import("pages/user/ForgotPasswordView.vue"),
			},
			{
				name: "reset_notification",
				path: "reset_notification",
				component: () => import("pages/user/ResetNotificationView.vue"),
			},
			{
				name: "notification",
				path: "notification",
				component: () => import("pages/notification/NotificationView.vue"),
			},
			{
				name: "bookmark",
				path: "bookmark",
				component: () => import("pages/bookmark/BookmarkView.vue"),
			},
			{
				name: "add_bookmark",
				path: "add_bookmark",
				component: () => import("pages/bookmark/AddBookmarkView.vue"),
			},
			{
				name: "error_404",
				path: "error_404",
				component: () => import("pages/Error404.vue"),
			},

			{ path: "swap", component: () => import("pages/swap/SwapView.vue") },			
		],
	},

  	// Always leave this as last one,
  	// but you can also remove it
	{
    	path: "*",
    	component: () => import("pages/Error404.vue"),
  	},
];

export default routes;
