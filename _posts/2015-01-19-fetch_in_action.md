---
layout: post
title: JavaScript Fetch API in action
tags: [Javascript, Javascript API]
share_image: http://i.imgur.com/ghk4Ptj.png
share_description: JavaScript Fetch API usage examples, how to use fetch() natively in JS
---

<blockquote>
    In short, Fetch API- it's a new Promise- based standard for doing AJAX requests.
</blockquote>

Syntax for XHR was provided more then 10 years ago (XMLHttpRequest2 - about 4 years ago).<br>
Many things changed, we got HTML5, CSS3, also close to start using EcmaScript 6.<br>
From jQuery Deferred, $q and Native JavaScript Promises people became familiar and like promises in JS.<br>
It's time for new laconic API to do AJAX-requests and interact with them.<br>
And time is come!

<div class="more"></div>



<h2 id="before">Before</h2>

Before we had XMLHttpRequest syntax. E.g. to get JSON usually we had to provide the following methods in some utilities file:<br>
(simple demo without listening <mark>onerror</mark> etc. events and manual <mark>timeout</mark> checking)<br>

{% highlight javascript %}
/*--- Send Ajax ---*/
var MAX_XHR_WAITING_TIME = 5000;// in ms

var sendAjax = function (params) {
    var xhr = new XMLHttpRequest(),
            url = params.cache ? params.url + '?' + new Date().getTime() : params.url,
            timer = setTimeout(function () {// if xhr won't finish after timeout-> trigger fail
                xhr.abort();
                params.error && params.error();
                params.complete && params.complete();
            }, MAX_XHR_WAITING_TIME);
    xhr.open(params.type, url);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            clearTimeout(timer);
            if (xhr.status === 200 || xhr.status === 0) {// 0 when files are loaded locally (e.g., cordova/phonegap app.)
                params.success && params.success(xhr.responseText);
                params.complete && params.complete();
            } else {
                params.error && params.error(xhr.responseText);
                params.complete && params.complete();
            }
        }
    };
    params.beforeSend && params.beforeSend(xhr);
    xhr.send();
};

/*--- Get JSON by url ---*/
var getJSON = function (params) {
    sendAjax({
        type: 'get',
        url: params.url,
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Accept', 'application/json, text/javascript');
        },
        success: function (res) {
            params.success && params.success(JSON.parse(res));
        },
        error: params.error,
        complete: params.complete,
        cache: true
    });
};

// INVOKE
getJSON({
    url: 'https://api.github.com/users/malyw',
    success: onSuccess,
    error: onError,
    complete: onComplete
});
{% endhighlight %}

<span data-height="250" data-theme-id="178" data-slug-hash="rayEBR" data-user="malyw" data-default-tab="result" class="codepen"></span>

So, previously we usually sent callbacks as params.<br>
Let's figure out how to do the same using Fetch API.



<h2 id="with-fetch-api">With Fetch API</h2>

<h3>Fetch</h3>

First, we fetch a resource:

{% highlight javascript %}
var url = 'https://api.github.com/users/malyw';
fetch(url);
{% endhighlight %}

Fetching resource returns promise with response data (in case of any is fetched/response gotten) or error (otherwise).

<h3>Processing status</h3>

Promise will be resolved successufully in case of any server responce, even 404 etc.<br>
So (as in case with XHR) we need to handle it:

{% highlight javascript %}
var processStatus = function (response) {
    // status "0" to handle local files fetching (e.g. Cordova/Phonegap etc.)
    if (response.status === 200 || response.status === 0) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(new Error(response.statusText))
    }
};

fetch(url)
    .then(processStatus)
    // the following code added for example only
    .then()
    .catch();
{% endhighlight %}

If there is response with status "200" or "0"- will be returned resolved promise,<br>
which means, we can use <mark>.then().then()</mark> promise syntax.<br>
In other case <mark>.catch()</mark> will be invoked.

<h3>Parse JSON</h3>

Also there is a method <mark>json()</mark> to proceed the response.<br>
Knowing it let's add parsing:

{% highlight javascript %}
var parseJson = function (response) {
    return response.json();
};

fetch(url)
    .then(parseJson);
{% endhighlight %}

