---
layout: post
title: "Prerequisites- Houdini: Native CSS Custom Properties animation" 
tags: [JavaScript, CSS]
share_image: https://static.hospodarets.com/img/blog/1522589821703.png
share_description: "How to animate CSS Custom Properties in a performant and proper way"
---

Today CSS Custom Properties (aka CSS variables) are supported in all the major browsers and widely used
(by [Youtube](https://www.linkedin.com/pulse/youtube-switched-css-variables-francesco-rizzi/),
[Chrome/Firefox](https://twitter.com/malyw/status/953625273043472385), Slack, Sketch etc.)
They easy-to-use, don't require the build step, cascade as other props and... are **dynamic**.

Because they are dynamic, so you can easily update them using CSS or JavaScript, but they **are not animatable by default**.
This is a big surprise for many, so was for me. It's because the browser has no idea what you'll put into the variable.
But these days Houdini Task Force is coming to the browsers and it brings the way to provide types and animate CSS Custom Properties natively from both CSS and JS. 

<div class="more"></div>

# CSS Houdini

The best may be to start from the Hoidini Task Force quick description.
It's a collaborative effort between the many companies, developers of which actively participate in the
Web speicifcations development, discussions and implementations.
Here you can find [the common page](https://github.com/w3c/css-houdini-drafts/wiki) with the mailing lists, ideas/plans, meeting notes etc.

On the other hand, the name is also used for the wide number of [specification](https://github.com/w3c/css-houdini-drafts/wiki/specs) produced and cared by the group.
Usually I use the following slide to represent this:

![alt](https://static.hospodarets.com/img/blog/1522598337933.png)

The main objective for the group is "to jointly develop features that explain the “magic” of Styling and Layout on the web".
They usually represent their mission as the "exposing of the previously hidden browser rendering stages for the developers",
which will allow to use the power of the browser engine programmatically,

To dive deeper you can take a look a [Houdini: Demystifying the Future of CSS](https://www.youtube.com/watch?v=sE3ttkP15f8) video.

CSS custom Properties were proposed by the Houdini group, to solve the need of CSS variables and on the other hand,
the need of storages to pass the data in a performant way from JavaScript/CSS to the browser.

# CSS Custom properties quick intro

In short, CSS Custom Properties are the the CSS properties with an ability to store the custom values which can be reused.
They are prefixed with `--` and are used with the `var()` function:

```css
:root{
    --primary-color: #f00;
    --base-font-size: 15px;
}

body{
    color: var(--primary-color);
    font-size: var(--base-font-size);
}
```

You can store any valid CSS values in Custom Properties and use them in most of the places around your application.
They work inside `calc()` expressions, follow the CSS cascade, are inherited and can be easily read/assigned from JS:

```js
const rootEl = document.documentElement;

const rootStyles = getComputedStyle(rootEl);

// WRITE
document.documentElement.style.setProperty('--primary-color', '#fff');

// READ
const varValue = rootStyles.getPropertyValue('--primary-color').trim(); // #fff
```

## Integrations in libraries/frameworks and Web apps

CSS Custom Properties have [100% major browsers support](https://caniuse.com/#feat=css-variables):

<span class="smaller-img">
    <img src="https://static.hospodarets.com/img/blog/1522592774309.png" />
</span>

And are used in many popular Web apps, like Medium.com, Youtube and others:

![alt](https://static.hospodarets.com/img/blog/1522593372040.gif)

They speed up the development, provide easy options to customize the visual styles and layout on the fly and
are well integrated in many libraries today.

For instance, they are supported in [jQuery](https://twitter.com/malyw/status/853961519532576769),
[styled-componentns](https://github.com/styled-components/styled-components/issues/108),
 [React](https://twitter.com/malyw/status/884191703493742592) and many others:

<span class="smaller-img">
    <img src="https://static.hospodarets.com/img/blog/1522593987033.png" />
</span>

# Limitations

Support for Custom Properties was added to all the browsers in less than a year.
And there are constraints of such a quick integration- they implemented mostly as the storage for the values.
You can put any valid CSS value (read as "mostly anything") and reuse this afterwords.

But browsers doesn't care what you put in them and mostly not validate the values strictly.
If you compare to the variables in most of the other languages, they are usually typed, which leads
to the value contraints and ranges. This allows to validate the values on assigment and apply performance optimizations.
But all this not applicable to CSS Custom Properties by default.

Here are the excerpts from the ["CSS Custom Properties" specification](https://www.w3.org/TR/css-variables-1/):

![alt](https://static.hospodarets.com/img/blog/1522594757824.png)

![alt](https://static.hospodarets.com/img/blog/1522594757858.png)

It confirms mentioned above, that by default CSS Custom Properties:

* Not typed
* Not animatable
* Less performant than the native ones, as some optimizations cannot be applied

## Possible objections answers and the benefits

Here you can object, that

<blockquote>
    CSS never was expected to be the programming language in the wide sense of the word,
    and mostly is expected to solve the styling issues. Isn't it?
</blockquote>

And my answer will be the ask to check the current state of the Web development,
where we have the complex CSS in JS solutions, CSS pre- and post-processors,
full browser support for CSS3+ features, Flexbox, powerful Grid layout and now even the CSS Custom Properties.

We cannot deny anymore CSS has grew up to the powerful part of the Web,
greatly integrated with the Browser rendering engine and it's time for the next steps
to add more "science" and best practices based on the current community needs.

And here you may come to the next one-

<blockquote>
    ok, possibly we need more performant Custom Properties,
    but looks like for that we need to invent the types for all the existing properties?
</blockquote>

This can be answered even more simpler- since the time CSS is created (1996), all the properties have types,
they are described in the specifications, follow specific constraints and behavior (e.g. inheritance),
which allowed to apply the mentioned performance optimizations in the browsers.

Here is the proof in the [Level one Cascading Style Sheets specification](https://www.w3.org/TR/CSS1/) from 17 Dec 1996:

![alt](https://static.hospodarets.com/img/blog/1522595701689.png)

<blockquote>
    Cool, we need types and inheritance for the performance.
    But why on earth the animation is needed?
</blockquote>

Just take a look around you- you see the light, you don't see the light particles/feel the waves but just know,
the sky is blue and the Guinness is ruby red (even, if you thought it was black, [it's actually ruby red ☘️](https://www.huffingtonpost.com/entry/guinness-is-red-not-black_us_58b705c7e4b023018c6c3822))

You also don't hear the notes, but rather here a wonderful melody and like the song.

Coming back to the Web, we got used to have the ability to animate the colors, layout changes and notify the user about the changes
with the transitions, animations and motion design solutions.

## Types and inheritance

Let's together check a few CSS Properties to understand we already are aware anduse all these types and terms,
despite never knew the type names. E.g. simple case is `text-align`: it takes dedicated values only like `left | right | center` and is not inherited etc.
Ok, more complex case `padding-top`- we can put there length-values like pixels, ems, but also percents.
From other examples, we know about the color-types like HEX, RGBA, HSL. And what about urls, functions like calc(),
yes, we know all this.

On the other hand, the specification always sets the inheritance for the property, which is clear.
E.g. `color` is inherited, but `margin` is not, 


Looks like we already know all this why we cannot register CSS Properties by ourselfs?

`CSS.registerProperty()` API we are going to discuss further exactly allows you this- register own properties,
set the type and available values for them and if it should be inherited or now.

## Benefits

Of course, one of the most obvious reasons for considering the typed Cusotm Properties is performance.
Here is the performance recording I took some time ago from the application, where the Custom Prop was reused more than a few sounds
times for the test, and the script was changing it on timeout. Two recording reflect the performance of the
CSS Custom Properties before and after "CSS.registerProperty()" usage:

![alt](https://static.hospodarets.com/img/blog/1522599055627.png)

Except having the performance optimizations, transitions and animations for Custom Properties,
the addition of types will provide whole the bunch of other possible benefits.

For example, the IDE and Browser will know the property type (as for classic ones),
possible values you can assign there, validate the ranges. On top of that the linters can be applied.
And finally, one of the best things may be the quick and easy debugging/development right in the browser Developer Tools.

Here is the examples of such behavior for classic CSS properties, but with the new abilities similar is expected
for Custom Properties:

![alt](https://static.hospodarets.com/img/blog/1522597575638.png)

# CSS.registerProperty() or "6 lines of magic"

Finally, straight to the code!

![alt](https://static.hospodarets.com/img/blog/1522589821703.png)

ToDo


?# Browser support? 

Houdini supported yet



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
and makes CSS custom Properties aniumatable for both CSS and Web Animation API

Related Links:
* [CSS Houdini- from CSS Custom Properties to JavaScript Worklets and back](https://slides.com/malyw/houdini-short/live#/9)
* [CSS Houdini- Video](https://www.youtube.com/watch?v=66E0_QFnmlA)
