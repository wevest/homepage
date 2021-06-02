//import api from '@/services/api'
import {callAPI, callCMSAPI, callPostAPI, callJsonRPC} from 'src/util/Http';
import {MoaConfig} from 'src/data/MoaConfig';
//import logger from "@/error/Logger";


export default class CMSAPI{

  constructor(){
		
  }
  
  static getUrl(host,url) {
    return host + url;
  }

  static getBlogData(reqParam,func,funcErr) {
    let url = CMSAPI.getUrl(MoaConfig.urls.cms,"/api/blog/posts/");
    callCMSAPI("GET",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static postBlogPost(dic_param,func,funcErr) {
    let url = CMSAPI.getUrl(MoaConfig.urls.cms,"/api/blog/posts/");
    callCMSAPI("POST",url,{},dic_param)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static deleteBlogPost(dic_param,func,funcErr) {
    let url = CMSAPI.getUrl(MoaConfig.urls.cms,"/api/blog/posts/"+dic_param['id']+'/');
    //let url = CMSAPI.getUrl(MoaConfig.urls.cms,"/api/blog/posts/");
    callCMSAPI("DELETE",url,{},dic_param)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }


  static likeBlogPost(dic_param,func,funcErr) {
    let url = CMSAPI.getUrl(MoaConfig.urls.cms,"/api/blog/posts/" + dic_param.id + "/" + dic_param.method + "/");
    callCMSAPI("POST",url,{},dic_param)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static postBlogComment(dic_param,func,funcErr) {
    let url = CMSAPI.getUrl(MoaConfig.urls.cms,"/comments/api/comment/");
    callCMSAPI("POST",url,{},dic_param)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static postCommentFeedback(dic_param,func,funcErr) {
    let url = CMSAPI.getUrl(MoaConfig.urls.cms,"/comments/api/feedback/");
    callCMSAPI("POST",url,{},dic_param)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static getComments(dic_param,func,funcErr) {
    let a_method = "/comments/api/"+dic_param.content_type+"/"+dic_param.id+"/";  
    if (dic_param.limit) {
      a_method = a_method + "?limit=" + dic_param.limit + "&offset=" + dic_param.offset;
    }
    
    let url = CMSAPI.getUrl(MoaConfig.urls.cms,a_method);
    callCMSAPI("GET",url,{},dic_param)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static getPostData(page_id,func,funcErr) {
    let url = CMSAPI.getUrl(MoaConfig.urls.cms,"/api/cms/pages/"+page_id);
    callCMSAPI("GET",url,{},{})
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

}
