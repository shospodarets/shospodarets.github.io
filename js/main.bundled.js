/*! For license information please see main.bundled.js.LICENSE.txt */
(()=>{"use strict";var t=[,(t,e,o)=>{o.r(e),o.d(e,{default:()=>s});const n=function(){this.bindEvents()};n.prototype.onPostShortClick=function(t){if("a"===t.target.tagName.toLowerCase())return;const e=this.querySelector(".post-title a").getAttribute("href");e&&(window.location=e)},n.prototype.bindPostClick=function(){const t=document.querySelectorAll(".post__short");[].slice.apply(t).forEach((t=>{t.addEventListener("click",this.onPostShortClick,!0)}))},n.prototype.bindHeadingClick=function(){const t=document.querySelectorAll("h1,h2,h3,h4,h5,h6");[].slice.apply(t).forEach((t=>{const e=t.getAttribute("id");e&&t.addEventListener("click",(()=>{window.location.hash=e}))}))},n.prototype.bindEvents=function(){this.bindPostClick(),this.bindHeadingClick()};const s=n},(t,e,o)=>{o.r(e),o.d(e,{default:()=>i});var n=o(3);class s{constructor(t,e){this.options=e,s.loadTalksData().then((e=>{this.initComponent({talksDataEl:t,talksJson:e})}))}static loadTalksData(){return fetch("/js/assets/talks-data.json").then((t=>t.json())).catch(console.error)}initComponent(t){let{talksDataEl:e,talksJson:o}=t;this.talksDataEl=e,this.talksJson=o,this.talksJson=s.addDateToTalks(this.talksJson),this.talksDataEl.classList.contains("upcoming-only")&&(this.talksJson=this.leaveUpcomingOnly(),this.checkUpcomingTalksPresent(this.talksJson,this.talksDataEl)),this.talksDataEl.classList.contains("previous-only")&&(this.talksJson=this.leavePreviousOnly()),this.forEachTalkEl=this.talksDataEl.querySelector(".for-each-talk"),this.forEachTalkEl.parentNode.removeChild(this.forEachTalkEl),this.isGalleryIncluded=!1,this.populateData(),this.onLoad(),this.talksDataEl.classList.add("loaded")}checkUpcomingTalksPresent(){0===this.talksJson.length&&(this.talksDataEl.closest(".js-talks-data_upcoming-only__hide-when-empty").style.display="none")}leaveUpcomingOnly(){return this.talksJson.filter((t=>s.isTalkUpcoming(t))).reverse()}leavePreviousOnly(){return this.talksJson.filter((t=>!s.isTalkUpcoming(t)))}static addDateToTalks(t){const e=["January","February","March","April","May","June","July","August","September","October","November","December"];return t.forEach((t=>{const o=e[Number(t.month)-1];t.date=`${o} ${t.year}`})),t}static isTalkUpcoming(t){const e=Number(t.year),o=Number(t.month),n=(new Date).getFullYear(),s=(new Date).getMonth()+1;return e>n||e===n&&o>=s}populateData(){this.talksJson.forEach(this.populateTalkData.bind(this))}populateTalkImages(t,e){const o=t.querySelector(".event-image-gallery");if(!o||!e.talkImages)return;o.classList.add("js-with-images"),this.isGalleryIncluded=!0;const n=document.createDocumentFragment(),{folderName:s}=e.talkImages;let i=null;e.talkImages.imageNames.forEach((t=>{const e=document.createElement("a");e.href=`${this.options.STATIC_RESOURCES_URL}/blog/conferences/${s}/${t}`,n.appendChild(e),i||(i=e)}));o.querySelector(".ignoreClass").addEventListener("click",(t=>{t.preventDefault(),i.click()})),o.appendChild(n)}populateTalkData(t){const e=this.forEachTalkEl.cloneNode(!0);for(const o in t)if(t.hasOwnProperty(o)){const n=t[o];e.innerHTML=e.innerHTML.replace(new RegExp(`%%${o}%%`,"g"),n)}const o=s.isTalkUpcoming(t),n=e.querySelector(".show-if-upcoming");n&&(n.hidden=!o);Array.from(e.querySelectorAll(".pre-src")).forEach((t=>{t.setAttribute("src",t.getAttribute("pre-src")),t.removeAttribute("pre-src")})),this.populateTalkImages(e,t),this.talksDataEl.appendChild(e)}onLoad(){this.isGalleryIncluded&&(0,n.loadScript)(`${this.options.SITE_BASE_URL}/js/libs/baguetteBox.min.js`).then((()=>{window.baguetteBox.run(".event-image-gallery",{ignoreClass:"ignoreClass"})}))}}const i=s},(t,e,o)=>{function n(t,e){const o=document.createEvent("HTMLEvents");o.initEvent(e,!0,!0),o.eventName=e,t.dispatchEvent(o)}function s(t,e){return new Promise(((o,n)=>{const s=document.createElement("script");if(s.async=!0,s.src=t,e)for(const t in e)e.hasOwnProperty(t)&&s.setAttribute(t,e[t]);s.onload=o,s.onerror=n,document.head.appendChild(s)}))}function i(t,e){return new Promise(((o,n)=>{const s=document.createElement("link");s.href=t,s.rel="stylesheet",s.type="text/css",e?s.onload=e:(s.onload=o,s.onerror=n),document.head.appendChild(s)}))}o.r(e),o.d(e,{httpProtocol:()=>r,loadCss:()=>i,loadScript:()=>s,triggerEvent:()=>n});const r="https:"===document.location.protocol?"https:":"http:"},(t,e,o)=>{o.r(e),o.d(e,{default:()=>n});class n{constructor(t){this.componentFormEl=t.componentFormEl,this.componentFormAction=this.componentFormEl.action,this.componentFormMethod=this.componentFormEl.method,this.componentFormSubmitEl=this.componentFormEl.querySelector('[type="submit"]'),this.componentFormSubmitEl.innerHTML+='\n            <span class="component__form-icon-wrapper">\n                <span class="component__form-icon component-form-loading">\n                    <span class="loader component__form-loading"></span>\n                </span>\n                <span class="component__form-icon component-form-reject">\n                    <span class="component__form-reject"></span>\n                </span>\n                <span class="component__form-icon component-form-success">\n                    <span class="component__form-success">\n                </span>\n            </span>\n        ',this.classNames={loading:"component-form-loading",reject:"component-form-reject",success:"component-form-success"},this.resetClassNames=()=>{Object.values(this.classNames).forEach((t=>{this.componentFormEl.classList.remove(t)}))},this.addClassName=t=>{this.componentFormEl.classList.add(this.classNames[t])},this.removeClassName=t=>{this.componentFormEl.classList.remove(this.classNames[t])},this.disableForm=()=>{this.componentFormSubmitEl.setAttribute("disabled","")},this.enableForm=()=>{this.componentFormSubmitEl.removeAttribute("disabled")},this.onSubmit=t=>{t.preventDefault(),this.sendForm()},this.onSuccess=()=>{this.disableForm(),this.addClassName("success"),this.onFinally()},this.onReject=()=>{this.enableForm(),this.addClassName("reject"),this.onFinally()},this.onBeforeSend=()=>{this.isSending=!0,this.resetClassNames(),this.addClassName("loading")},this.onFinally=()=>{this.isSending=!1,this.removeClassName("loading")},this.sendForm=()=>{if(this.isSending)return;let t;this.onBeforeSend(),t="post"===this.componentFormMethod?fetch(this.componentFormAction,{method:"post",headers:new Headers({Accept:"application/json"}),body:new FormData(this.componentFormEl)}):fetch(this.componentFormAction),t.then((t=>t.json())).then((t=>{t.ok?this.onSuccess():this.onReject()})).catch(this.onReject)},this.componentFormEl.addEventListener("submit",this.onSubmit)}}},(t,e,o)=>{o.r(e);var n=o(6);const s=localStorage.debug||-1!==window.location.search.indexOf("debug");function i(){s&&console.error(...r("PAGE:",arguments))}function r(t,e){const o=Array.prototype.slice.apply(e);return o.unshift(t),o}if("serviceWorker"in navigator){const t="/service-worker.js";navigator.serviceWorker.register(t).then((e=>{var o;o={"---isDebugEnabled---":s},new Promise(((t,e)=>{const n=new MessageChannel;n.port1.onmessage=function(o){o.data.error?e(o.data.error):(i("An error occured getting a message from SW",o.data.error),t(o.data))},navigator.serviceWorker.controller?navigator.serviceWorker.controller.postMessage(o,[n.port2]):i("Message sending to SW failed: navigator.serviceWorker.controller is",navigator.serviceWorker.controller)})).then((()=>{}),(t=>{i("Message sending to SW failed with error",t)})),function(){s&&console.log(...r("PAGE:",arguments))}(`Service Worker "${t}" registration successful with scope: ${e.scope}`)})).catch((e=>{i(`Registration of Service Worker "${t}" failed with error`,e)}))}"serviceWorker"in navigator&&navigator.serviceWorker.addEventListener("message",(t=>{void 0!==t.data["---notification---"]&&n.default.log(t.data["---notification---"],{addnCls:"humane-libnotify-info",timeout:5e3,clickToClose:!0})}))},(t,e,o)=>{o.r(e),o.d(e,{default:()=>a});var n=window,s=document,i={on:function(t,e,o){"addEventListener"in n?t.addEventListener(e,o,!1):t.attachEvent("on"+e,o)},off:function(t,e,o){"removeEventListener"in n?t.removeEventListener(e,o,!1):t.detachEvent("on"+e,o)},bind:function(t,e){return function(){t.apply(e,arguments)}},isArray:Array.isArray||function(t){return"[object Array]"===Object.prototype.toString.call(t)},config:function(t,e){return null!=t?t:e},transSupport:!1,useFilter:/msie [678]/i.test(navigator.userAgent),_checkTransition:function(){var t=s.createElement("div"),e={webkit:"webkit",Moz:"",O:"o",ms:"MS"};for(var o in e)o+"Transition"in t.style&&(this.vendorPrefix=e[o],this.transSupport=!0)}};i._checkTransition();var r=function(t){t||(t={}),this.queue=[],this.baseCls=t.baseCls||"humane",this.addnCls=t.addnCls||"",this.timeout="timeout"in t?t.timeout:2500,this.waitForMove=t.waitForMove||!1,this.clickToClose=t.clickToClose||!1,this.timeoutAfterMove=t.timeoutAfterMove||!1,this.container=t.container;try{this._setupEl()}catch(t){i.on(n,"load",i.bind(this._setupEl,this))}};r.prototype={constructor:r,_setupEl:function(){var t=s.createElement("div");if(t.style.display="none",!this.container){if(!s.body)throw"document.body is null";this.container=s.body}this.container.appendChild(t),this.el=t,this.removeEvent=i.bind((function(){var t=i.config(this.currentMsg.timeoutAfterMove,this.timeoutAfterMove);t?setTimeout(i.bind(this.remove,this),t):this.remove()}),this),this.transEvent=i.bind(this._afterAnimation,this),this._run()},_afterTimeout:function(){i.config(this.currentMsg.waitForMove,this.waitForMove)?this.removeEventsSet||(i.on(s.body,"mousemove",this.removeEvent),i.on(s.body,"click",this.removeEvent),i.on(s.body,"keypress",this.removeEvent),i.on(s.body,"touchstart",this.removeEvent),this.removeEventsSet=!0):this.remove()},_run:function(){if(!this._animating&&this.queue.length&&this.el){this._animating=!0,this.currentTimer&&(clearTimeout(this.currentTimer),this.currentTimer=null);var t=this.queue.shift();i.config(t.clickToClose,this.clickToClose)&&(i.on(this.el,"click",this.removeEvent),i.on(this.el,"touchstart",this.removeEvent));var e=i.config(t.timeout,this.timeout);e>0&&(this.currentTimer=setTimeout(i.bind(this._afterTimeout,this),e)),i.isArray(t.html)&&(t.html="<ul><li>"+t.html.join("<li>")+"</ul>"),this.el.innerHTML=t.html,this.currentMsg=t,this.el.className=this.baseCls,i.transSupport?(this.el.style.display="block",setTimeout(i.bind(this._showMsg,this),50)):this._showMsg()}},_setOpacity:function(t){if(i.useFilter)try{this.el.filters.item("DXImageTransform.Microsoft.Alpha").Opacity=100*t}catch(t){}else this.el.style.opacity=String(t)},_showMsg:function(){var t=i.config(this.currentMsg.addnCls,this.addnCls);if(i.transSupport)this.el.className=this.baseCls+" "+t+" "+this.baseCls+"-animate";else{var e=0;this.el.className=this.baseCls+" "+t+" "+this.baseCls+"-js-animate",this._setOpacity(0),this.el.style.display="block";var o=this,n=setInterval((function(){e<1?((e+=.1)>1&&(e=1),o._setOpacity(e)):clearInterval(n)}),30)}},_hideMsg:function(){var t=i.config(this.currentMsg.addnCls,this.addnCls);if(i.transSupport)this.el.className=this.baseCls+" "+t,i.on(this.el,i.vendorPrefix?i.vendorPrefix+"TransitionEnd":"transitionend",this.transEvent);else var e=1,o=this,n=setInterval((function(){e>0?((e-=.1)<0&&(e=0),o._setOpacity(e)):(o.el.className=o.baseCls+" "+t,clearInterval(n),o._afterAnimation())}),30)},_afterAnimation:function(){i.transSupport&&i.off(this.el,i.vendorPrefix?i.vendorPrefix+"TransitionEnd":"transitionend",this.transEvent),this.currentMsg.cb&&this.currentMsg.cb(),this.el.style.display="none",this._animating=!1,this._run()},remove:function(t){var e="function"==typeof t?t:null;i.off(s.body,"mousemove",this.removeEvent),i.off(s.body,"click",this.removeEvent),i.off(s.body,"keypress",this.removeEvent),i.off(s.body,"touchstart",this.removeEvent),i.off(this.el,"click",this.removeEvent),i.off(this.el,"touchstart",this.removeEvent),this.removeEventsSet=!1,e&&this.currentMsg&&(this.currentMsg.cb=e),this._animating?this._hideMsg():e&&e()},log:function(t,e,o,n){var s={};if(n)for(var i in n)s[i]=n[i];if("function"==typeof e)o=e;else if(e)for(var i in e)s[i]=e[i];return s.html=t,o&&(s.cb=o),this.queue.push(s),this._run(),this},spawn:function(t){var e=this;return function(o,n,s){return e.log.call(e,o,n,s,t),e}},create:function(t){return new r(t)}};const a=new r},(t,e,o)=>{o.r(e),o.d(e,{default:()=>i});var n=o(3);const s=function(t){this.options=t,this.prepare(),this.load(),this.addJsErrorsTracking()};s.prototype.prepare=function(){function t(){window.dataLayer.push(arguments)}window.dataLayer=window.dataLayer||[],t("js",new Date),t("config",this.options.GOOGLE_ANALYTICS)},s.prototype.load=function(){(0,n.loadScript)(`https://www.googletagmanager.com/gtag/js?id=${this.options.GOOGLE_ANALYTICS}`)},s.prototype.addJsErrorsTracking=function(){window.addEventListener("error",(t=>{const e=t.colno?` line:${t.lineno}, column:${t.colno}`:` line:${t.lineno}`;window._gaq.push(["_trackEvent","JavaScript Error",t.message,`${t.filename+e} -> ${navigator.userAgent}`,0,!0])}))};const i=s},(t,e,o)=>{o.r(e),o.d(e,{default:()=>i});var n=o(3);const s=function(t){this.options=t,this.isLoading=!1,this._onFocus=this.onFocus.bind(this),this.placeholderForm=document.querySelector(".google-custom-search-placeholder"),this.placeholderForm&&(this.placeholderInput=this.placeholderForm.querySelector("input"),this.originalInput=void 0,this.googleOriginalSubmit=void 0,this.bindEvents())};s.prototype.defineOriginalElements=function(){this.originalInput||(this.originalInput=document.querySelector('.gsc-input input[type="text"]')),this.googleOriginalSubmit||(this.googleOriginalSubmit=document.querySelector(".gsc-search-button button"))},s.prototype.runSearch=function(t){this.originalInput.value=t,this.placeholderInput.blur(),window.console.log=function(){},(0,n.triggerEvent)(this.googleOriginalSubmit,"click"),delete console.log},s.prototype.loadSearch=function(){return(0,n.loadScript)(`${n.httpProtocol}//www.google.com/cse/cse.js?cx=${this.options.GOOGLE_SEARCH_ID}`)},s.prototype.onFocus=function(){this.isLoading||(this.isLoading=!0,this.loadSearch().then((()=>{this.isLoading=!1,this.placeholderInput.removeEventListener("focus",this._onFocus),this.bindAdditionalEvents()}),(()=>{this.isLoading=!1})))},s.prototype.bindEvents=function(){this.placeholderInput.addEventListener("focus",this._onFocus),this.placeholderForm.addEventListener("submit",(t=>{t.preventDefault()}))},s.prototype.bindAdditionalEvents=function(){this.placeholderForm.addEventListener("submit",(()=>{this.defineOriginalElements(),this.runSearch(this.placeholderInput.value)}))};const i=s},(t,e,o)=>{o.r(e),o.d(e,{default:()=>i});var n=o(3);const s=function(t){this.options=t,this.loadScripts()};s.prototype.loadScripts=function(){if(document.querySelectorAll("pre > code").length&&(0,n.loadScript)(`${this.options.SITE_BASE_URL}/js/libs/highlight.pack.js`).then((()=>{window.hljs.initHighlightingOnLoad()})),document.querySelectorAll(".caniuse").length&&(0,n.loadScript)(`${this.options.SITE_BASE_URL}/js/libs/caniuse.min.js`),document.querySelectorAll(".codepen").length&&(0,n.loadScript)(`${n.httpProtocol}//codepen.io/assets/embed/ei.js`),document.querySelectorAll(".jsbin-embed").length&&(0,n.loadScript)(`${n.httpProtocol}//static.jsbin.com/js/embed.js`),document.querySelectorAll("#disqus_thread").length){const t=this;window.disqus_config=function(){this.page.url=t.options.PAGE_URL,this.page.identifier=t.options.PAGE_IDENTIFIER},(0,n.loadScript)(`${n.httpProtocol}//${this.options.DISCUSS_ID}.disqus.com/embed.js`)}if(document.querySelectorAll(".post__short-comment-counter").length&&(0,n.loadScript)(`${n.httpProtocol}//${this.options.DISCUSS_ID}.disqus.com/count.js`,{id:"dsq-count-scr"}),document.querySelectorAll(".twitter-widget").length&&(0,n.loadScript)(`${n.httpProtocol}//platform.twitter.com/widgets.js`),document.querySelectorAll(".fb-widget").length){const t=document.createElement("div");t.setAttribute("id","fb-root"),document.body.appendChild(t),(0,n.loadScript)(`${n.httpProtocol}//connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.10`)}document.querySelectorAll(".image-gallery").length&&(0,n.loadScript)(`${this.options.SITE_BASE_URL}/js/libs/baguetteBox.min.js`).then((()=>{window.baguetteBox.run(".image-gallery")}))};const i=s},(t,e,o)=>{o.r(e),o.d(e,{default:()=>i});var n=o(3);const s=function(t){this.options=t,this.options.isDefaultCssEnabled&&(0,n.loadCss)(`${this.options.SITE_BASE_URL}/css/non-critical.css`)};s.prototype.loadCss=function(t){return(0,n.loadCss)(t)};const i=s}],e={};function o(n){var s=e[n];if(void 0!==s)return s.exports;var i=e[n]={exports:{}};return t[n](i,i.exports,o),i.exports}o.d=(t,e)=>{for(var n in e)o.o(e,n)&&!o.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},o.o=(t,e)=>Object.prototype.hasOwnProperty.call(t,e),o.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var n={};(()=>{o.r(n);var t=o(1),e=o(2),s=o(4),i=(o(5),o(7)),r=o(8),a=o(9),l=o(10);document.addEventListener("DOMContentLoaded",(()=>{const o=window.jekyllVariables;delete window.jekyllVariables,o.analytics=new i.default({GOOGLE_ANALYTICS:o.GOOGLE_ANALYTICS}),o.conditionalLoader=new a.default({SITE_BASE_URL:o.SITE_BASE_URL,DISCUSS_ID:o.DISCUSS_ID,PAGE_URL:o.PAGE_URL,PAGE_IDENTIFIER:o.PAGE_IDENTIFIER}),o.customSearch=new r.default({GOOGLE_SEARCH_ID:o.GOOGLE_SEARCH_ID}),o.includeCss=new l.default({isDefaultCssEnabled:o.isDefaultCssEnabled,SITE_BASE_URL:o.SITE_BASE_URL}),o.events=new t.default,Array.from(document.querySelectorAll(".talks-data")).forEach((t=>{new e.default(t,{SITE_BASE_URL:o.SITE_BASE_URL,STATIC_RESOURCES_URL:o.STATIC_RESOURCES_URL})})),Array.from(document.querySelectorAll(".js-component-form")).forEach((t=>{new s.default({componentFormEl:t})}))}))})()})();
//# sourceMappingURL=main.bundled.js.map