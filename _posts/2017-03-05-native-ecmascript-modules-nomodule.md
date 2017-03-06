---
layout: post
title: "Native ECMAScript modules: nomodule attribute for the migration"
tags: [JavaScript, Browsers]
share_image: https://hospodarets.com/img/blog/1488739109376005000.png
share_description: nomodule script attribute provides an easy way to start migrating to ES modules till they are supported in all the browsers
draft: true
---

In one of the previous articles
[Native ECMAScript modules: the new features and differences from Webpack modules]({{ site.baseurl }}/https://blog.hospodarets.com/native-ecmascript-modules-new-features#detect-es-modules-are-supported-by-the-browser)
we tried to find a way to detect if the browser supports ES modules.
We needed that to have an ability to execute a bundled (classic) file or the script which uses the native ECMAScript module features
 depending on that.
 
Using smart techniques and workarounds it was achieved, but since that time the community
realized this and others are not the best ways, and the appropriate way was proposed: <br>
`nomodule` script attribute.

<div class="more"></div>

## The problem

The [initial proposal](https://github.com/whatwg/html/issues/1442)
started from a discussion and the requests from
Google and Facebook developers how to start the migration to ES modules (ESM).
The idea is:

* you create two versions of a file,
one is bundled with `import`/ `export` resolved, and the second one
which expects the ES modules support from the browser to work.

* depending on the ESM support browser executes one of them.

The case is straightforward and should be used for the progressive enhancements etc.

We know, to execute a script as a module in the browser we need to add
 a `type="module"` attribute to it. Browsers without ESM just ignore
 such scripts, as such a `type` is unknown for them.
 
But, there is no boolean flag or an easy way to detect, if the browser supports
 the ES modules.
So, how to make new browsers, with ESM support to ignore the scripts,
which intentionally are not supposed to be executed in such a case?

As was mentioned, I [proposed](({{ site.baseurl }}/native-ecmascript-modules-new-features#detect-es-modules-are-supported-by-the-browser))
to create an empty ES script and include it to the browser using the Blob() API.
After that we have to wait till it's loaded- in this case, the browser supports ES modules.
Otherwise, the reject appeared to be after some time interval.
Not the best solution.

Another solution is to provide a module script like:

```html
<script type="module">
window.__browserHasModules = true;
</script>
```

but we know the ECMAScript modules are deferred, so we have to defer all other scripts.
Also not so good.
So we needed the standardized way to state for the browser, that some script just shouldn't be executed if ESM is supported.

## The `nomodule` proposal

[Domenic](https://github.com/domenic) raised [the discussion, which resulted in the proposal](https://github.com/whatwg/html/issues/1442).

There were two main ideas- introducing the `<nomodule/>` tag:

```html
<script type="module" src="app.js"></script>
<nomodule>
  <script defer src="bundle.js"></script>
</nomodule>
```

or `nomodule` attribute:

```html
<script type="module" src="app.js"></script>
<script nomodule defer src="bundle.js"></script>
```

As the attribute didn't require any additional implementation in the existing browsers,
it was decided to stay with it
([there were many other reasons](https://github.com/whatwg/html/pull/2261#discussion_r95828411)).

## How to use

The way to use the attribute is described in the following code:

```html
<!--
    Only the browsers WITH ECMAScript modules (aka ES6 modules)
    support will execute the following script
    -->
    <script type="module" src="./ecmascript-modules-main.js"></script>

    <!--
    Only the browsers WITHOUT ES modules support
    will execute the following script.
    Browsers WITH ES modules support will ignore it.
    -->
    <script nomodule src="./bundled-main.js"></script>
```

where `ecmascript-modules-main.js` is the entry file in your app,
and `bundled-main.js` is its bundled version.

Here is a simple demo with inline scripts, which you can run in your browser:

```html
<script type="module">
  alert('The browser DOES support ES modules');
</script>
<script nomodule>
  alert('The browser DOES NOT support ES modules');
</script>
```

<div>
    <a href="https://plnkr.co/edit/uzl2q2ZGPXy7MTIJLZF3?p=preview"
       target="_blank"
       class="btn-pulse">
        <span class="wrapper">
            <span class="inner"></span>
        </span>
        <span class="text">Demo</span>
    </a>
</div>

You can also consider the [es-modules-utils](https://github.com/malyw/es-modules-utils)
way, which also adds a couple additions on top of that:

```html
<script
            module="./ecmascript-modules-main.js"
            no-module="./bundled-main.js"

            add-global-class
            add-global-variable

            src="es-modules-utils/no-module-fallback.js"
    >
    </script>
```

As you see, the utility script loads the bundled script or the ECMAScript module,
depending on the browser support (`nomodule` is used under the hood)
and provides two additional abilities, covered by the boolean attributes:

- `add-global-class`: enables adding the `<html class="esmodules">` if ES modules are supported, `<html class="no-esmodules">` otherwise (can be used e.g. to show some animation till the ES modules graph is loaded and executed)
- `add-global-variable`: which enables adding the global Boolean variable `window.esmodules=true/false` (can be used e.g. to decide which method to use to include new scripts inside the JavaScript)

For example, if your module graph is quite extensive and is loaded for the first time,
it may take some time until the files and graph are loaded and executed.
To show the loader and hide it after the JS is executed you can use
 [es-modules-utils](https://github.com/malyw/es-modules-utils) and the following approach:

```html
<style>
    .no-esmodules .loader,
    .esmodules .loader {
        display: none;
    }
</style>

<img class="loader" src="./loader.gif">
```

<div>
    <a href="https://blog.hospodarets.com/es-modules-utils/demo/"
       target="_blank"
       class="btn-pulse">
        <span class="wrapper">
            <span class="inner"></span>
        </span>
        <span class="text">Demo</span>
    </a>
</div>

## The current state of support

The `nomodule` attribute is already [added to the HTML standard](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-nomodule)
and [described in the specification with the examples](https://html.spec.whatwg.org/multipage/scripting.html#script-nomodule-example).

Also thanks to WebKit, nomodules tests are added to the [web-platform-tests](https://github.com/w3c/web-platform-tests/pull/4611), which
gives browser projects confidence that they are shipping software that is compatible with other implementations

The good news are, that the attribute is "supported" without any additions in all the browsers without ES Modules support out of the box,
at they just execute the scripts with it without doing any differences with others 😉

Let's go back serious, as `nomodule` is already [landed](https://bugs.webkit.org/show_bug.cgi?id=166987)
in [`Safari` Technology preview](https://webkit.org/blog/7423/release-notes-for-safari-technology-preview-24/)

As the proposal came from the Google side, there is no doubt it will be delivered together with ES modules support in `Chrome` ([the issue](https://bugs.chromium.org/p/chromium/issues/detail?id=681050)).

It's just confirmed and should [arrive soon in `Microsoft EDGE`](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/10525830/).
`Firefox` also [has an issue for this](https://bugzilla.mozilla.org/show_bug.cgi?id=1330900).

## Conclusions

The idea is, that all the browsers, which will ship the ES Modules in their stable versions,
also will support the `nomodule` attribute (according to the spec),
which is well aligned with the current browsers efforts.

This gives us the ability to provide two versions of the scripts in our applications:
classic, bundled with bundlers/transpilers and the original ES Modules,
adding them both in HTML.

As only the browser starts supporting the ESM, all the functionality
automatically will be switched to use the ES Modules scripts.