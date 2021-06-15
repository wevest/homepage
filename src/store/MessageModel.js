import {MoaConfig} from 'src/data/MoaConfig';
import {Model, Collection} from 'vue-mc';



export class MessageModel extends Model{    
    defaults() {
        return {
            id: null,
            uuid:'',
            sent_at:'',
            avatar: '',
            user_id: null,
            content: '',
            thread_id: null,
            is_sender: null
        }    
    }

    mutations() {
        return {
            id: Number,
            thread_id: Number,
            uuid: String,
            user_id: Number,            
            avatar: String,
            sent_at: String,    
            content: String,    
            is_sender: Boolean
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


export class MessageListModel extends Collection {
    model() {
        return MessageModel;
    }

    defaults() {
        return {}
    }
}


export class MessageThreadModel extends Model{
    
    defaults() {
        return {
            id: null,
            uuid:'',
            subject:'',
            to_user:'',
            to_username:'',
            created_at:'',    
            content: '',
            avatar: '',
            user_id: null
        }    
    }

    mutations() {
        return {
            id: Number,
            uuid: String,
            user_id: Number,
            subject: String,
            avatar: String,
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
