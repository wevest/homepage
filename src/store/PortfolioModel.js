import {MoaConfig} from 'src/data/MoaConfig';
import {Model, Collection} from 'vue-mc';

import AuthService from 'src/services/authService';


export class PortfolioItemModel extends Model{
    
    defaults() {
        return {
            id: null,
            portfolio_id: null,
            asset_id: null,
            user: null,
            price:null,
            qty:null,
            created_at:null,    
            updated_at:null,  
            state: null,
            
        }    
    }

    mutations() {
        return {
            id: Number,
            portfolio_id: Number,
            asset_id: Number,
            user: String,
            price: Number,
            qty: Number,    
            created_at: String,
            updated_at: String,
            state: Number,
        }
    }
 
    validation() {
        return {

        }
    }

    routes() {
        return {
        }
    }
    
    toDict() {
        let reqParam = {id: this.id, 
            portfolio_id: this.portfolio_id, 
            asset_id: this.asset_id, 
            price: this.price,
            qty: this.qty,
            state: this.state,
            description : this.description
        };

        return reqParam;
    }

    add() {        
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


export class PortfolioModel extends Collection {
    model() {
        return PortfolioItemModel;
    }

    defaults() {
        return {

        }
    }

    load() { 
        const _this = this;

        return new Promise(function(resolve,reject) {
            
            let reqParam = { token: MoaConfig.auth.token};
            AuthService.getPortfolio(reqParam, function(response) {
                resolve(response);
            }, function(err) {
                reject(err);
            });
        });

    }   

}
