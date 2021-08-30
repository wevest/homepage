<template>
    <div class="countdown">
        <div v-if="visible">
            <span>{{caption}}</span> <span class="text-red-10">&nbsp;<b>{{ v_timeLeft }}</b> </span>
        </div>        
    </div>    
</template>


<script>

function zeroPadded(num) {
  // 4 --> 04
  return num < 10 ? `0${num}` : num;
}

function hourConvert(hour) {
  // 15 --> 3
  return (hour % 12) || 12;
}


export default{
    props: {
        //value: { type:String},
        caption: { default:"" },
        visible: { default:true },
    },
    data() {
        return {
            intervalTimer: null,
            v_selectedTime: 0,
            v_timeLeft: '00:00',            
            v_endTime: '0',
            v_times: [
                {
                    sec: 3,
                    display: '3s'
                },
                {
                    sec: 600,
                    display: ' 10m'
                },
                {
                    sec: 1800,
                    display: '30m'
                }            
            ]
        }
    },
    methods: {
        setTime(seconds) {
            clearInterval(this.intervalTimer);
            this.timer(seconds);
        },
        reset() {
            clearInterval(this.intervalTimer);
            this.displayTimeLeft(0);
        },

        timer(seconds) {
            const now = Date.now();
            const end = now + seconds * 1000;
            this.displayTimeLeft(seconds);

            this.v_selectedTime = seconds;
            // this.initialTime = seconds;
            this.displayEndTime(end);
            this.countdown(end);
        },
        countdown(end) {
            // this.initialTime = this.selectedTime;
            const _this = this;

            this.intervalTimer = setInterval(() => {
                const secondsLeft = Math.round((end - Date.now()) / 1000);

                if(secondsLeft === 0) {
                    this.v_endTime = 0;
                }

                if(secondsLeft < 0) {
                    clearInterval(this.intervalTimer);
                    _this.$emit("onTimeout",{});
                    return;
                }
                this.displayTimeLeft(secondsLeft)
            }, 1000);
        },
        displayTimeLeft(secondsLeft) {
            const minutes = Math.floor((secondsLeft % 3600) / 60);
            const seconds = secondsLeft % 60;

            this.v_timeLeft = `${zeroPadded(minutes)}:${zeroPadded(seconds)}`;
        },
        displayEndTime(timestamp) {
            const end = new Date(timestamp);
            const hour = end.getHours();
            const minutes = end.getMinutes();

            this.v_endTime = `${hourConvert(hour)}:${zeroPadded(minutes)}`
        },
    }
};

</script>



<style scoped>

</style>