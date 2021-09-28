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
				title: this.$t('menu.win'), icon: "monetization_on",level: 0,
				link: "#/win",
				children: [],
			},
			{
				title: "paradigm", icon: "article", level: 0,
				link: "#/paradigm",
				children: [],
			},
			{
				title: "yield", icon: "feed", level: 0,
				link: "#/yield",				
				children: [],
			},
			{
				title: "risk", icon: "feed", level: 0,
				link: "#/risk",				
				children: [],
			},
/*			
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
*/			
		];


	}
};
</script>
