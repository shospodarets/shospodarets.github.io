---
layout: post
title: CSS filters in action
tags: [JavaScript, CSS]
share_image: https://i.imgur.com/ppLN9Sv.jpg
share_description: CSS filters usage examples, how to use filter() in CSS
---

<h2>About CSS filters</h2>

The CSS <mark>filter</mark> property provides the way to modify rendering for elements in the browser.
You can use it to apply visual effects like blur or shifting colors.
There are many ways to use it- from providing Instagram/PhotoShop- like filters to the site themes.

<a href="https://blog.hospodarets.com/css-filters/"
   target="_blank"
   class="btn-pulse">
    <span class="wrapper">
        <span class="inner"></span>
    </span>
    <span class="text">Demo</span>
</a>

<div class="more"></div>

<h2>Syntax and examples</h2>

```css
/* SYNTAX */
.apply-filters {
    [vendor-prefix]filter: <filter-function> [<filter-function>]* | none
}

/* GRAYSCALE ALL IMAGES */
img {
    -webkit-filter: grayscale(100%);/* Webkit vendor */
    filter: grayscale(100%);
}

/* VINTAGE EFFECT FOR THE ENTIRE PAGE */
body {
    -webkit-filter: grayscale(0.1) saturate(1) sepia(0.6);/* Webkit vendor */
    filter: grayscale(0.1) saturate(1) sepia(0.6);
}
```

<mark>&lt;filter-function&gt;</mark> examples and small descriptions:

<ul>
    <li>

        Applies a Gaussian blur:
        ```css
        filter: blur(2px);
        ```

    </li>
    <li>

        Makes appearing more or less bright
        ```css
        filter: brightness(7);
        ```

    </li>
    <li>

        Adjusts the contrast:
        ```css
        filter: contrast(3);
        ```

    </li>
    <li>

        Converts the colors to grayscale:
        ```css
        filter: grayscale(0.6);
        ```

    </li>
    <li>

        Adds drop shadow effect:
        ```css
        filter: drop-shadow(20px 20px 10px black);
        ```

    </li>
    <li>

        Applies hue-rotation:
        ```css
        filter: hue-rotate(108deg);
        ```

    </li>
    <li>

        Inverts the colors:
        ```css
        filter: invert(0.5);
        ```

    </li>
    <li>

        Applies transparency:
        ```css
        filter: opacity(0.4);
        ```

    </li>
    <li>

        Saturates element:
        ```css
        filter: saturate(3);
        ```

    </li>
    <li>

        Converts the samples to sepia:
        ```css
        filter: sepia(0.2);
        ```

    </li>
    <li>

        For applying SVG filters:
        ```css
        filter: url(filter.svg#anchor-to-specific-element);
        ```

    </li>
</ul>

<h2>Examples of use</h2>

<h3>Provide site-theming</h3>
Some time ago I was working on the project with dark common theme.
One day we decided to implement light theme. Usually after such decision designers or web-developers starting provide alternative colors for each
element. It's very long and boring process.
When I started working on it- just got an idea about using CSS filters for that. It was amazing, because using only one line of css I added light theme!
Then it's appeared that possible to provide many themes using CSS filters only..

As example, let's provide dark theme using CSS filters to GitHub in your browser:

<ol>
    <li>

        Open <a target="_blank" href="https://github.com/">Github</a>

    </li>
    <li>

        Apply the following css to <mark>html</mark> element:

```css
html{
    -webkit-filter: brightness(0.9) hue-rotate(180deg) invert(1);
    filter: brightness(0.9) hue-rotate(180deg) invert(1);
}
```
    </li>
    <li>

        Enjoy the result:

        <div>
            <img src="https://i.imgur.com/2RFO8fL.gif?1" />
        </div>
    </li>
</ol>

Other example- applying inverted theme to my site <a href="https://hospodarets.com" target="_blank">hospodarets.com</a>:
<iframe
        src="https://blog.hospodarets.com/css-filters/?src=https://hospodarets.com&filters=%7B%22brightness%22:0.9,%22hue-rotate%22:180,%22invert%22:1%7D&hideContentExcept=.iframe-wrapper&overflowHeight=350"
        frameborder="0"
        allowtransparency="true" allowfullscreen="true"
        style="width: 100%; overflow: hidden;"
        scrolling="no"
        height="350"
        >
