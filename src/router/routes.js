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
				name: "freeloan",
				path: "freeloan",
				component: () => import("pages/home/FreeloanView.vue"),
				meta: { transition: "zoom" },
			},
			{
				name: "paradigm",
				path: "paradigm",
				component: () => import("pages/home/ParadigmView.vue"),
				meta: { transition: "overlay-right" },
			},
			{
				name: "win",
				path: "win",
				component: () => import("pages/home/WinView.vue"),
				meta: { transition: "overlay-right" },
			},
			{
				name: "yield",
				path: "yield",
				component: () => import("pages/home/YieldView.vue"),
				meta: { transition: "overlay-right" },
			},
			{
				name: "risk",
				path: "risk",
				component: () => import("pages/home/RiskView.vue"),
				meta: { transition: "overlay-right" },
			},

			{
				name: "error_404",
				path: "error_404",
				component: () => import("pages/Error404.vue"),
			},
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
