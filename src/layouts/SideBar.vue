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

export default {
	components: {
		EssentialLink,
	},
	data() {
		return {
			linksMenu: [],
		};
	},
	created() {

		this.linksMenu = [
			{
				title: this.$t('menu.home'), icon: "home", level: 0,
				link: "/",				
				children: []
			},
			{
				title: this.$t('menu.portfolio'), icon: "business_center",level: 0,
				link: "#/portfolio_index",				
				children: [],
			},
			{
				title: this.$t('menu.news'), icon: "article", level: 0,
				link: "#/blog",
				children: [],
			},
			{
				title: this.$t('menu.feeds'), icon: "feed", level: 0,
				link: "#/feeds",				
				children: [],
			},
			{
				title: this.$t('menu.asset'), icon: "monetization_on",level: 0,
				link: "#/asset_index",				
				children: [],
			},
			{
				title: this.$t('menu.about'), icon: "info",level: 0,
				link: "#",				
				children: [				
					{
						title: this.$t('menu.about_wevest'), icon: "crop_landscape", level: 1,						
						link: "#/about",
						children: [],
					},
				],

			}
		];
		
		const linksMenu2 = [
			{
				title: "Misc",caption: "Misc",icon: "chat", level: 0,
				link: "#",
				children: [
					{
						title: "마켓 와치",caption: "마켓와치",icon: "chat",level: 1,
						link: "#/cwatch",						
						children: [],
					},
					{
						title: "시장동향",caption: "시장동향",icon: "chat",level: 1,
						link: "#/trend",						
						children: [],
					},
					{
						title: "섹터지수",caption: "섹터별지수",icon: "code",level: 1,
						link: "#/sector",						
						children: [],
					},
					{
						title: "World View",caption: "전세계 동향",icon: "record_voice_over",level: 1,
						link: "#/world",						
						children: [],
					},
					{
						title: "Risk",caption: "Market Risk",icon: "record_voice_over",level: 1,
						link: "#/risk",						
						children: [],
					},
					{
						title: "Research",caption: "Research",icon: "rss_feed",level: 1,
						link: "#",						
						children: [
							{
								title: "Crypto VC",caption: "CryptoVC",icon: "",level: 2,
								link: "#/cryptovc",								
								children: [],
							},
							{
								title: "VC Portfolio",caption: "CryptoVC Portfolio",icon: "",level: 2,
								link: "#/vcportfolio",								
								children: [],
							},
						],
					},
				],
			},
		];

	}
};
</script>
