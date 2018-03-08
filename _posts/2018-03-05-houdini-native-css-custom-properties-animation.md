---
layout: post
title: Houdini: Native CSS Custom Properties animation 
tags: [JavaScript, CSS]
share_image: https://static.hospodarets.com/img/blog/1511527599607549000.png
share_description: How to animate CSS Custom Properties in a performant and proper way
---

Today CSS Custom Properties (aka CSS variables) are supported in all the major browsers and widely used
(by [Youtube](https://www.linkedin.com/pulse/youtube-switched-css-variables-francesco-rizzi/),
[Chrome/Firefox](https://twitter.com/malyw/status/953625273043472385), Slack, Sketch etc.)
They are performant, easy-to-use, don't require the build step, cascade as other props and... dynamic.

Yes, they are dynamic, so you can easily update them using CSS or JavaScript, but they are not animatable.
This is a big surprise for many, so was for me. It's because the browser has no idea what you'll put into the variable.
But these days Houdini Task Force is coming to the browsers and it brings the way to provide types and animate CSS Custom Properties natively from both CSS and JS. 

<div class="more"></div>

CSS Custom properties intro

In short, CSS Custom Properties are the the CSS properties with an ability to store the custom value which can be reused.
They are prefixed with `--` and are used with the `var()` function:

```css
:root{}
```

What's CSS Custom properties

How to assign them/change
Today well-integrated with many other libraries/frameworks

Why animation is important and how works for other props

Why doesn't work for CSS custom props

Current options (OH):
https://webdesign.tutsplus.com/tutorials/how-to-use-css-variables-for-animation--cms-28868
https://css-tricks.com/making-custom-properties-css-variables-dynamic/
http://valhead.com/2017/07/21/animating-with-css-variables/
(disaadvantages https://twitter.com/jonikorpi/status/865283047368818688 , non eficcient way)

What we need

What we have - the API

Introduce the Types, well known

After we have types- check CSS animation

After- Web Animation API

Examples/demos
https://codepen.io/davidkpiano/pen/aNKxeo - fork https://codepen.io/malyw/pen/oEROQE
https://codepen.io/davidkpiano/pen/wMqXea
https://codepen.io/davidkpiano/pen/96bafd2571721173629c577042ade9b3

Conclusions: powerful 6 lines api, provides types, allows to control the inheritance,
provide initial value
and makes CSS custom Protprties aniumatable for both CSS and Web Animation API