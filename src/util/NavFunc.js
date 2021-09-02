import {store} from 'src/store/store';
import CommonFunc from 'src/util/CommonFunc';

import logger from "src/error/Logger";
import Errors from 'src/error/Errors';
import ehandler from 'src/error/EHandler';


export default class NavFunc {

    static navHome(a_this) {
        logger.log.debug("CommonFunc.navHome");
        
        //store.getters.nav.add(a_this.$route);
        let dic_param = { name:'home', path:'home', query:{} };
        a_this.$router.push(dic_param);
    }

    static navBack(a_this) {
        a_this.$router.back();
    }

    static navMarket(a_this) {
        logger.log.debug("CommonFunc.navMarket - ",a_this.$route);
        
        store.getters.nav.add(a_this.$route);
        let dic_param = {name:'market',path:'market',query:{}};
        a_this.$router.push(dic_param);
    }

    static navPoolDetail(a_this) {
        logger.log.debug("CommonFunc.navPoolDetail - ",a_this.$route);
        
        store.getters.nav.add(a_this.$route);
        let dic_param = {name:'pool_detail',path:'pool_detail',query:{}};
        a_this.$router.push(dic_param);
    }

    static navPTSL(a_this) {
        logger.log.debug("CommonFunc.navPTSL - ",a_this.$route);
        
        store.getters.nav.add(a_this.$route);
        let dic_param = {name:'ptsl',path:'ptsl',query:{}};
        a_this.$router.push(dic_param);
    }

    static navSignin(a_this,is_redirect=false) {
        logger.log.debug("CommonFunc.navSignin - ",a_this.$route);
        
        let dic_param = {name:'signin'};
        if (is_redirect) {
            dic_param.params = { path:a_this.$route.name, query:a_this.$route.query };
        }
            
        a_this.$router.push(dic_param);
    }

    static navActivationNotification(a_this) {
        logger.log.debug("CommonFunc.navActivationNotification - ",a_this.$route);
        
        let dic_param = {name:'user_activation_notification'};            
        a_this.$router.push(dic_param);
    }

    static navChangePassword(a_this) {
        logger.log.debug("CommonFunc.navChangePassword - ",a_this.$route);
        
        store.getters.nav.add(a_this.$route);

        let dic_param = {name:'change_password', params:{ path:a_this.$route.name, query:a_this.$route.query }};
        a_this.$router.push(dic_param);
    }

    static navResetNotification(a_this) {
        logger.log.debug("CommonFunc.navResetNotification - ",a_this.$route);    

        let dic_param = {name:'reset_notification', params:{}};
        a_this.$router.push(dic_param);
    }

    static navNotification(a_this) {
        logger.log.debug("CommonFunc.navNotification - ",a_this.$route);    
        
        store.getters.nav.add(a_this.$route);
        let dic_param = {name:'notification', params:{}};
        a_this.$router.push(dic_param);
    }

    static navProfile(a_this,username) {
        logger.log.debug("CommonFunc.navProfile - ",username);
        
        store.getters.nav.add(a_this.$route);
        //CommonFunc.setAppData('selected_author',author);
        let dic_param = { name:'profile', path:'profile', query:{ username:username } };
        a_this.$router.push(dic_param);
    }


    static navPortfolioIndexView(a_this) {
        store.getters.nav.add(a_this.$route);
        let dic_param = { name:'portfolio_index', path:'portfolio_index', query:{} };
        a_this.$router.push(dic_param);    
    }

    static navPortfolioView(a_this,user) {        
        store.getters.nav.add(a_this.$route);
        let dic_param = { 
            name:'portfolio', path:'portfolio', 
            query:{ username:user.username} 
        };
        a_this.$router.push(dic_param);    
    }

    static navPortfolio(a_this,username,portfolio_id) {
        store.getters.nav.add(a_this.$route);
        let dic_param = { 
            name:'portfolio_detail', path:'portfolio_detail', 
            query:{ username:username, portfolio_id:portfolio_id} 
        };
        a_this.$router.push(dic_param);    
    }

    static navHolder(a_this,asset_id,symbol) {
        store.getters.nav.add(a_this.$route);
        let dic_param = { 
            name:'asset_holder', path:'asset_holder', 
            query:{ id:asset_id, symbol:symbol} 
        };
        a_this.$router.push(dic_param);    
    }

    static navTweetDetail(a_this,id) {
        logger.log.debug("CommonFunc.navTweetDetail - ",a_this.$route);

        if ( (! CommonFunc.isEmptyObject(a_this.tab)) && (a_this.tab.length>0) )  {
            a_this.$route.query['tab'] = a_this.tab;
        }

        store.getters.nav.add(a_this.$route);
        let dic_param = { name:'tweet_detail', path:'tweet_detail', query: {id:id} };            
        a_this.$router.push(dic_param);
    }

    static navReview(a_this,symbol,page_id) {
        let dic_param = {
            name: "assetreview",path: "assetreview", query: { symbol:symbol, id: page_id },
        };
        
        logger.log.debug("CommonFunc.navReview - ",dic_param);
        store.getters.nav.add(a_this.$route);
        a_this.$router.push(dic_param);
    }

    
    static navError404(a_this) {
        let dic_param = {
            name: "error_404",path: "error_404", query: {},
        };
        logger.log.debug("navError404 : dic_param=",dic_param);
        a_this.$router.push(dic_param);
    }

