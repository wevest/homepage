import IdGenerator from '../util/IdGenerator'
import {Blockchains} from './Blockchains';
import CommonFunc from '../util/CommonFunc';
import logger from '@/error/Logger';
import Errors from '@/error/Errors';


export class ContactAccount {
    constructor(){
        this.blockchain = '';
        this.name = '';
        this.address = '';
        this.filtered = true;
        this.favorite = false;
    }
    static placeholder(){ return new ContactAccount(); }

    static fromJson(json) {
        let c = Object.assign(this.placeholder(), json); 
        return c;
    }

    toJson() {
        return {
            blockchain:this.blockchain,
            name:this.name,
            address:this.address,
            favorite:this.favorite,
            filtered:this.filtered
        }
    }
}

export default class Contact {

    constructor(_name = '', _recipient = ''){
        this.name = _name;
        this.recipient = _recipient;
        
        this.id = null;
        this.address = null;
        this.email = null;
        this.meta = null;
        this.owner = null;
        this.memo = '';
        this.doc = null;
        this.accounts = [];

        this.filtered = true;
        this.selected = false;
        this.favorite = false;
    }

    static placeholder(){ return new Contact(); }
    static fromJson(json){ 
        try {
            let c = Object.assign(this.placeholder(), json); 
            if(json.hasOwnProperty('accounts')) {
                let items = [];
                json.accounts.forEach(function(account) {
                    items.push(ContactAccount.fromJson(account));
                });
                c.accounts = items;
            }
            return c;    
        } catch(e) {
            ehandler.throw(Errors.raise(Errors.ERRCODE.PROGRAMMER.JsonParseError,'',e));
        }
    }

    toJson() {
        return {
            name: this.name,
            address: this.address,
            email: this.email,
            owner: this.owner,
            memo: this.memo,
            id: this.id,
            favorite: this.favorite,
            accounts: CommonFunc.clone(this.accounts)
        };
    }

    addAccount(account) {
        const items = CommonFunc.clone(this.accounts);
        let found = CommonFunc.getItemCountBlockchain(items,'address',account.address,'blockchain',account.blockchain);
        if (found.count==0) {
            this.accounts.push(account);
        }
    }

    removeAccount(address,blockchain) {
        let found = CommonFunc.getItemCountBlockchain(this.accounts,'address',address,'blockchain',blockchain);
        if (found.count>0) {
            //this.accounts.push(account);
            for (let i=0;i<found.count;i++) {
                this.accounts.splice(found.index[i],1);
            }
        }
    }
}