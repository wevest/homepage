export const RUNNING_TESTS = process.env['NODE_ENV'] === 'testing';
export let SHOW_POPUPS_AS_CONSOLE = false;

export const setPopupsAsConsole = bool => SHOW_POPUPS_AS_CONSOLE = bool;

const mockWindow = {
  id:0,
  hide:() => true,
  close:() => true,
  isMaximized:() => true,
  unmaximize:() => true,
  maximize:() => true,
  webContents:{
    send:() => true
  },
  openDevTools:() => true,
  flashFrame:() => true,
};


export const MOCK_ELECTRON = {
  ipcRenderer:{
    on:(x, cb) => cb(),
    sendTo:(x, cb) => cb()
  },
  clipboard: { writeText: () => true },
  shell:{ openExternal:() => true },
  remote:{
    getCurrentWindow:() => mockWindow,
    app:{
      quit:() => true,
      BrowserWindow:{
        getFocusedWindow:() => mockWindow,
        fromId:x => mockWindow
      },
      getPath:(x) => '',
      getVersion:() => '0.0.0'
    },
    process:{
      platform:'win32'
    },
    getGlobal:x => ({
      Transport:{
        default:true,
      },
      NotificationService: {
        pushNotification:() => true,
      },
      ApiWatcher: {},
      LowLevelWindowService:{
        openPopOut:() => true,
      }
    }),
    dialog:{
      showOpenDialog:() => true
    },
    Menu: {
      buildFromTemplate: () => ({
        popup: () => true
      })
    }
  }
}


export class TestStore {

  constructor(name){
    this.store = {};
  }

  async get(key){
    return this.store[key]
  }

  async set(key, val){
    this.store[key] = val;
    return true;
  }

  async clear(){
    this.store = {};
    return true;
  }
}


export class MyStore {

  constructor(name){
    this.store = {};
  }

  get(key){
    //logger.log.debug("TestingHelper.get : ",key);

    return localStorage.getItem(key);
    //return JSON.parse(localStorage.getItem(key));
  }

  set(key, value){
    let jsonStr = JSON.stringify(value);
    //logger.log.debug("MyStore.set - ",key,jsonStr);

    this.store[key] = value;
    localStorage.setItem(key,jsonStr);
    return true;
  }

  clear(){
    this.store = {};
    localStorage.clear();
    return true;
  }
}