This code gives promise in which (in case of success) will be returned parsed JSON data.

<h3>Setting options</h3>

Nice, going further. We need to set "get" as <mark>method</mark> for doing our request and proper "Accept" <mark>header</mark>.<br>
There is a <mark>cache</mark> option but so far let's use manual cache busting.<br>
It can be done passing them in second argument (options) to <mark>fetch()</mark>:

{% highlight javascript %}
fetch(url, {
    method: 'get',
    headers: {
        'Accept': 'application/json'
    }
});
{% endhighlight %}

<h3>Adding waiting timeout</h3>

When <mark>fetch()</mark> takes more then some period of time (10-30 seconds)-<br>
it's good idea to define that it was unsuccessful (depends on circumstances).<br>
And here the problems start- there is NOT <a href="https://github.com/whatwg/fetch/issues/20">timeout</a> option.
So we need to wrap <mark>fetch()</mark> promise to be able to reject it when timeout is reached.
It adds complexity to our code but provides more flexibility.
So let's imagine so far (code will be provided below) that we have some <mark>wrappedFetch</mark> Promise-like object with ability to trigger <mark>.reject()</mark> on it:

{% highlight javascript %}
var MAX_WAITING_TIME = 5000;// in ms

var timeoutId = setTimeout(function () {
    wrappedFetch.reject(new Error('Load timeout for resource: ' + params.url));// reject on timeout
}, MAX_WAITING_TIME);

return wrappedFetch.promise// getting clear promise from wrapped
    .then(function (response) {
        clearTimeout(timeoutId);
        return response;
    });
{% endhighlight %}

<h3>ALL TOGETHER</h3>

{% highlight javascript %}
/* @returns {wrapped Promise} with .resolve/.reject/.catch methods */
// It goes against Promise concept to not have external access to .resolve/.reject methods, but provides more flexibility
var getWrappedPromise = function () {
    var wrappedPromise = {},
            promise = new Promise(function (resolve, reject) {
                wrappedPromise.resolve = resolve;
                wrappedPromise.reject = reject;
            });
    wrappedPromise.then = promise.then.bind(promise);
    wrappedPromise.catch = promise.catch.bind(promise);
    wrappedPromise.promise = promise;// e.g. if you want to provide somewhere only promise, without .resolve/.reject/.catch methods
    return wrappedPromise;
};

/* @returns {wrapped Promise} with .resolve/.reject/.catch methods */
var getWrappedFetch = function () {
    var wrappedPromise = getWrappedPromise();
    var args = Array.prototype.slice.call(arguments);// arguments to Array

    fetch.apply(null, args)// calling original fetch() method
        .then(function (response) {
            wrappedPromise.resolve(response);
        }, function (error) {
            wrappedPromise.reject(error);
        })
        .catch(function (error) {
            wrappedPromise.catch(error);
        });
    return wrappedPromise;
};

/**
 * Fetch JSON by url
 * @param { {
 *  url: {String},
 *  [cacheBusting]: {Boolean}
 * } } params
 * @returns {Promise}
 */
var getJSON = function (params) {
    var wrappedFetch = getWrappedFetch(
        params.cacheBusting ? params.url + '?' + new Date().getTime() : params.url,
        {
            method: 'get',// optional, "GET" is default value
            headers: {
                'Accept': 'application/json'
            }
        });

    var timeoutId = setTimeout(function () {
        wrappedFetch.reject(new Error('Load timeout for resource: ' + params.url));// reject on timeout
    }, MAX_WAITING_TIME);

    return wrappedFetch.promise// getting clear promise from wrapped
        .then(function (response) {
            clearTimeout(timeoutId);
            return response;
        })
        .then(processStatus)
        .then(parseJson);
};

/*--- TEST  --*/
var url = 'https://api.github.com/users/malyw';
var onComplete = function () {
    console.log('I\'m invoked in any case after success/error');
};

getJSON({
    url: url,
    cacheBusting: true
}).then(function (data) {// on success
    console.log('JSON parsed successfully!');
    console.log(data);
    onComplete(data);
}, function (error) {// on reject
    console.error('An error occured!');
    console.error(error.message ? error.message : error);
    onComplete(error);
});
{% endhighlight %}

