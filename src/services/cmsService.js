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
    if ('content_type' in reqParam) {
      url = url + "?content_type=" + reqParam.content_type;
    }
    if ('category' in reqParam) {
      url = url + "?category=" + reqParam.category;
    }
    if ('user_id' in reqParam) {
      url = url + "?user_id=" + reqParam.user_id;
    }
    if ('page_id' in reqParam) {
      url = url + "?page_id=" + reqParam.page_id;
    }

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
    let url = CMSAPI.getUrl(MoaConfig.urls.cms,"/api/blog/posts/?id="+page_id);
    callCMSAPI("GET",url,{},{})
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static getAssetPage(reqParam,func,funcErr) {
    let url = CMSAPI.getUrl(MoaConfig.urls.cms,"/api/asset/assetpage/");
    callCMSAPI("GET",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static getAssetReview(reqParam,func,funcErr) {
    let url = CMSAPI.getUrl(MoaConfig.urls.cms,"/api/review/reviews/?object_id="+reqParam.object_id);
    callCMSAPI("GET",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static postAssetReview(reqParam,func,funcErr) {
    let url = CMSAPI.getUrl(MoaConfig.urls.cms,"/api/review/reviews/");
    callCMSAPI("POST",url,{},reqParam)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static likeAssetReview(dic_param,func,funcErr) {
    let url = CMSAPI.getUrl(MoaConfig.urls.cms,"/api/review/reviews/" + dic_param.id + "/" + dic_param.method + "/");
    callCMSAPI("POST",url,{},dic_param)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static dislikeAssetReview(dic_param,func,funcErr) {
    let url = CMSAPI.getUrl(MoaConfig.urls.cms,"/api/review/reviews/" + dic_param.id + "/" + dic_param.method + "/");
    callCMSAPI("POST",url,{},dic_param)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static getAssetQuestion(dic_param,func,funcErr) {
    let url = CMSAPI.getUrl(MoaConfig.urls.cms,"/api/qa/questions/?parent_id="+dic_param.parent_id);
    callCMSAPI("GET",url,{},dic_param)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static postAssetQuestion(dic_param,func,funcErr) {
    let url = CMSAPI.getUrl(MoaConfig.urls.cms,"/api/qa/questions/");
    callCMSAPI("POST",url,{},dic_param)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static voteAssetQuestion(dic_param,func,funcErr) {
    let url = CMSAPI.getUrl(MoaConfig.urls.cms,"/api/qa/questions/"+ dic_param.id + "/" + dic_param.method + "/");
    callCMSAPI("POST",url,{},dic_param)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static postAssetAnswer(dic_param,func,funcErr) {
    let url = CMSAPI.getUrl(MoaConfig.urls.cms,"/api/qa/answers/");
    callCMSAPI("POST",url,{},dic_param)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static getAssetAnswer(dic_param,func,funcErr) {
    let url = CMSAPI.getUrl(MoaConfig.urls.cms,"/api/qa/answers/?question_id="+dic_param.question_id);
    callCMSAPI("GET",url,{},dic_param)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static voteAssetAnswer(dic_param,func,funcErr) {
    let url = CMSAPI.getUrl(MoaConfig.urls.cms,"/api/qa/answers/"+ dic_param.id + "/" + dic_param.method + "/");
    callCMSAPI("POST",url,{},dic_param)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static getAssetAnswerComment(dic_param,func,funcErr) {
    let url = CMSAPI.getUrl(MoaConfig.urls.cms,"/api/qa/acomments/?question_id="+ dic_param.question_id);
    callCMSAPI("GET",url,{},dic_param)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static postAssetAnswerComment(dic_param,func,funcErr) {
    let url = CMSAPI.getUrl(MoaConfig.urls.cms,"/api/qa/acomments/");
    callCMSAPI("POST",url,{},dic_param)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

  static voteAssetAnswerComment(dic_param,func,funcErr) {
    let url = CMSAPI.getUrl(MoaConfig.urls.cms,"/api/qa/acomments/"+ dic_param.id + "/" + dic_param.method + "/");
    callCMSAPI("POST",url,{},dic_param)
    .then( (response) => {
        func(response);
    })
    .catch( (err) => {
        funcErr(err);
    });
  }

}
