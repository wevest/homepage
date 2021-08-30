//import api from '@/services/api'
import { callAPI, callCMSAPI, callPostAPI } from "src/util/Http";
import { Config } from "src/data/Config";
import logger from "src/error/Logger";
import CommonFunc from "src/util/CommonFunc";


export default class CMSAPI {
  	constructor() {}

  	static getUrl(host, url) {
    	return host + url;
  	}

  	static getBlogCategory(dic_param, func, funcErr) {
		let url = CMSAPI.getUrl(Config.urls.cms, "/api/blog/categories/");
		callCMSAPI("GET", url, {}, dic_param)
		.then(response => {
			func(response);
		})
		.catch(err => {
			funcErr(err);
		});
  	}

  	static getBlogData(reqParam, func, funcErr) {
		let url = CMSAPI.getUrl(Config.urls.cms, "/api/blog/posts/");
		if (reqParam.hasOwnProperty("content_type") && reqParam.content_type) {
			url = url + "?content_type=" + reqParam.content_type;
		} else if (reqParam.hasOwnProperty("category") && reqParam.category) {
			url = url + "?category=" + reqParam.category;
		} else if (reqParam.hasOwnProperty("user_id") && reqParam.user_id) {
			url = url + "?user_id=" + reqParam.user_id;
		} else if (reqParam.hasOwnProperty("page_id") && reqParam.page_id) {
			url = url + "?page_id=" + reqParam.page_id;
		} else if (reqParam.hasOwnProperty("asset_id") && reqParam.asset_id) {
			url = url + "?asset_id=" + reqParam.asset_id;
		}


		//logger.log.debug("CMSService.getBlogData : reqParam1=", reqParam);

		url = CommonFunc.addLimitOffsetToQuery(url, reqParam);

		//logger.log.debug("CMSService.getBlogData : reqParam2=", reqParam);

		callCMSAPI("GET", url, {}, reqParam)
		.then(response => {
			func(response);
		})
		.catch(err => {
			funcErr(err);
		});
	}

  	static postBlogPost(dic_param, func, funcErr) {
		let url = CMSAPI.getUrl(Config.urls.cms, "/api/blog/posts/");
		callCMSAPI("POST", url, {}, dic_param)
		.then(response => {
			func(response);
		})
		.catch(err => {
			funcErr(err);
		});
  	}

	static deleteBlogPost(dic_param, func, funcErr) {
		let url = CMSAPI.getUrl(
			Config.urls.cms,
			"/api/blog/posts/" + dic_param["id"] + "/"
		);
		//let url = CMSAPI.getUrl(Config.urls.cms,"/api/blog/posts/");
		callCMSAPI("DELETE", url, {}, dic_param)
		.then(response => {
			func(response);
		})
		.catch(err => {
			funcErr(err);
		});
	}

	static voteBlogPost(dic_param, func, funcErr) {
		let url = CMSAPI.getUrl(
			Config.urls.cms,
			"/api/blog/posts/" + dic_param.id + "/vote/"
		);
		callCMSAPI("POST", url, {}, dic_param)
		.then(response => {
			func(response);
		})
		.catch(err => {
			funcErr(err);
		});
	}

	static postBlogComment(dic_param, func, funcErr) {
		let url = CMSAPI.getUrl(Config.urls.cms, "/api/comments/api/comment/");
		callCMSAPI("POST", url, {}, dic_param)
		.then(response => {
			func(response);
		})
		.catch(err => {
			funcErr(err);
		});
	}

	static editBlogComment(dic_param, func, funcErr) {
		let url = CMSAPI.getUrl(Config.urls.cms, "/api/comment/comments");
		callCMSAPI("POST", url, {}, dic_param)
		.then(response => {
			func(response);
		})
		.catch(err => {
			funcErr(err);
		});
	}

  	static deleteBlogComment(dic_param, func, funcErr) {
		let url = CMSAPI.getUrl(Config.urls.cms, "/api/comment/comments");
		callCMSAPI("DELETE", url, {}, dic_param)
		.then(response => {
			func(response);
		})
		.catch(err => {
			funcErr(err);
		});
  	}

	static getTweet(dic_param, func, funcErr) {
		let a_method = "/api/twitter/tweets/";
		if (dic_param.hasOwnProperty('id')) {
			a_method += "?id=" + dic_param.id;
		} else if (dic_param.hasOwnProperty('asset_id')) {
			a_method += "?asset_id=" + dic_param.asset_id;
		}
		let url = CMSAPI.getUrl(Config.urls.cms, a_method);
		callCMSAPI("GET", url, {}, dic_param)
		.then(response => {
			func(response);
		})
		.catch(err => {
			funcErr(err);
		});
  	}

