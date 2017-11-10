const DEFAULT_CONFIG = {
    V: '2.0',
    key: 'ec85d3648154874552835438ac6a02b2',
    plugin: []
};

let __script_loaded = false; 
const queuedLoader = []; // 排队的loader

export default class APILoader {
  constructor(key) {
    this.config = DEFAULT_CONFIG;
    if (typeof window !== 'undefined') {
      if (key) {
        this.config.key = key;
      } else if ('imapkey' in window) {
        this.config.key = window.imapkey;
      } else {
        //
      }
    }
  }

  getScriptSrc(cfg) {
    // 拼接script
    const protocol = window.location.protocol; // 获取协议http或者https
    const hostAndPath =window.host =  window.location.hostname; // 获取path
    let scriptSrc = `${protocol}//${hostAndPath}:25001/as/webapi/js/auth?v=${cfg.v}&t=jsmap&ak=${cfg.key}`;
    // if (cfg.plugin.length) scriptSrc += `&plugin=${cfg.plugin.join(',')}`;
    return scriptSrc;
  }

  load() {
    // 加载
    if (typeof window === 'undefined') {
      return null;
    }
    // this.config 为最开始定义的 default_config
    const _config = this.config;
    /*
     * 初次加载同步加载插件；
     * 后面再加载的时候，要确保所依赖的插件也全部异步加载成功
     */
    if (window.IMAP) {
      // 要确保所有的插件加载成功
      if (_config.plugin && _config.plugin.length) {
        const promiseArr = []; // 异步请求plugin 的数组
        _config.plugin.forEach((p) => {
          // 异步加载plugin
          const pro = new Promise((resolve) => {
            window.IMAP.plugin(p, () => {
              resolve();
            });
          });
          promiseArr.push(pro);
        });
        return Promise.all(promiseArr);
        // 并行执行全部promise
      }
      return Promise.resolve();
      // 返回一个已经结束的promise
    }
// 为了callback
    if (__script_loaded) {
      return new Promise(resolve => {
        queuedLoader.push(() => {
          resolve();
        });
      });
    }
    // 生成一个script 并且插入到 页面头部  
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.src = this.getScriptSrc(_config);

    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = `http://${window.host}:25002/jsmap/2.0/IMap.css`;

    const main = document.createElement('script');
    main.type = 'text/javascript';
    main.async = true;
    main.defer = true;
    main.src = `http://${window.host}:25002/jsmap/2.0/main.js`

    const IMapStreetView = document.createElement('script');
    IMapStreetView.type = 'text/javascript';
    IMapStreetView.async = true;
    IMapStreetView.defer = true;
    IMapStreetView.src =`http://${window.host}:25002/jsmap/2.0/flash/IMapStreetView.js`

    const jsmapconfig = document.createElement('script');
    jsmapconfig.type = 'text/javascript';
    jsmapconfig.async = true;
    jsmapconfig.defer = true;
    jsmapconfig.src =`http://${window.host}:25001/as/webapi/js/auth?v=2.0&t=jsmapconfig&ak=ec85d3648154874552835438ac6a02b2`

    const scriptLoadingPromise = new Promise((resolve, reject) => {
      script.onload =  () => resolve();
      script.onerror = error => reject(error);
    });
    document.head.appendChild(script);
    document.head.appendChild(style);
    document.head.appendChild(main);
    document.head.appendChild(IMapStreetView);
    document.head.appendChild(jsmapconfig);
    
    
    __script_loaded = true;
    return scriptLoadingPromise;
  }
}

