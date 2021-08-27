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
				name: "pool",
				path: "pool",
				component: () => import("pages/pool/PoolView.vue"),
				meta: { transition: "overlay-right" },
			},
			{
				name: "token",
				path: "token",
				component: () => import("pages/token/TokenView.vue"),
				meta: { transition: "overlay-right" },
			},
			{
				name: "profile",
				path: "profile",
				component: () => import("pages/user/ProfileView.vue"),
				meta: { transition: "overlay-right" },
			},
			{
				name: "asset",
				path: "/asset",
				component: () => import("pages/asset/AssetView.vue"),
				meta: { transition: "overlay-right" },
			},
			{
				name: "pool",
				path: "/pool",
				component: () => import("pages/pool/PoolView.vue"),
				meta: { transition: "overlay-right" },
			},
			{
				name: "ptsl",
				path: "ptsl",
				component: () => import("pages/asset/PTSLView.vue"),
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
