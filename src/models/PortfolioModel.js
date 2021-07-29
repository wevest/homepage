import {store} from 'src/store/store';
import {baseCollection} from 'src/models/baseModel';
import _ from 'lodash';

import AuthService from 'src/services/authService';
import CMSAPI from 'src/services/cmsService';

import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';

import {CommentListModel} from 'src/models/CommentModel';


export class PortfolioItemModel {    
    id=null;
    portfolio_name=null;
    portfolio_id=null;
    api_asset=null;
    asset_id=null;
    user=null;
    price=null;
    qty=null;
    created_at=null;
    updated_at=null;
    state=null;            
    description=null;

    last=null;
    estimated_value=null;
    roi=null;

    assign(obj) {
        this.id=obj.id;
        
        this.api_asset=obj.api_asset;
        this.api_user=obj.api_user;
        this.asset_id=obj.api_asset.id;

        this.portfolio_id=obj.portfolio_id;        
        this.price=obj.price;
        this.qty=obj.qty;
        this.created_at=obj.created_at;
        this.updated_at=obj.updated_at;
        this.state=obj.state;            
        this.description = obj.description;
        this.last=0;
        this.estimated_value=0;
        this.roi=0;
    }

    toDict() {
        let reqParam = { 
            id: this.id, 
            portfolio_id: this.portfolio_id, 
            portfolio_name: this.portfolio_name, 
            asset_id: this.asset_id, 
            price: this.price,
            qty: this.qty,
            state: this.state,
            description : this.description
        };

        return reqParam;
    }

    addToServer() {        
        const _this = this;

        return new Promise(function(resolve,reject) {
            let reqParam = _this.toDict();
            reqParam.token = store.getters.token;
            reqParam.action = "add";
            AuthService.addPortfolioItem(reqParam, function(response) {
                logger.log.debug("PortfolioItem.addToServer : response=",response);
                resolve(response);
            }, function(err) {
                reject(err);
            });
        });
    }   

    updateToServer() {        
        const _this = this;

        return new Promise(function(resolve,reject) {
            let reqParam = _this.toDict();
            reqParam.token = store.getters.token;
            AuthService.updatePortfolioItem(reqParam, function(response) {
                logger.log.debug("PortfolioItem.updateToServer : response=",response);
                resolve(response);
            }, function(err) {
                reject(err);
            });
        });
    }   

    deleteToServer() {        
        const _this = this;

        return new Promise(function(resolve,reject) {
            let reqParam = _this.toDict();
            reqParam.token = store.getters.token;
            reqParam.action = "delete";
            AuthService.deletePortfolioItem(reqParam, function(response) {
                resolve(response);
            }, function(err) {
                reject(err);
            });
        });
    }   

}


export class PortfolioModel extends baseCollection {
    id=null;
    name=null;
    description=null;
    created_at=null;
    updated_at=null;
    estimated_value=0;
    roi=0;
    read_count=0;
    comment_count=0;
    like_count=0;
    dislike_count=0;
    api_user=null;

    comments=new CommentListModel();
    
    assign(item) {        
        this.id= item.id;
        this.name = item.name;
        this.description = item.description;
        this.created_at = item.created_at;
        this.updated_at = item.updated_at;
        this.read_count = item.read_count;
        this.comment_count = item.comment_count;
        this.like_count = item.like_count;
        this.dislike_count = item.dislike_count;
        this.roi = item.roi;
        this.estimated_value = item.estimated_value;

        this.api_user = item.api_user;
        
        //this.items = item.portfolio_children;
        this.assignItems(item.portfolio_children);
    }

    assignItems(items) {
        for (let index=0;index<items.length;index++) {
            let a_item = new PortfolioItemModel();
            a_item.assign(items[index]);
            this.add(a_item);
        }
    }

