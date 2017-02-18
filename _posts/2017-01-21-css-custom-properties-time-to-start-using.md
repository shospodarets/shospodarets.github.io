---
layout: post
title: "CSS custom properties- time to start using"
tags: [CSS, Sass]
share_image: https://hospodarets.com/img/blog/1487437673839038000.png
share_description: How to start using CSS custom properties and prepare a path to switch/use in parallel with a CSS preprocessor
draft: true
---

Today CSS preprocessors is a tech standard for the Web development.
One of the main advantages of the preprocessors is an ability to use variables.
It helps to avoid copy-pasting of the code, simplifies development and refactoring.

We use them to store colors, font and layout details etc.- mostly everything we use in CSS.

But preprocessor's variables have own problems:

- you cannot change them dynamically
- they have no clue about the DOM structure
- they cannot be read / changed from JavaScript
 
As a silver bullet to solve these and other problems, the community invented CSS Custom Properties.
Essentially, they look and work as CSS variables and the way they work is reflected in their name.

The Custom Properties are opening the new horizons for the Web development.

<div class="more"></div>

# Syntax to declare and use

The usual problem when you start the new preprocessor/framework- is to learn the new syntax to solve your issues.
 
The same situation we have in preprocessors, each of them requires an own way to declare variables.
Usually, they start with a different symbol, e.g. `$` (Sass) or `@` (Less).

CSS custom properties went the same way and started using `--` at the beginning to represent the declaration.
But the good point here is that you can learn this syntax once and you can reuse it across the browsers!

You may want to ask:
**"Why not to reuse one of the previous syntaxes?"**

[There was a reason](http://www.xanthir.com/blog/b4KT0)- in short, it's to provide a way to use Custom Properties in any preprocessors.
This way you can provide/use Custom Properties and preprocessor will not compile them, so they will directly go to the output CSS.
On the other hand, you can reuse preprocessor variables in the native ones, but I will describe that later.



> Regarding the name: <br>
 As the idea and purpose are very similar, sometimes Custom Properties are called
 the "CSS variables" though the correct name is "CSS custom properties" and reading further you will understand
 why such a name describes them the best.


So, to declare a variable just instead of the usual CSS properties like `color`/`padding` etc. provide a custom named property which name starts from `--`:

```css
.box{
    --box-color: #4d4e53;
    --box-padding: 0 10px;
}
```

A value of a property can be any valid CSS value,
from colors to strings, layout values and even expressions.
 
Here is the example of valid Custom Properties:

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
    
    /* valid CSS Custom Prop, can be reused later e.g. in JS */
    --foo: if(x > 5) this.width = 10;
}
```

If you are not sure what the [`:root`](https://developer.mozilla.org/en-US/docs/Web/CSS/:root)
matches, in case of HTML it's the same as `html`, but with the higher specificity.

As other CSS properties, Custom ones cascade in the same way and are dynamic.
It means, they can be changed at any moment and the change is processed accordingly by the browser.

To use the variable, you have to use the `var()` CSS function and provide a name of the property inside:

```css
.box{
    --box-color:#4d4e53;
    --box-padding: 0 10px;
    
    padding: var(--box-padding);
}

