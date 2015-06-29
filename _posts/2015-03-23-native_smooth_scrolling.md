---
layout: post
title: Native Smooth Scroll behavior
tags: [CSS, JavaScript]
share_image: http://i.imgur.com/a6xtXnx.png
share_description: Using CSSOM smooth scroll API in JavaScript and CSS
---

Frequently we want to add scrolling to some part of the page or box.
E.g. to highlight something or just scroll to an anchor.

To provide better UX and feeling usually smooth scrolling is used.

Previously to implement it we had to use plugins like ["jQuery.scrollTo"](https://github.com/flesler/jquery.scrollTo)
or similar [solutions](https://css-tricks.com/snippets/jquery/smooth-scrolling/).

But dreams came true- there is a specification for [native smooth scroll behavior API](http://dev.w3.org/csswg/cssom-view/).

<a href="{{ site.baseurl }}/demos/smooth-scroll-api/"
   target="_blank"
   class="btn-pulse">
    <span class="wrapper">
        <span class="inner"></span>
    </span>
    <span class="text">Demo</span>
</a>

<div class="more"></div>

## API

First of all- you can provide smooth scroll behavior in two ways- from JavaScript or CSS.

### JavaScript

New API is quite easy to use, just instead of:

```javascript
window.scrollBy(left, top);
window.scrollTo(left, top);
```

use:

```javascript
window.scrollBy({
    "behavior": "smooth",
    "left": left,
    "top": top
});
window.scrollTo({
    "behavior": "smooth",
    "left": left,
    "top": top
});
```

`behavior` value can be either `smooth` or `auto` (default scroll behavior).

You can also use it in `scrollIntoViewOptions`
for [Element.scrollIntoView()](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView#Parameters)

### CSS

For CSS things are even more better. Just add one line of the code:

```css
body{
    scroll-behavior: smooth;
}
```

Again, values for `scroll-behavior` are `smooth` or `auto` (default).

If you add smooth scrolling to the `body`-
browser automatically will apply this effect during scrolling to the anchor links
(e.g. `#fragment` hash part in url automatically triggers page scrolling on load to the link with the `id="fragment"`).

### Common

Of course you can use this API not only for global objects (`window`, `
<body/>`) but also for some specific elements.

## Implementation

To check if smooth scroll is supported in the browser use:

```javascript
var isSmoothScrollSupported = 'scrollBehavior' in document.documentElement.style;
```

Then you can just provide polyfill with downgrade from the new API to some plugin or the old way scrolling without any effects:

```javascript
var options = {
    "behavior": "smooth",
    "left": left,
    "top": top
};

if (isSmoothScrollSupported) {
    // Native smooth scrolling
    window.scrollTo(options);
} else if (window.jQuery && jQuery.scrollTo) {
    // jQuery scrollTo (you can change to you plugin/realization)
    $(window).scrollTo(options.top, options.left);
} else {
    // Old way scrolling without effects
    window.scrollTo(options.left, options.top);
}
```

<a href="{{ site.baseurl }}/demos/smooth-scroll-api/"
   target="_blank"
   class="btn-pulse">
    <span class="wrapper">
        <span class="inner"></span>
    </span>
    <span class="text">Demo</span>
</a>

<div class="text-center">
    <a href="{{ site.baseurl }}/demos/smooth-scroll-api/">
        <img src="http://i.imgur.com/6P5ikUL.gif" alt=""/>
    </a>
</div>

## Browser Support

API is already supported in desktop [Firefox](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior) out of the box and
in [Chrome](https://www.chromestatus.com/feature/5812155903377408) under the `Enable experimental Web Platform features` flag on the `chrome://flags/` page.

In Chrome up to 42 only JS part of the API is supported. In 43+ (currently it is [Canary](https://www.google.com/chrome/browser/canary.html) and [Dev Channel](https://www.chromium.org/getting-involved/dev-channel)) - both CSS and JS.

Smooth scrolling to the anchors currently works only in Firefox. For Chrome it's [in development](https://www.chromestatus.com/features/5812155903377408).

## Profits
1. It's a native solution. You can change browser scroll behavior with only one line of CSS!
2. API provides a way to avoid JavaScript scroll animation- just say to the browser where to scroll instead of playing with `scrollTop\scrollLeft`.
3. Because of the browser optimizations smooth scroll works smoothly (as you see it is in its name :smiley:) and fast.