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
			desc : '',
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
		stopLoss : {
			title : 'Stop Loss',
			desc : 'description',	
			coinSelect : {
				title : '보유중인 코인',
			},
			asset : {
				title : '보유자산',
				avgPurchase : {
					title : '매수평균가'
				},
				value : {
					title : '평가금액'
				},
				pl : {
					title : '평가손익'
				},
				roi : {
					title : '수익률'
				},
			},
		},
		token : {
			title: 'token 생성',
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
			poolRatio : {
				title : 'Pooling Ratio',
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
				title : 'Fee',
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
			}
		},
		token : {
			connectWallet : {
				title : 'Connect A Wallet',
			},
			confirmLong : {
				title : 'Confirm Long',
			},
			confirmShort : {
				title : 'Confirm Short',
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
			coinChoice : {
				title : '코인선택',
			},
			checking : {
				title : '확인을 기다리는 중 ...',
				desc : '지갑에서 이 거래를 확인하세요!',
				adding : 'Adding',
				removing : 'Removing',
			},
		
			confirmPayment : {
				title : 'Confirm Payment',
				desc : 'This dapp is requesting an action, which could take money from your wallet. Make sure you trust this site',			
			},
			exploreView : {
				title : '제출된 거래',
				view : 'Explore 에서 보기',
			},
			removeLiquidity : {
				title : 'Remove Liquidity'
			},
			connectToWallet : {
				title : 'Connect to a wallet',
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
		confirmLong : "Confirm Long",
		confirmSell : "Confirm Sell",
		confirmShort : "Confirm Short",
		document : "Document",
		emergencyKill : "Emergency Kill",
		information : "Information",
		addLiquidity : "Add Liquidity",
		long : "LONG",
		ok : "ok",
		newPosition : "New Position",
		short : "SHORT",
		sl : "S/L",
		new : "NEW",
		max : "max",
		coinSelect : "Select Coin",
		add : "add",
		searchPaste : "이름 검색 또는 주소 붙여넣기",
		manageTokenList : "토큰 목록 관리",
		close : "ClOSE",
		liquidityAdd : "Liquidity Add",
		liquidityRemove : "Liquidity Remove",
	},
}