.box div{
    color: var(--box-color);
}
```

## Declaration/usage cases

The `var()` function provides a handy way to provide a default value to be used.
For instance, you are not sure if a Custom Property is defined and want to give a value to be used in such a case.
It can be done easily, passing the second param to the function:

```css
.box{
    --box-color:#4d4e53;
    --box-padding: 0 10px;
    
    /*10px is used as --box-margin is not defined*/
    margin: var(--box-margin, 10px);
}
```

As you may expect, you can reuse other variables to declare new ones:

```css
.box{
    /* "--main-padding" variable is used if "--box-padding" is not defined */
    padding: var(--box-padding, var(--main-padding));
    
    --box-text: 'This is my box';
    
    /* equal to: --box-highlight-text:'This is my box with highlight'; */
    --box-highlight-text: var(--box-text)' with highlight';
}
```

# Operations (+, -, *, /)

As we got used in preprocessors and other languages, we want to use basic operators when working with variables.
For such purposes CSS provides a `calc()` function, which will make the browser to recalculate the expressions
after any changes to the Custom Properties values:

```css
:root{
    --indent-size: 10px;
    
    --indent-xl: calc(2*var(--indent-size));
    --indent-l: calc(var(--indent-size) + 2px);
    --indent-s: calc(var(--indent-size) - 2px);
    --indent-xs: calc(var(--indent-size)/2);
```

A problem waits for you when you try to use unit-less values.
You will see that `calc()` is your friend there again as without that it doesn't work:

```css
:root{
    --gap: 10;
}

.box{
    padding: var(--spacer)px 0; /* DOESN'T work */
    padding: calc(var(--spacer)*1px) 0; /* WORKS */
}
```

# Scopes and inheritance

Before we move to CSS Custom properties scopes,
let's recollect the JS/preprocessors scopes,
so we can easier understand the differences.

We know the idea of the scope applied e.g. for JavaScript variables (`var`)- the scope is limited to the functions.

A similar situation is for `let` \ `const`, but they are block-scope local variables.

A `closure` in JavaScript is a function that has access to the outer (enclosing) function’s variables—scope chain.
The closure has three scope chains and it has access to:

1. its own scope (variables defined between its curly brackets)
2. the outer function’s variables
3. the global variables.

![alt](https://i.imgur.com/1w2ccHI.png)

The similar story is around preprocessors.
Let's take a look into Sass example, as it's one of the most popular preprocessors for today.

In Sass, there are two types of variables: `local` and `global` variables.

A `global` variable you can declare providing it outside of any selector or construction (e.g. a `mixin`), otherwise you get a `local` one.

Any nested blocks of code can access the enclosing variables (similar to the JS case).

<span class="smaller-img">
    <img src="https://i.imgur.com/RalReh7.png" />
</span>

Which means, in Sass, the variable scopes are fully reliable on the code structure.

On the other hand, CSS Custom Properties are inherited by default and as other CSS properties, they cascade.

You also cannot provide a "global" variable providing a Custom Property outside of the selectors- it's not valid CSS.
The global scope for CSS Custom Properties is actually the `:root` scope, after what the property is available "globally".

Let's use our syntax knowledge and reflect the Sass example in HTML/CSS
and create a demo using the native CSS Custom Properties:

```html
global
<div class="enclosing">
  enclosing
  <div class="closure">
    closure
  </div>
</div>
```

and CSS:

```css
:root {
  --globalVar: 10px;
}

.enclosing {
  --enclosingVar: 20px;
}

.enclosing .closure {
  --closureVar: 30px;

  font-size: calc(var(--closureVar) + var(--enclosingVar) + var(--globalVar)); /* 60px for now */
}
```

<span data-height="150" data-theme-id="178" data-slug-hash="MJmebz" data-user="malyw" data-default-tab="result" class="codepen"></span>

## Change of the Custom Property immediately is applied to all its usages

So far we haven't faced differences with the Sass variables, but let's reassign the variable after it's usage:

It has no effect in the Sass case:

```scss
.closure {
    $closureVar: 30px; // local variable
    font-size: $closureVar +$enclosingVar+ $globalVar; // 60px, $closureVar: 30px is used
    $closureVar: 50px; // local variable
}
```

<span data-height="150" data-theme-id="178" data-slug-hash="bgWerv" data-user="malyw" data-default-tab="result" class="codepen"></span>

But in CSS, the calculated value is changed, as the `font-size` value is recalculated from the changed `--closureVar` value:

```css
.enclosing .closure {
  --closureVar: 30px;

  font-size: calc(var(--closureVar) + var(--enclosingVar) + var(--globalVar)); /* 80px for now, --closureVar: 50px is used */
  
  --closureVar: 50px;
}
```

<span data-height="170" data-theme-id="178" data-slug-hash="WRjxOy" data-user="malyw" data-default-tab="result" class="codepen"></span>

That's the first huge difference-
**if you reassign a Custom Property value, the browser recalculates all the variables/calc() expression etc. where it's applied**

## Preprocessor has no clue about the DOM structure

Let's provide an example where we want to use a default `font-size` for the block,
except the case when the `highlighted` class is present.

Here it the HTML:

```html
<div class="default">
  default
</div>

<div class="default highlighted">
  default highlighted
</div>
```

Let's do it using CSS Custom Properties:

```css
.highlighted {
  --highlighted-size: 30px;
}

.default {
  --default-size: 10px;
  
  /* use the "default-size" except the "highlighted-size" is provided */
  font-size: var(--highlighted-size, var(--default-size));
}
```

As the second HTML element with the `default` class has the `highlighted` class, <br/>
properties from the `highlighted` class starts being applied to the element. <br/>
In out case, it means `--highlighted-size: 30px;` is applied, <br/>
which in turn makes `font-size` property being assign using the `--highlighted-size`.

Everything is straightforward and works:

<span data-height="100" data-theme-id="178" data-slug-hash="ggWMvG" data-user="malyw" data-default-tab="result" class="codepen"></span>

And now we'll try to achieve the same using Sass:

```scss
.highlighted {
  $highlighted-size: 30px;
}

.default {
  $default-size: 10px;
  
  /* use the "default-size" except the "highlighted-size" is provided */
  @if variable-exists(highlighted-size) {
    font-size: $highlighted-size;
  }
  @else {
    font-size: $default-size;
  }
}
```

And the result shows that the default size is applied to both:

<span data-height="100" data-theme-id="178" data-slug-hash="PWmzQO" data-user="malyw" data-default-tab="result" class="codepen"></span>

It happens because all the Sass calculations and processing happen during the compilation time,
 and, of course, it doesn't now anything regarding the DOM structure and fully relies on the code structure.
 
As you see, Custom Properties took the best practice in terms of variables scoping but added the
usual CSS Properties cascading, which is aware of the DOM structure and follows the same rules as other CSS properties.

The second takeaways is:
**CSS Custom properties are aware on the DOM structure and are dynamic**


# CSS-wide keywords and `all` property

CSS custom properties subject to the same rules as the usual CSS Custom Properties (CCP).
 It means you can assign any of the common CSS keywords to them.

- `inherit` CSS keyword applies the value of the element’s parent.
- `initial` applies the initial value as defined in the CSS specifications (empty value, nothing in some cases for CCP)
- `unset` applies the inherited value if the property is normally inherited (Custom Properties case), or the initial value if the property is normally not inherited
- `revert` resetting the property to the default value established by the user-agent stylesheet (empty value for CSS Custom Properties)

Here is an example:

```css
.common-values{
    --border: inherit;
    --bgcolor: initial;
    --padding: unset;
    --animation: revert;
}
```

And now let's consider an another case: <br/> 
Let's assume you want to build a component and be sure no other styles/Custom Properties are applied to it unintentionally
(for styles, in such cases, usually CSS Modules-related solutions are used).

But now there is another way, to use the [`all` CSS property](https://developer.mozilla.org/en/docs/Web/CSS/all).
It's a shorthand which resets all the CSS properties.

Together with CSS keywords, you can do the following:

```css
.my-wonderful-clean-component{
    all: initial;
}
```

So you will reset all the styles for your component.

Unfortunately `all` keyword [doesn't reset Custom Properties](https://drafts.csswg.org/css-variables/#defining-variables),
but currently, [there is still a discussion to add the `--`](https://github.com/w3c/webcomponents/issues/300#issuecomment-144551648)
which will reset all the CSS Custom Properties.

So after a while, the full reset may be done using:

```css
.my-wonderful-clean-component{
    --: initial; /* reset all Custom CSS Properties */
    all: initial; /* reset all other CSS styles */
}
```

# CSS Custom Properties use cases

There are many usages for the Custom Properties, I will provide the most interesting of them.

## Emulating non-existing CSS rule

As the name of CSS variables is "Custom Properties" why not to use them to emulate non-existing properties?

There are many of them from `translateX/Y/Z` to `background-repeat-x/y` (still not cross-browser) and `box-shadow-color`.

Let's take the last and make it work.
In the example, we will change the box-shadow color on hover.
We just want to follow the DRY rule and instead of repeating all the `box-shadow` value into the `:hover`
section, just change its color.
Custom Properties to the rescue:
 
```css
.test {
  --box-shadow-color: yellow;
  box-shadow: 0 0 30px var(--box-shadow-color);
}

.test:hover {
  --box-shadow-color: orange;
  /* Instead of: box-shadow: 0 0 30px orange; */
}
```

<span data-height="130" data-theme-id="178" data-slug-hash="KzZXRq" data-user="malyw" data-default-tab="result" class="codepen"></span>

## Color themes

One of the most common cases for Custom Properties is the color themes for the applications.
They were created to solve this kind of problems, so let's provide a simple color theme for a component
(the same steps can be used for an application).

Here is our [button-component code](http://codepen.io/malyw/pen/XpRjNK):

```css
.btn {
  background-image: linear-gradient(to bottom, #3498db, #2980b9);
  text-shadow: 1px 1px 3px #777;
  box-shadow: 0px 1px 3px #777;
  border-radius: 28px;
  color: #ffffff;
  padding: 10px 20px 10px 20px;
}
```

Let's assume we want to create an inverted color theme.

The first step will be to extend all the color variables to the CSS Custom Properties and rewrite our component,
so the [result is the same](http://codepen.io/malyw/pen/EZmgmZ):

```css
.btn {
  --shadow-color: #777;
  --gradient-from-color: #3498db;
  --gradient-to-color: #2980b9;
  --color: #ffffff;
  
  background-image: linear-gradient(to bottom, var(--gradient-from-color), var(--gradient-to-color));
  text-shadow: 1px 1px 3px var(--shadow-color);
  box-shadow: 0px 1px 3px var(--shadow-color);
  border-radius: 28px;
  color: var(--color);
  padding: 10px 20px 10px 20px;
}
```

Everything we need now- to override the color variables value to the inverted ones and apply them when it's needed.
We can e.g. add the global `inverted` HTML class (e.g. to the `body` element) and change the colors when it's applied:

```css
body.inverted .btn{
  --shadow-color: #888888;
  --gradient-from-color: #CB6724;
  --gradient-to-color: #D67F46;
  --color: #000000;
}
```

And here is the demo where you can click a button to add/remove a global class and see the demo in action:

<span data-height="150" data-theme-id="178" data-slug-hash="dNWpRd" data-user="malyw" data-default-tab="result" class="codepen"></span>

This behavior cannot be achieved without the code duplication overhead using CSS preprocessors.
 With preprocessors, you always need to override the actual values and rules
 which always results in the additional CSS output.
 
 In the case of CSS Custom Properties, the solution is as clean as poosible and avoids copy-paste,
 as only  the values of the variables are redefined.

# Using Custom Properties with JavaScript

Previously, to send some data from CSS to JS, we often had to use
[tricks](https://blog.hospodarets.com/passing_data_from_sass_to_js) to writing CSS values via plain JSON in the CSS output
and then read it from JS.

Now you can easily interact with the CSS variables from JavaScript, read and write to them
using well known `.getPropertyValue()` and `.setProperty()` methods,
which are used for the usual CSS properties:

```js
/**
* Gives a CSS custom property value applied at the element
* element {Element}
* varName {String} without '--'
* 
* E.g.:
* readCssVar(document.querySelector('.box'), 'color');
*/
function readCssVar(element, varName){
    const elementStyles = getComputedStyle(element);
    return elementStyles.getPropertyValue(`--${varName}`).trim();
}

/**
* Writes a CSS custom property value at the element
* element {Element}
* varName {String} without '--'
* 
* E.g.:
* readCssVar(document.querySelector('.box'), 'color', 'white');
*/
function writeCssVar(element, varName, value){
    return element.style.setProperty(`--${varName}`, value);
}
```

Let's assume you have a list of the used media query values:

```css
.breakpoints-data {
  --phone: 480px;
  --tablet: 800px;
}
```

As only you want to reuse them in JS e.g. in
[Window.matchMedia()](https://developer.mozilla.org/en/docs/Web/API/Window/matchMedia),
you can easily get them from CSS:

```js
const breakpointsData = document.querySelector('.breakpoints-data');

// GET
const phoneBreakpoint = getComputedStyle(breakpointsData)
    .getPropertyValue('--phone');
```

To show how to assign Custom Properties from JS,
I created an interactive 3D CSS cube demo which responds to the user actions.

It's not very hard, for that is enough to provide a simple background, and place 5 cube faces using
 the proper values for the `transform` property: `translateZ()`, `translateY()`,  `rotateX()` and `rotateY()`.
 
To provide a perspective and proper view, I added the following to the page wrapper:

```css
#world{
    --translateZ:0;
    --rotateX:65;
    --rotateY:0;

    transform-style:preserve-3d;
    transform:translateZ(calc(var(--translateZ) * 1px)) rotateX(calc(var(--rotateX) * 1deg)) rotateY(calc(var(--rotateY) * 1deg));
}
```

The only missed part was to add the interactivity, so the demo would change the X/Y view angles (`--rotateX`, `--rotateY`) on mousemove
and zoom in/out the view on mouse scroll (`--translateZ`).

Here is the JS parts which do the trick:

```js
// EVENTS
onMouseMove(e) {
    this.worldXAngle = (.5 - (e.clientY / window.innerHeight)) * 180;
    this.worldYAngle = -(.5 - (e.clientX / window.innerWidth)) * 180;
    this.updateView();
};

onMouseWheel(e) {
    ...

    this.worldZ += delta * 5;
    this.updateView();
};

// JS-> CSS
updateView() {
    this.worldEl.style.setProperty('--translateZ', this.worldZ);
    this.worldEl.style.setProperty('--rotateX', this.worldXAngle);
    this.worldEl.style.setProperty('--rotateY', this.worldYAngle);
};
```

After that on user mouse activities the demo changes it's view.
You can check it moving the mouse and using mouse wheel to zoom in/out:

<span data-height="500" data-theme-id="178" data-slug-hash="xgdEQp" data-user="malyw" data-default-tab="result" class="codepen"></span>

Essentially we just change the CSS Custom Properties values, everything else (rotating, zoom in/out) is done by CSS.


Just a useful tip: one of the easiest ways to debug the CSS custom property
values is just to show their content in CSS generated content (works in simple cases, e.g. for strings),
so the browser will automatically show the current (up to date) applied value:

```css
body:after {
    content: '--screen-category : 'var(--screen-category);
}
```

You can check it [in the plain CSS demo (no HTML/JS)](http://codepen.io/malyw/pen/oBWMOY)
(resize a browser window to see the browser reflects the changed CSS Custom Property value automatically)

# Browsers support

CSS custom properties for today are [supported in all the major browsers](http://caniuse.com/#feat=css-variables)
(except EDGE, where [they are in development](https://developer.microsoft.com/en-us/microsoft-edge/platform/status/csscustompropertiesakacssvariables/?q=variab)
and should be available in the next version):

<span class="smaller-img">
    <img src="https://i.imgur.com/BpCp2Ei.png" />
</span>

It means, that after a short time they are supported in all browsers and you can start using them natively.

Meanwhile, you can learn the syntax, usage examples and consider possible ways of switching/using CSS and preprocessor variables in parallel.

And, of course, we need to have the ability to detect the support in both CSS and JS to provide fallbacks or vice versa, improvements.

It's quite easy. For CSS you can use a [supports condition](https://developer.mozilla.org/en/docs/Web/CSS/@supports)
with a dummy CSS Custom Property feature query:

```css
@supports ( (--a: 0)) {
    /* supported */
}

@supports ( not (--a: 0)) {
    /* not supported */
}
```

In JavaScript you can use the same dummy Custom Property with `CSS.supports()` static method:

```js
const isSupported = window.CSS && window.CSS.supports && window.CSS.supports('--a', 0);

if (isSupported) {
    /* supported */
} else {
    /* not supported */
}
```

As we saw, CSS Custom Properties are still not available in every browser.
Knowing that and having the ability to check if they are supported, you can progressively enhance
your application by checking if they are available.

For instance, you can generate 2 main CSS files:
one with CSS Custom Properties, and a second without them, where the Properties are inlined
(we will discuss the ways to do it further).

Load the second one by default.
After just do a check in JS and switch to the enhanced version if it's supported: 

```html
<!--html-->
<link href="without-css-custom-properties.css" rel="stylesheet" type="text/css" media="all"/>
```

```js
// js
if(isSupported){
    removeCss('without-css-custom-properties.css');
    loadCss('css-custom-properties.css');
    // + conditionally apply some application enhancements using the Custom Properties
}
```

This is just an example, as you'll see further, there are better options.


# How to start using

Accordingly to [the recent survey](https://ashleynolan.co.uk/blog/frontend-tooling-survey-2016-results)
Sass continuing being a main preprocessor for the community.

So let's take it and consider options how we can start using CSS custom properties or being prepared for that using Sass.

There are a few options:

## 1. Manual checks in the code if Custom Properties are supported and use them.

One pro for this- yes, it will work and is something we can do right now (don't forget, we have switched to SCSS):

```scss
$color: red;
:root {
  --color: red;
}

.box {
  @supports ( (--a: 0)) {
    color: var(--color);
  }
  @supports ( not (--a: 0)) {
    color: $color;
  }
}
```

This way have many cons- overcomplicated code, copy-paste and is quite hard to maintain.

## 2. Use a plugin which will automatically process your result CSS

PostCSS plugins ecosystem provides dozens of plugins today.
A couple of them process Custom Properties (inline values) in the result CSS output and make it work,
assuming you provide only global variables (declare/change CSS Custom Properties only inside the `:root` selector(s)),
so their values can be easily inlined.

Here is an example- [postcss-custom-properties](https://github.com/postcss/postcss-custom-properties).

The plugin gives more pros: it makes the syntax work and
is compatible with all the PostCSS infrastructure, doesn't require too much setup/configuration.

From cons:

- the plugin requires you to use CSS custom properties,
so you don't have a path to prepare your project for a switch from Sass variables.
- You don't have too much control on the transformation,
as it's done after Sass is compiled to CSS
- plugin doesn't provide much debug info.

## 3. [`css-vars`](https://github.com/malyw/css-vars) mixin

I started using CSS Custom Properties in most of my projects and tried many strategies:

- switch from Sass to PostCSS with [cssnext](http://cssnext.io/)
- switch from Sass variables to pure CSS Custom Properties
- use CSS variables in Sass detecting if they are supported

As result having that experience I started looking for a solution which would satisfy my needs:
 
- is easy to start using with Sass
- straightforward to use and syntax is as much close to native CSS Custom properties as possible
- it should be easy to switch the CSS output from the inlined values to the CSS variables usage
- if the team/member learned how to use the solution, it mostly means they are familiar with CSS Custom Properties
- a way to have the debug info about edge cases in variables usage

As result, I created a `css-vars` Sass
mixin which you can find on Github: [https://github.com/malyw/css-vars](https://github.com/malyw/css-vars) <br>
with which you can start using CSS Custom Properties -ish syntax.

### Mixin usage

To declare variable(s), use the mixin as the following:

```scss
$white-color: #fff;
$base-font-size: 10px;

@include css-vars((
        --main-color: #000,
        --main-bg: $white-color,
        --main-font-size: 1.5*$base-font-size,
        --padding-top: calc(2vh + 20px)
));
```

To use these variables, use the `var()` function:

```scss
body {
  color: var(--main-color);
  background: var(--main-bg, #f00);
  font-size: var(--main-font-size);
  padding: var(--padding-top) 0 10px;
}
```
 
This gives you a way to control all the CSS output from one place (from Sass)
and start getting used to the syntax + you can reuse Sass variables/logic with the mixin.

When all the browsers you support work with CSS variables, everything you have to do is to add:

```scss
$css-vars-use-native: true;
```

And instead of aligning the variable properties in the result CSS, 
the mixin will start registering Custom Properties and the `var()` usages will
go to the result CSS without any transformations.
Which means you'll fully switch to CSS Custom Properties usage and have all the advantages we discussed.

If you want to turn on the useful debug info, add the following:

```scss
$css-vars-debug-log: true;
```

so you'll have:

* logs when a variable was not assigned but used
* logs when some variable is reassigned
* info when a variable is not defined, but there is a default value passed, which is used instead

# Conclusions

Now you know the CSS Custom Properties syntax, advantages,
good usage examples and how to interact with them from JavaScript.

You have learned how to detect if they are supported,
how they are different from the CSS Preprocessor variables
and options to start using the native CSS variables till they are supported cross-browser. 

So this is the perfect time to start using CSS Custom Properties
and preparing for their native support in the browsers.