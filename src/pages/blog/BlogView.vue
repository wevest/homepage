<template>
    
    <div class="q-pa-md">
        <div>
            <CTitle ttype='title' :title="$t ('page.blog.title')" :desc="$t ('page.blog.desc')"></CTitle>          
        </div>

		<div class="q-my-md">
			
			<WCategoryChip ref="categoryChip" color="primary" textColor="white" 
				:data="v_options" @onClickCategory="onClickCategory"
			/>

		</div>

        <q-separator class="gSeparator" />
        <div>
            <WWriterButton placeholder="Please share your knowledges" @onClickWrite="onClickWrite" />
        </div>

        <q-separator class="gSeparator" />

        <div>
            <BlogList ref='blogList' maxLength="2000000"
                :title="v_list_title" :desc="$t('page.blogwriter.bloglist.desc')"
                category="" :symbol="g_asset.symbol" :objectId="g_asset.object_id"
            ></BlogList>
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
import WWriterButton from 'components/WWriterButton';
import BlogList from 'components/lists/BlogList';
import WCategoryChip from "components/WCategoryChip";

export default {
    name: 'BlogIndex',
    components: {
        CTitle,
        BlogList,
        WWriterButton,
        WCategoryChip
    },
    data: function() {
        return {
            g_asset: {
                category:null,
                symbol:null,
                object_id: null
            },

			v_options: [
				{label:'최신뉴스', value:'latest', icon:'event', selected:true},
				{label:'좋아요 많은 뉴스', value:'voted', icon:'event', selected:false},
				{label:'댓글 많은 뉴스', value:'comments', icon:'event', selected:false},
			],
			v_category: null,			
			v_list_title: '',

        }
    },
    created: function () {
        //console.log("HomeView.created");
        console.log("BlogView.created - query=",this.$route.query);

        //this.validateQuery();

        this.g_asset.category = this.$route.query.category;
        this.g_asset.symbol = this.$route.query.symbol;
        this.g_asset.object_id = parseInt(this.$route.query.id);
    },
    mounted: function() {
        //this.g_asset.symbol = 'BTC';
        //this.g_asset.object_id = 20;

        this.refresh(this.g_asset);
    },
    methods: {
        validateQuery() {
            
            if (! CommonFunc.isEmptyObject(this.$route.query.category)) {
                return;
            }

            CommonFunc.navError404(this);
        },        
        refresh: function(symbol,offset=360) {
            logger.log.debug('Refresh - ',symbol,offset);

            if ( (!symbol) || ( (symbol.length)==0 ) ) {
                return
            }

            this.loadBlogList();

        },

        loadBlogList: function() {
            //const category = CONST.ASSETPAGE_CATEGORY+this.g_asset.symbol;
            //console.log('AssetView.loadBlogList - ',category);            
            this.$refs.blogList.updateByCategory(this.g_asset.category);
        },

        navWriter:function() {
            let a_post = new PostPageModel();            
            a_post.setContentType(CONST.CONENT_TYPE_BLOGPAGE);
            a_post.category_name = this.g_asset.category;

            store.getters.nav.add(this.$route); 

            let dic_param = { name:'blog_writer', params:{post:a_post} };
            this.$router.push(dic_param);
        },

        onClickWrite: function() {
            logger.log.debug('AssetQAView.onClickWrite');
            this.navWriter();
        },

		onClickCategory(option) {
			logger.log.debug("PortfolioIndexView.onClickCategory : option=",option);
			this.v_category = option;
			this.refresh();
		}

    }

};

</script>
