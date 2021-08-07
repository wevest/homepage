<template>
    
    <div class="q-pa-md">
        <div>
            <CTitle ttype='title' :title="$t('page.bookmark.title')" :desc="$t('page.bookmark.desc')"></CTitle>
        </div>

		<div class="q-my-md">
			
			<WCategoryChip ref="categoryChip" color="primary" textColor="white" 
				:data="v_options" @onClickCategory="onClickCategory"
			/>

		</div>

        <q-separator class="gSeparator" />
        <div>
            <WWriterButton :placeholder="$t('name.blog_writing')" @onClickWrite="onClickWrite" />
        </div>
        <!-- Please share your knowledges -->
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
				{label:this.$t('name.latest_news'), value:'latest', selected:true},
				{label:this.$t('name.trending_news'), value:'voted', selected:false},
				{label:this.$t('name.comments_news'), value:'comments', selected:false},
			],
			v_category: null,			
			v_list_title: '',

        }
    },
    created() {
        //console.log("HomeView.created");
        logger.log.debug("BlogView.created - query=",this.$route.query);

        //this.validateQuery();

        this.g_asset.category = this.$route.query.category;
        this.g_asset.symbol = this.$route.query.symbol;
        this.g_asset.object_id = parseInt(this.$route.query.id);
    },
    mounted() {
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
        refresh(symbol,offset=360) {
            logger.log.debug('Refresh - ',symbol,offset);

            if ( (!symbol) || ( (symbol.length)==0 ) ) {
                return
            }

            this.loadBlogList();

        },

        loadBlogList() {
            //const category = CONST.ASSETPAGE_CATEGORY+this.g_asset.symbol;
            logger.log.debug('BlogView.loadBlogList - ',this.v_category);
            this.$refs.blogList.updateByCategory(this.v_category);
        },

        navWriter() {
            let a_post = new PostPageModel();            
            a_post.setContentType(CONST.CONENT_TYPE_BLOGPAGE);
            a_post.category_name = this.g_asset.category;

            CommonFunc.navBlogWriter(this,a_post);
        },

        onClickWrite(dicParam) {
            logger.log.debug('BlogView.onClickWrite:dicParam=',dicParam);
            this.navWriter();
        },

		onClickCategory(option) {
			logger.log.debug("BlogView.onClickCategory : option=",option);
			this.v_category = option.value;
            
            this.$refs.blogList.clear();
			this.loadBlogList(this.v_category);
		}

    }

};

</script>