	static postTweet(dic_param, func, funcErr) {
		let url = CMSAPI.getUrl(Config.urls.cms, "/api/twitter/tweets/");
		callCMSAPI("POST", url, {}, dic_param)
		.then(response => {
			func(response);
		})
		.catch(err => {
			funcErr(err);
		});
  	}

	  static removeTweet(dic_param, func, funcErr) {
		let url = CMSAPI.getUrl(Config.urls.cms, "/api/twitter/tweets/");
		callCMSAPI("DELETE", url, {}, dic_param)
		.then(response => {
			func(response);
		})
		.catch(err => {
			funcErr(err);
		});
  	}

	static voteTweet(dic_param, func, funcErr) {
		let url = CMSAPI.getUrl(
		Config.urls.cms,
		"/api/twitter/tweets/" + dic_param.id + "/" + dic_param.method + "/"
		);
		callCMSAPI("POST", url, {}, dic_param)
		.then(response => {
			func(response);
		})
		.catch(err => {
			funcErr(err);
		});
	}

	static getTweetComment(dic_param, func, funcErr) {
    	let url = CMSAPI.getUrl(
      		Config.urls.cms,
      		"/api/twitter/twcomments/?tweet_id=" + dic_param.tweet_id
    	);

		url = CommonFunc.addLimitOffsetToQuery(url, dic_param);
		
    	callCMSAPI("GET", url, {}, dic_param)
      	.then(response => {
        	func(response);
      	})
      	.catch(err => {
        	funcErr(err);
      	});
  	}

  	static postTweetComment(dic_param, func, funcErr) {
		let url = CMSAPI.getUrl(Config.urls.cms, "/api/twitter/twcomments/");
		callCMSAPI("POST", url, {}, dic_param)
	  	.then(response => {
			func(response);
	  	})
	  	.catch(err => {
			funcErr(err);
	  	});
  	}
	  
  	static deleteTweetComment(dic_param, func, funcErr) {
		let url = CMSAPI.getUrl(Config.urls.cms, "/api/twitter/twcomments/"+dic_param.id + "/");
		callCMSAPI("DELETE", url, {}, dic_param)
	  	.then(response => {
			func(response);
	  	})
	  	.catch(err => {
			funcErr(err);
	  	});
  	}

  	static voteTweetComment(dic_param, func, funcErr) {
		let url = CMSAPI.getUrl(Config.urls.cms, 
			"/api/twitter/twcomments/" + dic_param.id + "/" + dic_param.method + "/");
		callCMSAPI("POST", url, {}, dic_param)
	  	.then(response => {
			func(response);
	  	})
	  	.catch(err => {
			funcErr(err);
	  	});
  	}

	static postCommentFeedback(dic_param, func, funcErr) {
		let url = CMSAPI.getUrl(Config.urls.cms, "/api/comments/api/feedback/");
		callCMSAPI("POST", url, {}, dic_param)
		.then(response => {
			func(response);
		})
		.catch(err => {
			funcErr(err);
		});
	}

	static getComments(dic_param, func, funcErr) {
		let a_method = "/api/comments/api/" + dic_param.content_type + "/" + dic_param.id + "/";
		if (dic_param.limit) {
		a_method =
			a_method + "?limit=" + dic_param.limit + "&offset=" + dic_param.offset;
		}

		let url = CMSAPI.getUrl(Config.urls.cms, a_method);
		callCMSAPI("GET", url, {}, dic_param)
		.then(response => {
			func(response);
		})
		.catch(err => {
			funcErr(err);
		});
	}

  static getPostData(page_id, func, funcErr) {
    let url = CMSAPI.getUrl(
      Config.urls.cms,
      "/api/blog/posts/?id=" + page_id
    );
    callCMSAPI("GET", url, {}, {})
      .then(response => {
        func(response);
      })
      .catch(err => {
        funcErr(err);
      });
  }

  static getAssetPage(reqParam, func, funcErr) {
    let url = CMSAPI.getUrl(Config.urls.cms, "/api/asset/assetpage/");
    callCMSAPI("GET", url, {}, reqParam)
      .then(response => {
        func(response);
      })
      .catch(err => {
        funcErr(err);
      });
  }

