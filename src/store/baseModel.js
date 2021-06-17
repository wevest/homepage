export class baseCollection {
    last_updated=null;
    items=[];
    
    constructur() {

    }

    add(item) {
        this.items.push(item);
    }

    clear() {
        this.items = [];
    }

    isEmpty() {
        if (this.items.length==0) {
            return true;
        }
        return false;
    }
}