<span data-height="250" data-theme-id="178" data-slug-hash="zxZVxV" data-user="malyw" data-default-tab="result" class="codepen"></span>

There is NOT <mark>.always()</mark> or <mark>.complete()</mark> for Native JavaScript promises,<br>
that's why you have to add  <mark>onComplete()</mark> callback to the end of success and reject callbacks.<br>

But with coming of Fetch API we pass callbacks in Promise-style, which is common way nowadays.



<h2 id="fetch-api-for-modules-loading">Using Fetch API for loading CommonJS/AMD modules</h2>

Generally fetch syntax is close to AMD- based RequireJS style- you provide path to your module and then use it.
So idea about providing modules loader system based on it looks very reasonable.


<h3 id="amd-modules-loader">Fetch API-based AMD modules loader</h3>

To create loader for AMD style, we need to process all required modules together.<br>
First- fetch them, then- get their texts, invoke them and provide modules as promise result.<br>
Let's create loader for simple AMD cases and test it with <mark>jQuery</mark> and <mark>d3.js</mark> libraries:<br>

{% highlight javascript %}
/*--- AMD-specific ---*/
var loadedModules = [];

var define = function () {
    var args = Array.prototype.slice.apply(arguments), factory, module;
    if (typeof args[0] === 'object') {// FOR AMD SYNTAX LIKE: define(object);
        module = args[0];
    } else {// FOR AMD SYNTAX LIKE: define('module', [], function(){});
        factory = args.pop();
        module = factory();
    }
    loadedModules.push(module);

    return module;
}
define.amd = true;// indicates AMD API

/*--- For fetch processing ---*/
// Fetches all provided urls
var argsToFetch = function (args) {
    var result = [];
    Array.prototype.slice.apply(args).forEach(function (url) {
        result.push(fetch(url));
    });
    return result;
};

// Converts fetch responses to text and stores urls
var responsesToText = function (responses) {
    var scriptTexts = [], urls = [];

    responses.forEach(function (response) {
        scriptTexts.push(response.text());// will convert to text
        urls.push(response.url);
    });

    return Promise.all(scriptTexts)// waiting converting to text
        .then(function (scriptTexts) {
            return {
                scriptTexts: scriptTexts,// processing scripts texts
                urls: urls// adding urls
            }
        });
};

// Gets AMD modules from loaded scripts
var getModulesFromScripts = function (data) {
    var scriptTexts = data.scriptTexts;// all loaded scripts
    var urls = data.urls;// all loaded urls

    var imports = [];
    scriptTexts.forEach(function (scriptText, i) {
        var length = loadedModules.length;// storing loaded modules length
        eval('(function (define) { ' + scriptText + '\n//*/\n})(define);\n//@ sourceURL=' + urls[i]);// evaluates loaded script
        if (loadedModules.length === length + 1) {// checking it was loaded exactly one module
            imports.push(
                    Promise.resolve(loadedModules.pop())// resolve with the last loaded module
            )
        } else {
            imports.push(
                    Promise.reject(new Error(urls[i] + ' doesn\'t provide exactly one valid AMD module'))
            )
        }

    });
    return Promise.all(imports);// wrapping in common promise
};

// COMMON REQUIRE FUNCTION
/**
 * Fetches scripts by URLs and provides AMD modules from them
 * @param {...String} arguments -  URLs of scripts to be fetched
 * @returns {Array} Array of loaded AMD modules
 */
function require(/* 'URL1', 'URL2', ... */) {
    return Promise.all(argsToFetch(arguments))// fetch all required modules
        .then(responsesToText)// parse results to text
        .then(getModulesFromScripts)// getting required modules from scripts
        .catch(function (error) {// catching errors
            console.error(error.message);
        });
}

/*--- TEST  --*/
var jqueryUrl = 'https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js';
var d3Url = 'http://cdnjs.cloudflare.com/ajax/libs/d3/3.4.5/d3.min.js';
require(jqueryUrl, d3Url)
    .then(function (loadedModules) {// "then" accepts only one param
        var jQuery = loadedModules[0];
        var d3 = loadedModules[1];
        /* checking loaded loadedModules */
        console.log('Loaded jQuery version: ' + jQuery.fn.jquery);
        console.log('Loaded d3 version: ' + d3.version);
        /* checking global scope */
        console.log('jQuery in global scope: ' + window.jQuery);// NOT undefined - surprise, jQuery sets global variables even in AMD
        // http://bugs.jquery.com/ticket/7102#comment:10
        // https://github.com/jquery/jquery/pull/557

        console.log('d3 in global scope: ' + window.d3);// undefined - as expected
    });
{% endhighlight %}