	static getAssetReview(reqParam, func, funcErr) {
		let url = CMSAPI.getUrl(
			Config.urls.cms,
			"/api/review/reviews/?asset_id=" + reqParam.asset_id + "&category=" + reqParam.category
		);
		url = CommonFunc.addLimitOffsetToQuery(url, reqParam);
		
		callCMSAPI("GET", url, {}, reqParam)
		.then(response => {
			func(response);
		})
		.catch(err => {
			funcErr(err);
		});
	}

	static postAssetReview(reqParam, func, funcErr) {
		let url = CMSAPI.getUrl(Config.urls.cms, "/api/review/reviews/");
		callCMSAPI("POST", url, {}, reqParam)
		.then(response => {
			func(response);
		})
		.catch(err => {
			funcErr(err);
		});
	}

	static removeAssetReview(reqParam, func, funcErr) {
		let url = CMSAPI.getUrl(Config.urls.cms, "/api/review/reviews/");
		callCMSAPI("DELETE", url, {}, reqParam)
		.then(response => {
			func(response);
		})
		.catch(err => {
			funcErr(err);
		});
	}

	static voteAssetReview(dic_param, func, funcErr) {
		let url = CMSAPI.getUrl(
			Config.urls.cms,
			"/api/review/reviews/" + dic_param.id + "/" + dic_param.method + "/"
		);
		callCMSAPI("POST", url, {}, dic_param)
		.then(response => {
			func(response);
		})
		.catch(err => {
			funcErr(err);
		});
	}

	static getAssetReviewStat(reqParam, func, funcErr) {
		let url = CMSAPI.getUrl(
			Config.urls.cms,
			"/api/review/reviewstat?asset_id="+reqParam.asset_id
		);
		
		callCMSAPI("GET", url, {}, reqParam)
		.then(response => {
			func(response);
		})
		.catch(err => {
			funcErr(err);
		});
	}

  	static readPortfolio(dic_param, func, funcErr) {
    	let url = CMSAPI.getUrl(
		    Config.urls.cms,
			"/api/portfolio/portfolios/" + dic_param.id + "/read/"
		);
		callCMSAPI("POST", url, {}, dic_param)
		.then(response => {
			func(response);
		})
		.catch(err => {
			funcErr(err);
		});
	}

	static votePortfolio(dic_param, func, funcErr) {
		let url = CMSAPI.getUrl(
			Config.urls.cms,
			"/api/portfolio/portfolios/" + dic_param.id + "/vote/"
		);
		callCMSAPI("POST", url, {}, dic_param)
		.then(response => {
			func(response);
		})
		.catch(err => {
			funcErr(err);
		});
	}

	static getPortfolioItem(dic_param, func, funcErr) {
    	let a_method = "/api/portfolio/portfolioitems/";
		if (dic_param.hasOwnProperty('asset_id')) a_method += "?asset_id=" + dic_param.asset_id;
		if (dic_param.hasOwnProperty('username')) a_method += "?username=" + dic_param.username;
		if (dic_param.hasOwnProperty('user_id')) a_method += "?user_id=" + dic_param.user_id;

		let url = CMSAPI.getUrl(
		    Config.urls.cms,
			a_method
		);
		url = CommonFunc.addLimitOffsetToQuery(url, dic_param);

		callCMSAPI("GET", url, {}, dic_param)
		.then(response => {
			func(response);
		})
		.catch(err => {
			funcErr(err);
		});
	}

	static getAssetQuestion(dic_param, func, funcErr) {
		let a_method = null;
		if (dic_param.hasOwnProperty("asset_id")) {
			a_method = "/api/qa/questions/?asset_id=" + dic_param.asset_id;
		}
		if (dic_param.hasOwnProperty("id")) {
			a_method = "/api/qa/questions/?id=" + dic_param.id;
		}

		let url = CMSAPI.getUrl(Config.urls.cms, a_method);
		url = CommonFunc.addLimitOffsetToQuery(url, dic_param);

		callCMSAPI("GET", url, {}, dic_param)
		.then(response => {
			func(response);
		})
		.catch(err => {
			funcErr(err);
		});
	}

  	static postAssetQuestion(dic_param, func, funcErr) {
    	let url = CMSAPI.getUrl(Config.urls.cms, "/api/qa/questions/");
    	callCMSAPI("POST", url, {}, dic_param)
      	.then(response => {
        	func(response);
      	})
      	.catch(err => {
        	funcErr(err);
      	});
  	}

