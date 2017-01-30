---
layout: post
title: "Native ECMAScript modules: the new features and differences from Webpack modules"
tags: [JavaScript, Browsers]
share_image: https://hospodarets.com/img/blog/1485800018475263000.png
share_description: Differences between ES and bundled modules, abilities to interact with the module scripts, tips, and tricks.
---

In the previous article [Native ECMAScript modules - the first overview]({{ site.baseurl }}/native-ecmascript-modules-the-first-overview)
 I described the history of the JavaScript modules
and the current situation with the native ECMAScript modules implementation:


For now, we have 2 available implementations, which we tried and compared to the bundled module.

The main takeaways, so far, are:

1. To execute a script or load an external file and execute it as a module use `<script type="module">`
2. `.js` extension cannot be omitted in the `import`
3. the modules' scope is not global and `this` doesn’t refer to anything
4. native modules are in the strict mode by default (not needed to provide `'use strict'` anymore)
5. module scripts are deferred by default (like `<script type="text/javascript" defer />`)

In this article, we are going to understand other differences with the bundled modules,
 abilities to interact with the module scripts, how to rewrite Webpack modules to native ES ones
  and other tips and tricks.
 
<div class="more"></div>
 
# Module path

We already know that we have to provide the `.js` extension when we use `import "FILE.js"`.

What about the other rules which are applied to the `import` script path?

