// This is just an example,
// so you can safely delete all default props below

export default {
	name: {
		binance: "Binance",
		upbit: "UPbit",
		bithumb: "bithumb",
		blog: 'Blog',
		d1: "1 day",
		w1: "1 week",
		m1: "1 month",
		m3: "3 month",
		m6: "6 month",
		y1: "1 year",
		y3: "3 year",
		y5: "5 year",
		y10: "10 year",
		all: "all",
		sector: "Sector",
		coin: "Coin",
		gold: "Gold",
		btc: "Bitcoin",
		bitcoin: "Bitcoin",
		wti: "WTI",
		bond: "US bonds",
		usd: "Dollar",
		nyse: "NYSE",
		bb_upper: "Resistence level",
		bb_lower: "Support level",
		bb_mid: "Moving average",
		volume: "Volume",
		kpremium: "KPremium",
		tv: "trade volume",
		alt: "alt coin",
		price_prev: "price prev.",
		price_high: "price high",
		price_low: "price low",
		price_open: "price open",
		volume: "volume",
		intro: "intro",
		fundamental: "fundamental",
		price: "가격",
		subscriber_count: "subscriber count",
		language: "language",
		watcher_count: "watcher count",
		forks_count: "forks count",
		comments: "comments",
		commit_count: "commit count",
		description: "description",
		created_at: "created at",
		pushed_at: "pushed at",
		info: "Info",
		trade_date: "Trade Date",
		tweet: 'Tweet',
		qa : 'QA',
		review: 'Review',
		investor: "Investor",
		development: "Development",
		name: "Name",
		total_return: "total return",
		avg_roi: "Avg ROI",
		avg_total_return: "Avg Total Return",
		homepage: "Homepage",
		count: "Count",
		price_surge: "price surge",
		volume_surge: "Volume surge",
		volume_change: "Volme change",
		index: "Index",
		dev_score: "Development",
		price_score: "Price",
		volume_score: "Volume",
		rank: "Rank",
		roi: "ROI",
		follower: "follower",
		following: "following",
		portfolio_description: "Portfolio Summary",
		estimated_value: "Estimated Price",
		current_price: "Current Price",
		symbol: "Symbol",
		date_added: "listing date",
		blog_writing: "Please share your knowledge!",
		comment_writing: "Please leave a comment!",
		tweet_writing: "Tweet write...",
		qa_writing: "Ask anything!",
		question_title: "Write down the title!",
		reward: "reward",
		your_rating: "Your rating?",
		review_login: "Why do you think so?",
		review_logout: "Please login first!",
		type_something: "Fill in the blank, please!",
		platform: "Platform",
		chat: "Chat",
		twitter: "Twitter",
		website: "Website",
		source_codes: "Source codes",
		token_address: "Token address",
		circulating_supply:"Circulating supply",
		total_supply: "Totla supply",
		max_supply: "Max supply",
	},
	
	page:{	
		login : {
			title : 'Sign-In',
			input : {
				error : 'Username or password is wrong',
			},
			username : {
				title : 'Username',
			},
			password : {
				title : 'Password',
			},
			signedin : {
				title : 'Stay loged-In',
			},				
			forgot_password : {
				title : 'Forgot password',
			},

		},
		signup : {
			title : 'Sign-Up',
			email : {
				title : 'Email',
				error : 'Email is invalid',
			},
			username : {
				title : 'Username',
				error : 'Username is invalid, please use numbers and letters only',
			},
			password :{
				title : 'Password',
				error : 'Password must at leatst 8 characters long',
			},
			password_confirm : {
				title : 'Password confirm',
				error : 'Password do not match', 
			},
		},
 		
		home:{
			title : 'HOME',
			desc :'',
			marketwatching : {
				title : 'market risk alarm',
				desc : ''
			},
			blog_list: {
				title:'market trend'
			},
			portfolio_list: {
				title:'VC portfolio',
				desc: ''
			},
			new_asset_list : {
				title : 'new asset list',
				desc : '',
			},
			userfeed_list: {
				title:'USERFEEDS',
				desc:''				
			},
				roi: {
					title:'high roi portfolio',
					desc:''
				},
				highvoted: {
					title:'favorite portfolio',
					desc:''
			},
						
		},
		activation : {
			title: 'SIGN UP Activation',
			desc : '',
			mail_sent : {
				title : 'Activation Mail Sent',
			}
		},
		registration : {
			title : 'Sign Up Complete',
			desc : '',
			complete : {
				title : 'Congratulations!',
				desc : 'Sign Up Complete!',
			}
		},
		change_pwd : {
			title : 'Change password',
			desc : '',
			rules : {
				title : 'Password must be at leatst 8 characters long',
			},
			current : {
				title : 'Current password',
				error : 'Password is wrong'
			},
			new : {
				title : 'New password',
				error : 'Password must be at leatst 8 characters long',
			},
			confirm : {
				title : 'Confirm',
				error : 'Passwords do not match'
			},
		},
		pwd_reset_ : {
			title : 'PASSWORD RESET',
			desc : '',
			mail_sent : {
				title : 'Password Reset Email Sent',
			}
		},
		assetqa: {
			title: 'QA',
			desc: 'feel free to ask anything!',
			questionlist : {
				title:'question list',
			}
		},
		qa_detail : {
			accepted : {
				title: 'accepted answer',
			}
		},		
		profile: {
			title:'profile',
			desc:'',
			display_name: {
				title : 'display name',
			},
			username : {
				title : 'username',
			},
			email : {
				title : 'email',
			},
			biography : {
				title : 'Introduction',
			},
			language : {
				title : 'Language',
			},
			portfoliolist : {
				title: 'Portfolio',
				desc: '',
			},
			follower : {
				title: 'Follower',
			},
			following : {
				title: 'Following',
			},
			userfeed : {
				title: 'Userfeeds',
			},
		},
		portfolio_detail : {
			roi_chart : {
				title : 'ROI CHART'
			}
		},
		asset : {
			bloglist : {
				title : 'BLOG',
				desc: '',
			},
			questionlist : {
				title : 'QUESTION',
				desc: '',
			},
			priceforecast : {
				title : 'price forecast',
				desc : ''
			},
			tweets : {
				title : 'TWEET',
				desc: '',
			}
		},
		asset_detail : {
			price_chart : {
				title : 'price chart',
				desc : '',
			},
			price_data : {
				title : 'price data',
				desc : '',
			}
		},
		review : {			
			forecast : {
				title : 'investor forecast',
				desc : '',
				},
			forecastlist : {
				title : 'forecast list',
				desc : ''
			}
		},
		blogwriter : {
			title : 'blog write',
			desc : 'Please share your knowledge!',
			bloglist : {
				title : 'Blog list',
				desc : ''
			}
		},
		inbox : {
			title : 'MessageBox',
			desc : '',
		},
		risk : {
			title : 'Risk',
			desc : '',
			chart : {
				risk : {
					title : 'Risk',
					desc : ''
				},
				risk_vix : {
					title : 'Risk_VIX',
					desc :''
				},
				risk_event : {
					title : 'Risk_EVENT',
					desc : ''
				}
			}
		},

		cwatch : {
			title : 'CWATCH',
			desc : '',
			subtitle : {
				title : "Let's see how accurate it is!",
				desc: '',
			},
			probability : {
				title : 'Change Probability Level',
			},
			btc : {
				title : 'CWatch BTC',
			},
			eth : {
				title : 'CWatch ETH',
			}
		},
		vcportfolio : {
			title : 'VC Portfolio',
			desc :'',
			roi : {
				title : 'VC ROI',
				desc : ''
			}
			
		},
		cryptovc : {
			title : 'CRYPTO VC',
			desc : '',
			roi : {
				title : 'CRYPTO VC ROI',
				desc :'',
			},
			portfolio : {
				title : 'CRYPTO VC PORTFOLIO',
				desc: ''
			}
		},
		trend : {
			title : 'MARKET TREND',
			desc : '',
			chart : {
				index : {
					title : 'MARKET TREND INDEX',
					desc :'',
				},
				dominance : {
					title : 'Dominance',
					desc : '',
				},
				kpremium : {
					title : 'Kpremium',
					desc : '',
				},
				sector : {
					title : 'Sector',
					desc : '',
				},
				sectortv : {
					title : 'SectorTV',
					desc : '',
				}
			}
		},
		feeds : {
			title : 'USERFEEDS',
			desc : '',
			userfeed : {		
				title : 'USERFEED LIST',
				desc : ''
			},
			nouserfeed : {
				title : 'No Userfeed',
				desc : 'Updates from people you are following',
			}
		},
		forecast : {
			title : 'Will the price go up in the future?',
		}
	},


	dialog : {
		password_edit : {
			title : 'Forgot password',
			desc : 'Please enter a email!',
		},
		biography : {
			title : 'Biography',
		},
		
		reset_password : {
			password_updated : {
				title : 'Password updated.', 
			},
			password_changed : {
				title: "Password has been changed succefully.",
			},
			password_complete : {
				title : 'Use your new password password to log in.',
			}
		},
		add_portfolio : {
			title : '포트폴리오를 추가',
			desc :'Please manage your portfolio!',
			asset : {
				title : 'Asset',
			},
			no_results : {
				title : 'No results',
			},
			group_name : {
				title : "Portfolio Group Name"
			},
			description : {
				title : "Description"
			},
		},
		delete : {
			title : 'Do you want to delete?',
		},
		edit_dialog: {
			biography: {
				title:'Biography'
			}
		}
	},
		
	button: {
		more: 'MORE',
		send: 'CONFIRM',
		save: 'SAVE',
		edit: 'Update',
		cancel: 'CANCEL',
		close: 'CLOSE',
		lordmore: 'MORE',
		change: 'UPDATE',
		follow: 'FOLLOW',
		unfollow: 'FOLLOWING',
		following: 'FOLLOWING',
		userfollow: 'FOLLOW',
		userfollowing: 'FOLLOWING',
		message: 'MESSAGE',
		blog_like : 'Good',
		blog_dislike : 'Not Good',
		answer_like : 'Good',
		answer_dislike : 'Not Good',
		portfolio_like: 'Excellent',
		portfolio_dislike: 'Rebalancing is needed',
		reply: 'REPLY',
		expand: 'Comment',
		collapse: 'Collapse',
		update: 'UPDATE',
		add : 'ADD',
		show_table: 'PRICE INFO TABLE',
		portfolio: 'PORTFOLIO',
		share: 'SHARE',
		blog: 'BLOG',
		question: 'QUESTION',
		logout: 'Logout',
		login: 'Login',
		signup: 'Sign Up',
		chartview: "CHART",
		confirm: "Confirm",
		go_home: "Go home",
		resend_activate: "Resend Activate Mail",
		go_login: "Go to Log In",
		profile:"Profile",
	}
};