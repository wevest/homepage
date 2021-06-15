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


export class PortfolioModel extends Model {
    defaults() {
        return {
            id: null,         
            name: null,               
            description: null,
            created_at: null,
            updated_at:null,
            api_user: null,
            portfolio_children: null,            
        }
    }

    mutations() {
        return {
            id: Number,
            name: String,
            description: String,
            created_at: String,
            updated_at: String,
            api_user: Object,
            portfolio_children: Object,
        }
    }
 
}


export class PortfolioListModel extends Collection {
    model() {
        return PortfolioModel;
    }

    defaults() {
        return {}
    }

    load() { 
        const _this = this;

        return new Promise(function(resolve,reject) {
            
            let reqParam = { token: MoaConfig.auth.token};
            AuthService.getPortfolio(reqParam, function(response) {

                let items = response.data.results;
                for (let index=0;index<items.length;index++) {
                    
                    _this.add( {
                        id: items[index].id, 
                        name: items[index].name, 
                        description: items[index].description,
                        created_at: items[index].created_at,
                        updated_at: items[index].updated_at,
                        api_user: items[index].api_user,
                        portfolio_children: items[index].portfolio_children 
                    });
                }

                resolve(response);
            }, function(err) {
                reject(err);
            });
        });
    }   
    
}