    calcPerformance(prices) {
        //logger.log.debug("PortfolioModel.calcPerformance : prices=",prices);
        let dic_perf = {value:0, roi:0, count:0};
        let qty = 1;

        const _this=this;
        for (let index=0;index<this.items.length;index++) {
            //const price = prices.getPrice(this.items[index])
            const a_price = prices.getPrice(this.items[index].api_asset.symbol)
            //logger.log.debug("PortfolioModel.calcPerformance .item =",this.items[index],a_price);
            if (a_price) {
                this.items[index].last = a_price.last;
                this.items[index].roi = CommonFunc.calcRet(this.items[index].price,a_price.last)*100;

                if (this.items[index].qty!=0) {
                    qty = this.items[index].qty;
                }
                dic_perf.count = dic_perf.count+1;
                dic_perf.roi = dic_perf.roi + this.items[index].roi;
                dic_perf.value += this.items[index].last*qty;

                //logger.log.debug("PortfolioModel.calcPerformance : item=",this.items[index].qty,dic_perf);
            }
        }

        this.estimated_value = 0;
        this.roi = 0;    

        if (dic_perf.count>0) {
            this.estimated_value = dic_perf.value;
            this.roi = dic_perf.roi/dic_perf.count;    
        }
    }

    load(is_selected=1) { 
        const _this = this;
                
        let reqParam = { 
            is_selected:is_selected,
            token: store.getters.token
        };
        logger.log.debug("PortfolioList.load : reqParam = ",reqParam);

        return new Promise(function(resolve,reject) {            
            AuthService.getPortfolio(reqParam, function(response) {
                logger.log.debug("PortfolioList.load: response=",response.data);

                resolve(response);
            }, function(err) {
                reject(err);
            });
        });
    }   

    vote(dic_param) {
        const _this=this;

        return new Promise(function(resolve,reject) {
            dic_param.token = store.getters.token;
            CMSAPI.votePortfolio(dic_param,function(response) {
                logger.log.debug('PortfolioModel.vote - ',response);

                _this.like_count = response.data.data.like_count;
                _this.dislike_count = response.data.data.dislike_count;

                resolve(response);
            }, function(err) {
                logger.log.debug('PortfolioModel.vote - ',err);
                reject(err);
            });          
        });
    }

    loadComments(content_type,offset,limit) {
        let dic_param = {content_type:content_type , id:this.id, limit:limit, offset:offset};
        logger.log.debug("PortfolioModel.loadComments - dic_param=",dic_param);
        
        const _this=this;
        return new Promise(function(resolve,reject) {
            _this.comments.load(dic_param).then( response => {
                logger.log.debug("PortfolioModel.loadComments - response=",response);
                _this.comments.assign(response.data.results);
                //logger.log.debug("PortfolioModel.loadComments - comments.items=",_this.comments.items);
                resolve(response);
            }).catch( err => {
                logger.log.error("PortfolioModel.loadComments - error",err);
                reject(err);
            });
        });
    }

    update(description) {
        let dic_param = {id:this.id, 
            description:description, 
            portfolio_name: this.name,
            token:store.getters.token,action:"edit"};
        logger.log.debug("PortfolioModel.update - dic_param=",dic_param);
        
        const _this=this;
        return new Promise(function(resolve,reject) {
            AuthService.addPortfolioItem(dic_param, function(response) {
                logger.log.debug("Portfolio.update : response=",response);
                _this.description = description;
                resolve(response);
            }, function(err) {
                reject(err);
            });
        });

    }
}


export class PortfolioListModel extends baseCollection{
    estimated_value=null;
    roi=null;
    item_count=0;
    group_count=0;

    getItem(id) {
        return _.find(this.items,{id:id} );
    }