  	static voteAssetQuestion(dic_param, func, funcErr) {
    	let url = CMSAPI.getUrl(
      		Config.urls.cms,
      		"/api/qa/questions/" + dic_param.id + "/" + dic_param.method + "/"
    	);
    	callCMSAPI("POST", url, {}, dic_param)
      	.then(response => {
        	func(response);
      	})
      	.catch(err => {
        	funcErr(err);
      	});
  	}

	static deleteAssetQuestion(dic_param, func, funcErr) {
    	let url = CMSAPI.getUrl(
      		Config.urls.cms,
      		"/api/qa/questions/" + dic_param.id + "/"
    	);
    	callCMSAPI("DELETE", url, {}, dic_param)
      	.then(response => {
        	func(response);
      	})
      	.catch(err => {
        	funcErr(err);
      	});
  	}

	static postAssetAnswer(dic_param, func, funcErr) {
		let url = CMSAPI.getUrl(Config.urls.cms, "/api/qa/answers/");
		callCMSAPI("POST", url, {}, dic_param)
		.then(response => {
			func(response);
		})
		.catch(err => {
			funcErr(err);
		});
	}

  	static getAssetAnswer(dic_param, func, funcErr) {
    	let url = CMSAPI.getUrl(
      		Config.urls.cms,
      		"/api/qa/answers/?question_id=" + dic_param.question_id
    	);
		url = CommonFunc.addLimitOffsetToQuery(url, dic_param);
    	callCMSAPI("GET", url, {}, dic_param)
      	.then(response => {
        	func(response);
      	})
      	.catch(err => {
	        funcErr(err);
    	});
  	}

	static voteAssetAnswer(dic_param, func, funcErr) {
		let url = CMSAPI.getUrl(
		Config.urls.cms,
		"/api/qa/answers/" + dic_param.id + "/" + dic_param.method + "/"
		);
		callCMSAPI("POST", url, {}, dic_param)
		.then(response => {
			func(response);
		})
		.catch(err => {
			funcErr(err);
		});
	}

	static deleteAnswerPost(dic_param, func, funcErr) {
		let url = CMSAPI.getUrl(
			Config.urls.cms,
			"/api/qa/answers/" + dic_param["id"] + "/"
		);
		//let url = CMSAPI.getUrl(Config.urls.cms,"/api/blog/posts/");
		callCMSAPI("DELETE", url, {}, dic_param)
		.then(response => {
			func(response);
		})
		.catch(err => {
			funcErr(err);
		});
	}

  	static getAssetAnswerComment(dic_param, func, funcErr) {
    	let url = CMSAPI.getUrl(
      		Config.urls.cms,
      		"/api/qa/acomments/?question_id=" + dic_param.question_id+"&answer_id="+dic_param.answer_id
    	);

		url = CommonFunc.addLimitOffsetToQuery(url, dic_param);
		
    	callCMSAPI("GET", url, {}, dic_param)
      	.then(response => {
        	func(response);
      	})
      	.catch(err => {
        	funcErr(err);
      	});
  	}

  	static postAssetAnswerComment(dic_param, func, funcErr) {
    	let url = CMSAPI.getUrl(Config.urls.cms, "/api/qa/acomments/");
    	callCMSAPI("POST", url, {}, dic_param)
      	.then(response => {
        	func(response);
      	})
      	.catch(err => {
        	funcErr(err);
      	});
  	}

  	static deleteAssetAnswerComment(dic_param, func, funcErr) {
    	let url = CMSAPI.getUrl(
			Config.urls.cms, 
			"/api/qa/acomments/" + dic_param.id + "/"
		);
    	callCMSAPI("Delete", url, {}, dic_param)
      	.then(response => {
        	func(response);
      	})
      	.catch(err => {
        	funcErr(err);
      	});
  	}

	static voteAssetAnswerComment(dic_param, func, funcErr) {
		let url = CMSAPI.getUrl(
		Config.urls.cms,
		"/api/qa/acomments/" + dic_param.id + "/" + dic_param.method + "/"
		);
		callCMSAPI("POST", url, {}, dic_param)
		.then(response => {
			func(response);
		})
		.catch(err => {
			funcErr(err);
		});
	}


