import {MoaConfig} from 'src/data/MoaConfig';
import {baseCollection} from 'src/store/baseModel';
import _ from 'lodash';

import AuthService from 'src/services/authService';
import CommonFunc from 'src/util/CommonFunc';
import logger from 'src/error/Logger';


export class PortfolioItemModel {    
    id=null;
    portfolio_name=null;
    portfolio_id=null;
    asset_id=null;
    user=null;
    price=null;
    qty=null;
    created_at=null;
    updated_at=null;
    state=null;            
    
    last=null;
    evaluated_value=null;
    roi=null;

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
            reqParam.token = MoaConfig.auth.token;
            reqParam.action = "add";
            AuthService.addPortfolioItem(reqParam, function(response) {
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
    evaluated_value=0;
    roi=0;
    api_user=null;

    assign(item) {        
        this.id= item.id;
        this.name = item.name;
        this.description = item.description;
        this.created_at = item.created_at;
        this.updated_at = item.updated_at;
        this.api_user = item.api_user;
        this.items = item.portfolio_children;
    }

    calcPerformance(prices) {
        //logger.log.debug("PortfolioModel.calcPerformance : prices=",this);
        let dic_perf = {value:0, roi:0, count:0};
        
        for (let index=0;index<this.items.length;index++) {
            //const price = prices.getPrice(this.items[index])
            const a_price = prices.getPrice(this.items[index].api_asset.symbol);
            logger.log.debug("PortfolioModel.calcPerformance .item =",this.items[index],a_price);
            if (a_price) {
                this.items[index].last = a_price.last;
                this.items[index].roi = CommonFunc.calcRet(this.items[index].price,a_price.last)*100;

                dic_perf.count = dic_perf.count+1;
                dic_perf.roi = dic_perf.roi + this.items[index].roi;
                dic_perf.value += this.items[index].last*this.items[index].qty;
            }
        }

        this.evaluated_value = 0;
        this.roi = 0;    

        if (dic_perf.count>0) {
            this.evaluated_value = dic_perf.value;
            this.roi = dic_perf.roi/dic_perf.count;    
        }
    }
}


export class PortfolioListModel extends baseCollection{
    evaluated_value=null;
    roi=null;
    item_count=0;
    group_count=0;


    load(username) { 
        const _this = this;

        return new Promise(function(resolve,reject) {
            
            let reqParam = { username:username, token: MoaConfig.auth.token};
            AuthService.getPortfolio(reqParam, function(response) {

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
        logger.log.debug("PortfolioListModel.calcPerformance.items=",this.items);
        
        this.evaluated_value = 0;
        this.roi = 0;
        this.item_count = 0;
        this.group_count = this.items.length;

        for (let index=0;index<this.items.length;index++) {
            this.items[index].calcPerformance(prices);
            
            this.evaluated_value += this.items[index].evaluated_value;
            this.roi += this.items[index].roi;
            this.item_count += this.items[index].items.length;
        }

        this.roi = this.roi/this.group_count;
    }
}
