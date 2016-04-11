---
layout: post
title: CSS @apply rule (native CSS mixins) 
tags: [CSS, Sass]
share_image: http://i.imgur.com/o7pDpdQ.png
share_description: CSS @apply rule (native CSS mixins / custom sets of properties) 
---

In my previous article [CSS custom properties (variables) In-Depth]({{ site.baseurl }}/css_properties_in_depth/)
I described CSS custom properties (variables) and variations of their usages.

If you started thinking to move from CSS preprocessors to plain CSS after that-
next your question might be: "what about mixins"?

And voilà- there is not only an editor's draft- [https://tabatkins.github.io/specs/css-apply-rule/](https://tabatkins.github.io/specs/css-apply-rule/)

but even working implementation in Chrome- [https://www.chromestatus.com/feature/5753701012602880](https://www.chromestatus.com/feature/5753701012602880)

Before continuing reading, make sure you understand the terms of
[CSS custom properties]({{ site.baseurl }}/css_properties_in_depth/)
and [CSS mixins](https://css-tricks.com/custom-user-mixins/).

<div class="more"></div>

# Defining custom sets

As we know, you can [define anything as a custom properties value]({{ site.baseurl }}/css_properties_in_depth/#set).

Let's just define set of properties:

```scss
:root {
    --pink-theme: {
        color: #6A8759;
        background-color: #F64778;
    }
}
```

(for now even my CSS code highlighter goes crazy from such syntax so I use SCSS instead :unamused:)

It's still just a valid CSS custom property only one specific think-
it's a list of CSS properties wrapped in a `{}` block.

# Usage

To make a separation between [CSS custom properties usage]({{ site.baseurl }}/css_properties_in_depth#usage)
and mixins, was proposed to use a new [at-rule CSS statement](https://developer.mozilla.org/en/docs/Web/CSS/At-rule).

You are pretty familiar with many of them-
these are statements which begin with an `@`
followed directly by one of several available keywords that acts as the identifier for what CSS should do. 
 
Examples: `@charset`, `@import`, `@keyframes`, `@media` and [many others](https://css-tricks.com/the-at-rules-of-css/).

So meet a new CSS statement for CSS mixins: `@apply`.

Let's apply (sorry for a tautology :smile:) our list of rules:

```scss
body{
  @apply --pink-theme;
}
```

<span data-height="150" data-theme-id="178" data-slug-hash="yOXWdm" data-user="malyw" data-default-tab="result" class="codepen"></span>

That's how we easily created and used our first CSS mixin as it's really
very close to [the Sass mixins idea](http://sass-lang.com/guide#topic-6).

So general syntax is:

```scss
// DEFINING
:root {
    --custom-property-name: {
        prop-name: value;
        /*...*/
    }
}

// APPLYING
@apply custom-property-name;

```

# Mixins examples

Usually each project has a number of mixins used across the codebase.
Usually it's [clearfix](http://stackoverflow.com/questions/9543541/what-does-the-clearfix-class-do-in-css),
couple mixins to create CSS triangles and some others.

Let's try to recreate them in plain CSS without using any preprocessors.

## clearfix mixin

There are
[many](https://github.com/twbs/bootstrap/blob/master/less/mixins/clearfix.less),
[many](https://gist.github.com/mrinalwadhwa/2934863),
[many](https://gist.github.com/jelmerdemaat/3804403)
implementations of clearfix but let's just use the simple one:
 
```scss
// DEFINE
:root {
  --clearfix: {
    display: table;
    clear: both;
    content: '';
  };
}

// USE
.box:after{
  @apply --clearfix;
}
```

<span data-height="150" data-theme-id="178" data-slug-hash="grRNRQ" data-user="malyw" data-default-tab="result" class="codepen"></span>

As you might check without the clearfix the browser would just "collapse" the red background.

BTW an interesting bug in the current Chrome implementation: without `.box:after{content:'SOME';` before the mixin `content` rule from the mixin is not applied. 

## overflow-ellipsis mixin

When your UI requires being sure that text inside your block wouldn't go "away" of it-
one of the common solutions (depending on requirements) is usage of
[text-overflow](https://developer.mozilla.org/en/docs/Web/CSS/text-overflow) rule.

But `text-overflow: ellipsis;` doesn't work without `overflow: hidden;` and `white-space: nowrap;` -
what a nice candidate for a mixin!

```scss
// DEFINE
:root {
  --mixin-overflow-ellipsis: {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  };
}

// USE
.overflow-box{
  @apply --mixin-overflow-ellipsis;
}
```

<span data-height="150" data-theme-id="178" data-slug-hash="mVqPwz" data-user="malyw" data-default-tab="result" class="codepen"></span>

## CSS triangle mixin

There are plenty ways to create simple geometric figures using CSS
and one of the most popular technique is- [drawing triangles using CSS borders](http://www.sitepoint.com/sass-mixin-css-triangles/).

Let's create a simple mixin for it:

```scss
:root {
  --triangle-to-bottom: {
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 50px 50px 0 50px;
    border-color: #007bff transparent transparent transparent;
  };
}
```

As you see we can provide variables for size and color.
Other good idea might be to make a separate mixin for zero width/height and reuse it.

```scss
:root {
  --zero-size: {
    width: 0;
    height: 0;
  };
  
  --triangle-to-bottom-size: 50px;
  --triangle-to-bottom-color: #007bff;
  
  --triangle-to-bottom: {
    @apply --zero-size;
    border-style: solid;
    border-width: var(--triangle-to-bottom-size) var(--triangle-to-bottom-size) 0 var(--triangle-to-bottom-size);
    border-color: var(--triangle-to-bottom-color) transparent transparent transparent;
  };
}

.triangle-to-bottom {
  @apply --triangle-to-bottom;
}
```

<span data-height="150" data-theme-id="178" data-slug-hash="grRNZy" data-user="malyw" data-default-tab="result" class="codepen"></span>

# Passing variables to mixins

It's a useful practice to pass variables to mixins
depending on which applied rules may vary.

Unfortunately it cannot be done for `@apply` rule as if you define it on a global scope
(`:root`) it will always use variables only from that scope,
so you cannot pass your local values.

It's sad, but at least you can copy/paste your mixins to your "scopes"
using e.g. preprocessor and than your local CSS variables would work.

Currently there is a discussion regarding such cases.

# Browsers support and fallbacks

##  Browsers

1. `@apply` is supported in [Chrome Dev and Canary (desktop and mobile)](https://codereview.chromium.org/1645433002)
under the `chrome://flags/#enable-experimental-web-platform-features` flag ([issue](https://bugs.chromium.org/p/chromium/issues/detail?id=586974))
2. check a
[Chrome Platform Status issue](https://www.chromestatus.com/feature/5753701012602880)
to be up to date when wider support is added.

## Fallbacks

Looks like the only one way so far is usage of a PostCSS plugin:
[https://github.com/pascalduez/postcss-apply](https://github.com/pascalduez/postcss-apply)


It enables custom properties sets references.

As you can see "The plugin is in a very early state, some features are missing"
but it covers the simle cases.

Also authors of a popular [cssnext](https://github.com/MoOx/postcss-cssnext) plugin
are [welcoming a Pull Request](https://github.com/MoOx/postcss-cssnext/issues/203) to add such functionality.

# Test browser support

Here is a [copy-paste example](https://gist.github.com/malyw/477cd45bd0ed501a1c3ce0870ae16dd1)
of detecting `@apply` rule support in the browser:

```js
function testCSSApply() {
  const ID = 'id' + new Date().getTime();
  
  // include styles
  const styleEl = document.createElement('style');
  styleEl.innerHTML = `
  :root {
    --${ID}: {
      font-family: ${ID};
    }
  }
  #${ID}{
    @apply --${ID};
  }
  `;
  document.head.appendChild(styleEl);

  // include element
  const el = document.createElement('i');
  el.setAttribute('id', ID)
  document.documentElement.appendChild(el);

  // test
  const styles = getComputedStyle(el);
  const doesSupport = styles.fontFamily === ID;

  // cleaning
  document.head.removeChild(styleEl);
  document.documentElement.removeChild(el);

  return doesSupport;
}
```

Using of it is quite simple:

```js
if(testCSSApply()){
  document.documentElement.className += ' supported';
};
```

<span data-height="150" data-theme-id="178" data-slug-hash="yOoMRp" data-user="malyw" data-default-tab="result" class="codepen"></span>

# In the end

You can think "again, CSS becomes harder and harder":

![alt](https://i.imgur.com/a7sW8y2.gif)

But we all already got used for these conceprions from CSS preprocessors world
and, on the other hand, currently we have
CSS variables and mixins without any preprocessors!

Yep, syntax isn't the best, but remember your feeling starting working with a new preprocessor.

I prefer to think about that process the same as ES6 evolving and applying:

Instead of continuing using e.g. CoffeeScript, community just
started adding new features to JavaScript and now we have
~80-95% of its support in all major browsers.

So hopefully soon all that you can easily use in your projects.



