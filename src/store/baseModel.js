export class baseCollection {

    items=[];
    
    constructur() {

    }

    add(item) {
        this.items.push(item);
    }

    clear() {
        this.items = [];
    }

}