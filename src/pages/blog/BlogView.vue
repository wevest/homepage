<template>
    
    <div class="q-pa-md">
        <div class="row">
            <div class="col">
                <CTitle ttype='title' title="v_page_title" desc=""></CTitle>          
            </div>
        </div>

        <div>
            <WWriterButton placeholder="Please share your knowledges" @onClickWrite="onClickWrite" />
        </div>

        <q-separator class="gSeparator" />

        <div class="row">
            <div class="col">
                <!--
                <q-btn label="Write" @click="onClickWriteBlog" />
                -->
                <CTitle ttype='subtitle' title="Market Trend" desc="" ></CTitle>
                <BlogList ref='blogList' ></BlogList>
            </div>
        </div>

    </div>    

</template>


<script>
import { CONST } from 'src/data/const';
import { store } from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';
import logger from "src/error/Logger";

import {PostPageModel,QuestionPageModel} from "src/models/PageModel";

import CTitle from 'components/CTitle';
import BlogList from 'components/BlogList';
import WWriterButton from 'components/WWriterButton';


export default {
    name: 'BlogIndex',
    components: {
        CTitle,
        BlogList,
        WWriterButton,
    },
    data: function() {
        return {
            g_asset: {
                symbol:null,
                object_id: null
            },
        }
    },
    created: function () {
        //console.log("HomeView.created");
        console.log("AssetView.created - query=",this.$route.query);

        this.g_asset.symbol = this.$route.query.symbol;
        this.g_asset.object_id = parseInt(this.$route.query.id);
    },
    mounted: function() {
        //this.g_asset.symbol = 'BTC';
        //this.g_asset.object_id = 20;

        this.refresh(this.g_asset);
    },
    methods: {
        refresh: function(symbol,offset=360) {
            logger.log.debug('Refresh - ',symbol,offset);

            if ( (!symbol) || ( (symbol.length)==0 ) ) {
                return
            }

            this.loadBlogList();

        },

        loadBlogList: function() {
            const category = CONST.ASSETPAGE_CATEGORY+this.g_asset.symbol;
            console.log('AssetView.loadBlogList - ',category);            
            this.$refs.blogList.updateByCategory(category);
        },

        navWriter:function() {
            let a_post = new PostPageModel();            
            a_post.setContentType(CONST.CONENT_TYPE_BLOGPAGE);


            store.getters.nav.add(this.$route); 

            let params = {post:a_post};
            let dic_param = { name:'blog_writer', params:params };
            this.$router.push(dic_param);
        },

        onClickWrite: function() {
            logger.log.debug('AssetQAView.onClickWrite');
            this.navWriter();
        },

    }

};

</script>
