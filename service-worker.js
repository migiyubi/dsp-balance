try{self["workbox:core:6.1.0"]&&_()}catch(t){}const t=(t,...e)=>{let s=t;return e.length>0&&(s+=` :: ${JSON.stringify(e)}`),s};class e extends Error{constructor(e,s){super(t(e,s)),this.name=e,this.details=s}}try{self["workbox:routing:6.1.0"]&&_()}catch(t){}const s=t=>t&&"object"==typeof t?t:{handle:t};class n{constructor(t,e,n="GET"){this.handler=s(e),this.match=t,this.method=n}setCatchHandler(t){this.catchHandler=s(t)}}class i extends n{constructor(t,e,s){super((({url:e})=>{const s=t.exec(e.href);if(s&&(e.origin===location.origin||0===s.index))return s.slice(1)}),e,s)}}class r{constructor(){this.t=new Map,this.i=new Map}get routes(){return this.t}addFetchListener(){self.addEventListener("fetch",(t=>{const{request:e}=t,s=this.handleRequest({request:e,event:t});s&&t.respondWith(s)}))}addCacheListener(){self.addEventListener("message",(t=>{if(t.data&&"CACHE_URLS"===t.data.type){const{payload:e}=t.data,s=Promise.all(e.urlsToCache.map((e=>{"string"==typeof e&&(e=[e]);const s=new Request(...e);return this.handleRequest({request:s,event:t})})));t.waitUntil(s),t.ports&&t.ports[0]&&s.then((()=>t.ports[0].postMessage(!0)))}}))}handleRequest({request:t,event:e}){const s=new URL(t.url,location.href);if(!s.protocol.startsWith("http"))return;const n=s.origin===location.origin,{params:i,route:r}=this.findMatchingRoute({event:e,request:t,sameOrigin:n,url:s});let a=r&&r.handler;const o=t.method;if(!a&&this.i.has(o)&&(a=this.i.get(o)),!a)return;let c;try{c=a.handle({url:s,request:t,event:e,params:i})}catch(t){c=Promise.reject(t)}const h=r&&r.catchHandler;return c instanceof Promise&&(this.o||h)&&(c=c.catch((async n=>{if(h)try{return await h.handle({url:s,request:t,event:e,params:i})}catch(t){n=t}if(this.o)return this.o.handle({url:s,request:t,event:e});throw n}))),c}findMatchingRoute({url:t,sameOrigin:e,request:s,event:n}){const i=this.t.get(s.method)||[];for(const r of i){let i;const a=r.match({url:t,sameOrigin:e,request:s,event:n});if(a)return i=a,(Array.isArray(a)&&0===a.length||a.constructor===Object&&0===Object.keys(a).length||"boolean"==typeof a)&&(i=void 0),{route:r,params:i}}return{}}setDefaultHandler(t,e="GET"){this.i.set(e,s(t))}setCatchHandler(t){this.o=s(t)}registerRoute(t){this.t.has(t.method)||this.t.set(t.method,[]),this.t.get(t.method).push(t)}unregisterRoute(t){if(!this.t.has(t.method))throw new e("unregister-route-but-not-found-with-method",{method:t.method});const s=this.t.get(t.method).indexOf(t);if(!(s>-1))throw new e("unregister-route-route-not-registered");this.t.get(t.method).splice(s,1)}}let a;function o(){return(o=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var s=arguments[e];for(var n in s)Object.prototype.hasOwnProperty.call(s,n)&&(t[n]=s[n])}return t}).apply(this,arguments)}const c={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:"undefined"!=typeof registration?registration.scope:""},h=t=>[c.prefix,t,c.suffix].filter((t=>t&&t.length>0)).join("-"),u=t=>t||h(c.precache),l=t=>t||h(c.runtime);function f(t,e){const s=e();return t.waitUntil(s),s}try{self["workbox:precaching:6.1.0"]&&_()}catch(t){}function d(t){if(!t)throw new e("add-to-cache-list-unexpected-type",{entry:t});if("string"==typeof t){const e=new URL(t,location.href);return{cacheKey:e.href,url:e.href}}const{revision:s,url:n}=t;if(!n)throw new e("add-to-cache-list-unexpected-type",{entry:t});if(!s){const t=new URL(n,location.href);return{cacheKey:t.href,url:t.href}}const i=new URL(n,location.href),r=new URL(n,location.href);return i.searchParams.set("__WB_REVISION__",s),{cacheKey:i.href,url:r.href}}class w{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:t,state:e})=>{e&&(e.originalRequest=t)},this.cachedResponseWillBeUsed=async({event:t,state:e,cachedResponse:s})=>{if("install"===t.type){const t=e.originalRequest.url;s?this.notUpdatedURLs.push(t):this.updatedURLs.push(t)}return s}}}class p{constructor({precacheController:t}){this.cacheKeyWillBeUsed=async({request:t,params:e})=>{const s=e&&e.cacheKey||this.h.getCacheKeyForURL(t.url);return s?new Request(s):t},this.h=t}}let y;async function g(t,s){let n=null;if(t.url){n=new URL(t.url).origin}if(n!==self.location.origin)throw new e("cross-origin-copy-response",{origin:n});const i=t.clone(),r={headers:new Headers(i.headers),status:i.status,statusText:i.statusText},a=s?s(r):r,o=function(){if(void 0===y){const t=new Response("");if("body"in t)try{new Response(t.body),y=!0}catch(t){y=!1}y=!1}return y}()?i.body:await i.blob();return new Response(o,a)}function v(t,e){const s=new URL(t);for(const t of e)s.searchParams.delete(t);return s.href}class R{constructor(){this.promise=new Promise(((t,e)=>{this.resolve=t,this.reject=e}))}}const m=new Set;try{self["workbox:strategies:6.1.0"]&&_()}catch(t){}function b(t){return"string"==typeof t?new Request(t):t}class q{constructor(t,e){this.u={},Object.assign(this,e),this.event=e.event,this.l=t,this.p=new R,this.g=[],this.v=[...t.plugins],this.R=new Map;for(const t of this.v)this.R.set(t,{});this.event.waitUntil(this.p.promise)}fetch(t){return this.waitUntil((async()=>{const{event:s}=this;let n=b(t);if("navigate"===n.mode&&s instanceof FetchEvent&&s.preloadResponse){const t=await s.preloadResponse;if(t)return t}const i=this.hasCallback("fetchDidFail")?n.clone():null;try{for(const t of this.iterateCallbacks("requestWillFetch"))n=await t({request:n.clone(),event:s})}catch(t){throw new e("plugin-error-request-will-fetch",{thrownError:t})}const r=n.clone();try{let t;t=await fetch(n,"navigate"===n.mode?void 0:this.l.fetchOptions);for(const e of this.iterateCallbacks("fetchDidSucceed"))t=await e({event:s,request:r,response:t});return t}catch(t){throw i&&await this.runCallbacks("fetchDidFail",{error:t,event:s,originalRequest:i.clone(),request:r.clone()}),t}})())}async fetchAndCachePut(t){const e=await this.fetch(t),s=e.clone();return this.waitUntil(this.cachePut(t,s)),e}cacheMatch(t){return this.waitUntil((async()=>{const e=b(t);let s;const{cacheName:n,matchOptions:i}=this.l,r=await this.getCacheKey(e,"read"),a=o({},i,{cacheName:n});s=await caches.match(r,a);for(const t of this.iterateCallbacks("cachedResponseWillBeUsed"))s=await t({cacheName:n,matchOptions:i,cachedResponse:s,request:r,event:this.event})||void 0;return s})())}async cachePut(t,s){const n=b(t);var i;await(i=0,new Promise((t=>setTimeout(t,i))));const r=await this.getCacheKey(n,"write");if(!s)throw new e("cache-put-with-no-response",{url:(a=r.url,new URL(String(a),location.href).href.replace(new RegExp(`^${location.origin}`),""))});var a;const c=await this.m(s);if(!c)return!1;const{cacheName:h,matchOptions:u}=this.l,l=await self.caches.open(h),f=this.hasCallback("cacheDidUpdate"),d=f?await async function(t,e,s,n){const i=v(e.url,s);if(e.url===i)return t.match(e,n);const r=o({},n,{ignoreSearch:!0}),a=await t.keys(e,r);for(const e of a)if(i===v(e.url,s))return t.match(e,n)}(l,r.clone(),["__WB_REVISION__"],u):null;try{await l.put(r,f?c.clone():c)}catch(t){throw"QuotaExceededError"===t.name&&await async function(){for(const t of m)await t()}(),t}for(const t of this.iterateCallbacks("cacheDidUpdate"))await t({cacheName:h,oldResponse:d,newResponse:c.clone(),request:r,event:this.event});return!0}async getCacheKey(t,e){if(!this.u[e]){let s=t;for(const t of this.iterateCallbacks("cacheKeyWillBeUsed"))s=b(await t({mode:e,request:s,event:this.event,params:this.params}));this.u[e]=s}return this.u[e]}hasCallback(t){for(const e of this.l.plugins)if(t in e)return!0;return!1}async runCallbacks(t,e){for(const s of this.iterateCallbacks(t))await s(e)}*iterateCallbacks(t){for(const e of this.l.plugins)if("function"==typeof e[t]){const s=this.R.get(e),n=n=>{const i=o({},n,{state:s});return e[t](i)};yield n}}waitUntil(t){return this.g.push(t),t}async doneWaiting(){let t;for(;t=this.g.shift();)await t}destroy(){this.p.resolve()}async m(t){let e=t,s=!1;for(const t of this.iterateCallbacks("cacheWillUpdate"))if(e=await t({request:this.request,response:e,event:this.event})||void 0,s=!0,!e)break;return s||e&&200!==e.status&&(e=void 0),e}}class U extends class{constructor(t={}){this.cacheName=l(t.cacheName),this.plugins=t.plugins||[],this.fetchOptions=t.fetchOptions,this.matchOptions=t.matchOptions}handle(t){const[e]=this.handleAll(t);return e}handleAll(t){t instanceof FetchEvent&&(t={event:t,request:t.request});const e=t.event,s="string"==typeof t.request?new Request(t.request):t.request,n="params"in t?t.params:void 0,i=new q(this,{event:e,request:s,params:n}),r=this.q(i,s,e);return[r,this.U(r,i,s,e)]}async q(t,s,n){let i;await t.runCallbacks("handlerWillStart",{event:n,request:s});try{if(i=await this.L(s,t),!i||"error"===i.type)throw new e("no-response",{url:s.url})}catch(e){for(const r of t.iterateCallbacks("handlerDidError"))if(i=await r({error:e,event:n,request:s}),i)break;if(!i)throw e}for(const e of t.iterateCallbacks("handlerWillRespond"))i=await e({event:n,request:s,response:i});return i}async U(t,e,s,n){let i,r;try{i=await t}catch(r){}try{await e.runCallbacks("handlerDidRespond",{event:n,request:s,response:i}),await e.doneWaiting()}catch(t){r=t}if(await e.runCallbacks("handlerDidComplete",{event:n,request:s,response:i,error:r}),e.destroy(),r)throw r}}{constructor(t={}){t.cacheName=u(t.cacheName),super(t),this._=!1!==t.fallbackToNetwork,this.plugins.push(U.copyRedirectedCacheableResponsesPlugin)}async L(t,e){const s=await e.cacheMatch(t);return s||(e.event&&"install"===e.event.type?await this.C(t,e):await this.N(t,e))}async N(t,s){let n;if(!this._)throw new e("missing-precache-entry",{cacheName:this.cacheName,url:t.url});return n=await s.fetch(t),n}async C(t,s){this.O();const n=await s.fetch(t);if(!await s.cachePut(t,n.clone()))throw new e("bad-precaching-response",{url:t.url,status:n.status});return n}O(){let t=null,e=0;for(const[s,n]of this.plugins.entries())n!==U.copyRedirectedCacheableResponsesPlugin&&(n===U.defaultPrecacheCacheabilityPlugin&&(t=s),n.cacheWillUpdate&&e++);0===e?this.plugins.push(U.defaultPrecacheCacheabilityPlugin):e>1&&null!==t&&this.plugins.splice(t,1)}}U.defaultPrecacheCacheabilityPlugin={cacheWillUpdate:async({response:t})=>!t||t.status>=400?null:t},U.copyRedirectedCacheableResponsesPlugin={cacheWillUpdate:async({response:t})=>t.redirected?await g(t):t};class L{constructor({cacheName:t,plugins:e=[],fallbackToNetwork:s=!0}={}){this.T=new Map,this.W=new Map,this.k=new Map,this.l=new U({cacheName:u(t),plugins:[...e,new p({precacheController:this})],fallbackToNetwork:s}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this.l}precache(t){this.addToCacheList(t),this.K||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this.K=!0)}addToCacheList(t){const s=[];for(const n of t){"string"==typeof n?s.push(n):n&&void 0===n.revision&&s.push(n.url);const{cacheKey:t,url:i}=d(n),r="string"!=typeof n&&n.revision?"reload":"default";if(this.T.has(i)&&this.T.get(i)!==t)throw new e("add-to-cache-list-conflicting-entries",{firstEntry:this.T.get(i),secondEntry:t});if("string"!=typeof n&&n.integrity){if(this.k.has(t)&&this.k.get(t)!==n.integrity)throw new e("add-to-cache-list-conflicting-integrities",{url:i});this.k.set(t,n.integrity)}if(this.T.set(i,t),this.W.set(i,r),s.length>0){const t=`Workbox is precaching URLs without revision info: ${s.join(", ")}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(t)}}}install(t){return f(t,(async()=>{const e=new w;this.strategy.plugins.push(e);for(const[e,s]of this.T){const n=this.k.get(s),i=this.W.get(e),r=new Request(e,{integrity:n,cache:i,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:s},request:r,event:t}))}const{updatedURLs:s,notUpdatedURLs:n}=e;return{updatedURLs:s,notUpdatedURLs:n}}))}activate(t){return f(t,(async()=>{const t=await self.caches.open(this.strategy.cacheName),e=await t.keys(),s=new Set(this.T.values()),n=[];for(const i of e)s.has(i.url)||(await t.delete(i),n.push(i.url));return{deletedURLs:n}}))}getURLsToCacheKeys(){return this.T}getCachedURLs(){return[...this.T.keys()]}getCacheKeyForURL(t){const e=new URL(t,location.href);return this.T.get(e.href)}async matchPrecache(t){const e=t instanceof Request?t.url:t,s=this.getCacheKeyForURL(e);if(s){return(await self.caches.open(this.strategy.cacheName)).match(s)}}createHandlerBoundToURL(t){const s=this.getCacheKeyForURL(t);if(!s)throw new e("non-precached-url",{url:t});return e=>(e.request=new Request(t),e.params=o({cacheKey:s},e.params),this.strategy.handle(e))}}let x;const C=()=>(x||(x=new L),x);class N extends n{constructor(t,e){super((({request:s})=>{const n=t.getURLsToCacheKeys();for(const t of function*(t,{ignoreURLParametersMatching:e=[/^utm_/,/^fbclid$/],directoryIndex:s="index.html",cleanURLs:n=!0,urlManipulation:i}={}){const r=new URL(t,location.href);r.hash="",yield r.href;const a=function(t,e=[]){for(const s of[...t.searchParams.keys()])e.some((t=>t.test(s)))&&t.searchParams.delete(s);return t}(r,e);if(yield a.href,s&&a.pathname.endsWith("/")){const t=new URL(a.href);t.pathname+=s,yield t.href}if(n){const t=new URL(a.href);t.pathname+=".html",yield t.href}if(i){const t=i({url:r});for(const e of t)yield e.href}}(s.url,e)){const e=n.get(t);if(e)return{cacheKey:e}}}),t.strategy)}}function E(t){const s=C();!function(t,s,o){let c;if("string"==typeof t){const e=new URL(t,location.href);c=new n((({url:t})=>t.href===e.href),s,o)}else if(t instanceof RegExp)c=new i(t,s,o);else if("function"==typeof t)c=new n(t,s,o);else{if(!(t instanceof n))throw new e("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});c=t}(a||(a=new r,a.addFetchListener(),a.addCacheListener()),a).registerRoute(c)}(new N(s,t))}var O;self.addEventListener("message",(t=>{t.data&&"SKIP_WAITING"===t.data.type&&self.skipWaiting()})),O={},function(t){C().precache(t)}([{url:"assets/data.json",revision:"56e96f40bcf0f42e3be415eab0f259f9"},{url:"assets/favicon.ico",revision:"bcc8290820dbf86392b9f8c8ba993e0c"},{url:"assets/icon.png",revision:"ce4ba0b70c2aa2c82d92a23dfbbdede3"},{url:"assets/icon_192x192.png",revision:"e61fceb15b912248a7d7e6bd95b74dd7"},{url:"assets/icon_512x512.png",revision:"72b0e70f566151e2fb049f867343367b"},{url:"assets/viz.json",revision:"abfcdc71bf72942e1e583d8aa43843ac"},{url:"bundle.js",revision:"67a9ba8eb03fbdfdfe8e094005d44ae7"},{url:"index.html",revision:"ca68fb7f2cdf14489b6d2a2135c5298c"},{url:"manifest.json",revision:"36f7bb3c911ef90b3f18d9f61d924cc2"}]),E(O);
