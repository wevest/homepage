<template>

    <div class="q-ma-md" style="background-color: #FF0063;">
        <div>
            
            <div style="padding:100px;">
                <q-img src="~assets/images/asian_man.png" style="background-color: #FF0063; border-style:solid;border-width:10px;border-top-style:none;" />
            </div>
              <div class="text-center">
                <h3>
                    <b>‘Yield farming + position swap’</b>
                    <br>
                    made it possible
                </h3>
                <p>
                Wevest protocol utilize ‘collateral + loan’ and position swap to setoff interest rate.<br>
                lenders maximize interest income through yield farming, including their own funds <br>
                as well as borrowers' collateral, rather than earning interest income with only their own funds,<br>
                and borrowers can borrow more than the collateral, with no interest and no maturities.<br>

                </p>
            </div>

        </div>

    </div>

</template>

<script>

import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';

import CTitle from 'src/components/CTitle';


export default {
    name: 'YieldView',
    components: {
        CTitle
    },
    data() {
        return {

        }
    },

    methods: {


        }
    }
</script>

<style scoped>
</style>