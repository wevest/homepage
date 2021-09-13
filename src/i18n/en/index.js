// This is just an example,
// so you can safely delete all default props below

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
			desc : '보유자산 포트폴리오',
			pool : {
				title : 'Pool',
			},
			token : {
				title : 'Token',
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
		token : {
			title: 'Create a Token',
			desc : '',
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
			desc : 'pool description',
			poolsOverview : {
				title : 'Pools Overview',				
			},
			poolSummary : {
				title : 'Pool Summary'
			},
			addLiquidity : {
				title : 'Add Liquidity',
			},
			poolList : {
				desc : 'Your liquidity position will appear here.', 
			},
		},
		poolDetail : {
			liquidity : {
				title : 'Liquidity',
			},
			fee : {
				title : 'Income (fees)',
			},
			
		},
	},
	
	dialog : {
		asset : {
			roi : {
				title : 'ROI',
			},
			totalAmount : {
				title : 'Total Amount',
			},
			valuationLoss : {
				title : 'Valuation Loss',
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
				title : "Don't show again. You can changes this in (Futures-Preference). ", 
			},
			completeClosePositionMessage : {
				title : 'USDT로 청산한 토큰의 USDT 가격',
			},
			closePosition : {
				title : 'Close Position',
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
			valuationLoss : {
				title : 'Valuation Loss',
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
		},
		pool : {
			addLiquidity : {
				title : 'Add Liquidity',
			},
			currentLiquidity : {
				title : 'Current Liquidity',
			},
			tokenPick : {
				title : 'Select a Token',
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
				title : 'Pooling Amount',
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
				title : 'Select Coin',
			},
		},
	},
	//Button 
	button: {
		cancel : "cancel",
		closePosition : "Close Position",
		completeClosePosition : "Complete Close Position",
		completePosition: "발행 완료",
		connectWallet : "Connect A Wallet",
		code : "Code",
		confirm : "confirm",
		create : 'CREATE',
		document : "Document",
		emergencyKill : "Emergency Kill",
		information : "Information",
		addLiquidity : "Add",
		removeLiquidity : "Remove",
		long : "LONG",
		ok : "ok",
		newPosition : "New Position",
		short : "SHORT",
		stopPL : "STOP P/L",
		new : "NEW",
		max : "max",
		coinSelect : "Search",
		add : "add",
		searchPaste : "Search name or paste address",
		manageTokenList : "토큰 목록 관리",
		close : "ClOSE",
	},
}