It's easy to find out looking into the error which will be triggered
if we [try loading the non-existing script](https://plnkr.co/edit/1KzsCn?p=preview):

```js
import 'non-existing.js';
```

<span class="smaller-img">
    <img src="https://hospodarets.com/img/blog/1482933580648149000.png" />
</span>

Cool, and what about spaces?

As for classic scripts,
any leading or trailing sequences of space characters are removed in both `<script src>` and `import`
([demo](https://plnkr.co/edit/8iZ1FS?p=preview)):


```html
<!--WORKS-->
<script type="module" async src="   ./entry.js    "></script>
```

```js
// WORKS
import utils from "      https://blog.hospodarets.com/demos/native-javascript-modules/js/utils.js    ";
```

You can find more examples reading
[resolve a module specifier](https://html.spec.whatwg.org/multipage/webappapis.html#resolve-a-module-specifier) part of the HTML spec,
here is the examples of the **valid module specifiers** from there:

- https://example.com/apples.js
- http:example.com\pears.mjs *(becomes http://example.com/pears.mjs as step 1 parses with no base URL)*
- //example.com/bananas
- ./strawberries.js.cgi
- ../lychees
- /limes.jsx
- data:text/javascript,export default 'grapes';
- blob:https://whatwg.org/d0360e2f-caee-469f-9a2f-87d5b0456f6f

**Takeaways regarding the modules path:**

- **it may contain leading or trailing spaces**
- **it must be an absolute URL or:**
- **it must start with "/", "./", or "../"**

As I mentioned the absolute URLs, let's check how we can use them.

## Absolute URLs and CORS (Cross-Origin Resource Sharing)

The another difference with the module bundlers is an ability to load files from another domain
(e.g. load modules from CDN).

Let's create a [https://plnkr.co/... demo](https://plnkr.co/edit/YrqP8N?p=preview)
where we load a module script `main-bundled.js`, which in turn
imports and uses a module [https://blog.hospodarets.com/.../utils.js](https://blog.hospodarets.com/demos/native-javascript-modules/js/utils.js)
from another domain.

```html
<!-- https://plnkr.co/….html -->
<script type="module" async src="./main-bundled.js"></script>
```

```js
// https://plnkr.co/….main-bundled.js

// DOES allow CORS (Cross Origin Resource Sharing)
import utils from "https://blog.hospodarets.com/demos/native-javascript-modules/js/utils.js";

utils.alert(`
  JavaScript modules work in this browser:
  https://blog.whatwg.org/js-modules
`);
```

```js
// https://blog.hospodarets.com/.../utils.js
export default {
    alert: (msg) => {
        alert(msg);
    }
};
```

The demo will work the same way as if you loaded the scripts from the same origin.
It's good to being able to provide the absolute URL, as the classic scripts could be loaded from anywhere as well.

Of course, such type of requests follows the [CORS (Cross Origin Resource Sharing)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)
rules.
For instance, in the previous example, we loaded a script from
[https://blog.hospodarets.com/demos/native-javascript-modules/js/utils.js](https://blog.hospodarets.com/demos/native-javascript-modules/js/utils.js) which allows CORS.
It can be easily detected looking into its response headers:

<span class="smaller-img">
    <img src="https://hospodarets.com/img/blog/1485004883973260000.png" />
</span>

We can observe the `access-control-allow-origin: *` header. <br/>
Its format is [`Access-Control-Allow-Origin: <origin> | *`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS#Access-Control-Allow-Origin)
and it specifies a URI that may access the resource.
The wildcard `*` allows any origin to access the resource, so our demo works.

But let's change the `main-bundled.js` to load the `utils.js` from the another place ([demo](https://plnkr.co/edit/yutRmC?p=preview)) :

```js
// https://plnkr.co/….main-bundled.js

// DOESN'T allow CORS (Cross Origin Resource Sharing)
import utils from "https://hospodarets.com/developments/demos/native-javascript-modules/js/utils.js";

utils.alert(`
  JavaScript modules work in this browser:
  https://blog.whatwg.org/js-modules
`);
```

And the demo accidentally stops working, despite you can open <br/>
[https://hospodarets.com/.../native-javascript-modules/js/utils.js](https://hospodarets.com/developments/demos/native-javascript-modules/js/utils.js)  <br/>
in your browser and make sure it's content is the same as the  <br/>
[https://blog.hospodarets.com/.../utils.js](https://blog.hospodarets.com/demos/native-javascript-modules/js/utils.js).

The only one difference in our case is that the second `utils.js` doesn't provide the `access-control-allow-origin` header:

<span class="smaller-img">
    <img src="https://hospodarets.com/img/blog/1485004883983339000.png" />
</span>

which is interpreted by the browser as the reject of any other origins (`https://plnkr.co` for us)
to access the resource, so the demo stops working with the following error:

<span class="smaller-img">
    <img src="https://hospodarets.com/img/blog/1485004669331423000.png" />
</span>

There are some other limitations, which are applied to both module / classic scripts and resources, <br/>
e.g. you cannot import HTTP-based module from HTTPS-based app
(a.k.a. [Mixed Content](https://developers.google.com/web/fundamentals/security/prevent-mixed-content/what-is-mixed-content))
([demo](https://plnkr.co/edit/2lY24i?p=preview)):

```js
// https://plnkr.co/….main-bundled.js

// HTTP insecure import under the app served via HTTPS
import utils from "http://blog.hospodarets.com/demos/native-javascript-modules/js/utils.js";
```

<span class="smaller-img">
    <img src="https://hospodarets.com/img/blog/1485004669339151000.png" />
</span>

**Takeaways:**

- **you can use absolute URLs for the module scripts and for the `import` statements**
- **CORS rules are applied for the modules loaded from other origins**
- **Mixed content (HTTP / HTTPS) rules are applied for the modules as well**


# Script attributes

As for classic scripts, there are many
[attributes which can be used with the `<script type="module">` tag](https://developer.mozilla.org/en/docs/Web/HTML/Element/script).

- The `type` attribute is actually used to set the `"module"`.


- The `src` we use to load the file from the specific URI.

- `defer` is not needed for module scripts, as it's a default behavior

- if you use the `async` attr, the module will be executed as only it's available, without the default deferred behavior,
when the module scripts are executed in the order after the document is parsed,
but before firing [DOMContentLoaded](https://developer.mozilla.org/en-US/docs/Web/Events/DOMContentLoaded)

- `integrity` still can be used
[to verify that fetched files (for example, from a CDN) are delivered without unexpected manipulation](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) 

- with the [`crossorigin` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes),
you can control the exchange of the data which is sent with the CORS requests

- [`nonce`](https://html.spec.whatwg.org/#attr-script-nonce) represents a cryptographic nonce ("number used once") which can be used by
[Content Security Policy](https://w3c.github.io/webappsec-csp/)
 to determine whether or not the script specified by an element will be executed.


**Takeaways**

- **[mostly all the <script/> attributes](https://html.spec.whatwg.org/#the-script-element) can be used with the module scripts
(except some special like [integrity](https://html.spec.whatwg.org/#attr-script-integrity))**


# Detecting script is loaded or cannot be executed because of errors

As only I started using ES modules, the main question I had- how to detect
 if the script was loaded or the error occurred?

According to the spec, if any of the descendants cannot be fetched, script loading is stopped with an error
and script is not executed.
I prepared [a demo](https://plnkr.co/edit/pESeE3?p=preview)
where intentionally missed the `.js` extension for the imported file,
which is required (notice an error in the DevTools console):

<span class="smaller-img">
    <img src="https://hospodarets.com/img/blog/1482926258289304000.png" />
</span>




We already know, that module scripts are deferred by default.
On the other hand, they can be prevented from execution if e.g. script's graph cannot be resolved/loaded.

For such and other cases we need ways to detect the load/error cases.

Let's try to use the classic way of including scripts from JS, modifying a bit the code.
So we want to provide a method, which will take params and insert a script with the options:
- module or a classic one
- with/without `async` attribute
- with/without `defer` attribute

The method will return a Promise which resolves when the script is successfully loaded
and rejected if there will be an error during the script loading:

```js
// utils.js
function insertJs({src, isModule, async, defer}) {
    const script = document.createElement('script');

    if(isModule){
      script.type = 'module';
    } else{
      script.type = 'application/javascript';
    }
    if(async){
      script.setAttribute('async', '');
    }
    if(defer){
      script.setAttribute('defer', '');
    }

    document.head.appendChild(script);

    return new Promise((success, error) => {
        script.onload = success;
        script.onerror = error;
        script.src = src;// start loading the script
    });
}

export {insertJs};
```

Here is an example of it's usage:

```js
import {insertJs} from './utils.js'

// The inserted node will be:
// <script type="module" src="js/module-to-be-inserted.js"></script>
const src = './module-to-be-inserted.js';

insertJs({
  src,
  isModule: true,
  async: true
})
    .then(
        () => {
            alert(`Script "${src}" is successfully executed`);
        },
        (err) => {
            alert(`An error occured during the script "${src}" loading: ${err}`);
        }
    );
```

```js
// module-to-be-inserted.js
alert('I\'m executed');
```

And here is [a demo](https://plnkr.co/edit/4TX8D4?p=preview) of the successfully executed script:

In that case script is executed and then your success callback is executed.

Now let's provide an error to the module which we insert ([demo](https://plnkr.co/edit/QssLh8?p=preview)):

```js
// module-to-be-inserted.js
import 'non-existing.js';

alert('I\'m executed');
```

In that case, we have an error in the console:

<span class="smaller-img">
    <img src="https://hospodarets.com/img/blog/1482933580648149000.png" />
</span>

And our reject callback is executed.



You also will have an error if you try to use `import` \ `export` outside of module scripts ([demo](https://plnkr.co/edit/PqfS09?p=preview)):

<span class="smaller-img">
    <img src="https://hospodarets.com/img/blog/1482934496002073000.png" />
</span>

So now we have a way to include scripts from our code and being
notified if they can/can not be loaded.

**Takeaways**

- **use `onload` and `onerror` events
on the `script`element to detect if a module was executed successfully or cannot be loaded/executed**
- **`import` \ `export` can not be used in classic scripts**

# Module scripts specific moment

## Modules are singletons

According to the spec, doesn't matter how many time you will import the same module, it will be a singleton.
Let try it:

```js
if(window.counter){
  window.counter++;
}else{
  window.counter = 1;
}

alert(`increment.js- window.counter: ${window.counter}`);

const counter = window.counter;

export {counter};
```

After you can import this module as many times as you want.
It will be executed only once and both `window.counter` and exported `counter` will be `1` ([demo](https://plnkr.co/edit/DgZIdm?p=preview))

## Imports are hoisted

As the functions in JavaScript, `import`s are hoisted.
You can simply provide them first in the file or always just know about this behavior.

That's why [the following code works](https://plnkr.co/edit/ZZblF1?p=preview):
```js
alert(`main-bundled.js- counter: ${counter}`);

import {counter} from './increment.js';
```

And the order of code execution for the following is ([demo](https://plnkr.co/edit/IsZDRT?p=preview)):
- module1
- module2
- module3
- code1
- code2

 ```js
import './module1.js';

alert('code1');

import module2 from './module2.js';

alert('code2');

import module3 from './module3.js';
 ```

## Imports and exports must happen at the top level

Because the structure of ES modules is static, they cannot import/export something conditionally.
This is widely used for the loading/execution optimizations.

You also cannot wrap them in `try{}catch(){}` or something similar.

Here is a [demo](https://plnkr.co/edit/XEe2y4?p=preview):

```js
if(Math.random()>0.5){
  import './module1.js'; // SyntaxError: Unexpected keyword 'import'
}
```

```js
const import2 = (import './main2.js'); // SyntaxError
```

```js
try{
  import './module3.js'; // SyntaxError: Unexpected keyword 'import'
}catch(err){
  console.error(err);
}
```

```js
const moduleNumber = 4;

import module4 from `module${moduleNumber}`; // SyntaxError: Unexpected token
```

**Takeaways:**

- **modules are singletons**
- **imports are hoisted**
- **imports and exports must happen at the top level**
- **the import statement is static (you cannot determine programmatically what to load)**

# Detect module scripts are supported

Looking into the current situation when browsers just started to add the ES modules,
we also need a clear way to detect if the browser supports them.

To do it, the first ideas may be around:

```js
const modulesSupported = typeof exports !== undefined;
const modulesSupported2 = typeof import !== undefined;
```

Both these things don't work, as import/exports are designed to be used only for modules functionality.
These examples will throw "Syntax errors".

Even worse, import/export are not supposed to be working in classic scripts,
which are not loaded as `type="module"`.

So we need a different way to detect it.

### Detect ES modules are supported by the browser

We have the functionality to detect if classic/module script was loaded,
listening `onload/onerror` events on them.
We also know that the `script` element provided with unsupported 
`type` element will be just ignored by the browser.
It means, we can include `<script type="module">` and know,
that if it was loaded, then the browser supports the modules system.

Of course, we don't want to create a separate script in our project manually just for such a check.
For such reasons, we have [`Blob()`](https://developer.mozilla.org/en/docs/Web/API/Blob) API to create an empty script
and provide a proper MIME for it.
To assign this blob to the script `src` element we will use the [`URL.createObjectURL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL)

The another problem is, that browser just ignores unsupported script types,
which means `type="module"` is ignored in the browser without its support without any triggering onload/onerror events.
To cover that, let's just reject our loading Promise after a timeout.

And finally, after our Promise fulfilled we have to do some cleaning:
  remove the script from the DOM and revoke unneeded Object URL from the memory.

Let's summarize everything [in the code](https://plnkr.co/edit/s4GWHIVDOzIr8O8Q1Fas?p=preview):

```js
function checkJsModulesSupport() {
  // create an empty ES module
  const scriptAsBlob = new Blob([''], {
    type: 'application/javascript'
  });
  const srcObjectURL = URL.createObjectURL(scriptAsBlob);

  // insert the ES module and listen events on it
  const script = document.createElement('script');
  script.type = 'module';
  document.head.appendChild(script);

  // return the loading script Promise
  return new Promise((resolve, reject) => {
    // HELPERS
    let isFulfilled = false;

    function triggerResolve() {
      if (isFulfilled) return;
      isFulfilled = true;
      
      resolve();
      onFulfill();
    }

    function triggerReject() {
      if (isFulfilled) return;
      isFulfilled = true;

      reject();
      onFulfill();
    }

    function onFulfill() {
      // cleaning
      URL.revokeObjectURL(srcObjectURL);
      script.parentNode.removeChild(script)
    }

    // EVENTS
    script.onload = triggerResolve;
    script.onerror = triggerReject;
    setTimeout(triggerReject, 100); // reject on timeout

    // start loading the script
    script.src = srcObjectURL;
  });
};

checkJsModulesSupport().then(
  () => {
    console.log('ES modules ARE supported');
  },
  () => {
    console.log('ES modules are NOT supported');
  }
);
```

### Detect the current script is executed as a module

Cool, so far we can detect if the browser supports the  module script.
But what if we want to know at some point, how is the current script is executed: in the classic or module mode?

First of all, for a long while, we can just have a link to the script which is currently processed
using [document.currentScript](https://developer.mozilla.org/en-US/docs/Web/API/Document/currentScript).

So the ideal case could be to check the module `type`:

```js
const isModuleScript = document.currentScript.type === 'module';
```

but `currentScript` just [doesn't work in the module scripts](https://github.com/whatwg/html/issues/1013)
([demo](https://plnkr.co/edit/dKElmtRwMmHXynoF0CFF?p=preview)).

Of course, you can check on the top level of the module script,
if `this` refers to the global object,
 which state it's not a module script:

```js
const isNotModuleScript = this !== undefined;
```

but be careful using this method, as `this`
could be e.g. [bound](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_objects/Function/bind),
so the result depends, as mentioned, where you'll do this check.


## Rewriting Webpack to native ES modules

It's time to rewrite some Webpack module(s) to native to
compare the syntax and make sure the functionality still works.

Let's take a simple example which uses the popular [`lodash` library](https://lodash.com/).

Ok, so we use aliases and Webpack features to simplify the `import` syntax.
For example, we do:

```js
import _ from 'lodash'; 
```

and Webpack looks into your `node_modules`, finds `lodash`
there and automatically imports `index.js` file.
Which in turn actually requires `lodash.js` content, where is the library code.

Also, you can import specific functions doing the following:

```js
import map from 'lodash/map';
```

So Webpack finds `node_modules/lodash/map.js` and imports it.
Handy and short!

Let's try to port the following code, which works well with Webpack,
 to start working using ES native modules:

```js
// main-bundled.js
import _ from 'lodash'; 

console.log('lodash version:', _.VERSION); // e.g. 4.17.4

import map from 'lodash/map';

console.log(
  _.map([
    { 'user': 'barney' },
    { 'user': 'fred' }
  ], 'user')
); // ['barney', 'fred']
```

First of all, `lodash` simply doesn't work with ES modules.
If you look into it's source, you'll see the CommonJS approach used:

```js
// lodash/map.js
var arrayMap = require('./_arrayMap');
//...
module.exports = map;
```

Even the distributed [`lodash/lodash.js`](https://raw.githubusercontent.com/lodash/lodash/4.17.4/dist/lodash.js)
supports AMD, CommonJS and classic scripts, but not `<script type="module" />`

Quick research will show, that the lodash authors created a special project for this-
[`lodash-es`](https://github.com/lodash/lodash/tree/es) which contains the lodash library + modules exported as ES modules.

If we check the code we will see it's ES modules based:

```js
// lodash-es/map.js
import arrayMap from './_arrayMap.js';
//...
export default map;
```

After we have working lodash version,
we can continue to porting the code.

Here is the common structure of our app (which we will port):

<span class="smaller-img">
    <img src="https://hospodarets.com/img/blog/1485613338392978000.png" />
</span>

I intentionally put `lodash-es` in the `dist_node_modules` instead of `node_modules`.
In most of the projects, the `node_modules` folder is out of the Git and
is not a part of the distribution code.
When we work with ES modules, we will actually need the files to be loaded at runtime, instead
of the processing during the build time.

You can find [the code on Github](https://github.com/malyw/malyw.github.io/tree/master/demos/native-ecmascript-modules-aliases).
`main-bundle.js` will be processed by Webpack 2 to `dist/app.bundle.js`, on the other hand,
`js/main-native.js` will stay a ES module and should be processed by the browser
together with dependencies.

Let's start. We already know that **we cannot avoid adding the file extension for
the native modules**, so first of all, we need to add that.

```js
// 1) main-native.js DOESN'T WORK
import lodash from 'lodash-es.js'; 
import map from 'lodash-es/map.js';
```

Secondary, the module **must be an absolute URL or it must start with "/", "./", or "../"**.

Oh, it's paintful. For our structure we have to do the following:

```js
// 2) main-native.js WORKS, USES RELATIVE URLS
import _ from '../dist_node_modules/lodash-es/lodash.js';
import map from '../dist_node_modules/lodash-es/map.js';
```

As after a while we can start having more complex ECMAScript modules
file structure, we can have relative URLs with a very long values,
so better to switch to use the base URL, 
which you can easily replace in all the files:
 
```js
// 2) main-native.js WORKS, CAN BE REUSED/COPIED IN ANY ES MODULE IN THE PROJECT
import _ from '/dist_node_modules/lodash-es/lodash.js';
import map from '/dist_node_modules/lodash-es/map.js';
```

Don't forget, usually this URL points to the location
 where your main `index.html` is placed 
 and the value of the [`<base>` HTML tag](https://developer.mozilla.org/en/docs/Web/HTML/Element/base)
 doesn't affect the `import` behavior.


Here is the working demo and the code:

```js
console.log('----- Native JavaScript modules -----');

import _ from '/demos/native-ecmascript-modules-aliases/dist_node_modules/lodash-es/lodash.js';

console.log(`lodash version: ${_.VERSION}`); // e.g. 4.17.4

import map from '/demos/native-ecmascript-modules-aliases/dist_node_modules/lodash-es/map.js';

console.log(
    map([
        {'user': 'barney'},
        {'user': 'fred'}
    ], 'user')
); // ['barney', 'fred']
```

<div>
    <a href="{{ site.baseurl }}/demos/native-ecmascript-modules-aliases/"
       target="_blank"
       class="btn-pulse">
        <span class="wrapper">
            <span class="inner"></span>
        </span>
        <span class="text">Demo</span>
    </a>
</div>

In the end of this chapter I will mention, that to
import the module scripts and dependencies the browser
make GET requests (as for other resources).

In our case, browser loads all the `lodash` modules dependencies,
which results in about 600 files imported:

<span class="smaller-img">
    <img src="https://hospodarets.com/img/blog/1485799103543987000.png" />
</span>

As you may guess, it's a very bad idea to load
so many files if you don't have [HTTP/2](https://en.wikipedia.org/wiki/HTTP/2) enabled,
which is a good practice now and a reasonable requirement 
if you decide to start using ES modules.


Now you know how to rewrite the Webpack modules to the native ECMAScript ones
and how to use the whole `lodash` library with ES modules,
as the authors ported it.

**Takeaways:**

- **bundled modules can be rewritten to ES native modules
and popular libraries already started to provide compatible versions**
- **HTTPS/2 is preferred to be used with ESModules**


## Use ES modules code with fallback to classic

Let's use all our knowledge to create a useful script
and apply it for example to our [lodash demo]({{ site.baseurl }}/demos/native-ecmascript-modules-aliases/index.html).

We will check if the browser supports ES modules (using `checkJsModulesSupport()`) and reflect that for the user.
If it does, we will load the `main-native.js` file for them.
Otherwise, we'll include the Webpack-bundled JS file (using `insertJS()`).

To make the example work for all browsers, let's provide the API,
where you can provide a script with attributes, which will point what should be loaded in case if the browser
supports the modules, and what if it doesn't.
Also optionally we want to have an ability to require the global class,
to reflect is the ES modules are supported (e.g. on the UI). 

Something like this:

![alt](https://hospodarets.com/img/blog/1485637349913043000.png)

And here is the code to make it all work, using the previous examples discussed in this article:

```js
checkJsModulesSupport().then(
    () => {
        // insert module script
        insertJs({
            src: currentScript.getAttribute('es'),
            isModule: true
        });
        // global class
        if (isAddGlobalClassSet) {
            document.documentElement.classList.add(esModulesSupportedClass);
        }
    },
    () => {
        // insert classic script
        insertJs({
            src: currentScript.getAttribute('js')
        });
        // global class
        if (isAddGlobalClassSet) {
            document.documentElement.classList.add(esModulesNotSupportedClass);
        }
    }
);
```

I posted this script to the [`es-modules-utils` on Github](https://github.com/malyw/es-modules-utils).

Currently there is a [discussion to add the native `nomodule` or `nosupport`
attributes to the `script`](https://github.com/whatwg/html/pull/2261)
which will provide the easier native ability to fallback
(thanks to [@rauschma](https://twitter.com/rauschma) for pointing this out).

## Conclusions

We took a look into the practical differences between the ES modules and classic scripts.
Learned how to detect if the module script is loaded or the error occurred.
Now we know how to use ES modules and check simple 3rd party libraries examples.

Also, we have a useful [`es-modules-utils` on Github](https://github.com/malyw/es-modules-utils)
which can be used to conditionally include ES modules or classic script
(depending on the browser support) and give a feedback to the UI for the user.

The next step can be checking how the ServiceWorker/Worker world will be changed with
 the ES modules and what other new abilities are coming to the JavaScript
 in terms of modules.
 
 All this I plan to describe in the next articles. Stay tuned.