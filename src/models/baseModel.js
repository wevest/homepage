import _ from 'lodash';


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
        _.remove(this.items, {id:id});
    }

    isEmpty() {
        if (this.items.length==0) {
            return true;
        }
        return false;
    }
}