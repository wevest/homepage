<template>
<!-- pool-add-page-START -->
    <div>
        <div class="">
            <CTitle ttype='title' 
                :title="$t('page.pool.title')" :desc="$t('page.pool.desc')" 
                extraCaption="Add" @onClickTitleExtra="onClickAdd" />
        </div>   
        <div class="gDialogTitle"> 
            {{ $t('page.pool.addLiquidity.title') }}
        </div>
        <div class="row q-my-md">
            <div class="q-mx-xs"> 
                <q-select style="width: 200px" outlined v-model="model" :options="options" :label="$t('button.coinSelect')"  />
            </div>
        </div>
        <div class="gBoarder2 q-mb-sm q-pa-md"> 
            <div class="q-mb-sm gSubTitle">
                {{ $t('page.pool.poolRatio.title') }}
            </div>
            <div class="full-width">
                <q-btn-toggle
                v-model="v_utilization"
                toggle-color="primary"
                spread
                :options="[
                    {label: '0%', value: '0'},
                    {label: '25%', value: '25'},
                    {label: '50%', value: '50'},
                    {label: '75%', value: '75'}, 
                    {label: '100%', value: '100'} 
                    ]" />
            </div>   
            <div class="q-mt-md">
                <q-badge color="secondary">
                        Model: {{ basicModel }} (0 to 100, step 5)
                        </q-badge>
                        <q-slider
                        v-model="basicModel"
                        :step="5"
                        label-always
                        color="primary"
                        />
            </div>
        </div>
        <div class="gBoarder2 text-center">
            <div class="q-my-lg"> 
                <q-icon color="grey-7" size="60px" name="move_to_inbox" />
            </div>
            <div class="q-my-md poolListDesc"> 
               {{ $t('page.pool.poolList.desc') }}
            </div>
            <div class="q-my-lg">  
                <q-btn color="primary" rounded :label="$t('button.connectWallet')" />
            </div>
        </div>
    </div>

<!-- pool-add-page-END  -->

</template>

<script>

export default {

};
</script>


<style scoped>

</style>