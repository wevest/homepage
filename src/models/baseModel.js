import _ from 'lodash';
import logger from 'src/error/Logger';


export class baseCollection {
    last_updated=null;
    items=[];
    
    constructur() {

    }

    add(item) {
        this.items.push(item);
    }

    insertAtFirst(item) {
        this.items.unshift(item);
    }

    clear() {
        this.items = [];
    }

    getItem(id) {
        //logger.log.debug("getPrice.pair=",this.items);
        return _.find(this.items,{id:id} );
    }

    delete(id) {
        //logger.log.debug("baseCollection.delete : items=",this.items);
        //let removed = _.remove(this.items, {id:id});
        const index = _.findIndex(this.items,{id:id});
        //logger.log.debug("baseCollection.delete : removed,items=",removed,this.items);
        if (index>-1) {
            this.items.splice(index,1);
        }
    }

    isEmpty() {
        if (this.items.length==0) {
            return true;
        }
        return false;
    }
}