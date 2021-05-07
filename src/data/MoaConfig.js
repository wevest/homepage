export const MoaConfig = {
    general: {
        Z_THRESH_UP:2,
        Z_THRESH_DOWN:-2,
        SECTORS: ['major','korean','chinese','defi','nft','misc'],
        KCODE:'kcodes',
    },
    setting: { 
        loginExpiredTime: 3000*1000,
        notificationLimit:20,
        chatMessageLimit:10,
        balanceCheckInternval:60,
        exchangeRateCheckInternval:60,
        assetBalanceCheckInternval:300,
        assetListCheckInternval:300,
        myAssetBalanceCheckInternval:60,
        avatarMaxImageSize:256000,
        photoMaxImageSize:2000000,
        maxAssetPhoto:5,
        pegasusReference:'pegasusTx',
    },
    firebase: {
        apiKey: 'AIzaSyAxk1aIqRAd4hiaOPHexj3vFXo0gmeEDDE',
        authDomain: 'eiam-695f7.firebaseapp.com',
        databaseURL: 'https://eiam-695f7.firebaseio.com',
        projectId: 'eiam-695f7',
        storageBucket: 'eiam-695f7.appspot.com',
        messagingSenderId: 'YOUR_MESSAGING_SEND_ID',
    },
    urls: {
        //moa: 'http://localhost:8000',
        moa: 'http://192.168.0.111:8000',
        egateway:'https://api-ep-prototype.edenchain.io/api',
        pegasus:'http://35.232.126.78:8081/api/v1',
        wallet: 'http://35.232.126.78:8081/api/v1',
        private: '',
        etherscan: 'https://ropsten.etherscan.io/tx/'
    },
    emails: {
        adminmail: 'moa@edenchain.io',
    },
    alert: {
        dismissSecs: 2,
        dismissCountDown: 0
    },
    log : {
        logLevel: 'debug',
        separator: '|',
        stringifyArguments: false,
        showLogLevel: false,
        showMethodName: true,
        showConsoleColors: true,
        showDev: true,
    },
    error: {
        firebaseCollection:'errors',
        firebaseReference:'moa',
        uploadError: true
    },
    decimals: {
        tedn: 1
    },
    currencyTypeList:{
        erc20_tokens : ['erc20_edn', 'erc20_usdt', 'erc20_leo',
        'erc20_ht', 'erc20_link', 'erc20_mkr', 'erc20_usdc', 'erc20_ino',
        'erc20_tusd', 'erc20_pax', 'erc20_bnb', 'erc20_okb', 'erc20_zb',
        'erc20_lamb', 'erc20_omg', 'erc20_bat', 'erc20_matic','erc20_mana', 
        'erc20_dai', 'erc20_iost', 'erc20_icx', 'erc20_kcs' ]
    }
    ,
    supportedCrypto: {
        tokens: [
        {
            name:"Ethereum",
            blockchain:"eth",
        },
        {
            name:"T EDEN",
            blockchain:"tedn",
        },
        {
            name:"Eden",
            blockchain:"erc20_edn",
        },
        {
            name:"Tether USD",
            blockchain:"usdt",
        },
        {
            name:"Bitfinex LEO Token",
            blockchain:"leo",
        },
        {
            name:"Huobi",
            blockchain:"ht",
        },
        {
            name:"ChainLink",
            blockchain:"link",
        },
        {
            name:"Maker",
            blockchain:"mkr",
        },
        {
            name:"USD Coin",
            blockchain:"usdc",
        },
        {
            name:"InoCoin",
            blockchain:"ino",
        },
        {
            name:"TrueUSD",
            blockchain:"tusd",
        },
        {
            name:"Paxos Standard",
            blockchain:"pax",
        },
        {
            name:"Binance Coin",
            blockchain:"bnb",
        },
        {
            name:"OKEX Coin",
            blockchain:"okb",
        },
        {
            name:"ZBToken",
            blockchain:"zb",
        },
        {
            name:"InoCoin",
            blockchain:"eth",
        },
        {
            name:"Lambda",
            blockchain:"lamb",
        },
        {
            name:"OmiseGo",
            blockchain:"omg",
        },
        {
            name:"BAT",
            blockchain:"bat",
        },
        {
            name:"Matic Token",
            blockchain:"matic",
        },
        {
            name:"Decentraland",
            blockchain:"mana",
        },
        {
            name:"Dai Stablecoin",
            blockchain:"dai",
        },
        {
            name:"IOSToken",
            blockchain:"iost",
        },
        {
            name:"Icon",
            blockchain:"icx",
        },
        {
            name:"Kucoin Shares",
            blockchain:"kcs",
        }
        ]
    }    
}