</iframe>
Looks scary, doesn't it? :scream:


<h3>Online/offline status</h3>
Other example of using CSS filters- to show user status- show color avatar when user is online and grayscale for offline.

<ol>
    <li>

        When user is offline just apply the grayscale filter to image:

```css
.offline .avatar{
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
}
```

    </li>
    <li>

        Codepen demo:

        <span data-height="270" data-theme-id="178" data-slug-hash="MYKmNE" data-user="malyw" data-default-tab="result" class="codepen"></span>
    </li>
</ol>

N.B.: It will not work when user photo is not color.

<h3>Instagram-like filters</h3>
Also CSS filters will be good to provide some effects like instagram- filters.

<ol>
    <li>
        Vintage:
        <iframe
                src="https://blog.hospodarets.com/css-filters/?src=https://blog.hospodarets.com/&filters=%7B%22grayscale%22:0.1,%22saturate%22:1,%22sepia%22:0.6%7D&overflowHeight=200&hideContentExcept=.demo-img,.applied-filter"
                frameborder="0"
                allowtransparency="true" allowfullscreen="true"
                style="width: 100%; overflow: hidden;"
                scrolling="no"
                height="200"
                >
        </iframe>
    </li>
    <li>
        Acid:
        <iframe
                src="https://blog.hospodarets.com/css-filters/?src=https://blog.hospodarets.com/&filters=%7B%22hue-rotate%22:72,%22saturate%22:3,%22sepia%22:0.2%7D&overflowHeight=200&hideContentExcept=.demo-img,.applied-filter"
                frameborder="0"
                allowtransparency="true" allowfullscreen="true"
                style="width: 100%; overflow: hidden;"
                scrolling="no"
                height="200"
                >
        </iframe>
    </li>
    <li>
        Grayscale:
        <iframe
                src="https://blog.hospodarets.com/css-filters/?src=https://blog.hospodarets.com/&filters=%7B%22grayscale%22:1%7D&overflowHeight=200&hideContentExcept=.demo-img,.applied-filter"
                frameborder="0"
                allowtransparency="true" allowfullscreen="true"
                style="width: 100%; overflow: hidden;"
                scrolling="no"
                height="200"
                >
        </iframe>
    </li>
    <li>
        Inverted colors:
        <iframe
                src="https://blog.hospodarets.com/css-filters/?src=https://blog.hospodarets.com/&filters=%7B%22brightness%22:0.9,%22hue-rotate%22:180,%22invert%22:1%7D&overflowHeight=200&hideContentExcept=.demo-img,.applied-filter"
                frameborder="0"
                allowtransparency="true" allowfullscreen="true"
                style="width: 100%; overflow: hidden;"
                scrolling="no"
                height="200"
                >
        </iframe>
    </li>
</ol>

<h3>Blur effects like in iOS>7 and OS X Yosemity</h3>

When modal window is open, background can be blurred- it will leave the users understanding where they were before openning.
And of course it just looks awesome :wink:

<ol>
    <li>

        Provide page content box and modal box on the same level in HTML:

```html
<div class="page-container"></div>
<div class="modal"></div>
```
    </li>
    <li>

        When open modal dialog just add the following styles for page container:

```css
.page-container{
    -webkit-filter: blur(2px);
    filter: blur(2px);
}
```
    </li>
    <li>
        Result:
        <iframe
                src="https://blog.hospodarets.com/css-filters/?src=https://blog.hospodarets.com/&filters=%7B%22blur%22:2%7D&modal=1&overflowHeight=200&hideContentExcept=.demo-img,.applied-filter"
                frameborder="0"
                allowtransparency="true" allowfullscreen="true"
                style="width: 100%; overflow: hidden;"
                scrolling="no"
                height="200"
                >
        </iframe>
    </li>
</ol>

<h2>Browser support</h2>
<ul>
    <li>
        Currently CSS filters work well on <b>Apple</b> devices (iOS/Safari > 6), <b>Android</b> (> 4.0) and <b>Chrome</b>.
    </li>
    <li>
        <b>Firefox</b> will support them from version 35.
    </li>
    <li>
        As always, nobody knows about CSS filters integration plans in <b>IE</b>.
    </li>
</ul>
<div class="caniuse" data-feature="css-filters"></div>