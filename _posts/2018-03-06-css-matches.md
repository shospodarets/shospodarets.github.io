---
layout: post
title: CSS :matches() pseudo-class 
tags: [CSS]
share_image: https://static.hospodarets.com/img/blog/1511527599607549000.png
share_description: Allow to group complex selectors, reducing complexity
---



<div class="more"></div>


https://jonathantneal.github.io/css-db/#selectors-matches-pseudo

https://groups.google.com/a/chromium.org/forum/#!topic/blink-dev/kqD_G4sxfZE
https://github.com/postcss/postcss-selector-matches
https://developer.mozilla.org/en-US/docs/Web/CSS/:matches
https://css-tricks.com/almanac/selectors/m/matches/
https://topaxi.codes/the-matches-css-pseudo-class/

:matches(#top_nav, #search) :matches(a, span){
 font-size: 20px;
}

:matches(h1, h2, h3, h4, h5, h6) > a {
 color: green !important;
}

