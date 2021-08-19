// This is just an example,
// so you can safely delete all default props below

export default {
	table: {
		selectedRecords: "selectedRecords",
	},

	menu: {
		home: "WeVest!!",
		about: "About",
		news: "News",
		feeds: "Feeds",
		asset: "Asset",
		portfolio: "Portfolio",
		about_wevest: "WeVest?"
	},

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
		kpremium: "KPremium",
		tv: "trade volume",
		alt: "alt coin",
		intro: "intro",
		fundamental: "fundamental",
		price: "Price",
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
		volume_surge: "Volume surge",
		volume_change: "Volme change",
		index: "Index",
		dev_score: "Development",
		price_score: "Price",
		volume_score: "Volume",
		rank: "Rank",
		roi: "ROI",
		avg_holding: "Avg Holding Period",
		follower: "follower",
		following: "following",
		portfolio_description: "Portfolio Summary",
		estimated_value: "Estimated Price",
		current_price: "Current Price",
		symbol: "Symbol",
		date_added: "Listing date",
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
		total_supply: "Total supply",
		max_supply: "Max supply",
		
		market_capital:"Market Capital",
		new_listing: "New Asset",		
		price_surge: "Gainers",

		price_prev: "price prev.",
		price_high: "High",
		price_low: "Low",
		price_open: "Open",
		price_close:"Close",
		volume:"Volume",

		crypto_vc:'Crypto VC LIST',
		good_roi:'Profitable',
		trending:'Trending',

		latest_news:'Latest',
		trending_news:'Trending',
		comments_news:'Comments',

		price_forecast: "Do you think about this asset?",
		
		no_follower:"You will see followers when you have followers",
		no_following:"You will see followings when you have followings",
		no_userfeed:"You will see feeds when your followins post something",
		no_portfolio:"You will see portfolio when you have portfolio",
		
		no_blogpost:"No Blog Post",
		no_blogpost_desc:"You will see blog posts when posted blogs",

		no_qa:"No Questions",
		no_qa_desc:"You will see questions when questions posted",

		no_review:"No Reviews",
		no_review_desc:"You will see reviews when reviews posted",		

		no_tweet:"No Tweets",
		no_tweet_desc:"You will see tweets when tweets posted",		
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
				title : 'forgot password',
			}				
		},
		forgot_password : {
				title : 'Forgot password',
				desc : '',
				rules : {
					title : 'Please enter your registered email ID!'
				},
				email : {
					error : 'Check your email address!'
				},
				expire : {
					title : 'This code will expire in'
				},
		},
		signup : {
			title : 'Sign-Up',
			email : {
				title : 'Email',
				error : 'Email is invalid',
				error2 : 'it is a registered email',
			},
			username : {
				title : 'Username',
				error : 'Username is invalid, please use numbers and letters only',
				error2 : 'Username is already taken',
			},
			password :{
				title : 'Password',
				error : 'Password must at leatst 8 characters long',
			},
			password_confirm : {
				title : 'Password confirm',
				error : 'Password do not match', 
			},
			code: {
				title: 'Authentification Code',
				error : 'Please input 6-digits authentification code', 
			}
		},
 		
		home:{
			title : 'HOME',
			desc :'',
			marketindex: {
				title : 'Check BTC, ETH To Sense Crypto Market',
				desc : ''
			},
			marketwatching : {
				title : 'market risk alarm',
				desc : ''
			},
			blog: {
				title:'Sharpen Your Competitive Edge with NEWS/Blog '
			},
			portfolio: {
				title:'Discover Promising Asset, Start Copy-Investment',
				desc: ''
			},
			community : {
				title : 'Connect to Asset community',
				desc : '',
			},
			asset : {
				title : 'Find Next Gem with us',
				desc : '',
			},
			captain: {
				title : 'Follow The Winners To Win ',
				desc : '',
			},
			userfeed: {
				title:'Activities from your Followings',
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
				desc : 'Please check your email to activate your account',
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
		blog : {
			title : 'BLOG',
			desc : ''
		},
		asset_index : {
			title : 'ASSET',
			desc : ''
		},
		notification : {
			title : 'Notification',	
			desc :'',
			list : {
				title: 'List',
				desc: ''
			}			
		},
		bookmark : {
			title : 'Bookmark',
			desc : 'Add Your Favorite Asset Community!',
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
			},
			input : {
				title : 'Will the price go up?'
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
			title : 'Discover Promising Asset, and Copy it',
			desc :'',
			roi : {
				title : 'VC ROI',
				desc : ''
			}
			
		},
		cryptovc : {
			title : 'Discover Promising Asset, and Start Copy Investment',
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
				title : 'LIST',
				desc : ''
			},
			nouserfeed : {
				title : 'No Userfeed',
				desc : 'Updates from people you are following',
			}
		},
		portfolio_index : {
			title : 'Portfolio',
			desc: ''
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
			title : 'Password has been changed succefully.',
			password_updated : {
				title : 'Password updated.', 
			},
			password_changed : {
				title: '',
			},
			password_complete : {
				title : 'Use your new password to log in.',
			}
		},
		add_portfolio : {
			title : 'Add Portfolio',
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
		messageWriter : {
			desc : 'Send the message!',
			subject : 'Subject',
			body : 'Body',
		},
		edit_dialog: {
			biography: {
				title:'Biography'
			},
			portfolio: {
				title:'New Portfolio Group'
			}
		}
	},
		
	button: {
		more: 'MORE',
		send: 'CONFIRM',
		ssend: 'SEND',
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
		send: "Send",
		resend: "Resend",
		resend_activate: "Resend Activate Mail",
		go_login: "Go to Log In",
		profile:"Profile",
		reset_password:"Reset Password",
		change_password:"Change Password",
		bookmark:"Bookmark",
		next: "Next",
		back: "Back",
	}
};
