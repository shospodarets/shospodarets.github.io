---
layout: post
title: CSS custom properties (native variables) In-Depth
tags: [CSS, Sass]
share_image: https://i.imgur.com/YgnJv5r.png
share_description: CSS custom properties (native variables) In-Depth   
---

I thought to start from explaining the purpose of having variables in CSS
but actually popularity of CSS pre/postprocessors already did that.

Couple examples:

- color variables for branding
- consistent components properties (layout, positioning etc.)
- avoid code duplications

Yes, of course, you still can search and find/replace all you need manually in your codebase
but it's like not having variables in JS- pain.
Having dynamic and scoped CSS variables provides even more abilities for your experiments and applications-
you can read, set and update them on the fly!
Also you can prevent code duplications around your codebase as recently
[Webkit guys did in their Web Inspector](https://webkit.org/blog/5989/css-variables-in-webkit/).

And finally you have an interface to easily pass data from CSS to JS (for example media breakpoint values).

Here is the short-list of features CSS properties have:

- they are dynamic and can be changed at runtime
- they are easily to read/write from JS
- they inherit, cascade and have scopes

So let's dive deeper what CSS properties are and how to use them.

<div class="more"></div>

# The name

Idea started as CSS variables but then was extended and restructured to CSS custom properties.

And it makes sense as more accurate name would be really CSS properties as it shows their nature/syntax.
Now we also have related [CSS @apply rule](http://tabatkins.github.io/specs/css-apply-rule/)
which provides the idea of kinda "mixins".

So the current name is [CSS Custom Properties for Cascading Variables](https://drafts.csswg.org/css-variables/)

[CSS Variables currently have two forms:](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables#What_are_CSS_Variables):

<blockquote>
    variables, which are an association between an identifier and a value that can be used in place of any regular values,
    using the var() functional notation: var(--example-variable) returns the value of the --example-variable value.
</blockquote>
<blockquote>
    custom properties, which are special properties of the form --* where * represents the variable name.
    These are used to define the value of a given variable: --example-variable: 20px; is a CSS declaration,
    using the custom --* property to set the value of the CSS variable --example-variable to 20px.
</blockquote>

# First CSS variable

You might be surprised but you already might know and use a CSS variable (looks like the first one)-
`currentColor` which is not so well known but [still usable](https://css-tricks.com/currentcolor/)
and [works in all browsers](http://caniuse.com/#feat=currentcolor).

It also has a scope and can be redefined:

```css
:root { color: red; }
div { border: 1px solid currentColor; } /* border-color is red */
```

If you add:

```
div {
   color: black;
}
```

border color [would be black](http://codepen.io/malyw/pen/yObLEX)

# CSS variables syntax

## Set

You can declare a variable using `--variable-name: variable-value;` syntax (names are case-sensitive).
As a value you can use colors, strings, values etc.:

```css
:root{
 --main-color: #4d4e53;
 --main-bg: rgb(255, 255, 255);
 --logo-border-color: rebeccapurple;
 --header-height: 68px;
 --content-padding: 10px 20px;
 --base-line-height: 1.428571429;
 --transition-duration: .35s;
 --external-link: "external link";
 --margin-top: calc(2vh + 20px);
}
```

Syntax might look ugly but there were [couple reasons for that](http://www.xanthir.com/blog/b4KT0).
E.g. `$var` variables syntax would be proceeded by CSS preprocessor otherwise.

## Usage

You can use variables in CSS values like: `some-css-value: var(--variable-name [, declaration-value]);`

```css
p {
 margin: var(--p-margin, 0 0 10px);
}
```

In the above example `0 0 10px` would be applied if `--p-margin` is not assigned.
Such ability makes things more flexible- you can use some variable from a framework (where usually many of them are defined)
but at the same time be ready to remove it anytime saving your functionality working. 

## Scope

As it's mentioned in the [module's documentation title](https://drafts.csswg.org/css-variables/)-
custom properties follow usual [CSS cascade rules](https://drafts.csswg.org/css-cascade-4/#cascade).

To provide a global variable use the [:root scope](https://developer.mozilla.org/en-US/docs/Web/CSS/:root):

```css
:root{
 --global-var: 'global';
}
```

If you want to make a variable [visible only for some element/component](http://codepen.io/malyw/pen/QNvwRV)
[re]define it for that specific element:

```html
<div class="block">
  My block is
  <div class="block__highlight">awesome</div>
</div>
```

```css
.block {
  --block-font-size: 1rem;
  font-size: var(--block-font-size);
}

.block__highlight {
  --block-highlight-font-size: 1.5rem;
  font-size: var(--block-highlight-font-size);
}
```

Media queries also [provide "scopes" for you](http://codepen.io/malyw/pen/grgJJJ):

```css
@media screen and (min-width: 1025px) {
  :root {
    --screen-category: 'desktop';
  }
}
```

Another simple example of the scope would be
[pseudo-classes](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes) (e.g. `:hover`):

```css
body {
  --bg: #f00;
  background-color: var(--bg);
  transition: background-color 1s;
}

body:hover {
  --bg: #ff0;
}
```

<span data-height="80" data-theme-id="178" data-slug-hash="ZWygyv" data-user="malyw" data-default-tab="result" class="codepen"></span> 


As custom properties are global, to avoid conflicts
better to follow [a common convention naming your variables](http://codepen.io/malyw/pen/eZgaQv)
(even easier to follow such "scopes" using a [BEM naming convention](http://getbem.com/naming/)) e.g.:

```css
:root {
  /* main (page-wide) variables */
  --main-color: #555;
  --main-bg: rgb(200, 200, 200);
  /* accordion variables */
  --accordion-bg: #f00;
  --accordion-font-size: 1.5rem;
  --accordion__item-bg: #ded;
}

body {
  color: var(--main-color);
  background-color: var(--main-bg);
  /*...*/
}
```


## Reassign vars from others

It's possible to [use variables assigning another ones](http://codepen.io/malyw/pen/NNjqWB)
`--variable-name: var(--another-variable-name);`:

```css
.block {
  --block-text: 'This is my block';
  --block-highlight-text: var(--block-text)' with highlight';
}

.block:before {
  content: var(--block-text);
}

.block__highlight:before {
  content: var(--block-highlight-text); /*This is my block with highlight*/
}
```

There is a problem here- you cannot easily calculate new variables using defined ones. But we have
[CSS calc()](https://developer.mozilla.org/en/docs/Web/CSS/calc)
so [we can use it instead](http://codepen.io/malyw/pen/GZmJgO):

```css
.block {
  --block-font-size: 1rem;
}

.block__highlight {
  /* DOESN'T WORK */
  --block-highlight-font-size: --block-font-size)*1.5;
  font-size: var(--block-highlight-font-size);
  
  /* WORKS */
  font-size: calc(var(--block-font-size)*1.5);
}
```

Be careful with huge expressions as they might impact the app's performance.

## calc() for values

As it was already mentioned, you cannot simply use variables like:

```css
    padding: var(--spacer)px
```

But you can use `calc()` for that and calculations. Let's make
[a simple example of vertical rhythm](http://codepen.io/malyw/pen/MymmNK):

```css
    margin: 0 0 calc(var(--base-line-height, 0) * 1rem);
```

## Finally you can always reset/inherit the value

By default CSS custom properties inherit.
In the case when you want to minimise any side effects for your blocks/components you can
[simply reset custom properties](http://codepen.io/malyw/pen/qZReZB):

```css
.with-reset {
  --bgcolor: initial;/* RESETS VALUE */
  --color: green;/* CHANGES VALUE */
  --border: inherit;/* DOESN'T CHANGE ANYTHING, AS INHERITED BY DEFAULT */
}
```


# Access custom properties from JavaScript
 
You can easily read/write custom properties from JS.
For that use [CSSStyleDeclaration Interface](https://www.w3.org/TR/DOM-Level-2-Style/css.html#CSS-CSSStyleDeclaration)
(`getPropertyValue`, `setProperty`): 

```js
// READ
const rootStyles = getComputedStyle(document.documentElement);
const varValue = rootStyles.getPropertyValue('--screen-category').trim();
```

```js
// WRITE
document.documentElement.style.setProperty('--screen-category', value);
```

Here is a demo of using the Custom Property `--screen-category`
which represents the current screen type and is allowed to be assigned from the UI:
 
<span data-height="200" data-theme-id="178" data-slug-hash="grgJJJ" data-user="malyw" data-default-tab="result" class="codepen"></span> 

In that demo is shown an easy way to debug custom properties. In JS:

```js
// GET
alert(
    getComputedStyle(document.documentElement).getPropertyValue('--screen-category').trim();
);

// SET
document.documentElement.style.setProperty('--screen-category', 'custom');

// or reassign from an another prop
document.documentElement.style.setProperty(
    '--screen-category', 'var(--default-screen-category, '%DEFAULT VALUE IF VAR IS NOT SET%')'
);
```

Ability to assign anything as a CSS variable value and an easy interface to read/write that from JS,
allows to skip the old hacky ways of
[passing data from CSS/Sass to JS](https://blog.hospodarets.com/passing_data_from_sass_to_js)
(e.g. [list of media queries breakpoints](http://codepen.io/malyw/pen/zGxodr)).

For debug you can just output the value of a variable on your page in the `content` rule:

```css
body:after {
  content: '--screen-category : 'var(--screen-category);
}
```


# Browser Support

Custom properties already work in stable Chrome, Firefox and desktop Safari 9.1:

<div class="caniuse" data-feature="css-variables"></div>

They are
[under consideration in Microsoft Edge](https://dev.windows.com/en-us/microsoft-edge/platform/status/cssvariables)

There are some limitations and bugs:

- [complex calc() calculation with CSS variables](https://blog.hospodarets.com/demos/css-colors-from-custom-props/) may not work in some browsers
- people discuss adding an
[ability to apply common rules (e.g. reset) for all custom properties for the current scope](https://github.com/w3c/webcomponents/issues/300#issuecomment-144551648) like `--: initial;`
- you cannot use them for usual CSS properties names: <strike><code>var(--side): 10px;</code></strike>
- to apply values calc() is supposed to be used: `calc(var(--base-line-height, 0) * 1rem)`
- no way to use as media queries values <strike><code>@media screen and (min-width: var(--desktop-breakpoint) {</code></strike>
- Images url like <strike><code>url(var(--image-url))</code></strike> don't work

[Here are ways to TEST if CSS custom properties are supported in the browser](http://codepen.io/malyw/pen/GZmzPG).
CSS:
  
```scss
  @supports ( (--a: 0)) {
    /* supported */
  }
  
  @supports ( not (--a: 0)) {
    /* not supported */
  }
```

JS:

```js
if (window.CSS && window.CSS.supports && window.CSS.supports('--a', 0)) {
  alert('CSS properties are supported');
} else {
  alert('CSS properties are NOT supported');
}
```

For old browsers ([without CSS.supports() API](http://caniuse.com/#feat=css-featurequeries)) you can use [Wes Bos' test](https://gist.github.com/wesbos/8b9a22adc1f60336a699).

# Fallbacks / polyfills

There are couple examples of PostCSS plugins, but
`no plugin can achieve true complete parity according to the specification because of the DOM cascade unknowns`
+ they are not dynamic.

It might be solved when we see the bright future and CSS Houdini group dream of implementing
[an easy native way for CSS "polyfills" to all major browsers](https://www.smashingmagazine.com/2016/03/houdini-maybe-the-most-exciting-development-in-css-youve-never-heard-of/)
will come true. And even in that case variables syntax, most of all, cannot be shimmed.

But so far here is the list:

- [PostCSS plugin to transform W3C CSS Custom Properties](https://github.com/postcss/postcss-custom-properties)-
a simple plugin which processes only variables declared for `:root`
- [PostCSS plugin to transform CSS Custom Properties(CSS variables)
syntax into a static representation](https://github.com/MadLittleMods/postcss-css-variables)
and [online demo of it](https://madlittlemods.github.io/postcss-css-variables/playground/).
It tries to process scopes like media queries, pseudo classes and elements + nested rules.
- [Myth](https://github.com/segmentio/myth)- a preprocessor
- and of course [CSS next](https://github.com/MoOx/postcss-cssnext) which makes
much of the new CSS syntax work today.

# Using together with CSS preprocessor (SCSS)

## Same variable names

Other small suggestion to start using CSS custom properties now with preprocessors is usage of
[a mixed syntax checking the browser support](http://codepen.io/malyw/pen/grRQeq):

```scss
  @supports ( (--a: 0)) {
    /* Custom properties are supported in the browser */
    :root{
      --main-bg: #4d4e53;
    }
    
    body {
      background-color: var(--main-bg);
    }
  }
  
  @supports ( not (--a: 0)) {    
    /* Custom properties are NOT supported in the browser */
    $main-bg: #4d4e53;
    
    body {
      background-color: $main-bg;
    }
  }
```

In such case both CSS and Sass variables are created but the Sass variable
is used only if custom properties are not supported in the browser.

Or you can move such logic and [hide it under the Sass mixin](http://codepen.io/malyw/pen/aNwKKv):

```scss
@mixin setVar($varName, $value){
  @include setVarSass($varName, $value);
  @include setVarCss($varName, $value);
}

@mixin setPropFromVar($propName, $varName){
  @supports ( (--a: 0)) {
    // Custom properties are supported in the browser
    #{$propName}: getVarCss($varName);
  }
  
  @supports ( not (--a: 0)) {    
    // Custom properties are NOT supported in the browser
    #{$propName}: getVarSass($varName);
  }
}

// SET
@include setVar('main-color', #f00);

// GET
body {
  @include setPropFromVar('color', 'main-color');
}
```

## Global variables

The ideas of the variable scopes are different in Sass and CSS,
but here is the common way of doing that:
 
```scss
/* SCSS */
$main-color: #f00 !global;

/* CSS */
:root{
    --main-color: #f00;
}
```

## Assigning the variable only if it's not assigned so far

A common case when you expect that variable might be already defined and
want another value to be applied only if it's not assigned:

```scss
/* SCSS */
$main-color: #f00 !default;

body{
    color: $main-color;
}
```

Unfortunately you cannot do it such easily in CSS:

```css
/* CSS */
body{
    --main-color: var(--main-color, #f00); /* DOESN'T WORK */
}
```

But you can create a new variable:

```css
/* CSS */
body{
    --local-main-color: var(--main-color, #f00); /* DOES WORK */
    color: var(--local-main-color);
}
```

Or do that directly during the usage:

```css
/* CSS */
body{
    color: var(--main-color, #f00); /* DOES WORK */
}
```


# Interesting usages

Custom properties provide a huge area of interesting ideas:

* now you have a clear native way to make your CSS talk to JS without
[hacks we used to use](https://css-tricks.com/making-sass-talk-to-javascript-with-json/)
 
* Another example is [using custom properties for internationalization](http://codepen.io/malyw/pen/grgVGx)
where `external link` text and colors are changed depending on the selected language

* A curious Jake Archibald's proposal to control elements visibility using CSS variables
depending on which blocks and their styles are loaded in the page:
[article](https://jakearchibald.com/2016/css-loading-with-custom-props/)

* Theme switching: now instead of adding CSS rules for a particular class or loading an additional file with CSS rules to change the site theme,
you can use custom properties as described by Michael Scharnagl in the
[post](https://justmarkup.com/log/2016/02/theme-switcher-using-css-custom-properties/).

* I also have some ideas how to use them e.g. for domain-specific branding
(to provide different look and feel for instance domain1.site.com and domain1.site.com).
For that we can easily upload and apply an external CSS file (depending on a domain)
which will redefine some custom properties set.

The last idea and demo is close to theme switching based on custom properties, so you can use it in both cases:

<div>
    <a href="{{ site.baseurl }}/demos/css-custom-props-theme-switcher/"
       target="_blank"
       class="btn-pulse">
        <span class="wrapper">
            <span class="inner"></span>
        </span>
        <span class="text">Demo</span>
    </a>
</div>

<a href="{{ site.baseurl }}/demos/css-custom-props-theme-switcher/">
    <img src="https://i.imgur.com/DwLCfC0.gif" alt=""/>
</a>

* and, of course, [usage as an emulation of missed separate CSS properties](http://codepen.io/malyw/pen/KzZXRq?editors=1100)- once again the name "custom properties"
sounds good in this case:
    <div>
        <a href="http://codepen.io/malyw/pen/KzZXRq?editors=1100">
            <img src="https://i.imgur.com/E0FTuI1.jpg" />
        </a>
    </div>

# Demo

Inspired by wonderful Wes Bos
[demos of interacting with CSS custom properties](https://twitter.com/wesbos/status/697808716905652224)
I decided to step even further and calculate colors from R,G,B channels (defined by the user)
in CSS using `calc();`.

For grayscale filter the code is:

```css
.grayscale {
    background-color: rgba(
            calc(0.2126 * var(--r)),
            calc(0.7152 * var(--g)),
            calc(0.0722 * var(--b)),
            1
    );
}
```

<div>
    <a href="{{ site.baseurl }}/demos/css-colors-from-custom-props/"
       target="_blank"
       class="btn-pulse">
        <span class="wrapper">
            <span class="inner"></span>
        </span>
        <span class="text">Demo</span>
    </a>
</div>

<a href="{{ site.baseurl }}/demos/css-colors-from-custom-props/">
    <img src="https://i.imgur.com/9IUE3FR.gif" alt=""/>
</a>

Interesting facts:

- Chrome doesn't like multiplying/dividing with non integer numbers in `calc()` with CSS variables
- Firefox doesn't work with custom properties in `calc()` inside of `rgba()` at all
- Demo works in Safari as expected :blush:

# Сonclusions

Now you know what CSS custom properties are and:
 
* their syntax to interact from CSS and JS
* they are dynamic, inherit, cascade and have scopes
* browser support and fallbacks for them
* they can be used in parallel with Sass variables
* some interesting usages and examples where custom variables
open absolutely new capabilities for developers and web platform in general

I hope after reading this article you are excited to start using custom properties.

# Further reading

Recently CSS native mixins syntax was announced -
read my article [CSS @apply rule (native CSS mixins)]({{ site.baseurl }}/css_apply_rule)  