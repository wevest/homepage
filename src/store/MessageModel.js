import {MoaConfig} from 'src/data/MoaConfig';
import {Model, Collection} from 'vue-mc';


export class MessageThreadModel extends Model{
    
    defaults() {
        return {
            id: null,
            subject:'',
            to_user:'',
            created_at:'',    
            content: '',
        }    
    }

    mutations() {
        return {
            id: Number,
            subject: String,
            to_user: Object,
            created_at: String,    
            content: String,    
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
}


export class MessageThreadListModel extends Collection {
    model() {
        return ThreadModel;
    }

    defaults() {
        return {

        }
    }

}
