import logger from 'src/error/Logger';


const ERRCODE = {
  OPERATION: {
    NetworkConnectionError:-1,
    HTTPStatusError:-2,
    NoResponseError:-3,  
    AuthError:-4,  
    OtherNetworkError:-5,  
    
    NoResponseFromServer: -1001,
    ServerExecutionError:-1003,
    MarketPriceServerError:-1100,
    SwapServerError:-1101,
    OtherError:-1999,

    DatabaseError: -51,
    FirebaseUpdateError: -52,
    FirebaseDeleteError: -53,
    FirebaseInsertError: -54,
    FirebaseQueryError: -55,  
    FirebaseSignupError: -70,
    FirebaseUpdateProfileError: -3005,
    
    JSONParsingError: -2001,
    SwapHistoryJSONParsingError:-2003,
    TransferHistoryJSONParsingError:-2004,

    WrongSwapCurrency: -2005,

    AuthTokenExpired: -5001,
    AuthTokenUnauthorized: -5004,
    
    EdenChainIamGetInfoFailed: -10025,
    EdenChainApigwUncaughtErrors: -10051,
    WalletBalanceException:-10071,
    PegasusSwapException: -10201,
    EthereumNetworkError: -32000,

    NotDefined: -99999
  },
  PROGRAMMER: {
    PermissionError: -100001,
    ParameterError: -100002,
    ValidationError: -100003,  
    ReferenceError: -100004,
    RangeError: -100005,
    SyntaxError: -100006,
    JsonParseError:-200000,
  }
};


export class BaseError extends Error {
  constructor(errCode,message,extra) {
    super(message);

    this.timestamp = new Date().getTime();
    this.errCode = errCode;
    this.extra = extra;
  }

  static isOperationalError(errCode) {
    if ((errCode<0) && (errCode>-100000)) {
      return true;
    }
    return false;
  }

  static isProgrammerError(errCode) {

  }

  static getDefaultErrorMessage(errCode,extra) {
    if (BaseError.isOperationalError(errCode)) {
      return BaseError.getDefaultOperationalErrorMessage(errCode,extra);
    }
    return BaseError.getDefaultProgrammerErrorMessage(errCode);
  }

  static getDefaultOperationalErrorMessage(errCode,extra) {
    logger.log.debug("Err.getDefaultOperationalErrorMessage",errCode);
    if (errCode===ERRCODE.OPERATION.NetworkConnectionError) {
      return "Network is unstable, please try again later";
    }
    if (errCode===ERRCODE.OPERATION.NetworkTimeoutError) {
      return "Network is unstable, please try again later";
    }
    if (errCode===ERRCODE.OPERATION.HTTPStatusError) {
      return "Server does not permit your request";
    }
    if (errCode===ERRCODE.OPERATION.AuthTokenUnauthorized) {
      return "Unauthorized Auth Token";
    }
    if (errCode===ERRCODE.OPERATION.AuthTokenExpired) {
      return "User session is Expired. Please Re-login.";
    }
    if (errCode===ERRCODE.OPERATION.EthereumNetworkError) {
      return "Ethereum Network Error. "+extra;
    }
    if (errCode===ERRCODE.OPERATION.WrongSwapCurrency) {
      return "Source currency or Target currency is incorrectly selected. Please select again.";
    }
    if (errCode===ERRCODE.OPERATION.EdenChainApigwUncaughtErrors) {
      return "Fail to call EGateway API. Please check your input value.";
    }
    if (errCode===ERRCODE.OPERATION.PegasusSwapException) {
      return "Exchange rate is changed. Please try again in a few minutes. "+extra;
    }
    if (errCode===ERRCODE.OPERATION.NotDefined) {
      return "Error is not defined. Please contact administrator. "+extra;
    }

    
    return "";
  }

  static getDefaultProgrammerErrorMessage(errCode) {
    if (errCode===ERRCODE.PROGRAMMER.SyntaxError) {
      return "Syntax Error";
    }
    if (errCode===ERRCODE.PROGRAMMER.RangeError) {
      return "Range Error";
    }
    if (errCode===ERRCODE.PROGRAMMER.ReferenceError) {
      return "Reference Error";
    }
    return '';
  }  
}


const Errors = {
  ERRCODE,
  raise(errCode,msg='',extra=null) {
    if (msg.length==0) {
      msg = BaseError.getDefaultErrorMessage(errCode,extra);
    }
    const err = new BaseError(errCode,msg,extra);
    logger.log.debug("err test",err.extra);
    return err;
  }  
}

export default Errors;