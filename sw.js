"use strict";(()=>var h=["./","./index.html","./manifest.webmanifest","./icon.svg","./icon-192.png","./icon-512.png","./badge-96.png","./assets/firebase-BhFjUCmV.js","./assets/index-BYdAC-qI.css","./assets/index-D5ysba7r.js"];var d={apiKey:"",authDomain:"",projectId:"",storageBucket:"",messagingSenderId:"",appId:""};var He=()=>{};var je=function(e){let t=[],n=0;for(let r=0;r<e.length;r++){let i=e.charCodeAt(r);i<128?t[n++]=i:i<2048?(t[n++]=i>>6|192,t[n++]=i&63|128):(i&64512)===55296&&r+1<e.length&&(e.charCodeAt(r+1)&64512)===56320?(i=65536+((i&1023)<<10)+(e.charCodeAt(++r)&1023),t[n++]=i>>18|240,t[n++]=i>>12&63|128,t[n++]=i>>6&63|128,t[n++]=i&63|128):(t[n++]=i>>12|224,t[n++]=i>>6&63|128,t[n++]=i&63|128)}return t},Yt=function(e){let t=[],n=0,r=0;for(;n<e.length;){let i=e[n++];if(i<128)t[r++]=String.fromCharCode(i);else if(i>191&&i<224){let o=e[n++];t[r++]=String.fromCharCode((i&31)<<6|o&63)}else if(i>239&&i<365){let o=e[n++],s=e[n++],a=e[n++],u=((i&7)<<18|(o&63)<<12|(s&63)<<6|a&63)-65536;t[r++]=String.fromCharCode(55296+(u>>10)),t[r++]=String.fromCharCode(56320+(u&1023))}else{let o=e[n++],s=e[n++];t[r++]=String.fromCharCode((i&15)<<12|(o&63)<<6|s&63)}}return t.join("")},Ve={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();let n=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let i=0;i<e.length;i+=3){let o=e[i],s=i+1<e.length,a=s?e[i+1]:0,u=i+2<e.length,c=u?e[i+2]:0,N=o>>2,M=(o&3)<<4|a>>4,U=(a&15)<<2|c>>6,j=c&63;u||(j=64,s||(U=64)),r.push(n[N],n[M],n[U],n[j])}return r.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(je(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):Yt(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();let n=t?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let i=0;i<e.length;){let o=n[e.charAt(i++)],a=i<e.length?n[e.charAt(i)]:0;++i;let c=i<e.length?n[e.charAt(i)]:64;++i;let M=i<e.length?n[e.charAt(i)]:64;if(++i,o==null||a==null||c==null||M==null)throw new ne;let U=o<<2|a>>4;if(r.push(U),c!==64){let j=a<<4&240|c>>2;if(r.push(j),M!==64){let Gt=c<<6&192|M;r.push(Gt)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}},ne=class extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}},Xt=function(e){let t=je(e);return Ve.encodeByteArray(t,!0)},re=function(e){return Xt(e).replace(/\./g,"")},Ke=function(e){try{return Ve.decodeString(e,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};function Zt(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}var en=()=>Zt().__FIREBASE_DEFAULTS__,tn=()=>{if(typeof process>"u"||typeof process.env>"u")return;let e=process.env.__FIREBASE_DEFAULTS__;if(e)return JSON.parse(e)},nn=()=>{if(typeof document>"u")return;let e;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}let t=e&&Ke(e[1]);return t&&JSON.parse(t)},rn=()=>{try{return He()||en()||tn()||nn()}catch(e){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);return}};var ie=()=>rn()?.config;var V=class{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,n)=>{this.resolve=t,this.reject=n})}wrapCallback(t){return(n,r)=>{n?this.reject(n):this.resolve(r),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(n):t(n,r))}}};function K(){try{return typeof indexedDB=="object"}catch{return!1}}function W(){return new Promise((e,t)=>{try{let n=!0,r="validate-browser-context-for-indexeddb-analytics-module",i=self.indexedDB.open(r);i.onsuccess=()=>{i.result.close(),n||self.indexedDB.deleteDatabase(r),e(!0)},i.onupgradeneeded=()=>{n=!1},i.onerror=()=>{t(i.error?.message||"")}}catch(n){t(n)}})}var on="FirebaseError",w=class e extends Error{constructor(t,n,r){super(n),this.code=t,this.customData=r,this.name=on,Object.setPrototypeOf(this,e.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,y.prototype.create)}},y=class{constructor(t,n,r){this.service=t,this.serviceName=n,this.errors=r}create(t,...n){let r=n[0]||{},i=`${this.service}/${t}`,o=this.errors[t],s=o?sn(o,r):"Error",a=`${this.serviceName}: ${s} (${i}).`;return new w(i,a,r)}};function sn(e,t){try{let n=0,r="";for(;n<e.length;){let i=e.indexOf("{$",n);if(i===-1){r+=e.substring(n);break}let o=e.indexOf("}",i+2);if(o===-1){r+=e.substring(n);break}let s=e.substring(i+2,o),a=t[s];r+=e.substring(n,i)+(a!=null?String(a):`<${s}?>`),n=o+1}return r}catch{return e}}function z(e,t){if(e===t)return!0;let n=Object.keys(e),r=Object.keys(t);for(let i of n){if(!r.includes(i))return!1;let o=e[i],s=t[i];if(Ue(o)&&Ue(s)){if(!z(o,s))return!1}else if(o!==s)return!1}for(let i of r)if(!n.includes(i))return!1;return!0}function Ue(e){return e!==null&&typeof e=="object"}var wo=14400*1e3;function oe(e){return e&&e._delegate?e._delegate:e}var p=class{constructor(t,n,r){this.name=t,this.instanceFactory=n,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}};var v="[DEFAULT]";var se=class{constructor(t,n){this.name=t,this.container=n,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){let n=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(n)){let r=new V;if(this.instancesDeferred.set(n,r),this.isInitialized(n)||this.shouldAutoInitialize())try{let i=this.getOrInitializeService({instanceIdentifier:n});i&&r.resolve(i)}catch{}}return this.instancesDeferred.get(n).promise}getImmediate(t){let n=this.normalizeInstanceIdentifier(t?.identifier),r=t?.optional??!1;if(this.isInitialized(n)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:n})}catch(i){if(r)return null;throw i}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if(cn(t))try{this.getOrInitializeService({instanceIdentifier:v})}catch{}for(let[n,r]of this.instancesDeferred.entries()){let i=this.normalizeInstanceIdentifier(n);try{let o=this.getOrInitializeService({instanceIdentifier:i});r.resolve(o)}catch{}}}}clearInstance(t=v){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){let t=Array.from(this.instances.values());await Promise.all([...t.filter(n=>"INTERNAL"in n).map(n=>n.INTERNAL.delete()),...t.filter(n=>"_delete"in n).map(n=>n._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=v){return this.instances.has(t)}getOptions(t=v){return this.instancesOptions.get(t)||{}}initialize(t={}){let{options:n={}}=t,r=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);let i=this.getOrInitializeService({instanceIdentifier:r,options:n});for(let[o,s]of this.instancesDeferred.entries()){let a=this.normalizeInstanceIdentifier(o);r===a&&s.resolve(i)}return i}onInit(t,n){let r=this.normalizeInstanceIdentifier(n),i=this.onInitCallbacks.get(r)??new Set;i.add(t),this.onInitCallbacks.set(r,i);let o=this.instances.get(r);return o&&t(o,r),()=>{i.delete(t)}}invokeOnInitCallbacks(t,n){let r=this.onInitCallbacks.get(n);if(r)for(let i of r)try{i(t,n)}catch{}}getOrInitializeService({instanceIdentifier:t,options:n={}}){let r=this.instances.get(t);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:an(t),options:n}),this.instances.set(t,r),this.instancesOptions.set(t,n),this.invokeOnInitCallbacks(r,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,r)}catch{}return r||null}normalizeInstanceIdentifier(t=v){return this.component?this.component.multipleInstances?t:v:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}};function an(e){return e===v?void 0:e}function cn(e){return e.instantiationMode==="EAGER"}var q=class{constructor(t){this.name=t,this.providers=new Map}addComponent(t){let n=this.getProvider(t.name);if(n.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);n.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);let n=new se(t,this);return this.providers.set(t,n),n}getProviders(){return Array.from(this.providers.values())}};var un=[],f;(function(e){e[e.DEBUG=0]="DEBUG",e[e.VERBOSE=1]="VERBOSE",e[e.INFO=2]="INFO",e[e.WARN=3]="WARN",e[e.ERROR=4]="ERROR",e[e.SILENT=5]="SILENT"})(f||(f={}));var fn={debug:f.DEBUG,verbose:f.VERBOSE,info:f.INFO,warn:f.WARN,error:f.ERROR,silent:f.SILENT},ln=f.INFO,dn={[f.DEBUG]:"log",[f.VERBOSE]:"log",[f.INFO]:"info",[f.WARN]:"warn",[f.ERROR]:"error"},hn=(e,t,...n)=>{if(t<e.logLevel)return;let r=new Date().toISOString(),i=dn[t];if(i)console[i](`[${r}]  ${e.name}:`,...n);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)},G=class{constructor(t){this.name=t,this._logLevel=ln,this._logHandler=hn,this._userLogHandler=null,un.push(this)}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in f))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?fn[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,f.DEBUG,...t),this._logHandler(this,f.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,f.VERBOSE,...t),this._logHandler(this,f.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,f.INFO,...t),this._logHandler(this,f.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,f.WARN,...t),this._logHandler(this,f.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,f.ERROR,...t),this._logHandler(this,f.ERROR,...t)}};var pn=(e,t)=>t.some(n=>e instanceof n),We,ze;function gn(){return We||(We=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function bn(){return ze||(ze=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}var qe=new WeakMap,ce=new WeakMap,Ge=new WeakMap,ae=new WeakMap,fe=new WeakMap;function mn(e){let t=new Promise((n,r)=>{let i=()=>{e.removeEventListener("success",o),e.removeEventListener("error",s)},o=()=>{n(g(e.result)),i()},s=()=>{r(e.error),i()};e.addEventListener("success",o),e.addEventListener("error",s)});return t.then(n=>{n instanceof IDBCursor&&qe.set(n,e)}).catch(()=>{}),fe.set(t,e),t}function wn(e){if(ce.has(e))return;let t=new Promise((n,r)=>{let i=()=>{e.removeEventListener("complete",o),e.removeEventListener("error",s),e.removeEventListener("abort",s)},o=()=>{n(),i()},s=()=>{r(e.error||new DOMException("AbortError","AbortError")),i()};e.addEventListener("complete",o),e.addEventListener("error",s),e.addEventListener("abort",s)});ce.set(e,t)}var ue={get(e,t,n){if(e instanceof IDBTransaction){if(t==="done")return ce.get(e);if(t==="objectStoreNames")return e.objectStoreNames||Ge.get(e);if(t==="store")return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return g(e[t])},set(e,t,n){return e[t]=n,!0},has(e,t){return e instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in e}};function Je(e){ue=e(ue)}function yn(e){return e===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...n){let r=e.call(J(this),t,...n);return Ge.set(r,t.sort?t.sort():[t]),g(r)}:bn().includes(e)?function(...t){return e.apply(J(this),t),g(qe.get(this))}:function(...t){return g(e.apply(J(this),t))}}function _n(e){return typeof e=="function"?yn(e):(e instanceof IDBTransaction&&wn(e),pn(e,gn())?new Proxy(e,ue):e)}function g(e){if(e instanceof IDBRequest)return mn(e);if(ae.has(e))return ae.get(e);let t=_n(e);return t!==e&&(ae.set(e,t),fe.set(t,e)),t}var J=e=>fe.get(e);function T(e,t,{blocked:n,upgrade:r,blocking:i,terminated:o}={}){let s=indexedDB.open(e,t),a=g(s);return r&&s.addEventListener("upgradeneeded",u=>{r(g(s.result),u.oldVersion,u.newVersion,g(s.transaction),u)}),n&&s.addEventListener("blocked",u=>n(u.oldVersion,u.newVersion,u)),a.then(u=>{o&&u.addEventListener("close",()=>o()),i&&u.addEventListener("versionchange",c=>i(c.oldVersion,c.newVersion,c))}).catch(()=>{}),a}function x(e,{blocked:t}={}){let n=indexedDB.deleteDatabase(e);return t&&n.addEventListener("blocked",r=>t(r.oldVersion,r)),g(n).then(()=>{})}var En=["get","getKey","getAll","getAllKeys","count"],Sn=["put","add","delete","clear"],le=new Map;function Qe(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&typeof t=="string"))return;if(le.get(t))return le.get(t);let n=t.replace(/FromIndex$/,""),r=t!==n,i=Sn.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!(i||En.includes(n)))return;let o=async function(s,...a){let u=this.transaction(s,i?"readwrite":"readonly"),c=u.store;return r&&(c=c.index(a.shift())),(await Promise.all([c[n](...a),i&&u.done]))[0]};return le.set(t,o),o}Je(e=>({...e,get:(t,n,r)=>Qe(t,n)||e.get(t,n,r),has:(t,n)=>!!Qe(t,n)||e.has(t,n)}));var he=class{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(n=>{if(In(n)){let r=n.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(n=>n).join(" ")}};function In(e){return e.getComponent()?.type==="VERSION"}var pe="@firebase/app",Ye="0.16.2";var E=new G("@firebase/app"),An="@firebase/app-compat",vn="@firebase/analytics-compat",Tn="@firebase/analytics",Cn="@firebase/app-check-compat",Dn="@firebase/app-check",kn="@firebase/auth",On="@firebase/auth-compat",Rn="@firebase/database",Nn="@firebase/data-connect",Mn="@firebase/database-compat",xn="@firebase/functions",Bn="@firebase/functions-compat",Fn="@firebase/installations",Ln="@firebase/installations-compat",Pn="@firebase/messaging",$n="@firebase/messaging-compat",Hn="@firebase/performance",Un="@firebase/performance-compat",jn="@firebase/remote-config",Vn="@firebase/remote-config-compat",Kn="@firebase/storage",Wn="@firebase/storage-compat",zn="@firebase/firestore",qn="@firebase/ai",Gn="@firebase/firestore-compat",Jn="firebase";var ge="[DEFAULT]",Qn={[pe]:"fire-core",[An]:"fire-core-compat",[Tn]:"fire-analytics",[vn]:"fire-analytics-compat",[Dn]:"fire-app-check",[Cn]:"fire-app-check-compat",[kn]:"fire-auth",[On]:"fire-auth-compat",[Rn]:"fire-rtdb",[Nn]:"fire-data-connect",[Mn]:"fire-rtdb-compat",[xn]:"fire-fn",[Bn]:"fire-fn-compat",[Fn]:"fire-iid",[Ln]:"fire-iid-compat",[Pn]:"fire-fcm",[$n]:"fire-fcm-compat",[Hn]:"fire-perf",[Un]:"fire-perf-compat",[jn]:"fire-rc",[Vn]:"fire-rc-compat",[Kn]:"fire-gcs",[Wn]:"fire-gcs-compat",[zn]:"fire-fst",[Gn]:"fire-fst-compat",[qn]:"fire-vertex","fire-js":"fire-js",[Jn]:"fire-js-all"};var Q=new Map,Yn=new Map,be=new Map;function Xe(e,t){try{e.container.addComponent(t)}catch(n){E.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,n)}}function A(e){let t=e.name;if(be.has(t))return E.debug(`There were multiple attempts to register component ${t}.`),!1;be.set(t,e);for(let n of Q.values())Xe(n,e);for(let n of Yn.values())Xe(n,e);return!0}function F(e,t){let n=e.container.getProvider("heartbeat").getImmediate({optional:!0});return n&&n.triggerHeartbeat(),e.container.getProvider(t)}var Xn={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},_=new y("app","Firebase",Xn);var me=class{constructor(t,n,r){this._isDeleted=!1,this._options={...t},this._config={...n},this._name=n.name,this._automaticDataCollectionEnabled=n.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new p("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw _.create("app-deleted",{appName:this._name})}};function _e(e,t={}){let n=e;typeof t!="object"&&(t={name:t});let r={name:ge,automaticDataCollectionEnabled:!0,...t},i=r.name;if(typeof i!="string"||!i)throw _.create("bad-app-name",{appName:String(i)});if(n||(n=ie()),!n)throw _.create("no-options");let o=Q.get(i);if(o)if(z(n,o.options)){if(z(r,o.config))return o;throw _.create("duplicate-app",{appName:i,mismatchedParam:"config",oldValue:JSON.stringify(o.config),newValue:JSON.stringify(r)})}else throw _.create("duplicate-app",{appName:i,mismatchedParam:"options",oldValue:JSON.stringify(o.options),newValue:JSON.stringify(n)});let s=new q(i);for(let u of be.values())s.addComponent(u);let a=new me(n,r,s);return Q.set(i,a),a}function Ee(e=ge){let t=Q.get(e);if(!t&&e===ge&&ie())return _e();if(!t)throw _.create("no-app",{appName:e});return t}function I(e,t,n){let r=Qn[e]??e;n&&(r+=`-${n}`);let i=r.match(/\s|\//),o=t.match(/\s|\//);if(i||o){let s=[`Unable to register library "${r}" with version "${t}":`];i&&s.push(`library name "${r}" contains illegal characters (whitespace or "/")`),i&&o&&s.push("and"),o&&s.push(`version name "${t}" contains illegal characters (whitespace or "/")`),E.warn(s.join(" "));return}A(new p(`${r}-version`,()=>({library:r,version:t}),"VERSION"))}var Zn="firebase-heartbeat-database",er=1,B="firebase-heartbeat-store",de=null;function nt(){return de||(de=T(Zn,er,{upgrade:(e,t)=>{switch(t){case 0:try{e.createObjectStore(B)}catch(n){console.warn(n)}}}}).catch(e=>{throw _.create("idb-open",{originalErrorMessage:e.message})})),de}async function tr(e){try{let n=(await nt()).transaction(B),r=await n.objectStore(B).get(rt(e));return await n.done,r}catch(t){if(t instanceof w)E.warn(t.message);else{let n=_.create("idb-get",{originalErrorMessage:t?.message});E.warn(n.message)}}}async function Ze(e,t){try{let r=(await nt()).transaction(B,"readwrite");await r.objectStore(B).put(t,rt(e)),await r.done}catch(n){if(n instanceof w)E.warn(n.message);else{let r=_.create("idb-set",{originalErrorMessage:n?.message});E.warn(r.message)}}}function rt(e){return`${e.name}!${e.options.appId}`}var nr=1024,rr=30,we=class{constructor(t){this.container=t,this._heartbeatsCache=null;let n=this.container.getProvider("app").getImmediate();this._storage=new ye(n),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){try{let n=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),r=et();if(this._heartbeatsCache?.heartbeats==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(i=>i.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:n}),this._heartbeatsCache.heartbeats.length>rr){let i=or(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(i,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(t){E.warn(t)}}async getHeartbeatsHeader(){try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null||this._heartbeatsCache.heartbeats.length===0)return"";let t=et(),{heartbeatsToSend:n,unsentEntries:r}=ir(this._heartbeatsCache.heartbeats),i=re(JSON.stringify({version:2,heartbeats:n}));return this._heartbeatsCache.lastSentHeartbeatDate=t,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(t){return E.warn(t),""}}};function et(){return new Date().toISOString().substring(0,10)}function ir(e,t=nr){let n=[],r=e.slice();for(let i of e){let o=n.find(s=>s.agent===i.agent);if(o){if(o.dates.push(i.date),tt(n)>t){o.dates.pop();break}}else if(n.push({agent:i.agent,dates:[i.date]}),tt(n)>t){n.pop();break}r=r.slice(1)}return{heartbeatsToSend:n,unsentEntries:r}}var ye=class{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return K()?W().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){let n=await tr(this.app);return n?.heartbeats?n:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){if(await this._canUseIndexedDBPromise){let r=await this.read();return Ze(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){if(await this._canUseIndexedDBPromise){let r=await this.read();return Ze(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...t.heartbeats]})}else return}};function tt(e){return re(JSON.stringify({version:2,heartbeats:e})).length}function or(e){if(e.length===0)return-1;let t=0,n=e[0].date;for(let r=1;r<e.length;r++)e[r].date<n&&(n=e[r].date,t=r);return t}function sr(e){A(new p("platform-logger",t=>new he(t),"PRIVATE")),A(new p("heartbeat",t=>new we(t),"PRIVATE")),I(pe,Ye,e),I(pe,Ye,"esm2020"),I("fire-js","")}sr("");var ar="firebase",cr="12.19.0";I(ar,cr,"app");var st="@firebase/installations",ve="0.6.24";var at=1e4,ct=`w:${ve}`,ut="FIS_v2",ur="https://firebaseinstallations.googleapis.com/v1",fr=3600*1e3,lr="installations",dr="Installations";var hr={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},D=new y(lr,dr,hr);function ft(e){return e instanceof w&&e.code.includes("request-failed")}function lt({projectId:e}){return`${ur}/projects/${e}/installations`}function dt(e){return{token:e.token,requestStatus:2,expiresIn:gr(e.expiresIn),creationTime:Date.now()}}async function ht(e,t){let r=(await t.json()).error;return D.create("request-failed",{requestName:e,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})}function pt({apiKey:e}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e})}function pr(e,{refreshToken:t}){let n=pt(e);return n.append("Authorization",br(t)),n}async function gt(e){let t=await e();return t.status>=500&&t.status<600?e():t}function gr(e){return Number(e.replace("s","000"))}function br(e){return`${ut} ${e}`}async function mr({appConfig:e,heartbeatServiceProvider:t},{fid:n}){let r=lt(e),i=pt(e),o=t.getImmediate({optional:!0});if(o){let c=await o.getHeartbeatsHeader();c&&i.append("x-firebase-client",c)}let s={fid:n,authVersion:ut,appId:e.appId,sdkVersion:ct},a={method:"POST",headers:i,body:JSON.stringify(s)},u=await gt(()=>fetch(r,a));if(u.ok){let c=await u.json();return{fid:c.fid||n,registrationStatus:2,refreshToken:c.refreshToken,authToken:dt(c.authToken)}}else throw await ht("Create Installation",u)}function bt(e){return new Promise(t=>{setTimeout(t,e)})}function wr(e){return btoa(String.fromCharCode(...e)).replace(/\+/g,"-").replace(/\//g,"_")}var yr=/^[cdef][\w-]{21}$/,Ae="";function _r(){try{let e=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(e),e[0]=112+e[0]%16;let n=Er(e);return yr.test(n)?n:Ae}catch{return Ae}}function Er(e){return wr(e).substr(0,22)}function X(e){return`${e.appName}!${e.appId}`}var mt=new Map;function wt(e,t){let n=X(e);yt(n,t),Sr(n,t)}function yt(e,t){let n=mt.get(e);if(n)for(let r of n)r(t)}function Sr(e,t){let n=Ir();n&&n.postMessage({key:e,fid:t}),Ar()}var C=null;function Ir(){return!C&&"BroadcastChannel"in self&&(C=new BroadcastChannel("[Firebase] FID Change"),C.onmessage=e=>{yt(e.data.key,e.data.fid)}),C}function Ar(){mt.size===0&&C&&(C.close(),C=null)}var vr="firebase-installations-database",Tr=1,k="firebase-installations-store",Se=null;function Te(){return Se||(Se=T(vr,Tr,{upgrade:(e,t)=>{switch(t){case 0:e.createObjectStore(k)}}})),Se}async function Y(e,t){let n=X(e),i=(await Te()).transaction(k,"readwrite"),o=i.objectStore(k),s=await o.get(n);return await o.put(t,n),await i.done,(!s||s.fid!==t.fid)&&wt(e,t.fid),t}async function _t(e){let t=X(e),r=(await Te()).transaction(k,"readwrite");await r.objectStore(k).delete(t),await r.done}async function Z(e,t){let n=X(e),i=(await Te()).transaction(k,"readwrite"),o=i.objectStore(k),s=await o.get(n),a=t(s);return a===void 0?await o.delete(n):await o.put(a,n),await i.done,a&&(!s||s.fid!==a.fid)&&wt(e,a.fid),a}async function Ce(e){let t,n=await Z(e.appConfig,r=>{let i=Cr(r),o=Dr(e,i);return t=o.registrationPromise,o.installationEntry});return n.fid===Ae?{installationEntry:await t}:{installationEntry:n,registrationPromise:t}}function Cr(e){let t=e||{fid:_r(),registrationStatus:0};return Et(t)}function Dr(e,t){if(t.registrationStatus===0){if(!navigator.onLine){let i=Promise.reject(D.create("app-offline"));return{installationEntry:t,registrationPromise:i}}let n={fid:t.fid,registrationStatus:1,registrationTime:Date.now()},r=kr(e,n);return{installationEntry:n,registrationPromise:r}}else return t.registrationStatus===1?{installationEntry:t,registrationPromise:Or(e)}:{installationEntry:t}}async function kr(e,t){try{let n=await mr(e,t);return Y(e.appConfig,n)}catch(n){throw ft(n)&&n.customData.serverCode===409?await _t(e.appConfig):await Y(e.appConfig,{fid:t.fid,registrationStatus:0}),n}}async function Or(e){let t=await it(e.appConfig);for(;t.registrationStatus===1;)await bt(100),t=await it(e.appConfig);if(t.registrationStatus===0){let{installationEntry:n,registrationPromise:r}=await Ce(e);return r||n}return t}function it(e){return Z(e,t=>{if(!t)throw D.create("installation-not-found");return Et(t)})}function Et(e){return Rr(e)?{fid:e.fid,registrationStatus:0}:e}function Rr(e){return e.registrationStatus===1&&e.registrationTime+at<Date.now()}async function Nr({appConfig:e,heartbeatServiceProvider:t},n){let r=Mr(e,n),i=pr(e,n),o=t.getImmediate({optional:!0});if(o){let c=await o.getHeartbeatsHeader();c&&i.append("x-firebase-client",c)}let s={installation:{sdkVersion:ct,appId:e.appId}},a={method:"POST",headers:i,body:JSON.stringify(s)},u=await gt(()=>fetch(r,a));if(u.ok){let c=await u.json();return dt(c)}else throw await ht("Generate Auth Token",u)}function Mr(e,{fid:t}){return`${lt(e)}/${t}/authTokens:generate`}async function De(e,t=!1){let n,r=await Z(e.appConfig,o=>{if(!St(o))throw D.create("not-registered");let s=o.authToken;if(!t&&Fr(s))return o;if(s.requestStatus===1)return n=xr(e,t),o;{if(!navigator.onLine)throw D.create("app-offline");let a=Pr(o);return n=Br(e,a),a}});return n?await n:r.authToken}async function xr(e,t){let n=await ot(e.appConfig);for(;n.authToken.requestStatus===1;)await bt(100),n=await ot(e.appConfig);let r=n.authToken;return r.requestStatus===0?De(e,t):r}function ot(e){return Z(e,t=>{if(!St(t))throw D.create("not-registered");let n=t.authToken;return $r(n)?{...t,authToken:{requestStatus:0}}:t})}async function Br(e,t){try{let n=await Nr(e,t),r={...t,authToken:n};return await Y(e.appConfig,r),n}catch(n){if(ft(n)&&(n.customData.serverCode===401||n.customData.serverCode===404))await _t(e.appConfig);else{let r={...t,authToken:{requestStatus:0}};await Y(e.appConfig,r)}throw n}}function St(e){return e!==void 0&&e.registrationStatus===2}function Fr(e){return e.requestStatus===2&&!Lr(e)}function Lr(e){let t=Date.now();return t<e.creationTime||e.creationTime+e.expiresIn<t+fr}function Pr(e){let t={requestStatus:1,requestTime:Date.now()};return{...e,authToken:t}}function $r(e){return e.requestStatus===1&&e.requestTime+at<Date.now()}async function Hr(e){let t=e,{installationEntry:n,registrationPromise:r}=await Ce(t);return r?r.catch(console.error):De(t).catch(console.error),n.fid}async function Ur(e,t=!1){let n=e;return await jr(n),(await De(n,t)).token}async function jr(e){let{registrationPromise:t}=await Ce(e);t&&await t}function Vr(e){if(!e||!e.options)throw Ie("App Configuration");if(!e.name)throw Ie("App Name");let t=["projectId","apiKey","appId"];for(let n of t)if(!e.options[n])throw Ie(n);return{appName:e.name,projectId:e.options.projectId,apiKey:e.options.apiKey,appId:e.options.appId}}function Ie(e){return D.create("missing-app-config-values",{valueName:e})}var It="installations",Kr="installations-internal",Wr=e=>{let t=e.getProvider("app").getImmediate(),n=Vr(t),r=F(t,"heartbeat");return{app:t,appConfig:n,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()}},zr=e=>{let t=e.getProvider("app").getImmediate(),n=F(t,It).getImmediate();return{getId:()=>Hr(n),getToken:i=>Ur(n,i)}};function qr(){A(new p(It,Wr,"PUBLIC")),A(new p(Kr,zr,"PRIVATE"))}qr();I(st,ve);I(st,ve,"esm2020");var Ne="BDOU99-h67HcA6JeFXHbSNMu7e2yNNu3RzoMj8TM4W88jITfq7ZmPvIM1Iv-4_l2LxQcYwhqby2xGpWwzjfAnG4",Gr="https://fcmregistrations.googleapis.com/v1",Ft="FCM_MSG",Jr="google.c.a.c_id",At=1e3,vt=3,Lt=864e5,Qr=5e3,Yr=1249,Xr=3,Zr=1,ee;(function(e){e[e.DATA_MESSAGE=1]="DATA_MESSAGE",e[e.DISPLAY_NOTIFICATION=3]="DISPLAY_NOTIFICATION"})(ee||(ee={}));var P;(function(e){e.PUSH_RECEIVED="push-received",e.NOTIFICATION_CLICKED="notification-clicked",e.FID_REGISTERED="fid-registered"})(P||(P={}));function b(e){let t=new Uint8Array(e);return btoa(String.fromCharCode(...t)).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}function Pt(e){let t="=".repeat((4-e.length%4)%4),n=(e+t).replace(/\-/g,"+").replace(/_/g,"/"),r=atob(n),i=new Uint8Array(r.length);for(let o=0;o<r.length;++o)i[o]=r.charCodeAt(o);return i}var ke="fcm_token_details_db",ei=5,Tt="fcm_token_object_Store";async function ti(e){if("databases"in indexedDB&&!(await indexedDB.databases()).map(o=>o.name).includes(ke))return null;let t=null;return(await T(ke,ei,{upgrade:async(r,i,o,s)=>{if(i<2||!r.objectStoreNames.contains(Tt))return;let a=s.objectStore(Tt),u=await a.index("fcmSenderId").get(e);if(await a.clear(),!!u){if(i===2){let c=u;if(!c.auth||!c.p256dh||!c.endpoint)return;t={token:c.fcmToken,createTime:c.createTime??Date.now(),subscriptionOptions:{auth:c.auth,p256dh:c.p256dh,endpoint:c.endpoint,swScope:c.swScope,vapidKey:typeof c.vapidKey=="string"?c.vapidKey:b(c.vapidKey)}}}else if(i===3){let c=u;t={token:c.fcmToken,createTime:c.createTime,subscriptionOptions:{auth:b(c.auth),p256dh:b(c.p256dh),endpoint:c.endpoint,swScope:c.swScope,vapidKey:b(c.vapidKey)}}}else if(i===4){let c=u;t={token:c.fcmToken,createTime:c.createTime,subscriptionOptions:{auth:b(c.auth),p256dh:b(c.p256dh),endpoint:c.endpoint,swScope:c.swScope,vapidKey:b(c.vapidKey)}}}}}})).close(),await x(ke),await x("fcm_vapid_details_db"),await x("undefined"),ni(t)?t:null}function ni(e){if(!e||!e.subscriptionOptions)return!1;let{subscriptionOptions:t}=e;return typeof e.createTime=="number"&&e.createTime>0&&typeof e.token=="string"&&e.token.length>0&&typeof t.auth=="string"&&t.auth.length>0&&typeof t.p256dh=="string"&&t.p256dh.length>0&&typeof t.endpoint=="string"&&t.endpoint.length>0&&typeof t.swScope=="string"&&t.swScope.length>0&&typeof t.vapidKey=="string"&&t.vapidKey.length>0}var ri={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"only-available-in-window":"This method is available in a Window context.","only-available-in-sw":"This method is available in a service worker context.","permission-default":"The notification permission was not granted and dismissed instead.","permission-blocked":"The notification permission was not granted and blocked instead.","unsupported-browser":"This browser doesn't support the API's required to use the Firebase SDK.","indexed-db-unsupported":"This browser doesn't support indexedDb.open() (ex. Safari iFrame, Firefox Private Browsing, etc)","failed-service-worker-registration":"We are unable to register the default service worker. {$browserErrorMessage}","token-subscribe-failed":"A problem occurred while subscribing the user to FCM: {$errorInfo}","token-subscribe-no-token":"FCM returned no token when subscribing the user to push.","fid-registration-failed":"A problem occurred while creating an FCM registration via FID: {$errorInfo}","fid-unregister-failed":"A problem occurred while unregistering the FCM registration via FID: {$errorInfo}","fid-registration-idb-schema-unavailable":"Unable to read or persist FID registration metadata because the messaging IndexedDB schema is unavailable (for example, the database could not be upgraded to the latest version).","token-unsubscribe-failed":"A problem occurred while unsubscribing the user from FCM: {$errorInfo}","token-update-failed":"A problem occurred while updating the user from FCM: {$errorInfo}","token-update-no-token":"FCM returned no token when updating the user to push.","use-sw-after-get-token":"The useServiceWorker() method may only be called once and must be called before calling getToken() to ensure your service worker is used.","invalid-sw-registration":"The input to useServiceWorker() must be a ServiceWorkerRegistration.","invalid-bg-handler":"The input to setBackgroundMessageHandler() must be a function.","invalid-vapid-key":"The public VAPID key must be a string.","use-vapid-key-after-get-token":"The usePublicVapidKey() method may only be called once and must be called before calling getToken() to ensure your VAPID key is used.","invalid-on-registered-handler":"No onRegistered callback handler was provided or registered. Implement onRegistered() before register()."},l=new y("messaging","Messaging",ri);var Ct="firebase-messaging-database",Dt=2,S="firebase-messaging-store",m="firebase-messaging-fid-registration-store",ii={openDB:T,deleteDB:x},kt=ii,L=null;function oi(e,t,n){switch(t){case 0:if(e.createObjectStore(S),n===1)break;case 1:n===2&&e.createObjectStore(m)}}function Ot(e){return{upgrade:(t,n)=>{oi(t,n,e)},blocked:()=>{},blocking:(t,n,r)=>{L=null,r.target?.close()},terminated:()=>{L=null}}}function O(){return L||(L=kt.openDB(Ct,Dt,Ot(2)).catch(()=>kt.openDB(Ct,Dt-1,Ot(1)))),L}function $t(e,t){return e.objectStoreNames.contains(t)}function Me(e){if(!$t(e,m))throw l.create("fid-registration-idb-schema-unavailable")}async function xe(e){let t=R(e),r=await(await O()).transaction(S).objectStore(S).get(t);if(r)return r;{let i=await ti(e.appConfig.senderId);if(i)return await Be(e,i),i}}async function Be(e,t){let n=R(e),r=await O(),i=[S],o=$t(r,m);o&&i.push(m);let s=r.transaction(i,"readwrite");return await s.objectStore(S).put(t,n),o&&await s.objectStore(m).delete(n),await s.done,t}async function si(e){let t=R(e),r=(await O()).transaction(S,"readwrite");await r.objectStore(S).delete(t),await r.done}async function Fe(e){let t=R(e),n=await O();return Me(n),await n.transaction(m).objectStore(m).get(t)}async function ai(e,t){let n=R(e),r=await O();Me(r);let i=r.transaction([S,m],"readwrite");return await i.objectStore(m).put(t,n),await i.objectStore(S).delete(n),await i.done,t}async function ci(e){let t=R(e),n=await O();Me(n);let r=n.transaction(m,"readwrite");await r.objectStore(m).delete(t),await r.done}function R({appConfig:e}){return e.appId}var ui="0.13.3";var fi=3,li=1e3;async function di(e,t){let n=await H(e),r=Le(t,e.appConfig.appName,!1),i={method:"POST",headers:n,body:JSON.stringify(r)},o;try{o=await(await fetch($(e.appConfig),i)).json()}catch(s){throw l.create("token-subscribe-failed",{errorInfo:s?.toString()})}if(o.error){let s=o.error.message;throw l.create("token-subscribe-failed",{errorInfo:s})}if(!o.token)throw l.create("token-subscribe-no-token");return o.token}async function hi(e,t){let n=await H(e),r=Le(t,e.appConfig.appName,!0),i={method:"POST",headers:n,body:JSON.stringify(r)},o;try{o=await wi(()=>fetch($(e.appConfig),i),fi,li)}catch(u){throw l.create("fid-registration-failed",{errorInfo:u?.toString()})}if(o.ok)return{responseFid:await gi(o)};let s;try{s=await o.json()}catch{throw l.create("fid-registration-failed",{errorInfo:o.statusText})}let a=s.error?.message??o.statusText;throw l.create("fid-registration-failed",{errorInfo:a})}async function pi(e,t){let r={method:"DELETE",headers:await H(e)},i;try{i=await fetch(`${$(e.appConfig)}/${t}`,r)}catch(o){throw l.create("fid-unregister-failed",{errorInfo:o?.toString()})}if(!i.ok)try{throw(await i.json()).error?.message??i.statusText}catch(o){throw l.create("fid-unregister-failed",{errorInfo:typeof o=="string"&&o||i.statusText||o?.toString()})}}async function gi(e){let t=await e.text();if(!t.trim())throw l.create("fid-registration-failed",{errorInfo:"CreateRegistration succeeded but response body is empty"});let n;try{n=JSON.parse(t)}catch{throw l.create("fid-registration-failed",{errorInfo:"CreateRegistration succeeded but response body is not valid JSON"})}let r=n.name;if(typeof r!="string"||r.length===0)throw l.create("fid-registration-failed",{errorInfo:"CreateRegistration succeeded but response did not include a non-empty name"});return bi(r)}var Rt="/registrations/";function bi(e){let t=e.indexOf(Rt);if(t!==-1){let n=e.slice(t+Rt.length);if(n.length>0)return n}throw l.create("fid-registration-failed",{errorInfo:"CreateRegistration succeeded but response name is not a valid registration resource name"})}async function mi(e,t){let n=await H(e),r=Le(t.subscriptionOptions,e.appConfig.appName,!1),i={method:"PATCH",headers:n,body:JSON.stringify(r)},o;try{o=await(await fetch(`${$(e.appConfig)}/${t.token}`,i)).json()}catch(s){throw l.create("token-update-failed",{errorInfo:s?.toString()})}if(o.error){let s=o.error.message;throw l.create("token-update-failed",{errorInfo:s})}if(!o.token)throw l.create("token-update-no-token");return o.token}async function Ht(e,t){let r={method:"DELETE",headers:await H(e)};try{let o=await(await fetch(`${$(e.appConfig)}/${t}`,r)).json();if(o.error){let s=o.error.message;throw l.create("token-unsubscribe-failed",{errorInfo:s})}}catch(i){throw l.create("token-unsubscribe-failed",{errorInfo:i?.toString()})}}async function wi(e,t,n){let r;for(let i=0;i<t;i++)try{return await e()}catch(o){if(r=o,i<t-1){let s=n*Math.pow(2,i);await new Promise(a=>setTimeout(a,s))}}throw r}function $({projectId:e}){return`${Gr}/projects/${e}/registrations`}async function H({appConfig:e,installations:t}){let n=await t.getToken();return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":e.apiKey,"x-goog-firebase-installations-auth":`FIS ${n}`})}function yi(e,t){try{if(/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(e))return new URL(e).host}catch{}try{if(typeof self<"u"&&self.location?.href)return new URL(e,self.location.origin).host}catch{}return typeof self<"u"&&self.location?.host?self.location.host:t}function Le({p256dh:e,auth:t,endpoint:n,vapidKey:r,swScope:i},o,s){let a={web:{origin:yi(i,o),endpoint:n,auth:t,p256dh:e}};return s&&(a.fcm_sdk_version=ui),r!==Ne&&(a.web.applicationPubKey=r),a}var _i=10080*60*1e3;async function Ei(e){let t=await vi(e.swRegistration,e.vapidKey),n={vapidKey:e.vapidKey,swScope:e.swRegistration.scope,endpoint:t.endpoint,auth:b(t.getKey("auth")),p256dh:b(t.getKey("p256dh"))},r=await xe(e.firebaseDependencies);if(r){if(Ti(r.subscriptionOptions,n))return Date.now()>=r.createTime+_i?Ai(e,{token:r.token,createTime:Date.now(),subscriptionOptions:n}):r.token;try{await Ht(e.firebaseDependencies,r.token)}catch(i){console.warn(i)}return Mt(e.firebaseDependencies,n)}else return Mt(e.firebaseDependencies,n)}async function Si(e,t){await Ht(e.firebaseDependencies,t.token),await si(e.firebaseDependencies),await Ut(e.firebaseDependencies)}async function Ii(e){let n=(await Fe(e.firebaseDependencies).catch(()=>{}))?.fid;n&&await pi(e.firebaseDependencies,n),await Ut(e.firebaseDependencies),n&&Di(e,n)}async function Nt(e){let t=await xe(e.firebaseDependencies);t?await Si(e,t):await Ii(e);let n=await e.swRegistration.pushManager.getSubscription();return n?n.unsubscribe():!0}async function Ai(e,t){try{let n=await mi(e.firebaseDependencies,t),r={...t,token:n,createTime:Date.now()};return await Be(e.firebaseDependencies,r),n}catch(n){throw n}}async function Mt(e,t){let r={token:await di(e,t),createTime:Date.now(),subscriptionOptions:t};return await Be(e,r),r.token}async function vi(e,t){let n=await e.pushManager.getSubscription();return n||e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:Pt(t)})}function Ti(e,t){let n=t.vapidKey===e.vapidKey,r=t.endpoint===e.endpoint,i=t.auth===e.auth,o=t.p256dh===e.p256dh;return n&&r&&i&&o}async function Ut(e){try{await ci(e)}catch{}}function Ci(e,t){let n=e.onRegisteredHandler;n&&(typeof n=="function"?n(t):n.next(t))}function Di(e,t){let n=e.onUnregisteredHandler;n&&(typeof n=="function"?n(t):n.next(t))}async function ki(e,t){t?e.vapidKey=t:e.vapidKey||(e.vapidKey=Ne)}var xt=3;async function Oi(e,t){let n=await Ri(e.swRegistration,e.vapidKey),r={vapidKey:e.vapidKey,swScope:e.swRegistration.scope,endpoint:n.endpoint,auth:b(n.getKey("auth")),p256dh:b(n.getKey("p256dh"))},i=e.firebaseDependencies.installations;for(let o=0;o<xt;o++){let{responseFid:s}=await hi(e.firebaseDependencies,r);if(s===t)return;o<xt-1&&await i.getToken(!0)}throw l.create("fid-registration-failed",{errorInfo:"CreateRegistration response FID does not match Firebase Installation ID"})}async function Ri(e,t){let n=await e.pushManager.getSubscription();return n||e.pushManager.subscribe({userVisibleOnly:!0,applicationServerKey:Pt(t)})}async function Ni(e){let t=await Fe(e.firebaseDependencies).catch(()=>{});if(!t)return;await ki(e,t.vapidKey);let n=await e.firebaseDependencies.installations.getId();return await Oi(e,n),await ai(e.firebaseDependencies,{fid:n,lastRegisterTime:Date.now(),vapidKey:e.vapidKey}),Ci(e,n),n}function Mi(e){let t={from:e.from,collapseKey:e.collapse_key,messageId:e.fcmMessageId};return xi(t,e),Bi(t,e),Fi(t,e),t}function xi(e,t){if(!t.notification)return;e.notification={};let n=t.notification.title;n&&(e.notification.title=n);let r=t.notification.body;r&&(e.notification.body=r);let i=t.notification.image;i&&(e.notification.image=i);let o=t.notification.icon;o&&(e.notification.icon=o)}function Bi(e,t){t.data&&(e.data=t.data)}function Fi(e,t){if(!t.fcmOptions&&!t.notification?.click_action)return;e.fcmOptions={};let n=t.fcmOptions?.link??t.notification?.click_action;n&&(e.fcmOptions.link=n);let r=t.fcmOptions?.analytics_label;r&&(e.fcmOptions.analyticsLabel=r)}function Li(e){return typeof e=="object"&&!!e&&Jr in e}function Pi(e){return new Promise(t=>{setTimeout(t,e)})}var $i="https://play.google.com/log?format=json_proto3",jt=0,Hi=Gi("AzSCbw63g1R0nCw85jG8","Iaya3yLKwmgvh7cF0q4");function Ui(e){e.logQueue.state==="stopped"&&e.logEvents.length>0&&Pe(e,jt)}function Pe(e,t){if(e.logQueue.state==="scheduled"&&clearTimeout(e.logQueue.timerId),e.logQueue={state:"stopped"},!e.deliveryMetricsExportedToBigQueryEnabled){e.logEvents=[];return}e.logQueue={state:"scheduled",timerId:setTimeout(async()=>{if(e.logQueue={state:"flushing"},!e.logEvents.length)return Pe(e,Lt);await ji(e)},t)}}async function ji(e){let t=e.logEvents;e.logEvents=[];for(let n=0,r=t.length;n<r;n+=At){let i=t.slice(n,n+At);if(!i.length)break;let o=qi(i),s=0,a={};do{try{if(a=await fetch($i.concat("&key=",Hi),{method:"POST",body:JSON.stringify(o)}),a.ok||!a.ok&&!Bt(a))break;if(!a.ok&&Bt(a))throw new Error("a retriable Non-200 code is returned in fetch to Firelog endpoint. Retry")}catch{if(s===vt)break}let u;try{u=Number((await a.json()).nextRequestWaitMillis)}catch{u=Qr}await new Promise(c=>setTimeout(c,u)),s++}while(s<vt)}Pe(e,e.logEvents.length?jt:Lt)}function Bt(e){let t=e.status;return t===429||t===500||t===503||t===504}async function Vi(e,t){let n=Ki(t,await e.firebaseDependencies.installations.getId());Wi(e,n,t.productId),Ui(e)}function Ki(e,t){let n={};return e.from&&(n.project_number=e.from),e.fcmMessageId&&(n.message_id=e.fcmMessageId),n.instance_id=t,e.notification?n.message_type=ee.DISPLAY_NOTIFICATION.toString():n.message_type=ee.DATA_MESSAGE.toString(),n.sdk_platform=Xr.toString(),n.package_name=self.origin.replace(/(^\w+:|^)\/\//,""),e.collapse_key&&(n.collapse_key=e.collapse_key),n.event=Zr.toString(),e.fcmOptions?.analytics_label&&(n.analytics_label=e.fcmOptions?.analytics_label),n}function Wi(e,t,n){let r={};r.event_time_ms=Math.floor(Date.now()).toString(),r.source_extension_json_proto3=JSON.stringify({messaging_client_event:t}),n&&(r.compliance_data=zi(n)),e.logEvents.push(r)}function zi(e){return{privacy_context:{prequest:{origin_associated_product_id:e}}}}function qi(e){let t={};return t.log_source=Yr.toString(),t.log_event=e,t}function Gi(e,t){let n=[];for(let r=0;r<e.length;r++)n.push(e.charAt(r)),r<t.length&&n.push(t.charAt(r));return n.join("")}async function Ji(e,t){t.swRegistration||(t.swRegistration=self.registration);let{newSubscription:n}=e;if(!n){await Nt(t);return}if(await Fe(t.firebaseDependencies).catch(()=>{})){let o=await Ni(t).catch(()=>{});if(o){let s=await $e();Vt(s)&&no(s,o)}return}let i=await xe(t.firebaseDependencies);await Nt(t),t.vapidKey=i?.subscriptionOptions?.vapidKey??Ne,await Ei(t)}async function Qi(e,t){let n=Zi(e);if(!n)return;t.deliveryMetricsExportedToBigQueryEnabled&&await Vi(t,n);let r=await $e();if(Vt(r))return to(r,n);if(n.notification&&await ro(Xi(n)),!!t&&t.onBackgroundMessageHandler){let i=Mi(n);typeof t.onBackgroundMessageHandler=="function"?await t.onBackgroundMessageHandler(i):t.onBackgroundMessageHandler.next(i)}}async function Yi(e){let t=e.notification?.data?.[Ft];if(t){if(e.action)return}else return;e.stopImmediatePropagation(),e.notification.close();let n=io(t);if(!n)return;let r=new URL(n,self.location.href),i=new URL(self.location.origin);if(r.host!==i.host)return;let o=await eo(r);if(o?o=await o.focus():(o=await self.clients.openWindow(n),await Pi(3e3)),!!o)return t.messageType=P.NOTIFICATION_CLICKED,t.isFirebaseMessaging=!0,o.postMessage(t)}function Xi(e){let t={...e.notification};return t.data={[Ft]:e},t}function Zi({data:e}){if(!e)return null;try{return e.json()}catch{return null}}async function eo(e){let t=await $e();for(let n of t){let r=new URL(n.url,self.location.href);if(e.host===r.host)return n}return null}function Vt(e){return e.some(t=>t.visibilityState==="visible"&&!t.url.startsWith("chrome-extension://"))}function to(e,t){t.isFirebaseMessaging=!0,t.messageType=P.PUSH_RECEIVED;for(let n of e)n.postMessage(t)}function no(e,t){let n={isFirebaseMessaging:!0,messageType:P.FID_REGISTERED,fid:t};for(let r of e)r.postMessage(n)}function $e(){return self.clients.matchAll({type:"window",includeUncontrolled:!0})}function ro(e){let{actions:t}=e,{maxActions:n}=Notification;return t&&n&&t.length>n&&console.warn(`This browser only supports ${n} actions. The remaining actions will not be displayed.`),self.registration.showNotification(e.title??"",e)}function io(e){let t=e.fcmOptions?.link??e.notification?.click_action;return t||(Li(e.data)?self.location.origin:null)}function oo(e){if(!e||!e.options)throw Oe("App Configuration Object");if(!e.name)throw Oe("App Name");let t=["projectId","apiKey","appId","messagingSenderId"],{options:n}=e;for(let r of t)if(!n[r])throw Oe(r);return{appName:e.name,projectId:n.projectId,apiKey:n.apiKey,appId:n.appId,senderId:n.messagingSenderId}}function Oe(e){return l.create("missing-app-config-values",{valueName:e})}var Re=class{constructor(t,n,r){this.deliveryMetricsExportedToBigQueryEnabled=!1,this.onBackgroundMessageHandler=null,this.onMessageHandler=null,this.onRegisteredHandler=null,this.onUnregisteredHandler=null,this._registerNotifyChain=Promise.resolve(),this._fidChangeUnsubscribe=null,this.logEvents=[],this.logQueue={state:"stopped"};let i=oo(t);this.firebaseDependencies={app:t,appConfig:i,installations:n,analyticsProvider:r}}_delete(){return this._fidChangeUnsubscribe&&(this._fidChangeUnsubscribe(),this._fidChangeUnsubscribe=null),this.logQueue.state==="scheduled"&&clearTimeout(this.logQueue.timerId),this.logQueue={state:"stopped"},Promise.resolve()}};var so=e=>{let t=new Re(e.getProvider("app").getImmediate(),e.getProvider("installations-internal").getImmediate(),e.getProvider("analytics-internal"));return self.addEventListener("push",n=>{n.waitUntil(Qi(n,t))}),self.addEventListener("pushsubscriptionchange",n=>{n.waitUntil(Ji(n,t))}),self.addEventListener("notificationclick",n=>{n.waitUntil(Yi(n))}),t};function ao(){A(new p("messaging-sw",so,"PUBLIC"))}async function co(){return K()&&await W()&&"PushManager"in self&&"Notification"in self&&ServiceWorkerRegistration.prototype.hasOwnProperty("showNotification")&&PushSubscription.prototype.hasOwnProperty("getKey")}function uo(e,t){if(self.document!==void 0)throw l.create("only-available-in-sw");return e.onBackgroundMessageHandler=t,()=>{e.onBackgroundMessageHandler=null}}function Kt(e=Ee()){return co().then(t=>{if(!t)throw l.create("unsupported-browser")},t=>{throw l.create("indexed-db-unsupported")}),F(oe(e),"messaging-sw").getImmediate()}function Wt(e,t){return e=oe(e),uo(e,t)}ao();var te="mi-fondo-shell-298a66d64d77",zt=h;self.addEventListener("install",e=>{e.waitUntil(caches.open(te).then(t=>t.addAll(zt)))});self.addEventListener("activate",e=>{e.waitUntil((async()=>{for(let t of await caches.keys())t.startsWith("mi-fondo-shell-")&&t!==te&&await caches.delete(t);await self.clients.claim()})())});self.addEventListener("fetch",e=>{let t=new URL(e.request.url);if(!(e.request.method!=="GET"||t.origin!==self.location.origin)){if(e.request.mode==="navigate"){e.respondWith(fetch(e.request).catch(async()=>await(await caches.open(te)).match("/index.html",{ignoreVary:!0})||new Response("Abre Mi Fondo con conexi\xF3n para preparar la aplicaci\xF3n.",{status:503,headers:{"Content-Type":"text/plain;charset=utf-8"}})));return}zt.includes(t.pathname)&&e.respondWith(caches.open(te).then(async n=>await n.match(e.request,{ignoreVary:!0})||fetch(e.request)))}});function fo(e){return new Promise((t,n)=>{let r=indexedDB.open("mi-fondo-push",1);r.onupgradeneeded=()=>r.result.createObjectStore("seen"),r.onerror=()=>n(r.error),r.onsuccess=()=>{let i=r.result,o=i.transaction("seen","readwrite"),s=o.objectStore("seen"),a=s.get(e),u=!1;a.onsuccess=()=>{a.result||(u=!0,s.put(Date.now(),e))},o.oncomplete=()=>{i.close(),t(u)},o.onerror=()=>{i.close(),n(o.error)}}})}async function qt(e){if(!e?.id||!e?.title||!await fo(e.id))return;let t=new URL(e.url||"/",self.location.origin);t.origin===self.location.origin&&await self.registration.showNotification(e.title,{body:e.body||"",icon:"/icon-192.png",badge:"/badge-96.png",tag:e.id,renotify:!1,data:{url:t.href}})}self.addEventListener("notificationclick",e=>{e.notification.close(),e.waitUntil((async()=>{let t=new URL(e.notification.data?.url||"/",self.location.origin);t.origin!==self.location.origin&&(t=new URL("/",self.location.origin));let n=await self.clients.matchAll({type:"window",includeUncontrolled:!0});for(let r of n)if(new URL(r.url).origin===t.origin)return await r.navigate(t.href),r.focus();return self.clients.openWindow(t.href)})())});self.addEventListener("message",e=>{e.data?.type==="PUSH"&&e.waitUntil(qt(e.data.data))});if(d.apiKey&&d.appId){let e=_e(d);Wt(Kt(e),t=>qt(t.data))}})();
/*! Bundled license information:

@firebase/util/dist/postinstall.mjs:
@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
@firebase/logger/dist/esm/index.esm.js:
@firebase/messaging/dist/esm/index.sw.esm.js:
@firebase/messaging/dist/esm/index.sw.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
@firebase/component/dist/esm/index.esm.js:
@firebase/app/dist/esm/index.esm.js:
@firebase/app/dist/esm/index.esm.js:
@firebase/app/dist/esm/index.esm.js:
@firebase/installations/dist/esm/index.esm.js:
@firebase/installations/dist/esm/index.esm.js:
@firebase/installations/dist/esm/index.esm.js:
@firebase/installations/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
firebase/app/dist/esm/index.esm.js:
@firebase/installations/dist/esm/index.esm.js:
@firebase/messaging/dist/esm/index.sw.esm.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/util/dist/index.esm.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2025 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2023 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/app/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/installations/dist/esm/index.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/messaging/dist/esm/index.sw.esm.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2018 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
   * in compliance with the License. You may obtain a copy of the License at
   *
   * http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software distributed under the License
   * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
   * or implied. See the License for the specific language governing permissions and limitations under
   * the License.
   *)
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2026 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/messaging/dist/esm/index.sw.esm.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2019 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
  (**
   * @license
   * Copyright 2020 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)

@firebase/messaging/dist/esm/index.sw.esm.js:
  (**
   * @license
   * Copyright 2026 Google LLC
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *   http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   *)
*/
