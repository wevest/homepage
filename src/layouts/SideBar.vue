<template>
	<q-list>
		<q-item-label header class="text-grey-8"> WeVest </q-item-label>

		<EssentialLink
			v-for="link in linksMenu"
			:key="link.title"
			v-bind="link"
		/>
	</q-list>
</template>



<script>
import EssentialLink from "components/EssentialLink.vue";

const linksMenu = [
	{
		title: "Home",
		caption: "오늘의 크립토시장",
		icon: "school",
		link: "/",
		level: 0,
		children: [],
	},
	{
		title: "뉴스",
		caption: "뉴스",
		icon: "chat",
		link: "#/blog",
		level: 0,
		children: [],
	},
	{
		title: "피드",
		caption: "피드",
		icon: "chat",
		link: "#/feeds",
		level: 0,
		children: [],
	},
	{
		title: "애셋",
		caption: "애셋",
		icon: "chat",
		link: "#/asset_index",
		level: 0,
		children: [],
	},
	{
		title: "포트폴리오",
		caption: "포트폴리오",
		icon: "chat",
		link: "#/portfolio_index",
		level: 0,
		children: [],
	},
	{
		title: "Misc",
		caption: "Misc",
		icon: "chat",
		link: "#",
		level: 0,
		children: [
			{
				title: "마켓 와치",
				caption: "마켓와치",
				icon: "chat",
				link: "#/cwatch",
				level: 1,
				children: [],
			},
			{
				title: "시장동향",
				caption: "시장동향",
				icon: "chat",
				link: "#/trend",
				level: 1,
				children: [],
			},
			{
				title: "섹터지수",
				caption: "섹터별지수",
				icon: "code",
				link: "#/sector",
				level: 1,
				children: [],
			},
			{
				title: "World View",
				caption: "전세계 동향",
				icon: "record_voice_over",
				link: "#/world",
				level: 1,
				children: [],
			},
			{
				title: "Risk",
				caption: "Market Risk",
				icon: "record_voice_over",
				link: "#/risk",
				level: 1,
				children: [],
			},
			{
				title: "Research",
				caption: "Research",
				icon: "rss_feed",
				link: "#",
				level: 1,
				children: [
					{
						title: "Crypto VC",
						caption: "CryptoVC",
						icon: "",
						link: "#/cryptovc",
						level: 2,
						children: [],
					},
					{
						title: "VC Portfolio",
						caption: "CryptoVC Portfolio",
						icon: "",
						link: "#/vcportfolio",
						level: 2,
						children: [],
					},
				],
			},
		],
	},
];

export default {
	components: {
		EssentialLink,
	},
	data() {
		return {
			linksMenu: linksMenu,
		};
	},
};
</script>
