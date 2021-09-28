// This is just an example,
// so you can safely delete all default props below

import { divide } from "lodash-es"

export default {
	menu: {
		home: "Wevest",
		about: "Introduction",
		asset: "Asset",
		pool: "Pool",
	},
	
	page:{	
		asset : {
			title : 'asset',
			desc : 'You can manage your all assets here!',
			pool : {
				title : 'Pool',
			},
			token : {
				title : 'Free Loan Token',
				roi : {
					title : 'ROI',
				},
				risk : {
					title : 'Risk',
				},
			},
			poolIncome : {
				title : 'Pool Income',
				feeIncome : {
					title : 'Fee Income', 
				},
				yieldFarming : {
					title : 'Yield Farming',
				},
				wevestToken : {
					title : 'Wevest Token',
				},
			},
		},
		freeLoanToken : {
			title : 'Free Loan Token',
			desc: 'Detailed Token page',
			roi : {
				title : 'ROI',
			},
			totalAmount : {
				title : 'Total Amount',
			},
			evaluationPNL : {
				title : 'Evaluation PNL',
			},
			risk : {
				title : 'Risk',
			},
			purchasePrice : {
				title : 'Purchase Price',
			},
			totalPurchase : {
				title : 'Total Purchase',
			},
			principal : {
				title : 'Principal',
			},
			symbol : {
				title : 'Symbol',
			},
			price : {
				title : 'Price',
			},
			amount : {
				title : 'Amount',
			},
			cost : {
				title : 'Cost',
			},
			checkBoxMessage : {
				title : "Don't show again. You can changes this in (Futures-Preference).", 
			},
			redeemComplete : {
				title : 'Total amount liquidated in USDT',
			},
			redeem : {
				title : 'redeem',
			},
		},
		stopPL : {
			title : 'Stop P/L',
			desc : 'description',	
			asset : {
				title : 'Asset',
				avgPurchase : {
					title : 'Avg. Purchase'
				},
				value : {
					title : 'Evaluate Price'
				},
				pl : {
					title : 'Evaluate P/L'
				},
				roi : {
					title : 'Roi'
				},
			},
		},
		borrow : {
			title: 'Borrow',
			desc : 'Use Leverage with Interest-Free Loan!',
			targetAsset : {
				title : 'Select target asset'
			},
			collateralAsset : {
				title : 'Select collateral asset'
			},
			utilization : {
				title : 'Utilization',
			},
			position : {
				title :'Position',
			},
			leverage : {
				title : 'Leverage',
			},
		},
		pool : {
			title : 'Pool',
			desc : 'Manage your pool and add new positions!',
			poolsOverview : {
				title : 'Pools Overview',				
			},
			addLiquidity : {
				title : 'Add Liquidity',
			},
		},
		poolDetail : {
			title : 'Pool Asset',
			desc : 'Manage the asset deposited in the pool!',
			liquidity : {
				title : 'Liquidity',
			},
			fee : {
				title : 'Income (fees)',
			},
			
		},
	},
	
	dialog : {
		redeem : {
			title : 'Redeem',
			symbol : {
				title: 'Symbol',
			},
			price : {
				title: 'Price',
			},
			amount : {
				title: 'Amount',
			},
			cost : {
				title: 'Cost',
			},
			checkBox : {
				title: "Don't show again. You can change this in (Futres-Preference.)",
			},
			completeRedemption : {
				title :'Redemption is complete.'
			},
		},
		token : {
			connectWallet : {
				title : 'Connect A Wallet',
			},
			confirm : {
				long : {
					title : 'Confirm Long',
				},
				short : {
					title : 'Confitm Short',
				},
				checkBox : {
					title : "Don't show again. You can change this in (Futres-Preference.)",
				},
			},
			roi : {
				title : 'ROI',
			},
			totalAmount : {
				title : 'Total Amount',
			},
			evaluationPL : {
				title : 'Evaluation P&L',
			},
			risk : {
				title : 'Risk',
			},
			purchasePrice : {
				title : 'Purchase Price',
			},
			totalPurchase : {
				title : 'Total Purchase Amount',
			},
			principal : {
				title : 'Principal',
			},
		},
		pool : {
			amount : {
				title : 'Amount'
			},
			addLiquidity : {
				title : 'Add Liquidity',
			},
			currentLiquidity : {
				title : 'Current Liquidity',
			},
			tokenPick : {
				title : 'Add Liquidity',
			},
			checking : {
				title : 'Waiting for confirmation',
				desc : 'Check out the transaction in your wallet!',
				adding : 'Adding',
				removing : 'Removing',
			},
			pooledAmount : {
				title : 'Pooled Amount'
			},
			poolingAmount : {
				title : 'Amount',
			},
			remainingAmount : {
				title : 'Available Balances',
			},
		
			confirmPayment : {
				title : 'Confirm Payment',
				desc : 'This dapp is requesting an action, which could take money from your wallet. Make sure you trust this site',			
			},
			exploreView : {
				title : 'Submitted transaction',
				view : 'View in Explore',
			},
			removeLiquidity : {
				title : 'Remove Liquidity'
			},
			connectToWallet : {
				title : 'Connect to a wallet',
			},
			selectCoin : {
				title : 'Select a token!',
			},
			removeToken : {
				title : 'Remove Liquidity'
			},
			submitted : {
				title : 'Submitted transaction'
			},
		},
	},
	//Button 
	button: {
		cancel : "cancel",
		redeem : "redeem",
		completeRedeem : "Confirm",
		completeClosePosition : "Complete Close Position",
		completePosition: "발행 완료",
		connectWallet : "Connect A Wallet",
		code : "Code",
		confirm : "confirm",
		create : 'CREATE',
		document : "Document",
		emergencyKill : "Emergency Kill",
		information : "Information",
		addLiquidity : "Add Liquidity",
		removeLiquidity : "Remove Liquidity",
		long : "LONG",
		ok : "ok",
		newPosition : "New Position",
		remove : "Remove",
		short : "SHORT",
		stopPL : "STOP P/L",
		new : "NEW",
		max : "max",
		coinSelect : "Search",
		add : "add",
		searchPaste : "Search name or paste address",
		close : "ClOSE",
	},
}
