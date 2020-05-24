---
layout: post
title: CSS filters in action
tags: [JavaScript, CSS]
share_image: https://i.imgur.com/ppLN9Sv.jpg
share_description: CSS filters usage examples, how to use filter() in CSS
---

<h1>About CSS filters</h1>

The CSS `filter` property provides the way to modify rendering for elements in the browser.
You can use it to apply visual effects like blur or shifting colors.
There are many ways to use it- from providing Instagram/PhotoShop- like filters to the site themes.

<p>
    <a class="sh-btn" flavor="text-width"
       href="{{ site.baseurl }}/css-filters/"
       target="_blank">
        Demo
    </a>
</p>

<div class="more"></div>

<h1>Syntax and examples</h1>

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

`<filter-function>` examples and small descriptions:

- Applies a Gaussian blur:
```css
filter: blur(2px);
```

- Makes appearing more or less bright:
```css
filter: brightness(7);
```

- Adjusts the contrast:
```css
filter: contrast(3);
```

- Converts the colors to grayscale:
```css
filter: grayscale(0.6);
```

- Adds drop shadow effect:
```css
filter: drop-shadow(20px 20px 10px black);
```

- Applies hue-rotation:
```css
filter: hue-rotate(108deg);
```

- Inverts the colors:
```css
filter: invert(0.5);
```

- Applies transparency:
```css
filter: opacity(0.4);
```

- Saturates element:
```css
filter: saturate(3);
```

- Converts the samples to sepia:
```css
filter: sepia(0.2);
```

- For applying SVG filters:
```css
filter: url(filter.svg#anchor-to-specific-element);
```

<h1>Examples of use</h1>

<h2>Provide site-theming</h2>
Some time ago I was working on the project with dark common theme.
One day we decided to implement light theme. Usually after such decision designers or web-developers starting provide alternative colors for each
element. It's very long and boring process.
When I started working on it- just got an idea about using CSS filters for that. It was amazing, because using only one line of css I added light theme!
Then it's appeared that possible to provide many themes using CSS filters only..

As example, let's provide dark theme using CSS filters to GitHub in your browser:

- Open <a href="https://github.com/">Github</a>

- Apply the following css to `html` element:

```css
html{
    -webkit-filter: brightness(0.9) hue-rotate(180deg) invert(1);
    filter: brightness(0.9) hue-rotate(180deg) invert(1);
}
```

- Enjoy the result:

<div>
    <img src="https://i.imgur.com/2RFO8fL.gif?1" alt="" />
</div>


Other example- applying inverted theme to my site <a href="https://hospodarets.com">hospodarets.com</a>:

<iframe
        src="{{ site.full_base_url }}/css-filters/?src=https://hospodarets.com&filters=%7B%22brightness%22:0.9,%22hue-rotate%22:180,%22invert%22:1%7D&hideContentExcept=.iframe-wrapper&overflowHeight=350"
        frameborder="0"
        allowtransparency="true" allowfullscreen="true"
        style="width: 100%; overflow: hidden;"
        scrolling="no"
        height="350"
        >
</iframe>
Looks scary, doesn't it? 😱


<h2>Online/offline status</h2>
Other example of using CSS filters- to show user status- show color avatar when user is online and grayscale for offline.

- When user is offline just apply the grayscale filter to image:

```css
.offline .avatar{
    -webkit-filter: grayscale(1);
    filter: grayscale(1);
}
```

- Codepen demo:

<div>
    <span data-height="300" data-theme-id="178" data-slug-hash="MYKmNE" data-user="malyw" data-default-tab="result" class="codepen"></span>
</div>


N.B.: It will not work when user photo is not color.

<h2>Instagram-like filters</h2>
Also CSS filters will be good to provide some effects like instagram- filters.

<ol>
    <li>
        Vintage:
        <iframe
                src="{{ site.full_base_url }}/css-filters/?src={{ site.full_base_url }}/&filters=%7B%22grayscale%22:0.1,%22saturate%22:1,%22sepia%22:0.6%7D&overflowHeight=200&hideContentExcept=.demo-img,.applied-filter"
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
                src="{{ site.full_base_url }}/css-filters/?src={{ site.full_base_url }}/&filters=%7B%22hue-rotate%22:72,%22saturate%22:3,%22sepia%22:0.2%7D&overflowHeight=200&hideContentExcept=.demo-img,.applied-filter"
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
                src="{{ site.full_base_url }}/css-filters/?src={{ site.full_base_url }}/&filters=%7B%22grayscale%22:1%7D&overflowHeight=200&hideContentExcept=.demo-img,.applied-filter"
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
                src="{{ site.full_base_url }}/css-filters/?src={{ site.full_base_url }}/&filters=%7B%22brightness%22:0.9,%22hue-rotate%22:180,%22invert%22:1%7D&overflowHeight=200&hideContentExcept=.demo-img,.applied-filter"
                frameborder="0"
                allowtransparency="true" allowfullscreen="true"
                style="width: 100%; overflow: hidden;"
                scrolling="no"
                height="200"
                >
        </iframe>
    </li>
</ol>

<h2>Blur effects like in iOS>7 and OS X Yosemity</h2>

When modal window is open, background can be blurred- it will leave the users understanding where they were before openning.
And of course it just looks awesome :wink:

- Provide page content box and modal box on the same level in HTML:

```html
<div class="page-container"></div>
<div class="modal"></div>
```


- When open modal dialog just add the following styles for page container:

```css
.page-container{
    -webkit-filter: blur(2px);
    filter: blur(2px);
}
```


- Result:

<iframe
        src="{{ site.full_base_url }}/css-filters/?src={{ site.full_base_url }}/&filters=%7B%22blur%22:2%7D&modal=1&overflowHeight=200&hideContentExcept=.demo-img,.applied-filter"
        frameborder="0"
        allowtransparency="true" allowfullscreen="true"
        style="width: 100%; overflow: hidden;"
        scrolling="no"
        height="200"
        >
</iframe>



<h1>Browser support</h1>
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