<span data-height="250" data-theme-id="178" data-slug-hash="ogZrLx" data-user="malyw" data-default-tab="result" class="codepen"></span>


<h3 id="commonjs-modules-loader">Fetch API-based asynchronous CommonJS modules loader</h3>

<mark>fetch()</mark> can invoke onSuccess/onReject callbacks only asynchronously.<br>
That's why result loader call is similar to AMD syntax.

{% highlight javascript %}
var require = function (url) {
    return fetch(url)
        .then(function (response) {// converts response to text
            return response.text();
        })
        .then(function (scriptText) {// evaluates loaded script and gets exports
            var mod = {exports: {}};
            eval('(function (module, exports) { ' + scriptText + '\n//*/\n})(mod, mod.exports);\n//@ sourceURL=' + url);
            return mod.exports;
        })
        .catch(function (error) {
            console.error(error.message);
        });
}

require('https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js').then(function (exports) {
    // for jQuery: exports === jQuery
    console.log('Loaded jQuery version: ' + exports.fn.jquery);// show fetched jQuery version
    console.log('jQuery in global scope: ' + window.jQuery);// undefined - nothing were added to global scope
});
{% endhighlight %}

<span data-height="250" data-theme-id="178" data-slug-hash="wBJLWy" data-user="malyw" data-default-tab="result" class="codepen"></span>



<h2 id="options-and-methods">Options and methods</h2>

<h3 id="options">Options</h3>

As we already saw, in second argument for <mark>fetch()</mark> we can set request <mark>headers</mark> and <mark>method</mark> for requesting resorce.
As well we can set <mark>mode</mark>, <mark>body</mark>, <mark>credentials</mark>, <mark>cache</mark>, <mark>context</mark>, <mark>referrer</mark>.<br>
E.g. to send POST request to the service for JSON validation:<br>

{% highlight javascript %}
var serialize = function (data) {
    return Object.keys(data).map(function (keyName) {
        return encodeURIComponent(keyName) + '=' + encodeURIComponent(data[keyName])
    }).join('&');
};

function validateJSON(url, json) {
    json = typeof json === 'object' ? JSON.stringify(json) : json;
    return fetch(url, {
        method: 'post',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: serialize({json: json})
    })
    .then(function (response) {
        return response.json();// parse json
    })
    .then(function (data) {
        if (data.validate) {
            console.log('String: "' + json + '" is VALID JSON');
        } else {
            console.warn('String: "' + json + '" is NOT valid JSON');
            console.warn(data.error);
        }
    })
    .catch(function (error) {
        console.error('An error occured');
        console.error(error.message);
    });
}

var jsonTestUrl = 'http://validate.jsontest.com/';
validateJSON(jsonTestUrl, '{');// not valid JSON- the closing "}" is missed
validateJSON(jsonTestUrl, {hello: 'world'});// JS object-> valid JSON is generated
{% endhighlight %}

<span data-height="250" data-theme-id="178" data-slug-hash="jEmNjx" data-user="malyw" data-default-tab="result" class="codepen"></span>

<h3 id="methods">Methods</h3>

We used <mark>json()</mark> and <mark>text()</mark> to proceed response.<br>
There are also <mark>formData()</mark>, <mark>arrayBuffer()</mark>, <mark>blob()</mark> methods for it.<br>
So there is possibility to work with form data and files too.<br>
Next example will show how to fetch image from one resource and upload it to another:<br>

{% highlight javascript %}
var downloadFile = function (url) {
    return fetch(url)
            .then(processStatus)
            .then(parseBlob);
};

function uploadImageToImgur(blob) {
    var formData = new FormData();
    formData.append('type', 'file');
    formData.append('image', blob);

    return fetch('https://api.imgur.com/3/upload.json', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            Authorization: 'Client-ID dc708f3823b7756'// imgur specific
        },
        body: formData
    })
        .then(processStatus)
        .then(parseJson);
}

