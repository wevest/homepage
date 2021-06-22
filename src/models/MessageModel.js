import {MoaConfig} from 'src/data/MoaConfig';
import {store} from 'src/store/store';
import {baseCollection} from 'src/models/baseModel';
import logger from "src/error/Logger";

import AuthService from 'src/services/authService';



export class MessageModel{    
    uuid='';
    thread_id=null;
    sent_at='';
    sender=null;
    subject='';
    content='';
    username=null;
    is_sender=null;

    to_avatar=null;
    to_username=null;

    assign(obj) {
        this.uuid=obj.uuid;
        this.sent_at=obj.sent_at;
        this.sender=obj.sender;
        this.content=obj.content;
        this.thread_id=obj.thread;
        this.username=obj.sender.username;
        this.subject=obj.subject;

        if (store.getters.me.id==obj.sender.id) {
            this.username = "me";
            this.is_sender = true;
        }
    }

    sendMessage() {
        const _this = this;
        
        let dic_param = {
            token: store.getters.token, 
            to_user:this.to_user, subject:this.subject, message:this.content
        };

        logger.log.debug("MessageModel.sendMessage - dic_param",dic_param);

        return new Promise(function(resolve,reject) {
            AuthService.postPrivateMessage(dic_param,function(response) {
                //_this.g_data = response.data;
                logger.log.debug("MessageModel.sendMessage - response",response.data);
                resolve(response.data);
            },function(err) {
                logger.log.error("MessageModel.sendMessage - error",err);
                reject(err);
            });
        });            
    }

}


export class MessageListModel extends baseCollection {

    assign(messages) {
        logger.log.debug("MessageListModel: messages=",messages);
                
        for (let index=0;index<messages.messages.length;index++) {
            //logger.log.debug("onClickMessage: loadThreadMessages=",index);

            let a_message = new MessageModel()
            a_message.assign(messages.messages[index]);
            this.add(a_message);
        }

    }

    load(uuid) {
        const _this = this;
                    
        let dic_param = {uuid:uuid, token: store.getters.token};
        return new Promise(function(resolve,reject) {
            AuthService.getThreadMessage(dic_param,function(response) {                
                logger.log.debug("MessageListModel.load - response",response.data);
                _this.assign(response.data);
                resolve(response.data);

            },function(err) {
                logger.log.error("MessageListModel.load - error",err);
                reject(err);
            });
        });            
    }

    addMessage(response) {
        let a_message = new MessageModel();
        a_message.assign(response.data);
        this.add(a_message);
    }

}


export class MessageThreadModel{
    id=null;
    uuid='';
    sent_at='';       
    subject=null;
    last_message='';    
    sender=null;
    username=null;
    messages = new MessageListModel();

    assign(obj) {
        this.id=obj.id;
        this.uuid=obj.uuid;
        this.subject=obj.subject;
        this.sent_at=obj.sent_at;
        this.sender=obj.sender;
        this.username=obj.sender.username;
        this.last_message=obj.last_message;
    }    


    sendReply(message) {
        const _this = this;
        
        let dic_param = {
            token: store.getters.token, 
            uuid: this.uuid, subject:this.subject, message:message
        };

        return new Promise(function(resolve,reject) {
            AuthService.replyThreadMessage(dic_param,function(response) {
                logger.log.debug("MessageThreadModel.sendReply - response",response);
                resolve(response);
            },function(err) {
                logger.log.error("MessageThreadModel.sendReply - error",err);
                reject(err);
            });
        });            
    }

    editReply(uuid,thread_id,message) {
        const _this = this;
        
        let dic_param = {
            token: store.getters.token, 
            uuid:uuid, thread:thread_id, sender_id:store.getters.me.id, 
            content:message
        };

        return new Promise(function(resolve,reject) {
            AuthService.editThreadMessage(dic_param,function(response) {
                logger.log.debug("MessageThreadModel.editReply - response",response);

                //return _.find(this.items,{id:id} );
                let index = _.findIndex(_this.messages.items,{uuid:response.data.uuid});
                //logger.log.debug("MessageThreadModel.editReply - index=",index);
                if (index>-1) {
                    
                    let a_message = _this.messages.items[index];
                    a_message.content = response.data.content;
                    _this.messages.items[index] = a_message;
                }

                resolve(response);
            },function(err) {
                logger.log.error("MessageThreadModel.editReply - error",err);
                reject(err);
            });
        });            
    }


    send() {
        const _this = this;
        
        let dic_param = {
            token: store.getters.token, 
            to_user:this.to_user, subject:this.subject, message:this.content
        };

        logger.log.debug("MessageModel.sendMessage - dic_param",dic_param);

        return new Promise(function(resolve,reject) {
            AuthService.postPrivateMessage(dic_param,function(response) {
                //_this.g_data = response.data;
                logger.log.debug("MessageModel.sendMessage - response",response.data);
                resolve(response.data);
            },function(err) {
                logger.log.error("MessageModel.sendMessage - error",err);
                reject(err);
            });
        });            
    }
}


export class MessageThreadListModel extends baseCollection {


    assign(threads) {
        logger.log.debug("MessageThreadListModel.load ",threads);

        for (let index=0; index<threads.length; index++) {
            let a_message = new MessageThreadModel();             
            a_message.assign(threads[index]);
            this.add(a_message);
        }
    }

    load() {
        const _this = this;
                    
        let dic_param = {token: store.getters.token};

        return new Promise(function(resolve,reject) {
            AuthService.getInboxMessage(dic_param,function(response) {
                logger.log.debug("MessageThreadListModel.load - response",response.data);
                _this.assign(response.data.results);                
                resolve(response.data);
            },function(err) {
                logger.log.error("MessageThreadListModel.load - error",err);
                reject(err);
            });
        });            
    }


}