    //load(username=null, portfolio_id=null, type=null) { 
    load(reqParam) { 
        const _this = this;
        
        /*
        let reqParam = { 
            token: store.getters.token
        };
        */
       
        //let reqParam = {type:type};
/*
        if (username) {
            reqParam.username = username;
            reqParam.id = portfolio_id;
        }
*/
        //logger.log.debug("PortfolioList.load:param=",reqParam);

        return new Promise(function(resolve,reject) {            

            AuthService.getPortfolio(reqParam, function(response) {
                logger.log.debug("PortfolioList.load: response=",response.data);
                let items = response.data.results;
                for (let index=0;index<items.length;index++) {
                    
                    let a_item = new PortfolioModel()
                    a_item.assign(items[index]);
                    _this.add( a_item );
                }

                resolve(response);
            }, function(err) {
                reject(err);
            });
        });
    }   
    
    calcPerformance(prices) {
        logger.log.debug("PortfolioListModel.calcPerformance.items=",prices);
        
        this.estimated_value = 0;
        this.roi = 0;
        this.item_count = 0;
        this.group_count = this.items.length;

        for (let index=0;index<this.items.length;index++) {
            this.items[index].calcPerformance(prices);
            
            this.estimated_value += this.items[index].estimated_value;
            this.roi += this.items[index].roi;
            this.item_count += this.items[index].items.length;
        }

        this.roi = this.roi/this.group_count;
    }


    deletePortfolio(portfolio_id) {
        const _this = this;

        return new Promise(function(resolve,reject) {
            let reqParam = {
                token: store.getters.token,
                id:portfolio_id,
            };

            logger.log.debug("deletePortfolio.reqParam=",reqParam);
            AuthService.deletePortfolio(reqParam, function(response) {
                
                logger.log.debug("deletePortfolio.response=",response);
                _this.delete(portfolio_id);
                //let a_portfolio_item = a_portfolio.getItem(id:portfolio_item_id);
                resolve(response);

            }, function(err) {
                reject(err);
            });
        });

    }

    deletePortfolioItem(portfolio_id,portfolio_item_id,asset_id) {
        const _this = this;

        return new Promise(function(resolve,reject) {
            let reqParam = {
                token: store.getters.token,
                id:portfolio_item_id,
                asset_id:asset_id,
            };

            logger.log.debug("deletePortfolioItem.reqParam=",reqParam);
            AuthService.deletePortfolioItem(reqParam, function(response) {
                
                logger.log.debug("deletePortfolioItem.response=",response);
                logger.log.debug("deletePortfolioItem.items=",_this.items);

                let a_portfolio = _this.getItem(portfolio_id);
                logger.log.debug("deletePortfolioItem.portfolio=",portfolio_id,a_portfolio);
                //let a_portfolio_item = a_portfolio.getItem(id:portfolio_item_id);
                a_portfolio.delete(portfolio_item_id);
                resolve(response);

            }, function(err) {
                reject(err);
            });
        });

    }

    addPortfolioGroup(portfolioItem) {
        logger.log.debug("addPortfolioGroup : portfolioItem=",portfolioItem);
        let a_group = this.getItem(portfolioItem.portfolio_id);
        if (! a_group) {
            a_portfolio = new PortfolioModel();
            a_portfolio.id = a_item.portfolio_id;
        }
        a_portfolio.add(a_item);
    }

    addPortfolioItem(jsonItem) {
        logger.log.debug("addPortfolioItem : jsonItem=",jsonItem);
        let a_item = new PortfolioItemModel();
        a_item.assign(jsonItem);
        let a_portfolio = this.getItem(a_item.portfolio_id);
        if (! a_portfolio) {
            a_portfolio = new PortfolioModel();
            a_portfolio.id = a_item.portfolio_id;
            this.add(a_portfolio);
        }
        a_portfolio.add(a_item);
    }

    readPortfolio(portfolio_id) {
        return new Promise(function(resolve,reject) {
            let dic_param = {id:portfolio_id,token: store.getters.token};
            CMSAPI.readPortfolio(dic_param,function(response) {
                logger.log.debug('PortfolioModel.read - ',response);
                resolve(response);
            }, function(err) {
                logger.log.debug('PortfolioModel.read - ',err);
                reject(err);
            });          
        });

    }

}
