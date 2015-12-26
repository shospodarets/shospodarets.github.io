---
layout: post
title: Highlight an element with page fading on pure CSS
tags: [CSS]
---

Sometimes to highlight something we need to fade entire page except element/part which we want to focus.

<h3>Examples</h3>

<ul>
    <li>
        When you search any text in Safari browser- it highlights only matching parts and fades other areas of the page
    </li>
    <li>
        Plugins like <a target="_blank" href="https://github.com/zzarcon/focusable">Focusable</a> (JavaScript based) with a <a target="_blank" href="http://zzarcon.github.io/focusable/">nice demo to show this effect in action</a>
    </li>
</ul>

<div class="more"></div>

<h3>Usual way to implement</h3>

Usually people provide such effect using 4 "fade" divs technique:

<img width="350" src="https://i.imgur.com/sjaiFLR.png" alt=""/>

<ol>
    <li>
        Page without highlighting
    </li>
    <li>
        Highlight with 4 black faders
    </li>
    <li>
        Color faders to visualize them
    </li>
</ol>

This technique has many problems like:
<ul>
    <li>
        You cannot use <mark>border-radius</mark> for highlighted area. It's possible to implement but it will add complexity to implementation.
    </li>
    <li>
        Have to use or write JavaScript plugins for adding these 4 faders and place them in correct places around highlight element.
        Also there should be event listeners on page resize to change faders size.
    </li>
    <li>
        Possible problems with appearing and position of page scroll- to show faders or before they change size (after window resize event).
    </li>
</ul>


<h3>Proposed technique (without JavaScript)</h3>

<h4>Fade the page except element area</h4>

To avoid using faders elements and provide shadow from element- of course,
the best to use <mark>box-shadow</mark> which was provided exactly for such things.

{% highlight css %}
.highlight {
    box-shadow: 0 0 0 99999px rgba(0, 0, 0, .8);
}
{% endhighlight %}

For old browsers (like IE < 9) you can use <a href="http://css3pie.com/">CSS3 Pie</a> or old IE <mark>filter</mark> property

To move element to front on Z-axis (over all others) you can provide:

{% highlight css %}
.highlight {
    position: relative;
    z-index: 9999;
}
{% endhighlight %}

<h4>Prevent any user actions outside of highlighted area</h4>

Usually when spotlight focus is set to some element- it's needed to stop interaction with parts under fader.
E.g. prevent default browser behavior when user clicks links, submit forms etc.
In short- we need to emulate behavior when our fader is at top of all the page elements (except highlighted area).

In that it's possible to use <mark>pointer-events</mark> property which
allows to control under what circumstances a particular graphic element can become the target of mouse/touch events.
It means, you can prevent any user actions for any part of your application.

{% highlight css %}
body.highlight-is-active {
    pointer-events:  none;
}

.highlight {
    pointer-events:  auto;
}
{% endhighlight %}

<mark>Pointer-events</mark> (for HTML) has not bad browser support, if you need to provide it in old browsers-
use <a href="https://github.com/kmewhort/pointer_events_polyfill/blob/master/pointer_events_polyfill.js">Pointer Events Polyfill</a>

<div class="caniuse" data-feature="pointer-events"></div>


<h4>Demo</h4>

Finally wrapping all together:

<ol>
    <li>
        Pure CSS solution without any listeners of page resize or problems with scroll
    </li>
    <li>
        Working with <mark>border-radius</mark> for highlighting area
    </li>
    <li>
        Effects for fader appearing using css <mark>transition</mark>
    </li>
    <li>
        Disabling highlighting on click out of highlighted area
    </li>
</ol>

<span data-height="330" data-theme-id="178" data-slug-hash="zxKJQQ" data-user="malyw" data-default-tab="result" class="codepen"></span>