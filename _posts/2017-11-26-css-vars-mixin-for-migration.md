---
layout: post
title: "css-vars: Sass mixin to start using and migrate to Custom CSS Properties"
tags: [CSS, Sass]
share_image: https://static.hospodarets.com/img/blog/1482761911710817000.png
share_description: "css-vars: Sass mixin to start using and migrate to Custom CSS Properties"
---

Today CSS Custom Properties are [fully supported in all the major browsers](https://caniuse.com/#search=variables)
and start being more and more popular.<br>
I described how powerful they are and why makes sense to start using them
in the [It's Time To Start Using CSS Custom Properties](https://www.smashingmagazine.com/2017/04/start-using-css-custom-properties/) article.<br>
But for today many the projects use CSS preprocessors, and migration to Custom Properties may be quite paintfull.
I'll describe the solution I created and used for most of my projects, which simplified and made the migration staight-forward
(also helped to find the code problems).

<div class="more"></div>

## History of the [`css-vars` mixin](https://github.com/malyw/css-vars) creation

I started using CSS Custom Properties in most of my Projects and tried many strategies:

- switch from Sass to PostCSS with [cssnext](http://cssnext.io/)
- switch from Sass variables to pure CSS Custom Properties
- use CSS variables in Sass detecting if they are supported

As result having that experience I started looking for a solution which would satisfy my needs:

- is easy to start using with Sass
- straightforward to use and syntax is as much closer to native CSS Custom properties as possible
- it should be easy to switch to any Sass or CSS based variables usage
- if the team/member learned how to use the solution, it's mainly mean they are familiar with CSS custom properties
- a way to have the debug info about edge cases in variables usage

As result, I created a `css-vars` Sass
mixin which you can find on Github: [https://github.com/malyw/css-vars](https://github.com/malyw/css-vars)

## How to get

This mixin can be easily added to your project, e.g.:

```bash
npm install css-vars
```

Then just import the main file:

```scss
@import "node-modules/css-vars/css-vars";
```

and that's it, you can start using CSS Custom Properties -ish syntax.
"-ish" I use here to represent that it's actually very close to it,
but still Sass-based.

## Usage

To declare variable(s), use the mixin as the following `@include css-vars((map of variables))`:

```scss
@include css-vars((
--main-color: black,
--main-bg: #fff,
--main-font-size: 14px
));
```

To use these variables, use the `var()` function:

```scss
body{
color: var(--main-color);
background: var(--main-bg, #f00);
font-size: var(--main-font-size);
}
```

This syntax is very similar to the native CSS variables,
the only difference is that we use the mixin to wrap a map of variables.

Variables are declared at the global scope (`$css-vars` map for Sass, `:root` for native CSS).

## CSS output and triggering the native CSS Custom Properties usage

The above by default gives the following CSS:

```css
body {
color: black;
background: #fff;
font-size: 14px;
}
```

It means that by default you are continuing using Sass variables,
but the syntax looks like CSS Custom Properties.

It gives you a way to control all the CSS output from one place (from Sass)
and start getting used to the syntax + you can reuse Sass variables/logic with the mixin.

When all the browsers you support work with CSS variables, everything you have to do is to add in your code:

```scss
$css-vars-use-native: true;
```

So the above example will provide the native CSS Custom Properties output:

```css
:root {
--main-color: black;
--main-bg: #fff;
--main-font-size: 14px;
}

body {
color: var(--main-color);
background: var(--main-bg, #f00);
font-size: var(--main-font-size);
}
```

## Advantages of the mixin

Usage of the mixin gives the useful debug information:

* logs when a variable was not assigned but used
* logs when some variable is reassigned
* provides info when a variable is not defined, but there is a default value passed, which is used instead

This information is helpful in both cases for Sass and CSS variables.

None browsers so far provide such debug info for CSS custom properties.

To enable the mixin debug messages output during the Sass compilation, just add the following to your project:

```scss
$css-vars-debug-log: true;
```

# Example

I used this mixin to migrate this site from SCSS to native CSS variables (Custom Properties).

Here are the steps I applied:

1. I was using only SCSS variables.
2. I switched from the to use the `css-vars` mixin with the default non-native output
3. When I decided to not support the browsers which don't support native CSS Custom Properties, I simply added `$css-vars-use-native: true;`
and the mixin automatically switched all the variables to use native CSS Custom Props
4. Accidentally I realized I don't need `css-vars` anymore- so I just removed the mixin wrappers `@include css-vars((...))` leaving only the `...` part, which only contains the CSS variables, and now simply use the native CSS Custom Properties

Also, here is the source Sass using the mixin and the output example:

![alt](https://static.hospodarets.com/img/blog/1482761911710817000.png)

# Conclusions

Now you know the CSS Custom Properties syntax and advantages,
how to interact with them from JS and detect if they are supported.

Also, we have the [css-vars mixin](https://github.com/malyw/css-vars) to:

- continue using Sass but start learning and adoption of CSS Custom Properties syntax
- an easy way to switch to CSS variables with one line as only supported browsers for the project work with them
- easily debug edge cases when working with CSS Custom Properties "-ish" syntax (not defined / redefine variables, usage of default values)
- there are some [caveats](https://github.com/malyw/css-vars#caveats) and [limitations](https://github.com/malyw/css-vars#limitations-in-case-of-sass-variables)
which mostly are caused by the Sass nature
- as an example of usage you can check the [live site](https://blog.hospodarets.com/) in DevTools
and the [CSS code on Github](https://github.com/malyw/malyw.github.io/tree/master/_css)


So this is the perfect time to start using CSS Custom Properties syntax
and preparing for their native support in the browsers.