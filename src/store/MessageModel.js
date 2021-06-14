import {MoaConfig} from 'src/data/MoaConfig';
import {Model, Collection} from 'vue-mc';


export class ThreadModel extends Model{
    
    defaults() {
        return {
            id: null,
            subject:null,
            from_user:null,
            created_at:null,    
        }    
    }

    mutations() {
        return {
            id: Integer,
            subject: String,
            from_user: Object,
            created_at: String,    
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


export class ThreadListModel extends Collection {
    model() {
        return ThreadModel;
    }

    defaults() {
        return {

        }
    }

}
