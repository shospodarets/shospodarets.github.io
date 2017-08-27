---
layout: post
title: "Native ECMAScript modules: nomodule attribute for the migration"
tags: [JavaScript, Browsers]
share_image: https://hospodarets.com/img/blog/1488739109376005000.png
share_description: nomodule script attribute provides an easy way to start migrating to ES modules till they are supported in all the browsers
---

In one of my previous articles
[Native ECMAScript modules: the new features and differences from Webpack modules]({{ site.baseurl }}/native-ecmascript-modules-new-features#detect-es-modules-are-supported-by-the-browser)
we attempted to detect if the browser supported ES modules.
We needed this to determine either, to execute a bundled (classic) file or a script which uses the native ECMAScript module features.

We managed to achieve this, but in reality how it was achieved isn't ideal. The community have since come together to propose an alternative, the `nomodule` script attribute.

<div class="more"></div>

# The problem

The [initial proposal](https://github.com/whatwg/html/issues/1442)
started from a discussion and the requests from
Google and Facebook developers how to start the migration to ES modules (ESM).
The idea is that you create two scripts:

1. one is bundled with `import`/ `export` statements resolved.

2. and the second one, which expects the ES modules support in the browser.

Depending on the ESM support browser executes one of them.
The case is straightforward and should be used for the progressive enhancements etc.

To execute a script as a module when in the browser, we need to add
 the `type="module"` attribute to it. <br>
 Browsers without ESM just ignore these scripts, as the `type="module"` attribute is unknown for them.

**But currently there is no boolean flag or an easy way to detect if the browser supports
 the ES modules**.<br>
So, how do we make new browsers with ESM support ignore the additional scripts
which shoudn't be executed?

As was mentioned, I [proposed]({{ site.baseurl }}/native-ecmascript-modules-new-features#detect-es-modules-are-supported-by-the-browser)
to create an empty ES script and include it to the browser using the Blob() API.
Then we just have to wait till it's loaded. If the script is loaded successfully, the browser supports ES modules, otherwise wait for a period of time, reject and load the alternative script...
Not the best solution.

Another solution is to provide a module script like:

```html
<script type="module">
    window.__browserHasModules = true;
</script>
```

but we know the ECMAScript modules are deferred, so we have to defer all other scripts.
Also not good.

What we need is a standardized way to inform the browser, that some script shouldn't be executed if ESM is supported.

# The `nomodule` proposal

[Domenic](https://github.com/domenic) raised [the discussion, which resulted in the proposal](https://github.com/whatwg/html/issues/1442).

There were two main ideas

* the `<nomodule/>` tag:

```html
<script type="module" src="app.js"></script>
<nomodule>
  <script defer src="bundle.js"></script>
</nomodule>
```

* or `nomodule` attribute:

```html
<script type="module" src="app.js"></script>
<script nomodule defer src="bundle.js"></script>
```

As the attribute doesn't require any additional implementation in the existing browsers,
it was decided to stay with it
([there were many other reasons](https://github.com/whatwg/html/pull/2261#discussion_r95828411)).

# How to use

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

<p>
    <a class="sh-btn" flavor="text-width"
       href="https://plnkr.co/edit/uzl2q2ZGPXy7MTIJLZF3?p=preview"
       target="_blank">
        Demo
    </a>
</p>

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

The utility loads the bundled script or the ECMAScript module,
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

<p>
    <a class="sh-btn" flavor="text-width"
       href="{{ site.baseurl }}/es-modules-utils/demo/"
       target="_blank">
        Demo
    </a>
</p>

# The current state of support

The `nomodule` attribute is already [added to the HTML standard](https://html.spec.whatwg.org/multipage/scripting.html#attr-script-nomodule)
and [described in the specification with the examples](https://html.spec.whatwg.org/multipage/scripting.html#script-nomodule-example).

Also thanks to WebKit, `nomodules` tests are added to the [web-platform-tests](https://github.com/w3c/web-platform-tests/pull/4611),
which give browser projects confidence that they are shipping software that is compatible with other implementations

The good news is, that the attribute is "supported" without any additions in all browsers without ES Modules support,
as they just execute the scripts without doing anything with the unknown attributes.

Currently `nomodule` has been [implemented](https://bugs.webkit.org/show_bug.cgi?id=166987)
in [`Safari` Technology preview](https://webkit.org/blog/7423/release-notes-for-safari-technology-preview-24/), but as the proposal came from Google initially, there is no doubt it will be delivered together with ES modules support in `Chrome` ([the issue](https://bugs.chromium.org/p/chromium/issues/detail?id=681050)).

In addition, it's just been confirmed and should [arrive soon in `Microsoft EDGE`](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/10525830/).
`Firefox` also [has an issue for this](https://bugzilla.mozilla.org/show_bug.cgi?id=1330900).

# Conclusions

The idea is that when any browser ships native ES Module support in their stable version, they will also support the `nomodule` attribute (according to the spec).

This gives us the ability to include two versions of our scripts in HTML:
*  classic - bundled with bundlers/transpilers
*  the original ES Modules

As browsers start supporting the ECMAScript modules, all the functionality will
automatically switch to use the ESM scripts.