// --- ACTION ---
var sourceImageUrl = 'https://lh4.googleusercontent.com/-d_O-phk2MoA/VLxXocjkT4I/AAAAAAAAFbE/lsSk997pBVQ/w600-h700-no/make-fetch-happen-small.png';
console.log('Started downloading image from <a href="' + sourceImageUrl + '">google picasa url</a>');

downloadFile(sourceImageUrl)// download file from one resource
    .then(uploadImageToImgur)// upload it to another
    .then(function (data) {
        console.log('Image successfully uploaded to <a href="http://imgur.com/' + data.data.id + '">imgur.com url</a>');
        console.log('<img src="' + data.data.link + '"/>');// for demo
    })
    .catch(function (error) {
        console.error(error.message ? error.message : error);
    });
{% endhighlight %}

<span data-height="440" data-theme-id="178" data-slug-hash="emWmBz" data-user="malyw" data-default-tab="result" class="codepen"></span>

In getting JSON example <mark>headers</mark> option was set before fetching resource to show JSON is expected as answer.<br>
But we also can work with response headers. Let's check that server answers with JSON as expected:<br>

{% highlight javascript %}
function loadJSON(url) {
    fetch(url)
            .then(function (response) {
                if (response.headers.get("content-type").indexOf("application/json") !== -1) {// checking response header
                    return response.json();
                } else {
                    throw new TypeError('Response from "' + url + '" has unexpected "content-type"');
                }
            })
            .then(function (data) {
                console.log('JSON from "' + url + '" parsed successfully!');
                console.log(data);
            })
            .catch(function (error) {
                console.error(error.message);
            });
}

loadJSON('https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js');// throws a TypeError
loadJSON('https://api.github.com/users/malyw');// is parsed normally
{% endhighlight %}

<span data-height="250" data-theme-id="178" data-slug-hash="XJRrNY" data-user="malyw" data-default-tab="result" class="codepen"></span>



<h2 id="browser-support">Browser support</h2>

Fetch API is available in Chrome Canary after enabling "Experimental Web Platform features" flag at <mark>chrome://flags</mark> page<br>
Support is announced in Firefox Nightly and <a href="https://status.modern.ie/fetchapi">under consideration for IE</a><br>
With Fetch and Promise Polyfills it works wonderful in all browsers up-to IE9 (but IE9 doesn't support Cross-origin fetching, which works in others).<br>



<h2 id="links-and-demo">Useful links and demo</h2>

<ul>
    <li>
        <a href="https://fetch.spec.whatwg.org/">Fetch API spec from WHATWG</a>
    </li>
    <li>
        <a href="https://github.com/github/fetch">Fetch Polyfill</a>
    </li>
    <li>
        <a href="https://github.com/jakearchibald/es6-promise">Promise Polyfill</a>
    </li>
</ul>

Fetching HTML from one JS Bin to another:<br>

<a class="jsbin-embed" href="http://jsbin.com/payaxo/latest/embed?output&height=400px"></a>

<h2 id="limitations">Limitations</h2>

<ul>
    <li>
        Promises don't have <mark>finally</mark>/<mark>always</mark> method- there is a <a href="https://github.com/matthew-andrews/Promise.prototype.finally">workaround</a>
    </li>
    <li>
        There is neither <a href="https://github.com/github/fetch/issues/33">abort</a> method nor a <a href="https://github.com/whatwg/fetch/issues/20">timeout</a> property for fetch()
    </li>
    <li>
        <mark>fetch()</mark> (as <a href="https://promisesaplus.com/">Promise</a>- based standard) doesn't have ability to provide <mark>onProgress()</mark> callback- so you cannot process a response by chunks
    </li>
    <li>
        Haven't found clear info about doing <mark>synchronous</mark> fetching<br>
        but, most of all, it's not provided, because even in such case <mark>onSuccess</mark> and <mark>onReject</mark> callbacks
        would be invoked on the next tick- <a href="https://promisesaplus.com/#point-67">due to Promise nature</a>.
    </li>
</ul>

:end: