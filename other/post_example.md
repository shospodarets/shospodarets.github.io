---
layout: post
title: TITLE
tags: [Tag1, Tag2]
---

<h2>Head</h2>

<h3>Small head</h3>

Paragraph <mark>inline code</mark>

<a href="http://malyw.github.io/css-filters/"
   target="_blank"
   class="btn-pulse">
    <span class="wrapper">
        <span class="inner"></span>
    </span>
    <span class="text">Demo</span>
</a>

<div class="more"></div>

{% highlight css %}
/* SYNTAX */
.apply-filters {
    [vendor-prefix]filter: <filter-function> [<filter-function>]* | none
}
{% endhighlight %}

<iframe
        src="http://malyw.github.io/css-filters/?src=http://gospodarets.com&filters=%7B%22brightness%22:0.9,%22hue-rotate%22:180,%22invert%22:1%7D&hideContentExcept=.iframe-wrapper&overflowHeight=350"
        frameborder="0"
        allowtransparency="true" allowfullscreen="true"
        style="width: 100%; overflow: hidden;"
        scrolling="no"
        height="350"
        >
</iframe>

{% gist malyw/fade28c8d398a3a86334 %}

<div class="caniuse" data-feature="css-filters"></div>