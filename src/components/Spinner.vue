<template>
    <div v-show="isLoading" class="lds-dual-ring" :style="{ width: `${size}px`, height: `${size}px` }">
        <div class="lds-dual-ring-after" v-bind:style="[spinnerStyle]"></div>
    </div>
</template>

<script>
//import validateDuration from '../helpers/validateDuration.js'

export default {
    name: 'Spinner',
    props: {
        loading: {
            type: Boolean,
            default: false,
        },
        size: {
            type: Number,
            default: 80,
        },
        color: {
            type: String,
            default: '#7f58af',
        },
        duration: {
            type: String,
            default: '1.2s',
            //validator: validateDuration,
        },
    },
    data() {
        return {
            g_lock: 0,            
            isLoading:false,

            spinnerStyle: {
                borderWidth: `${this.size * 0.075}px`,
                borderColor: `${this.color} transparent`,
                animationDuration: this.duration,
            },
        }
    },


    methods: {
        reset() {
            this.g_lock = 0;
            this.isLoading = false;
        },

        show() {
            console.log('spinner loading');
        
            this.g_lock += 1;

            if (this.isLoading) {
                return;
            }
            this.isLoading = true;
        },
        hide() {
            this.g_lock -= 1;

            console.log('spinner hide : g_lock=',this.g_lock);

            if (this.g_lock<=0) {
                this.isLoading = false;
                this.g_lock = 0;
            }
        
        }
    }    
}
</script>

<style scoped>
.lds-dual-ring {
    position: fixed;
    z-index: 999;
    overflow: show;
    margin: auto;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 50px;
    height: 50px;    
}

.lds-dual-ring-after {
    content: ' ';
    display: block;
    
    /* ratio: calc(64px / 80px) */
    width: 80%;
    height: 80%;
    /* ratio: calc(8px / 80px) */
    margin: 10%;

    border-radius: 50%;
    border: 6px solid #000;
    border-color: #000 transparent #000 transparent;
    animation-name: lds-dual-ring;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
}
@keyframes lds-dual-ring {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>