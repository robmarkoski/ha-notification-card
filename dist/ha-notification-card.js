/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t=globalThis,e=t.ShadowRoot&&(void 0===t.ShadyCSS||t.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),s=new WeakMap;let n=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const i=this.t;if(e&&void 0===t){const e=void 0!==i&&1===i.length;e&&(t=s.get(i)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&s.set(i,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,i,s)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+t[s+1],t[0]);return new n(s,t,i)},o=e?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const i of t.cssRules)e+=i.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:a,defineProperty:l,getOwnPropertyDescriptor:d,getOwnPropertyNames:c,getOwnPropertySymbols:h,getPrototypeOf:p}=Object,u=globalThis,g=u.trustedTypes,_=g?g.emptyScript:"",f=u.reactiveElementPolyfillSupport,m=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?_:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let i=t;switch(e){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t)}catch(t){i=null}}return i}},y=(t,e)=>!a(t,e),b={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:y};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */Symbol.metadata??=Symbol("metadata"),u.litPropertyMetadata??=new WeakMap;let $=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=b){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const i=Symbol(),s=this.getPropertyDescriptor(t,i,e);void 0!==s&&l(this.prototype,t,s)}}static getPropertyDescriptor(t,e,i){const{get:s,set:n}=d(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:s,set(e){const r=s?.call(this);n?.call(this,e),this.requestUpdate(t,r,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??b}static _$Ei(){if(this.hasOwnProperty(m("elementProperties")))return;const t=p(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(m("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(m("properties"))){const t=this.properties,e=[...c(t),...h(t)];for(const i of e)this.createProperty(i,t[i])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,i]of e)this.elementProperties.set(t,i)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const i=this._$Eu(t,e);void 0!==i&&this._$Eh.set(i,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const i=new Set(t.flat(1/0).reverse());for(const t of i)e.unshift(o(t))}else void 0!==t&&e.push(o(t));return e}static _$Eu(t,e){const i=e.attribute;return!1===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const i=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((i,s)=>{if(e)i.adoptedStyleSheets=s.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of s){const s=document.createElement("style"),n=t.litNonce;void 0!==n&&s.setAttribute("nonce",n),s.textContent=e.cssText,i.appendChild(s)}})(i,this.constructor.elementStyles),i}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}_$ET(t,e){const i=this.constructor.elementProperties.get(t),s=this.constructor._$Eu(t,i);if(void 0!==s&&!0===i.reflect){const n=(void 0!==i.converter?.toAttribute?i.converter:v).toAttribute(e,i.type);this._$Em=t,null==n?this.removeAttribute(s):this.setAttribute(s,n),this._$Em=null}}_$AK(t,e){const i=this.constructor,s=i._$Eh.get(t);if(void 0!==s&&this._$Em!==s){const t=i.getPropertyOptions(s),n="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=s;const r=n.fromAttribute(e,t.type);this[s]=r??this._$Ej?.get(s)??r,this._$Em=null}}requestUpdate(t,e,i,s=!1,n){if(void 0!==t){const r=this.constructor;if(!1===s&&(n=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??y)(n,e)||i.useDefault&&i.reflect&&n===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,e,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:i,reflect:s,wrapped:n},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??e??this[t]),!0!==n||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),!0===s&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,i]of t){const{wrapped:t}=i,s=this[e];!0!==t||this._$AL.has(e)||void 0===s||this.C(e,void 0,i,s)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};$.elementStyles=[],$.shadowRootOptions={mode:"open"},$[m("elementProperties")]=new Map,$[m("finalized")]=new Map,f?.({ReactiveElement:$}),(u.reactiveElementVersions??=[]).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const x=globalThis,w=t=>t,A=x.trustedTypes,S=A?A.createPolicy("lit-html",{createHTML:t=>t}):void 0,E="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,C="?"+k,N=`<${C}>`,T=document,P=()=>T.createComment(""),O=t=>null===t||"object"!=typeof t&&"function"!=typeof t,M=Array.isArray,U="[ \t\n\f\r]",z=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,H=/-->/g,D=/>/g,R=RegExp(`>|${U}(?:([^\\s"'>=/]+)(${U}*=${U}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),I=/'/g,j=/"/g,L=/^(?:script|style|textarea|title)$/i,B=(t=>(e,...i)=>({_$litType$:t,strings:e,values:i}))(1),q=Symbol.for("lit-noChange"),F=Symbol.for("lit-nothing"),J=new WeakMap,X=T.createTreeWalker(T,129);function V(t,e){if(!M(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==S?S.createHTML(e):e}const W=(t,e)=>{const i=t.length-1,s=[];let n,r=2===e?"<svg>":3===e?"<math>":"",o=z;for(let e=0;e<i;e++){const i=t[e];let a,l,d=-1,c=0;for(;c<i.length&&(o.lastIndex=c,l=o.exec(i),null!==l);)c=o.lastIndex,o===z?"!--"===l[1]?o=H:void 0!==l[1]?o=D:void 0!==l[2]?(L.test(l[2])&&(n=RegExp("</"+l[2],"g")),o=R):void 0!==l[3]&&(o=R):o===R?">"===l[0]?(o=n??z,d=-1):void 0===l[1]?d=-2:(d=o.lastIndex-l[2].length,a=l[1],o=void 0===l[3]?R:'"'===l[3]?j:I):o===j||o===I?o=R:o===H||o===D?o=z:(o=R,n=void 0);const h=o===R&&t[e+1].startsWith("/>")?" ":"";r+=o===z?i+N:d>=0?(s.push(a),i.slice(0,d)+E+i.slice(d)+k+h):i+k+(-2===d?e:h)}return[V(t,r+(t[i]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),s]};class Y{constructor({strings:t,_$litType$:e},i){let s;this.parts=[];let n=0,r=0;const o=t.length-1,a=this.parts,[l,d]=W(t,e);if(this.el=Y.createElement(l,i),X.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(s=X.nextNode())&&a.length<o;){if(1===s.nodeType){if(s.hasAttributes())for(const t of s.getAttributeNames())if(t.endsWith(E)){const e=d[r++],i=s.getAttribute(t).split(k),o=/([.?@])?(.*)/.exec(e);a.push({type:1,index:n,name:o[2],strings:i,ctor:"."===o[1]?tt:"?"===o[1]?et:"@"===o[1]?it:Q}),s.removeAttribute(t)}else t.startsWith(k)&&(a.push({type:6,index:n}),s.removeAttribute(t));if(L.test(s.tagName)){const t=s.textContent.split(k),e=t.length-1;if(e>0){s.textContent=A?A.emptyScript:"";for(let i=0;i<e;i++)s.append(t[i],P()),X.nextNode(),a.push({type:2,index:++n});s.append(t[e],P())}}}else if(8===s.nodeType)if(s.data===C)a.push({type:2,index:n});else{let t=-1;for(;-1!==(t=s.data.indexOf(k,t+1));)a.push({type:7,index:n}),t+=k.length-1}n++}}static createElement(t,e){const i=T.createElement("template");return i.innerHTML=t,i}}function K(t,e,i=t,s){if(e===q)return e;let n=void 0!==s?i._$Co?.[s]:i._$Cl;const r=O(e)?void 0:e._$litDirective$;return n?.constructor!==r&&(n?._$AO?.(!1),void 0===r?n=void 0:(n=new r(t),n._$AT(t,i,s)),void 0!==s?(i._$Co??=[])[s]=n:i._$Cl=n),void 0!==n&&(e=K(t,n._$AS(t,e.values),n,s)),e}class Z{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:i}=this._$AD,s=(t?.creationScope??T).importNode(e,!0);X.currentNode=s;let n=X.nextNode(),r=0,o=0,a=i[0];for(;void 0!==a;){if(r===a.index){let e;2===a.type?e=new G(n,n.nextSibling,this,t):1===a.type?e=new a.ctor(n,a.name,a.strings,this,t):6===a.type&&(e=new st(n,this,t)),this._$AV.push(e),a=i[++o]}r!==a?.index&&(n=X.nextNode(),r++)}return X.currentNode=T,s}p(t){let e=0;for(const i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}}class G{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,i,s){this.type=2,this._$AH=F,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=s,this._$Cv=s?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=K(this,t,e),O(t)?t===F||null==t||""===t?(this._$AH!==F&&this._$AR(),this._$AH=F):t!==this._$AH&&t!==q&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>M(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==F&&O(this._$AH)?this._$AA.nextSibling.data=t:this.T(T.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:i}=t,s="number"==typeof i?this._$AC(t):(void 0===i.el&&(i.el=Y.createElement(V(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===s)this._$AH.p(e);else{const t=new Z(s,this),i=t.u(this.options);t.p(e),this.T(i),this._$AH=t}}_$AC(t){let e=J.get(t.strings);return void 0===e&&J.set(t.strings,e=new Y(t)),e}k(t){M(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let i,s=0;for(const n of t)s===e.length?e.push(i=new G(this.O(P()),this.O(P()),this,this.options)):i=e[s],i._$AI(n),s++;s<e.length&&(this._$AR(i&&i._$AB.nextSibling,s),e.length=s)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=w(t).nextSibling;w(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class Q{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,s,n){this.type=1,this._$AH=F,this._$AN=void 0,this.element=t,this.name=e,this._$AM=s,this.options=n,i.length>2||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=F}_$AI(t,e=this,i,s){const n=this.strings;let r=!1;if(void 0===n)t=K(this,t,e,0),r=!O(t)||t!==this._$AH&&t!==q,r&&(this._$AH=t);else{const s=t;let o,a;for(t=n[0],o=0;o<n.length-1;o++)a=K(this,s[i+o],e,o),a===q&&(a=this._$AH[o]),r||=!O(a)||a!==this._$AH[o],a===F?t=F:t!==F&&(t+=(a??"")+n[o+1]),this._$AH[o]=a}r&&!s&&this.j(t)}j(t){t===F?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class tt extends Q{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===F?void 0:t}}class et extends Q{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==F)}}class it extends Q{constructor(t,e,i,s,n){super(t,e,i,s,n),this.type=5}_$AI(t,e=this){if((t=K(this,t,e,0)??F)===q)return;const i=this._$AH,s=t===F&&i!==F||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,n=t!==F&&(i===F||s);s&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class st{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){K(this,t)}}const nt=x.litHtmlPolyfillSupport;nt?.(Y,G),(x.litHtmlVersions??=[]).push("3.3.2");const rt=globalThis;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class ot extends ${constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,i)=>{const s=i?.renderBefore??e;let n=s._$litPart$;if(void 0===n){const t=i?.renderBefore??null;s._$litPart$=n=new G(e.insertBefore(P(),t),t,void 0,i??{})}return n._$AI(t),n})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return q}}ot._$litElement$=!0,ot.finalized=!0,rt.litElementHydrateSupport?.({LitElement:ot});const at=rt.litElementPolyfillSupport;at?.({LitElement:ot}),(rt.litElementVersions??=[]).push("4.2.2");const lt=["critical","error","warning","info","success"],dt=[{value:"state",label:"Specific state"},{value:"on",label:"Turns on"},{value:"off",label:"Turns off"},{value:"any",label:"Any change"},{value:"above",label:"Above threshold"},{value:"below",label:"Below threshold"},{value:"unavailable",label:"Unavailable / Unknown"}],ct=[{value:"info",label:"Info"},{value:"success",label:"Success"},{value:"warning",label:"Warning"},{value:"error",label:"Error"},{value:"critical",label:"Critical"}];function ht(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8)}function pt(t,e){return t?t.replace(/\{(\w+)\}/g,(t,i)=>void 0!==e[i]?e[i]:`{${i}}`):""}class ut{constructor(t){this._key=`ha-notification-card-${t}`}load(){try{const t=localStorage.getItem(this._key);return t?JSON.parse(t):[]}catch{return[]}}save(t){try{localStorage.setItem(this._key,JSON.stringify(t))}catch{const e=t.slice(-50);localStorage.setItem(this._key,JSON.stringify(e))}}loadDismissed(){try{const t=localStorage.getItem(this._key+"-dismissed");return t?JSON.parse(t):{}}catch{return{}}}saveDismissed(t){try{localStorage.setItem(this._key+"-dismissed",JSON.stringify(t))}catch{}}loadMuted(){try{const t=localStorage.getItem(this._key+"-muted");return t?JSON.parse(t):{}}catch{return{}}}saveMuted(t){try{localStorage.setItem(this._key+"-muted",JSON.stringify(t))}catch{}}}customElements.define("ha-notification-card",class extends ot{static get properties(){return{hass:{type:Object},_config:{type:Object,state:!0},_notifications:{type:Array,state:!0},_expanded:{type:Boolean,state:!0},_expandedId:{type:String,state:!0},_previousStates:{type:Object,state:!0},_dismissed:{type:Object,state:!0},_muted:{type:Object,state:!0},_swipeState:{type:Object,state:!0}}}constructor(){super(),this._notifications=[],this._expanded=!1,this._expandedId=null,this._previousStates={},this._dismissed={},this._muted={},this._swipeState={},this._store=null,this._expiryTimer=null,this._longPressTimer=null,this._initialized=!1}setConfig(t){if(!t.entities||!Array.isArray(t.entities))throw new Error("You need to define entities");this._config={title:t.title||"Notifications",card_id:t.card_id||"default",visible_count:t.visible_count??4,expiry_minutes:t.expiry_minutes??0,hide_when_empty:t.hide_when_empty??!1,show_empty:t.show_empty??!0,empty_text:t.empty_text||"No notifications",show_header:t.show_header??!0,show_badge:t.show_badge??!0,show_clear_all:t.show_clear_all??!0,show_timestamp:t.show_timestamp??!0,sort_by:t.sort_by||"newest",group_repeated:t.group_repeated??!0,vibrate:t.vibrate??!1,max_stored:t.max_stored??100,entities:t.entities.map(t=>({entity:t.entity,name:t.name||null,trigger:t.trigger||"any",state:t.state||null,threshold:null!=t.threshold?Number(t.threshold):null,severity:t.severity||"info",message:t.message||null,icon:t.icon||null,expiry_minutes:t.expiry_minutes??null,enabled:t.enabled??!0}))},this._store=new ut(this._config.card_id),this._notifications=this._store.load(),this._dismissed=this._store.loadDismissed(),this._muted=this._store.loadMuted()}getCardSize(){const t=this._activeNotifications().length;if(0===t&&this._config?.hide_when_empty)return 0;const e=Math.min(t,this._config?.visible_count??4);return Math.max(1,e+1)}static getConfigElement(){return document.createElement("ha-notification-card-editor")}static getStubConfig(){return{title:"Notifications",visible_count:4,expiry_minutes:0,entities:[{entity:"",trigger:"any",severity:"info",message:"{name} changed to {state}"}]}}connectedCallback(){super.connectedCallback(),this._startExpiryTimer()}disconnectedCallback(){super.disconnectedCallback(),this._stopExpiryTimer()}updated(t){t.has("hass")&&this.hass&&this._config&&this._evaluateEntities()}_evaluateEntities(){if(!this.hass||!this._config)return;const t=[];for(const e of this._config.entities){if(!e.enabled)continue;if(this._muted[e.entity]){if(this._muted[e.entity]>Date.now())continue;delete this._muted[e.entity],this._store.saveMuted(this._muted)}const i=this.hass.states[e.entity];if(!i)continue;const s=i.state,n=this._previousStates[e.entity];if(this._previousStates[e.entity]=s,!this._initialized)continue;if(void 0===n)continue;if(n===s)continue;if(!this._checkTrigger(e,s,n))continue;const r=e.name||i.attributes.friendly_name||e.entity,o=e.message?pt(e.message,{name:r,state:s,previous:n,entity:e.entity}):`${r}: ${s}`,a={id:ht(),entity:e.entity,severity:e.severity,message:o,state:s,previous:n,timestamp:Date.now(),icon:e.icon||i.attributes.icon||null,expiry_minutes:e.expiry_minutes??this._config.expiry_minutes,count:1};t.push(a)}if(this._initialized=!0,t.length>0){let e=[...this._notifications];for(const i of t){if(this._config.group_repeated){const t=e.find(t=>t.entity===i.entity&&t.severity===i.severity&&!this._dismissed[t.id]);if(t){t.message=i.message,t.state=i.state,t.previous=i.previous,t.timestamp=i.timestamp,t.count=(t.count||1)+1;continue}}e.push(i)}e.length>this._config.max_stored&&(e=e.slice(-this._config.max_stored)),this._notifications=e,this._store.save(this._notifications),this._config.vibrate&&navigator.vibrate&&navigator.vibrate(100),this.requestUpdate()}}_checkTrigger(t,e,i){switch(t.trigger){case"any":return!0;case"state":return e===t.state&&i!==t.state;case"on":return"on"===e&&"on"!==i;case"off":return"off"===e&&"off"!==i;case"unavailable":return("unavailable"===e||"unknown"===e)&&"unavailable"!==i&&"unknown"!==i;case"above":return null!=t.threshold&&!isNaN(Number(e))&&Number(e)>t.threshold&&(isNaN(Number(i))||Number(i)<=t.threshold);case"below":return null!=t.threshold&&!isNaN(Number(e))&&Number(e)<t.threshold&&(isNaN(Number(i))||Number(i)>=t.threshold);default:return!1}}_startExpiryTimer(){this._expiryTimer=setInterval(()=>this._purgeExpired(),3e4)}_stopExpiryTimer(){this._expiryTimer&&clearInterval(this._expiryTimer)}_purgeExpired(){const t=Date.now();let e=!1;for(const i of this._notifications){if(this._dismissed[i.id])continue;const s=i.expiry_minutes||0;s>0&&t-i.timestamp>6e4*s&&(this._dismissed[i.id]=!0,e=!0)}e&&(this._store.saveDismissed(this._dismissed),this.requestUpdate())}_activeNotifications(){let t=this._notifications.filter(t=>!this._dismissed[t.id]);switch(this._config?.sort_by){case"oldest":t.sort((t,e)=>t.timestamp-e.timestamp);break;case"severity":t.sort((t,e)=>lt.indexOf(t.severity)-lt.indexOf(e.severity));break;default:t.sort((t,e)=>e.timestamp-t.timestamp)}return t}_dismiss(t){this._dismissed[t]=!0,this._store.saveDismissed(this._dismissed),this.requestUpdate()}_dismissAll(){for(const t of this._notifications)this._dismissed[t.id]=!0;this._store.saveDismissed(this._dismissed),this._expanded=!1,this.requestUpdate()}_muteEntity(t,e=60){this._muted[t]=Date.now()+6e4*e,this._store.saveMuted(this._muted),this.requestUpdate()}_toggleExpand(){this._expanded=!this._expanded,this.requestUpdate()}_toggleDetail(t){this._expandedId=this._expandedId===t?null:t,this.requestUpdate()}_onTouchStart(t,e){const i=t.touches[0];this._swipeState={id:e,startX:i.clientX,startY:i.clientY,currentX:0,swiping:!1},this._longPressTimer=setTimeout(()=>{this._toggleDetail(e),this._swipeState={}},500)}_onTouchMove(t,e){if(!this._swipeState.id||this._swipeState.id!==e)return;const i=t.touches[0],s=i.clientX-this._swipeState.startX;if(i.clientY,this._swipeState.startY,Math.abs(s)>10&&(clearTimeout(this._longPressTimer),this._swipeState.swiping=!0),this._swipeState.swiping){t.preventDefault(),this._swipeState.currentX=s;const i=this.shadowRoot.querySelector(`[data-id="${e}"]`);if(i){const t=Math.max(0,1-Math.abs(s)/200);i.style.transform=`translateX(${s}px)`,i.style.opacity=t}}}_onTouchEnd(t,e){if(clearTimeout(this._longPressTimer),!this._swipeState.id||this._swipeState.id!==e)return;const i=this.shadowRoot.querySelector(`[data-id="${e}"]`);if(Math.abs(this._swipeState.currentX)>80){if(i){const t=this._swipeState.currentX>0?1:-1;i.style.transform=`translateX(${400*t}px)`,i.style.opacity="0",i.style.transition="transform 0.2s ease, opacity 0.2s ease",setTimeout(()=>this._dismiss(e),200)}}else i&&(i.style.transform="",i.style.opacity="",i.style.transition="transform 0.2s ease, opacity 0.2s ease",setTimeout(()=>{i&&(i.style.transition="")},200));this._swipeState={}}_setHidden(t){if(t){this.hidden=!0,this.style.setProperty("display","none","important"),this.style.setProperty("margin","0","important"),this.style.setProperty("padding","0","important");const t=this.parentElement;if(t){const e=[...t.children].filter(t=>t!==this&&!t.hidden);0===e.length&&(t.style.setProperty("display","none","important"),t.dataset.hiddenByNotifCard="1")}}else{this.hidden=!1,this.style.removeProperty("display"),this.style.removeProperty("margin"),this.style.removeProperty("padding");const t=this.parentElement;t?.dataset.hiddenByNotifCard&&(t.style.removeProperty("display"),delete t.dataset.hiddenByNotifCard)}}render(){if(!this._config)return B``;const t=this._activeNotifications();if(0===t.length&&this._config.hide_when_empty)return this._setHidden(!0),B``;this._setHidden(!1);const e=this._expanded?t:t.slice(0,this._config.visible_count),i=t.length>this._config.visible_count,s=t.length-this._config.visible_count;return B`
      <ha-card>
        ${this._config.show_header?B`
              <div class="card-header">
                <div class="header-left">
                  <span class="title">${this._config.title}</span>
                  ${this._config.show_badge&&t.length>0?B`<span class="badge">${t.length}</span>`:F}
                </div>
                <div class="header-right">
                  ${this._config.show_clear_all&&t.length>0?B`
                        <button
                          class="clear-all"
                          @click=${this._dismissAll}
                          title="Clear all"
                        >
                          Clear all
                        </button>
                      `:F}
                </div>
              </div>
            `:F}

        <div class="card-content">
          ${0===t.length&&this._config.show_empty?B`
                <div class="empty">
                  <ha-icon icon="mdi:bell-check-outline"></ha-icon>
                  <span>${this._config.empty_text}</span>
                </div>
              `:F}
          ${e.map(t=>this._renderNotification(t))}
          ${i&&!this._expanded?B`
                <button class="show-more" @click=${this._toggleExpand}>
                  Show ${s} more
                </button>
              `:F}
          ${this._expanded&&i?B`
                <button class="show-more" @click=${this._toggleExpand}>
                  Show less
                </button>
              `:F}
        </div>
      </ha-card>
    `}_renderNotification(t){const e=this._expandedId===t.id,i=t.icon||function(t){switch(t){case"critical":return"mdi:alert-octagon";case"error":return"mdi:alert-circle";case"warning":return"mdi:alert";case"success":return"mdi:check-circle";default:return"mdi:information"}}(t.severity),s=function(t){switch(t){case"critical":case"error":return"var(--error-color, #db4437)";case"warning":return"var(--warning-color, #ffa726)";case"success":return"var(--success-color, #43a047)";default:return"var(--info-color, #039be5)"}}(t.severity),n=this.hass?.states[t.entity];return B`
      <div
        class="notification severity-${t.severity}${e?" expanded":""}"
        data-id="${t.id}"
        @touchstart=${e=>this._onTouchStart(e,t.id)}
        @touchmove=${e=>this._onTouchMove(e,t.id)}
        @touchend=${e=>this._onTouchEnd(e,t.id)}
      >
        <div class="notif-main">
          <div class="notif-icon" style="color: ${s}">
            <ha-icon icon="${i}"></ha-icon>
          </div>
          <div class="notif-body">
            <div class="notif-message">${t.message}</div>
            <div class="notif-meta">
              ${this._config.show_timestamp?B`<span class="notif-time"
                    >${function(t){const e=new Date(t),i=new Date-e;return i<6e4?"just now":i<36e5?`${Math.floor(i/6e4)}m ago`:i<864e5?`${Math.floor(i/36e5)}h ago`:e.toLocaleDateString(void 0,{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}(t.timestamp)}</span
                  >`:F}
              ${t.count>1?B`<span class="notif-count">×${t.count}</span>`:F}
            </div>
          </div>
          <button
            class="notif-dismiss"
            @click=${e=>{e.stopPropagation(),this._dismiss(t.id)}}
            title="Dismiss"
          >
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>

        ${e?B`
              <div class="notif-detail">
                <div class="detail-row">
                  <span class="detail-label">Entity</span>
                  <span class="detail-value">${t.entity}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">State</span>
                  <span class="detail-value">${t.state}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Previous</span>
                  <span class="detail-value">${t.previous}</span>
                </div>
                ${n?B`
                      <div class="detail-row">
                        <span class="detail-label">Current live</span>
                        <span class="detail-value">${n.state}</span>
                      </div>
                      ${Object.entries(n.attributes).filter(([t])=>!["friendly_name","icon","entity_picture"].includes(t)).slice(0,8).map(([t,e])=>B`
                            <div class="detail-row">
                              <span class="detail-label">${t}</span>
                              <span class="detail-value"
                                >${"object"==typeof e?JSON.stringify(e):e}</span
                              >
                            </div>
                          `)}
                    `:F}
                <div class="detail-row">
                  <span class="detail-label">Triggered</span>
                  <span class="detail-value"
                    >${new Date(t.timestamp).toLocaleString()}</span
                  >
                </div>
                <div class="detail-actions">
                  <button
                    class="detail-btn"
                    @click=${()=>this._muteEntity(t.entity,60)}
                  >
                    Mute 1h
                  </button>
                  <button
                    class="detail-btn"
                    @click=${()=>this._muteEntity(t.entity,1440)}
                  >
                    Mute 24h
                  </button>
                </div>
              </div>
            `:F}
      </div>
    `}static get styles(){return r`
      :host {
        display: block;
      }

      ha-card {
        background: var(--ha-card-background, var(--card-background-color));
        border-radius: var(--ha-card-border-radius, 12px);
        overflow: hidden;
      }

      .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 16px 8px 16px;
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .title {
        font-size: 16px;
        font-weight: 500;
        color: var(--primary-text-color);
      }

      .badge {
        background: var(--primary-color, #03a9f4);
        color: #fff;
        font-size: 11px;
        font-weight: 600;
        min-width: 20px;
        height: 20px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 6px;
      }

      .header-right {
        display: flex;
        align-items: center;
      }

      .clear-all {
        background: none;
        border: none;
        color: var(--primary-color, #03a9f4);
        font-size: 13px;
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 6px;
        transition: background 0.15s;
      }

      .clear-all:hover {
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.1);
      }

      .card-content {
        padding: 0 16px 16px 16px;
      }

      .empty {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 24px 0;
        color: var(--secondary-text-color);
        font-size: 14px;
      }

      .empty ha-icon {
        --mdc-icon-size: 20px;
        color: var(--secondary-text-color);
      }

      /* --- Notification row --- */

      .notification {
        position: relative;
        border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        padding: 12px 0;
        touch-action: pan-y;
        user-select: none;
        will-change: transform, opacity;
      }

      .notification:last-child {
        border-bottom: none;
      }

      .notif-main {
        display: flex;
        align-items: flex-start;
        gap: 12px;
      }

      .notif-icon {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.05);
      }

      .notif-icon ha-icon {
        --mdc-icon-size: 20px;
      }

      /* Severity backgrounds */
      .severity-critical .notif-icon {
        background: rgba(var(--rgb-red, 219, 68, 55), 0.12);
      }
      .severity-error .notif-icon {
        background: rgba(var(--rgb-red, 219, 68, 55), 0.12);
      }
      .severity-warning .notif-icon {
        background: rgba(var(--rgb-orange, 255, 167, 38), 0.12);
      }
      .severity-success .notif-icon {
        background: rgba(var(--rgb-green, 67, 160, 71), 0.12);
      }
      .severity-info .notif-icon {
        background: rgba(var(--rgb-blue, 3, 155, 229), 0.12);
      }

      /* Critical pulsing border */
      .severity-critical {
        border-left: 3px solid var(--error-color, #db4437);
        padding-left: 8px;
        animation: pulse-critical 2s ease-in-out infinite;
      }

      @keyframes pulse-critical {
        0%,
        100% {
          border-left-color: var(--error-color, #db4437);
        }
        50% {
          border-left-color: transparent;
        }
      }

      .notif-body {
        flex: 1;
        min-width: 0;
      }

      .notif-message {
        font-size: 14px;
        color: var(--primary-text-color);
        line-height: 1.4;
        word-break: break-word;
      }

      .notif-meta {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 2px;
      }

      .notif-time {
        font-size: 12px;
        color: var(--secondary-text-color);
      }

      .notif-count {
        font-size: 11px;
        font-weight: 600;
        color: var(--secondary-text-color);
        background: rgba(0, 0, 0, 0.06);
        padding: 1px 6px;
        border-radius: 8px;
      }

      .notif-dismiss {
        flex-shrink: 0;
        background: none;
        border: none;
        color: var(--secondary-text-color);
        cursor: pointer;
        padding: 4px;
        border-radius: 50%;
        opacity: 0;
        transition: opacity 0.15s, background 0.15s;
        --mdc-icon-size: 18px;
      }

      .notification:hover .notif-dismiss {
        opacity: 1;
      }

      /* Always visible on touch */
      @media (hover: none) {
        .notif-dismiss {
          opacity: 0.6;
        }
      }

      .notif-dismiss:hover {
        background: rgba(0, 0, 0, 0.08);
      }

      /* --- Detail expand --- */

      .notif-detail {
        margin-top: 8px;
        padding: 8px 0 0 48px;
        border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08));
      }

      .detail-row {
        display: flex;
        justify-content: space-between;
        padding: 3px 0;
        font-size: 12px;
      }

      .detail-label {
        color: var(--secondary-text-color);
        flex-shrink: 0;
        margin-right: 12px;
      }

      .detail-value {
        color: var(--primary-text-color);
        text-align: right;
        word-break: break-all;
      }

      .detail-actions {
        display: flex;
        gap: 8px;
        margin-top: 8px;
        padding-bottom: 4px;
      }

      .detail-btn {
        background: none;
        border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
        color: var(--primary-text-color);
        font-size: 12px;
        padding: 4px 12px;
        border-radius: 6px;
        cursor: pointer;
        transition: background 0.15s;
      }

      .detail-btn:hover {
        background: rgba(0, 0, 0, 0.05);
      }

      /* --- Show more --- */

      .show-more {
        display: block;
        width: 100%;
        background: none;
        border: none;
        color: var(--primary-color, #03a9f4);
        font-size: 13px;
        padding: 10px 0 2px 0;
        cursor: pointer;
        text-align: center;
      }

      .show-more:hover {
        text-decoration: underline;
      }
    `}}),customElements.define("ha-notification-card-editor",class extends ot{static get properties(){return{hass:{type:Object},_config:{type:Object,state:!0}}}setConfig(t){this._config={...t}}_dispatch(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}_updateField(t,e){this._config={...this._config,[t]:e},this._dispatch()}_updateEntity(t,e,i){const s=[...this._config.entities||[]];s[t]={...s[t],[e]:i},this._config={...this._config,entities:s},this._dispatch()}_addEntity(){const t=[...this._config.entities||[],{entity:"",trigger:"any",severity:"info",message:"{name} changed to {state}"}];this._config={...this._config,entities:t},this._dispatch()}_removeEntity(t){const e=[...this._config.entities||[]];e.splice(t,1),this._config={...this._config,entities:e},this._dispatch()}render(){return this._config?B`
      <div class="editor">
        <div class="field">
          <label>Title</label>
          <input
            type="text"
            .value=${this._config.title||""}
            @input=${t=>this._updateField("title",t.target.value)}
          />
        </div>

        <div class="field">
          <label>Card ID (for storage isolation)</label>
          <input
            type="text"
            .value=${this._config.card_id||"default"}
            @input=${t=>this._updateField("card_id",t.target.value)}
          />
        </div>

        <div class="row">
          <div class="field half">
            <label>Visible count</label>
            <input
              type="number"
              min="1"
              max="50"
              .value=${this._config.visible_count??4}
              @input=${t=>this._updateField("visible_count",Number(t.target.value))}
            />
          </div>
          <div class="field half">
            <label>Auto-expiry (min, 0=off)</label>
            <input
              type="number"
              min="0"
              .value=${this._config.expiry_minutes??0}
              @input=${t=>this._updateField("expiry_minutes",Number(t.target.value))}
            />
          </div>
        </div>

        <div class="row">
          <div class="field half">
            <label>Sort by</label>
            <select
              .value=${this._config.sort_by||"newest"}
              @change=${t=>this._updateField("sort_by",t.target.value)}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="severity">Severity</option>
            </select>
          </div>
          <div class="field half">
            <label>Max stored</label>
            <input
              type="number"
              min="10"
              max="500"
              .value=${this._config.max_stored??100}
              @input=${t=>this._updateField("max_stored",Number(t.target.value))}
            />
          </div>
        </div>

        <div class="toggles">
          ${[["hide_when_empty","Hide card when empty",!1],["show_header","Show header",!0],["show_badge","Show badge",!0],["show_clear_all","Show clear all",!0],["show_timestamp","Show timestamps",!0],["show_empty","Show empty state",!0],["group_repeated","Group repeated",!0],["vibrate","Vibrate on new",!1]].map(([t,e,i])=>B`
              <label class="toggle">
                <input
                  type="checkbox"
                  .checked=${this._config[t]??i}
                  @change=${e=>this._updateField(t,e.target.checked)}
                />
                ${e}
              </label>
            `)}
        </div>

        <div class="section-title">Entities</div>

        ${(this._config.entities||[]).map((t,e)=>B`
            <div class="entity-card">
              <div class="entity-header">
                <span class="entity-num">#${e+1}</span>
                <button
                  class="remove-btn"
                  @click=${()=>this._removeEntity(e)}
                >
                  ✕
                </button>
              </div>

              <div class="field">
                <label>Entity</label>
                <input
                  type="text"
                  .value=${t.entity||""}
                  @input=${t=>this._updateEntity(e,"entity",t.target.value)}
                  placeholder="sensor.temperature"
                />
              </div>

              <div class="row">
                <div class="field half">
                  <label>Trigger</label>
                  <select
                    .value=${t.trigger||"any"}
                    @change=${t=>this._updateEntity(e,"trigger",t.target.value)}
                  >
                    ${dt.map(t=>B`<option value="${t.value}">${t.label}</option>`)}
                  </select>
                </div>
                <div class="field half">
                  <label>Severity</label>
                  <select
                    .value=${t.severity||"info"}
                    @change=${t=>this._updateEntity(e,"severity",t.target.value)}
                  >
                    ${ct.map(t=>B`<option value="${t.value}">${t.label}</option>`)}
                  </select>
                </div>
              </div>

              ${"state"===t.trigger?B`
                    <div class="field">
                      <label>Target state</label>
                      <input
                        type="text"
                        .value=${t.state||""}
                        @input=${t=>this._updateEntity(e,"state",t.target.value)}
                      />
                    </div>
                  `:F}
              ${"above"===t.trigger||"below"===t.trigger?B`
                    <div class="field">
                      <label>Threshold</label>
                      <input
                        type="number"
                        .value=${t.threshold??""}
                        @input=${t=>this._updateEntity(e,"threshold",t.target.value?Number(t.target.value):null)}
                      />
                    </div>
                  `:F}

              <div class="field">
                <label
                  >Message template
                  <small>({name} {state} {previous} {entity})</small></label
                >
                <input
                  type="text"
                  .value=${t.message||""}
                  @input=${t=>this._updateEntity(e,"message",t.target.value)}
                  placeholder="{name} changed to {state}"
                />
              </div>

              <div class="row">
                <div class="field half">
                  <label>Icon (optional)</label>
                  <input
                    type="text"
                    .value=${t.icon||""}
                    @input=${t=>this._updateEntity(e,"icon",t.target.value)}
                    placeholder="mdi:thermometer"
                  />
                </div>
                <div class="field half">
                  <label>Expiry min (0=global)</label>
                  <input
                    type="number"
                    min="0"
                    .value=${t.expiry_minutes??""}
                    @input=${t=>this._updateEntity(e,"expiry_minutes",t.target.value?Number(t.target.value):null)}
                  />
                </div>
              </div>

              <div class="field">
                <label>Custom name (optional)</label>
                <input
                  type="text"
                  .value=${t.name||""}
                  @input=${t=>this._updateEntity(e,"name",t.target.value)}
                  placeholder="Override friendly name"
                />
              </div>
            </div>
          `)}

        <button class="add-btn" @click=${this._addEntity}>
          + Add entity
        </button>
      </div>
    `:B``}static get styles(){return r`
      .editor {
        padding: 16px;
      }

      .field {
        margin-bottom: 12px;
      }

      .field label {
        display: block;
        font-size: 12px;
        font-weight: 500;
        color: var(--secondary-text-color);
        margin-bottom: 4px;
      }

      .field label small {
        font-weight: 400;
        opacity: 0.7;
      }

      .field input,
      .field select {
        width: 100%;
        padding: 8px;
        border: 1px solid var(--divider-color, #ccc);
        border-radius: 6px;
        font-size: 14px;
        background: var(--ha-card-background, #fff);
        color: var(--primary-text-color);
        box-sizing: border-box;
      }

      .row {
        display: flex;
        gap: 12px;
      }

      .half {
        flex: 1;
      }

      .toggles {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-bottom: 16px;
      }

      .toggle {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
        color: var(--primary-text-color);
        cursor: pointer;
      }

      .section-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--primary-text-color);
        margin: 16px 0 12px 0;
        padding-bottom: 4px;
        border-bottom: 1px solid var(--divider-color, #eee);
      }

      .entity-card {
        border: 1px solid var(--divider-color, #ddd);
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 12px;
        background: rgba(0, 0, 0, 0.02);
      }

      .entity-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .entity-num {
        font-size: 12px;
        font-weight: 600;
        color: var(--secondary-text-color);
      }

      .remove-btn {
        background: none;
        border: none;
        color: var(--error-color, #db4437);
        font-size: 16px;
        cursor: pointer;
        padding: 2px 6px;
        border-radius: 4px;
      }

      .remove-btn:hover {
        background: rgba(var(--rgb-red, 219, 68, 55), 0.1);
      }

      .add-btn {
        display: block;
        width: 100%;
        padding: 10px;
        border: 2px dashed var(--divider-color, #ccc);
        border-radius: 8px;
        background: none;
        color: var(--primary-color, #03a9f4);
        font-size: 14px;
        cursor: pointer;
        transition: background 0.15s;
      }

      .add-btn:hover {
        background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.05);
      }
    `}}),window.customCards=window.customCards||[],window.customCards.push({type:"ha-notification-card",name:"Notification Card",description:"Entity-driven notification center with swipe dismiss, severity levels, auto-expiry, and grouped alerts.",preview:!0,documentationURL:"https://github.com/robmarkoski/ha-notification-card"}),console.info("%c NOTIFICATION-CARD %c v1.1.0 ","color: white; background: #03a9f4; font-weight: bold; padding: 2px 6px; border-radius: 4px 0 0 4px;","color: #03a9f4; background: white; font-weight: bold; padding: 2px 6px; border-radius: 0 4px 4px 0; border: 1px solid #03a9f4;");