	static getAssetQuestionComment(dic_param, func, funcErr) {
    	let url = CMSAPI.getUrl(
      		Config.urls.cms,
      		"/api/qa/qcomments/?question_id=" + dic_param.question_id
    	);

		url = CommonFunc.addLimitOffsetToQuery(url, dic_param);
		
    	callCMSAPI("GET", url, {}, dic_param)
      	.then(response => {
        	func(response);
      	})
      	.catch(err => {
        	funcErr(err);
      	});
  	}

  	static postAssetQuestionComment(dic_param, func, funcErr) {
		let url = CMSAPI.getUrl(Config.urls.cms, "/api/qa/qcomments/");
		callCMSAPI("POST", url, {}, dic_param)
	  	.then(response => {
			func(response);
	  	})
	  	.catch(err => {
			funcErr(err);
	  	});
  	}


  	static deleteAssetQuestionComment(dic_param, func, funcErr) {
    	let url = CMSAPI.getUrl(
			Config.urls.cms, 
			"/api/qa/qcomments/" + dic_param.id + "/"
		);
    	callCMSAPI("Delete", url, {}, dic_param)
      	.then(response => {
        	func(response);
      	})
      	.catch(err => {
        	funcErr(err);
      	});
  	}


	static voteAssetQuestionComment(dic_param, func, funcErr) {
		let url = CMSAPI.getUrl(
		Config.urls.cms,
		"/api/qa/qcomments/" + dic_param.id + "/" + dic_param.method + "/"
		);
		callCMSAPI("POST", url, {}, dic_param)
		.then(response => {
			func(response);
		})
		.catch(err => {
			funcErr(err);
		});
	}

/*
	static getUserRelation(dic_param, func, funcErr) {
		let url = CMSAPI.getUrl(
			Config.urls.cms,
			"/api/user/users/" + dic_param.id + "/relation/"
		);
		callCMSAPI("POST", url, {}, dic_param)
		.then(response => {
			func(response);
		})
		.catch(err => {
			funcErr(err);
		});
	}
*/

    static getFollower(dic_param, func, funcErr) {
        logger.log.debug("CMSAPI.getFollower");

        let a_method = "/api/user/users/" + dic_param.id + "/follower/";
        const url = CMSAPI.getUrl(Config.urls.cms,a_method);

        callCMSAPI("POST", url, {}, dic_param)
        .then(response => {
            func(response);
        })
        .catch(err => {
            funcErr(err);
        });
    }

    static getFollowing(dic_param, func, funcErr) {
        logger.log.debug("CMSAPI.getFollowing");

        let a_method = "/api/user/users/" + dic_param.id + "/following/";
        const url = CMSAPI.getUrl(Config.urls.cms,a_method);

        callCMSAPI("POST", url, {}, dic_param)
        .then(response => {
            func(response);
        })
        .catch(err => {
            funcErr(err);
        });
    }

	static getCaptains(dic_param, func, funcErr) {
        logger.log.debug("CMSAPI.getCaptains");

        let a_method = "/api/user/users/captain?type="+dic_param.type;
        const url = CMSAPI.getUrl(Config.urls.cms,a_method);

        callCMSAPI("GET", url, {}, dic_param)
        .then(response => {
            func(response);
        })
        .catch(err => {
            funcErr(err);
        });
    }

	static getMyFeeds(dic_param, func, funcErr) {
    	let url = CMSAPI.getUrl(
      		Config.urls.cms,
      		"/api/user/users/" + dic_param.user_id + "/myfeed/"
    	);
    	callCMSAPI("POST", url, {}, dic_param)
      	.then(response => {
        	func(response);
      	})
      	.catch(err => {
        	funcErr(err);
      	});
  	}

  	static getUserFeeds(dic_param, func, funcErr) {
    	let url = CMSAPI.getUrl(
      		Config.urls.cms,
      		"/api/user/users/" + dic_param.user_id + "/feed/"
    	);
    	callCMSAPI("POST", url, {}, dic_param)
      	.then(response => {
        	func(response);
      	})
      	.catch(err => {
        	funcErr(err);
      	});
  	}

  	static getUserNotification(dic_param, func, funcErr) {
    	let a_method = "/api/user/users/" + dic_param.user_id + "/notification/";
		let url = CMSAPI.getUrl(Config.urls.cms,a_method);
    	callCMSAPI("POST", url, {}, dic_param)
      	.then(response => {
        	func(response);
      	})
      	.catch(err => {
        	funcErr(err);
      	});
  	}
	  
}