    static navBlog(a_this,category,symbol,page_id) {
        let dic_param = {
            name: "blog",path: "blog", query: { category:category, symbol:symbol, id: page_id },
        };        
        store.getters.nav.add(a_this.$route);
        a_this.$router.push(dic_param);
    }
    
    static navBlogDetail(a_this,page_id) {
        let dic_param = {
            name: "blog_detail",path: "blog_detail", query: { page_id: page_id, tab:a_this.tab }, meta: {transition:'zoom'} 
        };
        if ( (! CommonFunc.isEmptyObject(a_this.tab)) && (a_this.tab.length>0) )  {
            a_this.$route.query['tab'] = a_this.tab;
        }
        logger.log.debug("navBlogDetail : dic_param,route=",dic_param,a_this.$route);
        store.getters.nav.add(a_this.$route);
        a_this.$router.push(dic_param);
    }

    static navQADetail(a_this,page_id) {
        if ( (! CommonFunc.isEmptyObject(a_this.tab)) && (a_this.tab.length>0) )  {
            a_this.$route.query['tab'] = a_this.tab;
        }
        store.getters.nav.add(a_this.$route);

        let dic_param = {
            name: "assetqa_detail",path: "assetqa_detail", query: { id: page_id },
        };
        a_this.$router.push(dic_param);
    }

    static navQA(a_this,symbol,id) {
        let dic_param = {
            name: "assetqa",path: "assetqa", query: {symbol:symbol, id:id},
        };
        store.getters.nav.add(a_this.$route);
        a_this.$router.push(dic_param);
    }

    static navFeeds(a_this) {
        let dic_param = {
            name: "feeds",path: "feeds", query: {},
        };
        store.getters.nav.add(a_this.$route);
        a_this.$router.push(dic_param);
    }

    static navTweetWriter(a_this,asset_id,tweet_id=null,contents=null) {
        let dic_param = {
            name: "tweet_writer",path: "tweet_writer", query: { id: asset_id },
        };
        if (tweet_id) dic_param.query['tweet_id'] = tweet_id;
        if (contents) dic_param.params = {contents:contents};

        store.getters.nav.add(a_this.$route);
        a_this.$router.push(dic_param);
    }

    static navBlogWriter(a_this,a_post) {
        store.getters.nav.add(a_this.$route);

        let dic_param = { name:'blog_writer', params:{post:a_post} };
        a_this.$router.push(dic_param);
    }

    static navAsset(a_this,symbol,page_id) {
        logger.log.debug("CommonFunc.navAsset - ",symbol);

        //store.getters.nav.add(a_this.$route);
        let dic_param = { name:'asset', path:'asset', query:{ symbol:symbol, id: page_id } };
        store.getters.nav.add(a_this.$route);
        a_this.$router.push(dic_param);
    }

    static navAssetIndex(a_this) {
        logger.log.debug("CommonFunc.navAssetIndex");

        //store.getters.nav.add(a_this.$route);
        let dic_param = { name:'asset_index', path:'asset_index', query:{} };
        store.getters.nav.add(a_this.$route);
        a_this.$router.push(dic_param);
    }

    static navAssetDetail(a_this,symbol,page_id,tab=null) {
        let dic_param = {
            name: "asset_detail",path: "asset_detail", query: { symbol:symbol, id: page_id, tab:tab },
        };

        if (tab) a_this.$route.query['tab'] = tab;

        store.getters.nav.add(a_this.$route);
        a_this.$router.push(dic_param);
    }

    static navPasswordReset(a_this) {
        let dic_param = {
            name: "reset_password",path: "reset_password", query: {},
        };

        //store.getters.nav.add(a_this.$route);
        a_this.$router.push(dic_param);
    }

    static navForgotPassword(a_this) {
        let dic_param = {
            name: "forgot_password",path: "forgot_password", query: {},
        };

        //store.getters.nav.add(a_this.$route);
        a_this.$router.push(dic_param);
    }
    
    static navInstrument(a_this,asset) {
        logger.log.debug("CommonFunc.navInstrument - ",asset);
        
        //const a_code = LocalStorageService.findCode(asset);

        let a_selected = CommonFunc.getAppData('selected');
        if (! a_selected) {
            a_selected = {};
        }
        
        a_selected['asset'] = asset;
        a_selected['category'] = a_code.category;
        a_selected['name'] = a_code.name;

        //CommonFunc.setAppData('selected',a_selected);

        let dic_param = {name:'kinstrument', params:{ param_asset:asset }};
        a_this.$router.push(dic_param);
    }

    static navSector(a_this,category) {
        logger.log.debug("CommonFunc.navSector - ",category);
        
        //CommonFunc.setAppData('selected_sector',category);

        let dic_param = {name:'sector', params:{ param_category:category }};
        a_this.$router.push(dic_param);
    }

    static navBookmark(a_this) {
        logger.log.debug("CommonFunc.navBookmark");
        
        store.getters.nav.add(a_this.$route);
        let dic_param = { name:'bookmark', path:'bookmark', query:{} };
        a_this.$router.push(dic_param);
    }

}