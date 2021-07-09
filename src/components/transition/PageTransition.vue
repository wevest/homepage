<template>
	<div>
		<transition :name="transition" :mode="mode">
			<slot></slot>
		</transition>
		<div class="overlay-top"></div>
		<div class="overlay-right"></div>
		<div class="overlay-bottom"></div>
		<div class="overlay-left"></div>
	</div>
</template>

<script>
import CommonFunc from "src/util/CommonFunc";
import logger from "src/error/Logger";


export default {
	name: "PageTransition",
	props: ["name"],
	data() {
		return {
			transition: "fade",
			mode: "out-in",
		};
	},
	created() {
		this.$router.beforeEach((to, from, next) => {
            
            logger.log.debug("PageTransition : to=",to);

			this.transition = to.meta.transition
				? to.meta.transition
				: this.$props.name;
			next();
		});
	},
};
</script>

<style>
:root {
	--overlay-bg: #fafafa;
	--transition-duration: 0.35s;
}
</style>

<style lang="scss" scoped>
// fade
@import "src/components/transition/styles/transitions/fade/fade";
@import "src/components/transition/styles/transitions/fade/fade-in-down";
@import "src/components/transition/styles/transitions/fade/fade-in-right";
@import "src/components/transition/styles/transitions/fade/fade-in-up";
@import "src/components/transition/styles/transitions/fade/fade-in-left";
// zoom
@import "src/components/transition/styles/transitions/zoom/zoom";
// flip
@import "src/components/transition/styles/transitions/flip/flip-x";
@import "src/components/transition/styles/transitions/flip/flip-y";

// overlay
@import "src/components/transition/styles/transitions/overlay/overlay-right";
@import "src/components/transition/styles/transitions/overlay/overlay-down";
@import "src/components/transition/styles/transitions/overlay/overlay-up";
@import "src/components/transition/styles/transitions/overlay/overlay-left";
@import "src/components/transition/styles/transitions/overlay/overlay-up-full";
@import "src/components/transition/styles/transitions/overlay/overlay-right-full";
@import "src/components/transition/styles/transitions/overlay/overlay-down-full";
@import "src/components/transition/styles/transitions/overlay/overlay-left-full";
@import "src/components/transition/styles/transitions/overlay/overlay-up-down";
@import "src/components/transition/styles/transitions/overlay/overlay-left-right";

// slide
@import "src/components/transition/styles/transitions/slide/slide-up";
</style>
