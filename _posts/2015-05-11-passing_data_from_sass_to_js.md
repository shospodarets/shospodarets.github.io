---
layout: post
title: Passing data from Sass to JavaScript&#58; sass-to-js
tags: [Sass, CSS, JavaScript, jQuery, AngularJS]
share_image: https://i.imgur.com/e2Npbpf.gif
share_description: How to pass a data from Sass (via CSS) / CSS to JavaScript ( js ) using sass-to-js
---

## The idea

Once I needed to add component to show controls like the following:
[![control](https://i.imgur.com/5w2pnut.png)]({{ site.baseurl }}/demos/data-from-sass-to-js/)

The number of sections in it had to be configurable. To do it usually you can add two config variables: one in Sass, one in JavaScript.

But I wanted to have config only in one place and reuse it in the second. That's how the idea to pass data from Sass to JavaScript came to me.

<a href="{{ site.baseurl }}/demos/data-from-sass-to-js/"
   target="_blank"
   class="btn-pulse">
    <span class="wrapper">
        <span class="inner"></span>
    </span>
    <span class="text">Demo</span>
</a>

<div class="more"></div>

## How

First problem to solve was- how to pass data between CSS and JavaScript?

The answer is simple- you can read CSS values from JS- so simply write you data there.

Next question- to which CSS properties you can write plain text and they can be read correctly from JS?

For it we have "font-family" and "content" (of course, there are couple other techniques, like using media queries for it, but I prefer simple CSS properties).

Last- which format to use?

It's the simplest- JSON, which is JS-based and can be parsed without any problems.

## Implementation

### Sass to JSON in CSS

I'm big fan of Sass. When I started to implement [sass-to-js](https://github.com/malyw/sass-to-js) converter
I didn't expect it would be possible to implement using only Sass and JavaScript.
I expected the need to use some Grunt/Gulp build additions to convert Sass to JSON in CSS.

But I was very surprised to find out Sass provides [`type-of`](http://sass-lang.com/documentation/Sass/Script/Functions.html#type_of-instance_method)
method which is the key for parsing Sass values to JSON.

Most of other work was really straightforward: check the type, convert to proper value if needed, and format as JSON.

Formatting part includes:

1. Adding curly braces for JSON object and objects inside it
2. Square braces for lists
3. Comma symbols between items
4. Formatting string/color/bool and null values for proper CSS output

There was only one big surprise- `type-of(100px)` returns `number`.
But the easy way to check if it's really "JavaScript number" was found: simply multiply to "0" and check if the result is plaint "0".
In that case in Sass:

```scss
* @debug (100px*0) == 0; // 0px == 0 ===> false
* @debug (100*0) == 0; // 0 == 0 ===> true
```

As result `sass-to-js` function was provided, which can take any Sass maps variables and convert
them to JSON. Example:

Sass:

```scss
$mediaBreakPoints: (
  small-min: 768px,
  extra-small: 767px,
  medium-min: 992px,
  small-max: 991px,
  large-min: 1200px,
  medium-max: 1199px
);

.breakpoints-data{
  font-family: sassToJs($mediaBreakPoints);
}
```

CSS output:

```css
.breakpoints-data {
  font-family: '{"small-min":"768px","extra-small":"767px","medium-min":"992px","small-max":"991px","large-min":"1200px","medium-max":"1199px"}';
}
```

Implemented [sass-to-js Sass module] just gives `sassToJs()` function to convert your Sass maps into JSON:

```scss
.breakpoints-data{
  font-family: sassToJs($mediaBreakPoints);
}
```

Also you can convert other Sass values (list/string/color/bool/null) using it:

```scss
$value: 0 1em 5px 4rem;

.testEl:after {
  content: sassToJs("value", $value);
}
```

And CSS output for it is:

```css
.testEl:after {
  content: '{"value":[0,"1em","5px","4rem"]}';
}
```

## JavaScript from JSON in CSS

The next part- to read provided JSON in CSS from JavaScript.

For that we can use JS `getComputedStyle` function which also provides ability
to read CSS values from pseudo-elements:

```js
var cssValue =
    window.getComputedStyle(element).getPropertyValue(cssProperty);
// or
var cssValue =
    window.getComputedStyle(element, pseudoEl).getPropertyValue(cssProperty);
```

After we read JSON from CSS property, we have to convert it to JS object.

Before we use JSON parsing we need to normalize taken CSS value because browser might add additional output to it.
For that we can just use the following RegExp:

```js
var normalizedCssValue =
    cssValue.replace(/^['"]+|\s+|\\|(;\s?})+|['"]$/g, '');
```

The last one- just parse the obtained value as JSON:

```js
var resultObj = JSON.parse(normalizedCssValue);
```

To do all this work I implemented [sass-to-js JavaScript module](https://github.com/malyw/sass-to-js/blob/master/js/src/sass-to-js.js)
which provides `sassToJs()` function to do the above work using simple API:

```js
var resultObj = sassToJs(
    element,
    {
        pseudoEl:":before",
        cssProperty: "content"
    }
);
```

## Additions

### AngularJS/jQuery

I use AngularJS and/or jQuery in many of my projects, so it was decided to add helpers to use `sass-to-js` easily in them:

AngularJS:

```js
angular.element(htmlEl)
    .sassToJs({pseudoEl: '::before', cssProperty: 'content'});
```

jQuery:

```js
$(htmlEl)
    .sassToJs({pseudoEl: '::before', cssProperty: 'content'});
```

### Codepen

Usually to make quick demos or for code testing I use the wonderful [Codepen](https://codepen.io/).
It has easy way to reuse your Pens as [External Resources](http://blog.codepen.io/2013/05/28/new-feature-use-pens-as-external-resources/).

[sass-to-js](https://github.com/malyw/sass-to-js) code was just added as basis in [sass-to-js Pen](https://codepen.io/malyw/pen/zGxodr)

and can be reused in any other Pen as in [Sass-to-js demo](https://codepen.io/malyw/pen/zGxodr):

<span data-height="340" data-theme-id="178" data-slug-hash="zGxodr" data-user="malyw" data-default-tab="result" class="codepen"></span>

## Tests

A pack of Jasmine tests were added to provide good coverage for sass-to-js code.

Tests are provided for integration with AngularJS/jQuery, debugging errors in console, and, of course,

for the main part- converting of Sass data to JavaScript correctly.

## Demo

Regarding the task from which everything started (+/- control with sections)- I just provided `zoomSteps` variable in Sass.

Now I just change it once in one place (Sass) and it is automatically reused in JavaScript.

For demo I prepared several blocks with that control.
Data from Sass is sent via code:

```scss
& > div {
  font-family: sassToJs("maxZoomStep", $zoomStep);
}
```

And JavaScript part is:

```js
this.maxZoomStep = sassToJs(this.zoom).maxZoomStep;
```

<a href="{{ site.baseurl }}/demos/data-from-sass-to-js/"
   target="_blank"
   class="btn-pulse">
    <span class="wrapper">
        <span class="inner"></span>
    </span>
    <span class="text">Demo</span>
</a>

If instead of Sass you use other CSS preprocessors or just pure CSS-
you still can use **sass-to-js** JavaScript module to read JSON from CSS as demonstrated in:

<span data-height="210" data-theme-id="178" data-slug-hash="PqZOBd" data-user="malyw" data-default-tab="result" class="codepen"></span>

## Results

The library to easily convert Sass data to JSON in CSS which can be easily read from JS is created.

sass-to-js **doesn't have any dependencies** and has been **tested tested and works in all modern browsers and IE9+**.

### Links

* [Github sass-to-js library](https://github.com/malyw/sass-to-js)
* [SASSYJSON: TALK TO THE BROWSER!](http://hugogiraudel.com/2014/01/20/json-in-sass/) by [Hugo Giraudel](https://twitter.com/HugoGiraudel)
* [Making Sass talk to JavaScript with JSON](https://css-tricks.com/making-sass-talk-to-javascript-with-json/)
